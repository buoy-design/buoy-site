import type { APIRoute } from 'astro';

export const prerender = false;

export const GET: APIRoute = async ({ params, locals }) => {
  const { slug } = params;
  const bucket = (locals as any).runtime?.env?.DOWNLOADS;

  if (!bucket) {
    return new Response('Downloads not configured', { status: 500 });
  }

  const filename = `downloads/${slug}.html`;

  try {
    const object = await bucket.get(filename);

    if (!object) {
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
    console.error('Error fetching from R2:', error);
    return new Response('Error loading download', { status: 500 });
  }
};
