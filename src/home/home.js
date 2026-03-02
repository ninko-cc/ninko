function highlight() {
    const id = location.hash.slice(1);
    document.querySelector('.highlight')?.classList.remove('highlight');
    document.querySelector(`[id="${id}"]`)?.classList.add('highlight');
}

window.addEventListener('hashchange', highlight);
window.addEventListener('DOMContentLoaded', highlight);
