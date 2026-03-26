import { UAParser } from 'ua-parser-js';
import template from './template.html';

export function renderHTML(rows, pageNumber, totalPages) {
    const html = template
        .replace('{{ROWS}}', rows.map(tr).join(''))
        .replace('{{PREV}}', pageNumber > 1 ? `<a href="?page=${pageNumber - 1}">Prev</a>` : '')
        .replace('{{PAGE_NUMBER}}', `<span>${pageNumber} / ${totalPages}</span>`)
        .replace('{{NEXT}}', pageNumber < totalPages ? `<a href="?page=${pageNumber + 1}">Next</a>` : '');

    return new Response(html, { headers: { 'Content-Type': 'text/html' } });
}

function tr(row) {
    const date = row.accessed_at.slice(2, 10).replaceAll('-', '/');
    const time = row.accessed_at.slice(11, 19);
    const ua = new UAParser(row.ua);
    const os = ua.getOS()?.name ?? 'Unknown';
    const browser = ua.getBrowser()?.name?.replace(' ', '') ?? 'Unknown';

    return `
    <tr>
        <td><a href="https://ipapi.co/?q=${row.ip}" target="_blank">${date} ${time}</a></td>
        <td>${row.path}</td>
        <td>${row.region}/${row.city}</td>
        <td>${row.org}</td>
        <td>${os + '/' + browser}</td>
        <td>${row.referer}</td>
    </tr>`;
}
