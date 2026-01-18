import type { APIRoute } from 'astro';

export const prerender = false;

export const GET: APIRoute = async ({ params, locals, request }) => {
  const { slug } = params;
  const bucket = (locals as any).runtime?.env?.DOWNLOADS;

  if (!bucket) {
    console.error('[Downloads] R2 bucket not configured', {
      slug,
      url: request.url,
    });
    return new Response('Downloads not configured', { status: 500 });
  }

  const filename = `downloads/${slug}.html`;

  try {
    const object = await bucket.get(filename);

    if (!object) {
      console.warn('[Downloads] File not found in R2', {
        slug,
        filename,
        url: request.url,
      });
      return new Response('Not found', { status: 404 });
    }

    const html = await object.text();
    return new Response(html, {
      headers: {
        'Content-Type': 'text/html',
        'Cache-Control': 'public, max-age=3600',
      },
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    const errorStack = error instanceof Error ? error.stack : undefined;

    console.error('[Downloads] Error fetching from R2', {
      slug,
      filename,
      url: request.url,
      error: errorMessage,
      stack: errorStack,
    });
    return new Response('Error loading download', { status: 500 });
  }
};
