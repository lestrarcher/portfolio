import { mkdirSync, readFileSync, writeFileSync, statSync } from 'node:fs';
import { resolve, sep } from 'node:path';
import { projects } from '../src/data/projects.js';
import { getPageMetadata } from '../src/data/page-metadata.js';

const escape = value => String(value).replace(/[&<>"']/g, character => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
}[character]));

export function withMetadata(html, metadata) {
    const tags = [
        `<title>${escape(metadata.title)}</title>`,
        `<meta name="description" content="${escape(metadata.description)}" />`,
        `<meta property="og:title" content="${escape(metadata.title)}" />`,
        `<meta property="og:description" content="${escape(metadata.description)}" />`,
        `<meta property="og:type" content="${metadata.type}" />`,
        ...(metadata.url ? [
            `<meta property="og:url" content="${escape(metadata.url)}" />`,
            `<link rel="canonical" href="${escape(metadata.url)}" />`
        ] : []),
        ...(metadata.notFound ? ['<meta name="robots" content="noindex" />'] : [])
    ];
    if (!html.includes('<!-- seo:start -->') || !html.includes('<!-- seo:end -->')) {
        throw new Error('Missing SEO markers in the Vite HTML entry.');
    }
    return html.replace(/<!-- seo:start -->[\s\S]*?<!-- seo:end -->/,
        () => `<!-- seo:start -->\n    ${tags.join('\n    ')}\n    <!-- seo:end -->`);
}

export function seoPages() {
    let outputDirectory;
    const byPath = new Map(projects.map(project => [`/projects/${project.id}`, project]));
    return {
        name: 'static-project-metadata',
        configResolved(config) {
            outputDirectory = resolve(config.root, config.build.outDir);
            if (byPath.size !== projects.length || projects.some(project => !/^[a-z0-9-]+$/.test(project.id))) {
                throw new Error('Project slugs must be unique and contain only lowercase letters, digits and hyphens.');
            }
        },
        transformIndexHtml(html, context) {
            const path = (context.path || '/').replace(/\/$/, '') || '/';
            return withMetadata(html, getPageMetadata(byPath.get(path), path === '/index.html' ? '/' : path));
        },
        writeBundle() {
            // Copy only the compiled document shell; hashed JS/CSS remain shared assets.
            const html = readFileSync(resolve(outputDirectory, 'index.html'), 'utf8');
            mkdirSync(resolve(outputDirectory, 'projects'), { recursive: true });
            for (const [path, project] of byPath) {
                writeFileSync(resolve(outputDirectory, `.${path}.html`), withMetadata(html, getPageMetadata(project, path)));
            }
            writeFileSync(resolve(outputDirectory, '404.html'), withMetadata(html, getPageMetadata(null, '/404')));
        },
        configurePreviewServer(server) {
            // Mirror Vercel clean URLs and document 404s instead of Vite's SPA fallback.
            server.middlewares.use((request, response, next) => {
                const path = new URL(request.url, 'http://localhost').pathname.replace(/\/$/, '') || '/';
                if (path === '/') return next();
                const asset = resolve(outputDirectory, `.${path}`);
                if (asset.startsWith(outputDirectory + sep) && statSync(asset, { throwIfNoEntry: false })?.isFile()) return next();
                const project = byPath.get(path);
                const file = project ? `projects/${project.id}.html` : '404.html';
                response.statusCode = project ? 200 : 404;
                response.setHeader('Content-Type', 'text/html; charset=utf-8');
                response.end(request.method === 'HEAD' ? undefined : readFileSync(resolve(outputDirectory, file)));
            });
        }
    };
}
