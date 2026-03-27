import fs from 'fs';

import { transform as minifyCSS } from 'lightningcss';
import { minify as minifyJS } from 'terser';

export default {
    injectCSS(path) {
        const content = fs.readFileSync(path, 'utf8');
        const minified = minifyCSS({
            filename: path,
            code: Buffer.from(content),
            minify: true,
            sourceMap: false,
        }).code;
        return `<style>${minified}</style>`;
    },

    async injectJS(path) {
        const content = fs.readFileSync(path, 'utf8');
        const minified = (await minifyJS(content)).code;
        return `<script>${minified}</script>`;
    },

    button(src, href) {
        const content = href
            ? `<a href="${href}" target="_blank"><img class="button" src="${src}" width="200" height="40" loading="lazy" /></a>`
            : `<img class="button not-found" src="${src}" width="200" height="40" loading="lazy" />`;
        return `<span>${content}</span>`;
    },

    head(scale = '1.0') {
        return `
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=${scale}" />
        <meta name="robots" content="noindex, nofollow" />
        <meta name="pinterest" content="nopin" />
        <link rel="alternate" type="application/rss+xml" title="忍狐のホームページ" href="https://ninko.cc/rss.xml" />
        <title>忍狐のホームページ</title>
        `;
    },
};
