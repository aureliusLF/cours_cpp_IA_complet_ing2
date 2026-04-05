# Cours C++ complet ING2

Ce dossier contient désormais une version autonome du support de cours sous forme de mini-projet web statique.

## Point d'entrée

- `index.html` : page principale à ouvrir dans le navigateur
- l'application se charge via des scripts `defer` classiques, donc elle reste ouvrable directement sans serveur local

## Structure

- `index.html` : structure de la page et points d'ancrage de l'application
- `styles/main.css` : identité visuelle, layout responsive et composants
- `scripts/course-data.js` : bootstrap final qui assemble et publie `window.COURSE_DATA`
- `scripts/app.js` : orchestrateur principal de l'application
- `scripts/data/course-runtime.js` : helpers de contenu et registre global des données du cours
- `scripts/data/course-meta.js` : métadonnées du parcours
- `scripts/data/course-roadmap.js` : feuille de route du cours
- `scripts/data/course-glossary.js` : glossaire principal
- `scripts/data/chapters/` : un fichier par chapitre, avec son contenu et ses deep dives
- `scripts/data/glossary-study.js` : enrichissement du glossaire pour la révision interactive
- `scripts/lib/` : utilitaires de texte et coloration syntaxique
- `scripts/state/storage.js` : persistance de la progression et de l'état de révision
- `scripts/ui/course-view.js` : rendu du parcours, des chapitres et de la navigation
- `scripts/ui/glossary-view.js` : rendu du glossaire en liste, cartes mémoire et quiz

## Notes

- aucun build n'est nécessaire
- aucun serveur local n'est nécessaire pour l'usage courant
- l'ouverture directe de `index.html` reste le mode nominal
- la progression et les recherches sont conservées dans le `localStorage`
- le glossaire propose désormais trois modes : liste enrichie, flashcards et quiz
- les prompts d'exercices restent utilisables même sans intégration externe: ils sont affichés et copiables
- les recherches du cours et du glossaire sont débouncées pour garder une saisie fluide

## Accessibilité

- un titre principal `h1` est présent dans la sidebar pour améliorer la hiérarchie du document
- les sections du chapitre et les modes du glossaire suivent désormais un vrai pattern d'onglets ARIA
- navigation clavier disponible sur les onglets: `Tab`, `Shift+Tab`, `ArrowLeft`, `ArrowRight`, `Home`, `End`
- raccourci `/` pour placer le focus dans la recherche principale
- `Escape` ferme le panneau de prompt et retire le focus des champs de recherche actifs
- la préférence système `prefers-reduced-motion` désactive les scrolls lissés et réduit les transitions

## Vérification manuelle

- ouvrir `index.html` directement dans le navigateur et vérifier que l'application démarre sans serveur
- changer de chapitre via la sidebar et vérifier que le hash suit bien le chapitre courant
- taper dans la recherche principale puis dans celle du glossaire et vérifier que la saisie reste fluide
- naviguer au clavier dans les onglets du chapitre et du glossaire
- valider un chapitre, recharger la page et vérifier que la progression est restaurée
- tester le glossaire en modes liste, cartes et quiz puis recharger la page pour vérifier la persistance
- activer la réduction des animations au niveau système et vérifier l'absence de défilement lissé

## Idées d'extension

- ajouter d'autres chapitres dans `scripts/data/chapters/`
- enrichir le glossaire et les quiz
- brancher une vraie impression PDF ou une génération de fiches de révision
- ajouter une section de corrigés détaillés ou d'annales
