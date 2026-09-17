/* TrivianEdge 2050-ready UI — scroll reveal and 3D tilt.
   Served as a static asset so script-src can omit 'unsafe-inline'. */

/* ── Scroll reveal (IntersectionObserver — no polling) ── */
(function() {
  if (typeof IntersectionObserver === 'undefined') {
    // Ancient-browser fallback: just show everything.
    document.querySelectorAll('.reveal:not(.active)').forEach(function(el) {
      el.classList.add('active');
    });
    return;
  }

  var observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        observer.unobserve(entry.target);
      }
    });
  }, { rootMargin: '0px 0px -10% 0px', threshold: 0 });

  function observeAll() {
    document.querySelectorAll('.reveal:not(.active)').forEach(function(el) {
      observer.observe(el);
    });
  }

  observeAll();
  // Route changes and lazy-loaded sections add new .reveal nodes after
  // initial load — a lightweight mutation watcher keeps them covered
  // without ever re-scanning on a timer.
  new MutationObserver(observeAll).observe(document.body, { childList: true, subtree: true });
})();

/* ── 3D card tilt (mouse-hover parallax) ── */
(function() {
  // Cache the card list and rect snapshots so we don't query the DOM or
  // trigger layout (getBoundingClientRect) on every single mousemove event.
  var cards = [];
  var rects = [];
  var refreshQueued = false;

  function refreshCards() {
    refreshQueued = false;
    cards = Array.prototype.slice.call(document.querySelectorAll('.tilt-card'));
    rects = cards.map(function(c) { return c.getBoundingClientRect(); });
  }

  function queueRefresh() {
    if (refreshQueued) return;
    refreshQueued = true;
    requestAnimationFrame(refreshCards);
  }

  window.addEventListener('load', refreshCards, { passive: true });
  window.addEventListener('resize', queueRefresh, { passive: true });
  document.addEventListener('scroll', queueRefresh, { passive: true });
  // New cards (lazy-loaded routes/sections) trigger a refresh instead of a
  // blind poll.
  if (typeof MutationObserver !== 'undefined') {
    new MutationObserver(queueRefresh).observe(document.body, { childList: true, subtree: true });
  }
  refreshCards();

  document.addEventListener('mousemove', function(e) {
    for (var i = 0; i < cards.length; i++) {
      var card = cards[i];
      var r = rects[i];
      if (!r) continue;
      var cx = r.left + r.width / 2;
      var cy = r.top + r.height / 2;
      var dx = (e.clientX - cx) / (r.width / 2);
      var dy = (e.clientY - cy) / (r.height / 2);
      if (Math.sqrt(dx * dx + dy * dy) < 1.8) {
        card.style.setProperty('--tilt-x', (-dy * 6).toFixed(2));
        card.style.setProperty('--tilt-y', (dx * 6).toFixed(2));
      }
    }
  }, { passive: true });
})();

/* ── Magnetic button effect ── */
(function() {
  var MAGNETIC_STRENGTH = 0.28;
  var activeBtn = null;
  document.addEventListener('mousemove', function(e) {
    if (!activeBtn) return;
    var r = activeBtn.getBoundingClientRect();
    var dx = e.clientX - (r.left + r.width / 2);
    var dy = e.clientY - (r.top + r.height / 2);
    activeBtn.style.transform = 'translate(' + (dx * MAGNETIC_STRENGTH).toFixed(2) + 'px, ' + (dy * MAGNETIC_STRENGTH).toFixed(2) + 'px)';
  }, { passive: true });
  document.addEventListener('mouseover', function(e) {
    var t = e.target;
    while (t && t !== document.body) {
      if (t.classList && t.classList.contains('btn-magnetic')) { activeBtn = t; return; }
      t = t.parentElement;
    }
  }, { passive: true });
  document.addEventListener('mouseout', function(e) {
    if (activeBtn && (!e.relatedTarget || !activeBtn.contains(e.relatedTarget))) {
      activeBtn.style.transform = '';
      activeBtn = null;
    }
  }, { passive: true });
})();
