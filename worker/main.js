import Logs from './logs.js';
import Owner from './owner.js';
import { renderHTML } from './html.js';

let owner;

export default {
    async fetch(request, env, ctx) {
        const logs = new Logs(env.DB);
        const url = new URL(request.url);

        if (url.pathname === '/logs/') {
            const page = Number(url.searchParams.get('page') || 1);
            const limit = 50;
            const offset = (page - 1) * limit;

            const { rows, total } = await logs.get(limit, offset);
            const totalPages = Math.ceil(total / limit);

            return renderHTML(rows, page, totalPages);
        }

        owner ??= new Owner(env);
        if (!(await owner.verify(request))) ctx.waitUntil(logs.append(request));

        return env.ASSETS.fetch(request);
    },
};
