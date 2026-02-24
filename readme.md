# readme design tokens import


# order :
# push from figma to github

# pull from github
git stash // Tes fichiers modifiés vont "disparaître" visuellement, c'est normal, ils sont sauvegardés dans la mémoire de Git
git pull origin main // tétcharge les fichers de github
git stash pop // reintègre les fichiers local

# if problem
git pull origin main --rebase

# action styleDictionary with config.mjs
node config.mjs

# push to github
git add .
git commit -m "mon travail local est prêt"

git push origin main


# Design System POC : Figma to Code Pipeline

Ce projet est une preuve de concept (POC) démontrant l'automatisation d'un Design System. Il permet de synchroniser les variables de design depuis Figma vers des composants Web (CSS et Vue.js) sans intervention manuelle sur les valeurs.
🚀 Workflow Global
1. Figma Design Tokens

# La source de vérité commence dans Figma.

    Création : Les styles (couleurs, arrondis, ombres) sont définis via l'extension Tokens Studio.

    Organisation : * Primitives : Valeurs brutes (ex: green-100: #5ee998).

        Tokens : Alias sémantiques (ex: btn-bg: {green-100}).

    Transformation : Tokens Studio fait le pont entre les variables natives Figma et le format JSON universel.

2. GitHub Link & Sync

    Connexion : Dans Tokens Studio, configurer le "Remote Storage" avec ton dépôt GitHub.

    Fichier : Le plugin génère un fichier tokens.json à la racine de ton projet.

    Single Source of Truth : Toute modification dans Figma est "Pushée" vers GitHub, déclenchant la mise à jour du code.

3. Installation & Setup Local

Une fois le projet cloné sur ta machine, prépare l'environnement :
Bash

# Installation des dépendances (Style Dictionary & Transforms)
npm install

4. Configuration & Transformation (Style Dictionary)

Le fichier config.mjs utilise Style Dictionary pour transformer le JSON brut en formats exploitables par les développeurs.
Double Configuration (Multi-Platform)

Le script génère deux sorties distinctes à partir du même tokens.json :

A. Configuration pour le CSS

Génère des Custom Properties (Variables CSS) prêtes à l'emploi.

    Format : Kebab-case (--btn-primary-bg).

    Unités : Ajout automatique des px pour les dimensions.

    Ombres : Fusion des propriétés (x, y, blur) en une seule ligne box-shadow.

B. Configuration pour Vue.js

Génère un fichier JavaScript (ESM) pour injecter les tokens directement dans la logique Vue.

    Format : CamelCase (btnPrimaryBg).

    Usage : Permet d'utiliser les tokens dans des graphiques, des animations ou des styles dynamiques via des props Vue.

JavaScript

// Exemple d'usage dans un composant Vue
import { BtnPrimaryBg } from '@/build/js/tokens.js';

🛠️ Utilisation au quotidien

    Modifiez dans Figma (ex: changez un arrondi de 10px à 50px).

    Push via Tokens Studio.

    Pull sur ton dossier local : git pull origin main.

    Build les tokens :
    Bash

    node config.mjs

    Résultat : Le fichier build/css/variables.css et build/js/tokens.js sont à jour. Ton catalogue index.html reflète les changements instantanément !