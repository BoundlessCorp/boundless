import { Phone } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function MobileCallButton() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Only show on mobile devices
    const checkMobile = () => {
      setIsVisible(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  if (!isVisible) return null;

  return (
    <a
      href="tel:+17782009960"
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-signal hover:bg-signal/90 text-obsidian px-6 py-4 rounded-full shadow-2xl transition-all duration-300 animate-bounce-slow font-semibold"
      aria-label="Call Boundless"
    >
      <Phone className="w-5 h-5" />
      <span>Call Now</span>
    </a>
  );
}
