import homeStyles from '../styles/home.css?inline';

class HomeSection extends HTMLElement {
    constructor() {

        super();
        this.attachShadow({ mode: 'open' });
        
        this.shadowRoot.innerHTML = `
            <style>${homeStyles}</style>
            <site-header></site-header>
            <section id="home">
                <div class="home-presentation">
                    <p class="home-presentation__subtitle">Niveau 4 - Développeur Full-Stack</p>
                    <h1 class="home-presentation__title">Chaque projet est une nouvelle aventure.</h1>
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
