# Routes du portfolio

La source commune des cartes et fiches est `src/data/projects.js`.
Les champs `technicalChoices`, `challenges` et `results` restent vides tant que
les informations ne sont pas documentées ; les fiches affichent « À compléter. ».
Les galeries associent les captures fournies à des illustrations explicitement
conceptuelles. eMissions n'utilise aucune capture de l'application.

Les URLs `/projects/jdr-companion`, `/projects/campaign-planner` et
`/projects/emissions` sont gérées par `src/router.js`. Les liens vers l'accueil
utilisent `/#section`. Les liens externes, médias, téléchargements et clics
avec Ctrl/Cmd conservent leur comportement natif.

## Hébergement

Vite et `vite preview` assurent le repli SPA pour les rechargements directs.
En production, servir les fichiers existants depuis `dist`, puis renvoyer
`dist/index.html` pour les autres chemins. Par exemple avec nginx :

```nginx
location / {
    try_files $uri $uri/ /index.html;
}
```

Adapter cette règle à l'hébergeur choisi avant publication. La page introuvable
est rendue côté client ; le statut HTTP du document de repli reste celui du
serveur (généralement 200). Aucun déploiement n'est effectué par cette configuration.

Le build conserve aussi l'URL CSS existante du d20 autonome, sans modifier son code.

## Vérification locale

Avec le serveur Vite lancé, ouvrir `/tests/routing.browser.html`. Le compte rendu
JSON sous l'iframe couvre les trois fiches, les retours/avances, les ancres,
les routes inexistantes et le menu mobile (ouverture, Échap, clic extérieur,
focus). Relancer avec le mouvement réduit activé dans le navigateur.
Ce fichier de test n'est pas inclus dans le build de production.
