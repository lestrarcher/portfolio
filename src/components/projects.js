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
            <style>${sectionStyles}</style><style>${grimoireStyles}</style>

            <section id="projects">
                <div class="projects-header" data-reveal="chapter">
                    <div class="projects-header__category">
                        <img src="https://campaign-planner.alwaysdata.net/images/logo.png"  class="projects-header__category-img" />
                        <div class="projects-header__category-id">
                            <h1 class="projects-header__category-id__name">Journal de quêtes</h1>
                            <h2 class="projects-header__category-id__subname">Mes projets</h2>
                        </div>
                    </div>
                </div>
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
