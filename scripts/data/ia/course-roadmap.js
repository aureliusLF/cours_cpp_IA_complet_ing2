(function registerCourseRoadmap(globalScope) {
const registry = globalScope.CourseDataRegistry;

if (!registry) {
  console.error("CourseDataRegistry est indisponible. Vérifie que scripts/data/course-runtime.js est chargé avant les données du cours.");
  return;
}

registry.setRoadmap([
  {
    index: "01",
    title: "Fondations du deep learning",
    text: "Comprendre ce qu'apporte la profondeur, lire une architecture, et situer les ConvNet dans le paysage.",
    bullets: [
      "niveaux d'abstraction et feature maps",
      "convolution, pooling, ReLU, dropout",
      "partage de poids et connexions locales"
    ]
  },
  {
    index: "02",
    title: "Architectures spécialisées",
    text: "Savoir choisir une famille de modèle selon la structure des données : images, séquences, graphes.",
    bullets: [
      "ConvNet classiques et modernes",
      "réseaux récurrents et attention",
      "adapter l'architecture au problème"
    ]
  },
  {
    index: "03",
    title: "Entraînement et optimisation",
    text: "Comprendre ce qui se passe pendant l'apprentissage : rétropropagation, optimiseurs, régularisation, diagnostics.",
    bullets: [
      "descente de gradient et variantes",
      "sur-apprentissage et remèdes",
      "lecture des courbes d'apprentissage"
    ]
  },
  {
    index: "04",
    title: "Applications et projet",
    text: "Mettre en pratique sur un cas concret : pipeline de données, entraînement, évaluation, inférence.",
    bullets: [
      "pipeline de données propre",
      "métriques adaptées à la tâche",
      "présentation d'un projet crédible"
    ]
  }
]);
})(window);
