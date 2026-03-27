export default {
    tags: 'posts',
    permalink: false,
    eleventyComputed: {
        head: (data) => {
            const length = 30;
            const head = data.text.replace(/<[^>]*>?/gm, '').slice(0, length);
            return head.length == length ? head.slice(0, -1) + '…' : head;
        },
    },
};
