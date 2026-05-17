import Header from './Header';
import ScrollProgress from './ScrollProgress';
import HeroSection from './HeroSection';
import ProblemSection from './ProblemSection';
import SolutionSection from './SolutionSection';
import HowItWorks from './HowItWorks';
import ResultsSection from './ResultsSection';
import TestimonialsSection from './TestimonialsSection';
import FAQSection from './FAQSection';
import OfferSection from './OfferSection';
import PricingSection from './PricingSection';
import CTASection from './CTASection';
import Footer from './Footer';
import MobileCallButton from './MobileCallButton';

const IMAGES = {
  hero: 'https://media.base44.com/images/public/69d9696e29a47b1500cec646/44799b36d_generated_c48a6545.png',
  businessOwner: 'https://media.base44.com/images/public/69d9696e29a47b1500cec646/549cd502d_generated_75b07059.png',
  painter: 'https://media.base44.com/images/public/69d9696e29a47b1500cec646/71ea607af_generated_767de50c.png',
  dashboard: 'https://media.base44.com/images/public/69d9696e29a47b1500cec646/da7293ed6_generated_27075ce7.png',
};

export default function Home() {
  return (
    <div className="relative bg-obsidian min-h-screen">
      <ScrollProgress />
      <Header />
      <HeroSection />
      <ProblemSection />
      <SolutionSection dashboardImage={IMAGES.dashboard} />
      <HowItWorks />
      <ResultsSection painterImage={IMAGES.painter} />
      <TestimonialsSection />
      <OfferSection />
      <PricingSection />
      <FAQSection />
      <CTASection />
      <Footer />
      <MobileCallButton />
    </div>
  );
}







