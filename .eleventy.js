import fs from 'fs';
import path from 'path';

import ninko from './ninko.js';
import shortcode from './eleventy/shortcodes.js';
import filters from './eleventy/filters.js';
import transforms from './eleventy/transforms.js';

export default (config) => {
    config.setInputDirectory('src');

    config.addWatchTarget('src/**/*.css');
    config.addWatchTarget('src/**/*.js');

    config.addPassthroughCopy('images/buttons');
    config.addPassthroughCopy('src/robots.txt');
    config.addPassthroughCopy('src/_headers');

    config.addShortcode('injectCSS', shortcode.injectCSS);
    config.addShortcode('injectJS', shortcode.injectJS);
    config.addShortcode('button', shortcode.button);
    config.addShortcode('head', shortcode.head);

    config.addFilter('iso8601', filters.iso8601);

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

    config.addTransform('HTML圧縮', transforms.minifyHTML);
    config.addTransform('XML圧縮', transforms.minifyXML);
    config.addTransform('JSON圧縮', transforms.minifyJSON);

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
