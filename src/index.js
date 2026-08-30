import { answer } from './bi.js';

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === '/api/query') {
      if (request.method !== 'POST') {
        return new Response(JSON.stringify({ error: 'POST only' }), {
          status: 405,
          headers: { 'content-type': 'application/json; charset=utf-8' }
        });
      }

      try {
        const body = await request.json().catch(() => ({}));
        const question = String(body.question ?? '').trim();
        if (!question) {
          return new Response(JSON.stringify({ error: 'Question is required' }), {
            status: 400,
            headers: { 'content-type': 'application/json; charset=utf-8' }
          });
        }

        const result = await answer(question, env);
        return new Response(JSON.stringify({ answer: result }), {
          status: 200,
          headers: {
            'content-type': 'application/json; charset=utf-8',
            'cache-control': 'no-store'
          }
        });
      } catch (error) {
        return new Response(JSON.stringify({
          error: error instanceof Error ? error.message : 'Unexpected server error'
        }), {
          status: 500,
          headers: { 'content-type': 'application/json; charset=utf-8' }
        });
      }
    }

    return env.ASSETS.fetch(request);
  }
};
