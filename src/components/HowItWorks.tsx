




const steps = [
  {
    num: '01',
    title: 'We Build Your System',
    desc: 'We create your custom website, set up ads, and install your CRM — all optimized for your local market.',
  },
  {
    num: '02',
    title: 'We Launch Campaigns',
    desc: 'Targeted ads go live, reaching homeowners in your area who are actively searching for painting services.',
  },
  {
    num: '03',
    title: 'Leads Flow In',
    desc: 'Qualified leads hit your pipeline. Automated follow-ups ensure no opportunity is missed.',
  },
  {
    num: '04',
    title: 'You Close More Jobs',
    desc: 'With a full pipeline and streamlined process, you focus on what you do best — delivering great work.',
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="relative py-32 lg:py-48" style={{ backgroundColor: '#35271c' }}>
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div
          style={{
            animation: 'fadeInUp 0.6s ease-out',
          }}
        >
          <div className="font-mono text-xs tracking-wider uppercase mb-4" style={{ color: '#a28b6d' }}>
            03 / How It Works
          </div>
          <h2 className="font-heading font-black text-4xl sm:text-5xl lg:text-6xl tracking-tighter max-w-3xl" style={{ color: '#a28b6d' }}>
            From Zero to Booked.
            <span style={{ color: '#a28b6d', opacity: 0.7 }}> In 4 Steps.</span>
          </h2>
        </div>

        <div className="mt-16 lg:mt-24 relative">
          {/* Connecting line */}
          <div className="hidden lg:block absolute left-[2rem] top-0 bottom-0 w-px" style={{ backgroundColor: '#a28b6d', opacity: 0.3 }} />

          <div className="space-y-0">
            {steps.map((step, i) => (
              <div
                key={step.num}
                className="relative flex gap-8 lg:gap-16 items-start py-10 lg:py-16 border-b last:border-none group"
                style={{
                  animation: `fadeInLeft 0.5s ease-out ${i * 0.1}s both`,
                  borderColor: 'rgba(162, 139, 109, 0.3)',
                }}
              >
                {/* Step number */}
                <div className="relative flex-shrink-0">
                  <div className="w-16 h-16 rounded-full border flex items-center justify-center group-hover:border-primary transition-colors duration-500" style={{ borderColor: '#a28b6d' }}>
                    <span className="font-mono text-sm transition-colors duration-500" style={{ color: '#a28b6d' }}>
                      {step.num}
                    </span>
                  </div>
                </div>

                <div>
                  <h3 className="font-heading font-bold text-2xl lg:text-3xl tracking-tight mb-3 group-hover:text-primary transition-colors duration-500" style={{ color: '#a28b6d' }}>
                    {step.title}
                  </h3>
                  <p className="text-base lg:text-lg leading-relaxed font-body max-w-xl" style={{ color: '#a28b6d', opacity: 0.8 }}>
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes fadeInLeft {
          from {
            opacity: 0;
            transform: translateX(-20px);
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





