# DOSSIER 03.11 — version corrigée pour GitHub + Cloudflare Workers

## Ce qui est corrigé

- La vraie page d’accueil s’appelle `index.html` (pas `index(2026…).html`).
- Le Worker redirige **en interne** `/` vers `/index.html` et envoie `Content-Type: text/html; charset=utf-8` et `Content-Disposition: inline` : le navigateur affiche le site au lieu de télécharger le fichier.
- Les fichiers `room-data.mjs` et `clues-data.mjs`, nécessaires aux scènes et aux indices, sont inclus.
- Le compteur **principal** et sa révélation serveur sont réglés au **3 novembre 2026, 00 h 00 à Paris** (`2026-11-02T23:00:00.000Z`).
- Le compteur **secondaire de la lettre** reste fixé au **3 novembre 2026 à 18 h 00 à Paris**, sans décaler le premier.
- Aucun mode d’accélération temporelle n’est ajouté. Les accès aux ressources privées utilisent l’heure du serveur.

## Publication : IMPORTANT

1. **Décompresser** `DOSSIER_03_11_SITE_CORRIGE.zip` sur votre ordinateur.
2. Sur **GitHub**, ouvrir le dépôt connecté au Worker ; supprimer ou remplacer les fichiers historiques nommés `index(…).html`, `worker(2).mjs`, `package(4).json`, `wrangler(2).jsonc`, etc.
3. Avec **Add file > Upload files**, importer les fichiers *à la racine*, sans dossier intermédiaire. Doivent impérativement être présents et porter **exactement** ces noms :
   `index.html`, `worker.mjs`, `room-data.mjs`, `clues-data.mjs`, `build.mjs`, `package.json`, `wrangler.jsonc`, `verification.test.mjs`.
4. Cliquer **Commit changes**.
5. Dans **Cloudflare > Workers & Pages**, connecter ce dépôt et sa branche `main` à un **Worker** (pas seulement GitHub Pages).
6. Définir **Build command** : `npm run build` et **Deploy command** : `npx wrangler deploy`. Répertoire racine : dépôt (`/` ou vide). Les fichiers `dist/index.html` sont créés lors du build.
7. Ouvrir l’**adresse `https://...workers.dev/`** fournie par Cloudflare, et non une adresse GitHub `/blob/`, `/raw/`, `?raw=1` ou un lien vers un fichier ZIP. Ces liens servent à télécharger ou consulter le code, pas à afficher le site.

⚠️ **GitHub Pages seul ne suffit pas** : la salle, les indices et la révélation utilisent les API du Worker.

## Vérifications

- `npm test` teste notamment le compteur principal à la seconde près, le déverrouillage serveur et le format HTML en réponse à `/`.
- `npm run build` prépare le dossier `dist`.
- Pour tester localement sur un ordinateur avec Node.js : `npm run dev` (Cloudflare Wrangler doit pouvoir s’installer).

## Calendrier (heure de Paris)

| Événement | Date / heure |
|---|---|
| Porte | 25 octobre à 00 h 00 |
| Salle + indice 1 | 27 octobre à 00 h 00 |
| Indices suivants | 28–31 octobre à 00 h 00 |
| Dernier chapitre / pièce vide | 1er novembre à 00 h 00 |
| Coffre | 2 novembre à 00 h 00 |
| **Révélation du premier compteur** | **3 novembre à 00 h 00** |
| **Révélation de la lettre / second compteur** | **3 novembre à 18 h 00** |

**Attention** : si vous publiez cette version après une date de déblocage, le chapitre du jour sera immédiatement disponible.

## Révélation

Configurer au besoin `PROJECT_URL` pour la révélation initiale et `LETTER_PROJECT_URL` pour la seconde révélation dans **Cloudflare > Worker > Settings > Variables & Secrets**. Ces URL doivent être HTTPS et ne sont transmises au visiteur qu'à la date autorisée côté serveur. Les valeurs absentes produisent un texte de remplacement, pas un lien cassé.

L'ensemble du site (y compris la scène finale) est déjà inclus dans `index.html`. Ne pas recréer un fichier `finale.html`.
