// Google Analytics 4 Helper Functions

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    dataLayer?: any[];
  }
}

export const GA_TRACKING_ID = import.meta.env.VITE_GA_TRACKING_ID || '';

// Initialize Google Analytics
export const initGA = () => {
  if (!GA_TRACKING_ID) {
    console.warn('Google Analytics ID not found');
    return;
  }

  // Load Google Analytics script
  const script = document.createElement('script');
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`;
  script.async = true;
  document.head.appendChild(script);

  // Initialize dataLayer
  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() {
    window.dataLayer?.push(arguments);
  };
  window.gtag('js', new Date());
  window.gtag('config', GA_TRACKING_ID, {
    page_path: window.location.pathname,
  });
};

// Track page views
export const trackPageView = (url: string) => {
  if (!window.gtag) return;
  
  window.gtag('config', GA_TRACKING_ID, {
    page_path: url,
  });
};

// Track custom events
export const trackEvent = (action: string, params?: Record<string, any>) => {
  if (!window.gtag) return;
  
  window.gtag('event', action, params);
};

// Track user actions
export const trackUserAction = {
  // Authentication
  signup: (method: string) => trackEvent('sign_up', { method }),
  login: (method: string) => trackEvent('login', { method }),
  
  // Profile actions
  profileView: (profileId: string) => trackEvent('view_profile', { profile_id: profileId }),
  profileEdit: () => trackEvent('edit_profile'),
  
  // Interactions
  sendMessage: () => trackEvent('send_message'),
  sendLike: () => trackEvent('send_like'),
  addFavorite: () => trackEvent('add_favorite'),
  
  // Premium
  viewPremiumFeatures: () => trackEvent('view_premium_features'),
  startCheckout: (plan: string) => trackEvent('begin_checkout', { plan }),
  completePurchase: (plan: string, value: number) => 
    trackEvent('purchase', { plan, value, currency: 'EUR' }),
  
  // Engagement
  swipe: (direction: 'left' | 'right') => trackEvent('swipe', { direction }),
  match: () => trackEvent('match'),
  
  // Reports
  reportUser: (reason: string) => trackEvent('report_user', { reason }),
  blockUser: () => trackEvent('block_user'),
};

// Track errors
export const trackError = (error: Error, context?: string) => {
  trackEvent('exception', {
    description: error.message,
    context,
    fatal: false,
  });
};

// Set user properties (after login)
export const setUserProperties = (userId: string, properties?: Record<string, any>) => {
  if (!window.gtag) return;
  
  window.gtag('set', 'user_properties', {
    user_id: userId,
    ...properties,
  });
};

