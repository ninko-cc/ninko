function mail() {
    const secret = 'Y29udGFjdEBuaW5rby5jYw==';
    window.location.href = 'mailto:' + atob(secret);
}
