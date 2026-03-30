export default {
    category: 'textonly',
    gallery: false,
    width: 300,
    height: 300,
    display: 'TEXT ONLY',
    eleventyComputed: {
        rss: (data) => ({ title: data.title }),
        thumbnail: () => {
            return {
                width: 300,
                height: 300,
            };
        },
    },
};
