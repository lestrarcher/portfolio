# Portfolio --- Installation et journal technique

**Dernière mise à jour : 14 octobre 2026**\
**Statut : environnement local opérationnel ; dépôt Git/GitHub à
initialiser.**

## 1. Objectif et périmètre

Portfolio public réalisé avec **JavaScript natif, Web Components, CSS et
Vite**, pour présenter des projets et des compétences techniques. Les
applications **JdR Companion** et **CampaignPlanner** restent privées :
seules des présentations, captures ou démonstrations choisies pourront
être publiées. **eMissions** ne sera présenté avec des médias qu'après
vérification des autorisations et de la confidentialité.

Développement **sans Node.js installé sur Windows** : Node.js et npm
tournent dans Docker. Pas de backend ni de base de données pour le
portfolio à ce stade.

## 2. Environnement local

-   Windows + **Git Bash (MINGW64)**, VS Code, navigateur et Docker
    Desktop.
-   Répertoire Windows : `D:\Dev\portfolio`.
-   Répertoire Git Bash : `/d/Dev/portfolio`.
-   Image Docker : `node:22-alpine`.
-   Outil de développement : **Vite 8.3.4** (version observée au premier
    lancement).
-   URL locale : **http://localhost:5173/**.

## 3. Création initiale du projet --- TERMINÉ

Commande **exécutée depuis `/d/Dev`**, à ne **pas relancer** pour
reprendre un projet existant :

``` bash
MSYS_NO_PATHCONV=1 docker run --rm \
  --mount "type=bind,source=$(pwd -W),target=/workspace" \
  --workdir=/workspace \
  node:22-alpine \
  sh -c "npm_config_yes=true npm create vite@latest portfolio -- --template vanilla --no-interactive"
```

Résultat vérifié : `portfolio/index.html`, `portfolio/package.json`,
`portfolio/public/`, `portfolio/src/`.

### Erreurs rencontrées

-   `docker run -it` dans Git Bash :
    `cannot attach stdin to a TTY-enabled container because stdin is not a terminal`.
-   `winpty docker run ... -w /workspace` : chemin converti à tort en
    `C:/Program Files/Git/workspace`, même avec les variables de
    conversion essayées.
-   **Solution validée :** Docker non interactif, `MSYS_NO_PATHCONV=1`,
    `--mount` avec `$(pwd -W)` et `--workdir=/workspace`.

## 4. Configuration Docker --- TERMINÉE

### `Dockerfile`

``` dockerfile
FROM node:22-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
```

### `compose.yaml`

``` yaml
services:
  portfolio:
    build: .
    ports:
      - "5173:5173"
    volumes:
      - .:/app
      - /app/node_modules
    environment:
      - CHOKIDAR_USEPOLLING=true
    restart: unless-stopped
```

Le montage `.:/app` expose le code local au conteneur. Le volume
`/app/node_modules` conserve les dépendances côté Docker.

### `.dockerignore`

``` text
node_modules
dist
.git
.gitignore
.env
.env.*
*.log
```

## 5. Premier démarrage et vérifications --- TERMINÉS

Depuis `/d/Dev/portfolio` :

``` bash
docker compose up --build -d
docker compose logs --tail=30 portfolio
```

Résultat observé : image `portfolio-portfolio` construite, réseau créé,
conteneur démarré et message :

``` text
VITE v8.3.4 ready
Local: http://localhost:5173/
```

La page Vite s'affiche dans le navigateur.

**Hot reload vérifié :** dans `index.html`, le titre `Vite + JS` a été
remplacé par `Portfolio | Développeur Full-Stack`. Le navigateur a
reflété le changement sans reconstruire l'image.

## 6. Commandes utiles pour reprendre

À exécuter dans `/d/Dev/portfolio` :

``` bash
# Démarrer / reprendre
docker compose up -d

# Voir les logs
docker compose logs -f portfolio

# Vérifier les conteneurs
docker compose ps

# Ouvrir un shell dans le conteneur
docker compose exec portfolio sh

# Installer une dépendance (si nécessaire)
docker compose exec portfolio npm install nom-du-package

# Reconstruire après changement de Dockerfile ou de dépendances
docker compose up --build -d

# Arrêter et retirer le conteneur (sans supprimer le code)
docker compose down
```

**Note :** le dossier `node_modules` est isolé dans un volume Docker. Si
les dépendances évoluent, vérifier qu'elles sont bien synchronisées avec
`package.json` et le verrou npm ; reconstruire/recréer les volumes si
nécessaire. Ne pas utiliser `docker compose down -v` sans comprendre
qu'il supprime aussi les volumes.

## 7. Architecture cible --- ENCORE À CRÉER

``` text
portfolio/
├── .dockerignore
├── .gitignore
├── Dockerfile
├── compose.yaml
├── INSTALLATION.md
├── README.md                 # Présentation publique (à rédiger)
├── index.html
├── package.json
├── public/                   # Images et vidéos publiables
└── src/
    ├── main.js
    ├── components/           # site-header, project-card, project-gallery...
    ├── pages/                # Accueil, fiches projets...
    ├── data/                 # Données descriptives
    ├── styles/               # Styles globaux et variables
    └── utils/                # Fonctions partagées si utiles
```

Concepts visés : **Custom Elements, Shadow DOM, slots, événements
personnalisés**, composants réutilisables. Les tests (Vitest) et le
déploiement statique viendront dans un second temps.

## 8. Git et GitHub --- PROCHAINE ÉTAPE

Ne pas publier de secrets, `.env`, données d'utilisateurs, code privé ou
médias professionnels non autorisés. Vérifier `.gitignore` avant le
premier commit.

``` bash
cd /d/Dev/portfolio
git status
```

Si Git répond que ce n'est pas un dépôt :

``` bash
git init
git branch -M main
```

Puis, après vérification des fichiers :

``` bash
git add .
git status
git commit -m "chore: initialize Vite portfolio with Docker"
```

Créer ensuite un dépôt GitHub **public** nommé `portfolio`, **sans
README, licence ni .gitignore générés sur GitHub** si ces fichiers
existent déjà localement. Ajouter le dépôt distant et pousser (remplacer
`<UTILISATEUR>` par son identifiant GitHub) :

``` bash
git remote add origin https://github.com/<UTILISATEUR>/portfolio.git
git push -u origin main
```

Si `origin` existe déjà, le vérifier avec `git remote -v` au lieu de le
recréer.

## 9. Checklist de progression

-   [x] Projet Vite Vanilla JS initialisé dans `D:\Dev\portfolio`.
-   [x] `INSTALLATION.md` ajouté.
-   [x] `Dockerfile` créé.
-   [x] `compose.yaml` créé.
-   [x] `.dockerignore` créé.
-   [x] Image construite, dépendances npm installées.
-   [x] Vite accessible sur `http://localhost:5173/`.
-   [x] Modification locale reflétée dans le navigateur.
-   [ ] Initialiser Git et effectuer le premier commit.
-   [ ] Créer le dépôt GitHub public et pousser `main`.
-   [ ] Nettoyer le squelette Vite.
-   [ ] Créer les premiers Web Components.
-   [ ] Ajouter les fiches projets, médias et tests.
-   [ ] Déployer le portfolio en statique.

**Principe :** avancer étape par étape, vérifier chaque commande et
actualiser ce journal après chaque jalon.
