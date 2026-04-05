(function registerChapterBundle1(globalScope) {
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
  order: 1,
  chapter:   {
    id: "vision-outillage",
    shortTitle: "Vision et outillage",
    title: "Vision d'ensemble, compilation et environnement de travail",
    level: "Fondations",
    duration: "30 min",
    track: "SE1",
    summary:
      "Le but n'est pas seulement d'écrire du C++ qui compile, mais de comprendre comment le compilateur, l'éditeur de liens et la structure du projet collaborent. Ce chapitre pose le terrain de jeu.",
    goals: [
      "expliquer les étapes préprocesseur -> compilation -> linkage",
      "choisir un standard moderne et des options de warning solides",
      "lire une arborescence de projet avec headers, sources et CMake"
    ],
    highlights: ["g++", "CMake", "linker"],
    body: [
      lesson(
        "Pourquoi C++ reste central en ING2",
        paragraphs(
          "Le C++ se place au croisement de la performance, du contrôle mémoire et de l'abstraction. On le rencontre en embarqué, calcul scientifique, finance, moteurs 3D, middleware et outils systèmes.",
          "Dans un parcours d'ingénieur, il force à raisonner sur les couches basses <em>et</em> sur la conception objet. C'est précisément ce qui le rend formateur : on ne peut pas séparer l'algorithme, la représentation mémoire et l'architecture logicielle."
        ),
        table(
          ["Sujet", "À retenir"],
          [
            ["Performance", "Compilation en natif, contrôle fin des allocations et du layout mémoire."],
            ["Abstraction", "Classes, templates, STL, polymorphisme et généricité."],
            ["Responsabilité", "Le compilateur aide beaucoup, mais il ne vous protège pas de toutes les erreurs de conception."]
          ]
        ),
        callout("info", "Réflexe de départ", "En ING2, ne pensez pas seulement en lignes de code. Pensez aussi en unités de traduction, interfaces et responsabilités.")
      ),
      lesson(
        "Chaîne de construction d'un programme",
        paragraphs(
          "Un fichier source ne devient pas directement un exécutable. Le préprocesseur développe les inclusions, le compilateur produit des objets, puis l'éditeur de liens résout les symboles entre ces objets et les bibliothèques.",
          "Comprendre le rôle du linker évite beaucoup d'erreurs classiques : fonctions déclarées mais jamais définies, doublons de symboles ou oubli d'ajouter un fichier source à la construction."
        ),
        code(
          "bash",
          `
g++ -std=c++20 -Wall -Wextra -pedantic -c src/Vector.cpp -o build/Vector.o
g++ -std=c++20 -Wall -Wextra -pedantic -c src/main.cpp -o build/main.o
g++ build/main.o build/Vector.o -o build/app
          `,
          "Compilation manuelle"
        ),
        callout("warn", "Erreur fréquente", "Si la compilation passe mais que le linkage échoue, le problème vient souvent d'une définition manquante ou d'un .cpp oublié dans la commande.")
      ),
      lesson(
        "Bibliothèques statiques et dynamiques",
        paragraphs(
          "Au moment du linkage, ton programme peut soit embarquer directement le code d'une bibliothèque, soit ne garder qu'une référence vers une bibliothèque chargée au lancement. C'est la différence entre bibliothèque statique et bibliothèque dynamique.",
          "Le choix change la taille du binaire, la manière de déployer l'application et la stratégie de mise à jour. Une bibliothèque statique rend l'exécutable plus autonome ; une bibliothèque dynamique allège le binaire mais impose la présence de la bonne version sur la machine cible."
        ),
        table(
          ["Type", "Moment de résolution", "Atout principal", "Point de vigilance"],
          [
            ["Statique (<code>.a</code>)", "Le code est intégré à l'édition de liens.", "Exécutable autonome.", "Binaire plus lourd ; recompilation si la bibliothèque change."],
            ["Dynamique (<code>.so</code> / <code>.dll</code>)", "Le code est chargé à l'exécution.", "Mise à jour souple et binaire plus léger.", "La bibliothèque doit être présente et résolue sur la machine hôte."]
          ]
        ),
        code(
          "bash",
          `
ar -rv libmaths.a addition.o fraction.o
g++ main.cpp -L. -lmaths -o app

g++ -shared -o libmaths.so addition.o fraction.o
export LD_LIBRARY_PATH=.:$LD_LIBRARY_PATH
          `,
          "Créer et utiliser une bibliothèque"
        ),
        bullets([
          "Sous Linux, les bibliothèques statiques sont souvent des <code>.a</code> et les dynamiques des <code>.so</code> ; sous Windows, on rencontre des <code>.dll</code>.",
          "Un header local du projet s'inclut généralement avec <code>#include \"mon_header.h\"</code>, alors qu'une bibliothèque standard ou système s'inclut souvent avec <code>#include &lt;vector&gt;</code>."
        ]),
        callout("info", "Choix d'ingénierie", "Ne retiens pas seulement les commandes : retiens surtout le compromis entre autonomie du binaire, facilité de déploiement et souplesse de mise à jour.")
      ),
      lesson(
        "Structure minimale d'un vrai projet",
        paragraphs(
          "Dès qu'un exercice dépasse quelques centaines de lignes, séparez ce qui est exposé de ce qui est implémenté. Les headers décrivent l'API ; les sources portent le comportement ; un fichier d'entrée orchestre l'exécution.",
          "L'outil CMake devient vite rentable : il centralise le standard C++, les dépendances et les cibles."
        ),
        code(
          "cmake",
          `
cmake_minimum_required(VERSION 3.20)
project(cours_cpp_ing2 LANGUAGES CXX)

set(CMAKE_CXX_STANDARD 20)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

add_executable(app
  src/main.cpp
  src/Vector.cpp
)

target_include_directories(app PRIVATE include)
target_compile_options(app PRIVATE -Wall -Wextra -pedantic)
          `,
          "CMakeLists.txt minimal"
        ),
        bullets([
          "<code>include/</code> pour les headers publics",
          "<code>src/</code> pour les implémentations",
          "<code>tests/</code> pour la vérification",
          "<code>build/</code> pour les artefacts générés"
        ])
      ),
      videoLesson(
        "Si tu veux une vue d'ensemble plus orale avant d'entrer dans les détails du cours écrit, cette sélection de la playlist colle bien à ce chapitre d'ouverture.",
        [
          playlistVideo("howCppWorks", "bonne porte d'entrée pour visualiser le rôle du compilateur, du linker et de la structure globale d'un programme"),
          playlistVideo("headerFiles", "utile pour faire le lien entre fichiers d'interface, unités de traduction et organisation multi-fichiers")
        ]
      )
    ].join(""),
    checklist: [
      "Je sais distinguer compilation et linkage.",
      "Je sais expliquer la différence entre bibliothèque statique et dynamique.",
      "Je compile avec un standard explicite, idéalement C++17 ou C++20.",
      "Je connais le rôle d'un header par rapport à un source.",
      "Je peux expliquer pourquoi un projet multi-fichiers est plus maintenable.",
      "Je sais lire un CMakeLists.txt minimal."
    ],
    quiz: [
      {
        question: "Quel outil résout les symboles entre plusieurs fichiers objets ?",
        options: ["Le préprocesseur", "L'éditeur de liens", "Le garbage collector"],
        answer: 1,
        explanation: "Le linker assemble les objets compilés et vérifie que chaque symbole utilisé possède une définition."
      },
      {
        question: "Pourquoi activer <code>-Wall -Wextra</code> tôt dans le projet ?",
        options: [
          "Pour rendre le binaire plus rapide automatiquement",
          "Pour transformer des erreurs de conception potentielles en signaux visibles",
          "Pour éviter d'avoir besoin d'un header"
        ],
        answer: 1,
        explanation: "Les warnings révèlent tôt des conversions douteuses, variables inutilisées, oublis de return et autres indices de bugs."
      },
      {
        question: "Quel avantage apporte typiquement une bibliothèque dynamique par rapport à une bibliothèque statique ?",
        options: [
          "Elle supprime totalement le besoin de linkage",
          "Elle permet de mettre à jour la bibliothèque sans recompiler l'exécutable",
          "Elle empêche toute dépendance externe au déploiement"
        ],
        answer: 1,
        explanation: "Une bibliothèque dynamique peut être remplacée sur la machine cible sans reconstruire le binaire, à condition que l'ABI et le chargement restent compatibles."
      }
    ],
    exercises: [
      {
        title: "Reconstituer une arborescence propre",
        difficulty: "Facile",
        time: "15 min",
        prompt: "À partir d'un exercice monofichier, sépare l'interface et l'implémentation puis décris la commande de compilation complète.",
        deliverables: [
          "un header avec les déclarations",
          "un source avec les définitions",
          "une commande ou un CMakeLists.txt minimal"
        ]
      },
      {
        title: "Autopsie d'une erreur de linkage",
        difficulty: "Intermédiaire",
        time: "20 min",
        prompt: "Provoque volontairement une erreur de symbole non défini, puis explique pas à pas comment la corriger.",
        deliverables: [
          "le message d'erreur interprété",
          "la cause exacte",
          "la correction dans la structure du projet"
        ]
      }
    ],
    keywords: ["compilation", "linkage", "cmake", "g++", "header", "source", "projet", "bibliotheque statique", "bibliotheque dynamique", "shared library", "static library"]
  },
  deepDives: [
    {
      focus: "Cette leçon pose la bonne posture pour tout le semestre : en C++, on ne sépare jamais complètement le code, son coût d'exécution et l'organisation du projet. Comprendre le langage, c'est aussi comprendre les contraintes de compilation, de lisibilité et de maintenance.",
      retenir: [
        "Le C++ est formateur parce qu'il relie algorithmique, mémoire, architecture et outils.",
        "Une bonne réponse d'ingénieur explique non seulement ce que fait le code, mais aussi pourquoi cette forme est pertinente."
      ],
      pitfalls: [
        "Voir le C++ comme une simple version plus compliquée du C ou de Java.",
        "Apprendre la syntaxe sans relier les choix d'écriture au modèle mémoire et au build."
      ],
      method: [
        "Pour chaque notion, demande-toi quel problème concret elle résout.",
        "Relie systématiquement un concept à un coût, un invariant ou une contrainte de projet.",
        "Révise en reformulant à l'oral la raison d'être de chaque outil du langage."
      ],
      check: "Saurais-tu expliquer à quelqu'un pourquoi le C++ apprend autant la conception que l'implémentation ?"
    },
    {
      focus: "La chaîne de construction est l'un des premiers filtres de compréhension. Savoir distinguer préprocesseur, compilation et édition de liens permet de diagnostiquer beaucoup plus vite les erreurs qui semblent 'mystérieuses' au début.",
      retenir: [
        "Une erreur de syntaxe, une erreur de type et une erreur de linkage n'apparaissent pas au même moment.",
        "Le linker ne fabrique pas le code : il assemble des définitions déjà produites ailleurs."
      ],
      pitfalls: [
        "Chercher dans le mauvais fichier alors que le problème vient d'un .cpp non compilé ou non lié.",
        "Confondre une déclaration visible avec une définition réellement fournie."
      ],
      method: [
        "Lis d'abord le message d'erreur pour identifier l'étape qui échoue.",
        "Vérifie ensuite les fichiers effectivement compilés puis la présence des définitions attendues.",
        "Reproduis le build minimalement pour isoler la première cause plutôt que les symptômes secondaires."
      ],
      check: "Peux-tu distinguer clairement ce qui relève du compilateur et ce qui relève du linker sur un exemple simple ?"
    },
    {
      focus: "Une structure de projet crédible réduit les erreurs autant qu'elle améliore la lecture. Le vrai enjeu n'est pas d'avoir beaucoup de fichiers, mais de découper le code selon des responsabilités stables.",
      retenir: [
        "Le header expose une interface ; le source porte le comportement détaillé.",
        "Une arborescence propre rend visibles les frontières entre domaine, infrastructure et point d'entrée."
      ],
      pitfalls: [
        "Créer des fichiers en suivant la taille du code plutôt que la cohérence des responsabilités.",
        "Laisser l'organisation dériver jusqu'à ce que chaque changement casse plusieurs modules."
      ],
      method: [
        "Identifie les types ou services qui méritent une API propre.",
        "Place leurs déclarations publiques dans des headers sobres et cohérents.",
        "Centralise la configuration de compilation dans CMake ou un script unique."
      ],
      check: "Si on te donne un mini-projet mal rangé, saurais-tu proposer une arborescence plus claire et justifier tes choix ?"
    },
    {
      focus: "Bibliothèques statiques et dynamiques prolongent la compréhension du linkage : au-delà de 'ça compile', il faut savoir ce que l'exécutable embarque réellement et ce qu'il dépendra de retrouver au lancement sur la machine cible.",
      retenir: [
        "Une bibliothèque statique est intégrée au binaire lors de l'édition de liens.",
        "Une bibliothèque dynamique réduit l'exécutable mais reporte une dépendance au moment de l'exécution."
      ],
      pitfalls: [
        "Choisir une bibliothèque dynamique sans penser au déploiement ni au chargement réel sur la machine cible.",
        "Confondre le rôle du header et le mode de linkage de la bibliothèque."
      ],
      method: [
        "Demande-toi d'abord si ton besoin prioritaire est l'autonomie du binaire ou la facilité de mise à jour.",
        "Vérifie ensuite comment la bibliothèque sera résolue sur les machines d'exécution.",
        "Relie toujours le choix technique à une contrainte de déploiement concrète."
      ],
      check: "Si tu devais livrer un binaire sur une machine peu contrôlée, choisirais-tu plutôt une bibliothèque statique ou dynamique, et pourquoi ?"
    }
  ]
});
})(window);
