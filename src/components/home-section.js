import homeStyles from '../styles/home.css?inline';

class HomeSection extends HTMLElement {
    connectedCallback() {
        const selector = this.shadowRoot.querySelector('#atmosphere-choice');
        const modes = ['grimoire', 'brumes', 'gothique'];
        const stored = localStorage.getItem('portfolio-atmosphere');
        const initial = modes.includes(stored) ? stored : 'grimoire';
        this.dataset.atmosphere = initial;
        selector.value = initial;
        this.onAtmosphereChange = () => {
            this.dataset.atmosphere = selector.value;
            localStorage.setItem('portfolio-atmosphere', selector.value);
        };
        selector.addEventListener('change', this.onAtmosphereChange);
    }

    disconnectedCallback() {
        this.shadowRoot.querySelector('#atmosphere-choice')
            ?.removeEventListener('change', this.onAtmosphereChange);
    }

    constructor() {

        super();
        this.attachShadow({ mode: 'open' });
        
        this.shadowRoot.innerHTML = `
            <style>${homeStyles}</style>
            <site-header></site-header>
            <div class="atmosphere-lab">
                <label for="atmosphere-choice">Ambiance du décor</label>
                <select id="atmosphere-choice" aria-label="Choisir le fond de la Hero">
                    <option value="grimoire">I · Grimoire moderne</option>
                    <option value="brumes">II · Brumes vivantes</option>
                    <option value="gothique">III · Architecture gothique</option>
                </select>
            </div>
            <section id="home">
                <div class="home-presentation">
                    <h1 class="home-presentation__subtitle">Niveau 4 - Développeur Full-Stack</h1>
                    <h2 class="home-presentation__title">Chaque projet est une nouvelle aventure.</h2>
                    <p class="home-presentation__description">
Je conçois et développe des applications web utiles, intuitives et durables, en plaçant l'utilisateur au coeur de chaque décision.</p>
                    
                    <div class="btns">
                        <a class="blood-btn" href="/#about-me">
                            En savoir plus sur moi ->
                        </a>
                        <a class="btn" href="/#contact">
                            Me contacter
                        </a>
                    </div>
                </div>
                <arcane-dice></arcane-dice>
            </section>
            `
    }
}

customElements.define('home-section', HomeSection)
