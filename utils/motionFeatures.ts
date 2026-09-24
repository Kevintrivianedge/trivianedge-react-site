// Loaded asynchronously by <LazyMotion> in index.tsx, so framer-motion's
// animation engine stays out of the initial bundle. First-load components use
// the lightweight `m` component; lazily loaded pages may still use `motion`.
import { domAnimation } from 'framer-motion';

export default domAnimation;
