export default {
    category: 'original',
    width: 640,
    height: 800,
    gallery: true,
    downscale: true,
    quality: 80,
    animated: false,
    signature: true,
    eleventyComputed: {
        text: (data) => data.title + '.',
        rss: (data) => ({ title: data.title }),
    },
};
