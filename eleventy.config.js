import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

import { minify as minifyHTML } from 'html-minifier-terser';
import { minify as minifyXML } from 'minify-xml';
import { minify as minifyJS } from 'terser';
import { transform as minifyCSS } from 'lightningcss';

import ninko from './ninko.js';

export default (config) => {
    config.setInputDirectory('src');

    config.addWatchTarget('src/**/*.css');
    config.addWatchTarget('src/**/*.js');

    config.addPassthroughCopy('images/buttons');
    config.addPassthroughCopy('src/robots.txt');

    config.addShortcode('injectCSS', function (path) {
        const content = fs.readFileSync(path, 'utf8');
        const minified = minifyCSS({
            filename: path,
            code: Buffer.from(content),
            minify: true,
            sourceMap: false,
        }).code;
        return `<style>${minified}</style>`;
    });

    config.addShortcode('injectJS', async function (path) {
        const content = fs.readFileSync(path, 'utf8');
        const minified = (await minifyJS(content)).code;
        return `<script>${minified}</script>`;
    });

    config.addShortcode('injectArtworks', function (artworks) {
        const data = JSON.stringify(
            artworks.map((item) => [item.data.title, item.data.category, item.data.date, item.data.filename]),
        );
        return `<script>const artworks = ${data};</script>`;
    });

    config.addShortcode('button', (src, href) => {
        const content = href
            ? `<a href="${href}" target="_blank"><img src="${src}" width="200" height="40" loading="lazy" /></a>`
            : `<img src="${src}" width="200" height="40" loading="lazy" class="not-found" />`;
        return `<span>${content}</span>`;
    });

    config.addShortcode('diary', (date, filename, text) => {
        return `
        <section class="diary" id="${date}">
            <header>${date}</header>
            <img src="/images/artworks/${filename}" width="250" height="250" loading="lazy" />
            <p>${text}</p>
        </section>
        `;
    });

    config.addShortcode('default', () => {
        return `
        <meta charset="UTF-8" />
        <!--<meta name="viewport" content="width=device-width, initial-scale=1.0" />-->
        <meta name="robots" content="noindex, nofollow, noarchive, nosnippet, noimageindex" />
        <meta name="pinterest" content="nopin" />
        <link rel="alternate" type="application/rss+xml" title="忍狐のホームページ" href="https://ninko.cc/rss.xml" />
        <title>忍狐のホームページ</title>
        `;
    });

    config.addFilter('date', (string) => {
        return new Date(string)
            .toLocaleDateString('ja-JP', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
            })
            .replaceAll('/', '-');
    });

    config.addFilter('relative', (href) => {
        const url = new URL(href);
        return url.pathname + (url.search ? url.search : '') + url.hash;
    });

    config.addFilter('md5', (content) => {
        return crypto.createHash('md5').update(content).digest('hex');
    });

    config.addCollection('artworks', function (api) {
        const artworks = api.getFilteredByTag('artworks');
        return artworks.map((item, index) => {
            item.data.seq = index;
            item.data.thumbnail = ninko.addSuffix(item.data.filename);
            return item;
        });
    });

    config.addTransform('HTML圧縮', async function (content) {
        if ((this.page.outputPath || '').endsWith('.html')) {
            return minifyHTML(content, {
                collapseWhitespace: true,
                useShortDoctype: true,
                removeRedundantAttributes: true,
                removeComments: true,
            });
        }
        return content;
    });

    config.addTransform('XML圧縮', async function (content) {
        if ((this.page.outputPath || '').endsWith('.xml')) {
            return minifyXML(content, {
                shortenNamespaces: false,
            });
        }
        return content;
    });

    config.addTransform('JSON圧縮', async function (content) {
        if ((this.page.outputPath || '').endsWith('.json')) {
            return JSON.stringify(JSON.parse(content));
        }
        return content;
    });

    config.on('eleventy.after', async () => {
        const inputDir = './images/artworks';
        const outputDir = `./_site/images/artworks`;

        fs.mkdirSync(outputDir, { recursive: true });

        fs.readdirSync(inputDir).forEach((filename) => {
            const { name, ext } = path.parse(filename);
            const inputPath = path.join(inputDir, filename);
            const outputPath = path.join(outputDir, name + ext);
            const format = ext.slice(1);

            if (/fanart|original|study/.test(name)) {
                ninko.resize(inputPath, outputPath, 640, 800, format, 100, false);
                ninko.resize(inputPath, ninko.addSuffix(outputPath), 240, 300, format, 60, false);
            }
            if (/doodle/.test(name)) ninko.resize(inputPath, outputPath, 250, 250, format, 70, false);
            if (/animation/.test(name)) ninko.resize(inputPath, outputPath, 250, 250, format, 70, true);
        });
    });
};
