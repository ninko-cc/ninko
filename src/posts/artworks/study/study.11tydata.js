export default {
    category: 'study',
    eleventyComputed: {
        text: (data) => `Study of ${data.title.toLowerCase()}.`,
        rss: (data) => ({ title: `Study of ${data.title.toLowerCase()}` }),
    },
};
