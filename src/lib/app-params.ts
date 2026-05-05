interface AppParams {
  appId: string;
  apiBaseUrl: string;
}

export function getAppParams(): AppParams {
  // Get from environment variables
  const appId = import.meta.env.PUBLIC_APP_ID || '';
  const apiBaseUrl = import.meta.env.PUBLIC_API_BASE_URL || 'https://api.base44.com';

  return {
    appId,
    apiBaseUrl,
  };
}
