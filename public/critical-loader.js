// Swaps deferred, non-blocking resources to their active state once loaded.
// Deliberately an external, same-origin file rather than an inline <script>
// or inline onload="" attribute: those two are the only things a CSP's
// script-src can restrict via nonce/hash, so any edge layer that rewrites
// the CSP to require one (independent of what this app's own header sends)
// can silently block them. A same-origin script file is never subject to
// that restriction, so this works regardless of what's happening upstream.
(function () {
  var fontLink = document.getElementById('font-preload');
  if (fontLink && fontLink.getAttribute('rel') === 'preload') {
    fontLink.addEventListener('load', function () {
      fontLink.rel = 'stylesheet';
    });
  }

  document.querySelectorAll('link[rel="stylesheet"][media="print"]').forEach(function (link) {
    link.addEventListener('load', function () {
      link.media = 'all';
    });
  });
})();
