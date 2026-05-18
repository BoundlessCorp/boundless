import { useState, useRef, useEffect } from 'react';
import { ArrowRight, Phone, TrendingUp, Sparkles, CheckCircle, CheckCircle2, DollarSign, Users } from 'lucide-react';
import { motion } from 'framer-motion';
import { PopupModal } from 'react-calendly';

export default function HeroSection() {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement>(null);
  const [stats, setStats] = useState({
    leadsGenerated: 1247,
    activeCampaigns: 23,
    conversionRate: 34,
  });
  const [isCalendlyOpen, setIsCalendlyOpen] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setStats(prev => ({
        leadsGenerated: prev.leadsGenerated + Math.floor(Math.random() * 3),
        activeCampaigns: Math.min(prev.activeCampaigns + Math.floor(Math.random() * 2), 85),
        conversionRate: prev.conversionRate + Math.floor(Math.random() * 2)
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) / rect.width;
    const y = (e.clientY - rect.top - rect.height / 2) / rect.height;
    setTilt({ x: y * -8, y: x * 8 });
  };

  const handleMouseLeave = () => setTilt({ x: 0, y: 0 });

  const scrollToBooking = () => {
    document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToHowItWorks = () => {
    const element = document.getElementById('how-it-works');
    if (element) {
      const headerOffset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20" style={{ backgroundColor: '#faf8f5' }}>
      {/* Background image - Home service business / Marketing */}
      <img
        src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1920&auto=format&fit=crop"
        alt="Professional painting business marketing dashboard showing lead generation and campaign analytics"
        className="absolute inset-0 w-full h-full object-cover opacity-5"
        loading="eager"
        fetchpriority="high"
        width="1920"
        height="1080"
      />
      
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/20" />
      
      {/* Subtle pattern overlay */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
      }} />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-10 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start">
          {/* Left: Headline + CTA */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="text-center lg:text-left"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full mb-6"
            >
              <Sparkles size={16} className="text-primary" />
              <span className="font-heading font-semibold text-sm" style={{ color: '#a28b6d' }}>
                Boundless - Vancouver's Premier Client Acquisition Agency
              </span>
            </motion.div>

            <h1 className="font-heading font-black text-5xl sm:text-6xl lg:text-7xl tracking-tighter leading-[0.95] mb-6">
              More Jobs.
              <br />
              <span className="text-primary">Less Noise.</span>
            </h1>

            <p className="font-body text-lg sm:text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
              We build complete client acquisition systems for local contractors. Get more leads, book more jobs, grow revenue - on autopilot.
            </p>

            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-8"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
            >
              <button
                onClick={() => setIsCalendlyOpen(true)}
                className="group px-8 py-4 rounded-lg font-bold transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2"
                style={{ backgroundColor: '#a28b6d', color: '#35271c', border: '2px solid #35271c' }}
              >
                Get Started Today
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                onClick={scrollToHowItWorks}
                className="group px-8 py-4 rounded-lg font-bold transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2"
                style={{ backgroundColor: 'rgba(162, 139, 109, 0.1)', color: '#a28b6d', border: '2px solid #a28b6d' }}
              >
                How it Works
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </motion.div>

            {/* Trust badges */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="flex flex-wrap items-center justify-center lg:justify-start gap-x-8 gap-y-4 mt-8"
              data-version="v2"
            >
              <div className="flex items-center gap-2">
                <CheckCircle size={20} className="text-green-500" />
                <span className="font-body text-sm text-gray-600">No Long-Term Contracts</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle size={20} className="text-green-500" />
                <span className="font-body text-sm text-gray-600">ROI Guaranteed</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle size={20} className="text-green-500" />
                <span className="font-body text-sm text-gray-600">Full Setup in 14 Days</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Mobile stats card - shows only on mobile */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="lg:hidden -mt-4 mb-12"
          >
            <div className="bg-card border border-border rounded-lg p-6">
              {/* Live indicator */}
              <div className="flex items-center justify-between mb-4">
                <div className="font-mono text-xs text-muted-foreground uppercase tracking-wider">Live Stats</div>
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                  <span className="font-mono text-xs text-green-500">Active</span>
                </div>
              </div>

              {/* Stats grid */}
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-muted/50 rounded-md p-3 text-center">
                  <div className="font-heading font-bold text-foreground text-2xl">47</div>
                  <div className="font-mono text-[10px] text-muted-foreground uppercase mt-1">Leads</div>
                  <div className="font-mono text-xs text-green-500 mt-1">+23%</div>
                </div>
                <div className="bg-muted/50 rounded-md p-3 text-center">
                  <div className="font-heading font-bold text-foreground text-2xl">18</div>
                  <div className="font-mono text-[10px] text-muted-foreground uppercase mt-1">Jobs</div>
                  <div className="font-mono text-xs text-green-500 mt-1">+31%</div>
                </div>
                <div className="bg-muted/50 rounded-md p-3 text-center">
                  <div className="font-heading font-bold text-foreground text-2xl">$82K</div>
                  <div className="font-mono text-[10px] text-muted-foreground uppercase mt-1">Revenue</div>
                  <div className="font-mono text-xs text-green-500 mt-1">+45%</div>
                </div>
              </div>

              {/* Progress bar */}
              <div className="mt-4 pt-4 border-t border-border">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-xs text-muted-foreground">Pipeline Progress</span>
                  <span className="font-mono text-xs text-primary">78%</span>
                </div>
                <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full w-[78%]" />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right: Floating lead card - desktop only */}
          <div
            className="hidden lg:flex lg:items-end lg:justify-center"
            style={{
              animation: 'slideInRight 0.8s ease-out 0.2s both',
            }}
            data-version="v3-centered"
          >
            <div
              ref={cardRef}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              className="relative w-full max-w-xl mx-auto"
              style={{
                perspective: '1000px',
              }}
            >
              <div
                className="bg-card border border-border rounded-lg p-8 transition-transform duration-200 ease-out shadow-2xl"
                style={{
                  transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
                }}
              >
                {/* Simulated Dashboard */}
                <div className="flex items-center justify-between mb-6">
                  <div className="font-mono text-xs text-muted-foreground uppercase tracking-wider">Lead Dashboard — Live</div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                    <span className="font-mono text-xs text-green-500">Active</span>
                  </div>
                </div>

                {/* New lead notification */}
                <div className="bg-primary/10 border border-primary/20 rounded-md p-4 mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                      <TrendingUp size={12} className="text-primary-foreground" />
                    </div>
                    <span className="font-heading font-bold text-primary text-sm">New Estimate Requested</span>
                  </div>
                  <div className="font-body text-foreground text-sm">West Vancouver — Interior Painting</div>
                  <div className="font-mono text-xs text-muted-foreground mt-1">Quote Value: $4,500 · 3 min ago</div>
                </div>

                {/* Stats row */}
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { label: 'Leads This Month', value: '47', trend: '+23%' },
                    { label: 'Booked Jobs', value: '18', trend: '+31%' },
                    { label: 'Revenue', value: '$82K', trend: '+45%' },
                  ].map((stat) => (
                    <div key={stat.label} className="bg-muted/50 rounded-md p-3">
                      <div className="font-mono text-[10px] text-muted-foreground uppercase">{stat.label}</div>
                      <div className="font-heading font-bold text-foreground text-xl mt-1">{stat.value}</div>
                      <div className="font-mono text-xs text-green-500">{stat.trend}</div>
                    </div>
                  ))}
                </div>

                {/* Pipeline */}
                <div className="mt-4 pt-4 border-t border-border">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-xs text-muted-foreground">Pipeline Progress</span>
                    <span className="font-mono text-xs text-primary">78%</span>
                  </div>
                  <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full w-[78%]" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Calendly Popup Modal */}
      <PopupModal
        url="https://calendly.com/jason-boundlesscorp/30min"
        onModalClose={() => setIsCalendlyOpen(false)}
        open={isCalendlyOpen}
        rootElement={typeof document !== 'undefined' ? document.body : undefined}
      />
    </section>
  );
}










































