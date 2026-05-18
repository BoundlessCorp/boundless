import { useState, useEffect, useRef } from 'react';
import { Menu, X, Phone } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { PopupModal } from 'react-calendly';
import { baseUrl } from '../lib/base-url';

interface HeaderProps {
  backgroundColor?: string;
}

export default function Header({ backgroundColor }: HeaderProps = {}) {
  const [visible, setVisible] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const lastScrollY = useRef(0);
  const [atTop, setAtTop] = useState(true);
  const [isCalendlyOpen, setIsCalendlyOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      setAtTop(currentY < 20);
      if (currentY < lastScrollY.current || currentY < 80) {
        setVisible(true);
      } else if (currentY > lastScrollY.current && currentY > 80) {
        setVisible(false);
        setMobileOpen(false);
      }
      lastScrollY.current = currentY;

      // Detect active section
      const sections = ['hero', 'offer', 'how-it-works', 'results', 'faq', 'booking'];
      const scrollPosition = currentY + 200; // Offset for better detection

      for (const sectionId of sections) {
        const element = document.getElementById(sectionId);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Run once on mount
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    setMobileOpen(false);
    // If we're on the pricing page or any other page, navigate to home first
    if (window.location.pathname !== baseUrl && window.location.pathname !== `${baseUrl}/`) {
      window.location.href = `${baseUrl}/#${id}`;
    } else {
      const element = document.getElementById(id);
      if (element) {
        const headerOffset = 80; // Account for fixed header
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    }
  };

  const handleNavClick = (item: { label: string; id?: string; href?: string }) => {
    if (item.href) {
      window.location.href = item.href;
    } else if (item.id) {
      scrollTo(item.id);
    }
  };

  const goToHome = () => {
    setMobileOpen(false);
    window.location.href = baseUrl || '/';
  };

  const navItems = [
    { label: 'Services', id: 'offer' },
    { label: 'Process', id: 'how-it-works' },
    { label: 'Results', id: 'results' },
    { label: 'Pricing', href: `${baseUrl}/pricing` },
    { label: 'FAQ', id: 'faq' },
    { label: 'Book Now', id: 'booking' },
  ];

  return (
    <>
      {visible && (
        <header
          className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
            atTop && !backgroundColor ? 'bg-transparent' : 'backdrop-blur-md border-b border-border'
          }`}
          style={{
            transform: visible ? 'translateY(0)' : 'translateY(-100%)',
            backgroundColor: backgroundColor || (atTop ? 'transparent' : 'hsl(var(--foreground) / 0.9)'),
          }}
        >
          <div className="max-w-7xl mx-auto px-6 lg:px-10 flex items-center justify-between h-16 lg:h-20">
            <button onClick={goToHome} className="flex items-center gap-2">
              <img
                src="https://media.base44.com/images/public/69d9696e29a47b1500cec646/8f83fed3b_BrandIcon.png"
                alt="Boundless - Painting Business Growth System Logo"
                className="h-8 w-auto"
                width="120"
                height="32"
              />
            </button>

            <nav className="hidden md:flex items-center gap-8">
              {navItems.map((item) => {
                const isActive = item.id && activeSection === item.id;
                return (
                  <button
                    key={item.id || item.href}
                    onClick={() => handleNavClick(item)}
                    className={`font-mono text-xs transition-all duration-200 uppercase tracking-wider relative ${
                      isActive 
                        ? 'text-signal font-bold' 
                        : 'text-muted-foreground hover:text-background'
                    }`}
                  >
                    {item.label}
                    {isActive && (
                      <span 
                        className="absolute -bottom-1 left-0 right-0 h-0.5 bg-signal rounded-full"
                        style={{ animation: 'slideIn 0.3s ease-out' }}
                      />
                    )}
                  </button>
                );
              })}
            </nav>

            {/* Desktop CTA */}
            <div className="hidden md:flex items-center gap-4">
              <button
                onClick={() => setIsCalendlyOpen(true)}
                className="px-6 py-2 rounded-lg font-bold transition-all duration-300 hover:scale-105"
                style={{ backgroundColor: '#a28b6d', color: '#35271c', border: '2px solid #35271c' }}
              >
                Book a Call
              </button>
            </div>

            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden text-background"
            >
              {mobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </header>
      )}

      {/* Mobile Menu */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 backdrop-blur-xl pt-20 px-6"
          style={{
            animation: 'fadeIn 0.2s ease-out',
            backgroundColor: backgroundColor ? `${backgroundColor}f5` : 'hsl(var(--foreground) / 0.98)',
          }}
        >
          <nav className="flex flex-col gap-6">
            {navItems.map((item, i) => {
              const isActive = item.id && activeSection === item.id;
              return (
                <button
                  key={item.id || item.href}
                  onClick={() => handleNavClick(item)}
                  className="text-left"
                >
                  <span className={`font-mono text-xs ${isActive ? 'text-signal' : 'text-muted-foreground'}`}>
                    0{i + 1} /
                  </span>
                  <span className={`block font-heading text-3xl font-bold tracking-tighter mt-1 ${
                    isActive ? 'text-signal' : 'text-background'
                  }`}>
                    {item.label}
                  </span>
                </button>
              );
            })}
            <div className="mt-6 pt-6 border-t border-border">
              <button
                onClick={() => scrollTo('booking')}
                className="w-full font-heading font-bold text-lg text-primary-foreground py-4 rounded-lg border"
                style={{ backgroundColor: '#a28b6d', borderColor: '#35271c' }}
              >
                Book a Free Call →
              </button>
            </div>
          </nav>
        </div>
      )}

      <AnimatePresence>
        {isCalendlyOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-50 flex items-center justify-center"
          >
            <div
              className="absolute inset-0 bg-black/50"
              onClick={() => setIsCalendlyOpen(false)}
            />
            <div className="relative z-10 w-full max-w-md bg-white border border-border rounded-lg shadow-xl p-6">
              <div className="flex items-center gap-3 mb-3">
                <Phone size={18} />
                <h2 className="font-heading text-lg font-semibold text-signal">Book a Call</h2>
              </div>
              <p className="text-muted-foreground mb-4">
                Schedule a 30-minute call with Jason to discuss your painting business.
              </p>
              <div className="mt-4">
                <button
                  onClick={() => {
                    setIsCalendlyOpen(true);
                  }}
                  className="w-full px-6 py-3 rounded-lg font-bold transition-all duration-300"
                  style={{ backgroundColor: '#a28b6d', color: '#35271c' }}
                >
                  Schedule Call
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Calendly Popup Modal */}
      <PopupModal
        url="https://calendly.com/jason-boundlesscorp/30min"
        onModalClose={() => setIsCalendlyOpen(false)}
        open={isCalendlyOpen}
        rootElement={typeof document !== 'undefined' ? document.body : undefined}
      />

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes slideIn {
          from {
            transform: scaleX(0);
          }
          to {
            transform: scaleX(1);
          }
        }
      `}</style>
    </>
  );
}












