import fs from 'fs';
import path from 'path';

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
    config.addPassthroughCopy('src/_headers');

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

    config.addShortcode('button', (src, href) => {
        const content = href
            ? `<a href="${href}" target="_blank"><img class="button" src="${src}" width="200" height="40" loading="lazy" /></a>`
            : `<img class="button not-found" src="${src}" width="200" height="40" loading="lazy" />`;
        return `<span>${content}</span>`;
    });

    config.addShortcode('head', (scale = '1.0') => {
        return `
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=${scale}" />
        <meta name="robots" content="noindex, nofollow" />
        <meta name="pinterest" content="nopin" />
        <link rel="alternate" type="application/rss+xml" title="忍狐のホームページ" href="https://ninko.cc/rss.xml" />
        <title>忍狐のホームページ</title>
        `;
    });

    config.addFilter('iso8601', (date) => {
        return new Date(date).toISOString().replace(/\.\d{3}Z$/, 'Z');
    });

    config.addCollection('posts', function (api) {
        let seq = 0;

        return api.getFilteredByTag('posts').map((item, index) => {
            if (item.data.tags.includes('artworks')) {
                item.data.seq = seq++;
                item.data.width = ninko.artwork.width;
                item.data.height = ninko.artwork.height;
                item.data.thumbnail = {
                    image: ninko.addSuffix(item.data.image),
                    width: ninko.artwork.thumbnail.width,
                    height: ninko.artwork.thumbnail.height,
                };
            }

            const { title, category } = item.data;

            item.data.id = index;
            item.data.path = `/home/#${index}`;
            item.data.rss = { title: title };

            switch (category) {
                case 'original':
                    item.data.text = `${title}.`;
                    break;
                case 'fanart':
                    item.data.rss.title = `Fan art of ${title}`;
                    item.data.text = `Fan art of ${title}.`;
                    break;
                case 'study':
                    item.data.rss.title = `Study of ${title.toLowerCase()}`;
                    item.data.text = `Study of ${title.toLowerCase()}.`;
                    break;
                case 'doodle':
                    item.data.rss.title = `Diary updated: ${ninko.iso8601(item.date)}`;
                    item.data.thumbnail = {
                        image: item.data.image,
                        width: ninko.doodle.thumbnail.width,
                        height: ninko.doodle.thumbnail.height,
                    };
                    break;
                case 'textonly':
                    item.data.thumbnail = {
                        alt: 'TEXT ONLY',
                        width: ninko.doodle.thumbnail.width,
                        height: ninko.doodle.thumbnail.height,
                    };
                    break;
            }

            item.data.head = ninko.head(item.data.text);

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

    config.on('eleventy.after', async ({ directories }) => {
        const inputDir = './images/artworks';
        const outputDir = path.join(directories.output, inputDir);

        fs.mkdirSync(outputDir, { recursive: true });

        fs.readdirSync(inputDir).forEach((filename) => {
            const inputPath = path.join(inputDir, filename);
            const outputPath = path.join(outputDir, filename);

            if (/fanart|original|study/.test(filename)) {
                ninko.artwork.resize(inputPath, outputPath, true);
                ninko.artwork.thumbnail.resize(inputPath, ninko.addSuffix(outputPath));
            }
            if (/doodle/.test(filename)) ninko.doodle.thumbnail.resize(inputPath, outputPath);
            if (/animation/.test(filename)) ninko.animation.thumbnail.resize(inputPath, outputPath);
        });
    });

    if (process.env.CACHE_ENABLED === 'true') {
        config.setServerOptions({ headers: { 'Cache-Control': 'public, max-age=60, must-revalidate' } });
    }
};
