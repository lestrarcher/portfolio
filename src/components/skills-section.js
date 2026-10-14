import sectionStyles from '../styles/skills.css?inline';
import grimoireStyles from '../styles/grimoire.css?inline';
import { initGrimoireReveal } from '../utils/grimoire-reveal.js';

// Vite transforme chaque SVG en URL locale, utilisable dans le Shadow DOM.
const iconFiles = import.meta.glob('../assets/tech-icons/*.svg', { eager: true, query: '?url', import: 'default' });
const icon = slug => iconFiles[`../assets/tech-icons/${slug}.svg`] ?? '';
const groups = [
  { title: 'Frontend', items: [
    ['JavaScript','javascript'], ['TypeScript','typescript'], ['HTML5','html5'],
    ['CSS3','css3'], ['React','react'], ['Angular','angular'],
    ['Web Components','web-components'], ['Responsive Design','responsive-design']
  ] },
  { title: 'Backend', items: [
    ['Symfony','symfony'], ['PHP','php'], ['API REST','api-rest'],
    ['MySQL','mysql'], ['PostgreSQL','postgresql']
  ] },
  { title: 'Outils & autres', items: [['Git & GitHub','git-github'], ['Docker','docker']] }
];

class SkillsSection extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.innerHTML = `
      <style>${sectionStyles}</style><style>${grimoireStyles}</style>
      <section id="skills" aria-label="Compétences et technologies">
        <div class="skills-panel skills-intro" data-reveal>
          <h2 class="skills-panel__title">Compétences et technologies</h2>
          <span class="skills-panel__rule" aria-hidden="true"></span>
          <p>Les outils que je maîtrise et que j'utilise pour donner vie à mes projets.</p>
          <a class="blood-btn" href="#projects">Découvrir mes projets <span aria-hidden="true">→</span></a>
        </div>
        ${groups.map((group, i) => `
          <div class="skills-panel" data-reveal data-reveal-delay="${i + 1}">
            <h2 class="skills-panel__title">${group.title}</h2>
            <span class="skills-panel__rule" aria-hidden="true"></span>
            <div class="skills-panel__list">
              ${group.items.map(([name, slug]) => `<tech-card name="${name}" logo="${icon(slug)}"></tech-card>`).join('')}
            </div>
            <span class="skills-panel__footer" aria-hidden="true">✦</span>
          </div>
        `).join('')}
      </section>`;
  }
  connectedCallback() { this.cleanupReveal = initGrimoireReveal(this.shadowRoot); }
  disconnectedCallback() { this.cleanupReveal?.(); }
}
customElements.define('skills-section', SkillsSection);
