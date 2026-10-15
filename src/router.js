import { projects } from './data/projects.js';
import './components/project-detail.js';
import { updatePageMetadata } from './utils/page-metadata.js';

// The existing home nodes are kept, so returning home preserves component state.
export function initRouter() {
    const main = document.querySelector('main');
    const home = document.createDocumentFragment();
    const quest = document.querySelector('quest-progress');
    let currentPath = '/';
    let handledURL = '';
    let navigation = 0;
    let restoring = false;
    let scrollFrame;
    let persistTimer;
    const positions = new Map();
    const ensureEntry = () => {
        if (!history.state?.portfolioKey) {
            history.replaceState({ ...history.state, portfolioKey: crypto.randomUUID() }, '');
        }
        return history.state.portfolioKey;
    };
    let entryKey = ensureEntry();
    history.scrollRestoration = 'manual';

    const saveScroll = () => {
        positions.set(entryKey, [scrollX, scrollY]);
        history.replaceState({ ...history.state, portfolioScroll: [scrollX, scrollY] }, '');
    };
    const nextFrame = () => new Promise(resolve => requestAnimationFrame(resolve));

    async function render({ initial = false, restore = null } = {}) {
        const token = ++navigation;
        restoring = true;
        clearTimeout(persistTimer);
        cancelAnimationFrame(scrollFrame);
        scrollFrame = null;
        handledURL = location.href;
        const path = location.pathname.replace(/\/$/, '') || '/';
        const changed = currentPath !== path;
        if (changed) {
            if (currentPath === '/') {
                home.append(...main.childNodes);
                quest.remove();
            } else {
                main.replaceChildren();
            }
            if (path === '/') {
                main.append(home);
                document.body.append(quest);
            } else {
                const project = projects.find(item => path === `/projects/${item.id}`);
                const detail = document.createElement('project-detail');
                if (project) detail.setAttribute('project-id', project.id);
                main.append(document.createElement('site-header'), detail);
            }
            currentPath = path;
        }
        updatePageMetadata(projects.find(item => path === `/projects/${item.id}`), path);
        // Give reconnected Shadow Roots a layout before restoring the scroll position.
        await nextFrame();
        await nextFrame();
        if (token !== navigation) return;
        let target;
        try { target = path === '/' && location.hash ? document.getElementById(decodeURIComponent(location.hash.slice(1))) : null; }
        catch { target = null; }
        if (restore) window.scrollTo({ left: restore[0], top: restore[1], behavior: 'instant' });
        else if (target) target.scrollIntoView({ behavior: changed || initial ? 'instant' : 'auto', block: 'start' });
        else window.scrollTo({ top: 0, left: 0, behavior: 'instant' });

        if (!initial) {
            if (path !== '/') main.querySelector('project-detail')?.focusHeading();
            else if (target) {
                target.setAttribute('tabindex', '-1');
                target.focus({ preventScroll: true });
            }
        }
        restoring = false;
        saveScroll();
    }

    document.addEventListener('click', event => {
        if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
        const link = event.composedPath().find(node => node instanceof HTMLAnchorElement);
        if (!link || link.hasAttribute('download') || (link.target && link.target !== '_self')) return;
        const url = new URL(link.href);
        if (url.origin !== location.origin || !['http:', 'https:'].includes(url.protocol)) return;
        // Static assets remain ordinary links; only document routes belong to the router.
        if (/\.[a-z\d]+$/i.test(url.pathname)) return;
        event.preventDefault();
        saveScroll();
        if (url.href !== location.href) {
            history.pushState({ portfolioKey: crypto.randomUUID(), portfolioScroll: [0, 0] }, '', url);
            entryKey = history.state.portfolioKey;
        }
        void render();
    });
    window.addEventListener('scroll', () => {
        if (restoring || scrollFrame != null) return;
        scrollFrame = requestAnimationFrame(() => {
            scrollFrame = null;
            if (!restoring) {
                positions.set(entryKey, [scrollX, scrollY]);
                // Avoid writing browser history on every animation frame.
                clearTimeout(persistTimer);
                persistTimer = setTimeout(saveScroll, 250);
            }
        });
    }, { passive: true });
    window.addEventListener('popstate', event => {
        if (!restoring) positions.set(entryKey, [scrollX, scrollY]);
        entryKey = ensureEntry();
        void render({ restore: positions.get(entryKey) ?? event.state?.portfolioScroll ?? null });
    });
    window.addEventListener('hashchange', () => {
        if (handledURL !== location.href) void render();
    });
    window.addEventListener('pagehide', saveScroll);
    void render({ initial: true, restore: location.hash ? null : history.state?.portfolioScroll });
}
