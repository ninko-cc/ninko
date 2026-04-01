export default {
    category: 'textonly',
    display: 'TEXT ONLY',
    image: null,
    width: 300,
    height: 300,
    animated: false,
    signature: false,
    gallery: false,
    eleventyComputed: {
        rss: (data) => ({ title: data.title }),
    },
};
