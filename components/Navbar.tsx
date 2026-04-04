import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { NAV_LINKS } from '../constants';
import LanguageSelector from './LanguageSelector';
import ThemeToggle from './ThemeToggle';
import Logo from './Logo';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (href: string) => {
    setIsOpen(false);
    if (href === '#blog') {
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
    <nav className={`fixed top-0 w-full z-[100] transition-all duration-500 ${scrolled ? 'glass py-4 shadow-2xl' : 'bg-transparent py-8'}`}>
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex justify-between items-center relative z-[101]">
        <Logo onClick={() => { navigate('/'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} />

        <div className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map(link => (
            <a 
              key={link.name} 
              href={link.href} 
              onClick={(e) => { e.preventDefault(); handleNavClick(link.href); }}
              className="text-xs font-bold uppercase tracking-widest text-muted hover:text-cyan-400 transition-colors"
            >
              {link.name}
            </a>
          ))}
          
          <div className="h-4 w-px bg-border mx-2"></div>
          <LanguageSelector />
          <ThemeToggle />
          
          <a href="#contact" onClick={(e) => { e.preventDefault(); handleNavClick('#contact'); }} className="px-6 py-2.5 bg-btn-bg text-btn-text rounded-full text-xs font-bold uppercase tracking-widest hover:bg-cyan-400 hover:text-white transition-all btn-magnetic">
            Talk To Us
          </a>
        </div>

        <div className="md:hidden flex items-center gap-4">
            <ThemeToggle />
            <button className="p-2 text-text" onClick={() => setIsOpen(!isOpen)}>
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
            className="fixed inset-0 bg-background z-[90] md:hidden overflow-hidden flex flex-col"
          >
            {/* Background Parallax Elements */}
            <motion.div 
               className="absolute top-[-10%] right-[-10%] w-[70vw] h-[70vw] bg-cyan-500/10 blur-[80px] rounded-full"
               initial={{ x: 100, opacity: 0 }}
               animate={{ x: 0, opacity: 1 }}
               transition={{ duration: 1, ease: "easeOut" }}
            />
             <motion.div 
               className="absolute bottom-[-10%] left-[-10%] w-[70vw] h-[70vw] bg-violet-600/10 blur-[80px] rounded-full"
               initial={{ x: -100, opacity: 0 }}
               animate={{ x: 0, opacity: 1 }}
               transition={{ duration: 1, delay: 0.1, ease: "easeOut" }}
            />

            <motion.div 
              className="flex flex-col items-center justify-center h-full gap-8 relative z-10"
              variants={containerVariants}
            >
              <motion.a 
                href="/" 
                variants={itemVariants}
                className="text-4xl font-bold text-text hover:text-cyan-400 transition-colors font-['Space_Grotesk']" 
                onClick={(e) => { e.preventDefault(); setIsOpen(false); navigate('/'); window.scrollTo({ top: 0 }); }}
              >
                Home
              </motion.a>

              {NAV_LINKS.map(link => (
                <motion.a 
                  key={link.name} 
                  href={link.href} 
                  variants={itemVariants}
                  className="text-4xl font-bold text-text hover:text-cyan-400 transition-colors font-['Space_Grotesk']" 
                  onClick={(e) => { e.preventDefault(); handleNavClick(link.href); }}
                >
                  {link.name}
                </motion.a>
              ))}

              <motion.div variants={itemVariants} className="my-4 scale-125">
                 <LanguageSelector />
              </motion.div>

              <motion.a 
                href="#contact" 
                variants={itemVariants}
                className="mt-4 px-10 py-4 bg-cyan-600 text-white rounded-2xl font-bold text-xl" 
                onClick={(e) => { e.preventDefault(); handleNavClick('#contact'); }}
              >
                Get Started
              </motion.a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
