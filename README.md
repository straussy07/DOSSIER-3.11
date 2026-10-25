# DOSSIER 03.11 — Production GitHub + Cloudflare Workers

Version PUBLIQUE : **aucun voyage dans le temps** ni bouton de test. Les scènes s'enchaînent uniquement à partir de l'heure vérifiée par le serveur Cloudflare.

## Calendrier exact (Europe/Paris)

| Date | Scène |
| --- | --- |
| 25 octobre 2026, 00h00 (UTC+2) | Porte apparue, fermée |
| 26 octobre 2026, 00h00 (UTC+1) | Ouverture et entrée dans la pièce |
| 27 octobre 2026, 00h00 | Indice 1, avec zoom de caméra sur l'indice cliqué |
| 28 octobre 2026, 00h00 | Indice 2 |
| 29 octobre 2026, 00h00 | Indice 3 |
| 30 octobre 2026, 00h00 | Indice 4 |
| 31 octobre 2026, 00h00 | Indice 5 |
| 1 novembre 2026, 00h00 | Dernier chapitre : pièce vide et téléphone. Coffre scellé |
| 2 novembre 2026, 00h00 | **Même scène** : coffre déverrouillable, enveloppe et lettre |
| 3 novembre 2026, 00h00 | **Même scène en boucle**, sans révélation supplémentaire |
| 3 novembre 2026, 18h00 | Fin du deuxième compte à rebours, la scène tourne toujours, sans nouvel écran |

Le premier compteur du 03/11 à 00h00 et le second de la lettre du 03/11 à 18h00 restent distincts. Le changement d'heure en France entre les 24 et 25 octobre est pris en compte, sans passage à 01h00.

## Mettre en ligne

1. Décompresse le ZIP et remplace les fichiers de ton dépôt GitHub à la racine par les fichiers contenus ici (ne dépose pas le ZIP lui-même).
2. Les fichiers essentiels sont `index.html`, `worker.mjs`, `room-data.mjs`, `clues-data.mjs`, `wrangler.jsonc`, `package.json`, `build.mjs` et `verification.test.mjs`.
3. Garde ta configuration Cloudflare Workers (pas GitHub Pages), reliée à la branche `main`.
4. Build : `npm run build` ; déploiement : `npx wrangler deploy`.
5. Mets en ligne via **Commit changes** et recharge l'adresse `workers.dev` après la fin du déploiement.

Toute la scène finale est **intégrée à `index.html`** (pas besoin de `finale.html` et ne le publie pas séparément). Les vraies fiches des indices et les images/sons protégés sont lus depuis `worker.mjs` et les deux modules de données, qui doivent donc rester présents. Le panneau de déblocage des dates est absent. Pour éviter de dévoiler les images des indices dans GitHub, garde de préférence le dépôt privé ; le Worker reste public.

**Attention :** les éléments graphiques finaux intégrés au HTML peuvent être examinés depuis le code source, même si le serveur limite l'affichage du chapitre jusqu'au 1er novembre. Ne publie pas d'URL secrète du projet final dans le HTML.

## Vérifications

- `npm test` : contrôle les horaires de Paris, la protection serveur, les deux échéances, les indices et l'absence des commandes de test.
- `npm run build` : génère `dist/index.html` pour Cloudflare.
- Ouvre ensuite ton URL `workers.dev` pour vérifier l'ensemble du parcours sur téléphone et sur ordinateur.

La boucle du 3 novembre rejoue les scènes existantes : pièce, téléphone, coffre, enveloppe et lettre. Elle ne crée pas de nouveau chapitre et ne remplace pas le compteur de 18h par une URL de révélation.
