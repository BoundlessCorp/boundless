




import { TrendingUp, Calendar, Target, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

const results = [
  {
    icon: TrendingUp,
    metric: '3-5x',
    label: 'More Booked Jobs',
    desc: 'Our clients consistently book 3-5x more jobs within the first 90 days of launching their system.',
  },
  {
    icon: Calendar,
    metric: '24/7',
    label: 'Consistent Lead Flow',
    desc: 'No more feast-or-famine cycles. Your pipeline stays full, week after week, month after month.',
  },
  {
    icon: Target,
    metric: '40%+',
    label: 'Higher Close Rates',
    desc: 'Better leads + faster follow-ups = dramatically higher conversion from inquiry to booked job.',
  },
  {
    icon: Clock,
    metric: '10hrs',
    label: 'Saved Per Week',
    desc: 'Automation handles follow-ups, booking, and tracking — so you can focus on the work.',
  },
];

interface ResultsSectionProps {
  painterImage?: string;
}

export default function ResultsSection({ painterImage = "https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=1600&h=900&fit=crop&q=80" }: ResultsSectionProps) {
  return (
    <section id="results" className="relative py-32 lg:py-48 overflow-hidden" style={{ backgroundColor: '#35271c' }}>
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-start">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="relative"
          >
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=800&h=1000&fit=crop&q=80"
                alt="Beautiful freshly painted home interior showcasing professional results"
                className="w-full h-full object-cover"
                loading="lazy"
                decoding="async"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-obsidian/60 via-transparent to-transparent"></div>
            </div>

            {/* Decorative elements */}
            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-signal/20 rounded-full blur-3xl"></div>
            <div className="absolute -top-6 -left-6 w-24 h-24 bg-amber/20 rounded-full blur-2xl"></div>
          </motion.div>

          {/* Right: Results */}
          <div>
            <div
              style={{
                animation: 'fadeInUp 0.6s ease-out',
              }}
            >
              <div className="font-mono text-xs tracking-wider uppercase mb-4" style={{ color: '#a28b6d' }}>
                04 / The Results
              </div>
              <h2 className="font-heading font-black text-4xl sm:text-5xl tracking-tighter" style={{ color: '#a28b6d' }}>
                Results That
                <br />
                <span className="text-primary">Actually Matter.</span>
              </h2>
            </div>

            <div className="mt-12 space-y-8">
              {results.map((result, i) => (
                <div
                  key={result.label}
                  className="flex gap-6 items-start group"
                  style={{
                    animation: `fadeInUp 0.4s ease-out ${i * 0.1}s both`,
                  }}
                >
                  <div className="flex-shrink-0 w-16 h-16 border rounded-lg flex items-center justify-center group-hover:border-primary/40 transition-colors" style={{ backgroundColor: 'rgba(162, 139, 109, 0.1)', borderColor: '#a28b6d' }}>
                    <span className="font-heading font-black text-lg tracking-tighter" style={{ color: '#a28b6d' }}>{result.metric}</span>
                  </div>
                  <div>
                    <h3 className="font-heading font-bold text-lg tracking-tight" style={{ color: '#a28b6d' }}>
                      {result.label}
                    </h3>
                    <p className="text-sm leading-relaxed font-body mt-1" style={{ color: '#a28b6d', opacity: 0.8 }}>
                      {result.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(15px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </section>
  );
}






























