/* 키워드 연결망: 주제, 키워드, 논문을 잇는 그래프 (data.js의 topics, kw 값으로 그립니다) */
(function () {
  "use strict";

  var C = window.CLP, DATA = window.LAB_DATA;
  var box = document.getElementById("net");
  if (!C || !DATA || !box) return;

  var D3_URL = "assets/js/vendor/d3.min.js?v=7.9.0"; // d3 7.9.0 (ISC 라이선스)
  var COLOR = { topic: "#862633", kw: "#3b6ea8", paper: "#a3a3ab" };
  var TEXT = {
    ko: { topic: "주제", kw: "키워드", paper: "논문", papers: "논문 {n}편", show: "주요 연구성과에서 보기",
          help: "점에 마우스를 올리거나 누르면 내용이 보입니다.", zin: "확대", zout: "축소", label: "주제, 키워드, 논문의 연결망" },
    en: { topic: "Topic", kw: "Keyword", paper: "Paper", papers: "{n} papers", show: "Show in Publications",
          help: "Hover over or select a dot to see what it is.", zin: "Zoom in", zout: "Zoom out", label: "Network of topics, keywords and papers" }
  };
  function tx(k) { return TEXT[C.lang()][k]; }
  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  var canvas = document.getElementById("netCanvas");
  var info = document.getElementById("netInfo");
  var legend = document.getElementById("netLegend");
  var ctx = canvas.getContext("2d");
  var reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

  var nodes = [], links = [], adj = {}, sim, zoom, transform, width = 0, height = 0;
  var hovered = null, selected = null;

  /* Data -------------------------------------------------------------- */
  function build() {
    var byId = {};
    function node(id, kind, extra) {
      if (!byId[id]) { byId[id] = extra; extra.id = id; extra.kind = kind; extra.deg = 0; nodes.push(extra); adj[id] = {}; }
      return byId[id];
    }
    function link(a, b) {
      links.push({ source: a.id, target: b.id });
      a.deg++; b.deg++; adj[a.id][b.id] = 1; adj[b.id][a.id] = 1;
    }
    var topicById = {};
    C.TOPICS.forEach(function (t) { topicById[t.id] = t; });
    (DATA.publications || []).forEach(function (p, i) {
      var pn = node("p" + i, "paper", { p: p });
      C.topicsOf(p).forEach(function (t) { if (topicById[t]) link(pn, node("t:" + t, "topic", { t: topicById[t] })); });
      (p.kw || []).forEach(function (w) { link(pn, node("k:" + w, "kw", { w: w })); });
    });
    nodes.forEach(function (n) {
      n.r = n.kind === "topic" ? 8 + Math.sqrt(n.deg) * 1.9 : n.kind === "kw" ? 3.4 + Math.sqrt(n.deg) * 1.9 : 3.6;
    });
  }

  function label(n) {
    if (n.kind === "topic") return n.t[C.lang()] || n.t.ko;
    if (n.kind === "kw") return C.kwLabel(n.w);
    return C.pick(n.p.title);
  }

  /* Drawing ----------------------------------------------------------- */
  function size() {
    var w = box.clientWidth;
    if (!w) return false;
    width = w;
    height = Math.round(Math.max(380, Math.min(580, w * 0.72)));
    var dpr = window.devicePixelRatio || 1;
    canvas.width = Math.round(width * dpr); canvas.height = Math.round(height * dpr);
    canvas.style.width = width + "px"; canvas.style.height = height + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    return true;
  }

  function isNear(n) {
    var f = selected || hovered;
    return !f || n === f || adj[f.id][n.id];
  }

  function draw() {
    var k = transform.k, focus = selected || hovered;
    ctx.save();
    ctx.clearRect(0, 0, width, height);
    ctx.translate(transform.x, transform.y);
    ctx.scale(k, k);

    ctx.lineWidth = 0.8 / k;
    ctx.strokeStyle = focus ? "rgba(0,0,0,.04)" : "rgba(0,0,0,.12)";
    ctx.beginPath();
    links.forEach(function (l) {
      if (focus && (l.source === focus || l.target === focus)) return;
      ctx.moveTo(l.source.x, l.source.y); ctx.lineTo(l.target.x, l.target.y);
    });
    ctx.stroke();
    if (focus) {
      ctx.strokeStyle = "rgba(134,38,51,.55)"; ctx.lineWidth = 1.2 / k;
      ctx.beginPath();
      links.forEach(function (l) {
        if (l.source === focus || l.target === focus) { ctx.moveTo(l.source.x, l.source.y); ctx.lineTo(l.target.x, l.target.y); }
      });
      ctx.stroke();
    }

    // 논문 → 키워드 → 주제 순서로 그려 큰 점이 위에 오게 합니다
    ["paper", "kw", "topic"].forEach(function (kind) {
      nodes.forEach(function (n) {
        if (n.kind !== kind) return;
        ctx.globalAlpha = isNear(n) ? 1 : 0.18;
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, 2 * Math.PI);
        ctx.fillStyle = COLOR[kind];
        ctx.fill();
        if (n === focus || kind !== "paper") {
          ctx.lineWidth = (n === focus ? 2.5 : 1) / k;
          ctx.strokeStyle = n === focus ? "#222" : "#fff";
          ctx.stroke();
        }
      });
    });
    ctx.globalAlpha = 1;

    // 이름표: 주제 → 논문이 많은 키워드 순으로 그리고, 앞서 그린 이름표와 겹치면 건너뜁니다
    ctx.textAlign = "center"; ctx.textBaseline = "top"; ctx.lineJoin = "round";
    var cand = nodes.filter(function (n) {
      var near = focus && isNear(n);
      return n.kind === "topic" ? (!focus || near)
        : n.kind === "kw" ? (focus ? near : n.deg >= 4 || k >= 1.8)
        : n === focus;
    }).sort(function (a, b) {
      function rank(n) { return n === focus ? 1e6 : n.kind === "topic" ? 1e5 + n.deg : n.deg; }
      return rank(b) - rank(a);
    });
    var boxes = [];
    cand.forEach(function (n) {
      var fs = (n.kind === "topic" ? 13 : 12) / k;
      ctx.font = (n.kind === "topic" || n === focus ? "600 " : "400 ") + fs + 'px "IBM Plex Sans KR", sans-serif';
      var t = label(n);
      if (n.kind === "paper" && t.length > 28) t = t.slice(0, 27) + "…";
      var w = ctx.measureText(t).width, y = n.y + n.r + 3 / k;
      var b = [n.x - w / 2 - 2 / k, y - 1 / k, n.x + w / 2 + 2 / k, y + fs * 1.25];
      if (n !== focus && n.kind !== "topic" && boxes.some(function (o) { return b[0] < o[2] && b[2] > o[0] && b[1] < o[3] && b[3] > o[1]; })) return;
      boxes.push(b);
      ctx.lineWidth = 3 / k; ctx.strokeStyle = "rgba(255,255,255,.92)";
      ctx.strokeText(t, n.x, y);
      ctx.fillStyle = "#222";
      ctx.fillText(t, n.x, y);
    });
    ctx.restore();
  }

  /* Info panel -------------------------------------------------------- */
  function renderInfo() {
    var n = selected || hovered;
    if (!n) { info.innerHTML = '<p class="net-hint">' + esc(tx("help")) + "</p>"; return; }
    if (n.kind === "paper") {
      var p = n.p, t = esc(C.pick(p.title));
      if (p.link) t = '<a href="' + esc(p.link) + '" target="_blank" rel="noopener">' + t + "</a>";
      info.innerHTML = '<p class="net-kind">' + esc(tx("paper")) + ", " + p.year + '</p><p class="net-name">' + t +
        '</p><p class="net-meta">' + esc(p.authors) + "<br />" + esc(C.pick(p.venue)) + "</p>";
      return;
    }
    var count = n.deg; // 주제·키워드는 논문하고만 이어져 있어 연결 수가 곧 논문 수입니다
    info.innerHTML = '<p class="net-kind">' + esc(tx(n.kind)) + ", " + esc(tx("papers").replace("{n}", count)) +
      '</p><p class="net-name">' + esc(label(n)) + "</p>" +
      '<button type="button" class="text-button net-show">' + esc(tx("show")) + "</button>";
    info.querySelector(".net-show").addEventListener("click", function () { C.showPapers(label(n)); });
  }

  function renderLegend() {
    legend.innerHTML = ["topic", "kw", "paper"].map(function (k) {
      return '<span class="net-dot" style="background:' + COLOR[k] + '"></span>' + esc(tx(k));
    }).join("");
    canvas.setAttribute("aria-label", tx("label"));
    document.getElementById("netIn").setAttribute("aria-label", tx("zin"));
    document.getElementById("netOut").setAttribute("aria-label", tx("zout"));
  }

  /* Interaction ------------------------------------------------------- */
  function findAt(px, py) {
    var p = transform.invert([px, py]), best = null, bd = Infinity, pad = 4 / transform.k;
    nodes.forEach(function (n) {
      var dx = n.x - p[0], dy = n.y - p[1], d = Math.sqrt(dx * dx + dy * dy);
      if (d <= n.r + pad && d < bd) { best = n; bd = d; }
    });
    return best;
  }

  function fit(animate) {
    var x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
    nodes.forEach(function (n) { x0 = Math.min(x0, n.x); y0 = Math.min(y0, n.y); x1 = Math.max(x1, n.x); y1 = Math.max(y1, n.y); });
    var pad = 28, k = Math.min((width - pad * 2) / (x1 - x0), (height - pad * 2) / (y1 - y0), 2.5);
    var t = d3.zoomIdentity.translate(width / 2 - k * (x0 + x1) / 2, height / 2 - k * (y0 + y1) / 2).scale(k);
    var sel = d3.select(canvas);
    if (animate && !reduce) sel.transition().duration(400).call(zoom.transform, t);
    else sel.call(zoom.transform, t);
  }

  function init() {
    build();
    if (!nodes.length || !size()) { box.parentNode.querySelectorAll(".net, .net-foot").forEach(function (e) { e.hidden = true; }); return; }
    transform = d3.zoomIdentity;

    sim = d3.forceSimulation(nodes)
      .force("link", d3.forceLink(links).id(function (d) { return d.id; })
        .distance(function (l) { return l.target.kind === "topic" ? 95 : 36; })
        .strength(function (l) { return l.target.kind === "topic" ? 0.12 : 0.5; }))
      .force("charge", d3.forceManyBody().strength(function (d) { return d.kind === "topic" ? -650 : d.kind === "kw" ? -80 : -30; }))
      .force("collide", d3.forceCollide(function (d) { return d.kind === "topic" ? d.r + 14 : d.r + 2; }))
      .force("x", d3.forceX().strength(0.035))
      .force("y", d3.forceY().strength(0.045))
      .stop();
    for (var i = 0; i < (reduce ? 400 : 160); i++) sim.tick();

    zoom = d3.zoom().scaleExtent([0.3, 6])
      .filter(function (e) {
        if (e.type === "wheel") return e.ctrlKey || e.metaKey; // 그냥 스크롤하면 페이지가 내려가도록
        if (e.type === "touchstart") return e.touches.length > 1;
        return !e.button;
      })
      .on("zoom", function (e) { transform = e.transform; draw(); });

    var drag = d3.drag()
      .container(canvas)
      .subject(function (e) { return findAt(e.x, e.y) || undefined; })
      .on("start", function (e) {
        if (!e.active && !reduce) sim.alphaTarget(0.25).restart();
        e.subject.fx = e.subject.x; e.subject.fy = e.subject.y;
      })
      .on("drag", function (e) {
        var p = transform.invert([e.x, e.y]);
        e.subject.fx = p[0]; e.subject.fy = p[1];
        if (reduce) { e.subject.x = p[0]; e.subject.y = p[1]; draw(); }
      })
      .on("end", function (e) {
        if (!e.active && !reduce) sim.alphaTarget(0);
        e.subject.fx = null; e.subject.fy = null;
      });

    d3.select(canvas).call(drag).call(zoom).on("dblclick.zoom", null);
    canvas.style.touchAction = "pan-y pinch-zoom";

    canvas.addEventListener("pointermove", function (e) {
      if (e.pointerType === "touch") return;
      var r = canvas.getBoundingClientRect(), n = findAt(e.clientX - r.left, e.clientY - r.top);
      canvas.style.cursor = n ? "pointer" : "grab";
      if (n !== hovered) { hovered = n; if (!selected) renderInfo(); draw(); }
    });
    canvas.addEventListener("pointerleave", function () { if (hovered) { hovered = null; if (!selected) renderInfo(); draw(); } });
    canvas.addEventListener("click", function (e) {
      var r = canvas.getBoundingClientRect(), n = findAt(e.clientX - r.left, e.clientY - r.top);
      selected = n && n !== selected ? n : null;
      renderInfo(); draw();
    });

    document.getElementById("netIn").addEventListener("click", function () { d3.select(canvas).transition().duration(reduce ? 0 : 250).call(zoom.scaleBy, 1.4); });
    document.getElementById("netOut").addEventListener("click", function () { d3.select(canvas).transition().duration(reduce ? 0 : 250).call(zoom.scaleBy, 1 / 1.4); });
    document.getElementById("netFit").addEventListener("click", function () { fit(true); });

    if (reduce) { fit(false); draw(); }
    else {
      fit(false);
      var fitted = false;
      sim.on("tick", function () {
        draw();
        if (!fitted && sim.alpha() < 0.08) { fitted = true; fit(true); }
      }).alpha(0.5).restart();
    }

    if ("ResizeObserver" in window) {
      var last = width;
      new ResizeObserver(function () {
        if (box.clientWidth === last) return;
        last = box.clientWidth;
        if (size()) { fit(false); draw(); }
      }).observe(box);
    }
    document.addEventListener("clp:lang", function () { renderLegend(); renderInfo(); draw(); });
    renderLegend(); renderInfo();
  }

  /* d3는 연결망이 화면 근처에 왔을 때만 불러옵니다 */
  var started = false;
  function start() {
    if (started) return;
    started = true;
    if (window.d3) return init();
    var s = document.createElement("script");
    s.src = D3_URL;
    s.onload = init;
    s.onerror = function () { box.parentNode.querySelectorAll(".net, .net-foot").forEach(function (e) { e.hidden = true; }); };
    document.head.appendChild(s);
  }
  window.CLP.startGraph = start;
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (es) {
      if (es.some(function (e) { return e.isIntersecting; })) { io.disconnect(); start(); }
    }, { rootMargin: "400px 0px" });
    io.observe(box);
  } else start();
})();
