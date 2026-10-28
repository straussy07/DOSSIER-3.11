# DOSSIER 03.11

Dépôt complet du jeu : application, Worker, indices, données de salle, voix et images. L’application suit l’heure réelle de Paris. Les commandes d’avance temporelle sont retirées.

## Calendrier

- 25 octobre 2026 à 00 h : la porte apparaît.
- 26 octobre à 00 h : la salle normale s’ouvre.
- 27 octobre à 00 h : l’indice 1 se débloque et le décor casino prend place.
- 28 octobre à 00 h : le décor concert prend place.
- 29 octobre à 00 h : porte et salle sous-marines; les poissons nagent dans les vitres. L’indice 3 se débloque.
- 30 octobre : retour au décor normal; l’indice 4 se débloque.
- 31 octobre à 00 h : scène Halloween et indice 5.
- 1er novembre à 00 h : ouverture de la séquence finale; révélation le 3 novembre à 00 h.

La roue dessinée par le code est retirée. Les images de décor d’origine sont conservées. Le clic sur le personnage barbu lit la piste MP3 fournie par le Worker via `/api/room-audio`.

## Fichiers

- `index.html` : interface et déroulement du jeu.
- `worker.mjs` : API pour les échéances, indices, voix et scènes protégées.
- `clues-data.mjs` et `room-data.mjs` : images d’indices, image de salle, piste audio et animation du personnage.
- `*-door.webp` et `*-room.webp` : décors datés et décor normal, dont le décor sous-marin du 29 octobre.
- `build.mjs` : copie l’application et ses images dans `dist/`.
- `wrangler.jsonc` : configuration du Worker et de ses ressources statiques.
- `CREDITS-SONS.md` : crédits et licence des effets sonores.

## Développement et déploiement

Prérequis : Node.js et un compte Cloudflare. Le dépôt GitHub conserve le code source; le Worker Cloudflare sert l’API requise par le jeu. GitHub Pages seul ne fournit pas cette API.

```bash
npm install
npm run dev
```

Pour publier depuis un environnement connecté à Cloudflare :

```bash
npx wrangler login
npm run deploy
```

Les variables de révélation optionnelles (`REVEAL_TITLE`, `REVEAL_MESSAGE`, `LETTER_REVEAL_MESSAGE`) ont des valeurs par défaut dans `wrangler.jsonc`. Aucun secret n’est requis pour le parcours présent.
