import { ArrowUp, MapPin, UserRound, Paintbrush, Workflow } from 'lucide-react';
import { baseUrl } from '../lib/base-url';

export default function Footer() {
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

  const trustSignals = [
    {
      icon: MapPin,
      title: 'Vancouver-Based',
      subtitle: 'Local Market Focus',
    },
    {
      icon: UserRound,
      title: 'Founder-Led',
      subtitle: 'Direct Involvement',
    },
    {
      icon: Paintbrush,
      title: 'Built for Painters',
      subtitle: 'Industry Focused',
    },
    {
      icon: Workflow,
      title: 'Systems First',
      subtitle: 'CRM + Automation',
    },
  ];

  return (
    <footer className="relative bg-obsidian border-t border-border">
      <div className="max-w-6xl mx-auto px-6 lg:px-8 py-16" style={{ backgroundColor: '#a28b6d' }}>
        {/* Navigation - First Line */}
        <div className="mb-8">
          <h3 className="font-heading font-semibold text-base mb-4" style={{ color: '#35271c' }}>Navigation</h3>
          <div className="flex flex-wrap gap-x-8 gap-y-2">
            <button onClick={() => scrollTo('hero')} className="text-obsidian/90 hover:text-obsidian text-sm font-body transition-colors">Home</button>
            <button onClick={() => scrollTo('how-it-works')} className="text-obsidian/90 hover:text-obsidian text-sm font-body transition-colors">How It Works</button>
            <button onClick={() => scrollTo('results')} className="text-obsidian/90 hover:text-obsidian text-sm font-body transition-colors">Outcomes</button>
            <button onClick={() => scrollTo('testimonials')} className="text-obsidian/90 hover:text-obsidian text-sm font-body transition-colors">Why Boundless</button>
            <button onClick={() => handleNavigation(`${baseUrl}/pricing`)} className="text-obsidian/90 hover:text-obsidian text-sm font-body transition-colors">Pricing</button>
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
              { label: 'Strategy & Optimization', id: 'offer' },
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

        {/* Trust Signals */}
        <div className="mb-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {trustSignals.map((signal) => (
              <div
                key={signal.title}
                className="flex flex-col items-center text-center p-4 rounded-lg border border-obsidian/10"
                style={{ backgroundColor: '#674f3d' }}
              >
                <div className="w-12 h-12 rounded-full bg-signal/20 flex items-center justify-center mb-3">
                  <signal.icon className="w-6 h-6 text-signal" />
                </div>
                <div className="font-heading font-bold text-sm" style={{ color: '#f5ede0' }}>{signal.title}</div>
                <div className="text-xs mt-1" style={{ color: '#f5ede0', opacity: 0.8 }}>{signal.subtitle}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Contact - Third Line */}
        <div className="mb-12">
          <h3 className="font-heading font-semibold text-base mb-4" style={{ color: '#35271c' }}>Contact</h3>
          <div className="flex flex-wrap gap-x-8 gap-y-2 text-obsidian/90 text-sm font-body">
            <div>#807, 789 Drake Street, Vancouver, BC V6Z 2N7</div>
            <a href="mailto:jason@boundlesscorp.ca" className="hover:text-chalk transition-colors">jason@boundlesscorp.ca</a>
            <a href="tel:+17782009960" className="text-chalk/80 hover:text-signal transition-colors">(778) 200-9960</a>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-obsidian/20 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex flex-col items-start gap-1">
            <img
              src="https://media.base44.com/images/public/69d9696e29a47b1500cec646/31c14c5ad_boundless-primary-2026-04-26.png"
              alt="Boundless Logo"
              className="h-12 w-auto mb-4"
              loading="lazy"
              width="120"
              height="48"
            />
            <p className="text-obsidian/70 text-xs font-body leading-relaxed max-w-md">
              Client acquisition, CRM, and automation systems for painting companies. Based in Vancouver, Canada.
            </p>
            <div className="text-xs text-obsidian/70 font-body">© 2026 Boundless. All rights reserved.</div>
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
