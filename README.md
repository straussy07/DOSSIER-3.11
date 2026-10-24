# DOSSIER 03.11 — Suite automatique

Le jeu initial est conservé. La suite dépend de l'heure du serveur, sans réglage de date ni bouton de simulation pour les visiteurs.

- À 8 jours, 23 heures, 59 minutes, 59 secondes : porte DOSSIER 3.11, décor et judas verrouillé.
- À 7 jours, 23 heures, 59 minutes, 59 secondes : le judas permet d'entrer dans la pièce fournie.
- Dans la pièce : déplacement du cadrage à la souris, glissement tactile ou flèches du clavier. Le personnage barbu à gauche est le seul élément interactif ; cliquer déclenche une transition de tête vers le visiteur et le MP3 fourni. Les cinq indices du tableau deviennent consultables un par jour.
- Révélation finale : 3 novembre 2026 à 00:00 Paris, inchangée.

Les seuils sont calculés en secondes avant la révélation. Avec le changement d'heure, cela correspond au 25 octobre à 01:00:01 Paris pour la porte et au 26 octobre à 00:00:01 Paris pour la pièce.

## Mettre à jour le dépôt existant

1. Décompresser le ZIP.
2. Remplacer TOUS les fichiers à la racine du dépôt existant, en ajoutant notamment `room-data.mjs`.
3. Valider les changements (Commit changes).
4. Cloudflare : conserver le Worker `dossier-3-11`, build `npm run build`, déploiement `npx --yes wrangler@4 deploy`, répertoire racine vide.
5. Attendre que le déploiement réussisse. Le site évoluera ensuite automatiquement aux seuils prévus.

Ne déposer ni le ZIP lui-même, ni un dossier supplémentaire. Ne remplacer seulement index.html : le serveur doit aussi être mis à jour.

Fichiers attendus : index.html, worker.mjs, room-data.mjs, wrangler.jsonc, package.json, build.mjs, verification.test.mjs, clues-data.mjs, README.md, .gitignore.

## Protection et hébergement

Cloudflare Workers est nécessaire. GitHub Pages seul ou un HTML ouvert localement ne peut pas assurer le calendrier serveur. Les images de la pièce et le son sont refusés par les API avant l'ouverture, même si l'heure du téléphone est changée. Il n'y a aucune route de prévisualisation dans ce dossier.

Le dépôt contient les images encodées dans room-data.mjs : garder le dépôt PRIVÉ si elles doivent rester confidentielles avant l'ouverture. Ne placer aucun secret final dans les fichiers publics. La variable serveur PROJECT_URL (HTTPS) reste configurable pour le 3 novembre.

## Validation

`npm test` vérifie les seuils à la milliseconde, l'accès aux médias et à la révélation. `npm run build` prépare le site. La scène est un panorama photographique avec déplacement du cadrage et transition entre deux poses de tête, pas un personnage 3D articulé. Le MP3 original est conservé. La stabilité sur un iPhone physique reste à vérifier.

Pose de tête créée avec l'outil image intégré : modifier seulement la tête du barbu à gauche pour qu'il lève le regard vers le visiteur, préserver son identité, sa casquette, ses lunettes et le reste du studio. Seule la zone de la tête est composée dans la scène originale.

## Indices quotidiens

L’indice 1 ouvre à 6 j 23 h 59 min 59 s : le 27 octobre 2026 à 00:00:01 Paris. Puis un indice chaque 24 heures : 2 le 28, 3 le 29, 4 le 30, 5 le 31, à la même heure. Les précédents restent accessibles.

Associations : 1 = Le lieu (photo du Zénith en haut à gauche) ; 2 = Les quatre flashes (bande photo en bas à gauche) ; 3 = Les trois programmes (écran en bas à droite) ; 4 = Les origines (carte rouge en haut au milieu) ; 5 = L’identité (document en haut à droite).

Les fiches sont servies par /api/clue/1 à /api/clue/5, avec blocage serveur avant chaque date. Inclure le nouveau fichier clues-data.mjs dans le dépôt. Garder le dépôt privé pour ne pas exposer les fiches encodées avant leur ouverture. Le fichier Bêta est séparé : ne pas le publier sur le site de production.
