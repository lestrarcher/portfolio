export function initGrimoireReveal(root = document) {
    const elements = [...root.querySelectorAll('[data-reveal]')];
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let observer;
    const reveal = element => {
        element.classList.add('is-revealed');
        element.classList.remove('reveal-pending');
        observer?.unobserve(element);
    };
    const revealAll = () => elements.forEach(reveal);
    const onMotionChange = () => { if (motion.matches) revealAll(); };
    const onFocus = event => elements.filter(element => element.contains(event.target)).forEach(reveal);
    if (motion.matches || !('IntersectionObserver' in window)) {
        revealAll();
        return () => {};
    }

    try {
        observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) reveal(entry.target);
            });
        }, {
            threshold: 0,
            rootMargin: '0px'
        });

        // Arm the hidden state only after observation succeeds.
        elements.filter(element => !element.classList.contains('is-revealed')).forEach(element => {
            observer.observe(element);
            element.classList.add('reveal-pending');
        });
    } catch {
        observer?.disconnect();
        revealAll();
    }
    motion.addEventListener('change', onMotionChange);
    root.addEventListener('focusin', onFocus);

    return () => {
        observer?.disconnect();
        revealAll();
        motion.removeEventListener('change', onMotionChange);
        root.removeEventListener('focusin', onFocus);
    };
}
