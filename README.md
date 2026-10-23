# DOSSIER 03.11 — Import GitHub simple

Cette version contient le jeu complet dans **index.html**, avec ses images et sons intégrés. Code du coffre : 140. Troisième épreuve : toucher ACTIF.

## 1. GitHub

Pour éviter de mélanger les deux configurations, crée un nouveau dépôt nommé `dossier-03-11-v2`.
Décompresse le ZIP, puis importe TOUS les fichiers extraits via Upload files.
Ne dépose pas le ZIP et ne crée pas de sous-dossier supplémentaire.
Valide avec Commit changes.

À la page principale du dépôt, tu dois voir directement :
- index.html
- worker.mjs
- wrangler.jsonc
- package.json
- build.mjs
- verification.test.mjs
- README.md

Le fichier .gitignore est également fourni ; il peut être masqué par ton ordinateur.

## 2. Cloudflare Workers

Workers & Pages → Create application → GitHub → choisir `dossier-03-11-v2`.

| Paramètre | Valeur |
|---|---|
| Nom du Worker | dossier-03-11 |
| Branche | main |
| Root directory / Path | vide |
| Build command | npm run build |
| Deploy command | npx --yes wrangler@4 deploy |

Clique Save and Deploy. L'application sera publique.
Le build crée automatiquement dist/index.html ; ne crée pas ce dossier toi-même.
Si un Worker dossier-03-11 existe déjà, ouvre-le puis Settings → Builds pour connecter le nouveau dépôt et renseigner les mêmes commandes.

## En cas d'erreur

- package.json introuvable : les fichiers sont dans un sous-dossier. Remonte-les à la racine, ou renseigne ce sous-dossier dans Root directory.
- dist introuvable : vérifie que Build command est exactement npm run build.
- Nom de Worker différent : le nom dans Cloudflare doit correspondre au champ name de wrangler.jsonc.
- Le navigateur affiche du code : tu as ouvert le fichier sur GitHub. Utilise le lien workers.dev fourni par Cloudflare après déploiement.
- Autre erreur : copie les dernières lignes du journal du build pour identifier précisément le problème.

## Vérification locale

Avec Node.js 22 ou plus récent : npm run check, npm test, puis npm run build.
Tu peux aussi ouvrir index.html directement dans ton navigateur pour tester le jeu. Les API de révélation nécessitent Cloudflare Workers.

## Révélation

L'heure de lancement reste le 3 novembre 2026 à 00:00, heure de Paris.
Le serveur refuse la révélation avant cette date. Le lien final se configure avec la variable d'exécution PROJECT_URL (HTTPS). Sans lien, une conclusion générique s'affiche.
Aucune information confidentielle du projet n'est incluse. N'ajoute pas de secret dans le dépôt.

## GitHub Pages

Le fichier index.html à la racine permet une démonstration statique. GitHub Pages n'exécute pas worker.mjs : la révélation protégée nécessite l'hébergement Cloudflare Workers décrit ci-dessus.

Références :
https://developers.cloudflare.com/workers/ci-cd/builds/
https://developers.cloudflare.com/workers/ci-cd/builds/configuration/
