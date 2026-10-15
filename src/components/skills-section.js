import headingStyles from '../styles/section-heading.css?inline';
import sectionStyles from '../styles/skills.css?inline';
import grimoireStyles from '../styles/grimoire.css?inline';
import { initGrimoireReveal } from '../utils/grimoire-reveal.js';

// Vite transforme chaque SVG en URL locale, utilisable dans le Shadow DOM.
const iconFiles = import.meta.glob('../assets/tech-icons/*.svg', { eager: true, query: '?url', import: 'default' });
const icon = slug => iconFiles[`../assets/tech-icons/${slug}.svg`] ?? '';
const groups = [
  {
    title: 'Frontend',
    items: [
      ['JavaScript', 'javascript'],
      ['TypeScript', 'typescript'],
      ['HTML5', 'html5'],
      ['CSS3', 'css3'],
      ['React', 'react'],
      ['Angular', 'angular'],
      ['Sass', 'sass'],
      ['Bootstrap', 'bootstrap'],
      ['Web Components', 'web-components'],
      ['Responsive Design', 'responsive-design']
    ]
  },
  {
    title: 'Backend & données',
    items: [
      ['PHP', 'php'],
      ['Symfony', 'symfony'],
      ['Doctrine ORM', 'doctrine'],
      ['API REST', 'api-rest'],
      ['Node.js (notions)', 'nodejs'],
      ['MySQL', 'mysql'],
      ['PostgreSQL', 'postgresql'],
      ['Oracle', 'oracle']
    ]
  },
  {
    title: 'Outils & environnement',
    items: [
      ['Git & GitHub', 'git-github'],
      ['Docker', 'docker'],
      ['VS Code', 'vscode'],
      ['Linux', 'linux'],
      ['Vite / Webpack', 'vite-webpack'],
      ['Apache / Nginx (notions)', 'apache-nginx']
    ]
  }
];

class SkillsSection extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.innerHTML = `
      <style>${sectionStyles}</style><style>${headingStyles}</style><style>${grimoireStyles}</style>
      <section id="skills" aria-label="Compétences et technologies">
        <div class="skills-panel skills-intro" data-reveal>
          <header class="section-heading"><p class="section-heading__eyebrow">Savoir-faire</p><h2 class="section-heading__title">Compétences et technologies</h2>
          <span class="skills-panel__rule" aria-hidden="true"></span>
          <p class="section-heading__description">Les outils que je maîtrise et que j'utilise pour donner vie à mes projets.</p></header>
          <a class="blood-btn" href="#projects">Découvrir mes projets <span aria-hidden="true">→</span></a>
        </div>
        ${groups.map((group, i) => `
          <div class="skills-panel" data-reveal data-reveal-delay="${i + 1}">
            <h3 class="skills-panel__title">${group.title}</h3>
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
