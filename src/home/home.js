(async () => {
    const url = 'https://public.api.bsky.app/xrpc/app.bsky.feed.getAuthorFeed';
    const query = new URLSearchParams({ actor: 'ninko.cc', limit: 5 });

    const res = await fetch(`${url}?${query}`);
    const { feed } = await res.json();
    const posts = feed.map((feed) => feed.post.record);

    const list = document.querySelector('#tweet-list');

    posts.forEach((post, index) => {
        list.children[index].textContent = `${post.text} — ${format(post.createdAt)}`;
    });

    function format(createdAt) {
        const s = Math.floor((Date.now() - new Date(createdAt)) / 1000);
        if (s < 60) return `${s}秒前`;
        if (s < 3600) return `${Math.floor(s / 60)}分前`;
        if (s < 86400) return `${Math.floor(s / 3600)}時間前`;
        return `${Math.floor(s / 86400)}日前`;
    }
})();

(() => {
    const params = new URLSearchParams(location.search);
    const date = params.get('date');

    const target = document.querySelector(`[id="${date}"]`);
    if (target) target.scrollIntoView();
})();
