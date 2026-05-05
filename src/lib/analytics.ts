/**
 * Client-side analytics tracker
 * Integrates with Google Analytics 4 (GA4) and custom tracking
 */

interface AnalyticsEvent {
  event: string;
  properties?: Record<string, unknown>;
  timestamp?: string;
}

// Extend Window interface for gtag
declare global {
  interface Window {
    gtag?: (
      command: string,
      target: string,
      config?: Record<string, unknown>
    ) => void;
    dataLayer?: unknown[];
  }
}

class Analytics {
  private enabled: boolean;
  private gaInitialized: boolean = false;

  constructor() {
    this.enabled = typeof window !== 'undefined';
  }

  /**
   * Initialize Google Analytics 4
   */
  initGA4(measurementId: string) {
    if (!this.enabled || this.gaInitialized) return;

    // Create gtag function
    window.dataLayer = window.dataLayer || [];
    window.gtag = function gtag() {
      window.dataLayer?.push(arguments);
    };

    // Initialize with timestamp
    window.gtag('js', new Date());

    // Configure GA4
    window.gtag('config', measurementId, {
      page_path: window.location.pathname,
      send_page_view: true,
    });

    this.gaInitialized = true;
    console.log('[Analytics] Google Analytics 4 initialized:', measurementId);
  }

  /**
   * Track a page view
   */
  pageView(path: string) {
    if (!this.enabled) return;

    // Track in custom analytics
    this.track('page_view', {
      path,
      title: document.title,
      referrer: document.referrer,
    });

    // Track in GA4
    if (window.gtag) {
      window.gtag('event', 'page_view', {
        page_path: path,
        page_title: document.title,
        page_location: window.location.href,
      });
    }
  }

  /**
   * Track a custom event
   */
  track(event: string, properties?: Record<string, unknown>) {
    if (!this.enabled) return;

    const payload: AnalyticsEvent = {
      event,
      properties: {
        ...properties,
        url: window.location.href,
        userAgent: navigator.userAgent,
      },
      timestamp: new Date().toISOString(),
    };

    console.log('[Analytics Event]', payload);

    // Send to GA4
    if (window.gtag && properties) {
      window.gtag('event', event, properties);
    }

    // Send to your analytics backend (optional)
    // this.sendToBackend(payload);
  }

  /**
   * Track a click event
   */
  trackClick(element: string, properties?: Record<string, unknown>) {
    this.track('click', {
      element,
      ...properties,
    });

    // GA4 specific click tracking
    if (window.gtag) {
      window.gtag('event', 'select_content', {
        content_type: 'button',
        item_id: element,
        ...properties,
      });
    }
  }

  /**
   * Track a form submission
   */
  trackFormSubmit(formName: string, properties?: Record<string, unknown>) {
    this.track('form_submit', {
      form: formName,
      ...properties,
    });

    // GA4 form tracking
    if (window.gtag) {
      window.gtag('event', 'generate_lead', {
        form_name: formName,
        ...properties,
      });
    }
  }

  /**
   * Track a conversion event
   */
  trackConversion(type: string, value?: number, properties?: Record<string, unknown>) {
    this.track('conversion', {
      type,
      value,
      ...properties,
    });

    // GA4 conversion tracking
    if (window.gtag) {
      window.gtag('event', 'conversion', {
        conversion_type: type,
        value: value || 0,
        currency: 'CAD',
        ...properties,
      });
    }
  }

  /**
   * Track phone call clicks
   */
  trackPhoneCall(phoneNumber: string) {
    this.track('phone_call', {
      phone_number: phoneNumber,
    });

    if (window.gtag) {
      window.gtag('event', 'contact', {
        method: 'phone',
        phone_number: phoneNumber,
      });
    }
  }

  /**
   * Track booking attempts
   */
  trackBooking(properties?: Record<string, unknown>) {
    this.track('booking_started', properties);

    if (window.gtag) {
      window.gtag('event', 'begin_checkout', {
        ...properties,
      });
    }
  }

  /**
   * Track email form submissions
   */
  trackEmailSubmit(email: string, formName: string) {
    this.track('email_submit', {
      email_hash: this.hashEmail(email),
      form: formName,
    });

    if (window.gtag) {
      window.gtag('event', 'sign_up', {
        method: 'email',
        form_name: formName,
      });
    }
  }

  /**
   * Track scroll depth
   */
  trackScrollDepth(depth: number) {
    if (window.gtag) {
      window.gtag('event', 'scroll', {
        depth: depth,
        engagement_time_msec: Date.now(),
      });
    }
  }

  /**
   * Hash email for privacy (simple hash)
   */
  private hashEmail(email: string): string {
    let hash = 0;
    for (let i = 0; i < email.length; i++) {
      const char = email.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash;
    }
    return hash.toString(16);
  }

  /**
   * Send analytics data to backend (implement your own endpoint)
   */
  private async sendToBackend(payload: AnalyticsEvent) {
    try {
      // Example: send to your analytics API
      // await fetch('/api/analytics', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(payload),
      // });
    } catch (error) {
      console.error('[Analytics] Failed to send event:', error);
    }
  }
}

// Singleton instance
export const analytics = new Analytics();

// Auto-track page views on navigation
if (typeof window !== 'undefined') {
  // Track initial page load
  analytics.pageView(window.location.pathname);

  // Track navigation events (for SPA-like navigation)
  let lastPath = window.location.pathname;
  
  const observer = new MutationObserver(() => {
    if (window.location.pathname !== lastPath) {
      lastPath = window.location.pathname;
      analytics.pageView(lastPath);
    }
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });

  // Track scroll depth
  let maxScroll = 0;
  const scrollDepths = [25, 50, 75, 100];
  let trackedDepths: number[] = [];

  window.addEventListener('scroll', () => {
    const scrollPercent = Math.round(
      ((window.scrollY + window.innerHeight) / document.documentElement.scrollHeight) * 100
    );
    
    if (scrollPercent > maxScroll) {
      maxScroll = scrollPercent;
      
      scrollDepths.forEach(depth => {
        if (scrollPercent >= depth && !trackedDepths.includes(depth)) {
          trackedDepths.push(depth);
          analytics.trackScrollDepth(depth);
        }
      });
    }
  });
}

