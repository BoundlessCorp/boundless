import { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    question: "How quickly can I expect to see results?",
    answer: "Most painting contractors start seeing an increase in qualified leads within the first 7-14 days. Our proven system is designed to generate consistent results from day one, with most clients booking their first jobs within the first month."
  },
  {
    question: "What makes Boundless different from other marketing services?",
    answer: "Unlike generic marketing agencies, we specialize exclusively in the painting industry. We understand your customers, your sales cycle, and what actually converts. Plus, we handle everything - from lead generation to automated follow-ups - so you can focus on what you do best: painting."
  },
  {
    question: "Do I need technical skills to use your system?",
    answer: "Absolutely not! Our platform is built for busy contractors, not tech experts. Everything is automated and user-friendly. We handle all the setup, and you'll have a dedicated success manager to guide you every step of the way."
  },
  {
    question: "What kind of leads will I get?",
    answer: "You'll receive qualified leads from homeowners and property managers actively looking for painting services in your area. We pre-qualify leads based on project size, budget, and timeline to ensure you're only talking to serious prospects who are ready to move forward."
  },
  {
    question: "Is there a long-term contract?",
    answer: "No! We believe in earning your business every month. You can cancel anytime with 30 days notice. Most of our clients stay with us because they see consistent ROI, but we never lock you into a lengthy contract."
  },
  {
    question: "How much does it cost?",
    answer: "Our pricing is customized based on your market, service area, and growth goals. During your free strategy call, we'll create a tailored plan that fits your budget and delivers measurable ROI. Most clients see 3-5x return on their investment within the first 90 days."
  },
  {
    question: "What if I'm already getting some leads?",
    answer: "Perfect! We'll complement your existing lead sources and help you scale. Our system is designed to integrate seamlessly with your current operations while adding a consistent, predictable flow of new opportunities. Plus, we'll help you close more of your existing leads with our automated follow-up system."
  },
  {
    question: "Do you work with new painting businesses?",
    answer: "Yes! Whether you're just starting out or you've been in business for decades, our system works. We've helped brand-new contractors land their first clients and established companies break through growth plateaus. We'll meet you where you are and build a custom strategy for your specific situation."
  },
  {
    question: "What areas do you serve?",
    answer: "We work with painting contractors across the United States and Canada. Our digital marketing strategies are location-agnostic and highly effective in both urban and suburban markets. During your strategy call, we'll discuss how to best target your specific service area."
  },
  {
    question: "How involved do I need to be?",
    answer: "Minimal involvement required! After the initial onboarding (about 1-2 hours), our system runs on autopilot. You'll spend most of your time doing what you love - meeting with prospects and running jobs. We handle the marketing, lead nurturing, and scheduling so you can focus on delivering excellent work."
  }
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section 
      id="faq" 
      className="relative py-20 lg:py-32 bg-background overflow-hidden"
    >
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-5">
        <div 
          className="absolute top-0 right-0 w-96 h-96 bg-signal rounded-full blur-3xl"
          style={{ transform: 'translate(30%, -30%)' }}
        />
        <div 
          className="absolute bottom-0 left-0 w-96 h-96 bg-amber rounded-full blur-3xl"
          style={{ transform: 'translate(-30%, 30%)' }}
        />
      </div>

      <div className="relative max-w-4xl mx-auto px-6 lg:px-10">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="font-mono text-xs tracking-wider uppercase mb-4" style={{ color: '#a28b6d' }}>
            08 / Frequently Asked Questions
          </div>
          
          <h2 className="font-heading font-black text-4xl sm:text-5xl lg:text-6xl tracking-tight mb-6" style={{ color: '#a28b6d' }}>
            Got Questions? We've Got Answers.
          </h2>
          
          <p className="text-steel text-lg sm:text-xl max-w-2xl mx-auto font-body leading-relaxed">
            Everything you need to know about growing your painting business with Boundless
          </p>
        </div>

        {/* FAQ List */}
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className="rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300"
              style={{ 
                backgroundColor: '#a28b6d',
                boxShadow: '0 4px 6px rgba(162, 139, 109, 0.1)'
              }}
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full flex items-center justify-between gap-4 p-6 text-left group"
                aria-expanded={openIndex === index}
              >
                <span className="font-heading font-bold text-lg sm:text-xl text-obsidian">
                  {faq.question}
                </span>
                <motion.div
                  animate={{ rotate: openIndex === index ? 180 : 0 }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                  className="flex-shrink-0 text-obsidian"
                >
                  <ChevronDown size={24} />
                </motion.div>
              </button>

              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-6 pt-0">
                      <div className="pt-4 border-t border-obsidian/20">
                        <p className="text-obsidian/90 font-body text-base sm:text-lg leading-relaxed">
                          {faq.answer}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        {/* CTA at bottom */}
        <div className="mt-16 text-center">
          <p className="text-steel font-body text-lg mb-6">
            Still have questions? Let's talk.
          </p>
          <a
            href="https://calendly.com/jason-boundlesscorp/30min"
            className="group relative inline-flex items-center gap-3 font-heading font-bold text-lg bg-gradient-to-r from-signal to-amber text-obsidian px-8 py-4 rounded-xl hover:shadow-2xl hover:shadow-signal/20 hover:scale-105 transition-all duration-300"
          >
            <span>Book Your Free Strategy Call</span>
            <motion.span
              animate={{ x: [0, 5, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            >
              →
            </motion.span>
          </a>
        </div>
      </div>
    </section>
  );
}





