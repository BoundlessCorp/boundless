import { Check, ArrowRight, Sparkles, Phone } from 'lucide-react';
import { motion } from 'framer-motion';
import { baseUrl } from '../lib/base-url';
import { useState } from 'react';

const packages = [
  {
    name: 'Starter',
    subtitle: 'Stop Losing Leads',
    price: '$397',
    period: '/month',
    paymentLink: 'https://buy.stripe.com/14A00jdyhg4kcnZ5Dx3Nm07', // Your Stripe Payment Link
    description: 'Best for businesses that already get inquiries but are not consistently following up or converting them.',
    outcome: 'Turn more of your existing leads into paying customers',
    features: [
      'CRM system setup',
      'Lead capture forms',
      'Missed call text-back automation',
      'Basic SMS and email follow-up',
      'Simple pipeline to track leads',
    ],
    cta: 'Get Started',
    popular: false,
  },
  {
    name: 'Growth',
    subtitle: 'Consistent Leads & Booked Appointments',
    price: '$1,200',
    period: '/month',
    paymentLink: 'https://buy.stripe.com/6oU5kD2TDf0g0Fhc1V3Nm08', // Add your Growth package Stripe Payment Link here
    badge: 'Most Popular',
    description: 'Best for businesses that want predictable monthly lead flow and booked appointments.',
    outcome: 'Generate consistent new leads and booked calls every month',
    features: [
      'Everything in Starter',
      'High-converting funnel (landing page + offer)',
      'Automated appointment booking system',
      'Advanced SMS and email follow-up sequences',
      'Review generation system',
      'Lead tracking dashboard',
    ],
    cta: 'Get More Clients',
    popular: true,
  },
  {
    name: 'Scale',
    subtitle: 'Fully Automated Growth Machine',
    price: '$2,500',
    period: '/month',
    paymentLink: 'https://buy.stripe.com/9B6eVd8dXf0g5ZB7LF3Nm0a', // Your Stripe Payment Link
    description: 'Best for businesses that want everything handled and want to scale aggressively.',
    outcome: 'Fully automated and optimized system to scale your business',
    features: [
      'Everything in Growth',
      'Full ad management (Facebook and Google)',
      'AI chatbot for lead qualification',
      'Advanced multi-step automations',
      'Database reactivation campaigns',
      'Monthly strategy and optimization',
    ],
    cta: 'Scale My Business',
    popular: false,
  },
];

