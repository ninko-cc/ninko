import shortcode from './eleventy/shortcodes.js';
import filters from './eleventy/filters.js';
import transforms from './eleventy/transforms.js';
import events from './eleventy/events.js';

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

    let posts;

    config.addCollection('posts', function (api) {
        posts = api.getFilteredByTag('posts').map((item, index) => {
            item.data.id = index;
            item.data.path = `/home/#${index}`;
            return item;
        });
        return posts;
    });

    config.addCollection('artworks', function (api) {
        return api.getFilteredByTag('artworks').map((item, index) => {
            item.data.seq = index;
            return item;
        });
    });

    config.addTransform('HTML圧縮', transforms.minifyHTML);
    config.addTransform('XML圧縮', transforms.minifyXML);
    config.addTransform('JSON圧縮', transforms.minifyJSON);

    config.on('eleventy.after', async ({ directories }) => {
        events.after(directories, posts);
    });

    if (process.env.CACHE_ENABLED === 'true') {
        config.setServerOptions({ headers: { 'Cache-Control': 'public, max-age=60, must-revalidate' } });
    }
};
