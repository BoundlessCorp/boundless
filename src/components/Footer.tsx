




import { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';
import { baseUrl } from '../lib/base-url';

export default function Footer() {
  const [leadCount, setLeadCount] = useState(1247);

  useEffect(() => {
    const interval = setInterval(() => {
      setLeadCount((prev) => prev + Math.floor(Math.random() * 3) + 1);
    }, 4000 + Math.random() * 3000);
    return () => clearInterval(interval);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleNavigation = (href?: string, id?: string) => {
    if (href) {
      window.location.href = href;
    } else if (id) {
      scrollTo(id);
    }
  };

  return (
    <footer className="relative bg-obsidian border-t border-border">
      {/* Revenue counter banner */}
      <div className="bg-card border-b border-border py-6">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-signal animate-pulse" />
            <span className="font-mono text-sm text-steel">
              Boundless — Leads Generated for Vancouver Contractors:
            </span>
          </div>
          <div className="font-display font-black text-signal text-3xl tracking-tighter">
            {leadCount.toLocaleString()}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 lg:px-8 py-16" style={{ backgroundColor: '#a28b6d' }}>
        {/* Navigation - First Line */}
        <div className="mb-8">
          <h3 className="font-heading font-semibold text-base mb-4" style={{ color: '#35271c' }}>Navigation</h3>
          <div className="flex flex-wrap gap-x-8 gap-y-2">
            <button onClick={() => scrollTo('hero')} className="text-obsidian/90 hover:text-obsidian text-sm font-body transition-colors">
              Home
            </button>
            <button onClick={() => scrollTo('how-it-works')} className="text-obsidian/90 hover:text-obsidian text-sm font-body transition-colors">
              How It Works
            </button>
            <button onClick={() => scrollTo('results')} className="text-obsidian/90 hover:text-obsidian text-sm font-body transition-colors">
              Results
            </button>
            <button onClick={() => scrollTo('testimonials')} className="text-obsidian/90 hover:text-obsidian text-sm font-body transition-colors">
              Testimonials
            </button>
            <button onClick={() => handleNavigation(`${baseUrl}/pricing`)} className="text-obsidian/90 hover:text-obsidian text-sm font-body transition-colors">
              Pricing
            </button>
          </div>
        </div>

        {/* Services - Second Line */}
        <div className="mb-8">
          <h3 className="font-heading font-semibold text-base mb-4" style={{ color: '#35271c' }}>Services</h3>
          <div className="flex flex-wrap gap-x-8 gap-y-2">
            {[
              { label: 'Lead Generation', id: 'solution' },
              { label: 'Business Automation', id: 'how-it-works' },
              { label: 'CRM Solutions', id: 'solution' },
              { label: 'Marketing Support', id: 'results' },
              { label: 'Training & Coaching', id: 'offer' },
            ].map((item) => (
              <button
                key={item.id + item.label}
                onClick={() => scrollTo(item.id)}
                className="text-obsidian/90 text-sm font-body hover:text-obsidian transition-colors"
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* Trust Badges */}
        <div className="mb-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* Licensed & Insured */}
            <div className="flex flex-col items-center text-center p-4 rounded-lg border border-obsidian/10" style={{ backgroundColor: '#674f3d' }}>
              <div className="w-12 h-12 rounded-full bg-signal/20 flex items-center justify-center mb-3">
                <svg className="w-6 h-6 text-signal" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div className="font-heading font-bold text-sm" style={{ color: '#f5ede0' }}>Licensed & Insured</div>
              <div className="text-xs mt-1" style={{ color: '#f5ede0', opacity: 0.8 }}>Fully Certified</div>
            </div>

            {/* Years Experience */}
            <div className="flex flex-col items-center text-center p-4 rounded-lg border border-obsidian/10" style={{ backgroundColor: '#674f3d' }}>
              <div className="w-12 h-12 rounded-full bg-signal/20 flex items-center justify-center mb-3">
                <svg className="w-6 h-6 text-signal" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="font-heading font-bold text-sm" style={{ color: '#f5ede0' }}>10+ Years</div>
              <div className="text-xs mt-1" style={{ color: '#f5ede0', opacity: 0.8 }}>Experience</div>
            </div>

            {/* Projects Completed */}
            <div className="flex flex-col items-center text-center p-4 rounded-lg border border-obsidian/10" style={{ backgroundColor: '#674f3d' }}>
              <div className="w-12 h-12 rounded-full bg-signal/20 flex items-center justify-center mb-3">
                <svg className="w-6 h-6 text-signal" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </div>
              <div className="font-heading font-bold text-sm" style={{ color: '#f5ede0' }}>500+ Homes</div>
              <div className="text-xs mt-1" style={{ color: '#f5ede0', opacity: 0.8 }}>Painted</div>
            </div>

            {/* Rating */}
            <div className="flex flex-col items-center text-center p-4 rounded-lg border border-obsidian/10" style={{ backgroundColor: '#674f3d' }}>
              <div className="w-12 h-12 rounded-full bg-signal/20 flex items-center justify-center mb-3">
                <svg className="w-6 h-6 text-signal" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
              </div>
              <div className="font-heading font-bold text-sm" style={{ color: '#f5ede0' }}>4.9★ Rating</div>
              <div className="text-xs mt-1" style={{ color: '#f5ede0', opacity: 0.8 }}>Google Reviews</div>
            </div>
          </div>
        </div>

        {/* Contact - Third Line */}
        <div className="mb-12">
          <h3 className="font-heading font-semibold text-base mb-4" style={{ color: '#35271c' }}>Contact</h3>
          <div className="flex flex-wrap gap-x-8 gap-y-2 text-obsidian/90 text-sm font-body">
            <div>#807, 789 Drake Street, Vancouver, BC V6Z 2N7</div>
            <a href="mailto:jason@boundlesscorp.ca" className="hover:text-chalk transition-colors">
              jason@boundlesscorp.ca
            </a>
            <a
              href="tel:+17782009960"
              className="text-chalk/80 hover:text-signal transition-colors"
            >
              (778) 200-9960
            </a>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-obsidian/20 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex flex-col items-start gap-1">
            <img
              src="https://media.base44.com/images/public/69d9696e29a47b1500cec646/31c14c5ad_boundless-primary-2026-04-26.png"
              alt="Boundless"
              className="h-12 w-auto mb-4"
              loading="lazy"
              decoding="async"
            />
            <p className="text-obsidian/70 text-xs font-body leading-relaxed max-w-md">
              Performance-driven client acquisition systems for local service businesses. Based in Vancouver, Canada.
            </p>
            <div className="text-xs text-obsidian/70 font-body">
              © 2024 Boundless. All rights reserved.
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={scrollToTop}
              className="w-9 h-9 rounded-full border border-obsidian/20 flex items-center justify-center text-obsidian/70 hover:text-chalk hover:border-chalk transition-colors"
              aria-label="Scroll to top"
            >
              <ArrowUp size={16} />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}




























