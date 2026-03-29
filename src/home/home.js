document.querySelectorAll('section img').forEach((img) => {
    img.onload = () => {
        const html = `<link rel="prefetch" href="${img.src.replace('_thumbnail', '')}">`;
        document.head.insertAdjacentHTML('beforeend', html);
    };
});
