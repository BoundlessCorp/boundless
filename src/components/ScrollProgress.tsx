import { useEffect, useState } from 'react';

export default function ScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrolled = window.scrollY / totalHeight;
      setProgress(scrolled);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="fixed left-4 lg:left-8 top-0 bottom-0 z-30 hidden lg:flex flex-col items-center">
      <div className="w-px h-full bg-border relative">
        <div
          className="absolute top-0 left-0 w-px bg-primary origin-top transition-all duration-100 ease-out"
          style={{ height: `${progress * 100}%` }}
        />
        <div
          className="absolute left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-primary transition-all duration-150 ease-out"
          style={{ top: `${progress * 100}%` }}
        />
      </div>
    </div>
  );
}
