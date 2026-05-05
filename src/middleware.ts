import type {MiddlewareHandler} from 'astro';

export const onRequest: MiddlewareHandler = async (ctx, next) => {
  const {request} = ctx;
  const url = new URL(request.url);

  // Analytics tracking for page views
  if (!url.pathname.startsWith('/_') && !url.pathname.startsWith('/api/')) {
    const timestamp = new Date().toISOString();
    const userAgent = request.headers.get('user-agent') || 'unknown';
    const referer = request.headers.get('referer') || 'direct';
    
    console.log('[Analytics]', {
      timestamp,
      path: url.pathname,
      method: request.method,
      referer,
      userAgent: userAgent.substring(0, 100), // Truncate for readability
    });
  }

  if (import.meta.env.DEV && url.pathname === '/-wf/ready') {
    const resHeaders = new Headers({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    });

    return new Response(JSON.stringify({ready: true}), {
      headers: resHeaders,
    });
  }

  return next();
};

