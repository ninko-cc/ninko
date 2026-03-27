export default {
    category: 'original',
    tags: ['artworks'],
    eleventyComputed: {
        text: (data) => data.title + '.',
        rss: (data) => ({ title: data.title }),
    },
};
