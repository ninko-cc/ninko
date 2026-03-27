export default {
    category: 'textonly',
    thumbnail: {
        width: 300,
        height: 300,
        alt: 'TEXT ONLY',
    },
    eleventyComputed: {
        rss: (data) => ({ title: data.title }),
    },
};