const PricingSection = () => {
  const handlePurchase = (paymentLink: string, packageName: string) => {
    if (!paymentLink) {
      alert('Payment link not configured yet. Please contact support.');
      return;
    }
    
    // Track the click in analytics if available
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'begin_checkout', {
        event_category: 'Ecommerce',
        event_label: packageName,
      });
    }
    
    // Redirect to Stripe Payment Link
    window.location.href = paymentLink;
  };

  const scrollToBooking = () => {
    // Navigate to home page and scroll to booking
    window.location.href = `${baseUrl}/#booking`;
  };

  return (
    <section id="pricing" className="relative py-20 overflow-hidden" style={{ backgroundColor: '#a28b6d' }}>
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-chalk rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-obsidian rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <div className="font-mono text-xs tracking-wider uppercase mb-4" style={{ color: '#35271c' }}>
            07 / Pricing Plans
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-obsidian">
            Simple, Scalable Systems to Get You More Leads & Booked Clients
          </h2>
          <p className="text-lg md:text-xl text-obsidian/80 font-body">
            We build automated systems that capture, follow up with, and convert your leads into paying customers.
          </p>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto mb-16">
          {packages.map((pkg, index) => (
            <motion.div
              key={pkg.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className={`relative rounded-2xl p-8 transition-all duration-300 flex flex-col h-full ${
                pkg.popular
                  ? 'bg-white border-2 shadow-2xl scale-105 md:scale-110'
                  : 'bg-chalk border border-obsidian/20 shadow-lg hover:shadow-xl hover:border-obsidian/40'
              }`}
              style={pkg.popular ? { borderColor: '#35271c' } : {}}
            >
              {/* Popular Badge */}
              {pkg.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full shadow-lg" style={{ backgroundColor: '#35271c', color: '#f5ede0' }}>
                    <Sparkles className="w-4 h-4" />
                    <span className="font-bold text-sm">{pkg.badge}</span>
                  </div>
                </div>
              )}

              {/* Package Header */}
              <div className="mb-6">
                <h3 className={`text-2xl font-bold mb-2 ${pkg.popular ? 'text-obsidian' : 'text-obsidian'}`}>
                  {pkg.name}
                </h3>
                <p className={`text-sm font-semibold mb-4 ${pkg.popular ? 'text-obsidian/70' : 'text-obsidian/70'}`}>
                  {pkg.subtitle}
                </p>
                
                <div className="flex items-baseline mb-4">
                  <span className={`text-5xl font-bold ${pkg.popular ? 'text-obsidian' : 'text-obsidian'}`}>
                    {pkg.price}
                  </span>
                  <span className={`ml-2 ${pkg.popular ? 'text-obsidian/60' : 'text-obsidian/60'}`}>
                    {pkg.period}
                  </span>
                </div>

                <p className={`text-sm leading-relaxed ${pkg.popular ? 'text-obsidian/70' : 'text-obsidian/70'}`}>
                  {pkg.description}
                </p>
              </div>

              {/* Features */}
              <div className="space-y-3 mb-8 flex-grow">
                {pkg.features.map((feature) => (
                  <div key={feature} className="flex items-start gap-3">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                      pkg.popular ? 'bg-obsidian/10' : 'bg-obsidian/10'
                    }`}>
                      <Check size={12} className={pkg.popular ? 'text-obsidian' : 'text-obsidian'} />
                    </div>
                    <span className={`text-sm ${pkg.popular ? 'text-obsidian' : 'text-obsidian'}`}>
                      {feature}
                    </span>
                  </div>
                ))}
              </div>

              {/* Outcome Statement */}
              <div className={`p-4 rounded-lg mb-6 ${
                pkg.popular ? 'bg-obsidian/5 border border-obsidian/20' : 'bg-obsidian/5 border border-obsidian/20'
              }`}>
                <p className={`text-sm font-semibold italic ${pkg.popular ? 'text-obsidian' : 'text-obsidian'}`}>
                  "{pkg.outcome}"
                </p>
              </div>

              {/* CTA Button */}
              <button
                onClick={() => handlePurchase(pkg.paymentLink, pkg.name)}
                className="group w-full font-heading font-bold text-base py-4 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 shadow-lg border"
                style={{ backgroundColor: '#a28b6d', borderColor: '#35271c', color: '#35271c' }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#937d5f')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#a28b6d')}
              >
                <span>{pkg.cta}</span>
                <ArrowRight size={18} className="opacity-0 group-hover:opacity-100 transition-opacity -ml-2 group-hover:ml-0" />
              </button>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto text-center bg-chalk rounded-2xl p-8 md:p-12 shadow-xl border border-obsidian/20"
        >
          <Phone className="w-12 h-12 text-obsidian mx-auto mb-6" />
          <h3 className="text-2xl md:text-3xl font-bold mb-4 text-obsidian">
            Not Sure Which Plan is Right for You?
          </h3>
          <p className="text-lg text-obsidian/70 mb-8 font-body">
            We'll walk you through exactly what your business needs and show you how this can generate ROI before you commit.
          </p>
          <a
            href="https://calendly.com/jason-boundlesscorp/30min"
            className="group inline-flex items-center gap-2 font-heading font-bold text-lg px-8 py-4 rounded-lg transition-all duration-300 shadow-lg border"
            style={{ backgroundColor: '#a28b6d', borderColor: '#35271c', color: '#35271c' }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#937d5f'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#a28b6d'}
          >
            <span>Book a Free Strategy Call</span>
            <ArrowRight size={20} className="opacity-0 group-hover:opacity-100 transition-opacity -ml-2 group-hover:ml-0" />
          </a>
          <p className="text-sm text-obsidian/60 mt-4 font-mono">
            Free · No obligation · See real ROI projections
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default PricingSection;



















