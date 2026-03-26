export default class {
    constructor(db) {
        this.db = db;
    }

    async append(request) {
        const query = `
            INSERT INTO access_logs (accessed_at, path, ip, region, city, org, ua, referer)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `;
        await this.db
            .prepare(query)
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

    async get(limit, offset) {
        const query = 'SELECT * FROM access_logs ORDER BY accessed_at DESC LIMIT ? OFFSET ?';

        const { results: rows } = await this.db.prepare(query).bind(limit, offset).all();
        const { results: count } = await this.db.prepare('SELECT COUNT(*) as total FROM access_logs').all();

        return { rows, total: count[0].total };
    }
}
