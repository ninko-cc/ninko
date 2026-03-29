import Logs from './logs.js';
import { renderHTML } from './html.js';

export default {
    async fetch(request, env, ctx) {
        const logs = new Logs(env.DB);
        const url = new URL(request.url);
        const token = env.NINKO_AUTH_TOKEN;

        if (url.pathname === '/logs/') {
            const pageNumber = Number(url.searchParams.get('page') || 1);
            const limit = 50;
            const offset = (pageNumber - 1) * limit;

            const { rows, total } = await logs.get(limit, offset);
            const totalPages = Math.ceil(total / limit);

            const response = renderHTML(rows, pageNumber, totalPages);

            if (token) {
                const maxAge = 60 * 60 * 24 * 7; // 7 days
                response.headers.set(
                    'Set-Cookie',
                    `ninko_auth=${token}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=${maxAge}`,
                );
            }

            return response;
        }

        const cookie = request.headers.get('Cookie') || '';
        const isOwner = token && cookie.includes(`ninko_auth=${token}`);

        if (!isOwner) {
            ctx.waitUntil(logs.append(request));
        }

        return env.ASSETS.fetch(request);
    },
};
