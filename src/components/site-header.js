import headerStyles from '../styles/site-header.css?inline';
import { navigationSections } from '../data/navigation.js';

class SiteHeader extends HTMLElement {

    connectedCallback() {
        this.events = new AbortController();
        const options = { signal: this.events.signal };
        const button = this.shadowRoot.querySelector('.menu-toggle');
        const nav = this.shadowRoot.querySelector('.header-nav');
        this.closeMenu = (restoreFocus = false) => {
            button.setAttribute('aria-expanded', 'false');
            nav.classList.remove('is-open');
            if (restoreFocus) button.focus();
        };
        button.addEventListener('click', () => {
            const open = button.getAttribute('aria-expanded') !== 'true';
            button.setAttribute('aria-expanded', String(open));
            nav.classList.toggle('is-open', open);
        }, options);
        nav.addEventListener('click', event => {
            if (event.target.closest('a')) this.closeMenu();
        }, options);
        this.addEventListener('keydown', event => {
            if (event.key === 'Escape' && button.getAttribute('aria-expanded') === 'true') {
                event.preventDefault();
                this.closeMenu(true);
            }
        }, options);
        document.addEventListener('pointerdown', event => {
            if (!event.composedPath().includes(this)) this.closeMenu();
        }, options);
        this.addEventListener('focusout', () => {
            queueMicrotask(() => {
                if (!this.shadowRoot.activeElement) this.closeMenu();
            });
        }, options);
        const themeButton = this.shadowRoot.querySelector('.theme-toggle');
        const updateThemeButton = () => {
            const theme = document.documentElement.dataset.theme;

            themeButton.setAttribute('aria-label', theme === 'dark' ? 'Activer le thème clair' : 'Activer le thème sombre');
            themeButton.setAttribute('aria-pressed', String(theme === 'light'));
            themeButton.querySelector('.theme-toggle__label').textContent = theme === 'dark' ? 'Clair' : 'Sombre';
        };
        updateThemeButton();
        window.addEventListener('portfolio-theme-change', updateThemeButton, options);
        themeButton.addEventListener('click', () => {
            window.portfolioTheme.set(document.documentElement.dataset.theme === 'light' ? 'dark' : 'light');
        }, options);
        this.mobile = matchMedia('(max-width: 900px)');
        this.mobile.addEventListener('change', () => {
            const focusInNav = nav.contains(this.shadowRoot.activeElement);
            this.closeMenu(this.mobile.matches && focusInNav);
            if (!this.mobile.matches && this.shadowRoot.activeElement === button) nav.querySelector('a').focus();
        }, options);
    }

    disconnectedCallback() {
        this.events?.abort();
        this.closeMenu?.();
    }

    constructor() {

        super();
        this.attachShadow({ mode: 'open' });
        
        this.shadowRoot.innerHTML = `
            <style>${headerStyles}</style>
            <header>
                <div class="header-site">
                    <span class="header-site__monogram" aria-hidden="true">MK</span>
                    <div class="header-site__id">
                        <p class="header-site__id-name">Mickael KERN</p>
                        <p class="header-site__id-class">Développeur Full-Stack</p>
                    </div>
                </div>
                <div class="header-actions">
                  <button class="theme-toggle" type="button" aria-label="Activer le thème clair" aria-pressed="false">
                    <span class="theme-toggle__symbol" aria-hidden="true">☼</span>
                    <span class="theme-toggle__label">Clair</span>
                  </button>
                <button class="menu-toggle" type="button" aria-label="Menu de navigation" aria-expanded="false" aria-controls="header-navigation">
                    <span aria-hidden="true"></span><span aria-hidden="true"></span><span aria-hidden="true"></span>
                </button>
                </div>
                <nav class="header-nav" id="header-navigation" aria-label="Navigation principale">
                    <ul class="header-nav__list">
                        ${navigationSections.map(section => `
                            <li class="header-nav__list-item"><a href="/#${section.id}">${section.label}</a></li>
                        `).join('')}
                    </ul>
                </nav>
            </header>
            `
    }
}

customElements.define('site-header', SiteHeader)
