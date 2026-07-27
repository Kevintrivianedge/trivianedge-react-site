import React, { useState, useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown, Menu, X } from 'lucide-react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { NAV_LINKS } from '../constants';
import ThemeToggle from './ThemeToggle';
import Logo from './Logo';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [expandedMobile, setExpandedMobile] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const drawerRef = useRef<HTMLDivElement>(null);
  const dropdownCloseTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Desktop dropdown: close on route change, outside click, or Escape.
  useEffect(() => {
    setOpenDropdown(null);
  }, [location.pathname]);

  useEffect(() => {
    if (!openDropdown) return;
    const handleOutside = (e: MouseEvent) => {
      if (!(e.target as HTMLElement).closest('[data-nav-dropdown]')) {
        setOpenDropdown(null);
      }
    };
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpenDropdown(null);
    };
    document.addEventListener('mousedown', handleOutside);
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('mousedown', handleOutside);
      document.removeEventListener('keydown', handleKey);
    };
  }, [openDropdown]);

  const openDropdownNow = (name: string) => {
    if (dropdownCloseTimer.current) clearTimeout(dropdownCloseTimer.current);
    setOpenDropdown(name);
  };
  const scheduleDropdownClose = () => {
    dropdownCloseTimer.current = setTimeout(() => setOpenDropdown(null), 150);
  };

  // Only the homepage opens on a permanently-dark hero section, so the
  // transparent, unscrolled navbar needs light text there specifically —
  // every other route starts on a theme-aware light/dark background where
  // the default theme-aware text colors are already correct.
  const onDarkHero = location.pathname === '/' && !scrolled;

  // Mobile drawer: trap focus, close on Escape, lock background scroll,
  // and restore focus to whatever triggered it (the hamburger button) on close.
  useEffect(() => {
    if (!isOpen) return;

    const previouslyFocused = document.activeElement as HTMLElement | null;
    document.body.style.overflow = 'hidden';

    const focusable = drawerRef.current
      ? Array.from(drawerRef.current.querySelectorAll<HTMLElement>('a[href], button:not([disabled])'))
      : [];
    focusable[0]?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
        return;
      }
      if (e.key === 'Tab' && focusable.length > 0) {
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', handleKeyDown);
      previouslyFocused?.focus();
    };
  }, [isOpen]);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          setScrolled(window.scrollY > 50);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (href: string) => {
    setIsOpen(false);
    if (href.startsWith('/')) {
      navigate(href);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (href === '#blog') {
      navigate('/blog');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      const id = href.replace('#', '');
      if (window.location.pathname === '/') {
        // Already on home — scroll immediately without a route change.
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
      } else {
        navigate('/');
        // 150ms gives React Router + IntersectionObserver a comfortable margin
        // to fully render the home page sections before we try to scroll.
        setTimeout(() => {
          document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
        }, 150);
      }
    }
  };

  const menuVariants = {
    closed: { x: "100%" },
    open: { 
      x: 0,
      transition: { 
        type: "spring", 
        stiffness: 300, 
        damping: 30 
      }
    },
    exit: { 
      x: "100%",
      transition: {
        type: "spring",
        stiffness: 300, 
        damping: 30
      }
    }
  };

  const containerVariants = {
    closed: { transition: { staggerChildren: 0.05, staggerDirection: -1 } },
    open: { transition: { staggerChildren: 0.1, delayChildren: 0.2 } }
  };

  const itemVariants = {
    closed: { x: -50, opacity: 0 },
    open: { x: 0, opacity: 1 }
  };

  return (
    <motion.nav
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className={`fixed top-0 w-full z-[100] transition-all duration-500 ${scrolled ? 'bg-background/85 backdrop-blur-md border-b border-border py-4 shadow-[0_10px_30px_rgba(15,23,42,0.06)]' : 'bg-transparent py-8'}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 flex justify-between items-center relative z-[101] gap-4">
        <div className="shrink-0">
          <Logo light={onDarkHero} onClick={() => { navigate('/'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} />
        </div>

        <div className="hidden lg:flex items-center gap-5 xl:gap-8 shrink-0 ml-4 xl:ml-8">
          {NAV_LINKS.map(link => (
            link.children ? (
              <div
                key={link.name}
                data-nav-dropdown
                className="relative"
                onMouseEnter={() => openDropdownNow(link.name)}
                onMouseLeave={scheduleDropdownClose}
              >
                <button
                  type="button"
                  onClick={() => setOpenDropdown(openDropdown === link.name ? null : link.name)}
                  aria-expanded={openDropdown === link.name}
                  className={`flex items-center gap-1 text-[11px] xl:text-xs font-bold uppercase tracking-[0.12em] xl:tracking-widest hover:text-cyan-400 transition-colors ${onDarkHero ? 'text-white/70' : 'text-muted'}`}
                >
                  {link.name}
                  <ChevronDown className={`w-3 h-3 transition-transform ${openDropdown === link.name ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {openDropdown === link.name && (
                    <motion.div
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.15 }}
                      className="absolute top-full left-0 mt-3 w-64 rounded-2xl bg-background border border-border shadow-[0_20px_50px_rgba(15,23,42,0.14)] py-2 z-[110]"
                    >
                      {link.children.map(child => (
                        <Link
                          key={child.href}
                          to={child.href}
                          onClick={() => setOpenDropdown(null)}
                          className={`block px-4 py-2.5 text-xs font-semibold text-text hover:text-cyan-400 hover:bg-cyan-400/5 transition-colors ${'isSub' in child && child.isSub ? 'pl-7 text-muted' : ''}`}
                        >
                          {child.name}
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => { e.preventDefault(); handleNavClick(link.href); }}
                className={`text-[11px] xl:text-xs font-bold uppercase tracking-[0.12em] xl:tracking-widest hover:text-cyan-400 transition-colors ${onDarkHero ? 'text-white/70' : 'text-muted'}`}
              >
                {link.name}
              </a>
            )
          ))}

          <ThemeToggle />
          
          <a href="/contact" onClick={(e) => { e.preventDefault(); handleNavClick('/contact'); }} className="px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest transition-all btn-magnetic premium-button">
            Talk to us
          </a>
        </div>

        <div className="lg:hidden flex items-center gap-4">
            <ThemeToggle />
            <button
              className={`p-2.5 min-w-[44px] min-h-[44px] flex items-center justify-center ${onDarkHero ? 'text-white' : 'text-text'}`}
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle navigation"
              aria-expanded={isOpen}
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={drawerRef}
            role="dialog"
            aria-modal="true"
            aria-label="Mobile navigation"
            initial="closed"
            animate="open"
            exit="exit"
            variants={menuVariants}
            className="fixed inset-0 bg-background z-[90] lg:hidden overflow-y-auto flex flex-col"
          >
            <div className="absolute inset-x-0 top-0 h-px bg-border/70" />

            <motion.div
              className="flex flex-col items-center justify-center min-h-full gap-8 relative z-10 py-24"
              variants={containerVariants}
            >
              <motion.a
                href="/"
                variants={itemVariants}
                className="text-2xl font-bold text-text hover:text-cyan-400 transition-colors"
                onClick={(e) => { e.preventDefault(); setIsOpen(false); navigate('/'); window.scrollTo({ top: 0 }); }}
              >
                Home
              </motion.a>

              {NAV_LINKS.map(link => (
                link.children ? (
                  <motion.div key={link.name} variants={itemVariants} className="flex flex-col items-center gap-4">
                    <button
                      type="button"
                      onClick={() => setExpandedMobile(expandedMobile === link.name ? null : link.name)}
                      aria-expanded={expandedMobile === link.name}
                      className="flex items-center gap-2 text-2xl font-bold text-text hover:text-cyan-400 transition-colors"
                    >
                      {link.name}
                      <ChevronDown className={`w-5 h-5 transition-transform ${expandedMobile === link.name ? 'rotate-180' : ''}`} />
                    </button>
                    <AnimatePresence>
                      {expandedMobile === link.name && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="flex flex-col items-center gap-3 overflow-hidden"
                        >
                          {link.children.map(child => (
                            <a
                              key={child.href}
                              href={child.href}
                              className={`font-semibold text-text/80 hover:text-cyan-400 transition-colors ${'isSub' in child && child.isSub ? 'text-base' : 'text-lg'}`}
                              onClick={(e) => { e.preventDefault(); handleNavClick(child.href); }}
                            >
                              {child.name}
                            </a>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ) : (
                  <motion.a
                    key={link.name}
                    href={link.href}
                    variants={itemVariants}
                    className="text-2xl font-bold text-text hover:text-cyan-400 transition-colors"
                    onClick={(e) => { e.preventDefault(); handleNavClick(link.href); }}
                  >
                    {link.name}
                  </motion.a>
                )
              ))}

              <motion.a
                href="/contact"
                variants={itemVariants}
                className="mt-4 px-10 py-4 rounded-full font-bold text-base uppercase tracking-widest premium-button"
                onClick={(e) => { e.preventDefault(); handleNavClick('/contact'); }}
              >
                Start here
              </motion.a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
