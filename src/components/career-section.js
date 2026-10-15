import headingStyles from '../styles/section-heading.css?inline';
import styles from '../styles/career-section.css?inline';
import grimoireStyles from '../styles/grimoire.css?inline';
import { initGrimoireReveal } from '../utils/grimoire-reveal.js';

const chapters = [
  {
    kind: 'project',
    date: 'PROJET PERSONNEL',
    type: 'APPLICATION EN DÉVELOPPEMENT',
    title: 'JdR Compagnon',
    place: 'Angular · TypeScript · Symfony',
    details: [
      'Application dédiée à la préparation et à l’animation de sessions de jeu de rôle.',
      'Personnalisation des personnages et suivi de leurs caractéristiques, compétences et ressources.',
      'Diffusion en temps réel de médias, d’informations et d’éléments de jeu : initiatives, PNJ et autres supports de session.',
      'Espace de préparation permettant au maître du jeu d’organiser ses contenus et de piloter leur présentation aux joueurs.'
    ]
  },
  {
    kind: 'project',
    date: 'PROJET PERSONNEL',
    type: 'APPLICATION WEB',
    title: 'CampaignPlanner',
    place: 'Symfony · PHP',
    details: [
      'Application de planification collaborative de campagnes de jeu de rôle, centrée sur un calendrier partagé.',
      'Organisation des disponibilités et des prochaines sessions pour faciliter la coordination entre les participants.',
      'Conception et développement des fonctionnalités de planification et de gestion des campagnes avec Symfony.'
    ]
  },
  {
    kind: 'project',
    date: 'JUILLET — DÉCEMBRE 2021',
    type: 'PROJET PERSONNEL · À REPRENDRE',
    title: 'MJ de Thiercelieux',
    place: 'JavaScript Full-Stack · Node.js',
    details: [
      'Premier projet personnel Full-Stack JavaScript, réalisé à la suite de ma formation.',
      'Conception d’une application autour de la gestion des rôles secrets et des parties du jeu Les Loups-Garous de Thiercelieux.',
      'Découverte et mise en pratique de Node.js côté serveur, en complément du développement frontend.',
      'Projet non terminé, nécessitant une refonte complète avant une éventuelle reprise.'
    ]
  },
  {
    kind: 'education',
    date: 'JANVIER — JUILLET 2021',
    type: 'FORMATION',
    title: 'Développeur Web et Web Mobile',
    place: 'O’Clock · Titre professionnel obtenu en 2022',
    details: [
      'Formation intensive de 735 heures couvrant le développement frontend et backend : HTML, CSS, JavaScript, PHP, SQL, programmation orientée objet, architecture MVC, API, Git et méthodes Agiles.',
      'Spécialisation React : composants, hooks, React Router, Redux, Sass et outils de développement frontend.',
      'Délégué de promotion : représentation des étudiants et échanges avec l’équipe pédagogique.',
      'Animation de séances de correction collectives des évaluations hebdomadaires, favorisant l’entraide, le partage de connaissances et l’apprentissage entre étudiants.',
      'Projet de fin d’études Prom’O’Gaming : conception, développement et présentation en équipe, sur un mois, d’une application de recherche de promotions de jeux vidéo.',
      'Lead Dev Front et référent technique React : coordination des développeurs frontend, définition des objectifs quotidiens et suivi des User Stories.',
      'Stack du projet : React, Redux et Sass côté client, API Symfony côté serveur. Organisation en sprints et présentation finale du projet.',
      'Certification Opquast : 845/1000, niveau avancé.'
    ]
  },
  {
    kind: 'work',
    date: '2015 — 2020',
    type: 'EXPÉRIENCES ANTÉRIEURES',
    title: 'Management, restauration et relation client',
    place: 'Entrepôt du Bricolage · Hippopotamus · Burger King · Quick · KFC',
    details: [
      'L’Entrepôt du Bricolage (2019–2020) — Hôte de service : accueil et conseil client, établissement de bons de commande, encaissements et clôtures financières quotidiennes, formation des collaborateurs et création d’outils de suivi et d’aide à la vente sous tableur.',
      'Hippopotamus (2019) — Manager en formation : service en salle et au bar, supervision des équipes et contrôle du respect des procédures d’hygiène et des dates limites de consommation.',
      'Burger King / Quick (2016–2018) — Équipier expert chez Quick, puis Leader lors de la transformation du restaurant en Burger King. Évolution vers un poste de Manager dans un second établissement du même groupe. Gestion des services, plannings, livraisons, inventaires et formation des équipes.',
      'KFC (2015–2016) — Responsable de service : coordination des équipes, gestion des services et suivi des livraisons.'
    ]
  },
  {
    kind: 'education',
    date: '2013',
    type: 'DIPLÔME',
    title: 'Licence LLCER Anglais',
    place: 'Université de Nîmes',
    details: [
      'Licence de Langues, Littératures et Civilisations Étrangères, spécialité anglais, obtenue en 2013.'
    ]
  }
];

