# DOSSIER 03.11 — site complet

Ce dossier est la version de production pour Cloudflare Workers. Aucun sélecteur de chapitre, aucune avance de date et aucun mode bêta ne sont inclus. Les visiteurs suivent exclusivement les dates réelles vérifiées par le serveur.

## Mettre à jour ton site existant

Dans le dépôt GitHub connecté à ton Worker, remplace les fichiers portant les mêmes noms par ceux de ce ZIP, puis valide avec **Commit changes**. Garde tous les fichiers à la racine. Ne remplace pas seulement `index.html` : `finale.html` et `worker.mjs` sont nécessaires pour la suite. Attends que le déploiement Cloudflare soit terminé, puis recharge le site. Les deux compteurs gardent leurs échéances ; aucune progression temporelle de test n’est embarquée.

## Déposer sur GitHub

1. Décompresser le ZIP sur l’ordinateur.
2. Créer un dépôt GitHub. Le conserver privé tant que les fiches d’indices doivent rester confidentielles : elles sont présentes dans le code serveur du dépôt. Le site Cloudflare pourra être public même si le dépôt est privé.
3. Dans le dépôt : **Add file → Upload files**.
4. Glisser le contenu du dossier : `index.html`, `finale.html`, `worker.mjs`, `room-data.mjs`, `clues-data.mjs`, `wrangler.jsonc`, `package.json`, `build.mjs`, `verification.test.mjs` et les documents. Les fichiers doivent se trouver directement à la racine du dépôt, sans dossier intermédiaire.
5. Cliquer sur **Commit changes**.

## Connecter Cloudflare

Utiliser **Workers**, pas GitHub Pages : les déblocages reposent sur le serveur.

1. Dans Cloudflare, ouvrir **Workers & Pages**, puis connecter le dépôt GitHub à un Worker, ou ouvrir le Worker existant et ses paramètres **Builds**.
2. Sélectionner le dépôt et la branche `main`.
3. Nom du Worker : `dossier-3-11`, comme dans `wrangler.jsonc`. Pour un autre nom, modifier également ce fichier.
4. Répertoire racine : laisser vide si les fichiers sont à la racine.
5. Commande de build : `npm run build`.
6. Commande de déploiement : `npx wrangler deploy`.
7. Déployer, puis ouvrir l’URL `workers.dev` affichée par Cloudflare. Chaque commit suivant sur `main` déclenchera un nouveau déploiement si la liaison Git est activée.

Le dossier `dist` est créé automatiquement. Ne pas envoyer le ZIP directement comme un fichier du dépôt. Aucun compte visiteur, aucune base de données et aucun service sonore externe requis à l’exécution.

## Calendrier conservé (heure de Paris)

- Porte : 25 octobre 2026 à 00 h.
- Salle et indice 1 : 27 octobre à 00 h.
- Indices 2, 3, 4, 5 : 28, 29, 30, 31 octobre à 00 h.
- Dernier chapitre : 1er novembre à 00 h — pièce vide et téléphone.
- Coffre du dernier chapitre : 2 novembre à 00 h.
- **Premier compteur : 3 novembre à 00 h, inchangé.**
- **Deuxième compteur, enveloppe et lettre : 3 novembre à 18 h.**

Les premiers horaires proviennent du fichier corrigé `index_minuit_paris_corrige.html`. Le dernier chapitre prend le relais automatiquement à partir du 1er novembre ; le code du premier compteur reste indépendant.

## Révélation personnalisée

Dans Cloudflare, **Settings → Variables & Secrets**, ajouter `LETTER_PROJECT_URL` avec l’URL HTTPS finale. Cette valeur est lue seulement côté serveur, et n’est renvoyée qu’à partir du 3 novembre 2026 à 18 h Paris. Ne pas l’inscrire dans l’HTML si elle doit rester secrète. Sans URL, une conclusion personnalisable s’affiche sans lien cassé.

Le texte de conclusion se règle dans `LETTER_REVEAL_MESSAGE` dans `wrangler.jsonc`, ou dans les variables d’environnement. Les variables `REVEAL_TITLE`, `REVEAL_MESSAGE` et `PROJECT_URL` appartiennent à la première révélation, à minuit ; elles ne règlent pas le compteur de la lettre.

Le serveur contrôle l’accès aux images d’indices, à la salle, au dernier chapitre, au coffre et à la révélation de 18 h. Changer l’horloge ou un état JavaScript ne donne pas accès à la véritable URL finale avant la date serveur. Le texte narratif générique et les visuels chargés ne sont pas des secrets cryptographiques.

## Vérification locale

Avec Node.js récent : `npm test`, puis `npm run dev`. Le serveur de développement utilise lui aussi la date réelle. Aucune commande permettant d’avancer le temps n’est présente dans cette livraison.

Tests inclus : sept tests couvrant les seuils avant/à l’heure de déblocage, les cinq indices, la salle, les deux échéances et l’URL de révélation. Le parcours de test est contrôlé dans Chrome ; un essai sur ton iPhone/Android reste à faire avant annonce publique.

Le rendu repose sur photos, canvas et plans CSS animés en perspective, optimisés sans moteur 3D externe. Le dernier chapitre utilise des sons de bibliothèque intégrés, sans voix synthétique. Les ouvertures de la porte du bunker et de la porte de la salle utilisent également le bruitage métallique enregistré, synchronisé avec le mouvement. Le bouton Son OFF coupe ces sons ; ils s’arrêtent également quand la page est masquée.

## Sources

Documentation Cloudflare : https://developers.cloudflare.com/workers/ci-cd/builds/configuration/ et https://developers.cloudflare.com/workers/static-assets/binding/.

Voir `CREDITS-SONS.md` pour les nouveaux bruitages.
