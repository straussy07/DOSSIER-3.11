# DOSSIER 03.11 — correctif du calendrier / GitHub + Cloudflare Workers

## Dates confirmées — minuit, heure de Paris

| Étape | Date et heure (Europe/Paris) |
|---|---|
| Apparition de la porte fermée | 25 octobre 2026, 00 h |
| Ouverture de la porte / entrée dans la pièce | 26 octobre 2026, 00 h |
| Indice 1 | 27 octobre 2026, 00 h |
| Indice 2 | 28 octobre 2026, 00 h |
| Indice 3 | 29 octobre 2026, 00 h |
| Indice 4 | 30 octobre 2026, 00 h |
| Indice 5 | 31 octobre 2026, 00 h |
| Début prévu du dernier chapitre | 1er novembre 2026, 00 h |
| Accès serveur au coffre | 2 novembre 2026, 00 h |
| Premier compte à rebours | 3 novembre 2026, 00 h |
| Deuxième compte à rebours : révélation de la lettre | 3 novembre 2026, 18 h |

**Attention au changement d'heure :** la porte apparaît le 25 octobre à minuit **UTC+2**, tandis que l'ouverture du 26 est à minuit **UTC+1**. Il s'écoule donc 25 heures entre ces deux instants. Les cinq indices sont publiés à un intervalle de 24 heures. Le serveur et la page HTML sont synchronisés sur cette chronologie.

## Ce qui a été modifié

- **worker.mjs** : ouverture effective de la pièce le 26 octobre à 00h00 et maintien du premier indice le 27 octobre à 00h00 ; mêmes heures de Paris pour les étapes suivantes. Correction également de la route `/` qui doit servir le fichier `index.html` sur Cloudflare.
- **index.html** : les horaires étaient déjà bons ; un risque de redirection infinie sur `/suite` a été corrigé, sans toucher aux visuels, aux animations, aux sons ou aux deux échéances.
- **verification.test.mjs** : tests de synchronisation du HTML et du Worker, des seuils, des cinq indices, du changement d'heure, des compteurs et de la redirection.
- **README.md** : le calendrier et l'état réel des fichiers sont rectifiés.
- Les autres fichiers sont conservés, uniquement renommés (`package.json`, `build.mjs`, `wrangler.jsonc`, `CREDITS-SONS.md`) pour GitHub.

## Images, sons et indices : fichiers maintenant inclus

Les deux fichiers manquants ont été ajoutés à **cette archive** sous les noms exacts attendus par le Worker :

- `room-data.mjs` : les vraies images et le vrai son de la salle ;
- `clues-data.mjs` : les cinq images d'indices d'origine.

Tu n'as plus besoin de récupérer ces deux fichiers séparément dans ton ancien dépôt. Ils sont inclus avec le reste. **Attention :** conserve ton dépôt GitHub privé si les fiches d'indices doivent rester confidentielles avant leur déblocage. Les médias fournis par l'utilisateur ont été conservés sans modification.

## AUTRE POINT À VÉRIFIER AVANT LA MISE EN LIGNE

L'`index.html` transmis ne contient pas de logique de la scène finale avec **téléphone / coffre / enveloppe / lettre** (pas d'appel aux API `/api/letter-access`, `/api/letter-clock` ou `/api/letter-reveal`). Il déclenche en revanche une navigation vers `/suite` le 1er novembre. J'ai supprimé le risque de rechargement infini sur cette adresse, mais **cela ne remplace pas la scène finale manquante**. Si une version plus récente de ton index contient ces animations, il faut la conserver et reporter le calendrier et la correction de redirection dessus. Ne considère pas cette archive comme une reconstitution complète de ce dernier chapitre.

## Mise à jour sur GitHub

1. Décompresse l'archive sur ton ordinateur.
2. Dans le dépôt GitHub relié à Cloudflare, remplace à la racine les 10 fichiers de cette archive (`index.html`, `worker.mjs`, `room-data.mjs`, `clues-data.mjs`, `verification.test.mjs`, `README.md`, `package.json`, `build.mjs`, `wrangler.jsonc`, `CREDITS-SONS.md`).
3. **Dépose aussi** `room-data.mjs` et `clues-data.mjs` fournis dans cette archive, avec ces noms exacts ; ils sont nécessaires à ton site.
4. Confirme les modifications avec **Commit changes**, puis laisse Cloudflare déployer la nouvelle version.
5. Paramètres usuels dans Cloudflare Workers : build `npm run build` ; déploiement `npx wrangler deploy` ; répertoire racine `.` et branche `main`.

Le système de dates sécurisées requiert **Cloudflare Workers**, pas un simple hébergement GitHub Pages. Les fichiers multimédias sont inclus. Lance `npm test` pour vérifier les dates, les autorisations et les vrais médias, puis `npm run build` pour produire `dist/index.html`.

Les liens HTTPS de révélation sont configurés côté serveur avec `PROJECT_URL` (3 novembre à minuit) et `LETTER_PROJECT_URL` (3 novembre à 18h) dans les variables Cloudflare. Ne mets pas le lien secret dans le HTML avant la date de révélation.
