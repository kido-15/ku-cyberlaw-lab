(function () {
  "use strict";

  /* 연구 분야 (정보보호대학원 공식 연구실 소개 기준) */
  var RESEARCH = [
    { ko: ["사이버 안보와 국방", "국가 사이버 안보 체계와 사이버 국방에 관한 법제와 거버넌스"],
      en: ["Cyber security and defense", "Law and governance for national cyber security and cyber defense"] },
    { ko: ["정보보호와 사이버 보안", "보안 의무와 책임, 정보보호 관리체계, 침해사고 대응 법제"],
      en: ["Information security", "Security duties and liability, management systems, incident-response law"] },
    { ko: ["사이버 범죄와 테러", "사이버 공간의 악의적 행위에 대한 형사법적 대응과 국제 공조"],
      en: ["Cybercrime and cyberterrorism", "Criminal-law responses and international cooperation"] },
    { ko: ["전자정부", "디지털 행정의 법적 기반과 공공 서비스의 디지털 전환"],
      en: ["E-government", "Legal foundations of digital administration and public services"] },
    { ko: ["정보의 공개와 활용", "공공·민간 데이터의 공개, 유통, 활용을 위한 제도 설계"],
      en: ["Access to and use of information", "Rules for opening, sharing and using public and private data"] },
    { ko: ["개인정보와 프라이버시", "개인정보 보호법제, 정보주체의 권리, 데이터 경제와의 조화"],
      en: ["Personal data and privacy", "Data protection law, data-subject rights and the data economy"] },
    { ko: ["지식재산권", "디지털 환경에서 저작권과 특허 등 지식재산의 보호와 이용"],
      en: ["Intellectual property", "Protection and use of copyright, patents and other IP online"] },
    { ko: ["신기술·신산업의 진흥과 규제", "빅데이터, 사물인터넷, 인공지능과 로봇, 블록체인 등 신기술에 관한 법정책"],
      en: ["Emerging technology", "Law and policy for big data, IoT, AI and robotics, and blockchain"] }
  ];

  /* 연구 동향: 주제 코드 (data.js의 topics 값과 맞춤) */
  var TOPICS = [
    { id: "privacy",    ko: "개인정보와 프라이버시",     en: "Personal data and privacy" },
    { id: "security",   ko: "정보보호와 사이버보안",     en: "Information security" },
    { id: "crime",      ko: "사이버 범죄와 디지털 수사", en: "Cybercrime and digital investigation" },
    { id: "ai",         ko: "인공지능과 신기술",         en: "AI and emerging technology" },
    { id: "defense",    ko: "사이버 안보와 국방",        en: "Cyber security and defense" },
    { id: "internet",   ko: "인터넷과 플랫폼 규제",      en: "Internet and platform regulation" },
    { id: "blockchain", ko: "블록체인과 가상자산",       en: "Blockchain and virtual assets" },
    { id: "data",       ko: "데이터와 공공정보",         en: "Data and public information" },
    { id: "egov",       ko: "전자정부와 디지털 행정",    en: "E-government" },
    { id: "industry",   ko: "산업과 소비자 규제",        en: "Industry and consumer regulation" },
    { id: "other",      ko: "기타",                      en: "Other" }
  ];
  // 주제가 붙지 않은 논문은 '기타'로 셉니다 (표의 합계가 전체 논문 수와 맞도록)
  function topicsOf(p) { return p.topics && p.topics.length ? p.topics : ["other"]; }
  var PERIODS = [[2004, 2010], [2011, 2015], [2016, 2020], [2021, 2026]];

  /* 키워드 영문 표기 (없으면 한국어 그대로 표시) */
  var KW_EN = {
    "디지털 증거": "digital evidence", "압수수색": "search and seizure", "개인정보보호": "data protection",
    "손해배상": "damages", "개인정보보호법": "Personal Information Protection Act", "가상자산": "virtual assets",
    "클라우드": "cloud", "비교법": "comparative law", "블록체인": "blockchain", "가명정보": "pseudonymised data",
    "인공지능": "AI", "토픽모델링": "topic modeling", "해킹": "hacking", "금융보안": "financial security",
    "사이버안보": "national cyber security", "참여권": "right to participate", "인공지능 윤리": "AI ethics",
    "개인정보 유출": "data breaches", "인터넷 규제": "internet regulation", "전자정부": "e-government",
    "행정정보 공유": "administrative information sharing", "표현의 자유": "freedom of expression",
    "공공데이터": "public data", "비식별화": "de-identification", "인공지능 규제": "AI regulation",
    "AI 거버넌스": "AI governance", "AI 에이전트": "AI agents", "과징금": "administrative fines",
    "디지털 포렌식": "digital forensics", "사이버범죄": "cybercrime", "국제공조": "international cooperation"
  };

  /* 영어 문구 (한국어 원문은 index.html에 있습니다) */
  var EN = {
    "skip": "Skip to content",
    "brand.affil": "Graduate School of Information Security, Korea University",
    "brand.name": "Cyber Law and Policy Lab",
    "nav.about": "About",
    "nav.research": "Research",
    "nav.professor": "Professor",
    "nav.members": "Members",
    "nav.trends": "Trends",
    "nav.publications": "Publications",
    "nav.contact": "Contact",
    "intro.affil": "Graduate School of Information Security, Korea University",
    "intro.title": "Cyber Law and Policy Lab",
    "intro.lead": "We study law and policy in cyberspace, with a focus on information security, personal data and cyber security, where changing technology keeps raising new legal questions.",
    "about.title": "About",
    "about.p1": "As the line between cyberspace and physical space blurs, malicious acts online now cause real physical, financial and psychological harm.",
    "about.p2": "Law keeps the state and society stable by setting out the rights, duties and responsibilities of everyone who acts in cyberspace. Laying the policy groundwork that lets society take up fast-moving technologies such as big data, the Internet of Things, AI and robotics, and blockchain is also a job for law.",
    "about.p3": "Our work covers cyber security and information security, personal data, cybercrime, e-government, data use, intellectual property, and the regulation of AI and other new technologies. We do joint research with government, public institutions, companies and research institutes, and members present and discuss their work at regular workshops.",
    "research.title": "Research areas",
    "prof.title": "Professor",
    "prof.name": "Hun Yeong Kwon",
    "prof.topics": "Main research topics",
    "prof.role": "Professor, Graduate School of Information Security, Korea University<br />Head of the Department of Personal Information Protection",
    "members.title": "Members",
    "trends.title": "Research trends",
    "trends.heat": "Papers by topic",
    "trends.net": "Keyword network",
    "trends.netHelp": "Topics, keywords and papers joined by lines. Drag a dot or zoom in; select a topic or keyword to see its papers.",
    "trends.netFit": "Fit",
    "trends.kw": "Frequent keywords",
    "trends.kwHelp": "Select a keyword to see those papers under Publications below.",
    "pubs.title": "Publications",
    "pubs.note": "Papers for which Prof. Kwon is the corresponding author, and theses he supervised at Korea University.",
    "video.title": "Video",
    "video.caption": "Lab introduction video (2021)",
    "video.link": "watch on YouTube",
    "contact.title": "Contact",
    "contact.addr": "Address",
    "contact.addrVal": "Room 203A, Future Convergence Technology Building<br />Korea University, 145 Anam-ro, Seongbuk-gu, Seoul 02841",
    "contact.tel": "Phone",
    "contact.map": "Map",
    "contact.naver": "Naver Map",
    "footer.name": "Cyber Law and Policy Lab, Graduate School of Information Security, Korea University",
    "footer.contact": "Website edits and inquiries:",
    "footer.gsis": "Graduate School of Information Security",
    "footer.ku": "Korea University"
  };

  var UI = {
    ko: {
      all: "전체", journal: "학술지", conference: "국제학술대회", phd: "박사학위논문", ms: "석사학위논문",
      more: "{n}건 더 보기", noMatch: "검색 결과가 없습니다. 다른 단어로 검색해 보세요.",
      empty: "등록된 항목이 없습니다.", membersEmpty: "구성원 명단을 준비하고 있습니다.",
      coadvisor: "공동지도", search: "제목, 저자, 학술지, 연도로 검색",
      play: "소개영상 재생", menuOpen: "메뉴 열기", menuClose: "메뉴 닫기", toggle: "English",
      topic: "주제", total: "합계", papers: "논문 수", unit: "편", scale: "논문 수",
      group: { researcher: "연구원", phd: "박사과정", ms: "석사과정", alumni: "졸업생" },
      title: "사이버법정책연구실 | 고려대학교 정보보호대학원"
    },
    en: {
      all: "All", journal: "Journals", conference: "Conferences", phd: "Ph.D.", ms: "M.S.",
      more: "Show {n} more", noMatch: "Nothing matches that search. Try another word.",
      empty: "Nothing listed yet.", membersEmpty: "The member list is being prepared.",
      coadvisor: "Co-advised", search: "Search titles, authors, journals or years",
      play: "Play the introduction video", menuOpen: "Open menu", menuClose: "Close menu", toggle: "한국어",
      topic: "Topic", total: "Total", papers: "Papers", unit: "", scale: "Papers",
      group: { researcher: "Researchers", phd: "Ph.D. students", ms: "M.S. students", alumni: "Alumni" },
      title: "Cyber Law and Policy Lab | Korea University"
    }
  };

  var DATA = window.LAB_DATA || { members: [], publications: [] };
  var TYPES = ["journal", "conference", "phd", "ms"];
  var PAGE = 20;
  var lang = "ko";
  var filter = "all";
  var query = "";
  var limit = PAGE;
  var original = {};

  function ui(k) { return UI[lang][k]; }
  function pick(v) { return v == null ? "" : typeof v === "string" ? v : (v[lang] || v.ko || ""); }
  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  var $ = function (id) { return document.getElementById(id); };

  /* Research ------------------------------------------------------------ */
  function renderResearch() {
    $("researchList").innerHTML = RESEARCH.map(function (r) {
      return "<div><dt>" + esc(r[lang][0]) + "</dt><dd>" + esc(r[lang][1]) + "</dd></div>";
    }).join("");
  }

  /* Members ------------------------------------------------------------- */
  function renderMembers() {
    var list = DATA.members || [];
    // 명단이 비어 있으면 섹션과 메뉴 항목을 숨깁니다 (data.js에 추가하면 자동으로 나타남)
    $("members").hidden = !list.length;
    var link = document.querySelector('.nav a[href="#members"]');
    if (link) link.hidden = !list.length;
    if (!list.length) return;
    $("membersList").innerHTML = ["researcher", "phd", "ms", "alumni"].map(function (g) {
      var group = list.filter(function (m) { return m.group === g; });
      if (!group.length) return "";
      return '<div class="member-group"><h3>' + esc(ui("group")[g]) + '</h3><ul class="member-list">' +
        group.map(function (m) {
          return "<li>" + esc(pick(m.name)) +
            (m.topic ? "<span>" + esc(pick(m.topic)) + "</span>" : "") +
            (m.email ? '<span><a href="mailto:' + esc(m.email) + '">' + esc(m.email) + "</a></span>" : "") +
            "</li>";
        }).join("") + "</ul></div>";
    }).join("");
  }

  /* Professor: 많이 연구한 주제 (data.js에서 계산) ----------------------- */
  function renderProf() {
    var all = DATA.publications || [];
    var tc = {};
    all.forEach(function (p) { (p.topics || []).forEach(function (t) { tc[t] = (tc[t] || 0) + 1; }); });
    $("profTopics").innerHTML = TOPICS.filter(function (t) { return tc[t.id] && t.id !== "other"; })
      .sort(function (a, b) { return tc[b.id] - tc[a.id]; }).slice(0, 5)
      .map(function (t) {
        return '<button type="button" class="kw" data-topic="' + t.id + '">' + esc(t[lang] || t.ko) +
          '<span class="count">' + tc[t.id] + "</span></button>";
      }).join("");
  }

  /* Research trends ----------------------------------------------------- */
  function kwLabel(w) { return lang === "en" && KW_EN[w] ? KW_EN[w] : w; }
  function kwButton(w, n) {
    return '<button type="button" class="kw" data-kw="' + esc(w) + '">' + esc(kwLabel(w)) +
      (n ? '<span class="count">' + n + "</span>" : "") + "</button>";
  }
  function heatLevel(n) { return n === 0 ? 0 : n <= 2 ? 1 : n <= 5 ? 2 : n <= 9 ? 3 : 4; }

  function renderTrends() {
    var pubs = DATA.publications || [];
    $("trends").hidden = !pubs.length;
    var link = document.querySelector('.nav a[href="#trends"]');
    if (link) link.hidden = !pubs.length;
    if (!pubs.length) return;

    var pname = PERIODS.map(function (r) { return r[0] + "–" + r[1]; });
    function per(y) { for (var i = 0; i < PERIODS.length; i++) if (y <= PERIODS[i][1]) return i; return PERIODS.length - 1; }

    var rows = TOPICS.map(function (t) {
      var c = PERIODS.map(function () { return 0; });
      pubs.forEach(function (p) { if (topicsOf(p).indexOf(t.id) !== -1) c[per(p.year)]++; });
      return { t: t, c: c, sum: c.reduce(function (a, b) { return a + b; }, 0) };
    }).filter(function (r) { return r.sum; }).sort(function (a, b) {
      return (a.t.id === "other") - (b.t.id === "other") || b.sum - a.sum;
    });
    var totals = PERIODS.map(function () { return 0; });
    pubs.forEach(function (p) { totals[per(p.year)]++; });

    var unit = ui("unit");
    var h = '<table class="heat"><thead><tr><th scope="col">' + esc(ui("topic")) + "</th>" +
      pname.map(function (n) { return '<th scope="col">' + n.replace("–", "–<wbr>") + "</th>"; }).join("") +
      '<th scope="col" class="heat-sum">' + esc(ui("total")) + "</th></tr></thead><tbody>";
    rows.forEach(function (r) {
      var name = r.t[lang] || r.t.ko;
      h += '<tr><th scope="row">' + esc(name) + "</th>" + r.c.map(function (n, i) {
        return '<td class="h' + heatLevel(n) + '" title="' + esc(name + ", " + pname[i] + ": " + n + unit) + '">' + (n || "–") + "</td>";
      }).join("") + '<td class="heat-sum">' + r.sum + "</td></tr>";
    });
    h += '</tbody><tfoot><tr><th scope="row">' + esc(ui("papers")) + "</th>" +
      totals.map(function (n) { return "<td>" + n + "</td>"; }).join("") +
      '<td class="heat-sum">' + pubs.length + "</td></tr></tfoot></table>";
    $("heatWrap").innerHTML = h;

    var kc = {};
    pubs.forEach(function (p) { (p.kw || []).forEach(function (w) { kc[w] = (kc[w] || 0) + 1; }); });
    var top = Object.keys(kc).sort(function (a, b) { return kc[b] - kc[a] || a.localeCompare(b, "ko"); }).slice(0, 20);
    $("kwList").innerHTML = top.map(function (w) { return kwButton(w, kc[w]); }).join("");
  }

  // 키워드·주제 이름으로 주요 연구성과 목록을 거르고 그 위치로 이동합니다
  function showPapers(label) {
    $("pubSearch").value = label;
    query = label; filter = "all"; limit = PAGE;
    renderPubs();
    $("publications").scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
  }
  document.addEventListener("click", function (e) {
    var b = e.target.closest("[data-kw]");
    if (b) return showPapers(kwLabel(b.getAttribute("data-kw")));
    b = e.target.closest("[data-topic]");
    if (b) {
      var t = TOPICS.filter(function (x) { return x.id === b.getAttribute("data-topic"); })[0];
      if (t) showPapers(t[lang] || t.ko);
      return;
    }
  });

  // 연결망 그래프(graph.js)에서 쓰는 값
  window.CLP = {
    TOPICS: TOPICS, KW_EN: KW_EN, topicsOf: topicsOf,
    lang: function () { return lang; },
    kwLabel: function (w) { return kwLabel(w); },
    pick: function (v) { return pick(v); },
    showPapers: showPapers
  };

  /* Publications -------------------------------------------------------- */
  function haystack(p) {
    var t = typeof p.title === "string" ? p.title : p.title.ko + " " + (p.title.en || "");
    var v = typeof p.venue === "string" ? p.venue : p.venue.ko + " " + p.venue.en;
    var k = (p.kw || []).map(function (w) { return w + " " + (KW_EN[w] || ""); }).join(" ");
    return (t + " " + p.authors + " " + v + " " + p.year + " " + k).toLowerCase();
  }

  function renderPubs() {
    var all = DATA.publications || [];
    if (!all.length) {
      $("pubTools").hidden = true; $("pubMore").hidden = true;
      $("pubList").innerHTML = '<p class="empty">' + esc(ui("empty")) + "</p>";
      return;
    }

    var counts = { all: all.length };
    TYPES.forEach(function (t) { counts[t] = all.filter(function (p) { return p.type === t; }).length; });
    $("pubFilters").innerHTML = ["all"].concat(TYPES).filter(function (t) { return counts[t]; }).map(function (t) {
      return '<button type="button" role="tab" data-filter="' + t + '" aria-selected="' + (t === filter) + '">' +
        esc(ui(t)) + '<span class="count">' + counts[t] + "</span></button>";
    }).join("");

    var q = query.trim().toLowerCase();
    // 검색어가 키워드 이름과 정확히 같으면 그 키워드가 붙은 논문만 보여 줍니다
    var topicHit = null;
    TOPICS.forEach(function (t) { if (t.ko.toLowerCase() === q || t.en.toLowerCase() === q) topicHit = t.id; });
    var kwHit = null;
    all.some(function (p) {
      return (p.kw || []).some(function (w) {
        if (w.toLowerCase() === q || (KW_EN[w] || "").toLowerCase() === q) { kwHit = w; return true; }
        return false;
      });
    });
    var shown = all.filter(function (p) {
      if (filter !== "all" && p.type !== filter) return false;
      if (!q) return true;
      if (topicHit) return topicsOf(p).indexOf(topicHit) !== -1;
      if (kwHit) return (p.kw || []).indexOf(kwHit) !== -1;
      return haystack(p).indexOf(q) !== -1;
    });
    if (!shown.length) {
      $("pubList").innerHTML = '<p class="empty" style="padding-top:20px">' + esc(ui("noMatch")) + "</p>";
      $("pubMore").hidden = true;
      return;
    }

    var groups = [], cur = null;
    shown.slice(0, limit).forEach(function (p) {
      if (!cur || cur.year !== p.year) { cur = { year: p.year, items: [] }; groups.push(cur); }
      cur.items.push(p);
    });

    $("pubList").innerHTML = groups.map(function (g) {
      return '<section class="pub-year"><h3>' + g.year + "</h3><ol>" + g.items.map(function (p) {
        var title = esc(pick(p.title));
        if (p.link) title = '<a href="' + esc(p.link) + '" target="_blank" rel="noopener">' + title + "</a>";
        var meta = esc(p.authors) + "<br />" + esc(pick(p.venue));
        if (p.advisor) meta += " (" + esc(ui("coadvisor")) + ": " + esc(p.advisor) + ")";
        return '<li><p class="pub-title">' + title + '</p><p class="pub-meta">' + meta + "</p></li>";
      }).join("") + "</ol></section>";
    }).join("");

    var rest = shown.length - limit;
    $("pubMore").hidden = rest <= 0;
    if (rest > 0) $("pubMore").textContent = ui("more").replace("{n}", Math.min(rest, PAGE * 2));
  }

  document.addEventListener("click", function (e) {
    var b = e.target.closest("[data-filter]");
    if (!b) return;
    filter = b.getAttribute("data-filter");
    limit = PAGE;
    renderPubs();
  });
  $("pubMore").addEventListener("click", function () { limit += PAGE * 2; renderPubs(); });
  var timer;
  $("pubSearch").addEventListener("input", function (e) {
    clearTimeout(timer);
    var v = e.target.value;
    timer = setTimeout(function () { query = v; limit = PAGE; renderPubs(); }, 120);
  });

  /* Language ------------------------------------------------------------ */
  function applyLang(next) {
    lang = next;
    document.documentElement.lang = lang;
    document.querySelectorAll("[data-i18n]").forEach(function (el) {
      var k = el.getAttribute("data-i18n");
      if (!(k in original)) original[k] = el.innerHTML;
      el.innerHTML = lang === "en" && EN[k] != null ? EN[k] : original[k];
    });
    var tg = $("langToggle");
    tg.textContent = ui("toggle");
    tg.lang = lang === "ko" ? "en" : "ko";
    $("ytFacade").setAttribute("aria-label", ui("play"));
    $("pubSearch").placeholder = ui("search");
    $("pubSearch").setAttribute("aria-label", ui("search"));
    $("menuToggle").setAttribute("aria-label", ui(nav.classList.contains("open") ? "menuClose" : "menuOpen"));
    document.title = ui("title");
    renderResearch();
    renderMembers();
    renderProf();
    renderTrends();
    renderPubs();
    try { localStorage.setItem("clp-lang", lang); } catch (_) {}
    document.dispatchEvent(new CustomEvent("clp:lang"));
  }
  $("langToggle").addEventListener("click", function () { applyLang(lang === "ko" ? "en" : "ko"); });

  /* Mobile menu --------------------------------------------------------- */
  var nav = $("nav"), menuBtn = $("menuToggle");
  function setMenu(open) {
    nav.classList.toggle("open", open);
    menuBtn.setAttribute("aria-expanded", String(open));
    menuBtn.setAttribute("aria-label", ui(open ? "menuClose" : "menuOpen"));
  }
  menuBtn.addEventListener("click", function () { setMenu(!nav.classList.contains("open")); });
  nav.addEventListener("click", function (e) { if (e.target.tagName === "A") setMenu(false); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") setMenu(false); });

  /* Current section in nav ---------------------------------------------- */
  if ("IntersectionObserver" in window) {
    var links = {};
    nav.querySelectorAll("a").forEach(function (a) { links[a.getAttribute("href").slice(1)] = a; });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        Object.keys(links).forEach(function (k) { links[k].classList.toggle("active", k === en.target.id); });
      });
    }, { rootMargin: "-40% 0px -55% 0px" });
    document.querySelectorAll("main section[id]").forEach(function (s) { io.observe(s); });
  }

  /* YouTube: load the player only when asked ----------------------------- */
  var facade = $("ytFacade");
  facade.addEventListener("click", function () {
    var f = document.createElement("iframe");
    f.src = "https://www.youtube-nocookie.com/embed/" + facade.getAttribute("data-video-id") + "?autoplay=1&rel=0";
    f.title = facade.getAttribute("aria-label");
    f.allow = "autoplay; encrypted-media; picture-in-picture";
    f.allowFullscreen = true;
    facade.replaceWith(f);
  });

  /* Init ---------------------------------------------------------------- */
  $("year").textContent = new Date().getFullYear();
  var saved = null;
  try { saved = localStorage.getItem("clp-lang"); } catch (_) {}
  applyLang(saved === "en" ? "en" : "ko");
})();
