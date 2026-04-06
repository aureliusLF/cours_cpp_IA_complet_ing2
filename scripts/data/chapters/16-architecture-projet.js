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
  withChapterTheme,
  videoLesson,
  playlistVideo
} = registry.helpers;

registry.registerChapterBundle({
  order: 16,
  chapter: withChapterTheme("architecture-projet", () => ({
    id: "architecture-projet",
    shortTitle: "Architecture projet",
    title: "Méthodologie de projet C++ : architecture, debug et mini-projet final",
    level: "Projet",
    duration: "1 h 20",
    track: "Synthèse",
    summary:
      "Ce dernier chapitre rassemble les briques vues avant pour en faire une vraie démarche d'ingénieur : structurer, découper, tester, déboguer, prioriser et faire converger un mini-projet réaliste sans se perdre dans l'organisation.",
    goals: [
      "organiser un projet C++ en modules cohérents, avec des dépendances lisibles et des responsabilités stables",
      "installer des réflexes simples de debug et de vérification avant d'ajouter du code",
      "transformer le cours en feuille de route concrète pour un mini-projet, du MVP jusqu'à la finition"
    ],
    highlights: ["sanitizers", "tests", "modules", "debug", "backlog", "mini-projet"],
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
        "Dépendances propres : qui a le droit de connaître qui ?",
        paragraphs(
          "Une architecture lisible ne se juge pas seulement à son arborescence. Elle se juge aussi à la direction des dépendances. Le domaine métier devrait dépendre le moins possible de l'I/O, de l'affichage ou des détails de persistance. Plus les couches se connaissent mutuellement, plus chaque changement local se propage partout.",
          "Le bon test de maturité consiste à demander : si je change le mode d'entrée, l'algorithme métier doit-il bouger ? Si la réponse est oui trop souvent, le découpage reste trop couplé. L'objectif n'est pas de construire une architecture académique lourde, mais de garder des frontières utiles."
        ),
        table(
          ["Zone", "Responsabilité saine", "Ne devrait pas dépendre fortement de"],
          [
            ["Domaine métier", "Règles, invariants, calculs", "Console, fichiers, UI détaillée."],
            ["Infrastructure I/O", "Lecture/écriture, fichiers, adaptation terminal", "Détails internes des algorithmes métier."],
            ["Orchestration", "Relier les modules et piloter le scénario global", "Détails de stockage internes des objets."]
          ]
        ),
        callout("success", "Question très rentable", "Si une fonctionnalité change, combien de fichiers sans lien direct dois-tu toucher ? Plus la réponse est petite, plus l'architecture respire.")
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
        "Méthode de debug : reproduire, réduire, instrumenter, corriger",
        paragraphs(
          "Le débogage efficace est une méthode, pas un talent mystérieux. On commence par rendre le bug reproductible. On réduit ensuite le scénario jusqu'à un cas minimal. On instrumente ce cas avec logs, assertions, debugger ou sanitizers. Enfin seulement, on corrige la cause au lieu de bricoler le symptôme.",
          "Cette discipline évite deux pertes de temps fréquentes : corriger trop tôt sans comprendre, ou ajouter du code au hasard dans l'espoir que le problème disparaisse. Dans un projet étudiant, une méthode de debug claire vaut souvent autant qu'une heure de codage brut."
        ),
        table(
          ["Étape", "Question à se poser"],
          [
            ["Reproduire", "Quel scénario précis déclenche le bug ?"],
            ["Réduire", "Quel est le plus petit cas qui le reproduit encore ?"],
            ["Instrumenter", "Quel outil me donne un fait sûr : log, test, debugger, sanitizer ?"],
            ["Corriger", "Ai-je traité la cause racine plutôt qu'un effet visible ?"],
            ["Vérifier", "Quel test ou scénario empêchera la régression ?"]
          ]
        ),
        callout("warn", "Réflexe à éviter", "Si tu modifies plusieurs choses à la fois pendant le debug, tu perds vite la trace de ce qui a réellement corrigé le problème.")
      ),
      lesson(
        "Construire un mini-projet par incréments : MVP, backlog et critères de fini",
        paragraphs(
          "Un mini-projet sain ne se construit pas en visant immédiatement la version 'complète'. Il commence par un noyau minimal crédible : quelques cas d'usage forts, une arborescence simple, un build qui tourne et une première boucle de vérification. On ajoute ensuite des fonctionnalités par incréments courts.",
          "Cette approche réduit énormément le risque de s'éparpiller. Un backlog ordonné, même très simple, oblige à distinguer l'essentiel du confort. Le projet devient alors un enchaînement de livraisons visibles plutôt qu'un gros bloc abstrait toujours 'presque fini'."
        ),
        code(
          "text",
          `
MVP possible
1. le projet compile
2. une fonctionnalite coeur fonctionne
3. un fichier de test ou une verification automatique existe
4. les donnees principales ont une representation propre

Iteration suivante
5. meilleure gestion d'erreur
6. persistence fichier
7. affichage plus lisible
8. refactoring structurel
          `,
          "Le MVP est un point d'appui, pas une version honteuse"
        ),
        bullets([
          "Un backlog ordonné évite de traiter toutes les idées comme si elles avaient la même priorité.",
          "Le MVP doit déjà être propre, même s'il est petit.",
          "Chaque itération devrait laisser le projet dans un état compilable et vérifiable."
        ]),
        callout("info", "Très bon réflexe", "Terminer petit mais propre vaut mieux qu'accumuler beaucoup de fonctionnalités fragiles et non vérifiées.")
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
      ),
      lesson(
        "Quand le projet est-il vraiment 'fini' ?",
        paragraphs(
          "Dans beaucoup de projets étudiants, le mot 'fini' signifie seulement 'la démo fonctionne'. En ingénierie, cela devrait vouloir dire davantage : le projet compile proprement, les fonctionnalités prioritaires sont là, les erreurs importantes sont gérées, le découpage est lisible, et quelqu'un d'autre peut comprendre comment lancer le projet.",
          "Un petit README, une commande de build claire, deux ou trois tests utiles et quelques cas d'usage vérifiés changent beaucoup la qualité perçue d'un projet. La finition n'est pas du vernis ; elle fait partie du livrable."
        ),
        table(
          ["Critère de fin", "Question associée"],
          [
            ["Build clair", "Quelqu'un d'autre peut-il compiler le projet sans te demander quoi faire ?"],
            ["Fonctionnalités prioritaires", "Le MVP et les extensions promises sont-ils réellement présents ?"],
            ["Vérification", "Ai-je au moins quelques tests ou scénarios reproductibles ?"],
            ["Debuggabilité", "Les erreurs importantes laissent-elles un diagnostic exploitable ?"],
            ["Lisibilité", "Le découpage des fichiers et des modules raconte-t-il encore le projet ?"]
          ]
        ),
        callout("info", "Perspective d'ingénieur", "Un projet fini n'est pas seulement un projet qui marche chez son auteur, c'est un projet que quelqu'un d'autre peut relancer, lire et prolonger sans repartir de zéro.")
      )
    ].join(""),
    checklist: [
      "Je sais proposer une arborescence minimale cohérente.",
      "Je peux expliquer la direction saine des dépendances entre domaine, I/O et orchestration.",
      "J'active warnings et mode debug.",
      "Je connais l'intérêt des sanitizers.",
      "Je peux décrire une méthode de debug en étapes plutôt qu'une succession d'essais au hasard.",
      "Je sais découper un mini-projet en modules.",
      "Je peux construire un backlog simple et distinguer MVP, itérations utiles et finition.",
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
      },
      {
        question: "Quel est le bon premier objectif d'un mini-projet sain ?",
        options: [
          "Accumuler un maximum de fonctionnalités dès le premier jour",
          "Obtenir un MVP propre, compilable et vérifiable",
          "Créer le plus de sous-dossiers possible"
        ],
        answer: 1,
        explanation: "Un projet solide se construit par couches stables. Un MVP propre sert de base fiable pour les itérations suivantes."
      },
      {
        question: "Pourquoi séparer la logique métier de l'I/O est-il si rentable ?",
        options: [
          "Parce que cela réduit le couplage et facilite tests, maintenance et évolution",
          "Parce que le langage C++ l'impose formellement",
          "Parce que cela interdit tout bug mémoire"
        ],
        answer: 0,
        explanation: "Cette séparation permet de faire évoluer l'entrée, la sortie ou le stockage sans contaminer inutilement le cœur métier du projet."
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
      },
      {
        title: "Autopsie d'une architecture trop couplée",
        difficulty: "Projet",
        time: "35 min",
        prompt: "Prends un mini-projet volontairement mal rangé ou trop couplé, puis redessine son découpage : domaine, I/O, orchestration, tests. Le but est de montrer comment la structure réduit le coût d'évolution future.",
        deliverables: [
          "le diagnostic des dépendances ou responsabilités confuses",
          "une arborescence corrigée et justifiée",
          "deux exemples concrets de modifications futures rendues plus simples par ce nouveau découpage"
        ]
      }
    ],
    keywords: ["architecture", "debug", "sanitizer", "tests", "modules", "backlog", "mvp", "mini project", "cmake", "responsabilites", "dependances"]
  })),
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
      focus: "Les dépendances racontent la santé réelle du projet. Une arborescence propre ne suffit pas si tout dépend de tout. Le bon découpage garde le domaine relativement indépendant de l'I/O, de l'interface et des détails techniques qui changent plus souvent.",
      retenir: [
        "Le domaine métier devrait rester la partie la plus stable du projet.",
        "Moins un module connaît de détails qui ne le concernent pas, plus il reste facile à faire évoluer."
      ],
      pitfalls: [
        "Faire dépendre directement les objets métier de la console, du format de fichier ou du terminal.",
        "Laisser main.cpp contenir à la fois l'orchestration, les règles métier et les détails de parsing."
      ],
      method: [
        "Repère les responsabilités qui changent pour des raisons différentes.",
        "Sépare-les en modules ou services distincts.",
        "Vérifie ensuite que le sens global des dépendances reste simple à expliquer."
      ],
      check: "Si tu changes seulement le format d'entrée d'un projet, combien de modules sans rapport direct devraient vraiment être touchés ?"
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
      focus: "Le debug efficace suit une méthode stable : reproduire, réduire, instrumenter, corriger, vérifier. Cette discipline empêche de bricoler au hasard et transforme le débogage en enquête technique plutôt qu'en accumulation de suppositions.",
      retenir: [
        "Un bug non reproductible n'est pas encore un bug que l'on sait traiter.",
        "Le plus petit scénario qui reproduit le problème a une valeur énorme."
      ],
      pitfalls: [
        "Modifier plusieurs choses à la fois sans savoir laquelle change réellement le comportement.",
        "Corriger le symptôme visible sans comprendre la cause racine."
      ],
      method: [
        "Écris le scénario minimal qui reproduit le problème.",
        "Ajoute les observations les plus factuelles possible : logs, assertions, tests, debugger.",
        "Après correction, transforme cette reproduction en garde-fou contre la régression."
      ],
      check: "Quand tu débogues un comportement erratique, sais-tu construire un cas minimal reproductible avant de changer le code ?"
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
    },
    {
      focus: "Un mini-projet finit mieux quand il avance par incréments visibles. MVP, backlog priorisé, critères de fini et README de lancement évitent l'effet tunnel. On remplace une promesse vague de 'gros projet final' par une série de paliers maîtrisables.",
      retenir: [
        "Un MVP propre et compilable vaut plus qu'une liste de fonctionnalités inachevées.",
        "La finition comprend aussi le build, la vérification et l'explicitation de l'usage."
      ],
      pitfalls: [
        "Traiter toutes les idées de backlog comme également prioritaires.",
        "Déclarer le projet fini simplement parce que la démo fonctionne sur une machine."
      ],
      method: [
        "Définis d'abord le plus petit périmètre utile et démontrable.",
        "Ajoute ensuite des itérations courtes avec un ordre de priorité explicite.",
        "Termine par les éléments qui rendent le projet transmissible : build clair, tests, README, diagnostics."
      ],
      check: "Si tu devais livrer ton projet demain à un binôme, pourrait-il le compiler, le lancer et comprendre son périmètre sans te demander d'explication orale ?"
    }
  ]
});
})(window);
