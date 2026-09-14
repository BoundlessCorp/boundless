const steps = [
  {
    num: '01',
    title: 'We Diagnose the Bottleneck',
    desc: 'We review your current lead sources, follow-up process, sales workflow, capacity, economics, and tracking before recommending the system to build.',
  },
  {
    num: '02',
    title: 'We Build the Core System',
    desc: 'We configure the agreed CRM, lead capture, follow-up, booking, tracking, and acquisition infrastructure needed for your current stage.',
  },
  {
    num: '03',
    title: 'We Launch & Measure',
    desc: 'Once the system passes QA, we launch the agreed workflows or campaigns and begin collecting real operating data.',
  },
  {
    num: '04',
    title: 'We Improve From Evidence',
    desc: 'We review lead quality, response, pipeline movement, sales outcomes, and bottlenecks, then optimize based on what the data actually shows.',
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="relative py-32 lg:py-48" style={{ backgroundColor: '#35271c' }}>
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div style={{ animation: 'fadeInUp 0.6s ease-out' }}>
          <div className="font-mono text-xs tracking-wider uppercase mb-4" style={{ color: '#a28b6d' }}>03 / How It Works</div>
          <h2 className="font-heading font-black text-4xl sm:text-5xl lg:text-6xl tracking-tighter max-w-3xl" style={{ color: '#a28b6d' }}>
            Diagnose. Build. Measure.
            <span style={{ color: '#a28b6d', opacity: 0.7 }}> Improve.</span>
          </h2>
        </div>

        <div className="mt-16 lg:mt-24 relative">
          <div className="hidden lg:block absolute left-[2rem] top-0 bottom-0 w-px" style={{ backgroundColor: '#a28b6d', opacity: 0.3 }} />
          <div className="space-y-0">
            {steps.map((step, i) => (
              <div
                key={step.num}
                className="relative flex gap-8 lg:gap-16 items-start py-10 lg:py-16 border-b last:border-none group"
                style={{ animation: `fadeInLeft 0.5s ease-out ${i * 0.1}s both`, borderColor: 'rgba(162, 139, 109, 0.3)' }}
              >
                <div className="relative flex-shrink-0">
                  <div className="w-16 h-16 rounded-full border flex items-center justify-center group-hover:border-primary transition-colors duration-500" style={{ borderColor: '#a28b6d' }}>
                    <span className="font-mono text-sm transition-colors duration-500" style={{ color: '#a28b6d' }}>{step.num}</span>
                  </div>
                </div>
                <div>
                  <h3 className="font-heading font-bold text-2xl lg:text-3xl tracking-tight mb-3 group-hover:text-primary transition-colors duration-500" style={{ color: '#a28b6d' }}>{step.title}</h3>
                  <p className="text-base lg:text-lg leading-relaxed font-body max-w-xl" style={{ color: '#a28b6d', opacity: 0.8 }}>{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeInLeft {
          from { opacity: 0; transform: translateX(-20px); }
          to { opacity: 1; transform: translateX(0); }
        }
      `}</style>
    </section>
  );
}
