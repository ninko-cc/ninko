export default {
    category: 'doodle',
    eleventyComputed: {
        rss: (data) => {
            const formatter = new Intl.DateTimeFormat('ja-JP', { year: 'numeric', month: '2-digit', day: '2-digit' });
            const date = formatter.format(data.page.date).replaceAll('/', '-');
            return { title: `Diary updated: ${date}` };
        },
    },
};
