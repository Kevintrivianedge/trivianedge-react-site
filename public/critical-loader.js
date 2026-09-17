// Swaps every deferred (media="print") stylesheet to media="all" once it
// actually loads, including the Google Fonts link — same pattern for both,
// since a media="print" link's own 'load' event fires reliably across
// engines (unlike rel="preload", which measurably doesn't).
//
// This script runs before some of the <link> elements it targets exist in
// the DOM (Vite injects its own CSS link further down in <head> than this
// script tag), so a plain querySelectorAll + addEventListener at load time
// would silently find nothing for those and never fire — link.sheet is
// checked first as a fallback for exactly that "already loaded/present by
// the time we can react" case; if it's not set yet, network completion is
// always asynchronous, so attaching the listener immediately after the
// check is guaranteed to still catch it.
//
// Deliberately an external, same-origin file rather than an inline
// <script> or inline onload="" attribute: those two are the only things a
// CSP's script-src can restrict via nonce/hash, so any edge layer that
// rewrites the CSP to require one (independent of what this app's own
// header sends) can silently block them. A same-origin script file is
// never subject to that restriction, so this works regardless of what's
// happening upstream.
(function () {
  function activate(link) {
    if (link.media === 'print') link.media = 'all';
  }

  function handle(link) {
    if (link.sheet) {
      activate(link);
    } else {
      link.addEventListener('load', function () {
        activate(link);
      });
    }
  }

  document.querySelectorAll('link[rel="stylesheet"][media="print"]').forEach(handle);
})();
