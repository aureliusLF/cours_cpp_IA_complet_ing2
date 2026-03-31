# Cours C++ complet ING2

Ce dossier contient désormais une version autonome du support de cours sous forme de mini-projet web statique.

## Point d'entrée

- `index.html` : page principale à ouvrir dans le navigateur
- l'application se charge via des scripts `defer` classiques, donc elle reste ouvrable directement sans serveur local

## Structure

- `index.html` : structure de la page et points d'ancrage de l'application
- `styles/main.css` : identité visuelle, layout responsive et composants
- `scripts/course-data.js` : contenu pédagogique principal des chapitres
- `scripts/app.js` : orchestrateur principal de l'application
- `scripts/data/glossary-study.js` : enrichissement du glossaire pour la révision interactive
- `scripts/lib/` : utilitaires de texte et coloration syntaxique
- `scripts/state/storage.js` : persistance de la progression et de l'état de révision
- `scripts/ui/course-view.js` : rendu du parcours, des chapitres et de la navigation
- `scripts/ui/glossary-view.js` : rendu du glossaire en liste, cartes mémoire et quiz

## Notes

- aucun build n'est nécessaire
- aucun serveur local n'est nécessaire pour l'usage courant
- la progression et les recherches sont conservées dans le `localStorage`
- le glossaire propose désormais trois modes : liste enrichie, flashcards et quiz
- les prompts d'exercices restent utilisables même sans intégration externe: ils sont affichés et copiables

## Idées d'extension

- ajouter d'autres chapitres dans `scripts/course-data.js`
- enrichir le glossaire et les quiz
- brancher une vraie impression PDF ou une génération de fiches de révision
- ajouter une section de corrigés détaillés ou d'annales
