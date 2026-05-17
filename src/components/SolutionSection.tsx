import { Megaphone, Globe, Zap, BarChart3 } from 'lucide-react';
import { motion } from 'framer-motion';

const pillars = [
  {
    icon: Megaphone,
    code: 'ADS',
    title: 'Targeted Ads',
    desc: 'Precision-targeted Meta campaigns that put your business in front of homeowners who need painting — right now.',
    specs: ['Meta / Instagram Ads', 'Local Geo-Targeting', 'A/B Testing', 'Budget Optimization'],
  },
  {
    icon: Globe,
    code: 'WEB',
    title: 'Converting Website',
    desc: 'A high-speed, mobile-first website engineered for one thing: turning visitors into booked estimates.',
    specs: ['Mobile Optimized', 'Speed < 2s', 'Clear CTAs', 'Quote Request Forms'],
  },
  {
    icon: Zap,
    code: 'AUTO',
    title: 'Smart Automation',
    desc: 'Automated SMS and email follow-ups that capture every lead — even when you\'re on a job site.',
    specs: ['Missed Call Text-Back', 'Auto Follow-Ups', 'Appointment Booking', 'Pipeline Tracking'],
  },
  {
    icon: BarChart3,
    code: 'CRM',
    title: 'Lead Management',
    desc: 'A simple, powerful CRM built for contractors — see every lead, every job, every dollar in one place.',
    specs: ['Lead Dashboard', 'Job Pipeline', 'Revenue Tracking', 'Performance Reports'],
  },
];

interface SolutionSectionProps {
  dashboardImage?: string;
}

export default function SolutionSection({ dashboardImage }: SolutionSectionProps) {
  return (
    <section id="solution" className="relative py-32 lg:py-48 overflow-hidden" style={{ backgroundColor: '#a28b6d' }}>
      {/* Decorative elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 left-0 w-96 h-96 bg-obsidian/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-obsidian/10 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="font-mono text-xs tracking-wider uppercase mb-4" style={{ color: '#35271c' }}>
            02 / The Solution
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-obsidian">
            Your All-in-One Growth Solution
          </h2>
          <p className="text-xl max-w-3xl mx-auto text-obsidian/80">
            Everything you need to attract, convert, and delight customers—automated and optimized for painting contractors.
          </p>
        </motion.div>

        {/* System pillars */}
        <div className="grid md:grid-cols-2 gap-6 mt-16 lg:mt-24">
          {pillars.map((pillar, i) => (
            <div
              key={pillar.code}
              className="group relative bg-chalk border border-obsidian/10 rounded-lg p-8 lg:p-10 hover:border-primary/30 transition-all duration-500 overflow-hidden"
              style={{
                animation: `fadeInUp 0.5s ease-out ${i * 0.1}s both`,
              }}
            >
              {/* Blueprint grid on hover */}
              <div 
                className="absolute inset-0 opacity-0 group-hover:opacity-[0.03] transition-opacity duration-500"
                style={{
                  backgroundImage: `linear-gradient(#FF6B00 1px, transparent 1px), linear-gradient(90deg, #FF6B00 1px, transparent 1px)`,
                  backgroundSize: '20px 20px',
                }}
              />

              <div className="relative">
                <div className="flex items-start justify-between mb-6">
                  <pillar.icon className="text-primary" size={32} strokeWidth={1.5} />
                  <span className="font-mono text-xs text-steel">{pillar.code}</span>
                </div>
                <h3 className="font-heading font-bold text-obsidian text-2xl tracking-tight mb-3">
                  {pillar.title}
                </h3>
                <p className="text-steel text-base leading-relaxed font-body mb-6">
                  {pillar.desc}
                </p>
                <div className="flex flex-wrap gap-2">
                  {pillar.specs.map((spec) => (
                    <span
                      key={spec}
                      className="font-mono text-[11px] text-obsidian/60 bg-obsidian/5 px-3 py-1.5 rounded-md"
                    >
                      {spec}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Dashboard image */}
        {dashboardImage && (
          <div
            className="mt-16 lg:mt-24 rounded-lg overflow-hidden border border-foreground/10 shadow-xl"
            style={{
              animation: 'fadeInUp 0.7s ease-out 0.4s both',
            }}
          >
            <img
              src={dashboardImage}
              alt="Boundless CRM dashboard showing automated lead management, campaign tracking, and business analytics for painting contractors"
              className="w-full h-auto rounded-xl shadow-2xl border-4 border-signal/20"
              loading="lazy"
              width="1200"
              height="800"
            />
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </section>
  );
}












