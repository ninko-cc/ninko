export default {
    category: 'study',
    tags: ['artworks'],
    eleventyComputed: {
        text: (data) => `Study of ${data.title.toLowerCase()}.`,
        rss: (data) => ({ title: `Study of ${data.title.toLowerCase()}` }),
    },
};
