import cardStyles from '../../styles/cards/feat-card.css?inline';
import { iconSvg } from './card-icons.js';

class FeatCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    const category = this.getAttribute('category') || '';
    const value = this.getAttribute('value') || '';
    const icon = this.getAttribute('icon') || 'sparkles';
    this.shadowRoot.innerHTML = `
      <style>${cardStyles}</style>
      <div class="card"><span class="card-icon">${iconSvg(icon)}</span>
        <div class="card-body"><p class="card-body__category">${category}</p><p class="card-body__value">${value}</p></div>
      </div>`;
  }
}
customElements.define('feat-card', FeatCard);
