
import cardStyles from '../../styles/cards/project-card.css?inline';
import { projects } from '../../data/projects.js';

class ProjectCard extends HTMLElement {

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        const project = projects.find(
            project => project.id === this.getAttribute('project-id')
        );

        if (!project) {
            console.warn(`Projet introuvable : ${this.getAttribute('project-id')}`);
            return;
        }

        this.render(project);
        this.setupReflection();
    }

    render(project) {
        const tags = project.technologies
            .map(tech => `<span>${tech}</span>`)
            .join('');

        const links = [
            project.demo
                ? `<a href="${project.demo}" target="_blank" rel="noopener noreferrer">
                       Voir le projet ↗
                   </a>`
                : '',
            project.github
                ? `<a href="${project.github}" target="_blank" rel="noopener noreferrer">
                       Code source ↗
                   </a>`
                : ''
        ].filter(Boolean).join('');

        this.shadowRoot.innerHTML = `
            <style>${cardStyles}</style>

            <article class="card">
                <div class="card-visual">
                    <span class="card-visual__category">
                        ${project.category}
                    </span>

                    <img
                        src="${project.image}"
                        alt="${project.imageAlt}"
                        loading="lazy"
                    >
                </div>

                <div class="card-body">
                    <p class="card-body__subtitle">
                        ${project.subtitle}
                    </p>

                    <h3 class="card-body__name">
                        ${project.title}
                    </h3>

                    <p class="card-body__description">
                        ${project.description}
                    </p>

                    <div class="card-body__tags">
                        ${tags}
                    </div>
                </div>

                <div class="card-link">
                    <a href="/projects/${project.id}">Découvrir ${project.title} →</a>
                    ${links}
                </div>
            </article>
        `;
    }

    setupReflection() {
        this.pointerMedia = window.matchMedia(
            '(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)'
        );

        this.pointerEvents = new AbortController();

        const card = this.shadowRoot.querySelector('.card');

        const reset = () => {
            cancelAnimationFrame(this.pointerFrame);
            this.pointerFrame = null;
            card.classList.remove('has-reflection');
        };

        this.resetReflection = reset;

        const options = {
            signal: this.pointerEvents.signal,
            passive: true
        };

        card.addEventListener('pointermove', event => {
            if (!this.pointerMedia.matches || event.pointerType === 'touch') {
                return;
            }

            this.pointerPosition = {
                x: event.clientX,
                y: event.clientY
            };

            if (this.pointerFrame != null) return;

            this.pointerFrame = requestAnimationFrame(() => {
                this.pointerFrame = null;

                const rect = card.getBoundingClientRect();

                card.style.setProperty(
                    '--reflection-x',
                    `${this.pointerPosition.x - rect.left}px`
                );

                card.style.setProperty(
                    '--reflection-y',
                    `${this.pointerPosition.y - rect.top}px`
                );

                card.classList.add('has-reflection');
            });
        }, options);

        card.addEventListener('pointerleave', reset, options);
        card.addEventListener('pointercancel', reset, options);

        this.pointerMedia.addEventListener('change', reset, options);
    }

    disconnectedCallback() {
        this.pointerEvents?.abort();
        this.resetReflection?.();
    }
}

customElements.define('project-card', ProjectCard);
