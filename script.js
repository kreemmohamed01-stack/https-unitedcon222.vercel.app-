/* ============================================================
   UNITED CONSTRUCTION
   script.js  ·  vanilla, no dependencies
   ------------------------------------------------------------
    1. Entrance sequence      1b. Hero video
    2. Header scroll state     3. Mobile drawer
    4. Services carousel       6. Parallax (desktop pointer)
    7. Services bar height     8. Word split
    9. Counters               10. Scroll reveal
   11. Projects rail          12. Contact form
   13. Active section in the nav
   ============================================================ */

(function () {
  'use strict';

  var body    = document.body;
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ==========================================================
     1. ENTRANCE SEQUENCE
     ----------------------------------------------------------
     The CSS holds every [data-anim] element hidden. Adding
     `.is-ready` on <body> releases them on their own delays,
     so the choreography lives in CSS and stays cheap.
     We only wait for the hero image so step 1 never flashes.
     ========================================================== */
  function startSequence() {
    if (body.classList.contains('is-ready')) return;

    // Give each nav link its own micro-delay (staggered header reveal).
    var navItems = document.querySelectorAll('[data-anim="nav"]');
    Array.prototype.forEach.call(navItems, function (el, i) {
      el.style.setProperty('--nav-d', (1750 + i * 90) + 'ms');
    });

    // rAF pair guarantees the browser paints the hidden state first,
    // so the transitions actually run instead of being skipped.
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        body.classList.remove('is-preload');
        body.classList.add('is-ready');
      });
    });

    // Release will-change once everything has settled.
    window.setTimeout(function () {
      body.classList.add('anim-done');
    }, reduced ? 600 : 6400);
  }

  var heroImg = document.querySelector('.hero-img');

  if (!heroImg || heroImg.complete) {
    startSequence();
  } else {
    heroImg.addEventListener('load',  startSequence, { once: true });
    heroImg.addEventListener('error', startSequence, { once: true });
    // Safety net: never let a slow/blocked image stall the page.
    window.setTimeout(startSequence, 2600);
  }


  /* ==========================================================
     1b. HERO VIDEO
     ----------------------------------------------------------
     The poster paints first; the clip only fades in once it can
     actually play. Autoplay can still be refused (iOS low-power,
     data saver) — in that case we simply leave the still up.
     ========================================================== */
  var heroVideo = document.getElementById('heroVideo');

  if (heroVideo && !reduced) {
    var showVideo = function () {
      heroVideo.classList.add('is-playing');
    };

    // readyState 3 = HAVE_FUTURE_DATA: enough buffered to start.
    if (heroVideo.readyState >= 3) {
      showVideo();
    } else {
      heroVideo.addEventListener('canplay', showVideo, { once: true });
    }

    // Some engines need play() called explicitly even with `autoplay`.
    var attempt = heroVideo.play();
    if (attempt && typeof attempt.catch === 'function') {
      attempt.catch(function () {
        // Autoplay blocked — keep the poster, don't surface an error.
        heroVideo.classList.remove('is-playing');
      });
    }

    // Don't burn battery decoding frames nobody is looking at.
    document.addEventListener('visibilitychange', function () {
      if (document.hidden) { heroVideo.pause(); }
      else { var p = heroVideo.play(); if (p && p.catch) p.catch(function () {}); }
    });
  }


  /* ==========================================================
     2. HEADER SCROLL STATE
     ========================================================== */
  var header = document.getElementById('siteHeader');

  if (header) {
    var ticking = false;

    var syncHeader = function () {
      header.classList.toggle('is-stuck', window.scrollY > 40);
      ticking = false;
    };

    window.addEventListener('scroll', function () {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(syncHeader);
    }, { passive: true });

    syncHeader();
  }


  /* ==========================================================
     3. MOBILE DRAWER
     ========================================================== */
  var toggle   = document.getElementById('menuToggle');
  var drawer   = document.getElementById('mobileMenu');
  var backdrop = document.getElementById('menuBackdrop');

  if (toggle && drawer && backdrop) {

    var setMenu = function (open) {
      toggle.setAttribute('aria-expanded', String(open));
      var lang = (window.UC_I18N && window.UC_I18N.getLang) ? window.UC_I18N.getLang() : 'ar';
      var dict = (window.UC_I18N && window.UC_I18N.DICT) || {};
      var key  = open ? 'a11y.menuClose' : 'a11y.menuOpen';
      toggle.setAttribute('aria-label', (dict[key] && dict[key][lang]) || (open ? 'إغلاق القائمة' : 'فتح القائمة'));
      drawer.classList.toggle('is-open', open);
      backdrop.classList.toggle('is-open', open);
      body.classList.toggle('nav-open', open);
      drawer.hidden = false;      // element stays in flow for the transition
      backdrop.hidden = false;
    };

    // Reveal the elements now that JS controls them.
    drawer.hidden = false;
    backdrop.hidden = false;
    setMenu(false);

    toggle.addEventListener('click', function () {
      setMenu(toggle.getAttribute('aria-expanded') !== 'true');
    });

    backdrop.addEventListener('click', function () { setMenu(false); });

    // The panel's own close button (the header toggle is hidden while open)
    var drawerClose = document.getElementById('drawerClose');
    if (drawerClose) {
      drawerClose.addEventListener('click', function () {
        setMenu(false);
        toggle.focus();
      });
    }

    drawer.addEventListener('click', function (e) {
      if (e.target.closest('a')) setMenu(false);
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
        setMenu(false);
        toggle.focus();
      }
    });

    // Close if the viewport grows back to desktop.
    var wide = window.matchMedia('(min-width: 1025px)');
    var onWide = function (e) { if (e.matches) setMenu(false); };
    if (wide.addEventListener) wide.addEventListener('change', onWide);
    else if (wide.addListener) wide.addListener(onWide);
  }


  /* ==========================================================
     3b. LANGUAGE MENU
     ----------------------------------------------------------
     Opens a small AR / EN list under the switch. The actual
     text swap (dir flip, dictionary, storage) is handled by
     i18n.js — this only owns the dropdown's open/close UI.
     ========================================================== */
  var langToggle = document.getElementById('langToggle');
  var langMenu   = document.getElementById('langMenu');

  if (langToggle && langMenu) {

    var setLangMenu = function (open) {
      langToggle.setAttribute('aria-expanded', String(open));
      langMenu.hidden = false;                 // stays in flow to animate
      langMenu.classList.toggle('is-open', open);
    };

    langMenu.hidden = false;
    setLangMenu(false);

    langToggle.addEventListener('click', function (e) {
      e.stopPropagation();
      setLangMenu(langToggle.getAttribute('aria-expanded') !== 'true');
    });

    langMenu.addEventListener('click', function (e) {
      if (e.target.closest('[data-lang]')) setLangMenu(false);
    });

    document.addEventListener('click', function (e) {
      if (!e.target.closest('.lang-wrap')) setLangMenu(false);
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && langToggle.getAttribute('aria-expanded') === 'true') {
        setLangMenu(false);
        langToggle.focus();
      }
    });
  }


  /* ==========================================================
     4. SERVICES CAROUSEL (mobile)
     ========================================================== */
  var track = document.getElementById('servicesTrack');
  var dotsC = document.getElementById('servicesDots');

  // The strip is a five-up grid at every width now, so the dots only
  // apply if a future layout brings the swipe carousel back.
  if (track && dotsC && getComputedStyle(dotsC).display !== 'none') {
    var cards = track.querySelectorAll('.service');

    // Build one dot per card.
    Array.prototype.forEach.call(cards, function (card, i) {
      var b = document.createElement('button');
      b.type = 'button';
      b.setAttribute('aria-label', 'الخدمة ' + (i + 1));
      if (i === 0) b.classList.add('is-active');
      b.addEventListener('click', function () {
        card.scrollIntoView({
          behavior: reduced ? 'auto' : 'smooth',
          inline: 'center',
          block: 'nearest'
        });
      });
      dotsC.appendChild(b);
    });

    var cDots = dotsC.querySelectorAll('button');
    var scrollTick = false;

    var syncDots = function () {
      // Card whose centre sits closest to the track centre wins.
      var mid = track.scrollLeft + track.clientWidth / 2;
      var best = 0;
      var bestDist = Infinity;

      Array.prototype.forEach.call(cards, function (card, i) {
        var c = card.offsetLeft + card.offsetWidth / 2;
        var d = Math.abs(c - mid);
        if (d < bestDist) { bestDist = d; best = i; }
      });

      Array.prototype.forEach.call(cDots, function (d, i) {
        d.classList.toggle('is-active', i === best);
      });
      scrollTick = false;
    };

    track.addEventListener('scroll', function () {
      if (scrollTick) return;
      scrollTick = true;
      requestAnimationFrame(syncDots);
    }, { passive: true });
  }


  /* ==========================================================
     6. PARALLAX — desktop, fine pointer, motion allowed
     ----------------------------------------------------------
     A few pixels of drift on the background. Transform only,
     rAF-throttled, and disabled where it would cost more than
     it gives.
     ========================================================== */
  var fine = window.matchMedia('(min-width: 1025px) and (pointer: fine)');

  if (heroImg && !reduced && fine.matches) {
    var hero = document.getElementById('hero');
    var px = 0, py = 0, raf = null;

    var apply = function () {
      // Intro has already settled the image at scale(1); keep a hair of
      // overscan so the drift never exposes an edge.
      heroImg.style.transform = 'scale(1.03) translate3d(' + px + 'px,' + py + 'px,0)';
      raf = null;
    };

    hero.addEventListener('pointermove', function (e) {
      if (!body.classList.contains('anim-done')) return;   // don't fight the intro
      var r = hero.getBoundingClientRect();
      px = ((e.clientX - r.left) / r.width  - 0.5) * -16;
      py = ((e.clientY - r.top)  / r.height - 0.5) * -10;
      if (!raf) raf = requestAnimationFrame(apply);
    }, { passive: true });

    hero.addEventListener('pointerleave', function () {
      px = 0; py = 0;
      if (!raf) raf = requestAnimationFrame(apply);
    }, { passive: true });
  }


  /* ==========================================================
     7. SERVICES BAR — LIVE HEIGHT
     ----------------------------------------------------------
     The bar is absolutely positioned at the bottom of the hero.
     Measuring it and writing the value back as --svc-h lets the
     hero reserve exactly the right space, so the whole bar is
     visible at any width without hard-coded padding guesses.
     ========================================================== */
  var heroEl  = document.getElementById('hero');
  var svcWrap = document.querySelector('.services-wrap');

  if (heroEl && svcWrap) {
    var syncSvcHeight = function () {
      var h = Math.round(svcWrap.getBoundingClientRect().height);
      if (h > 0) heroEl.style.setProperty('--svc-h', h + 'px');
    };

    syncSvcHeight();

    if (window.ResizeObserver) {
      new ResizeObserver(syncSvcHeight).observe(svcWrap);
    } else {
      window.addEventListener('resize', syncSvcHeight, { passive: true });
    }

    window.addEventListener('load', syncSvcHeight);
    window.addEventListener('orientationchange', syncSvcHeight);
    // Arabic webfonts land after first paint and change the bar height.
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(syncSvcHeight).catch(function () {});
    }
  }


  /* ==========================================================
     8. WORD SPLIT
     ----------------------------------------------------------
     Wraps every word of a [data-split] headline in its own span
     so CSS can cascade them in. Arabic is a joined script, so we
     split on words only, never on letters. Inline children (the
     gold <em>) are kept whole as a single unit.
     ========================================================== */
  function splitWords(root) {
    var counter = 0;

    var makeWord = function (child) {
      var outer = document.createElement('span');
      outer.className = 'w';
      var inner = document.createElement('span');
      inner.className = 'w-i';
      inner.style.setProperty('--w', String(counter++));
      inner.appendChild(child);
      outer.appendChild(inner);
      return outer;
    };

    var lines = root.querySelectorAll('.line');
    var targets = lines.length ? lines : [root];

    Array.prototype.forEach.call(targets, function (line) {
      var nodes = Array.prototype.slice.call(line.childNodes);
      var frag  = document.createDocumentFragment();

      nodes.forEach(function (node) {
        if (node.nodeType === 3) {                       // text
          node.nodeValue.split(/(\s+)/).forEach(function (part) {
            if (!part) return;
            if (/^\s+$/.test(part)) {
              frag.appendChild(document.createTextNode(' '));
            } else {
              frag.appendChild(makeWord(document.createTextNode(part)));
            }
          });
        } else if (node.nodeType === 1) {                // <em>, <span class="ltr">…
          frag.appendChild(makeWord(node.cloneNode(true)));
        }
      });

      line.textContent = '';
      line.appendChild(frag);
    });
  }

  if (!reduced) {
    Array.prototype.forEach.call(
      document.querySelectorAll('[data-split]'),
      splitWords
    );
  }


  /* ==========================================================
     9. COUNTERS
     ========================================================== */
  /* The markup ships the final figure so a JS-less visitor still sees
     it. With JS on we blank them to zero up front, before anything can
     scroll into view, so every counter really does start from 0. */
  var counterEls = document.querySelectorAll('[data-count]');

  if (!reduced) {
    Array.prototype.forEach.call(counterEls, function (el) {
      el.textContent = '0';
    });
  }

  function runCounter(el) {
    // The section and the stat both enter the observer, so guard
    // against a second pass restarting the count from zero.
    if (el.dataset.counted) return;
    el.dataset.counted = '1';

    var target = parseFloat(el.getAttribute('data-count'));
    if (isNaN(target)) return;

    if (reduced) { el.textContent = String(target); return; }

    /* Slot-machine flicker: for most of the run the digits jump to
       random-looking values (never the real total, so it doesn't
       spoil the finish), settling into a real, slowing-down count-up
       toward the true figure only in the last stretch — then it
       locks on the exact target for good. A ceiling comfortably
       above the target keeps the random reads plausible (never a
       wildly bigger number than the real one) without ever showing
       the target itself early. */
    var flickerDuration = 6000;   // ms spent flickering before locking
    var settleDuration  = 550;    // ms of real, decelerating count-up at the end
    var ceiling = Math.max(target + Math.ceil(target * 0.6), target + 5);
    var start   = null;
    var flickerEvery = 55;        // ms between random reads
    var lastFlicker = -Infinity;

    var step = function (ts) {
      if (start === null) start = ts;
      var elapsed = ts - start;

      if (elapsed < flickerDuration) {
        if (ts - lastFlicker >= flickerEvery) {
          lastFlicker = ts;
          var rand = Math.floor(Math.random() * ceiling);
          if (rand === target) rand = rand === 0 ? 1 : rand - 1; // never tip the ending early
          el.textContent = String(rand);
        }
        requestAnimationFrame(step);
        return;
      }

      var settleP = Math.min((elapsed - flickerDuration) / settleDuration, 1);
      var eased   = 1 - Math.pow(1 - settleP, 3);   // ease-out cubic
      el.textContent = String(Math.round(target * eased));
      if (settleP < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = String(target);            // exact final value, no rounding drift
      }
    };

    el.textContent = '0';
    requestAnimationFrame(step);
  }


  /* ==========================================================
     10. SCROLL REVEAL
     ----------------------------------------------------------
     One observer drives every below-the-fold entrance: sections
     (background zoom), [data-reveal] blocks (staggered by --r)
     and [data-split] headlines (cascaded by --w). Each element
     is released once, then dropped from the observer.
     ========================================================== */
  var revealSel  = '.sec, [data-reveal], [data-split]';
  var revealEls  = document.querySelectorAll(revealSel);

  var release = function (el) {
    el.classList.add('is-in');

    // will-change keeps the element on its own compositing layer,
    // which is worth it while the reveal transition is actually
    // running but wasteful forever after. Drop it once the entrance
    // has settled so the browser can fold the layer back in.
    window.setTimeout(function () {
      el.style.willChange = 'auto';
    }, 1700);

    // Sections are observed too, but a section enters long before its
    // stat tiles do. Counting from the tile itself — and waiting out
    // that tile's own reveal stagger — means the digits are on screen
    // and legible for the whole climb.
    if (el.classList.contains('sec')) return;

    var counters = el.querySelectorAll('[data-count]');
    if (!counters.length) return;

    var stagger = parseFloat(el.style.getPropertyValue('--r')) || 0;
    window.setTimeout(function () {
      Array.prototype.forEach.call(counters, runCounter);
    }, reduced ? 0 : stagger * 130 + 260);
  };

  if (!('IntersectionObserver' in window)) {
    Array.prototype.forEach.call(revealEls, release);
  } else {
    var revealIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        release(entry.target);
        revealIO.unobserve(entry.target);
      });
    }, {
      // fires a little before the element is fully in view, so the
      // slow-motion entrance is already under way as it arrives
      rootMargin: '0px 0px -10% 0px',
      threshold: 0.1
    });

    Array.prototype.forEach.call(revealEls, function (el) {
      revealIO.observe(el);
    });

    // Fallback for elements pinned to the very end of the document
    // (e.g. the footer's bottom bar): the -10% rootMargin can leave
    // them just outside the trigger zone even at max scroll, since
    // there's no page below them to scroll further. Once the user
    // hits the true bottom, release anything still pending.
    window.addEventListener('scroll', function () {
      var atBottom = window.innerHeight + window.scrollY
        >= document.documentElement.scrollHeight - 2;
      if (!atBottom) return;
      Array.prototype.forEach.call(revealEls, function (el) {
        if (!el.classList.contains('is-in')) {
          release(el);
          revealIO.unobserve(el);
        }
      });
    }, { passive: true });
  }


  /* ==========================================================
     11. PROJECTS RAIL
     ----------------------------------------------------------
     Three cards in view; the arrows page by exactly one viewport
     of the track. The track is RTL, so scrollLeft runs negative
     in standards-compliant engines — work off the magnitude and
     the maths stays direction-agnostic.
     ========================================================== */
  var projTrack = document.getElementById('projectsTrack');
  var projPrev  = document.getElementById('projPrev');
  var projNext  = document.getElementById('projNext');

  if (projTrack && projPrev && projNext) {

    var maxScroll = function () {
      return projTrack.scrollWidth - projTrack.clientWidth;
    };

    var syncArrows = function () {
      // RTL: scrollLeft runs 0 → -(max), so work off the magnitude.
      var pos = Math.abs(projTrack.scrollLeft);
      var max = maxScroll();

      // Nothing to scroll (very wide viewport) → both are dead ends.
      // `disabled` (not `hidden`) does the hiding: .rail-nav sets
      // display:grid, and an author display rule always beats the
      // [hidden] UA rule, so the attribute would have no effect.
      if (max <= 2) {
        projPrev.disabled = true;
        projNext.disabled = true;
        return;
      }

      // 2px of slack absorbs sub-pixel rounding at the ends
      projPrev.disabled = pos <= 2;
      projNext.disabled = pos >= max - 2;
    };

    var page = function (dir) {
      var card = projTrack.querySelector('.project-card');
      if (!card) return;

      var gap  = parseFloat(getComputedStyle(projTrack).columnGap) || 0;
      var per  = parseFloat(getComputedStyle(projTrack).getPropertyValue('--pg-per-view')) || 3;
      var step = (card.getBoundingClientRect().width + gap) * per;

      // `dir` is in reading order: +1 = further along the list. In an
      // RTL container that always means a DECREASING scrollLeft, so
      // the physical delta is the opposite sign.
      projTrack.scrollBy({
        left: -dir * step,
        behavior: reduced ? 'auto' : 'smooth'
      });
    };

    projNext.addEventListener('click', function () { page(1); });
    projPrev.addEventListener('click', function () { page(-1); });

    var projTick = false;
    projTrack.addEventListener('scroll', function () {
      if (projTick) return;
      projTick = true;
      requestAnimationFrame(function () {
        syncArrows();
        projTick = false;
      });
    }, { passive: true });

    window.addEventListener('resize', syncArrows, { passive: true });

    /* Pin the rail to project 01 before the first sync. Scroll snapping
       plus fractional card widths can otherwise leave the track parked
       mid-rail on load, which lights up both arrows at once. Snapping
       is momentarily disabled so this jump can't be re-snapped away. */
    var startRail = function () {
      var snap = projTrack.style.scrollSnapType;
      var beh  = projTrack.style.scrollBehavior;
      projTrack.style.scrollSnapType  = 'none';
      projTrack.style.scrollBehavior  = 'auto';
      projTrack.scrollLeft = 0;               // RTL: 0 === the start
      projTrack.style.scrollSnapType  = snap;
      projTrack.style.scrollBehavior  = beh;
      syncArrows();
    };

    startRail();
    window.addEventListener('load', startRail);
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(startRail).catch(function () {});
    }
  }


  /* ==========================================================
     12. CONTACT FORM
     ----------------------------------------------------------
     No backend yet, so the submit hands off to the company's
     mail client with the message pre-filled. Validation runs
     first so the draft is never half-empty.
     ========================================================== */
  var cForm  = document.getElementById('contactForm');
  var cState = document.getElementById('contactStatus');

  if (cForm && cState) {
    var t = function (key, fallback) {
      var lang = (window.UC_I18N && window.UC_I18N.getLang) ? window.UC_I18N.getLang() : 'ar';
      var dict = (window.UC_I18N && window.UC_I18N.DICT) || {};
      return (dict[key] && dict[key][lang]) || fallback;
    };

    cForm.addEventListener('submit', function (e) {
      e.preventDefault();
      cForm.classList.add('was-validated');

      if (!cForm.checkValidity()) {
        cState.textContent = t('form.errorRequired', 'من فضلك أكمل الحقول المطلوبة بشكل صحيح.');
        cState.classList.add('is-error');
        var bad = cForm.querySelector(':invalid');
        if (bad) bad.focus();
        return;
      }

      var val = function (n) {
        var f = cForm.elements[n];
        return f ? f.value.trim() : '';
      };

      var body = [
        t('form.mailName', 'الاسم: ')   + val('name'),
        t('form.mailEmail', 'البريد: ')  + val('email'),
        t('form.mailPhone', 'الهاتف: ')  + val('phone'),
        '',
        val('message')
      ].join('\n');

      window.location.href =
        'mailto:unitedconstructioncompany2020@gmail.com' +
        '?subject=' + encodeURIComponent(t('form.mailSubject', 'طلب من الموقع — ') + val('name')) +
        '&body='    + encodeURIComponent(body);

      cState.classList.remove('is-error');
      cState.textContent = t('form.success', 'تم تجهيز رسالتك — أكمل الإرسال من بريدك.');
    });
  }


  /* ==========================================================
     13. ACTIVE SECTION IN THE NAV
     ========================================================== */
  var sections = document.querySelectorAll(
    '#hero, #about, #stats, #projects, #partners, #contact'
  );
  var navLinks = document.querySelectorAll('.main-nav .nav-link, .mobile-menu a');

  if (sections.length && navLinks.length && 'IntersectionObserver' in window) {
    var setActive = function (id) {
      Array.prototype.forEach.call(navLinks, function (link) {
        var href = link.getAttribute('href');
        link.classList.toggle('is-active', href === '#' + id);
      });
    };

    var spyIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) setActive(entry.target.id);
      });
    }, {
      // a band across the middle of the viewport decides the winner
      rootMargin: '-45% 0px -45% 0px',
      threshold: 0
    });

    Array.prototype.forEach.call(sections, function (s) { spyIO.observe(s); });
  }

})();
