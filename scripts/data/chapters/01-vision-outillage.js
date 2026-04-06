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
  withChapterTheme,
  videoLesson,
  playlistVideo
} = registry.helpers;

registry.registerChapterBundle({
  order: 1,
  chapter: withChapterTheme("vision-outillage", () => ({
    id: "vision-outillage",
    shortTitle: "Vision et outillage",
    title: "Vision d'ensemble, compilation et environnement de travail",
    level: "Fondations",
    duration: "1 h 10",
    track: "SE1",
    summary:
      "Le but n'est pas seulement d'écrire du C++ qui compile, mais de comprendre comment le préprocesseur, le compilateur, l'éditeur de liens, les warnings, CMake et la structure du projet collaborent. Ce chapitre pose le vrai terrain de jeu du semestre.",
    goals: [
      "expliquer les étapes préprocesseur -> compilation -> fichiers objets -> linkage -> exécutable",
      "choisir un standard moderne, des options de warning solides et distinguer une build de debug d'une build de release",
      "lire une arborescence de projet avec headers, sources, cibles CMake et unités de traduction"
    ],
    highlights: ["g++", "CMake", "linker", "warnings", "debug/release"],
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
        "Unités de traduction, headers et fichiers objets",
        paragraphs(
          "Un point très formateur en C++ est la notion d'unité de traduction. En pratique, chaque <code>.cpp</code> compilé séparément forme son propre monde après expansion des <code>#include</code>. Le compilateur produit alors un fichier objet pour cette unité, puis le linker assemble ces morceaux. C'est cette mécanique qui explique pourquoi un header peut être inclus dans plusieurs sources, alors qu'une définition non protégée peut créer des doublons de symboles.",
          "Cette lecture change la manière de concevoir un projet. Un header doit exposer une interface stable et réutilisable. Un source doit contenir une implémentation qui peut être compilée séparément. Dès que tu comprends cela, beaucoup d'erreurs qui semblaient mystérieuses deviennent lisibles."
        ),
        code(
          "text",
          `
include/
  fraction.h        // declarations
src/
  fraction.cpp      // definitions
  main.cpp          // point d'entree
build/
  fraction.o        // fichier objet
  main.o            // fichier objet
  app               // executable final
          `,
          "Des fichiers differents, des rôles differents"
        ),
        table(
          ["Fichier", "Rôle principal"],
          [
            ["Header <code>.h</code> / <code>.hpp</code>", "Déclarations visibles par d'autres unités de traduction."],
            ["Source <code>.cpp</code>", "Définitions compilées séparément."],
            ["Fichier objet <code>.o</code>", "Résultat intermédiaire produit par le compilateur."],
            ["Exécutable", "Résultat final du linkage."]
          ]
        ),
        callout("info", "Idée clé", "Le compilateur ne 'voit' pas ton projet comme un gros dossier. Il voit des unités de traduction compilées séparément, puis assemblées.")
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
        "Warnings, standards et builds de debug ou de release",
        paragraphs(
          "Un environnement de travail sérieux ne se contente pas de compiler 'sans erreur'. Il configure aussi un standard explicite, des warnings stricts et des builds adaptées au moment du développement. Une build de debug favorise le diagnostic avec les symboles et éventuellement les sanitizers. Une build de release vise l'exécutable final avec des optimisations plus agressives.",
          "Les warnings sont particulièrement importants en C++ parce qu'ils signalent tôt des oublis ou des ambiguïtés qui compilent malgré tout : conversions douteuses, variables inutilisées, retours manquants, comparaisons suspectes. Les traiter tôt évite que le bruit ne devienne la norme du projet."
        ),
        code(
          "bash",
          `
g++ -std=c++20 -Wall -Wextra -pedantic -g src/main.cpp -o app_debug
g++ -std=c++20 -Wall -Wextra -pedantic -O2 src/main.cpp -o app_release
          `,
          "Deux intentions differentes de build"
        ),
        bullets([
          "Fixer le standard avec <code>-std=c++20</code> ou équivalent CMake rend le projet reproductible.",
          "<code>-g</code> sert au debug ; <code>-O2</code> ou <code>-O3</code> visent les performances.",
          "Un warning ignoré trop longtemps finit souvent par masquer un vrai bug le jour où il apparaît."
        ]),
        callout("success", "Réflexe d'ingénieur", "Traite les warnings comme des conversations précoces avec le compilateur, pas comme un décor optionnel.")
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
        ]),
        callout("info", "Important", "Le dossier <code>build/</code> doit rester un dossier généré. On ne mélange pas artefacts de compilation et code source dans les mêmes répertoires.")
      ),
      lesson(
        "Workflow concret avec CMake : configurer, construire, relancer",
        paragraphs(
          "Beaucoup d'étudiants voient CMake comme un simple fichier de configuration, alors qu'il structure en réalité toute la boucle de travail. On configure une fois le projet dans un dossier de build, puis on relance les compilations à partir de là. Cette séparation garde le dépôt source propre et rend les builds reproductibles.",
          "L'intérêt est aussi pédagogique : un outil unique porte les options du projet, les exécutables, les tests et les dépendances. On évite ainsi les commandes manuelles différentes selon les machines ou les oublis dans la ligne de build."
        ),
        code(
          "bash",
          `
cmake -S . -B build
cmake --build build
./build/app
          `,
          "Boucle CMake minimale"
        ),
        table(
          ["Commande", "Effet"],
          [
            ["<code>cmake -S . -B build</code>", "Configure le projet source dans un dossier de build séparé."],
            ["<code>cmake --build build</code>", "Compile les cibles configurées."],
            ["<code>ctest --test-dir build</code>", "Lance les tests déclarés dans la configuration si présents."],
            ["<code>./build/app</code>", "Exécute le binaire produit."]
          ]
        ),
        callout("success", "Boucle saine", "Configure peu souvent, compile souvent, garde la source propre et laisse CMake centraliser le projet.")
      ),
      videoLesson(
        "Si tu veux une vue d'ensemble plus orale avant d'entrer dans les détails du cours écrit, cette sélection de la playlist colle bien à ce chapitre d'ouverture.",
        [
          playlistVideo("broCodeIntro", "bonne vue d'ensemble si tu veux d'abord entendre tout le parcours C++ en version débutant"),
          playlistVideo("howCppWorks", "bonne porte d'entrée pour visualiser le rôle du compilateur, du linker et de la structure globale d'un programme"),
          playlistVideo("headerFiles", "utile pour faire le lien entre fichiers d'interface, unités de traduction et organisation multi-fichiers")
        ]
      )
    ].join(""),
    checklist: [
      "Je sais distinguer compilation et linkage.",
      "Je peux expliquer ce qu'est une unité de traduction et ce qu'un fichier objet représente.",
      "Je sais expliquer la différence entre bibliothèque statique et dynamique.",
      "Je compile avec un standard explicite, idéalement C++17 ou C++20.",
      "Je comprends l'intérêt des warnings stricts et d'une build de debug distincte d'une build de release.",
      "Je connais le rôle d'un header par rapport à un source.",
      "Je peux expliquer pourquoi un projet multi-fichiers est plus maintenable.",
      "Je sais lire un CMakeLists.txt minimal.",
      "Je sais décrire la boucle <code>cmake -S . -B build</code> puis <code>cmake --build build</code>."
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
        question: "Que produit directement le compilateur avant l'étape de linkage dans un projet multi-fichiers ?",
        options: [
          "Des fichiers objets intermédiaires",
          "Uniquement des headers enrichis",
          "Le binaire final complet"
        ],
        answer: 0,
        explanation: "Chaque source compilée séparément produit en général un fichier objet. Le linker assemble ensuite ces objets pour construire l'exécutable final."
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
      },
      {
        question: "Pourquoi séparer le dossier <code>build/</code> du code source est-il une bonne pratique ?",
        options: [
          "Pour éviter de mélanger les artefacts générés avec les fichiers du projet",
          "Parce que C++ interdit de compiler dans le dossier source",
          "Pour empêcher toute recompilation"
        ],
        answer: 0,
        explanation: "Cette séparation garde le dépôt plus lisible, facilite le nettoyage et rend la boucle de build plus reproductible."
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
      },
      {
        title: "Installer une vraie boucle de build",
        difficulty: "Intermédiaire",
        time: "25 min",
        prompt: "Prends un mini-projet très simple et mets en place une boucle complète avec dossier <code>build</code>, standard C++ explicite, warnings stricts et au moins deux configurations de compilation décrites : debug et release.",
        deliverables: [
          "le <code>CMakeLists.txt</code> ou les commandes de build correspondantes",
          "une explication de la différence entre debug et release",
          "un exemple concret de warning ou de diagnostic que cette configuration aide à repérer"
        ]
      }
    ],
    keywords: ["compilation", "linkage", "cmake", "g++", "header", "source", "projet", "warnings", "debug", "release", "unite de traduction", "fichier objet", "bibliotheque statique", "bibliotheque dynamique", "shared library", "static library"]
  })),
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
      focus: "Les unités de traduction expliquent pourquoi le C++ moderne reste très attentif aux frontières entre headers et sources. Ce n'est pas un simple style de rangement : c'est directement lié à la manière dont le compilateur voit et traite le projet.",
      retenir: [
        "Chaque fichier source compilé séparément forme une unité de traduction après expansion des includes.",
        "Un fichier objet est un résultat intermédiaire, pas encore un programme exécutable."
      ],
      pitfalls: [
        "Mettre des définitions non protégées dans un header inclus partout.",
        "Croire qu'un header 'existe une fois' pour tout le projet alors qu'il est réinjecté dans chaque unité qui l'inclut."
      ],
      method: [
        "Repère d'abord ce qui doit être déclaré partout et ce qui ne doit être défini qu'une fois.",
        "Place l'interface stable en header et l'implémentation en source.",
        "Relie ensuite chaque erreur de symbole à la frontière qui a été mal tenue."
      ],
      check: "Si une fonction est déclarée dans un header mais définie nulle part, à quel moment du build l'erreur devient-elle visible ?"
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
      focus: "Warnings, builds debug/release et CMake ne sont pas des détails d'outillage. Ils matérialisent une discipline de projet : rendre le build reproductible, les diagnostics précoces et le coût des erreurs plus faible dès le début du développement.",
      retenir: [
        "Un standard explicite et des warnings stricts stabilisent le comportement du projet.",
        "Une build de debug n'a pas la même finalité qu'une build de release."
      ],
      pitfalls: [
        "Laisser des warnings s'accumuler jusqu'à ne plus distinguer le signal du bruit.",
        "Mélanger les artefacts générés au milieu des sources et perdre la reproductibilité du build."
      ],
      method: [
        "Fixe un standard explicite et des warnings sévères dès le premier commit.",
        "Sépare clairement le dossier source du dossier build.",
        "Documente une boucle de travail simple que toute l'équipe peut relancer à l'identique."
      ],
      check: "Si un bug n'apparaît qu'en release ou seulement en debug, saurais-tu expliquer pourquoi les deux builds ont des objectifs différents ?"
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
