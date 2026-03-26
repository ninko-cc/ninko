import { UAParser } from 'ua-parser-js';
import template from './template.html';

export default {
    async fetch(request, env, ctx) {
        const url = new URL(request.url);

        if (url.pathname == '/logs/') {
            const page = Number(url.searchParams.get('page') || 1);
            const limit = 50;
            const offset = (page - 1) * limit;

            const query = 'SELECT * FROM access_logs ORDER BY accessed_at DESC LIMIT ? OFFSET ?';
            const { results: rows } = await env.DB.prepare(query).bind(limit, offset).all();
            const { results: count } = await env.DB.prepare('SELECT COUNT(*) as total FROM access_logs').all();

            const totalPages = Math.ceil(count[0].total / limit);

            return render(rows, page, totalPages);
        }

        ctx.waitUntil(save(request, env));

        return env.ASSETS.fetch(request);
    },
};

async function save(request, env) {
    const query = `
        INSERT INTO access_logs (accessed_at, path, ip, region, city, org, ua, referer)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    await env.DB.prepare(query)
        .bind(
            new Date(Date.now() + 9 * 60 * 60 * 1000).toISOString().replace('Z', '+09:00'),
            new URL(request.url).pathname,
            request.headers.get('CF-Connecting-IP'),
            request.cf?.region,
            request.cf?.city,
            request.cf?.asOrganization,
            request.headers.get('User-Agent'),
            request.headers.get('Referer'),
        )
        .run();
}

function render(rows, page, totalPages) {
    const html = template
        .replace('{{ROWS}}', rows.map(tr).join(''))
        .replace('{{PREV}}', page > 1 ? `<a href="?page=${page - 1}">Prev</a>` : '')
        .replace('{{PAGE_NUMBER}}', `<span>${page} / ${totalPages}</span>`)
        .replace('{{NEXT}}', page < totalPages ? `<a href="?page=${page + 1}">Next</a>` : '');

    return new Response(html, {
        headers: { 'Content-Type': 'text/html' },
    });
}

function tr(row) {
    const date = row.accessed_at.slice(2, 10).replaceAll('-', '/');
    const time = row.accessed_at.slice(11, 19);

    const ua = new UAParser(row.ua);
    const os = ua.getOS()?.name ?? 'Unknown';
    const browser = ua.getBrowser()?.name?.replace(' ', '') ?? 'Unknown';

    return `
    <tr>
        <td><a href="https://ipapi.co/?q=${row.ip}" target="_blank">${date} ${time}</a></td>
        <td>${row.path}</td>
        <td>${row.region}/${row.city}</td>
        <td>${row.org}</td>
        <td>${os + '/' + browser}</td>
        <td>${row.referer}</td>
    </tr>`;
}
