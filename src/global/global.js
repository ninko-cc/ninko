document.querySelector('.mail').addEventListener('click', () => {
    const secret = 'Y29udGFjdEBuaW5rby5jYw==';
    const address = atob(secret);
    window.location.href = 'mailto:' + address;
});
