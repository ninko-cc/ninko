export default {
    category: 'doodle',
    eleventyComputed: {
        thumbnail: (data) => {
            return {
                image: data.image,
                width: 300,
                height: 300,
                quality: 70,
                animated: data.animated || false,
                signature: false,
            };
        },
        rss: (data) => {
            const formatter = new Intl.DateTimeFormat('ja-JP', { year: 'numeric', month: '2-digit', day: '2-digit' });
            const date = formatter.format(data.page.date).replaceAll('/', '-');
            return {
                title: `Diary updated: ${date}`,
            };
        },
    },
};
