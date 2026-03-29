export default {
    category: 'fanart',
    gallery: true,
    eleventyComputed: {
        text: (data) => `Fan art of ${data.title}.`,
        rss: (data) => ({ title: `Fan art of ${data.title}` }),
    },
};
