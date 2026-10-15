import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { preview } from 'vite';
import { projects } from '../src/data/projects.js';

const read = file => readFileSync(new URL(`../dist/${file}`, import.meta.url), 'utf8');
const decode = text => text.replace(/&(amp|lt|gt|quot|#39);/g, (_, name) => ({amp:'&',lt:'<',gt:'>',quot:'"','#39':"'"}[name]));
const meta = (html, key) => {
    const matches = [...html.matchAll(new RegExp(`<meta (?:name|property)="${key}" content="([^"]*)"`, 'g'))];
    assert.equal(matches.length, 1, `${key} must occur once`);
    return decode(matches[0][1]);
};
const home = read('index.html');
const assets = html => [...html.matchAll(/(?:src|href)="(\/(?:assets\/[^" ]+|theme\.js|favicon\.svg))"/g)].map(match => match[1]);
const server = await preview({preview:{host:'127.0.0.1',port:4179,strictPort:true}});
const base = 'http://127.0.0.1:4179';
try {
    for (const project of projects) {
        const path = `/projects/${project.id}`;
        const html = read(`projects/${project.id}.html`);
        const title = `${project.title} | Portfolio`;
        assert.equal(decode(html.match(/<title>(.*?)<\/title>/s)[1]), title);
        assert.equal(meta(html, 'description'), project.description);
        assert.equal(meta(html, 'og:title'), title);
        assert.equal(meta(html, 'og:description'), project.description);
        assert.equal(meta(html, 'og:type'), 'website');
        assert.equal(meta(html, 'og:url'), `https://mickael-kern.vercel.app${path}`);
        assert.equal((html.match(/rel="canonical"/g) || []).length, 1);
        assert.ok(html.includes(`rel="canonical" href="https://mickael-kern.vercel.app${path}"`));
        assert.deepEqual(assets(html), assets(home));
        assert.equal(html.split('<body>')[1], home.split('<body>')[1], 'Application markup is unchanged');
        for (const suffix of ['', '/', '?share=1']) {
            const response = await fetch(base + path + suffix);
            assert.equal(response.status, 200);
            assert.equal(await response.text(), html);
        }
        console.log(`OK HTML initial et HTTP : ${path}`);
    }
    assert.equal(await (await fetch(base + '/')).text(), home);
    for (const path of ['/projects/inexistant','/projects/inexistant.html','/projects/inexistant.png','/inexistant']) {
        const response = await fetch(base + path);
        assert.equal(response.status, 404, path);
        const html = await response.text();
        assert.equal(meta(html, 'robots'), 'noindex');
        assert.ok(!html.includes('rel="canonical"'));
        assert.ok(html.includes('<title>Page introuvable | Portfolio</title>'));
    }
    const resources = new Set([...assets(home), '/src/styles/arcane-dice.css', ...projects.flatMap(p => [p.image, ...p.gallery.map(i => i.src)])]);
    for (const path of resources) {
        const response = await fetch(base + path);
        assert.equal(response.status, 200, path);
        assert.ok(!response.headers.get('content-type').includes('text/html'), path);
        await response.arrayBuffer();
    }
    console.log(`OK accueil, 404 HTTP/noindex et ${resources.size} ressources partagées`);
} finally {
    await new Promise(resolve => server.httpServer.close(resolve));
}
