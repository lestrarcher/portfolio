import { defineConfig } from 'vite';
import { readFileSync } from 'node:fs';
import { seoPages } from './scripts/seo-pages.js';

export default defineConfig({
    plugins: [seoPages(), {
        // Preserve the autonomous d20's existing stylesheet URL in production.
        name: 'preserve-dice-stylesheet',
        generateBundle() {
            this.emitFile({
                type: 'asset',
                fileName: 'src/styles/arcane-dice.css',
                source: readFileSync(new URL('./src/styles/arcane-dice.css', import.meta.url), 'utf8')
            });
        }
    }]
});
