import '@testing-library/jest-dom';

// Use Framer Motion's JavaScript fallback in DOM unit tests. The browser suite
// exercises native animations, which Happy DOM cannot settle reliably on unmount.
if (typeof Element !== 'undefined') {
  Reflect.deleteProperty(Element.prototype, 'animate');
}
