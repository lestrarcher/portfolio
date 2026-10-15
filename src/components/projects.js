import headingStyles from '../styles/section-heading.css?inline';
import sectionStyles from '../styles/projects.css?inline';
import grimoireStyles from '../styles/grimoire.css?inline';
import { initGrimoireReveal } from '../utils/grimoire-reveal.js';
import { projects } from '../data/projects.js';

class Projects extends HTMLElement {

    connectedCallback() {
        this.cleanupReveal = initGrimoireReveal(this.shadowRoot);
    }

    disconnectedCallback() {
        this.cleanupReveal?.();
    }

    constructor() {

        super();
        this.attachShadow({ mode: 'open' });

        const projectCards = projects.map((project, index) => `
            <project-card
                project-id="${project.id}"
                data-reveal
                data-reveal-delay="${index + 1}">
            </project-card>
        `).join('');

        this.shadowRoot.innerHTML = `
            <style>${sectionStyles}</style><style>${headingStyles}</style><style>${grimoireStyles}</style>

            <section id="projects">
                <header class="projects-header section-heading" data-reveal="chapter">
                    <div class="projects-header__category">
                        <div class="projects-header__category-id">
                            <p class="projects-header__category-id__name section-heading__eyebrow">Journal de quêtes</p>
                            <h2 class="projects-header__category-id__subname section-heading__title">Mes projets</h2>
                            <p class="section-heading__description">Applications personnelles et professionnelles, du jeu de rôle aux outils métier.</p>
                        </div>
                    </div>
                </header>
                <div class="projects-list">
                    <div class="projects-list__display">
                        ${projectCards}
                    </div>
                </div>
            </section>
            `
    }
}

customElements.define('projects-list', Projects)
