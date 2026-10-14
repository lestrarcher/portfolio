// D20 arcanique — Web Component autonome, sans dépendance.
const VERTICES = [
    [-1, 1.618034, 0], [1, 1.618034, 0], [-1, -1.618034, 0], [1, -1.618034, 0],
    [0, -1, 1.618034], [0, 1, 1.618034], [0, -1, -1.618034], [0, 1, -1.618034],
    [1.618034, 0, -1], [1.618034, 0, 1], [-1.618034, 0, -1], [-1.618034, 0, 1]
].map(normalize);
const FACES = [
    [0, 11, 5], [0, 5, 1], [0, 1, 7], [0, 7, 10], [0, 10, 11],
    [1, 5, 9], [5, 11, 4], [11, 10, 2], [10, 7, 6], [7, 1, 8],
    [3, 9, 4], [3, 4, 2], [3, 2, 6], [3, 6, 8], [3, 8, 9],
    [4, 9, 5], [2, 4, 11], [6, 2, 10], [8, 6, 7], [9, 8, 1]
];
const sub = (a, b) => a.map((v, i) => v - b[i]);
const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const dot = (a, b) => a.reduce((s, v, i) => s + v * b[i], 0);
function normalize(v) { const n = Math.hypot(...v); return v.map(x => x / n); }
const mul = (a, b) => [
    a[0] * b[0] - a[1] * b[1] - a[2] * b[2] - a[3] * b[3],
    a[0] * b[1] + a[1] * b[0] + a[2] * b[3] - a[3] * b[2],
    a[0] * b[2] - a[1] * b[3] + a[2] * b[0] + a[3] * b[1],
    a[0] * b[3] + a[1] * b[2] - a[2] * b[1] + a[3] * b[0]
];
function axisAngle(axis, angle) { const s = Math.sin(angle / 2); return [Math.cos(angle / 2), ...normalize(axis).map(v => v * s)]; }
function rotate(q, v) { const p = [0, ...v], r = mul(mul(q, p), [q[0], -q[1], -q[2], -q[3]]); return r.slice(1); }
function fromTo(a, b) { const d = dot(a, b); if (d < -.999999) return axisAngle(Math.abs(a[0]) < .9 ? cross(a, [1, 0, 0]) : cross(a, [0, 1, 0]), Math.PI); return normalize([1 + d, ...cross(a, b)]); }
function slerp(a, b, t) { let c = dot(a, b); if (c < 0) { b = b.map(x => -x); c = -c; } if (c > .9995) return normalize(a.map((x, i) => x + (b[i] - x) * t)); const angle = Math.acos(Math.min(1, c)); const s = Math.sin(angle); return a.map((x, i) => (x * Math.sin((1 - t) * angle) + b[i] * Math.sin(t * angle)) / s); }
const faceNormal = f => { const [a, b, c] = f.map(i => VERTICES[i]); let n = normalize(cross(sub(b, a), sub(c, a))); const center = normalize(a.map((v, i) => (v + b[i] + c[i]) / 3)); if (dot(n, center) < 0) n = n.map(x => -x); return n; };
const NORMALS = FACES.map(faceNormal);

