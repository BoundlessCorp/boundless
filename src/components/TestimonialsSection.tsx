


import { motion } from 'framer-motion';
import { Quote, Star } from 'lucide-react';

export default function TestimonialsSection() {
  return (
    <section id="testimonials" className="relative py-32 lg:py-48" style={{ backgroundColor: '#a28b6d' }}>
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mb-16"
        >
          <div className="inline-flex items-center gap-3 mb-6">
            <span className="font-mono text-sm font-medium tracking-wider" style={{ color: '#35271c' }}>
              05 / Why I Built This
            </span>
          </div>
          <h2 className="font-heading font-black text-4xl sm:text-5xl lg:text-6xl tracking-tighter mb-6" style={{ color: '#35271c' }}>
            I've Been In Your Shoes.
            <br />
            <span style={{ color: '#35271c', opacity: 0.7 }}>And I Know What Works.</span>
          </h2>
          <p className="text-lg leading-relaxed" style={{ color: '#35271c' }}>
            I didn't build Boundless because I thought it would be cool. I built it because I watched too many talented painters struggle with the same problems—leads that don't convert, systems held together with duct tape, and growth that feels impossible without working 80-hour weeks.
          </p>
        </motion.div>

        {/* Story Content */}
        <div className="grid lg:grid-cols-2 gap-12 mb-20">
          {/* Left Column - The Problem */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-6"
          >
            <div className="space-y-4">
              <h3 className="font-heading font-bold text-2xl" style={{ color: '#35271c' }}>
                The Breaking Point
              </h3>
              <p className="text-base leading-relaxed" style={{ color: '#35271c' }}>
                I saw painters landing jobs, delivering incredible work, and still struggling to grow. The problem wasn't the quality—it was everything else. The scattered tools, the manual follow-ups, the websites that didn't convert, the leads that went cold.
              </p>
              <p className="text-base leading-relaxed" style={{ color: '#35271c' }}>
                Every "solution" out there was either too expensive, too complicated, or built by people who'd never actually run a painting business. So contractors were stuck choosing between generic tools that didn't fit or custom solutions they couldn't afford.
              </p>
            </div>
          </motion.div>

          {/* Right Column - The Solution */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="space-y-6"
          >
            <div className="space-y-4">
              <h3 className="font-heading font-bold text-2xl" style={{ color: '#35271c' }}>
                What I Realized
              </h3>
              <p className="text-base leading-relaxed" style={{ color: '#35271c' }}>
                The best painting contractors don't need more features—they need a system that actually works together. A website that converts. Follow-up that happens automatically. Lead tracking that's dead simple. And most importantly, something they can actually afford.
              </p>
              <p className="text-base leading-relaxed" style={{ color: '#35271c' }}>
                So I built Boundless. Not as a fancy tech product, but as the growth system I wish existed when I started. Everything you need to scale your painting business, nothing you don't, at a price that actually makes sense.
              </p>
            </div>
          </motion.div>
        </div>

        {/* Key Principles */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="grid sm:grid-cols-3 gap-6 mb-20"
        >
          <div className="p-6 rounded-xl border-2 shadow-xl" style={{ backgroundColor: '#f5ede0', borderColor: '#35271c' }}>
            <h4 className="font-heading font-bold text-lg mb-2" style={{ color: '#35271c' }}>
              Built for Painters
            </h4>
            <p className="text-sm leading-relaxed" style={{ color: '#35271c', opacity: 0.8 }}>
              Every feature designed specifically for painting contractors, not generic businesses.
            </p>
          </div>
          <div className="p-6 rounded-xl border-2 shadow-xl" style={{ backgroundColor: '#f5ede0', borderColor: '#35271c' }}>
            <h4 className="font-heading font-bold text-lg mb-2" style={{ color: '#35271c' }}>
              Actually Affordable
            </h4>
            <p className="text-sm leading-relaxed" style={{ color: '#35271c', opacity: 0.8 }}>
              Premium results at a price that makes sense for growing businesses.
            </p>
          </div>
          <div className="p-6 rounded-xl border-2 shadow-xl" style={{ backgroundColor: '#f5ede0', borderColor: '#35271c' }}>
            <h4 className="font-heading font-bold text-lg mb-2" style={{ color: '#35271c' }}>
              No Complexity
            </h4>
            <p className="text-sm leading-relaxed" style={{ color: '#35271c', opacity: 0.8 }}>
              Simple systems that work, without the learning curve or tech headaches.
            </p>
          </div>
        </motion.div>

        {/* Founding Member Box */}
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
              <span className="font-semibold text-sm" style={{ color: '#35271c' }}>Founding Member Opportunity</span>
            </div>
            <h3 className="font-heading font-black text-3xl lg:text-4xl tracking-tight mb-4" style={{ color: '#35271c' }}>
              Help Me Prove This Works—And Get Rewarded for It
            </h3>
            <p className="text-lg mb-8 leading-relaxed" style={{ color: '#35271c', opacity: 0.8 }}>
              I'm looking for 10 painting contractors who are ready to grow but frustrated with the options out there. You'll get lifetime founding member pricing, priority support, and direct access to me as we build this together.
            </p>
            <div className="grid sm:grid-cols-3 gap-4 text-center">
              <div className="bg-chalk/10 rounded-lg p-4">
                <div className="font-heading font-bold text-2xl mb-1" style={{ color: '#35271c' }}>$397/mo</div>
                <div className="text-sm" style={{ color: '#35271c', opacity: 0.7 }}>Founding Rate (Locked Forever)</div>
              </div>
              <div className="bg-chalk/10 rounded-lg p-4">
                <div className="font-heading font-bold text-2xl mb-1" style={{ color: '#35271c' }}>Priority</div>
                <div className="text-sm" style={{ color: '#35271c', opacity: 0.7 }}>Direct Access to Founder</div>
              </div>
              <div className="bg-chalk/10 rounded-lg p-4">
                <div className="font-heading font-bold text-2xl mb-1" style={{ color: '#35271c' }}>7 Days</div>
                <div className="text-sm" style={{ color: '#35271c', opacity: 0.7 }}>Full Setup & Launch</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}







