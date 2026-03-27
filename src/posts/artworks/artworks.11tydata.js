export default {
    tags: ['artworks'],
    width: 640,
    height: 800,
    quality: 100,
    eleventyComputed: {
        thumbnail: (data) => {
            return {
                width: 300,
                height: 375,
                quality: 70,
                image: data.image.replace(/(\.[^.]+)$/, '_thumbnail$1'),
            };
        },
    },
};
