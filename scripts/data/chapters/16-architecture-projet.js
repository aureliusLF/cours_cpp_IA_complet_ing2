(function registerChapterBundle16(globalScope) {
const registry = globalScope.CourseDataRegistry;

if (!registry) {
  console.error("CourseDataRegistry est indisponible. Vérifie que scripts/data/course-runtime.js est chargé avant les chapitres.");
  return;
}

const {
  lesson,
  paragraphs,
  bullets,
  checklist,
  callout,
  code,
  table,
  videoLesson,
  playlistVideo
} = registry.helpers;

registry.registerChapterBundle({
  order: 16,
  chapter:   {
    id: "architecture-projet",
    shortTitle: "Architecture projet",
    title: "Méthodologie de projet C++ : architecture, debug et mini-projet final",
    level: "Projet",
    duration: "45 min",
    track: "Synthèse",
    summary:
      "Ce dernier chapitre rassemble les briques techniques pour en faire une démarche d'ingénieur : structurer, tester, déboguer et découper un mini-projet réaliste.",
    goals: [
      "organiser un projet C++ en modules cohérents",
      "installer des réflexes de debug et de vérification",
      "transformer le cours en feuille de route de mini-projet"
    ],
    highlights: ["sanitizers", "tests", "mini-projet"],
    body: [
      lesson(
        "Architecture minimale crédible",
        paragraphs(
          "Un mini-projet pédagogique peut rester simple tout en étant structuré : un dossier <code>include</code>, un dossier <code>src</code>, un ou plusieurs exécutables, un dossier <code>tests</code> et une documentation légère.",
          "Le bon découpage suit les responsabilités métier : modèles, services, adaptation I/O, outils de visualisation, et point d'entrée."
        ),
        code(
          "text",
          `
cours_cpp_app/
  include/
    compte.h
    portefeuille.h
  src/
    compte.cpp
    portefeuille.cpp
    main.cpp
  tests/
    portefeuille_test.cpp
  CMakeLists.txt
          `,
          "Arborescence cible"
        ),
        callout("info", "Réflexe d'architecture", "Un fichier ne doit pas être le dépôt vague de tout ce qu'on ne sait pas ranger ailleurs.")
      ),
      lesson(
        "Debug, warnings et sanitizers",
        paragraphs(
          "Le débogage en C++ s'améliore énormément quand on active tôt les warnings et les sanitizers. Un bug mémoire détecté avec <code>address sanitizer</code> coûte beaucoup moins cher qu'un comportement erratique observé trop tard.",
          "Un ingénieur C++ performant n'écrit pas seulement du code ; il construit un environnement qui attrape ses erreurs tôt."
        ),
        code(
          "bash",
          `
g++ -std=c++20 -Wall -Wextra -pedantic \
    -fsanitize=address,undefined \
    -g src/*.cpp -o app
          `,
          "Compilation de debug"
        ),
        bullets([
          "Compiler avec des warnings stricts dès le premier jour.",
          "Utiliser <code>-g</code> pour obtenir des informations de debug.",
          "Activer les sanitizers sur les exercices manipulant mémoire et pointeurs."
        ])
      ),
      lesson(
        "Mini-projet final : suggestions de sujet",
        paragraphs(
          "Pour consolider le semestre, choisis un sujet qui force à mobiliser plusieurs notions : encapsulation, collections, I/O, erreurs, éventuellement polymorphisme.",
          "L'important n'est pas la taille du projet, mais la qualité des frontières, des invariants et des tests simples."
        ),
        table(
          ["Sujet", "Compétences mobilisées"],
          [
            ["Gestionnaire de portefeuille financier", "classes, STL, fichiers, exceptions, affichage synthétique"],
            ["Mini moteur de formes géométriques", "polymorphisme, conteneurs, surcharge, architecture"],
            ["Répertoire de contacts", "I/O fichier, encapsulation, recherche, vecteurs, tri"]
          ]
        ),
        callout("success", "Fin de parcours", "Un bon mini-projet vaut mieux qu'une dizaine d'exercices isolés : il révèle les vraies difficultés d'intégration.")
      )
    ].join(""),
    checklist: [
      "Je sais proposer une arborescence minimale cohérente.",
      "J'active warnings et mode debug.",
      "Je connais l'intérêt des sanitizers.",
      "Je sais découper un mini-projet en modules.",
      "Je peux relier chaque choix de structure à un besoin métier."
    ],
    quiz: [
      {
        question: "Pourquoi les sanitizers sont-ils précieux en C++ ?",
        options: [
          "Ils rendent le code objet automatiquement",
          "Ils détectent tôt certains bugs mémoire et comportements indéfinis",
          "Ils remplacent les tests"
        ],
        answer: 1,
        explanation: "Les sanitizers donnent un retour immédiat sur des erreurs souvent coûteuses à diagnostiquer autrement."
      },
      {
        question: "Quel critère doit guider le découpage des fichiers d'un mini-projet ?",
        options: [
          "Le hasard ou la taille brute des fichiers",
          "Les responsabilités métier et techniques",
          "Le nombre de couleurs dans l'éditeur"
        ],
        answer: 1,
        explanation: "Le découpage doit suivre les responsabilités, pas une contrainte arbitraire."
      }
    ],
    exercises: [
      {
        title: "Backlog de mini-projet",
        difficulty: "Projet",
        time: "30 min",
        prompt: "Choisis un sujet final et rédige un backlog de 6 à 8 tâches ordonnées, avec les modules à créer et les risques techniques.",
        deliverables: [
          "le sujet retenu",
          "les tâches ordonnées",
          "les risques et les parades"
        ]
      },
      {
        title: "Plan de vérification",
        difficulty: "Intermédiaire",
        time: "20 min",
        prompt: "Pour un mini-projet, liste les points à vérifier manuellement et ceux qui méritent un test automatisé simple.",
        deliverables: [
          "vérifications manuelles",
          "tests automatisables",
          "outils de compilation de debug"
        ]
      }
    ],
    keywords: ["architecture", "debug", "sanitizer", "tests", "mini project", "cmake"]
  },
  deepDives: [
    {
      focus: "Une architecture minimale crédible ne cherche pas à imiter un grand framework. Elle sert à rendre visibles les responsabilités, à limiter le couplage et à permettre des évolutions sans réécriture totale.",
      retenir: [
        "Une bonne architecture aide d'abord à savoir où placer la prochaine fonctionnalité.",
        "Les frontières utiles sont celles qui suivent le métier et les dépendances réelles."
      ],
      pitfalls: [
        "Sur-architecturer trop tôt avec des couches sans utilité immédiate.",
        "Laisser tout dériver dans main.cpp jusqu'à perdre toute frontière de responsabilité."
      ],
      method: [
        "Sépare d'abord le domaine, l'I/O et l'orchestration générale.",
        "Donne à chaque module une responsabilité que tu peux formuler simplement.",
        "Vérifie qu'un changement local n'oblige pas à retoucher tout le projet."
      ],
      check: "Peux-tu expliquer l'architecture d'un mini-projet en quelques responsabilités claires plutôt qu'en liste de fichiers ?"
    },
    {
      focus: "Warnings, debug et sanitizers forment un filet de sécurité très rentable. Ils ne remplacent ni la conception ni les tests, mais ils signalent tôt des incohérences qui coûteraient beaucoup plus cher à diagnostiquer plus tard.",
      retenir: [
        "Les warnings sont une conversation précoce avec le compilateur.",
        "Les sanitizers rendent visibles des erreurs mémoire ou de comportement indéfini souvent silencieuses."
      ],
      pitfalls: [
        "Tolérer des warnings 'temporaires' qui finissent par devenir le bruit normal du projet.",
        "Déboguer uniquement à l'intuition sans outillage reproductible."
      ],
      method: [
        "Active des options strictes dès le début du projet.",
        "Reproduis les bugs en build debug avec symboles et, si utile, sanitizers.",
        "Corrige la première anomalie certaine avant d'interpréter les effets en cascade."
      ],
      check: "Si un programme 'marche parfois', quel outil actives-tu en premier pour sortir du ressenti et revenir à des faits ?"
    },
    {
      focus: "Le mini-projet final vaut comme synthèse parce qu'il oblige à articuler toutes les notions : design, STL, erreurs, fichiers, organisation et validation. L'objectif n'est pas l'ambition fonctionnelle brute, mais la solidité de l'ensemble.",
      retenir: [
        "Un bon sujet final est assez riche pour mobiliser plusieurs notions, mais assez petit pour rester testable.",
        "La qualité d'un mini-projet se voit dans ses frontières et ses invariants autant que dans ses fonctionnalités."
      ],
      pitfalls: [
        "Choisir un sujet trop vaste qui pousse au bricolage rapide.",
        "Accumuler des fonctionnalités sans plan de validation ni priorités."
      ],
      method: [
        "Définis un périmètre minimal crédible avec quelques cas d'usage forts.",
        "Découpe ensuite le travail en modules et en itérations courtes.",
        "Prévois dès le début comment tu vérifieras chaque partie importante."
      ],
      check: "Si tu devais défendre ton mini-projet devant un enseignant, saurais-tu expliquer pourquoi son découpage et ses choix techniques sont cohérents ?"
    }
  ]
});
})(window);
