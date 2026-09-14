import { Check, ShieldCheck, ArrowRight, Sparkles, Clock3, UserRound } from 'lucide-react';
import { motion } from 'framer-motion';

const included = [
  'CRM & lead pipeline setup',
  'Lead capture and follow-up workflows',
  'Appointment booking infrastructure',
  'Missed-call and response automation where appropriate',
  'Campaign and conversion tracking setup',
  'Monthly optimization and reporting',
  'Founder-led strategy and implementation',
];

const OfferSection = () => {
  const standards = [
    {
      icon: ShieldCheck,
      title: 'Evidence Over Hype',
      description: 'We do not promise guaranteed leads, jobs, revenue, ROAS, or profit. Decisions are made from the evidence the account produces.'
    },
    {
      icon: Clock3,
      title: 'Structured Implementation',
      description: 'Implementation follows a defined onboarding, access, tracking, CRM, QA, and launch process rather than a rushed one-size-fits-all timeline.'
    },
    {
      icon: UserRound,
      title: 'Founder-Led at Launch',
      description: 'Early Boundless clients work directly with the founder during implementation, review, and optimization.'
    }
  ];

  return (
    <section id="offer" className="relative py-20 bg-obsidian overflow-hidden">
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-signal rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-amber rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto bg-chalk rounded-2xl shadow-2xl overflow-hidden border border-steel/20"
        >
          <div className="grid md:grid-cols-2 gap-0">
            <div className="p-8 md:p-12">
              <div className="font-mono text-xs tracking-wider uppercase mb-4" style={{ color: '#a28b6d' }}>
                06 / Launch Offer
              </div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6" style={{ backgroundColor: 'rgba(162, 139, 109, 0.1)', color: '#a28b6d' }}>
                <Sparkles className="w-4 h-4" />
                <span className="font-semibold text-sm">Launch Pricing</span>
              </div>

              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6" style={{ color: '#35271c' }}>
                Starting from $497/month
              </h2>

              <p className="mt-6 text-base md:text-lg font-body leading-relaxed" style={{ color: '#35271c', opacity: 0.8 }}>
                Boundless builds the systems behind lead capture, follow-up, pipeline visibility, acquisition, and measurement. The exact setup depends on your current bottleneck, package, and business readiness.
              </p>
            </div>

            <div className="p-8 md:p-12 rounded-lg" style={{ backgroundColor: '#f5ede0', border: '1px solid rgba(53, 39, 28, 0.1)' }}>
              <div className="font-mono text-xs uppercase tracking-wider mb-6" style={{ color: '#7a6552' }}>
                What We Build Around
              </div>
              <div className="space-y-4">
                {included.map((item) => (
                  <div key={item} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: 'rgba(162, 139, 109, 0.15)' }}>
                      <Check size={12} style={{ color: '#a28b6d' }} />
                    </div>
                    <span className="font-body text-sm md:text-base" style={{ color: '#35271c' }}>{item}</span>
                  </div>
                ))}
              </div>

              <div className="mt-8 pt-8" style={{ borderTop: '1px solid rgba(53, 39, 28, 0.1)' }}>
                <a
                  href="https://go.boundlesscorp.ca/widget/bookings/boundless-growth-call"
                  className="group w-full relative font-heading font-bold text-sm md:text-base py-4 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 border"
                  style={{ backgroundColor: '#a28b6d', borderColor: '#35271c', color: '#35271c' }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#c4935a'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#a28b6d'}
                >
                  <span className="group-hover:opacity-0 transition-opacity">Book a Free Discovery Call</span>
                  <span className="absolute inset-0 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    See What Fits <ArrowRight size={18} />
                  </span>
                </a>
                <p className="text-center text-xs font-mono mt-4" style={{ color: '#7a6552' }}>
                  Free discovery call · No obligation · 30 minutes
                </p>
              </div>
            </div>
          </div>

          <div className="border-t px-8 md:px-12 py-8 md:py-10" style={{ borderColor: 'rgba(53, 39, 28, 0.1)', backgroundColor: 'rgba(245, 237, 224, 0.5)' }}>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {standards.map((standard, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="inline-flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-full mb-3 shadow-lg" style={{ backgroundColor: '#ffffff' }}>
                    <standard.icon className="w-6 h-6 md:w-7 md:h-7" style={{ color: '#a28b6d' }} />
                  </div>
                  <h3 className="text-base md:text-lg font-bold mb-2 leading-tight" style={{ color: '#35271c' }}>{standard.title}</h3>
                  <p className="text-xs md:text-sm leading-relaxed" style={{ color: '#35271c', opacity: 0.7 }}>{standard.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default OfferSection;
