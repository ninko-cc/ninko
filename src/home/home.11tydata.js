export default {
    eleventyComputed: {
        additionalHead: (data) => {
            const offset = (data.pagination.pageNumber + 1) * 5;
            const posts = data.collections.posts.toReversed().slice(offset, offset + 5);
            const images = posts.map((post) => post.data.thumbnail.image);
            const links = images.map((image) =>
                image ? `<link rel="prefetch" as="image" href="/images/artworks/${image}">` : '',
            );
            return links.join('');
        },
    },
};
