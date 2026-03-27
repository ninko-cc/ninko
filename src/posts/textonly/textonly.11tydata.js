export default {
    category: 'textonly',
    eleventyComputed: {
        rss: (data) => ({ title: data.title }),
        thumbnail: (data) => {
            return {
                width: 300,
                height: 300,
                alt: 'TEXT ONLY',
            };
        },
    },
};
