import { useState } from 'react';
import { ChevronDown, MessageCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    question: 'How quickly can I expect to see results?',
    answer: 'Timing depends on your current systems, offer, market, budget, sales process, and the work required to launch cleanly. We focus first on getting tracking, lead handling, follow-up, and the selected acquisition system working properly, then improve it from real data rather than promising a fixed outcome or timeline.'
  },
  {
    question: 'What makes Boundless different from other marketing services?',
    answer: 'Boundless is focused on painting companies and on connecting acquisition, lead capture, follow-up, pipeline visibility, and measurement into one operating system. We diagnose the bottleneck first instead of forcing every client into the same channel or package.'
  },
  {
    question: 'Do I need technical skills to use your system?',
    answer: 'No. Boundless handles the core setup and implementation. Your team still needs to participate in areas such as access, approvals, lead response, sales updates, capacity communication, and outcome reporting so the system can be measured and improved.'
  },
  {
    question: 'What kind of leads will I get?',
    answer: 'Lead source and quality depend on the service, market, targeting, offer, channel, budget, and campaign data. Where paid acquisition is appropriate, we build campaigns and conversion paths around the services and geographies that make the most sense for the business. We do not guarantee a fixed number or quality level of leads.'
  },
  {
    question: 'Is there a long-term contract?',
    answer: 'Commercial terms depend on the package and agreement in place at the time you become a client. We review scope, billing, cancellation, and other terms before work begins so expectations are clear.'
  },
  {
    question: 'How much does it cost?',
    answer: 'Current launch pricing starts at $497/month, with Growth at $1,200/month and Scale at $2,500/month. The right package depends on your current bottleneck and the scope required. Paid advertising spend, where applicable, is separate from the Boundless management fee.'
  },
  {
    question: 'What if I am already getting some leads?',
    answer: 'That can be a strong starting point. If lead volume already exists, the first opportunity may be improving response speed, follow-up, pipeline visibility, estimate follow-up, or measurement before adding more acquisition.'
  },
  {
    question: 'Do you work with new painting businesses?',
    answer: 'Potentially. The recommendation depends on readiness, economics, capacity, sales process, budget, and whether Boundless can create meaningful value at the current stage. In some cases, building the core system first is more appropriate than immediately running paid acquisition.'
  },
  {
    question: 'What areas do you serve?',
    answer: 'Boundless is launching with a primary focus on Vancouver and Greater Vancouver painting companies. Expansion into additional markets can follow after the launch model is validated with real operating evidence.'
  },
  {
    question: 'How involved do I need to be?',
    answer: 'You should expect to be involved during onboarding and to provide timely access, approvals, business information, capacity updates, and sales outcomes. Boundless handles the agreed system work, but accurate client participation is essential for good measurement and decision-making.'
  }
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="relative py-20 lg:py-32 bg-background overflow-hidden">
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 right-0 w-96 h-96 bg-signal rounded-full blur-3xl" style={{ transform: 'translate(30%, -30%)' }} />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-amber rounded-full blur-3xl" style={{ transform: 'translate(-30%, 30%)' }} />
      </div>

      <div className="relative max-w-4xl mx-auto px-6 lg:px-10">
        <div className="text-center mb-16">
          <div className="font-mono text-xs tracking-wider uppercase mb-4" style={{ color: '#a28b6d' }}>08 / Frequently Asked Questions</div>
          <h2 className="font-heading font-black text-4xl sm:text-5xl lg:text-6xl tracking-tight mb-6" style={{ color: '#a28b6d' }}>Got Questions? We've Got Answers.</h2>
          <p className="text-steel text-lg sm:text-xl max-w-2xl mx-auto font-body leading-relaxed">What to expect from Boundless at launch.</p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className="rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300"
              style={{ backgroundColor: '#a28b6d', boxShadow: '0 4px 6px rgba(162, 139, 109, 0.1)' }}
            >
              <button onClick={() => toggleFAQ(index)} className="w-full flex items-center justify-between gap-4 p-6 text-left group" aria-expanded={openIndex === index}>
                <span className="font-heading font-bold text-lg sm:text-xl text-obsidian">{faq.question}</span>
                <motion.div animate={{ rotate: openIndex === index ? 180 : 0 }} transition={{ duration: 0.3, ease: 'easeInOut' }} className="flex-shrink-0 text-obsidian">
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
                        <p className="text-obsidian/90 font-body text-base sm:text-lg leading-relaxed">{faq.answer}</p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 text-center p-8 rounded-xl"
          style={{ backgroundColor: 'rgba(162, 139, 109, 0.05)', border: '1px solid rgba(162, 139, 109, 0.2)' }}
        >
          <MessageCircle className="w-12 h-12 mx-auto mb-4" style={{ color: '#a28b6d' }} />
          <h3 className="text-2xl font-bold mb-3" style={{ color: '#f5ede0' }}>Still have questions?</h3>
          <p className="mb-6" style={{ color: '#7a6552' }}>Book a free 30-minute discovery call and we can talk through your current situation.</p>
          <a
            href="https://go.boundlesscorp.ca/widget/bookings/boundless-growth-call"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-lg font-bold transition-all duration-300 hover:scale-105"
            style={{ backgroundColor: '#a28b6d', color: '#35271c' }}
          >
            Schedule Your Free Call
          </a>
        </motion.div>
      </div>
    </section>
  );
}
