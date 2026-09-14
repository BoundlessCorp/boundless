import { useState } from 'react';
import { ArrowRight, CheckCircle } from 'lucide-react';
import { baseUrl } from '../lib/base-url';

export default function CTASection() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    business: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      console.log('Submitting form data:', formData);
      const response = await fetch(`${baseUrl}/api/send-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      console.log('Response status:', response.status);
      const responseData = await response.json();
      console.log('Response data:', responseData);

      if (response.ok) {
        setSubmitStatus('success');
        setFormData({ name: '', email: '', phone: '', business: '', message: '' });
      } else {
        console.error('Server error:', responseData);
        setSubmitStatus('error');
      }
    } catch (error) {
      console.error('Form submission error:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <section id="booking" className="relative pt-24 pb-44 sm:py-32 lg:py-48 overflow-hidden" style={{ backgroundColor: '#a28b6d' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
        <div className="max-w-3xl mx-auto bg-chalk rounded-2xl shadow-2xl p-4 sm:p-8 lg:p-12 border border-primary/10">
          <div className="text-center px-1 sm:px-0">
            <div className="font-mono text-[11px] sm:text-xs tracking-wider uppercase mb-4" style={{ color: '#35271c' }}>
              09 / Ready to Transform Your Business?
            </div>
            <h2 className="font-heading font-black text-foreground text-4xl sm:text-5xl lg:text-6xl tracking-tighter">
              Ready to Fill
              <br />
              <span className="text-primary">Your Pipeline?</span>
            </h2>
            <p className="mt-5 sm:mt-6 text-muted-foreground text-base sm:text-lg font-body leading-relaxed max-w-xl mx-auto">
              Request a free 30-minute discovery call. We'll analyze your current situation and show you
              exactly how we'd build your system. No pressure, no hard sell.
            </p>
          </div>

          {submitStatus === 'success' ? (
            <div className="mt-8 sm:mt-12 text-center bg-primary/5 border border-primary/20 rounded-xl p-6 sm:p-12">
              <CheckCircle size={48} className="text-primary mx-auto mb-4" />
              <h3 className="font-heading font-bold text-foreground text-2xl tracking-tight">
                You're In. We'll Be in Touch.
              </h3>
              <p className="text-muted-foreground text-base font-body mt-2">
                Check your email for confirmation. We typically respond within 2 hours.
              </p>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="mt-8 sm:mt-12 bg-background/50 border border-border/50 rounded-xl p-4 sm:p-8 lg:p-10"
            >
              <div className="grid sm:grid-cols-2 gap-4 sm:gap-5">
                <div>
                  <label className="font-mono text-[11px] sm:text-xs text-muted-foreground uppercase tracking-wider block mb-2">
                    Your Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    name="name"
                    className="w-full min-w-0 bg-muted border border-input rounded-lg px-3.5 sm:px-4 py-3 text-foreground font-body text-sm sm:text-base placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary transition-colors"
                    placeholder="John Smith"
                  />
                </div>
                <div>
                  <label className="font-mono text-[11px] sm:text-xs text-muted-foreground uppercase tracking-wider block mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    name="email"
                    className="w-full min-w-0 bg-muted border border-input rounded-lg px-3.5 sm:px-4 py-3 text-foreground font-body text-sm sm:text-base placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary transition-colors"
                    placeholder="john@company.com"
                  />
                </div>
                <div>
                  <label className="font-mono text-[11px] sm:text-xs text-muted-foreground uppercase tracking-wider block mb-2">
                    Phone
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    name="phone"
                    className="w-full min-w-0 bg-muted border border-input rounded-lg px-3.5 sm:px-4 py-3 text-foreground font-body text-sm sm:text-base placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary transition-colors"
                    placeholder="(604) 555-0123"
                  />
                </div>
                <div>
                  <label className="font-mono text-[11px] sm:text-xs text-muted-foreground uppercase tracking-wider block mb-2">
                    Business Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.business}
                    onChange={handleChange}
                    name="business"
                    className="w-full min-w-0 bg-muted border border-input rounded-lg px-3.5 sm:px-4 py-3 text-foreground font-body text-sm sm:text-base placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary transition-colors"
                    placeholder="ABC Painting Co."
                  />
                </div>
              </div>

              {submitStatus === 'error' && (
                <div className="mt-4 bg-destructive/10 border border-destructive/30 text-destructive rounded-lg px-4 py-3 text-sm font-body">
                  Something went wrong. Please try again.
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full font-heading font-bold text-base sm:text-lg px-4 sm:px-8 py-3.5 sm:py-4 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 border mt-5 sm:mt-6"
                style={{
                  backgroundColor: isSubmitting ? '#7a6552' : '#a28b6d',
                  color: '#35271c',
                  borderColor: '#35271c'
                }}
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: '#35271c', borderTopColor: 'transparent' }} />
                    Securing Your Spot...
                  </>
                ) : (
                  <>
                    <span className="sm:hidden">Request Discovery Call</span>
                    <span className="hidden sm:inline">Request My Discovery Call</span>
                    <ArrowRight size={19} className="flex-shrink-0" />
                  </>
                )}
              </button>

              <div className="grid grid-cols-1 gap-2.5 mt-4 text-muted-foreground text-xs font-mono sm:flex sm:items-center sm:justify-center sm:gap-4">
                <span className="flex items-center justify-center rounded-md border border-border/60 bg-white/60 px-3 py-2 sm:border-0 sm:bg-transparent sm:px-0 sm:py-0">✓ 100% Free</span>
                <span className="hidden sm:block w-px h-3 bg-border" />
                <span className="flex items-center justify-center rounded-md border border-border/60 bg-white/60 px-3 py-2 sm:border-0 sm:bg-transparent sm:px-0 sm:py-0">✓ No Obligation</span>
                <span className="hidden sm:block w-px h-3 bg-border" />
                <span className="flex items-center justify-center rounded-md border border-border/60 bg-white/60 px-3 py-2 sm:border-0 sm:bg-transparent sm:px-0 sm:py-0">✓ 30 Minutes</span>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
