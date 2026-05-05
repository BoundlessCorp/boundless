import { AlertTriangle, Clock, DollarSign, PhoneOff } from 'lucide-react';

const problems = [
  {
    icon: Clock,
    label: 'Inconsistent Leads',
    desc: 'One month is great, the next is dead. You can\'t plan your business around hope.',
  },
  {
    icon: PhoneOff,
    label: 'Relying on Referrals',
    desc: 'Word-of-mouth is nice, but it\'s not a system. You need a predictable pipeline.',
  },
  {
    icon: DollarSign,
    label: 'Wasting Money on Bad Marketing',
    desc: 'You\'ve tried the guy on Facebook, the SEO company, the Yelp ads — nothing stuck.',
  },
  {
    icon: AlertTriangle,
    label: 'No Follow-Up System',
    desc: 'Leads come in and fall through the cracks. No one\'s calling back fast enough.',
  },
];

export default function ProblemSection() {
  return (
    <section id="problem" className="relative py-32 lg:py-48 overflow-hidden" style={{ backgroundColor: '#a28b6d' }}>
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1600&h=900&fit=crop&q=80"
          alt=""
          className="absolute inset-0 w-full h-full object-cover opacity-10"
          loading="lazy"
          decoding="async"
        />
        <div className="absolute inset-0" style={{ 
          background: 'linear-gradient(to bottom, #a28b6d, rgba(162, 139, 109, 0.95), #a28b6d)' 
        }} />
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-10 relative z-10">
        <div
          style={{
            animation: 'fadeInUp 0.6s ease-out',
          }}
        >
          <div className="font-mono text-xs tracking-wider uppercase mb-4" style={{ color: '#35271c' }}>
            01 / The Problem
          </div>
          <h2 className="font-heading font-black text-4xl sm:text-5xl lg:text-6xl tracking-tighter max-w-3xl" style={{ color: '#35271c' }}>
            You're Leaving Money on the Table.
            <span className="opacity-70"> Every Single Day.</span>
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 gap-px bg-border mt-16 lg:mt-24 border border-border">
          {problems.map((problem, i) => (
            <div
              key={problem.label}
              className="p-8 lg:p-12 group hover:bg-card transition-colors duration-500"
              style={{
                animation: `fadeInUp 0.5s ease-out ${i * 0.1}s both`,
                backgroundColor: '#a28b6d'
              }}
            >
              <problem.icon className="text-primary mb-6" size={28} strokeWidth={1.5} />
              <h3 className="font-heading font-bold text-xl lg:text-2xl tracking-tight mb-3" style={{ color: '#35271c' }}>
                {problem.label}
              </h3>
              <p className="text-base leading-relaxed font-body" style={{ color: '#35271c', opacity: 0.8 }}>
                {problem.desc}
              </p>
            </div>
          ))}
        </div>
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











