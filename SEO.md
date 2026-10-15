# Métadonnées statiques et navigation

L’URL publique de référence est `https://mickael-kern.vercel.app/`.

## Source unique

- `src/data/projects.js` fournit les slugs, noms et descriptions des projets.
- `src/data/page-metadata.js` définit les métadonnées de l’accueil et la règle
  commune de composition des métadonnées des projets et des pages inconnues.
- `src/utils/page-metadata.js` applique ces valeurs lors des navigations internes.
  Le titre et la description de l’accueil ne sont jamais mémorisés à partir du
  document initial : un accès direct à une fiche ne peut donc pas les remplacer.

## Build et hébergement

`npm run build` utilise le plugin local `scripts/seo-pages.js`, sans dépendance
supplémentaire. Les marqueurs SEO de `index.html` sont remplis par Vite en
 développement et au build. Après compilation, le plugin génère :

- `dist/index.html` pour l’accueil ;
- `dist/projects/<slug>.html` pour chaque projet déclaré ;
- `dist/404.html`, avec titre spécifique et `noindex`, sans canonique erronée.

Les documents partagent les mêmes références absolues aux scripts et CSS
compilés. Seules les métadonnées changent ; aucun composant n’est dupliqué.
Titres, descriptions et attributs sont échappés lors de l’écriture du HTML.
Les attributs `alt` existants restent inchangés.

`vercel.json` active `cleanUrls`, ce qui sert `/projects/<slug>` à partir du
fichier `.html` correspondant. L’ancienne réécriture générale vers l’accueil
est supprimée. Les ressources statiques restent servies normalement. Une route
inconnue reçoit la page `404.html` avec un statut HTTP 404, selon le mécanisme
statique de Vercel. Les visites directes avec extension `.html` sont redirigées
par Vercel vers l’URL sans extension.

## Validation locale

```sh
npm run build
node tests/seo-build.mjs
npm run preview -- --host 0.0.0.0
```

Le test vérifie les métadonnées initiales, l’absence de doublons, les chemins
partagés des ressources, les URLs canoniques et les réponses HTTP 200/404.
Le middleware de preview remplace le fallback SPA de Vite pour tester les
routes publiques sans extension et les réponses 404 sur le build local.
Les navigations internes continuent d’utiliser le routeur existant, y compris
les boutons précédent/suivant et le retour à l’accueil.

## Portée et limites

Les robots sans JavaScript reçoivent désormais les métadonnées spécifiques aux
fiches. Le contenu visuel des Web Components reste rendu côté navigateur :
ceci n’est pas un pré-rendu des Shadow DOM ni du SSR. Une navigation SPA vers
une page inconnue affiche la 404 et `noindex`, mais ne produit pas une nouvelle
réponse HTTP ; le statut HTTP 404 s’applique aux requêtes directes.
La publication et la vérification sur Vercel restent à effectuer. Aucun
`og:image` n’est ajouté sans visuel de partage dédié.

Références : [cleanUrls Vercel](https://vercel.com/docs/project-configuration/vercel-json#cleanurls),
[404 statique Vercel](https://vercel.com/kb/guide/custom-404-page),
[API des plugins Vite](https://vite.dev/guide/api-plugin.html).
