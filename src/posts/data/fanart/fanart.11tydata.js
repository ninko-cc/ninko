export default {
    category: 'fanart',
    width: 640,
    height: 800,
    quality: 80,
    animated: false,
    signature: true,
    gallery: true,
    eleventyComputed: {
        text: (data) => `Fan art of ${data.title}.`,
        rss: (data) => ({ title: `Fan art of ${data.title}` }),
    },
};
