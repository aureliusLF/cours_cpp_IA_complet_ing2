(function registerCourseRoadmap(globalScope) {
const registry = globalScope.CourseDataRegistry;

if (!registry) {
  console.error("CourseDataRegistry est indisponible. Vérifie que scripts/data/course-runtime.js est chargé avant les données du cours.");
  return;
}

registry.setRoadmap([
  {
    index: "01",
    title: "Fondations",
    text: "Comprendre le modèle de compilation, la syntaxe sûre, les types et les fonctions.",
    bullets: [
      "se repérer dans un projet multi-fichiers",
      "éviter les conversions dangereuses",
      "maîtriser les références et const"
    ]
  },
  {
    index: "02",
    title: "Objet et cycle de vie",
    text: "Construire des classes robustes, exprimer des invariants et raisonner sur la durée de vie.",
    bullets: [
      "encapsulation et API propre",
      "constructeurs, destructeurs, RAII",
      "règle de 0/3/5"
    ]
  },
  {
    index: "03",
    title: "Abstraction avancée",
    text: "Utiliser la surcharge, l'héritage, le polymorphisme et les templates sans perdre la lisibilité.",
    bullets: [
      "opérateurs cohérents",
      "interfaces abstraites",
      "généricité et STL"
    ]
  },
  {
    index: "04",
    title: "Robustesse projet",
    text: "Structurer une base de code, gérer les erreurs, tester et préparer un mini-projet crédible.",
    bullets: [
      "exceptions et fichiers",
      "outils modernes de debug",
      "plan de projet final"
    ]
  }
]);
})(window);
