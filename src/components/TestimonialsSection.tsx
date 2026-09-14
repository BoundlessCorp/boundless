import { motion } from 'framer-motion';

export default function TestimonialsSection() {
  return (
    <section id="testimonials" className="relative py-32 lg:py-48" style={{ backgroundColor: '#a28b6d' }}>
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mb-16"
        >
          <div className="inline-flex items-center gap-3 mb-6">
            <span className="font-mono text-sm font-medium tracking-wider" style={{ color: '#35271c' }}>
              05 / Why Boundless Exists
            </span>
          </div>
          <h2 className="font-heading font-black text-4xl sm:text-5xl lg:text-6xl tracking-tighter mb-6" style={{ color: '#35271c' }}>
            Great Painting Companies Shouldn't Have to Run on Guesswork.
          </h2>
          <p className="text-lg leading-relaxed font-semibold" style={{ color: '#35271c' }}>
            Boundless is being built around a simple idea: give painting companies a clearer system for generating, capturing, following up with, and measuring opportunities — without adding unnecessary complexity.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 mb-20">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-6"
          >
            <div className="space-y-4">
              <h3 className="font-heading font-bold text-2xl" style={{ color: '#35271c' }}>The Problem We Care About</h3>
              <p className="text-base leading-relaxed font-medium" style={{ color: '#35271c' }}>
                Many painting businesses still rely heavily on referrals, scattered inboxes, inconsistent follow-up, and marketing activity that is difficult to connect back to real sales opportunities.
              </p>
              <p className="text-base leading-relaxed font-medium" style={{ color: '#35271c' }}>
                The issue is not always a lack of effort. It is often a lack of visibility, process, and coordination between marketing, lead response, estimating, follow-up, and reporting.
              </p>
              <p className="text-base leading-relaxed font-medium" style={{ color: '#35271c' }}>
                Boundless is designed to help organize those moving parts into one operating system that can be measured and improved over time.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="space-y-6"
          >
            <div className="space-y-4">
              <h3 className="font-heading font-bold text-2xl" style={{ color: '#35271c' }}>The Boundless Approach</h3>
              <p className="text-base leading-relaxed font-medium" style={{ color: '#35271c' }}>
                We focus on the parts that have to work together: acquisition, lead capture, follow-up, pipeline visibility, automation, and measurement.
              </p>
              <p className="text-base leading-relaxed font-medium" style={{ color: '#35271c' }}>
                We diagnose the business first, then recommend the system that fits its current bottleneck, economics, capacity, and growth goals.
              </p>
              <p className="text-base leading-relaxed font-medium" style={{ color: '#35271c' }}>
                The goal is not to promise a fixed result. The goal is to build a cleaner, more measurable growth process and improve it using real operating data.
              </p>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="grid sm:grid-cols-3 gap-6 mb-20"
        >
          <div className="p-6 rounded-xl border-2 shadow-xl" style={{ backgroundColor: '#f5ede0', borderColor: '#35271c' }}>
            <h4 className="font-heading font-bold text-lg mb-2" style={{ color: '#35271c' }}>Painting Focus</h4>
            <p className="text-sm leading-relaxed" style={{ color: '#35271c', opacity: 0.8 }}>
              Built around the sales and growth workflow of painting companies rather than a generic one-size-fits-all agency model.
            </p>
          </div>
          <div className="p-6 rounded-xl border-2 shadow-xl" style={{ backgroundColor: '#f5ede0', borderColor: '#35271c' }}>
            <h4 className="font-heading font-bold text-lg mb-2" style={{ color: '#35271c' }}>Launch Pricing</h4>
            <p className="text-sm leading-relaxed" style={{ color: '#35271c', opacity: 0.8 }}>
              Current launch packages start at $497/month, with larger systems available as business needs and scope increase.
            </p>
          </div>
          <div className="p-6 rounded-xl border-2 shadow-xl" style={{ backgroundColor: '#f5ede0', borderColor: '#35271c' }}>
            <h4 className="font-heading font-bold text-lg mb-2" style={{ color: '#35271c' }}>Founder-Led</h4>
            <p className="text-sm leading-relaxed" style={{ color: '#35271c', opacity: 0.8 }}>
              Early clients work directly with the founder while Boundless builds and improves its operating playbook from real evidence.
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="rounded-2xl p-8 lg:p-12 border-2 shadow-xl mt-20"
          style={{ backgroundColor: '#f5ede0', borderColor: '#35271c' }}
        >
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-primary/20 px-4 py-2 rounded-full mb-6">
              <span className="font-semibold text-sm" style={{ color: '#35271c' }}>⚡ Early Partner Opportunity</span>
            </div>
            <h3 className="font-heading font-black text-3xl lg:text-4xl tracking-tight mb-4" style={{ color: '#35271c' }}>
              Help Shape the Boundless Growth System.
            </h3>
            <p className="text-lg mb-8 leading-relaxed font-medium" style={{ color: '#35271c', opacity: 0.8 }}>
              We are looking for a small number of qualified Vancouver-area painting companies that want direct founder involvement, structured implementation, transparent reporting, and the opportunity to help us refine the system with real-world feedback.
            </p>
            <div className="grid sm:grid-cols-3 gap-4 text-center">
              <div className="bg-chalk/10 rounded-lg p-4">
                <div className="font-heading font-bold text-2xl mb-1" style={{ color: '#35271c' }}>Founder-Led</div>
                <div className="text-sm font-medium" style={{ color: '#35271c', opacity: 0.7 }}>Direct involvement during early implementation</div>
              </div>
              <div className="bg-chalk/10 rounded-lg p-4">
                <div className="font-heading font-bold text-2xl mb-1" style={{ color: '#35271c' }}>Measured</div>
                <div className="text-sm font-medium" style={{ color: '#35271c', opacity: 0.7 }}>Clear tracking and evidence-based review</div>
              </div>
              <div className="bg-chalk/10 rounded-lg p-4">
                <div className="font-heading font-bold text-2xl mb-1" style={{ color: '#35271c' }}>Iterative</div>
                <div className="text-sm font-medium" style={{ color: '#35271c', opacity: 0.7 }}>System improvements based on real operating data</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
