export default {
    category: 'original',
    width: 640,
    height: 800,
    quality: 80,
    animated: false,
    signature: true,
    gallery: true,
    eleventyComputed: {
        text: (data) => data.title + '.',
        rss: (data) => ({ title: data.title }),
    },
};
