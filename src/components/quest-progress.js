import questStyles from '../styles/quest-progress.css?inline';

class QuestProgress extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });

        this.chapters = [
            { id: 'home', label: 'Accueil' },
            { id: 'projects', label: 'Projets' },
            { id: 'skills', label: 'Compétences' },
            { id: 'about-me', label: 'À propos' },
            { id: 'contact', label: 'Contact' }
        ];

        this.sections = [];
        this.frame = null;

        this.updateProgress = this.updateProgress.bind(this);
        this.requestUpdate = this.requestUpdate.bind(this);

        this.shadowRoot.innerHTML = `
            <style>${questStyles}</style>

            <nav class="quest-progress" aria-label="Navigation par chapitre">
                <span class="quest-progress__heading">CHAPITRES</span>

                <div class="quest-progress__track">
                    <div class="quest-progress__fill"></div>

                    ${this.chapters.map(chapter => `
                        <a
                            class="quest-progress__chapter"
                            href="#${chapter.id}"
                            data-id="${chapter.id}"
                            aria-label="${chapter.label}"
                            title="${chapter.label}"
                        >
                            <span class="quest-progress__marker"></span>
                            <span class="quest-progress__label">
                                ${chapter.label}
                            </span>
                        </a>
                    `).join('')}
                </div>

                <span class="quest-progress__counter">00 / 00</span>
            </nav>
            <div class="chapter-notice" aria-hidden="true" hidden>
                <span class="chapter-notice__text"></span>
                <span class="chapter-notice__line"></span>
            </div>
        `;
    }

    connectedCallback() {
        this.activeId = null;
        this.transitionsReady = false;
        this.chapterAnimations = [];
        this.transitionEvents = new AbortController();
        this.motion = window.matchMedia('(prefers-reduced-motion: reduce)');
        const options = { signal: this.transitionEvents.signal, passive: true };
        const arm = () => { this.transitionsReady = true; };
        // User input can start transitions even while external images are loading.
        ['wheel', 'touchstart', 'pointerdown', 'keydown'].forEach(type => window.addEventListener(type, arm, options));
        this.settleInitialChapter = () => {
            clearTimeout(this.initialTimer);
            this.initialTimer = setTimeout(arm, 250);
        };
        window.addEventListener('load', this.settleInitialChapter, options);
        if (document.readyState === 'complete') this.settleInitialChapter();
        this.motion.addEventListener('change', () => this.clearChapterTransition(), options);
        this.sections = this.chapters
            .map(chapter => ({
                ...chapter,
                element: document.getElementById(chapter.id)
            }))
            .filter(chapter => chapter.element !== null)
            .sort((a, b) => a.element.compareDocumentPosition(b.element) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1);

        // Masquer les chapitres dont la section n'existe pas encore.
        this.shadowRoot.querySelectorAll('[data-id]').forEach(link => {
            link.hidden = !this.sections.some(section => section.id === link.dataset.id);
        });

        const track = this.shadowRoot.querySelector('.quest-progress__track');
        this.sections.forEach(section => track.append(this.shadowRoot.querySelector(`[data-id="${section.id}"]`)));
        this.shadowRoot.querySelector('nav').hidden = !this.sections.length;
        this.resizeObserver = new ResizeObserver(this.requestUpdate);
        this.resizeObserver.observe(document.body);
        this.sections.forEach(section => this.resizeObserver.observe(section.element));
        window.addEventListener('hashchange', this.requestUpdate);
        window.addEventListener('load', this.requestUpdate);

        window.addEventListener('scroll', this.requestUpdate, { passive: true });
        window.addEventListener('resize', this.requestUpdate);

        this.requestUpdate();
    }

    disconnectedCallback() {
        this.transitionEvents?.abort();
        clearTimeout(this.initialTimer);
        this.clearChapterTransition();
        window.removeEventListener('scroll', this.requestUpdate);
        window.removeEventListener('resize', this.requestUpdate);
        window.removeEventListener('hashchange', this.requestUpdate);
        window.removeEventListener('load', this.requestUpdate);
        this.resizeObserver?.disconnect();

        if (this.frame !== null) {
            cancelAnimationFrame(this.frame);
            this.frame = null;
        }
    }

    requestUpdate() {
        if (this.frame !== null) return;

        this.frame = requestAnimationFrame(() => {
            this.frame = null;
            this.updateProgress();
        });
    }

    clearChapterTransition() {
        clearTimeout(this.chapterTimer);
        clearTimeout(this.noticeTimer);
        this.chapterAnimations?.forEach(animation => animation.cancel());
        this.chapterAnimations = [];
        this.shadowRoot.querySelector('.chapter-notice').hidden = true;
    }

    transitionToChapter(index) {
        this.clearChapterTransition();
        // Coalesce intermediate chapters during fast scrolling or smooth anchor navigation.
        this.chapterTimer = setTimeout(() => {
            if (!this.isConnected) return;
            const section = this.sections[index];
            const notice = this.shadowRoot.querySelector('.chapter-notice');
            const roman = ['I', 'II', 'III', 'IV', 'V'][index] ?? String(index + 1);
            notice.querySelector('.chapter-notice__text').textContent = `CHAPITRE ${roman} — ${section.label.toLocaleUpperCase('fr')}`;
            notice.hidden = false;
            if (!this.motion.matches) {
                const marker = this.shadowRoot.querySelector(`[data-id="${section.id}"] .quest-progress__marker`);
                this.chapterAnimations = [
                    marker.animate([
                        { transform: 'scale(1.2)', boxShadow: '0 0 0 0 #c5a47566' },
                        { transform: 'scale(1.45)', boxShadow: '0 0 0 7px #c5a47500', offset: 0.6 },
                        { transform: 'scale(1.2)' }
                    ], { duration: 500, easing: 'ease-out' }),
                    notice.animate([
                        { opacity: 0, transform: 'translateY(4px)' },
                        { opacity: 1, transform: 'translateY(0)', offset: 0.15 },
                        { opacity: 1, transform: 'translateY(0)', offset: 0.8 },
                        { opacity: 0, transform: 'translateY(0)' }
                    ], { duration: 1800, fill: 'forwards' }),
                    notice.querySelector('.chapter-notice__line').animate([
                        { transform: 'scaleX(0)' }, { transform: 'scaleX(1)' }
                    ], { duration: 550, easing: 'ease-out', fill: 'forwards' })
                ];
            }
            this.noticeTimer = setTimeout(() => this.clearChapterTransition(), 1800);
        }, 160);
    }

    updateProgress() {
        if (!this.sections.length) {
            this.shadowRoot.querySelector('.quest-progress__counter').textContent = '00 / 00';
            return;
        }

        const scrollableHeight =
            document.documentElement.scrollHeight - window.innerHeight;

        const progress = scrollableHeight > 0
            ? Math.min(1, Math.max(0, window.scrollY / scrollableHeight))
            : 0;

        this.shadowRoot
            .querySelector('.quest-progress__fill')
            .style.height = `${progress * 100}%`;

        // Chapitre actif : dernière section dont le début
        // est passé au-dessus du premier tiers de l'écran.
        const threshold = window.innerHeight * 0.35;
        let activeIndex = 0;

        this.sections.forEach((section, index) => {
            if (section.element.getBoundingClientRect().top <= threshold) {
                activeIndex = index;
            }
        });

        // Au bas de la page, activer le dernier chapitre.
        if (scrollableHeight > 0 && window.scrollY >= scrollableHeight - 2) {
            activeIndex = this.sections.length - 1;
        }

        const activeId = this.sections[activeIndex].id;
        if (activeId !== this.activeId) {
            if (this.activeId !== null && this.transitionsReady) this.transitionToChapter(activeIndex);
            else if (document.readyState === 'complete' && !this.transitionsReady) this.settleInitialChapter();
            this.activeId = activeId;
        }

        this.shadowRoot.querySelectorAll('.quest-progress__chapter')
            .forEach(link => {
                const isActive = link.dataset.id === this.sections[activeIndex].id;

                link.classList.toggle('is-active', isActive);

                if (isActive) {
                    link.setAttribute('aria-current', 'location');
                } else {
                    link.removeAttribute('aria-current');
                }
            });

        this.shadowRoot.querySelector('.quest-progress__counter')
            .textContent =
                `${String(activeIndex + 1).padStart(2, '0')} / ${String(this.sections.length).padStart(2, '0')}`;
    }
}

customElements.define('quest-progress', QuestProgress);
