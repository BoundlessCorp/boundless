import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Gift, Sparkles, Percent, Bell, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';

interface ExitIntentPopupProps {
  showPreview?: boolean;
}

export default function ExitIntentPopup({ showPreview = false }: ExitIntentPopupProps) {
  const [isVisible, setIsVisible] = useState(showPreview);
  const [hasShown, setHasShown] = useState(false);
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (hasShown) return;

    const handleMouseMove = (e: MouseEvent) => {
      // Trigger when mouse moves toward top 20% of screen
      if (e.clientY < window.innerHeight * 0.2) {
        setIsVisible(true);
        setHasShown(true);
      }
    };

    // Add mouse move listener
    document.addEventListener('mousemove', handleMouseMove);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, [hasShown]);

  const handleClose = () => {
    setIsVisible(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name: '', message: 'Exit intent popup signup' })
      });

      const data = await response.json() as { success?: boolean; error?: string };

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to subscribe');
      }

      setSubmitted(true);

      // Trigger confetti celebration
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#a28b6d', '#c4935a', '#f5ede0', '#35271c'],
      });

      // Track conversion in analytics
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', 'conversion', {
          event_category: 'Lead',
          event_label: 'VIP List Signup',
        });
      }

      // Close popup after success
      setTimeout(() => {
        setIsVisible(false);
      }, 3000);
    } catch (err) {
      console.error('Subscription error:', err);
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-obsidian/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={handleClose}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-chalk rounded-2xl shadow-2xl max-w-lg w-full border-2 border-[#35271c]"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative">
                {/* Header with gradient */}
                <div className="relative bg-gradient-to-br from-obsidian via-steel to-obsidian p-4 sm:p-6 text-chalk overflow-hidden">
                  {/* Decorative elements */}
                  <div className="absolute top-0 right-0 w-40 h-40 bg-signal/10 rounded-full blur-3xl"></div>
                  <div className="absolute bottom-0 left-0 w-32 h-32 bg-amber/10 rounded-full blur-2xl"></div>

                  {/* Close button */}
                  <button
                    onClick={handleClose}
                    className="absolute top-2 right-2 sm:top-3 sm:right-3 w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-full bg-chalk text-obsidian hover:bg-signal hover:text-chalk transition-all duration-200 hover:rotate-90 group z-20 shadow-lg"
                    aria-label="Close popup"
                  >
                    <X size={18} className="sm:w-5 sm:h-5 font-bold stroke-[3]" />
                  </button>

                  {!submitted ? (
                    <>
                      {/* Content */}
                      <div className="p-3 sm:p-4 space-y-3 sm:space-y-4">
                        {/* Title */}
                        <div className="text-center mb-2 sm:mb-3">
                          <h2 className="text-lg sm:text-2xl font-bold mb-1 font-heading text-obsidian leading-tight">
                            Exclusive Insider Access
                          </h2>
                          <p className="text-xs sm:text-base text-steel font-semibold">
                            Don't Miss Out on Our Next Deal!
                          </p>
                        </div>

                        <div className="space-y-2 sm:space-y-2.5 mb-3 sm:mb-4">
                          <div className="flex items-start gap-2">
                            <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-lg bg-signal/10 flex items-center justify-center flex-shrink-0 border border-signal/20">
                              <Bell size={14} className="sm:w-4 sm:h-4 text-signal" />
                            </div>
                            <div>
                              <p className="text-obsidian font-bold text-xs sm:text-sm mb-0.5">
                                Early Bird Access
                              </p>
                              <p className="text-steel text-[11px] sm:text-xs font-body leading-snug">
                                Get notified 24-48 hours before we announce deals publicly
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex items-start gap-2">
                            <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-lg bg-amber/10 flex items-center justify-center flex-shrink-0 border border-amber/20">
                              <Percent size={14} className="sm:w-4 sm:h-4 text-amber" />
                            </div>
                            <div>
                              <p className="text-obsidian font-bold text-xs sm:text-sm mb-0.5">
                                Exclusive VIP Discounts
                              </p>
                              <p className="text-steel text-[11px] sm:text-xs font-body leading-snug">
                                Special pricing and bonuses reserved only for our insider list
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex items-start gap-2">
                            <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-lg bg-signal/10 flex items-center justify-center flex-shrink-0 border border-signal/20">
                              <Gift size={14} className="sm:w-4 sm:h-4 text-signal" />
                            </div>
                            <div>
                              <p className="text-obsidian font-bold text-xs sm:text-sm mb-0.5">
                                Limited-Time Promotions
                              </p>
                              <p className="text-steel text-[11px] sm:text-xs font-body leading-snug">
                                Flash sales, seasonal offers, and one-time bonuses
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="space-y-2.5 sm:space-y-3">
                          <div>
                            <input
                              type="email"
                              required
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              placeholder="you@example.com"
                              disabled={loading}
                              className="w-full px-3 py-2 sm:py-2.5 text-sm border-2 border-steel/30 rounded-lg bg-chalk/50 text-obsidian placeholder:text-steel focus:outline-none focus:border-signal focus:ring-2 focus:ring-signal/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            />
                          </div>

                          {error && (
                            <div className="bg-destructive/10 border border-destructive/30 text-destructive rounded-lg px-3 py-2 text-xs font-body font-medium">
                              {error}
                            </div>
                          )}

                          <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-signal hover:bg-amber text-obsidian font-bold py-2 sm:py-2.5 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 text-sm border-2"
                            style={{ borderColor: '#35271c' }}
                          >
                            {loading ? (
                              <>
                                <div className="w-4 h-4 border-2 border-obsidian/30 border-t-obsidian rounded-full animate-spin" />
                                Subscribing...
                              </>
                            ) : (
                              <>
                                Get Exclusive Access
                                <ArrowRight size={16} className="hidden sm:inline" />
                              </>
                            )}
                          </button>
                        </form>

                        <div className="flex items-center justify-center gap-2 mt-2 sm:mt-3 flex-wrap">
                          <div className="flex items-center gap-1">
                            <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                            <span className="text-[10px] sm:text-xs text-steel font-mono font-medium">No spam</span>
                          </div>
                          <div className="w-px h-3 bg-steel/30"></div>
                          <div className="flex items-center gap-1">
                            <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                            <span className="text-[10px] sm:text-xs text-steel font-mono font-medium">Unsubscribe anytime</span>
                          </div>
                          <div className="w-px h-3 bg-steel/30"></div>
                          <div className="flex items-center gap-1">
                            <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                            <span className="text-[10px] sm:text-xs text-steel font-mono font-medium">VIP only</span>
                          </div>
                        </div>
                      </div>
                    </>
                  ) : (
                    /* Success state */
                    <div className="p-6 sm:p-8 text-center">
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', duration: 0.5 }}
                        className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-signal to-amber rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 shadow-lg"
                      >
                        <Gift size={24} className="sm:w-7 sm:h-7 text-obsidian" />
                      </motion.div>
                      
                      <h4 className="font-heading font-bold text-lg sm:text-xl text-obsidian mb-2">
                        You're In! 🎉
                      </h4>
                      <p className="text-steel font-body text-sm sm:text-base mb-2 sm:mb-3 font-medium">
                        Welcome to our VIP insider list!
                      </p>
                      <p className="text-xs sm:text-sm text-obsidian/90 font-body leading-relaxed">
                        Check <strong className="text-signal">{email}</strong> for confirmation.<br/>
                        You'll be the first to know about our next exclusive offer.
                      </p>
                      
                      <div className="mt-3 sm:mt-4 inline-flex items-center gap-2 bg-signal/10 text-signal border border-signal/20 px-3 py-1.5 rounded-full">
                        <Sparkles size={12} />
                        <span className="text-xs font-semibold">Watch your inbox for VIP deals!</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}


