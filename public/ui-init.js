/* TrivianEdge 2050-ready UI — cursor, scroll progress, reveal, and 3D tilt.
   Served as a static asset so script-src can omit 'unsafe-inline'. */

/* ── Custom cursor tracking ── */
(function() {
  var dot = document.getElementById('cursor-dot');
  var ring = document.getElementById('cursor-ring');
  var mx = 0, my = 0, rx = 0, ry = 0;
  document.addEventListener('mousemove', function(e) {
    mx = e.clientX; my = e.clientY;
    if (dot) { dot.style.left = mx + 'px'; dot.style.top = my + 'px'; }
  }, { passive: true });
  function animateRing() {
    rx += (mx - rx) * 0.12;
    ry += (my - ry) * 0.12;
    if (ring) { ring.style.left = rx + 'px'; ring.style.top = ry + 'px'; }
    requestAnimationFrame(animateRing);
  }
  animateRing();
})();

/* ── Scroll progress bar ── */
(function() {
  var bar = document.getElementById('scroll-progress');
  function update() {
    var s = document.documentElement;
    var pct = (s.scrollTop / (s.scrollHeight - s.clientHeight)) * 100;
    if (bar) bar.style.width = pct + '%';
  }
  document.addEventListener('scroll', update, { passive: true });
})();

/* ── Scroll reveal ── */
(function() {
  function check() {
    var vh = window.innerHeight;
    document.querySelectorAll('.reveal:not(.active)').forEach(function(el) {
      if (el.getBoundingClientRect().top < vh * 0.9) el.classList.add('active');
    });
  }
  document.addEventListener('scroll', check, { passive: true });
  setInterval(check, 400);
})();

/* ── 3D card tilt (mouse-hover parallax) ── */
(function() {
  document.addEventListener('mousemove', function(e) {
    document.querySelectorAll('.tilt-card').forEach(function(card) {
      var r = card.getBoundingClientRect();
      var cx = r.left + r.width / 2;
      var cy = r.top + r.height / 2;
      var dx = (e.clientX - cx) / (r.width / 2);
      var dy = (e.clientY - cy) / (r.height / 2);
      if (Math.sqrt(dx * dx + dy * dy) < 1.8) {
        card.style.setProperty('--tilt-x', (-dy * 6).toFixed(2));
        card.style.setProperty('--tilt-y', (dx * 6).toFixed(2));
      }
    });
  }, { passive: true });
})();

/* ── Magnetic button effect ── */
(function() {
  var activeBtn = null;
  document.addEventListener('mousemove', function(e) {
    if (!activeBtn) return;
    var r = activeBtn.getBoundingClientRect();
    var dx = e.clientX - (r.left + r.width / 2);
    var dy = e.clientY - (r.top + r.height / 2);
    activeBtn.style.transform = 'translate(' + (dx * 0.28).toFixed(2) + 'px, ' + (dy * 0.28).toFixed(2) + 'px)';
  }, { passive: true });
  document.addEventListener('mouseover', function(e) {
    var t = e.target;
    while (t && t !== document.body) {
      if (t.classList && t.classList.contains('btn-magnetic')) { activeBtn = t; return; }
      t = t.parentElement;
    }
  }, { passive: true });
  document.addEventListener('mouseout', function(e) {
    if (activeBtn && !activeBtn.contains(e.relatedTarget)) {
      activeBtn.style.transform = '';
      activeBtn = null;
    }
  }, { passive: true });
})();