class ArcaneDice extends HTMLElement {
    constructor() {
        super(); this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = `
      <link rel="stylesheet" href="/src/styles/arcane-dice.css">
      <div class="arcane-stage">
        <div class="arcane-halo" aria-hidden="true"></div>
        <canvas class="dice-canvas" width="520" height="520" aria-hidden="true"></canvas>
      </div>
      <button class="dice-button" type="button">Lancer le dé <span aria-hidden="true">✦</span></button>
      <p class="dice-result" role="status" aria-live="polite">Le destin attend votre lancer…</p>`;
        this.canvas = this.shadowRoot.querySelector('canvas'); this.ctx = this.canvas.getContext('2d');
        this.button = this.shadowRoot.querySelector('button'); this.result = this.shadowRoot.querySelector('.dice-result');
        this.stage = this.shadowRoot.querySelector('.arcane-stage');
        this.orientation = mul(axisAngle([0, 1, 0], .4), axisAngle([1, 0, 0], -.35));
        this.frame = null; this.lastTime = null; this.rolling = false; this.visibleNumber = 20;
        this.onClick = () => this.roll();
        this.motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    }
    connectedCallback() { this.button.addEventListener('click', this.onClick); this.lastTime = null; this.tick(performance.now()); }
    disconnectedCallback() { this.button.removeEventListener('click', this.onClick); cancelAnimationFrame(this.frame); this.frame = null; }
    tick(now) {
        if (!this.isConnected) return;
        const dt = Math.min(50, now - (this.lastTime ?? now)); this.lastTime = now;
        if (this.rolling) {
            const t = Math.min(1, (now - this.startTime) / this.duration);
            const ease = 1 - Math.pow(1 - t, 4);
            const base = slerp(this.startQ, this.targetQ, ease);
            // Rotations supplémentaires qui reviennent exactement à zéro à l'arrivée.
            const spin = mul(axisAngle([0, 1, 0], Math.PI * 2 * 5 * ease), axisAngle([1, 0, 0], Math.PI * 2 * 4 * ease));
            this.orientation = mul(spin, base);
            if (t >= 1) { this.orientation = this.targetQ; this.rolling = false; this.stage.classList.remove('rolling'); this.button.disabled = false; this.showResult(); }
        } else if (!this.motion.matches) {
            this.orientation = mul(axisAngle([0, 1, 0], dt * .00019), this.orientation);
        }
        this.draw(); this.frame = requestAnimationFrame(t => this.tick(t));
    }
    roll() {
        if (this.rolling) return;
        this.visibleNumber = Math.floor(Math.random() * 20) + 1;
        const normal = NORMALS[this.visibleNumber - 1];
        this.startQ = this.orientation.slice();
        this.targetQ = mul(axisAngle([0, 0, 1], .2), fromTo(normal, [0, 0, 1]));
        this.duration = this.motion.matches ? 0 : 2300;
        this.startTime = performance.now(); this.rolling = true; this.button.disabled = true;
        this.stage.classList.add('rolling'); this.result.textContent = 'Le destin est en marche…';
        if (this.motion.matches) { this.orientation = this.targetQ; this.rolling = false; this.button.disabled = false; this.stage.classList.remove('rolling'); this.showResult(); this.draw(); }
    }
    showResult() {
        const n = this.visibleNumber;
        this.result.textContent = n === 20 ? '✦ Réussite critique : recrutez-moi !' : n === 1 ? 'Échec critique. Heureusement, Git permet de revenir en arrière.' : `Résultat : ${n} / 20`;
        this.result.classList.toggle('critical', n === 20);
    }
    draw() {
        const ctx = this.ctx, W = this.canvas.width, H = this.canvas.height;
        ctx.clearRect(0, 0, W, H); const cx = W / 2, cy = H / 2, scale = 155, dist = 4.8;
        const points = VERTICES.map(v => rotate(this.orientation, v));
        const project = v => { const p = dist / (dist - v[2]); return [cx + v[0] * scale * p, cy - v[1] * scale * p]; };
        const faces = FACES.map((f, i) => {
            const verts = f.map(j => points[j]); const n = rotate(this.orientation, NORMALS[i]);
            return { verts, n, i, z: verts.reduce((s, v) => s + v[2], 0) / 3 };
        }).filter(f => f.n[2] > 0.001).sort((a, b) => a.z - b.z);
        // Un halo discret, concentré sous le dé.
        const halo = ctx.createRadialGradient(cx, cy, 25, cx, cy, 205);
        halo.addColorStop(0, 'rgba(128,47,62,.18)'); halo.addColorStop(1, 'rgba(128,47,62,0)');
        ctx.fillStyle = halo; ctx.fillRect(0, 0, W, H);
        for (const f of faces) {
            const p = f.verts.map(project); const light = Math.max(0, dot(f.n, normalize([-.4, .65, 1])));
            const shade = Math.round(22 + light * 30);
            ctx.beginPath(); ctx.moveTo(...p[0]); ctx.lineTo(...p[1]); ctx.lineTo(...p[2]); ctx.closePath();
            ctx.fillStyle = `rgb(${shade + 9},${shade - 2},${shade + 3})`; ctx.fill();
            ctx.strokeStyle = f.n[2] > .8 ? '#e0b98a' : '#a2786b'; ctx.lineWidth = f.n[2] > .8 ? 2.5 : 1.8; ctx.lineJoin = 'round'; ctx.stroke();
            if (f.n[2] > .48) {
                const center = project(f.verts.reduce((a, v) => a.map((x, j) => x + v[j] / 3), [0, 0, 0]));
                ctx.fillStyle = f.n[2] > .82 ? '#f5e7d5' : '#c4ada0';
                ctx.font = `600 ${f.n[2] > .82 ? 30 : 20}px Georgia,serif`;
                ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(String(f.i + 1), center[0], center[1]);
            }
        }
    }
}
customElements.define('arcane-dice', ArcaneDice);
