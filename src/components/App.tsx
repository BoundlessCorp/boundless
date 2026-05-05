import { QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '../lib/AuthContext';
import queryClient from '../lib/query-client';
import Home from './Home';
import ExitIntentPopup from './ExitIntentPopup';
import MobileCallButton from './MobileCallButton';

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Home />
        {/* Exit intent popup for lead capture */}
        <ExitIntentPopup />
        
        {/* Mobile call button for easy contact */}
        <MobileCallButton />
      </AuthProvider>
    </QueryClientProvider>
  );
}







