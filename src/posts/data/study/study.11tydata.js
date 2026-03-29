export default {
    category: 'study',
    gallery: true,
    eleventyComputed: {
        text: (data) => `Study of ${data.title.toLowerCase()}.`,
        rss: (data) => ({ title: `Study of ${data.title.toLowerCase()}` }),
    },
};
