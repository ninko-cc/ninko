export default {
    category: 'study',
    width: 640,
    height: 800,
    gallery: true,
    downscale: true,
    quality: 80,
    animated: false,
    signature: true,
    eleventyComputed: {
        text: (data) => `Study of ${data.title.toLowerCase()}.`,
        rss: (data) => ({ title: `Study of ${data.title.toLowerCase()}` }),
    },
};
