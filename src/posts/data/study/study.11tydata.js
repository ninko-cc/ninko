export default {
    category: 'study',
    width: 640,
    height: 800,
    quality: 80,
    animated: false,
    signature: true,
    gallery: true,
    eleventyComputed: {
        text: (data) => `Study of ${data.title.toLowerCase()}.`,
        rss: (data) => ({ title: `Study of ${data.title.toLowerCase()}` }),
    },
};
