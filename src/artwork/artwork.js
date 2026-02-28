const params = new URLSearchParams(location.search);
const seq = params.get('seq');

const art = artworks[seq];

const h1 = document.querySelector('h1');
h1.textContent = art[0];

const small = document.createElement('small');
small.textContent = `${art[1]} / ${art[2]}`;
h1.appendChild(small);

const img = document.querySelector('img');
img.setAttribute('src', `/images/artworks/${art[3]}`);
