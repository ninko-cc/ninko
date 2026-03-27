export default {
    tags: ['posts'],
    permalink: false,
    width: 640,
    height: 800,
    quality: 100,
    animated: false,
    signature: true,
    eleventyComputed: {
        head: (data) => {
            const length = 30;
            const head = data.text.replace(/<[^>]*>?/gm, '').slice(0, length);
            return head.length == length ? head.slice(0, -1) + '…' : head;
        },
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
