export default {
    category: 'original',
    gallery: true,
    eleventyComputed: {
        text: (data) => data.title + '.',
        rss: (data) => ({ title: data.title }),
    },
};
