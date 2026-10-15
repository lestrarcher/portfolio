import headingStyles from '../styles/section-heading.css?inline';
import styles from '../styles/contact-section.css?inline';
import grimoireStyles from '../styles/grimoire.css?inline';
import { initGrimoireReveal } from '../utils/grimoire-reveal.js';

class ContactSection extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.innerHTML = `
      <style>${styles}</style><style>${headingStyles}</style><style>${grimoireStyles}</style>
      <section id="contact" aria-labelledby="contact-title">
        <div class="contact-frame">
          <div class="mist" aria-hidden="true"></div>
          <header class="section-heading"><p class="eyebrow section-heading__eyebrow" data-reveal="chapter">ÉPILOGUE <span aria-hidden="true">✦</span> CONTACT</p>
          <svg class="seal" viewBox="0 0 300 300" aria-hidden="true" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g stroke="currentColor"><circle cx="150" cy="150" r="132"/><circle cx="150" cy="150" r="124" stroke-width=".5"/><circle cx="150" cy="150" r="100"/><circle cx="150" cy="150" r="78" stroke-width=".5"/><path d="M150 35 250 208H50L150 35ZM150 265 50 92h200L150 265Z" stroke-width=".65"/><path d="m150 56 94 94-94 94-94-94 94-94Z" stroke-width=".65"/><circle cx="150" cy="150" r="23"/><path d="M150 5v28m0 234v28M5 150h28m234 0h28"/></g>
            <path d="m150 131 5 14 14 5-14 5-5 14-5-14-14-5 14-5 5-14Z" fill="currentColor"/>
          </svg>
          <h2 id="contact-title" class="section-heading__title" data-reveal>Le prochain chapitre<br><em>s'écrit ensemble.</em></h2>
          <p class="description section-heading__description" data-reveal data-reveal-delay="1">Une opportunité, un projet, une idée ? Échangeons sur ce que nous pourrions construire ensemble.</p></header>
<div class="actions contact-actions" data-reveal data-reveal-delay="2">
  <a
    class="blood-btn"
    href="mailto:mickael.kern@hotmail.fr?subject=Prise%20de%20contact%20-%20Portfolio"
  >
    M'envoyer un message <span aria-hidden="true">↗</span>
  </a>

  <a
    class="secondary-btn"
    href="/cv.pdf"
    download="CV-Mickael-Kern.pdf"
    type="application/pdf"
  >
    Télécharger mon CV <span aria-hidden="true">↓</span>
  </a>

  <a
    class="secondary-btn"
    href="https://www.linkedin.com/in/mickael-kern/"
    target="_blank"
    rel="noopener noreferrer"
  >
    Me retrouver sur LinkedIn <span aria-hidden="true">↗</span>
  </a>
</div>
          <nav class="links" aria-label="Coordonnées et réseaux">
            <a href="mailto:mickael.kern@hotmail.fr">E-mail</a><span aria-hidden="true">✦</span>
            <a href="https://github.com/lestrarcher" target="_blank" rel="noopener noreferrer">GitHub</a><span aria-hidden="true">✦</span>
            <a href="https://www.linkedin.com/in/mickael-kern/" target="_blank" rel="noopener noreferrer">LinkedIn</a>
          </nav>
        </div>
        <footer class="footer"><span>© ${new Date().getFullYear()} · Portfolio développeur Full-stack</span><span>Conçu avec du code et quelques dés ✦</span></footer>
      </section>`;
  }
  connectedCallback() { this.cleanupReveal = initGrimoireReveal(this.shadowRoot); }
  disconnectedCallback() { this.cleanupReveal?.(); }
}
if (!customElements.get('contact-section')) customElements.define('contact-section', ContactSection);
