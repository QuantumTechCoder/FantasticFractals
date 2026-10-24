/**
 * Cloudflare Pages Functions Global Middleware
 */
export async function onRequest(context) {
  const { request, next } = context;

  // Handle CORS preflight
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Max-Age': '86400',
      },
    });
  }

  const start = Date.now();
  const response = await next();
  const duration = Date.now() - start;

  const newHeaders = new Headers(response.headers);
  newHeaders.set('Access-Control-Allow-Origin', '*');
  newHeaders.set('X-Edge-Powered-By', 'Cloudflare Pages Functions');
  if (!newHeaders.has('Server-Timing')) {
    newHeaders.set('Server-Timing', `total;dur=${duration}`);
  }

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: newHeaders,
  });
}
