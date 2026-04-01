export default {
    category: 'textonly',
    display: 'TEXT ONLY',
    width: 300,
    height: 300,
    gallery: false,
    downscale: false,
    animated: false,
    signature: false,
    eleventyComputed: {
        rss: (data) => ({ title: data.title }),
    },
};
