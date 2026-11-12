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

  /* 영어 문구 (한국어 원문은 index.html에 있습니다) */
  var EN = {
    "skip": "Skip to content",
    "brand.name": "Cyber Law and Policy Lab",
    "nav.about": "About",
    "nav.research": "Research",
    "nav.professor": "Professor",
    "nav.members": "Members",
    "nav.publications": "Publications",
    "nav.contact": "Contact",
    "intro.affil": "Graduate School of Information Security, Korea University",
    "intro.title": "Cyber Law and Policy Lab",
    "intro.lead": "We study the law and policy that govern cyberspace, and help draft and amend legislation so that research reaches actual policy.",
    "about.title": "About",
    "about.p1": "As the line between cyberspace and physical space blurs, malicious acts online now cause real physical, financial and psychological harm.",
    "about.p2": "Law keeps the state and society stable by setting out the rights, duties and responsibilities of everyone who acts in cyberspace. Laying the policy groundwork that lets society take up fast-moving technologies such as big data, the Internet of Things, AI and robotics, and blockchain is also a job for law.",
    "about.p3": "The lab belongs to the Center for Cyber Security Policy. It runs joint research with government, public institutions, companies and policy institutes, and holds regular seminars for its members.",
    "research.title": "Research areas",
    "prof.title": "Professor",
    "prof.name": "Hun Yeong Kwon",
    "prof.role": "Professor, Graduate School of Information Security, Korea University<br />Head of the Department of Personal Information Protection",
    "prof.fields": "Fields",
    "prof.fieldsVal": "Information security law, ICT law, personal data protection, cyber security policy",
    "prof.mail": "Email",
    "prof.office": "Office",
    "prof.officeVal": "Room 304, Jung Woon-Oh IT Hall",
    "prof.tel": "Phone",
    "members.title": "Members",
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
      group: { researcher: "연구원", phd: "박사과정", ms: "석사과정", alumni: "졸업생" },
      title: "사이버법정책연구실 | 고려대학교 정보보호대학원"
    },
    en: {
      all: "All", journal: "Journals", conference: "Conferences", phd: "Ph.D.", ms: "M.S.",
      more: "Show {n} more", noMatch: "Nothing matches that search. Try another word.",
      empty: "Nothing listed yet.", membersEmpty: "The member list is being prepared.",
      coadvisor: "Co-advised", search: "Search titles, authors, journals or years",
      play: "Play the introduction video", menuOpen: "Open menu", menuClose: "Close menu", toggle: "한국어",
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

  /* Publications -------------------------------------------------------- */
  function haystack(p) {
    var t = typeof p.title === "string" ? p.title : p.title.ko + " " + (p.title.en || "");
    var v = typeof p.venue === "string" ? p.venue : p.venue.ko + " " + p.venue.en;
    return (t + " " + p.authors + " " + v + " " + p.year).toLowerCase();
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
    var shown = all.filter(function (p) {
      return (filter === "all" || p.type === filter) && (!q || haystack(p).indexOf(q) !== -1);
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
    renderPubs();
    try { localStorage.setItem("clp-lang", lang); } catch (_) {}
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
