(function registerCourseMeta(globalScope) {
const registry = globalScope.CourseDataRegistry;

if (!registry) {
  console.error("CourseDataRegistry est indisponible. Vérifie que scripts/data/course-runtime.js est chargé avant les données du cours.");
  return;
}

registry.setCourseMeta({
  title: "Cours C++ complet ING2",
  subtitle: "Un support de cours pensé comme un vrai projet web : progressif, concret et accessible même sans bagage préalable en C.",
  description:
    "Le fil directeur suit la logique d'un semestre d'ING2, mais repart vraiment des bases de syntaxe sans supposer de bagage en C, puis étend le parcours avec les réflexes du C++ moderne : RAII, STL, move semantics, debug, architecture et mini-projet final.",
  stats: [
    { value: "16", label: "chapitres progressifs" },
    { value: "55+", label: "objectifs et checklists" },
    { value: "33", label: "exercices guidés" },
    { value: "C++20", label: "base de compilation recommandée" }
  ]
});
})(window);
