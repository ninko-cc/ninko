import path from 'path';
import shortcodes from './eleventy/shortcodes.js';
import filters from './eleventy/filters.js';
import transforms from './eleventy/transforms.js';
import events from './eleventy/events.js';

const ARTWORKS_DIR = './images/artworks';
const SIGNATURE_FILE = './images/signature/20260314_signature.webp';

export default (config) => {
    config.setInputDirectory('src');
    config.setOutputDirectory('_site');

    config.addWatchTarget('src/**/*.css');
    config.addWatchTarget('src/**/*.js');

    config.addPassthroughCopy('images/buttons');
    config.addPassthroughCopy('src/robots.txt');
    config.addPassthroughCopy('src/_headers');

    config.addShortcode('injectCSS', shortcodes.injectCSS);
    config.addShortcode('injectJS', shortcodes.injectJS);
    config.addShortcode('button', shortcodes.button);

    config.addFilter('iso8601', filters.iso8601);

    config.addTransform('HTML圧縮', transforms.minifyHTML);
    config.addTransform('XML圧縮', transforms.minifyXML);
    config.addTransform('JSON圧縮', transforms.minifyJSON);

    let posts;

    config.addCollection('posts', function (api) {
        posts = api.getFilteredByTag('posts').map((item, index) => {
            item.data.id = index + 1;
            return item;
        });
        return posts;
    });

    config.on('eleventy.after', async ({ directories: { output } }) => {
        events.after.downscale(ARTWORKS_DIR, path.join(output, ARTWORKS_DIR), SIGNATURE_FILE, posts);
    });

    if (process.env.CACHE_ENABLED === 'true') {
        config.setServerOptions({ headers: { 'Cache-Control': 'public, max-age=60, must-revalidate' } });
    }
};
