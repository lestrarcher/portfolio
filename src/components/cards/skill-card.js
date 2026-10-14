import cardStyles from '../../styles/cards/skill-card.css?inline';
import { iconSvg } from './card-icons.js';

class SkillCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    const code = this.getAttribute('caracteristic') || '';
    const name = this.getAttribute('skill') || '';
    const detail = this.getAttribute('description') || '';
    const icon = this.getAttribute('icon') || 'code';
    this.shadowRoot.innerHTML = `
      <style>${cardStyles}</style>
      <article class="card">
        <div class="card-top"><span class="card-icon">${iconSvg(icon)}</span><span class="card-code">${code}</span></div>
        <div class="card-body"><h3 class="card-body__skill">${name}</h3><p class="card-body__description">${detail}</p></div>
      </article>`;
  }
}
customElements.define('skill-card', SkillCard);
