export default {
    category: 'fanart',
    width: 640,
    height: 800,
    gallery: true,
    downscale: true,
    quality: 80,
    animated: false,
    signature: true,
    eleventyComputed: {
        text: (data) => `Fan art of ${data.title}.`,
        rss: (data) => ({ title: `Fan art of ${data.title}` }),
    },
};
