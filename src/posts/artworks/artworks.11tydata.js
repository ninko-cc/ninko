export default {
    tags: ['artworks'],
    width: 640,
    height: 800,
    quality: 100,
    animated: false,
    signature: true,
    eleventyComputed: {
        thumbnail: (data) => {
            return {
                image: data.image.replace(/(\.[^.]+)$/, '_thumbnail$1'),
                width: 300,
                height: 375,
                quality: 70,
                animated: false,
                signature: false,
            };
        },
    },
};
