/* ============================================================
   PROJECT DETAIL PAGE
   ------------------------------------------------------------
   Reads ?id= from the URL, looks the record up in PROJECTS
   (projects-data.js) and fills the static shell in project.html.
   Falls back to project 1 if the id is missing or unknown.
   ============================================================ */
(function () {
  'use strict';

  var params  = new URLSearchParams(window.location.search);
  var id      = parseInt(params.get('id'), 10);
  var dataAr  = (typeof PROJECTS !== 'undefined' && PROJECTS[id]) ? PROJECTS[id] : (PROJECTS && PROJECTS[1]);

  // An unknown/missing id falls back to project 1 — the canonical URL and
  // structured data must name the project actually being shown.
  if (!(typeof PROJECTS !== 'undefined' && PROJECTS[id])) { id = 1; }

  if (!dataAr) return;   // no data file loaded — leave the shell as-is

  var byId = function (id) { return document.getElementById(id); };

  var getLang = function () {
    return (window.UC_I18N && window.UC_I18N.getLang) ? window.UC_I18N.getLang() : 'ar';
  };

  var getData = function () {
    var lang = getLang();
    if (lang === 'en' && window.PROJECTS_EN && window.PROJECTS_EN[id]) {
      // English record only carries the translated fields; media paths
      // (hero/photos/finalPhoto) always come from the Arabic record.
      var enOverrides = window.PROJECTS_EN[id];
      var merged = {};
      for (var k in dataAr) { merged[k] = dataAr[k]; }
      for (var k2 in enOverrides) { merged[k2] = enOverrides[k2]; }
      return merged;
    }
    return dataAr;
  };

  var pageTitleSuffix = function () {
    return getLang() === 'en' ? ' | United Construction' : ' | المتحدة للإنشاءات والمقاولات';
  };


  /* ==========================================================
     JOURNEY PHASES
     ----------------------------------------------------------
     The gallery photos are split into three even thirds: restore
     → build → result. The final tab always closes on the hero
     shot, since that is the finished building.
     ========================================================== */
  var folder = 'assets/p' + id + '/';

  var phaseDefsAr = [
    { title: 'مرحلة الترميم', copy: 'أعمال الترميم شملت دعيم الهيكل الإنشائي، معالجة الواجهات وترميم العناصر المعمارية للحفاظ على الطابع الأصيل للمبنى.' },
    { title: 'مرحلة البناء',   copy: 'تنفيذ الأعمال الإنشائية والتشطيبات الداخلية والخارجية وفق أعلى معايير الجودة والسلامة.' },
    { title: 'النتيجة النهائية', copy: 'تم إنجاز المشروع بأعلى جودة ليعود المبنى بشكله الأصيل كمعلم تاريخي مميز.' }
  ];

  var getPhaseDefs = function () {
    return (getLang() === 'en' && window.JOURNEY_PHASES_EN) ? window.JOURNEY_PHASES_EN : phaseDefsAr;
  };

  var prevLabel = function () { return getLang() === 'en' ? 'Previous photos' : 'الصور السابقة'; };
  var nextLabel = function () { return getLang() === 'en' ? 'Next photos'     : 'الصور التالية'; };

  var tabs   = document.querySelectorAll('.jt-tab');
  var wrap   = byId('journeyPhases');
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function renderJourney() {
    var data   = getData();
    var photos = data.photos || [];
    var third  = Math.ceil(photos.length / 3);
    var phaseDefs = getPhaseDefs();

    var slices = [
      photos.slice(0, third),
      photos.slice(third, third * 2),
      photos.slice(third * 2)
    ];
    // the closing shot is always the finished building
    var finalPhoto = dataAr.finalPhoto || dataAr.hero.replace(folder, '');
    if (slices[2].indexOf(finalPhoto) === -1) slices[2].push(finalPhoto);

    // preserve which tab was active across a re-render
    var activeTab = document.querySelector('.jt-tab.is-active');
    var activeIdx = activeTab ? activeTab.getAttribute('data-phase') : '0';

    var html = '';
    phaseDefs.forEach(function (phase, i) {
      var imgs = slices[i];
      if (!imgs.length) return;

      html += '<div class="journey-phase' + (String(i) === activeIdx ? ' is-active' : '') + '" data-phase="' + i + '">'
            +   '<h3 class="jp-title">' + phase.title + '</h3>'
            +   '<p class="jp-copy">' + phase.copy + '</p>'
            +   '<div class="jp-rail">'
            +     '<button class="rail-nav rail-nav--prev" type="button" aria-label="' + prevLabel() + '">'
            +       '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M15 6l-6 6 6 6"/></svg>'
            +     '</button>'
            +     '<button class="rail-nav rail-nav--next" type="button" aria-label="' + nextLabel() + '">'
            +       '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M9 6l6 6-6 6"/></svg>'
            +     '</button>'
            +     '<ul class="jp-track">'
            +       imgs.map(function (f) {
                      var src = (f === (dataAr.hero.split('/').pop())) ? dataAr.hero : folder + f;
                      return '<li class="jp-shot"><img src="' + src + '" alt="' + phase.title + ' — ' + data.title + '" loading="lazy" decoding="async"></li>';
                    }).join('')
            +     '</ul>'
            +   '</div>'
            + '</div>';
    });

    wrap.innerHTML = html;
    wireRails();
    wireReveal(wrap.querySelectorAll('.journey-phase'));
  }

  function renderMeta() {
    var data = getData();
    document.title = data.title + pageTitleSuffix();
    byId('projCategory').textContent = data.category;
    byId('projTitle').textContent    = data.title;
    byId('projLede').textContent     = data.lede;
    byId('projType').textContent     = data.type;
    byId('projDuration').textContent = data.duration;
    byId('projLocation').textContent = data.location;

    var heroImg = byId('projHeroImg');
    heroImg.src = dataAr.hero;
    heroImg.alt = data.title;

    renderSeoMeta(data);
  }

  /* Search engines and link previews read the <head>, not the rendered
     DOM — so mirror this project's identity into it. */
  function renderSeoMeta(data) {
    var origin = location.origin + location.pathname.replace(/[^/]*$/, '');
    var pageUrl = origin + 'project.html?id=' + id;

    setMeta('name', 'description', data.lede);
    setMeta('property', 'og:title', data.title + pageTitleSuffix());
    setMeta('property', 'og:description', data.lede);
    setMeta('property', 'og:url', pageUrl);
    setMeta('property', 'og:image', origin + dataAr.hero);

    var canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', pageUrl);

    var ld = {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'CreativeWork',
          name: data.title,
          description: data.lede,
          url: pageUrl,
          image: origin + dataAr.hero,
          inLanguage: 'ar',
          locationCreated: { '@type': 'Place', name: data.location },
          creator: { '@id': 'https://unitedconstructioneg.com/#organization' }
        },
        {
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'الرئيسية', item: 'https://unitedconstructioneg.com/' },
            { '@type': 'ListItem', position: 2, name: 'مشاريعنا', item: 'https://unitedconstructioneg.com/projects-all.html' },
            { '@type': 'ListItem', position: 3, name: data.title, item: pageUrl }
          ]
        }
      ]
    };

    var script = byId('projectLd');
    if (!script) {
      script = document.createElement('script');
      script.type = 'application/ld+json';
      script.id = 'projectLd';
      document.head.appendChild(script);
    }
    script.textContent = JSON.stringify(ld);
  }

  function setMeta(attr, key, value) {
    var el = document.head.querySelector('meta[' + attr + '="' + key + '"]');
    if (!el) {
      el = document.createElement('meta');
      el.setAttribute(attr, key);
      document.head.appendChild(el);
    }
    el.setAttribute('content', value);
  }


  /* ==========================================================
     TABS
     ========================================================== */
  Array.prototype.forEach.call(tabs, function (tab) {
    tab.addEventListener('click', function () {
      var target = tab.getAttribute('data-phase');

      Array.prototype.forEach.call(tabs, function (t) {
        t.classList.toggle('is-active', t === tab);
        t.setAttribute('aria-selected', String(t === tab));
      });
      Array.prototype.forEach.call(document.querySelectorAll('.journey-phase'), function (p) {
        p.classList.toggle('is-active', p.getAttribute('data-phase') === target);
      });
    });
  });


  /* ==========================================================
     PER-PHASE RAILS (same paging idea as the homepage gallery)
     ========================================================== */
  function wireRails() {
    Array.prototype.forEach.call(document.querySelectorAll('.jp-rail'), function (rail) {
      var track = rail.querySelector('.jp-track');
      var prev  = rail.querySelector('.rail-nav--prev');
      var next  = rail.querySelector('.rail-nav--next');
      if (!track || !prev || !next) return;

      var sync = function () {
        // `disabled` (not `hidden`) does the hiding: .rail-nav sets
        // display:grid, which always beats the [hidden] UA rule, so
        // hidden alone would leave the button visible but inert.
        var pos = Math.abs(track.scrollLeft);
        var max = track.scrollWidth - track.clientWidth;
        if (max <= 2) { prev.disabled = next.disabled = true; return; }
        prev.disabled = pos <= 2;
        next.disabled = pos >= max - 2;
      };

      var page = function (dir) {
        var shot = track.querySelector('.jp-shot');
        if (!shot) return;
        var gap  = parseFloat(getComputedStyle(track).columnGap) || 0;
        var step = (shot.getBoundingClientRect().width + gap) * 3;
        track.scrollBy({ left: -dir * step, behavior: reduced ? 'auto' : 'smooth' });
      };

      next.addEventListener('click', function () { page(1); });
      prev.addEventListener('click', function () { page(-1); });
      track.addEventListener('scroll', function () { requestAnimationFrame(sync); }, { passive: true });
      window.addEventListener('resize', sync, { passive: true });
      sync();
    });
  }


  /* ==========================================================
     REVEAL (mirrors script.js's own observer for the homepage)
     ========================================================== */
  function wireReveal(els) {
    if (!('IntersectionObserver' in window)) {
      Array.prototype.forEach.call(els, function (el) { el.classList.add('is-in'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-in');
        io.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.1 });

    Array.prototype.forEach.call(els, function (el) { io.observe(el); });
  }


  /* ==========================================================
     INITIAL RENDER + LANGUAGE SWITCH
     ========================================================== */
  renderMeta();
  renderJourney();
  wireReveal(document.querySelectorAll('.sec'));

  document.addEventListener('uc:langchange', function () {
    renderMeta();
    renderJourney();
  });

})();
