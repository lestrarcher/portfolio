import cardStyles from '../../styles/cards/tech-card.css?inline';
class TechCard extends HTMLElement {
  static get observedAttributes() { return ['name','logo']; }
  constructor() { super(); this.attachShadow({ mode: 'open' }); }
  connectedCallback() { this.render(); }
  attributeChangedCallback() { if (this.isConnected) this.render(); }
  render() {
    const name = this.getAttribute('name') || '';
    const logo = this.getAttribute('logo') || '';
    this.shadowRoot.innerHTML = `<style>${cardStyles}</style><div class="tech-card">${logo ? `<img src="${logo}" alt="" loading="lazy">` : '<span class="tech-card__fallback" aria-hidden="true">✦</span>'}<span class="tech-card__name"></span></div>`;
    this.shadowRoot.querySelector('.tech-card__name').textContent = name;
  }
}
customElements.define('tech-card', TechCard);
