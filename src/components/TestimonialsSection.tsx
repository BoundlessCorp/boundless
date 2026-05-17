

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
            Too Many Great Painters Hit a Ceiling.
            <br />
            <span style={{ color: '#35271c', opacity: 0.7 }}>I Built The System To Break Through It.</span>
          </h2>
          <p className="text-lg leading-relaxed font-semibold" style={{ color: '#35271c' }}>
            You're not struggling because you're bad at painting. You're struggling because every "solution" out there was built by people who've never held a brush, never chased a lead at 9 PM, and never had to choose between paying their crew or their mortgage.
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
                Here's What I Kept Seeing
              </h3>
              <p className="text-base leading-relaxed font-medium" style={{ color: '#35271c' }}>
                Painters landing $50K jobs, delivering flawless work, getting 5-star reviews—and still stuck at the same revenue year after year. The problem wasn't talent. It was the chaos.
              </p>
              <p className="text-base leading-relaxed font-medium" style={{ color: '#35271c' }}>
                <strong>73% of leads never got followed up with.</strong> Websites that looked like they were built in 2003. CRMs that required a PhD to operate. Ad agencies charging $3K/month with zero accountability. And contractors burning out trying to hold it all together with spreadsheets and prayer.
              </p>
              <p className="text-base leading-relaxed font-medium" style={{ color: '#35271c' }}>
                Every "solution" was either <strong>too expensive</strong> (custom builds starting at $15K), <strong>too complicated</strong> (enterprise software built for Fortune 500s), or <strong>too generic</strong> (tools that work for everyone and no one).
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
                The Lightbulb Moment
              </h3>
              <p className="text-base leading-relaxed font-medium" style={{ color: '#35271c' }}>
                The best painting contractors don't need 47 features. They need <strong>5 things that actually work together:</strong> A website that converts. Follow-ups that happen automatically. Lead tracking that takes 30 seconds. Ads that bring qualified leads. And a price that doesn't require a business loan.
              </p>
              <p className="text-base leading-relaxed font-medium" style={{ color: '#35271c' }}>
                So I built Boundless. Not as a fancy SaaS product with a million bells and whistles. But as <strong>the exact system I wish existed</strong> when I started—everything you need to scale past $500K, nothing you don't, at a price that actually makes sense for growing businesses.
              </p>
              <p className="text-base leading-relaxed font-medium" style={{ color: '#35271c' }}>
                <strong>No fluff. No complexity. No BS.</strong> Just a proven system that turns leads into customers while you focus on what you do best: painting.
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
              Built for Painters, Period
            </h4>
            <p className="text-sm leading-relaxed" style={{ color: '#35271c', opacity: 0.8 }}>
              Not for dentists, not for plumbers, not for "any business." Every feature designed for painting contractors who want to scale.
            </p>
          </div>
          <div className="p-6 rounded-xl border-2 shadow-xl" style={{ backgroundColor: '#f5ede0', borderColor: '#35271c' }}>
            <h4 className="font-heading font-bold text-lg mb-2" style={{ color: '#35271c' }}>
              Priced Like You're Human
            </h4>
            <p className="text-sm leading-relaxed" style={{ color: '#35271c', opacity: 0.8 }}>
              Starting at $397/month. Not $15K upfront. Not $5K/month. Premium results at a price that won't bankrupt you.
            </p>
          </div>
          <div className="p-6 rounded-xl border-2 shadow-xl" style={{ backgroundColor: '#f5ede0', borderColor: '#35271c' }}>
            <h4 className="font-heading font-bold text-lg mb-2" style={{ color: '#35271c' }}>
              Zero Learning Curve
            </h4>
            <p className="text-sm leading-relaxed" style={{ color: '#35271c', opacity: 0.8 }}>
              Set up in 7 days. No tech degree required. No 40-hour training. Just simple systems that work from day one.
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
              <span className="font-semibold text-sm" style={{ color: '#35271c' }}>⚡ Founding Member Opportunity</span>
            </div>
            <h3 className="font-heading font-black text-3xl lg:text-4xl tracking-tight mb-4" style={{ color: '#35271c' }}>
              Be One of the First 10. Lock In Founding Pricing Forever.
            </h3>
            <p className="text-lg mb-8 leading-relaxed font-medium" style={{ color: '#35271c', opacity: 0.8 }}>
              I'm looking for 10 painting contractors who are ready to scale but tired of overpaying for garbage results. You'll get <strong>lifetime founding member pricing</strong>, priority support, and direct access to me as we prove this system works. No long-term contracts. Cancel anytime. But your rate? <strong>Locked forever.</strong>
            </p>
            <div className="grid sm:grid-cols-3 gap-4 text-center">
              <div className="bg-chalk/10 rounded-lg p-4">
                <div className="font-heading font-bold text-2xl mb-1" style={{ color: '#35271c' }}>$397/mo</div>
                <div className="text-sm font-medium" style={{ color: '#35271c', opacity: 0.7 }}>Locked Forever (Normally $997)</div>
              </div>
              <div className="bg-chalk/10 rounded-lg p-4">
                <div className="font-heading font-bold text-2xl mb-1" style={{ color: '#35271c' }}>Direct Line</div>
                <div className="text-sm font-medium" style={{ color: '#35271c', opacity: 0.7 }}>To Founder (Not Support Bot)</div>
              </div>
              <div className="bg-chalk/10 rounded-lg p-4">
                <div className="font-heading font-bold text-2xl mb-1" style={{ color: '#35271c' }}>7 Days</div>
                <div className="text-sm font-medium" style={{ color: '#35271c', opacity: 0.7 }}>Fully Built & Launched</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}












