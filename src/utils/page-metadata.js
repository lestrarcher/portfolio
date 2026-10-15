import { getPageMetadata } from '../data/page-metadata.js';

export function updatePageMetadata(project, path) {
    const metadata = getPageMetadata(project, path);
    document.title = metadata.title;
    const setMeta = (attribute, key, content) => {
        let element = document.head.querySelector(`meta[${attribute}="${key}"]`);
        if (content === null) { element?.remove(); return; }
        if (!element) {
            element = document.createElement('meta');
            element.setAttribute(attribute, key);
            document.head.append(element);
        }
        element.content = content;
    };
    setMeta('name', 'description', metadata.description);
    setMeta('property', 'og:title', metadata.title);
    setMeta('property', 'og:description', metadata.description);
    setMeta('property', 'og:type', metadata.type);
    setMeta('property', 'og:url', metadata.url);
    setMeta('name', 'robots', metadata.notFound ? 'noindex' : null);
    let canonical = document.head.querySelector('link[rel="canonical"]');
    if (!metadata.url) { canonical?.remove(); return; }
    if (!canonical) {
        canonical = document.createElement('link');
        canonical.rel = 'canonical';
        document.head.append(canonical);
    }
    canonical.href = metadata.url;
}
