export default {
    category: 'textonly',
    gallery: false,
    eleventyComputed: {
        rss: (data) => ({ title: data.title }),
        thumbnail: (data) => {
            return {
                width: 300,
                height: 300,
                display: 'TEXT ONLY',
            };
        },
    },
};
