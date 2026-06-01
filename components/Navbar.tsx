import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { NAV_LINKS } from '../constants';
import ThemeToggle from './ThemeToggle';
import Logo from './Logo';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();

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
          <Logo onClick={() => { navigate('/'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} />
        </div>

        <div className="hidden lg:flex items-center gap-5 xl:gap-8 shrink-0 ml-4 xl:ml-8">
          {NAV_LINKS.map(link => (
            <a 
              key={link.name} 
              href={link.href} 
              onClick={(e) => { e.preventDefault(); handleNavClick(link.href); }}
              className="text-[11px] xl:text-xs font-bold uppercase tracking-[0.12em] xl:tracking-widest text-muted hover:text-cyan-400 transition-colors"
            >
              {link.name}
            </a>
          ))}
          
          <ThemeToggle />
          
          <a href="/contact" onClick={(e) => { e.preventDefault(); handleNavClick('/contact'); }} className="px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest transition-all btn-magnetic premium-button">
            Talk to us
          </a>
        </div>

        <div className="lg:hidden flex items-center gap-4">
            <ThemeToggle />
            <button
              className="p-2.5 min-w-[44px] min-h-[44px] flex items-center justify-center text-text"
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
            initial="closed"
            animate="open"
            exit="exit"
            variants={menuVariants}
            className="fixed inset-0 bg-background z-[90] lg:hidden overflow-hidden flex flex-col"
          >
            <div className="absolute inset-x-0 top-0 h-px bg-border/70" />

            <motion.div 
              className="flex flex-col items-center justify-center h-full gap-8 relative z-10"
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
                <motion.a
                  key={link.name}
                  href={link.href}
                  variants={itemVariants}
                  className="text-2xl font-bold text-text hover:text-cyan-400 transition-colors"
                  onClick={(e) => { e.preventDefault(); handleNavClick(link.href); }}
                >
                  {link.name}
                </motion.a>
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