const escapeHTML = value => String(value).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

class CareerSection extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.innerHTML = `
      <style>${styles}</style><style>${headingStyles}</style><style>${grimoireStyles}</style>
      <section class="career" aria-labelledby="career-title">
        <header class="career-heading section-heading" data-reveal>
          <p class="career-kicker section-heading__eyebrow">CHRONIQUES · PARCOURS</p>
          <h2 id="career-title" class="section-heading__title" data-reveal="chapter">Les chapitres précédents</h2>
          <p class="section-heading__description">De la gestion d'équipe au développement d'applications, un parcours où la technique rencontre l'humain.</p>
        </header>
        <div class="career-layout">
          <div class="career-feature-column" data-reveal>
            <p class="career-column-label career-column-label--featured"><span aria-hidden="true">✦</span> EXPÉRIENCE À LA UNE</p>
            <article class="career-feature" aria-labelledby="career-feature-title">
            <p class="career-feature__date">JUIN 2022 — JUILLET 2026 · 4 ANS ET 2 MOIS</p>
            <h3 id="career-feature-title">Développeur Full-Stack</h3>
            <p class="career-feature__place">Nîmes Université</p>
            <div class="career-feature__rule" aria-hidden="true"></div>
            <div class="career-feature__projects">
              <div class="career-feature__project">
                <h4>eMissions</h4>
                <p>
                  Conception et développement en autonomie d'une application
                  métier, de l'analyse des procédures papier à sa mise en
                  production. Recueil des besoins auprès des services,
                  modélisation des données, développement React / Symfony,
                  API REST, authentification CAS / JWT et gestion des habilitations.
                  Conception de circuits de validation complexes, maintenance
                  corrective et évolutive, accompagnement des utilisateurs
                  et rédaction des documentations.
                </p>
              </div>

              <div class="career-feature__project">
                <h4>Esup-Oasis</h4>
                <p>
                  Déploiement et adaptation d'une application open source
                  React / TypeScript et Symfony dédiée aux demandes
                  d'aménagement. Intégration au système d'information
                  de l'établissement, configuration de l'authentification
                  et adaptation aux besoins métier.
                </p>
              </div>

              <div class="career-feature__project">
                <h4>Autres contributions</h4>
                <p>
                  Pégase : préparation à la migration du système de scolarité,
                  audit et correction des données. Publik : référent fonctionnel
                  pour la dématérialisation de procédures et la création de
                  workflows. Encadrement de stagiaires : suivi d'avancement,
                  accompagnement technique et résolution des blocages.
                </p>
              </div>
            </div>
            <div class="career-feature__rule" aria-hidden="true"></div>
            <ul class="career-feature__tags" aria-label="Technologies utilisées">
              <li>Symfony</li><li>PHP</li><li>React</li><li>TypeScript</li><li>API REST</li><li>SQL</li>
            </ul>
            <a class="career-feature__link" href="/projects/emissions">Découvrir eMissions <span aria-hidden="true">↗</span></a>
            </article>
          </div>
          <div class="career-history" data-reveal data-reveal-delay="1">
            <p class="career-column-label">FRISE CHRONOLOGIQUE</p>
            <ol class="career-timeline">
              ${chapters.map((item, index) => `
                <li class="career-step" data-kind="${item.kind}">
                  <span class="career-node" aria-hidden="true"></span>
                  <details class="career-card">
                    <summary>
                      <span class="career-meta">${escapeHTML(item.date)} <span aria-hidden="true">✦</span> ${escapeHTML(item.type)}</span>
                      <span class="career-card-title">${escapeHTML(item.title)}</span>
                      <span class="career-place">${escapeHTML(item.place)}</span>
                      <span class="career-chevron" aria-hidden="true"></span>
                    </summary>
                    <div class="career-content"><ul>${item.details.map(detail => `<li>${escapeHTML(detail)}</li>`).join('')}</ul></div>
                  </details>
                </li>`).join('')}
            </ol>
          </div>
        </div>
      </section>`;
  }
  connectedCallback() { this.cleanupReveal = initGrimoireReveal(this.shadowRoot); }
  disconnectedCallback() { this.cleanupReveal?.(); }
}
if (!customElements.get('career-section')) customElements.define('career-section', CareerSection);
