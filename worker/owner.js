import { jwtVerify, createRemoteJWKSet } from 'jose';

export default class {
    constructor(team, aud) {
        this.issuer = `https://${team}.cloudflareaccess.com`;
        this.audience = aud;
        this.jwks = createRemoteJWKSet(new URL(`${this.issuer}/cdn-cgi/access/certs`));
    }

    async verify(request) {
        const cookie = request.headers.get('Cookie');
        const token = cookie?.match(/CF_Authorization=([^;]+)/)?.[1];

        if (!token) return false;

        try {
            await jwtVerify(token, this.jwks, {
                issuer: this.issuer,
                audience: this.audience,
            });
            return true;
        } catch {
            return false;
        }
    }
}
