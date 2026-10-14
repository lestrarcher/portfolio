import styles from '../styles/project-detail.css?inline';
import revealStyles from '../styles/grimoire.css?inline';
import { projects } from '../data/projects.js';
import { initGrimoireReveal } from '../utils/grimoire-reveal.js';
import { createGalleryLightbox } from '../utils/gallery-lightbox.js';

class ProjectDetail extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        const project = projects.find(item => item.id === this.getAttribute('project-id'));
        if (!project) {
            this.shadowRoot.innerHTML = `<style>${styles}</style>
                <article><p class="eyebrow">404</p><h1 tabindex="-1">Page introuvable</h1>
                <p>Cette page n’existe pas.</p><a href="/#projects">Retour aux projets</a></article>`;
            return;
        }
        const pending = text => text || 'À compléter.';
        this.shadowRoot.innerHTML = `<style>${styles}</style><style>${revealStyles}</style>
            <article>
                <a class="back-link" href="/#projects">← Tous les projets</a>
                <header data-reveal="chapter">
                    <p class="eyebrow">${project.category}</p>
                    <h1 tabindex="-1">${project.title}</h1>
                    <p class="subtitle">${project.subtitle}</p>
                </header>
                <section data-reveal>
                    <h2>Contexte</h2><p>${project.description}</p>
                </section>
                ${project.story?.length ? `<section class="project-story" data-reveal>
                    <p class="eyebrow">Genèse du projet</p>
                    <h2>Du besoin à l’application</h2>
                    <div class="story-grid">${project.story.map((step, index) => `<div class="story-step">
                        <span class="story-number">${String(index + 1).padStart(2, '0')}</span>
                        <h3>${step.title}</h3><p>${step.text}</p>
                    </div>`).join('')}</div>
                </section>` : ''}
                <section class="gallery" aria-label="Visuels du projet" tabindex="0" ${project.gallery.length > 1 ? 'aria-describedby="gallery-help"' : ''} ${project.gallery.length ? '' : 'hidden'} data-reveal>
                    <figure>
                        <div class="gallery-presentation">
                            <button type="button" class="gallery-stage" aria-haspopup="dialog">
                                <img class="gallery-image" decoding="async">
                            </button>
                        </div>
                        <figcaption class="gallery-captions" aria-live="polite" aria-atomic="true">
                            ${project.gallery.map(item => `<span class="gallery-caption" aria-hidden="true">${item.caption}</span>`).join('')}
                        </figcaption>
                    </figure>
                    <div class="gallery-controls" ${project.gallery.length > 1 ? '' : 'hidden'}>
                        <button type="button" data-gallery-step="-1" aria-label="Image précédente">←</button>
                        <span class="gallery-counter"></span>
                        <button type="button" data-gallery-step="1" aria-label="Image suivante">→</button>
                    </div>
                    <div class="gallery-thumbnails" role="group" aria-label="Choisir une image" ${project.gallery.length > 1 ? '' : 'hidden'}>
                        ${project.gallery.map((item, index) => `<button type="button" class="gallery-thumbnail" data-gallery-index="${index}" aria-label="Afficher l’image ${index + 1} : ${item.alt}" aria-pressed="false">
                            <img src="${item.src}" alt="" width="112" height="72" loading="lazy" decoding="async">
                        </button>`).join('')}
                    </div>
                    <p id="gallery-help" class="gallery-help" ${project.gallery.length > 1 ? '' : 'hidden'}>Utilisez les touches fléchées pour changer d’image.</p>
                </section>
                <div class="detail-grid">
                    <section data-reveal><h2>Fonctionnalités</h2>
                        <ul>${project.features.map(feature => `<li>${feature}</li>`).join('')}</ul>
                    </section>
                    <section data-reveal><h2>Choix techniques</h2>
                        <ul class="tags">${project.technologies.map(tech => `<li>${tech}</li>`).join('')}</ul>
                        <p>${pending(project.technicalChoices)}</p>
                    </section>
                    <section data-reveal><h2>Défis</h2><p>${pending(project.challenges)}</p></section>
                    <section data-reveal><h2>Résultats</h2><p>${pending(project.results)}</p></section>
                </div>
                <footer>
                    <a href="/#projects">← Retour aux projets</a>
                    ${project.demo ? `<a href="${project.demo}" target="_blank" rel="noopener noreferrer">Voir le projet ↗</a>` : ''}
                    ${project.github ? `<a href="${project.github}" target="_blank" rel="noopener noreferrer">Code source ↗</a>` : ''}
                </footer>
            </article>`;
        this.initGallery(project.gallery);
        this.cleanupReveal = initGrimoireReveal(this.shadowRoot);
    }

    initGallery(items) {
        this.galleryEvents?.abort();
        if (!items.length) return;
        this.galleryEvents = new AbortController();
        const options = { signal: this.galleryEvents.signal };
        const gallery = this.shadowRoot.querySelector('.gallery');
        const image = gallery.querySelector('.gallery-image');
        const link = gallery.querySelector('.gallery-stage');
        const thumbnails = [...gallery.querySelectorAll('.gallery-thumbnail')];
        const captions = [...gallery.querySelectorAll('.gallery-caption')];
        let activeIndex = 0;
        const presentation = gallery.querySelector('.gallery-presentation');
        gallery.classList.toggle('gallery--landscape', items.every(item =>
            item.width && item.height ? item.width >= item.height : item.layout !== 'portrait'));
        const updateFormat = () => {
            const item = items[activeIndex];
            const ratio = item.width && item.height ? item.width / item.height
                : image.naturalWidth && image.naturalHeight ? image.naturalWidth / image.naturalHeight
                : item.layout === 'portrait' ? .5 : 16 / 9;
            presentation.classList.toggle('is-portrait', ratio < 1);
            if (ratio < 1) gallery.classList.remove('gallery--landscape');
            presentation.style.setProperty('--image-ratio', ratio);
        };
        image.addEventListener('load', updateFormat, options);
        this.lightbox = createGalleryLightbox(this.shadowRoot, step => {
            if (items.length > 1) select(activeIndex + step);
        });

        const select = (index, followFocus = false) => {
            activeIndex = (index + items.length) % items.length;
            const item = items[activeIndex];
            image.src = item.src;
            image.alt = item.alt;
            for (const dimension of ['width', 'height']) {
                if (item[dimension]) image.setAttribute(dimension, item[dimension]);
                else image.removeAttribute(dimension);
            }
            if (item.layout) image.dataset.layout = item.layout;
            else delete image.dataset.layout;
            link.setAttribute('aria-label', `Ouvrir le visuel : ${item.alt}`);
            updateFormat();
            this.lightbox.sync(item, activeIndex, items.length);
            gallery.querySelector('.gallery-counter').textContent = `${activeIndex + 1} / ${items.length}`;
            thumbnails.forEach((button, i) => button.setAttribute('aria-pressed', String(i === activeIndex)));
            captions.forEach((caption, i) => {
                caption.classList.toggle('is-active', i === activeIndex);
                caption.setAttribute('aria-hidden', String(i !== activeIndex));
            });
            if (followFocus) thumbnails[activeIndex].focus({ preventScroll: true });
            // Scroll only the thumbnail strip, never the page or the main image.
            const strip = gallery.querySelector('.gallery-thumbnails');
            const button = thumbnails[activeIndex];
            const bounds = strip.getBoundingClientRect();
            const selected = button.getBoundingClientRect();
            strip.scrollLeft += selected.left - bounds.left - (strip.clientWidth - selected.width) / 2;
        };

        select(0);
        link.addEventListener('click', () => this.lightbox.open(items[activeIndex], activeIndex, items.length, link), options);
        gallery.addEventListener('click', event => {
            const thumbnail = event.target.closest('[data-gallery-index]');
            const step = event.target.closest('[data-gallery-step]');
            if (thumbnail) select(Number(thumbnail.dataset.galleryIndex));
            else if (step) select(activeIndex + Number(step.dataset.galleryStep));
        }, options);
        gallery.addEventListener('keydown', event => {
            if (items.length < 2 || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
            let next;
            if (['ArrowLeft', 'ArrowUp'].includes(event.key)) next = activeIndex - 1;
            else if (['ArrowRight', 'ArrowDown'].includes(event.key)) next = activeIndex + 1;
            else if (event.key === 'Home') next = 0;
            else if (event.key === 'End') next = items.length - 1;
            else return;
            event.preventDefault();
            select(next, event.target.matches('.gallery-thumbnail'));
        }, options);
    }

    disconnectedCallback() {
        this.cleanupReveal?.();
        this.galleryEvents?.abort();
        this.lightbox?.destroy();
    }

    focusHeading() { this.shadowRoot.querySelector('h1')?.focus({ preventScroll: true }); }
}

customElements.define('project-detail', ProjectDetail);
