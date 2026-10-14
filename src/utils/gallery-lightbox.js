// Native dialog supplies the modal top layer and makes the rest of the page inert.
export function createGalleryLightbox(root, onStep) {
    const dialog = document.createElement('dialog');
    dialog.className = 'gallery-lightbox';
    dialog.setAttribute('role', 'dialog');
    dialog.setAttribute('aria-modal', 'true');
    dialog.setAttribute('aria-label', 'Visionneuse du projet');
    dialog.innerHTML = `<div class="lightbox-panel">
        <div class="lightbox-toolbar">
            <div class="lightbox-navigation">
                <button type="button" data-step="-1" aria-label="Image précédente">←</button>
                <span class="lightbox-counter"></span>
                <button type="button" data-step="1" aria-label="Image suivante">→</button>
            </div>
            <div class="lightbox-zoom">
                <button type="button" data-zoom="-0.5" aria-label="Réduire le zoom">−</button>
                <button type="button" data-reset aria-label="Réinitialiser le zoom">100 %</button>
                <button type="button" data-zoom="0.5" aria-label="Agrandir l’image">+</button>
            </div>
            <button type="button" data-close aria-label="Fermer la visionneuse" autofocus>✕</button>
        </div>
        <div class="lightbox-viewport" tabindex="0" role="region" aria-label="Image agrandie, zone défilante">
            <div class="lightbox-canvas"><img draggable="false" alt=""></div>
        </div>
        <p class="lightbox-caption" aria-live="polite"></p>
    </div>`;
    root.append(dialog);
    const events = new AbortController();
    const options = { signal: events.signal };
    const viewport = dialog.querySelector('.lightbox-viewport');
    const canvas = dialog.querySelector('.lightbox-canvas');
    const image = dialog.querySelector('img');
    let item, zoom = 1, opener, lock, drag;

    function fit(recenter = false) {
        if (!dialog.open) return;
        const width = item.width || image.naturalWidth || 1;
        const height = item.height || image.naturalHeight || 1;
        const scale = Math.min(viewport.clientWidth / width, viewport.clientHeight / height);
        const oldWidth = canvas.offsetWidth || 1, oldHeight = canvas.offsetHeight || 1;
        const x = (viewport.scrollLeft + viewport.clientWidth / 2) / oldWidth;
        const y = (viewport.scrollTop + viewport.clientHeight / 2) / oldHeight;
        canvas.style.width = `${width * scale * zoom}px`;
        canvas.style.height = `${height * scale * zoom}px`;
        viewport.scrollLeft = recenter ? 0 : x * canvas.offsetWidth - viewport.clientWidth / 2;
        viewport.scrollTop = recenter ? 0 : y * canvas.offsetHeight - viewport.clientHeight / 2;
        dialog.querySelector('[data-reset]').textContent = `${Math.round(zoom * 100)} %`;
        dialog.querySelector('[data-zoom="-0.5"]').disabled = zoom === 1;
        dialog.querySelector('[data-zoom="0.5"]').disabled = zoom === 4;
        viewport.classList.toggle('is-zoomed', zoom > 1);
    }

    function unlock(restoreFocus = true) {
        if (!lock) return;
        document.documentElement.style.overflow = lock.htmlOverflow;
        document.body.style.overflow = lock.bodyOverflow;
        document.body.style.paddingRight = lock.padding;
        window.scrollTo({ left: lock.x, top: lock.y, behavior: 'instant' });
        lock = null;
        if (restoreFocus && opener?.isConnected) opener.focus({ preventScroll: true });
    }
    function close() { dialog.close(); unlock(); }
    function sync(nextItem, index, count) {
        item = nextItem;
        zoom = 1;
        image.src = item.src;
        image.alt = item.alt;
        dialog.querySelector('.lightbox-caption').textContent = item.caption;
        dialog.querySelector('.lightbox-counter').textContent = `${index + 1} / ${count}`;
        dialog.querySelector('.lightbox-navigation').hidden = count < 2;
        fit(true);
    }
    image.addEventListener('load', () => fit(true), options);
    const resize = new ResizeObserver(() => fit());
    resize.observe(viewport);
    dialog.addEventListener('cancel', event => { event.preventDefault(); close(); }, options);
    dialog.addEventListener('close', () => { if (!dialog.open) unlock(); }, options);
    let backdropDown = false;
    dialog.addEventListener('pointerdown', event => { backdropDown = event.target === dialog; }, options);
    dialog.addEventListener('click', event => {
        const button = event.target.closest('button');
        if ((event.target === dialog && backdropDown) || button?.hasAttribute('data-close')) close();
        else if (button?.hasAttribute('data-step')) onStep(Number(button.dataset.step));
        else if (button?.hasAttribute('data-reset')) { zoom = 1; fit(true); }
        else if (button?.hasAttribute('data-zoom')) {
            zoom = Math.max(1, Math.min(4, zoom + Number(button.dataset.zoom)));
            fit();
        }
    }, options);
    dialog.addEventListener('keydown', event => {
        if (event.key === 'Tab') {
            const focusable = [...dialog.querySelectorAll('button:not(:disabled), [tabindex="0"]')].filter(node => node.getClientRects().length);
            const index = focusable.indexOf(root.activeElement);
            if ((event.shiftKey && index <= 0) || (!event.shiftKey && index === focusable.length - 1)) {
                event.preventDefault();
                focusable[event.shiftKey ? focusable.length - 1 : 0].focus();
            }
        }
        if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
        if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
            event.preventDefault(); onStep(event.key === 'ArrowLeft' ? -1 : 1);
        }
    }, options);
    viewport.addEventListener('pointerdown', event => {
        if (zoom === 1 || event.pointerType !== 'mouse' || event.button !== 0) return;
        drag = { x: event.clientX, y: event.clientY, left: viewport.scrollLeft, top: viewport.scrollTop };
        viewport.setPointerCapture(event.pointerId);
        event.preventDefault();
    }, options);
    viewport.addEventListener('pointermove', event => {
        if (!drag) return;
        viewport.scrollLeft = drag.left + drag.x - event.clientX;
        viewport.scrollTop = drag.top + drag.y - event.clientY;
    }, options);
    viewport.addEventListener('lostpointercapture', () => { drag = null; }, options);
    viewport.addEventListener('pointerup', () => { drag = null; }, options);

    return {
        sync,
        open(nextItem, index, count, trigger) {
            if (dialog.open) return;
            opener = trigger;
            lock = { htmlOverflow: document.documentElement.style.overflow, bodyOverflow: document.body.style.overflow,
                padding: document.body.style.paddingRight, x: scrollX, y: scrollY };
            const gutter = innerWidth - document.documentElement.clientWidth;
            document.body.style.paddingRight = `${parseFloat(getComputedStyle(document.body).paddingRight) + gutter}px`;
            document.documentElement.style.overflow = 'hidden';
            document.body.style.overflow = 'hidden';
            dialog.showModal();
            sync(nextItem, index, count);
            dialog.querySelector('[data-close]').focus({ preventScroll: true });
        },
        destroy() {
            events.abort(); resize.disconnect();
            dialog.close(); unlock(false); dialog.remove();
        }
    };
}
