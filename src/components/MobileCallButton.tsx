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

  const handleClick = () => {
    // Track phone call click
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'phone_call', {
        event_category: 'engagement',
        event_label: 'mobile_sticky_button'
      });
    }
  };

  if (!isVisible) return null;

  return (
    <a
      href="tel:+17782009960"
      className="fixed bottom-6 right-6 z-50 
                 px-4 py-3 rounded-lg 
                 font-semibold text-sm
                 shadow-lg
                 hover:scale-105
                 transition-all duration-300 ease-out
                 flex items-center gap-2
                 border"
      style={{ 
        backgroundColor: '#a28b6d', 
        borderColor: '#35271c',
        color: '#35271c'
      }}
      onClick={handleClick}
    >
      <Phone className="w-4 h-4" />
      <span>Call Now</span>
    </a>
  );
}




