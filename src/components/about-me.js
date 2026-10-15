import headingStyles from '../styles/section-heading.css?inline';
import sectionStyles from '../styles/about-me.css?inline';
import grimoireStyles from '../styles/grimoire.css?inline';
import { initGrimoireReveal } from '../utils/grimoire-reveal.js';
class AboutMe extends HTMLElement {

    connectedCallback() {
        this.cleanupReveal = initGrimoireReveal(this.shadowRoot);
    }

    disconnectedCallback() {
        this.cleanupReveal?.();
    }

    constructor() {

        super();
        this.attachShadow({ mode: 'open' });

        this.shadowRoot.innerHTML = `
            <style>${sectionStyles}</style><style>${headingStyles}</style><style>${grimoireStyles}</style>
            <section id="about-me">
                <div class="about-me-presentation">
                    <header class="section-heading"><p class="about-me-presentation__subtitle section-heading__eyebrow">Fiche de personnage</p>
                    <h2 class="about-me-presentation__title section-heading__title" data-reveal="chapter">Développeur, créatif et toujours curieux.</h2>
                    <p class="about-me-presentation__description section-heading__description" data-reveal data-reveal-delay="1">
                        Passionné par le développement web et l'univers du JdR, j'aime transformer des idées en outils concrets. <br />
                        Mon approche : des solutions sur mesure, pensées pour leurs utilisateurs, avec une attention particulière à la qualité du code et à l'expérience utilisateur.
                    </p>
                    </header>
                    <a class="blood-btn" data-reveal data-reveal-delay="2" href="/#career">
                        Consulter mon parcours →
                    </a>
                </div>
                <div class="about-me-skills">
                    <div class="about-me-skills__heading">
                        <h3 class="about-me-skills__subtitle">Compétences principales</h3>
                        <span class="about-me-skills__count">06 COMPÉTENCES</span>
                    </div>
                    <div class="about-me-skills__separator"></div>
                    <div class="about-me-skills__list about-me-skills__list--attributes">
                        <skill-card data-reveal data-reveal-delay="1" caracteristic="FOR" skill="Développement" description="JavaScript · PHP" icon="code"></skill-card>
                        <skill-card data-reveal data-reveal-delay="2" caracteristic="DEX" skill="Interfaces" description="React · Angular" icon="layout"></skill-card>
                        <skill-card data-reveal data-reveal-delay="3" caracteristic="CON" skill="Fiabilité" description="Maintenance · Qualité" icon="shield"></skill-card>
                        <skill-card data-reveal data-reveal-delay="1" caracteristic="INT" skill="Architecture" description="TypeScript · Symfony" icon="network"></skill-card>
                        <skill-card data-reveal data-reveal-delay="2" caracteristic="SAG" skill="Expérience utilisateur" description="UX · Besoins métier" icon="eye"></skill-card>
                        <skill-card data-reveal data-reveal-delay="3" caracteristic="CHA" skill="Collaboration" description="Équipe · Communication" icon="users"></skill-card>
                    </div>
                    <div class="about-me-skills__separator"></div>
                    <div class="about-me-skills__list about-me-skills__list--traits">
                        <feat-card data-reveal data-reveal-delay="1" category="Classe" value="Développeur Full-Stack" icon="class"></feat-card>
                        <feat-card data-reveal data-reveal-delay="2" category="Race" value="Éternel apprenti" icon="sparkles"></feat-card>
                        <feat-card data-reveal data-reveal-delay="3" category="Alignement" value="Pragmatique" icon="scale"></feat-card>
                    </div>
                </div>
            </section>
            `
    }
}

customElements.define('about-me', AboutMe)
