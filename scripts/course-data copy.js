const sharedStrings = window.CourseAppStrings || {};

const escapeHtml = sharedStrings.escapeHtml || ((value) => String(value)
  .replace(/&/g, "&amp;")
  .replace(/</g, "&lt;")
  .replace(/>/g, "&gt;"));

const stripHtml = (value) => value.replace(/<[^>]+>/g, " ");

const normaliseForSearch = sharedStrings.normalise || ((value) => String(value)
  .normalize("NFD")
  .replace(/[\u0300-\u036f]/g, "")
  .toLowerCase());

const lesson = (title, ...parts) => {
  return `
  <article class="lesson-section">
    <h3>${title}</h3>
    ${parts.join("")}
  </article>
`;
};

const paragraphs = (...items) => {
  return items.map((item) => `<p>${item}</p>`).join("");
};

const bullets = (items) => `
  <ul class="bullet-list">
    ${items.map((item) => `<li>${item}</li>`).join("")}
  </ul>
`;

const checklist = (items) => `
  <ul class="check-list">
    ${items.map((item) => `<li>${item}</li>`).join("")}
  </ul>
`;

const callout = (tone, title, text) => `
  <div class="callout callout--${tone}">
    <span class="callout__label">${tone}</span>
    <h4 class="callout__title">${title}</h4>
    <p>${text}</p>
  </div>
`;

const code = (language, source, label = "Exemple") => {
  const rawLanguage = normaliseForSearch(language);
  const languageId = {
    "c++": "cpp",
    shell: "bash",
    sh: "bash",
    plaintext: "text"
  }[rawLanguage] || rawLanguage;

  return `
    <div class="code-block code-block--${languageId}">
      <div class="code-block__head">
        <span>${label}</span>
        <span>${language}</span>
      </div>
      <pre><code class="code-block__code language-${languageId}" data-language="${languageId}">${escapeHtml(source.trim())}</code></pre>
    </div>
  `;
};

const table = (headers, rows) => `
  <table class="data-table">
    <thead>
      <tr>${headers.map((item) => `<th>${item}</th>`).join("")}</tr>
    </thead>
    <tbody>
      ${rows.map((row) => `<tr>${row.map((cell) => `<td>${cell}</td>`).join("")}</tr>`).join("")}
    </tbody>
  </table>
`;

const chernoPlaylistUrl = "https://www.youtube.com/playlist?list=PLlrATfBNZ98dudnM48yfGUldqGD0S4FFb";
const revaninioPlaylistUrl = "https://www.youtube.com/playlist?list=PL0ibd6OZI4XKMwaPS1xHU9N_smy3AkcUr";

const externalLink = (href, label) => `
  <a href="${escapeHtml(href)}" target="_blank" rel="noopener noreferrer">${escapeHtml(label)}</a>
`;

const getYoutubeVideoId = (url) => {
  const value = String(url);
  const match = value.match(/(?:v=|\/live\/|\/embed\/|youtu\.be\/)([A-Za-z0-9_-]{11})/);
  return match ? match[1] : "";
};

const getYoutubeThumbnailUrl = (url) => {
  const videoId = getYoutubeVideoId(url);
  return videoId ? `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg` : "";
};

const playlistVideos = {
  howCppWorks: { title: "How C++ Works", url: "https://www.youtube.com/watch?v=SfGuIVzE_Os" },
  headerFiles: { title: "C++ Header Files", url: "https://www.youtube.com/watch?v=9RJTQmK0YPI" },
  variables: { title: "Variables in C++", url: "https://www.youtube.com/watch?v=zB9RI8_wExo" },
  functions: { title: "Functions in C++", url: "https://www.youtube.com/watch?v=V9zuox47zr0" },
  conditions: { title: "CONDITIONS and BRANCHES in C++", url: "https://www.youtube.com/watch?v=qEgCT87KOfc" },
  loops: { title: "Loops in C++", url: "https://www.youtube.com/watch?v=_1AwR-un4Hk" },
  enums: { title: "ENUMS in C++", url: "https://www.youtube.com/watch?v=x55jfOd5PEE" },
  constKeyword: { title: "CONST in C++", url: "https://www.youtube.com/watch?v=4fJBrditnJU" },
  pointers: { title: "POINTERS in C++", url: "https://www.youtube.com/watch?v=DTxHyVn0ODg" },
  references: { title: "REFERENCES in C++", url: "https://www.youtube.com/watch?v=IzoFn3dfsPA" },
  namespaces: { title: "Namespaces in C++", url: "https://www.youtube.com/watch?v=ts1Eek5w7ZA" },
  classes: { title: "CLASSES in C++", url: "https://www.youtube.com/watch?v=2BP8NhxjrO0" },
  classesVsStructs: { title: "CLASSES vs STRUCTS in C++", url: "https://www.youtube.com/watch?v=fLgTtaqqJp0" },
  writeClass: { title: "How to Write a C++ Class", url: "https://www.youtube.com/watch?v=3dHBFBw13E0" },
  constructors: { title: "Constructors in C++", url: "https://www.youtube.com/watch?v=FXhALMsHwEY" },
  destructors: { title: "Destructors in C++", url: "https://www.youtube.com/watch?v=D8cWquReFqw" },
  initializerLists: { title: "Member Initializer Lists in C++", url: "https://www.youtube.com/watch?v=1nfuYMXjZsA" },
  newKeyword: { title: "The NEW Keyword in C++", url: "https://www.youtube.com/watch?v=NUZdUSqsCs4" },
  objectLifetime: { title: "Object Lifetime in C++", url: "https://www.youtube.com/watch?v=iNuTwvD6ciI" },
  smartPointers: { title: "SMART POINTERS in C++", url: "https://www.youtube.com/watch?v=UOB7-B2MfwA" },
  arrowOperator: { title: "The Arrow Operator in C++", url: "https://www.youtube.com/watch?v=4p3grlSpWYA" },
  copyConstructors: { title: "Copying and Copy Constructors in C++", url: "https://www.youtube.com/watch?v=BvR1Pgzzr38" },
  moveSemantics: { title: "Move Semantics in C++", url: "https://www.youtube.com/watch?v=ehMg6zvXuMY" },
  inheritance: { title: "Inheritance in C++", url: "https://www.youtube.com/watch?v=X8nYM8wdNRE" },
  virtualFunctions: { title: "Virtual Functions in C++", url: "https://www.youtube.com/watch?v=oIV2KchSyGQ" },
  virtualDestructors: { title: "Virtual Destructors in C++", url: "https://www.youtube.com/watch?v=jELbKhGkEi0" },
  templates: { title: "Templates in C++", url: "https://www.youtube.com/watch?v=I-hZkUa9mIs" },
  vectorUsage: { title: "Optimizing the usage of std::vector in C++", url: "https://www.youtube.com/watch?v=HcESuwmlHEY" },
  autoKeyword: { title: "The \"auto\" keyword in C++", url: "https://www.youtube.com/watch?v=2vOPEuiGXVo" },
  lambdas: { title: "Lambdas in C++", url: "https://www.youtube.com/watch?v=mWgmBBz0y8c" },
  structuredBindings: { title: "STRUCTURED BINDINGS in C++", url: "https://www.youtube.com/watch?v=eUsTO5BO3WI" }
  ,
  revaninioVariables: { title: "Cours/Tuto C++ #3 : Les Variables", url: "https://www.youtube.com/watch?v=bERTWQrc75Q" },
  revaninioPointers: { title: "Cours/Tuto C++ #14 : Les Pointeurs", url: "https://www.youtube.com/watch?v=lmDfhGZ-dnk" },
  revaninioClasses: { title: "Cours/Tuto C++ #25 : Les Classes", url: "https://www.youtube.com/watch?v=y3w0r-ucIic" },
  revaninioConstructors: { title: "Cours/Tuto C++ #26 : Les Constructeurs", url: "https://www.youtube.com/watch?v=M1yCt4uXG0s" }
};

const playlistVideo = (key, note) => ({
  ...playlistVideos[key],
  note,
  thumbnailUrl: getYoutubeThumbnailUrl(playlistVideos[key].url)
});

const videoCards = (items) => `
  <div class="video-grid">
    ${items.map((item) => `
      <a class="video-card" href="${escapeHtml(item.url)}" target="_blank" rel="noopener noreferrer">
        <span class="video-card__media">
          <img
            class="video-card__thumb"
            src="${escapeHtml(item.thumbnailUrl)}"
            alt="${escapeHtml(`Miniature de la video ${item.title}`)}"
            loading="lazy"
            decoding="async"
          />
          <span class="video-card__badge">Video</span>
          <span class="video-card__play" aria-hidden="true"></span>
        </span>
        <span class="video-card__body">
          <span class="video-card__title">${escapeHtml(item.title)}</span>
          ${item.note ? `<span class="video-card__note">${item.note}</span>` : ""}
          <span class="video-card__cta">Ouvrir sur YouTube</span>
        </span>
      </a>
    `).join("")}
  </div>
`;

const videoLesson = (intro, items) => lesson(
  "Vidéos associées",
  paragraphs(
    `${intro} Tu peux aussi parcourir ${externalLink(chernoPlaylistUrl, "la playlist complète de The Cherno")} ou ${externalLink(revaninioPlaylistUrl, "la playlist francophone de RevaninioComputing")} si tu veux varier le style d'explication.`,
    "Le plus rentable est souvent de lire d'abord le chapitre, puis de regarder une ou deux vidéos ciblées pour fixer le modèle mental, le vocabulaire et les pièges."
  ),
  videoCards(items)
);

const lessonDeepDive = ({ focus, retenir = [], pitfalls = [], method = [], check = "" }) => `
  <div class="lesson-deep-dive">
    <p class="lesson-deep-dive__intro">${focus}</p>
    <div class="lesson-deep-dive__grid">
      ${retenir.length ? `
        <section class="lesson-deep-dive__panel">
          <h4>À retenir</h4>
          <ul>
            ${retenir.map((item) => `<li>${item}</li>`).join("")}
          </ul>
        </section>
      ` : ""}
      ${pitfalls.length ? `
        <section class="lesson-deep-dive__panel">
          <h4>Pièges fréquents</h4>
          <ul>
            ${pitfalls.map((item) => `<li>${item}</li>`).join("")}
          </ul>
        </section>
      ` : ""}
      ${method.length ? `
        <section class="lesson-deep-dive__panel lesson-deep-dive__panel--wide">
          <h4>Méthode de travail</h4>
          <ol>
            ${method.map((item) => `<li>${item}</li>`).join("")}
          </ol>
        </section>
      ` : ""}
    </div>
    ${check ? `<p class="lesson-deep-dive__check"><strong>Question de vérification :</strong> ${check}</p>` : ""}
  </div>
`;

const injectLessonDeepDives = (body, expansions) => {
  let index = 0;

  return body.replace(/<\/article>/g, (closingTag) => {
    const expansion = expansions[index];
    index += 1;
    return expansion ? `${lessonDeepDive(expansion)}${closingTag}` : closingTag;
  });
};

const courseMeta = {
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
};

const roadmap = [
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
];

const rawChapters = [
  {
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
  {
    id: "fondamentaux-syntaxe",
    shortTitle: "Syntaxe de base",
    title: "Fondamentaux du langage : syntaxe, types, entrées/sorties et contrôle",
    level: "Fondations",
    duration: "55 min",
    track: "SE1",
    summary:
      "Ce chapitre repart de zéro et ne suppose aucun bagage en C. L'objectif n'est pas de mémoriser une syntaxe isolée, mais de comprendre comment un programme C++ lit des données, prend des décisions et produit un résultat de façon lisible et sûre.",
    goals: [
      "expliquer le rôle de <code>#include</code>, <code>main</code>, des blocs et du point-virgule dans un programme minimal",
      "choisir un type simple adapté, initialiser proprement avec <code>{}</code> et distinguer <code>const</code>, <code>constexpr</code> et <code>enum class</code>",
      "écrire une interaction console simple avec <code>std::cin</code>, <code>std::cout</code>, une condition et une boucle lisible"
    ],
    highlights: ["main()", "std::string", "{}", "if/for/while", "enum class"],
    body: [
      lesson(
        "Modèle mental : un programme lit, décide puis agit",
        paragraphs(
          "Lis d'abord un programme C++ comme une petite chaîne d'actions. On rend disponibles quelques outils avec <code>#include</code>, on entre dans <code>main</code>, puis les instructions s'exécutent dans l'ordre. Chaque bloc entre accolades délimite une zone de travail, et chaque point-virgule ferme une instruction simple.",
          "Tu n'as pas besoin de connaître les habitudes du C pour démarrer. En C++ moderne, on manipule très tôt <code>std::string</code>, l'initialisation avec accolades et des structures de contrôle lisibles. Le bon réflexe n'est pas 'faire comme en C', mais 'écrire une intention claire et sûre'."
        ),
        table(
          ["Élément", "Question à se poser"],
          [
            ["<code>#include</code>", "De quels outils ai-je besoin dans ce fichier ?"],
            ["<code>int main()</code>", "Que fait mon programme quand il démarre ?"],
            ["<code>{ ... }</code>", "Quel est le bloc de code concerné ?"],
            ["<code>;</code>", "Où se termine cette instruction ?"],
            ["<code>std::cout</code>", "Quelle information veux-je afficher ?"]
          ]
        ),
        callout("info", "Modèle de lecture", "Quand tu te sens perdu, relis le programme avec cette phrase simple : je déclare des données, je lis des entrées, je décide, puis j'affiche un résultat.")
      ),
      lesson(
        "Exemple minimal : lire une donnée, calculer un état, afficher un résultat",
        paragraphs(
          "Commence par un exemple très court avant d'apprendre les variantes. Ici, le programme lit un prénom et une moyenne, calcule si le semestre est validé, puis affiche un message. Cet exemple contient déjà l'essentiel : types, initialisation, saisie, comparaison et affichage.",
          "Observe surtout le choix des types. <code>std::string</code> représente du texte, <code>double</code> une moyenne réelle, <code>bool</code> une décision oui/non. Le type doit raconter la nature de la donnée, pas seulement permettre au code de compiler."
        ),
        code(
          "cpp",
          `
#include <iostream>
#include <string>

int main() {
    std::string prenom{};
    double moyenne{};

    std::cout << "Prenom : ";
    std::cin >> prenom;
    std::cout << "Moyenne : ";
    std::cin >> moyenne;

    bool semestreValide{moyenne >= 10.0};

    if (semestreValide) {
        std::cout << prenom << " valide le semestre.\n";
    } else {
        std::cout << prenom << " doit retravailler.\n";
    }

    return 0;
}
          `,
          "Premier programme complet utile"
        ),
        table(
          ["Type", "Quand l'utiliser ici"],
          [
            ["<code>std::string</code>", "Pour un nom, un message, un texte saisi."],
            ["<code>double</code>", "Pour une moyenne ou une mesure réelle."],
            ["<code>bool</code>", "Pour stocker le résultat d'une condition."],
            ["<code>int</code>", "Pour un compteur, un âge, une quantité entière."]
          ]
        ),
        callout("success", "Réflexe à garder", "Commence toujours par l'exemple le plus simple qui marche. Ensuite seulement, ajoute des variantes comme des boucles, des états supplémentaires ou des fonctions.")
      ),
      lesson(
        "Piège classique : confusion de syntaxe et bugs silencieux",
        paragraphs(
          "Les débutants se trompent souvent non pas sur l'idée métier, mais sur un détail de syntaxe qui change complètement le sens du programme. Les trois pièges les plus fréquents ici sont : confondre <code>=</code> et <code>==</code>, laisser une variable vivre trop longtemps, et accepter une conversion qui fait perdre de l'information.",
          "L'initialisation avec accolades aide justement à éviter certaines conversions dangereuses. Elle force le compilateur à refuser des cas ambigus comme le passage silencieux d'un <code>double</code> vers un <code>int</code>."
        ),
        code(
          "cpp",
          `
double note{9.5};

if (note = 10.0) {          // bug : on modifie note au lieu de comparer
    std::cout << "valide\n";
}

// int nbEtudiants{32.8};   // refusé : conversion réductrice

for (int tentative{0}; tentative < 3; ++tentative) {
    std::cout << "Essai " << tentative + 1 << '\n';
}
          `,
          "Trois détails de syntaxe, trois conséquences très différentes"
        ),
        bullets([
          "Utilise <code>==</code> pour comparer, <code>=</code> pour affecter.",
          "Déclare une variable dans la plus petite portée possible.",
          "Préfère <code>{}</code> si tu veux que le compilateur t'aide contre les conversions risquées."
        ]),
        callout("warn", "Piège classique", "Le bug <code>if (note = 10.0)</code> ne casse pas la compilation, mais il casse la logique du programme. Ce type d'erreur est typique d'un code lu trop vite.")
      ),
      lesson(
        "Vérification active : ce qu'il faut savoir expliquer à l'oral",
        paragraphs(
          "À ce stade, tu dois pouvoir raconter le chapitre à voix haute sans réciter du code. L'enjeu n'est pas de lister des mots-clés, mais d'expliquer ce que tu choisis et pourquoi tu le choisis.",
          "Un bon test oral consiste à prendre un mini-problème et à justifier chaque décision : type choisi, structure de contrôle, usage ou non d'une constante, et manière de représenter un état."
        ),
        table(
          ["Question", "Réponse attendue"],
          [
            ["Déclaration vs initialisation vs affectation ?", "Déclarer crée la variable, initialiser lui donne une première valeur, affecter remplace une valeur existante."],
            ["Pourquoi <code>std::string</code> plutôt qu'un tableau de <code>char</code> ?", "Parce que c'est l'outil standard, sûr et lisible pour le texte courant."],
            ["Quand choisir <code>if</code>, <code>for</code> ou <code>while</code> ?", "<code>if</code> pour décider, <code>for</code> pour un parcours borné, <code>while</code> pour répéter jusqu'à une condition d'arrêt."],
            ["Pourquoi <code>enum class</code> ?", "Pour nommer explicitement des états métier sans collision de noms."]
          ]
        ),
        code(
          "cpp",
          `
enum class EtatSemestre {
    Valide,
    ARattraper
};

EtatSemestre etat{EtatSemestre::Valide};
          `,
          "Nommer un état métier plutôt que bricoler un entier magique"
        ),
        callout("info", "Ce qu'il faut savoir expliquer à l'oral", "Je sais dire pourquoi j'ai choisi tel type, telle condition ou telle boucle, et je peux reformuler le rôle de <code>const</code> ou <code>enum class</code> sans me cacher derrière la syntaxe.")
      ),
      lesson(
        "Pont vers la suite : derrière chaque variable, il y a une adresse",
        paragraphs(
          "Jusqu'ici, tu as manipulé des valeurs par leur nom. Mais ces valeurs vivent quelque part en mémoire. Le prochain cap consiste à comprendre qu'une variable a aussi une adresse, et qu'un pointeur sert précisément à manipuler cette adresse.",
          "Cette idée semble technique, mais elle deviendra vite concrète : passage d'arguments, tableaux, allocation dynamique, structures de données et ownership reposent tous sur cette question de localisation mémoire."
        ),
        code(
          "cpp",
          `
int note{12};
int* adresseNote{&note};

        std::cout << note << '\n';         // 12
std::cout << *adresseNote << '\n'; // 12 : même donnée, autre chemin d'accès
          `,
          "Même valeur, mais lue à travers son adresse"
        ),
        callout("success", "Pont vers le chapitre suivant", "Si une variable a une adresse, on peut la transmettre autrement que par une simple copie. C'est précisément l'entrée vers les pointeurs, puis vers les références et la conception de signatures propres.")
      ),
      videoLesson(
        "Pour revoir les bases sous un angle plus visuel, ces vidéos de la playlist reprennent presque exactement les briques de ce chapitre.",
        [
          playlistVideo("variables", "reprend le rôle des types simples et de l'initialisation"),
          playlistVideo("revaninioVariables", "version francophone, plus lente et très accessible pour revoir les bases"),
          playlistVideo("functions", "complète bien la lecture de <code>main</code> et la logique d'appel"),
          playlistVideo("conditions", "très utile pour ancrer les tests et branches"),
          playlistVideo("loops", "bon renfort sur <code>for</code> et <code>while</code>"),
          playlistVideo("enums", "prolonge directement la partie <code>enum class</code>"),
          playlistVideo("constKeyword", "utile pour consolider le sens de <code>const</code> très tôt")
        ]
      )
    ].join(""),
    checklist: [
      "Je peux expliquer à quoi sert <code>main</code> et dans quel ordre les instructions d'un programme simple s'exécutent.",
      "Je peux choisir entre <code>int</code>, <code>double</code>, <code>bool</code> et <code>std::string</code> sur un exemple concret.",
      "Je peux justifier l'usage de l'initialisation avec accolades et repérer une conversion réductrice.",
      "Je peux écrire une saisie console simple puis afficher un résultat lisible avec <code>std::cout</code>.",
      "Je peux expliquer la différence entre déclaration, initialisation et affectation.",
      "Je peux repérer le bug <code>=</code> vs <code>==</code> dans une condition.",
      "Je peux choisir entre <code>if</code>, <code>for</code> et <code>while</code> selon la forme du problème.",
      "Je peux défendre l'usage de <code>const</code> ou d'<code>enum class</code> pour clarifier l'intention métier."
    ],
    quiz: [
      {
        question: "Dans ce programme, quel est le rôle principal de <code>int main()</code> ?",
        options: [
          "Décrire le type de toutes les variables du fichier",
          "Définir le point d'entrée exécuté au démarrage du programme",
          "Activer automatiquement les bibliothèques standard utilisées"
        ],
        answer: 1,
        explanation: "Un programme peut contenir beaucoup de fonctions, mais l'exécution commence par <code>main</code>. C'est donc là que tu dois chercher le fil d'action principal."
      },
      {
        question: "Que t'apporte surtout l'initialisation avec accolades dans <code>int nb{3.7};</code> ?",
        options: [
          "Elle transforme automatiquement le <code>double</code> en <code>std::string</code>",
          "Elle signale une conversion qui ferait perdre de l'information",
          "Elle empêche toute réaffectation future de la variable"
        ],
        answer: 1,
        explanation: "Les accolades servent ici de garde-fou pédagogique. Elles t'évitent de faire rentrer silencieusement une valeur réelle dans un entier tronqué."
      },
      {
        question: "Quel bug logique se cache dans ce code ? <code>if (note = 10.0)</code>",
        options: [
          "Aucun : on compare bien <code>note</code> à <code>10.0</code>",
          "On affecte <code>10.0</code> à <code>note</code> au lieu de tester une égalité",
          "Le problème est seulement stylistique, pas sémantique"
        ],
        answer: 1,
        explanation: "C'est un bug classique parce que le code ressemble visuellement à une comparaison. Ici, l'opérateur d'affectation modifie la variable et fausse complètement la condition."
      },
      {
        question: "Tu dois afficher trois tentatives numérotées de 1 à 3. Quelle structure est la plus naturelle ?",
        options: [
          "<code>if</code>, car il s'agit d'une décision",
          "<code>for</code>, car le nombre de répétitions est connu dès le départ",
          "<code>while</code>, car toute répétition doit être écrite en <code>while</code>"
        ],
        answer: 1,
        explanation: "Quand le nombre d'itérations est borné et connu, <code>for</code> exprime l'intention plus directement. Le choix de la structure doit suivre la forme du problème."
      },
      {
        question: "Pourquoi <code>enum class</code> est-il souvent préférable à un entier magique pour représenter un état ?",
        options: [
          "Parce qu'il consomme toujours moins de mémoire qu'un <code>int</code>",
          "Parce qu'il nomme explicitement les états autorisés et évite les collisions de noms",
          "Parce qu'il remplace automatiquement toutes les conditions du programme"
        ],
        answer: 1,
        explanation: "Un entier comme <code>2</code> ne raconte rien. Un <code>enum class</code> explicite les états métier et aide à relire le code sans deviner ce que signifie une valeur brute."
      }
    ],
    exercises: [
      {
        title: "Fiche identité console",
        difficulty: "Facile",
        time: "15 min",
        prompt: "Écris un programme console qui lit un prénom, un âge, un groupe et une moyenne, puis affiche un résumé sur plusieurs lignes avec un message différent selon que le semestre est validé ou non. Challenge utile : représenter l'état final avec un <code>enum class</code> plutôt qu'un entier.",
        deliverables: [
          "des variables correctement typées et initialisées avec <code>{}</code>",
          "un affichage final lisible qui reprend toutes les données saisies et le verdict métier",
          "une condition <code>if / else</code> sans confusion entre <code>=</code> et <code>==</code>"
        ]
      },
      {
        title: "Audit des conversions",
        difficulty: "Intermédiaire",
        time: "20 min",
        prompt: "Pars d'un petit programme volontairement bancal contenant des <code>int</code>, <code>double</code>, booléens et texte. Repère les conversions implicites, décide lesquelles doivent être refusées, lesquelles peuvent rester, et réécris le code en justifiant chaque correction.",
        deliverables: [
          "une liste des conversions observées avec le risque associé",
          "une version corrigée qui utilise les accolades quand elles apportent une sécurité utile",
          "une justification courte de chaque correction, centrée sur le bug évité"
        ]
      }
    ],
    keywords: ["syntaxe", "main", "cout", "cin", "types", "string", "initialisation", "const", "constexpr", "enum class", "conditions", "boucles", "if", "for", "while", "scope"]
  },
  {
    id: "pointeurs-memoire",
    shortTitle: "Pointeurs et mémoire",
    title: "Pointeurs, adresses mémoire et allocation dynamique",
    level: "Fondations",
    duration: "50 min",
    track: "SE1",
    summary:
      "Ce chapitre transforme une idée abstraite en image concrète : une variable vit à une adresse, et un pointeur est simplement une variable qui stocke cette adresse. Une fois ce modèle compris, les bugs mémoire deviennent plus lisibles et les limites des pointeurs bruts aussi.",
    goals: [
      "expliquer le rôle de <code>&amp;</code>, <code>*</code> et <code>nullptr</code> sans confondre adresse et valeur",
      "lire un parcours simple avec arithmétique de pointeurs et relier un tableau à son premier élément",
      "distinguer les formes <code>const T*</code>, <code>T* const</code> et reconnaître les pièges mémoire les plus coûteux"
    ],
    highlights: ["&", "*", "nullptr", "delete[]", "dangling pointer"],
    body: [
      lesson(
        "Modèle mental : une variable a une valeur, mais aussi une adresse",
        paragraphs(
          "Imagine la mémoire comme une grande rangée de cases numérotées. Une variable occupe une ou plusieurs cases, et son adresse est l'endroit où elle commence. Un pointeur n'est donc pas 'une magie du C++' : c'est juste une variable dont le contenu est une adresse.",
          "Deux opérateurs se partagent le travail. <code>&amp;</code> donne l'adresse d'une variable existante. <code>*</code>, lui, sert soit à déclarer un pointeur, soit à suivre l'adresse pour retrouver la valeur pointée. Le vrai enjeu du chapitre est de savoir à quel moment tu manipules une adresse, et à quel moment tu manipules la donnée située derrière."
        ),
        code(
          "cpp",
          `
int note{12};
int* p{&note};   // p contient l'adresse de note

std::cout << p << '\\n';   // affiche une adresse
std::cout << *p << '\\n';  // affiche 12

*p = 15;                   // modifie note à travers le pointeur
std::cout << note << '\\n'; // affiche 15
          `,
          "Adresse, pointeur et déréférencement"
        ),
        table(
          ["Opérateur", "Contexte", "Signification"],
          [
            ["<code>&amp;x</code>", "Expression", "Adresse de la variable <code>x</code>."],
            ["<code>int* p</code>", "Déclaration", "<code>p</code> est un pointeur vers un <code>int</code>."],
            ["<code>*p</code>", "Expression", "Valeur stockée à l'adresse contenue dans <code>p</code>."]
          ]
        ),
        callout("info", "Image utile", "Une variable classique te donne directement la valeur. Un pointeur te donne d'abord une adresse, puis il faut la suivre avec <code>*</code> pour retrouver la valeur.")
      ),
      lesson(
        "Exemple minimal avant les variantes : tableau, parcours et <code>nullptr</code>",
        paragraphs(
          "Avant de parler des cas avancés, retiens un exemple canonique : un tableau est une zone contiguë, et son nom se comporte comme un pointeur vers le premier élément. L'arithmétique des pointeurs ne compte donc pas en octets visibles pour toi, mais en éléments du type pointé.",
          "C'est pour cela que <code>p + 1</code> veut dire 'élément suivant du même type'. Cette idée rend la notation <code>arr[i]</code> équivalente à <code>*(arr + i)</code>. En parallèle, un pointeur peut aussi ne viser aucune donnée valide : on le note alors <code>nullptr</code>."
        ),
        code(
          "cpp",
          `
int notes[]{10, 12, 15};
int* courant{notes};           // pointe vers notes[0]

std::cout << *courant << '\\n';   // 10
std::cout << *(courant + 2) << '\\n'; // 15

int* rien{nullptr};
if (rien == nullptr) {
    std::cout << "aucune cible\n";
}
          `,
          "Arithmétique sur pointeur"
        ),
        bullets([
          "Incrémenter un <code>int*</code> avance d'un <code>int</code>, pas d'un octet isolé.",
          "<code>arr[i]</code> et <code>*(arr + i)</code> désignent le même élément.",
          "<code>nullptr</code> représente explicitement l'absence de cible valide.",
          "L'arithmétique n'est correcte qu'à l'intérieur du même tableau."
        ]),
        callout("success", "Ce qu'il faut retenir d'abord", "Tant que tu sais lire <code>&amp;</code>, <code>*</code>, <code>nullptr</code> et <code>*(p + i)</code>, tu possèdes déjà le noyau du chapitre.")
      ),
      lesson(
        "Piège classique : un pointeur peut survivre à sa cible",
        paragraphs(
          "Le bug le plus dangereux n'est pas d'écrire une mauvaise déclaration, mais de garder une adresse alors que la donnée pointée n'existe plus. On obtient alors un <em>dangling pointer</em> : le programme compile, mais l'adresse ne désigne plus une ressource vivante.",
          "Ce problème apparaît typiquement quand on retourne l'adresse d'une variable locale, quand on utilise un pointeur après <code>delete</code>, ou quand on mélange <code>new[]</code> et <code>delete</code>. Le point commun est toujours le même : l'adresse existe encore, la cible non."
        ),
        code(
          "cpp",
          `
int* fabriquerMauvaisPointeur() {
    int local{42};
    return &local;  // bug : local disparaît à la fin de la fonction
}

int* notes = new int[3]{10, 12, 15};
delete[] notes;
// std::cout << notes[0] << '\n'; // bug : pointeur suspendu
          `,
          "Deux manières courantes de fabriquer un pointeur suspendu"
        ),
        callout("warn", "Piège classique", "Un pointeur 'a l'air non nul' même quand sa cible a déjà disparu. Ce n'est donc pas sa forme qui compte, mais l'état réel de la ressource qu'il prétend viser.")
      ),
      lesson(
        "Vérification active : ce qu'il faut savoir expliquer à l'oral",
        paragraphs(
          "Tu dois maintenant pouvoir expliquer à l'oral la différence entre une valeur et son adresse, mais aussi lire une déclaration sans te tromper de niveau. Le bon test consiste à commenter une ligne de code mot à mot.",
          "C'est aussi le moment de clarifier les différentes places de <code>const</code>. Lire de droite à gauche aide beaucoup : ce qui est à gauche de <code>*</code> protège la valeur pointée ; ce qui est à droite protège l'adresse elle-même."
        ),
        table(
          ["Déclaration", "Comment la lire"],
          [
            ["<code>const int* p</code>", "Pointeur vers <code>int</code> en lecture seule."],
            ["<code>int* const p</code>", "Pointeur fixe vers un <code>int</code> modifiable."],
            ["<code>const int* const p</code>", "Ni la cible ni l'adresse ne doivent changer."],
            ["<code>Point* pt</code>", "Adresse d'un objet <code>Point</code>, accessible ensuite via <code>pt-&gt;x</code>."]
          ]
        ),
        code(
          "cpp",
          `
struct Point { double x; double y; };

Point pt{3.0, 4.0};
Point* ptr{&pt};
std::cout << ptr->x << '\n'; // équivalent à (*ptr).x
          `,
          "L'opérateur flèche combine déréférencement et accès membre"
        ),
        callout("info", "Ce qu'il faut savoir expliquer à l'oral", "Je peux dire ce que contient un pointeur, ce que fait un déréférencement, pourquoi <code>nullptr</code> est utile, et pourquoi un pointeur suspendu est dangereux même si le programme compile.")
      ),
      lesson(
        "Pont vers la suite : toutes les adresses ne se manipulent pas de la même façon",
        paragraphs(
          "Le prochain cap est de comprendre qu'on ne transmet pas toujours une donnée de la même manière à une fonction. Parfois on copie, parfois on modifie un objet existant, parfois on accepte l'absence avec un pointeur, parfois on préfère une référence.",
          "Autrement dit, les pointeurs ne servent pas seulement à 'faire de la mémoire'. Ils servent aussi à exprimer une relation entre deux morceaux de code. C'est exactement ce que le chapitre suivant formalise avec les signatures de fonctions."
        ),
        code(
          "cpp",
          `
void afficherNote(const int* note) {
    if (note != nullptr) {
        std::cout << *note << '\n';
    }
}
          `,
          "Un pointeur peut aussi exprimer qu'une donnée est optionnelle"
        ),
        callout("success", "Pont vers le chapitre suivant", "Une fois les adresses comprises, la vraie question devient : que veut exprimer ma signature ? Lecture seule, modification, copie ou absence possible ?")
      ),
      videoLesson(
        "Ces vidéos sont les plus directement alignées avec la partie mémoire bas niveau de ce chapitre.",
        [
          playlistVideo("pointers", "très bonne explication du modèle adresse -> pointeur -> déréférencement"),
          playlistVideo("revaninioPointers", "alternative francophone très orientée intuition mémoire"),
          playlistVideo("newKeyword", "utile pour la transition vers l'allocation dynamique et ses responsabilités"),
          playlistVideo("arrowOperator", "parfait pour relier pointeurs d'objet et accès membre"),
          playlistVideo("objectLifetime", "renforce l'intuition sur la durée de vie et les pointeurs suspendus")
        ]
      )
    ].join(""),
    checklist: [
      "Je peux expliquer la différence entre la valeur d'une variable et son adresse mémoire.",
      "Je peux lire correctement <code>&amp;x</code>, <code>int* p</code> et <code>*p</code> dans leur contexte respectif.",
      "Je peux justifier l'usage de <code>nullptr</code> pour représenter une absence de cible.",
      "Je peux expliquer pourquoi <code>*(p + i)</code> et <code>arr[i]</code> parlent du même élément d'un tableau.",
      "Je peux diagnostiquer un pointeur suspendu causé par une variable locale détruite ou par un <code>delete</code> déjà effectué.",
      "Je peux lire les combinaisons essentielles de <code>const</code> avec un pointeur.",
      "Je peux expliquer pourquoi les pointeurs bruts propriétaires sont fragiles en C++ moderne."
    ],
    quiz: [
      {
        question: "Dans ce code, que vaut <code>note</code> après l'instruction <code>*p = 15;</code> ?<br><code>int note{12}; int* p{&note};</code>",
        options: [
          "<code>note</code> vaut toujours 12, car seul le pointeur change",
          "<code>note</code> vaut 15, car le déréférencement écrit dans la variable ciblée",
          "Le programme ne compile pas, car on ne peut pas écrire via un pointeur"
        ],
        answer: 1,
        explanation: "Le pointeur contient l'adresse de <code>note</code>. Écrire dans <code>*p</code>, c'est donc écrire directement dans <code>note</code> à travers cette adresse."
      },
      {
        question: "Quel est le vrai problème dans cette fonction ?<br><code>int* fabrique() { int local{42}; return &local; }</code>",
        options: [
          "Elle retourne un pointeur vers une variable qui n'existe plus après la fin de la fonction",
          "Elle devrait retourner un <code>double*</code>",
          "Le mot-clé <code>return</code> est interdit avec les pointeurs"
        ],
        answer: 0,
        explanation: "Le compilateur peut accepter la syntaxe, mais la logique est fausse. Dès que la fonction se termine, <code>local</code> disparaît et l'adresse retournée devient invalide."
      },
      {
        question: "Si <code>p</code> pointe sur le premier élément de <code>int notes[]{10, 12, 15};</code>, que vaut <code>*(p + 2)</code> ?",
        options: ["12", "15", "L'adresse de <code>notes[2]</code>"],
        answer: 1,
        explanation: "<code>p + 2</code> atteint le troisième élément du tableau. Le déréférencement lit ensuite la valeur qui s'y trouve, ici 15."
      },
      {
        question: "Quelle déclaration exprime un pointeur dont <strong>l'adresse</strong> ne peut pas être modifiée mais dont la <strong>valeur pointée</strong> peut l'être ?",
        options: [
          "<code>const int* p</code>",
          "<code>int* const p</code>",
          "<code>const int* const p</code>"
        ],
        answer: 1,
        explanation: "La lecture de droite à gauche aide ici beaucoup. Le <code>const</code> attaché au pointeur fige l'adresse, mais la valeur pointée reste modifiable."
      },
      {
        question: "Pourquoi <code>delete[]</code> est-il requis après <code>new int[5]</code> ?",
        options: [
          "Parce qu'il s'agit d'une convention purement visuelle",
          "Parce qu'il faut libérer un bloc de tableau, pas un objet simple isolé",
          "Parce que <code>delete[]</code> est obligatoire uniquement sur les tableaux de <code>std::string</code>"
        ],
        answer: 1,
        explanation: "La syntaxe de libération doit correspondre à la syntaxe d'allocation. Mélanger les deux formes introduit un comportement indéfini, donc un bug potentiellement silencieux."
      }
    ],
    exercises: [
      {
        title: "Exploration d'adresses",
        difficulty: "Facile",
        time: "15 min",
        prompt: "Déclare trois variables de types différents, affiche leur valeur puis leur adresse avec <code>&amp;</code>, crée pour chacune un pointeur adapté et modifie les valeurs via déréférencement. Termine par une phrase d'analyse sur ce que tu observes.",
        deliverables: [
          "un affichage des valeurs avant et après modification via pointeurs",
          "les adresses des variables avec une courte interprétation de ce qu'elles représentent",
          "une conclusion expliquant la différence entre valeur, adresse et déréférencement"
        ]
      },
      {
        title: "Parcours de tableau par arithmétique de pointeurs",
        difficulty: "Intermédiaire",
        time: "20 min",
        prompt: "Écris une fonction qui reçoit un pointeur vers le début d'un tableau et un pointeur vers la fin, puis calcule la somme et le maximum sans utiliser la notation <code>[]</code>. Vérifie le résultat sur un petit tableau de test dont tu connais déjà la réponse.",
        deliverables: [
          "une fonction correcte sur le cas de test fourni dans ton <code>main</code>",
          "une démonstration qui montre explicitement le début, la fin et l'arrêt de la boucle",
          "une courte comparaison avec une solution équivalente en <code>std::vector</code>"
        ]
      },
      {
        title: "Gestion manuelle avec new/delete puis refactoring",
        difficulty: "Intermédiaire",
        time: "25 min",
        prompt: "Implémente une petite pile d'entiers avec allocation dynamique manuelle (<code>new[]</code> / <code>delete[]</code>) puis réécris exactement le même comportement avec <code>std::vector</code>. Le but n'est pas d'aimer ou non les pointeurs, mais de voir quels risques disparaissent quand la bibliothèque gère la mémoire à ta place.",
        deliverables: [
          "une première version fonctionnelle qui n'oublie ni l'allocation ni la libération",
          "une seconde version en <code>std::vector</code> avec le même comportement observable",
          "une liste argumentée des bugs potentiels éliminés par la refactorisation"
        ]
      }
    ],
    keywords: ["pointeur", "adresse", "dereferencement", "nullptr", "new", "delete", "delete[]", "arithmetique pointeur", "tableau", "const pointeur", "fleche", "dangling pointer", "fuite memoire"]
  },
  {
    id: "fonctions-references",
    shortTitle: "Fonctions et références",
    title: "Fonctions, surcharge, références et espaces de noms",
    level: "Fondations",
    duration: "35 min",
    track: "SE1",
    summary:
      "Une grande partie de la qualité d'un code C++ se joue dans ses signatures. Ce chapitre apprend à exprimer clairement copie, lecture, modification et absence possible, sans supposer de pratique préalable des pointeurs du C.",
    goals: [
      "choisir entre passage par valeur, <code>const T&amp;</code>, <code>T&amp;</code> et <code>T*</code> en fonction de l'intention",
      "utiliser surcharge et paramètres par défaut sans fabriquer d'ambiguïté inutile",
      "organiser une petite API avec namespace, header propre et signatures lisibles"
    ],
    highlights: ["const&", "T&", "namespace", "header", "API"],
    body: [
      lesson(
        "Modèle mental : une signature est un contrat",
        paragraphs(
          "Une signature de fonction doit répondre à trois questions : est-ce que je copie la donnée, est-ce que je la lis sans la copier, est-ce que je peux la modifier ? Tant que ces trois questions restent floues, l'API reste coûteuse à relire et facile à mal utiliser.",
          "Si tu n'as jamais fait de C, retiens ce réflexe : en C++ moderne, la référence est souvent la meilleure porte d'entrée pour exprimer un lien avec un objet existant. Le pointeur n'est pas interdit, mais il doit raconter quelque chose de plus, comme une absence possible ou une relation non obligatoire."
        ),
        table(
          ["Signature", "Intention"],
          [
            ["<code>void f(int x)</code>", "Copie locale : bon choix pour les petits types simples."],
            ["<code>void f(const std::string& s)</code>", "Lecture seule sans copie coûteuse."],
            ["<code>void f(Point& p)</code>", "Modification explicite de l'objet reçu."],
            ["<code>void f(Node* n)</code>", "Adresse éventuellement absente ou API bas niveau."]
          ]
        ),
        callout("info", "Question directrice", "Quand tu écris une signature, ne commence pas par la syntaxe. Commence par la phrase métier : je lis, je modifie, je copie ou j'accepte qu'il n'y ait rien.")
      ),
      lesson(
        "Exemple minimal : même donnée, contrats différents",
        paragraphs(
          "Observe maintenant un petit ensemble de fonctions qui racontent des intentions différentes sans changer de domaine. Le but n'est pas de collectionner des syntaxes, mais de voir qu'un choix de paramètre change ce que l'appelant a le droit d'attendre.",
          "Sur des objets lourds comme <code>std::string</code> ou <code>std::vector</code>, ce choix a aussi un effet sur les performances : copier inutilement un gros objet juste pour le lire est souvent un mauvais signal de conception."
        ),
        code(
          "cpp",
          `
double moyenne(const std::vector<double>& notes);
void normaliser(std::vector<double>& notes);
void afficherTitre(std::string titre);
void afficherNoteOptionnelle(const int* note);
          `,
          "Quatre signatures, quatre contrats"
        ),
        bullets([
          "<code>const T&amp;</code> évite une copie tout en promettant la lecture seule.",
          "<code>T&amp;</code> signale une modification voulue sur l'objet existant.",
          "<code>T</code> copie : utile si l'on veut une donnée locale indépendante.",
          "<code>T*</code> peut exprimer qu'il n'y a peut-être pas d'objet à traiter."
        ]),
        callout("success", "Exemple minimal avant les variantes", "Si tu hésites, choisis d'abord entre <code>T</code>, <code>const T&amp;</code> et <code>T&amp;</code>. Le pointeur vient ensuite quand l'absence ou l'adresse doivent être explicites.")
      ),
      lesson(
        "Piège classique : une bonne idée métier peut cacher un mauvais contrat",
        paragraphs(
          "Le bug pédagogique classique ici consiste à promettre plus que ce qu'on peut réellement garantir. Par exemple, retourner une référence vers une variable locale semble élégant, mais la référence visera un objet déjà détruit à la sortie de la fonction.",
          "Un autre piège fréquent est de rendre l'API inutilement opaque avec trop de surcharges ou avec des choix globaux imposés dans un header. Un header doit rester discret, sinon chaque fichier qui l'inclut subit ses décisions."
        ),
        code(
          "cpp",
          `
const std::string& fabriquerNom() {
    std::string nom{"Ines"};
    return nom;  // bug : la référence vise un objet déjà détruit
}
          `,
          "Référence vers un objet local : le bug compile, mais le contrat est faux"
        ),
        code(
          "cpp",
          `
// Mauvaise idée dans un header
using namespace std;
          `,
          "Un header ne doit pas polluer tous les fichiers qui l'incluent"
        )
      ),
      lesson(
        "Vérification active : ce qu'il faut savoir expliquer à l'oral",
        paragraphs(
          "À l'oral, tu dois être capable de justifier une signature sans lire le compilateur dans ta tête. La bonne stratégie consiste à partir de l'intention métier puis à expliquer la forme choisie.",
          "C'est aussi le bon moment pour clarifier la surcharge et les paramètres par défaut. Les deux outils sont utiles s'ils raccourcissent le code appelant sans brouiller la lecture. S'ils créent un doute sur la fonction réellement appelée, ils ont raté leur but."
        ),
        table(
          ["Question", "Réponse attendue"],
          [
            ["Pourquoi <code>const T&amp;</code> ?", "Pour lire un objet potentiellement coûteux sans le copier ni le modifier."],
            ["Quand choisir <code>T&amp;</code> ?", "Quand la fonction doit modifier l'objet reçu."],
            ["Quand un pointeur est-il plus juste qu'une référence ?", "Quand l'absence de cible ou la manipulation explicite d'adresse fait partie du contrat."],
            ["Quand éviter une surcharge ?", "Quand il devient difficile de savoir quelle variante sera appelée ou ce que l'API veut vraiment dire."]
          ]
        ),
        code(
          "cpp",
          `
void tracer(const Point& p);
void tracer(const Segment& s);
void exporter(const Rapport& rapport, bool verbose = false);
          `,
          "Deux usages utiles, tant qu'ils restent lisibles"
        ),
        callout("info", "Ce qu'il faut savoir expliquer à l'oral", "Je peux dire pourquoi une fonction prend une valeur, une référence ou un pointeur, et je peux justifier si une surcharge ou un paramètre par défaut rend réellement l'API plus claire.")
      ),
      lesson(
        "Pont vers la suite : une bonne signature prépare une bonne classe",
        paragraphs(
          "Les <code>namespace</code> servent à regrouper des fonctions et types d'un même domaine sans collision de noms. Dans un petit projet, ils remplacent avantageusement les préfixes bricolés et rendent les headers plus propres.",
          "Cette discipline prépare directement le chapitre suivant. Dès qu'un ensemble de fonctions tourne autour du même invariant métier, il devient souvent plus juste de regrouper état et comportements dans une classe bien encapsulée."
        ),
        code(
          "cpp",
          `
#pragma once
#include <string>

namespace finance {

class Compte {
public:
    explicit Compte(std::string titulaire);
    void crediter(double montant);

private:
    std::string titulaire_;
    double solde_{0.0};
};

} // namespace finance
          `,
          "Header propre"
        ),
        callout("success", "Pont vers le chapitre suivant", "Quand les signatures commencent à défendre un état métier et non plus seulement des valeurs isolées, tu es prêt à passer aux classes, à l'encapsulation et aux invariants.")
      ),
      videoLesson(
        "Si tu veux entendre plusieurs fois la logique des signatures, de la référence et des fichiers d'interface, cette sélection complète bien la lecture du chapitre.",
        [
          playlistVideo("functions", "repose les bases du contrat d'appel et des paramètres"),
          playlistVideo("references", "vidéo très utile pour distinguer clairement référence, copie et adresse"),
          playlistVideo("namespaces", "prolonge naturellement la partie organisation d'API"),
          playlistVideo("headerFiles", "renforce la partie header propre et séparation interface / implémentation")
        ]
      )
    ].join(""),
    checklist: [
      "Je peux justifier quand passer un paramètre par valeur plutôt que par référence.",
      "Je peux expliquer la différence de contrat entre <code>const T&amp;</code>, <code>T&amp;</code> et <code>T*</code>.",
      "Je peux repérer une référence dangereuse vers un objet local détruit.",
      "Je peux expliquer pourquoi <code>using namespace std;</code> n'a pas sa place dans un header.",
      "Je peux dire quand une surcharge améliore l'API et quand elle la rend ambiguë.",
      "Je peux décrire le rôle d'un namespace et la différence entre header et source."
    ],
    quiz: [
      {
        question: "Quel paramètre exprime le mieux une lecture sans copie d'un objet potentiellement coûteux ?",
        options: ["<code>T</code>", "<code>const T&</code>", "<code>T*</code>"],
        answer: 1,
        explanation: "La référence constante est un excellent compromis pour les gros objets lus seulement. Elle évite la copie et raconte clairement l'intention de lecture."
      },
      {
        question: "Quel est le bug principal dans cette fonction ?<br><code>const std::string& f() { std::string nom{\"Ines\"}; return nom; }</code>",
        options: [
          "La chaîne devrait être un <code>char*</code>",
          "La fonction retourne une référence vers un objet local détruit en fin de fonction",
          "Une référence constante ne peut jamais être retournée"
        ],
        answer: 1,
        explanation: "Le problème n'est pas la syntaxe, mais la durée de vie. La référence paraît pratique, mais elle pointe ici vers un objet qui n'existe plus après le retour."
      },
      {
        question: "Pourquoi éviter <code>using namespace std;</code> dans un header ?",
        options: [
          "Parce que c'est interdit par la norme",
          "Parce que le header polluerait tous les fichiers qui l'incluent",
          "Parce que <code>std</code> ne fonctionne qu'en C"
        ],
        answer: 1,
        explanation: "Un header est réutilisé partout. S'il injecte des noms globaux, il impose ses choix à tout le projet et augmente les risques de collisions."
      },
      {
        question: "Quand un pointeur en paramètre est-il plus juste qu'une référence ?",
        options: [
          "Quand on veut exprimer qu'il peut ne pas y avoir d'objet à traiter",
          "Quand on veut simplement éviter d'écrire le symbole <code>&amp;</code>",
          "Toujours, car les pointeurs sont plus 'bas niveau' donc meilleurs"
        ],
        answer: 0,
        explanation: "La référence suppose une cible existante. Le pointeur devient intéressant quand l'absence fait partie du contrat ou quand l'adresse elle-même doit être manipulée."
      },
      {
        question: "Quel usage de la surcharge reste sain ?",
        options: [
          "Garder le même nom pour deux opérations proches dont l'intention reste évidente à la lecture",
          "Créer le plus de variantes possible pour éviter de nommer précisément les fonctions",
          "Utiliser une surcharge pour masquer un contrat flou"
        ],
        answer: 0,
        explanation: "Une surcharge est utile quand elle simplifie le code appelant sans créer de doute. Si le lecteur doit deviner quelle variante sera choisie, il vaut mieux renommer."
      }
    ],
    exercises: [
      {
        title: "Nettoyer une API",
        difficulty: "Intermédiaire",
        time: "25 min",
        prompt: "Prends une petite API existante et relis chaque signature avec trois questions : est-ce que ça copie, est-ce que ça lit, est-ce que ça modifie ? Réécris ensuite les fonctions pour que ce contrat soit visible dans les types utilisés.",
        deliverables: [
          "les signatures initiales annotées avec le contrat implicite qu'elles exprimaient mal",
          "une version réécrite avec des choix justifiés entre valeur, <code>const T&amp;</code>, <code>T&amp;</code> et <code>T*</code>",
          "une justification courte ligne par ligne, centrée sur l'intention métier"
        ]
      },
      {
        title: "Mini bibliothèque de géométrie",
        difficulty: "Intermédiaire",
        time: "30 min",
        prompt: "Crée un namespace <code>geometrie</code> avec deux types simples, un header, un source et au moins trois fonctions libres bien signées. L'une doit lire sans copier, l'une doit modifier un objet existant et l'une peut utiliser un paramètre optionnel.",
        deliverables: [
          "un header propre sans <code>using namespace std;</code>",
          "un <code>main.cpp</code> qui démontre les trois contrats différents",
          "une justification écrite de chaque signature importante"
        ]
      }
    ],
    keywords: ["fonctions", "surcharge", "reference", "const ref", "namespace", "header", "signature", "contrat", "api"]
  },
  {
    id: "classes-encapsulation",
    shortTitle: "Classes et encapsulation",
    title: "Classes, encapsulation et conception d'interface",
    level: "Intermédiaire",
    duration: "40 min",
    track: "SE2",
    summary:
      "Une classe utile ne sert pas à ranger des variables sous le même toit. Elle protège un invariant métier et expose seulement ce qu'il faut pour travailler avec l'objet sans pouvoir le casser.",
    goals: [
      "concevoir une classe à partir d'un invariant métier plutôt qu'à partir d'une liste de champs",
      "séparer l'interface publique, l'état privé et les choix d'implémentation",
      "utiliser <code>const</code>, les accesseurs et <code>this</code> uniquement quand ils clarifient réellement le contrat"
    ],
    highlights: ["private", "invariant", "const", "this", "API"],
    body: [
      lesson(
        "Modèle mental : une classe défend une règle de cohérence",
        paragraphs(
          "L'encapsulation sert à protéger ce qui doit toujours rester vrai. Cette propriété s'appelle un invariant. Une <code>Fraction</code> ne devrait jamais avoir un dénominateur nul, un <code>Compte</code> peut interdire certains découverts, un <code>Rectangle</code> doit garder des dimensions cohérentes.",
          "Si tous les champs sont publics, n'importe quel appelant peut briser cette cohérence sans passer par les règles de la classe. Une bonne classe agit donc comme une frontière : elle accepte certaines opérations, en refuse d'autres et garantit un état valide."
        ),
        table(
          ["Question de conception", "Ce qu'une bonne classe doit répondre"],
          [
            ["Qu'est-ce qui doit toujours rester vrai ?", "L'invariant de l'objet."],
            ["Qui peut modifier cet état ?", "Seulement les opérations autorisées par la classe."],
            ["Que doit connaître l'utilisateur ?", "L'interface publique, pas les détails internes."]
          ]
        ),
        callout("info", "Point de départ sain", "Commence par écrire la phrase 'un objet valide doit toujours respecter...' avant d'écrire ses champs. Tu obtiens souvent une meilleure API.")
      ),
      lesson(
        "Exemple minimal : une classe simple qui raconte un invariant",
        paragraphs(
          "Voici un exemple volontairement court. La classe n'expose pas ses champs et concentre les opérations utiles. Même si le code réel peut être plus riche, ce squelette montre déjà la bonne direction : état privé, contrat explicite, méthodes en lecture marquées <code>const</code>.",
          "Le but n'est pas de multiplier les getters et setters, mais d'offrir des verbes métier qui gardent l'objet valide."
        ),
        code(
          "cpp",
          `
class Fraction {
public:
    Fraction(int numerateur, int denominateur);
    double valeur() const;
    void multiplierPar(int facteur);

private:
    int numerateur_;
    int denominateur_;
};
          `,
          "Un minimum d'API, un maximum d'intention"
        ),
        bullets([
          "Le dénominateur ne devrait jamais devenir nul après construction.",
          "<code>valeur()</code> ne modifie pas l'objet : le <code>const</code> le rend visible.",
          "Un verbe métier comme <code>multiplierPar</code> raconte mieux l'intention qu'un simple setter générique."
        ]),
        callout("success", "Exemple minimal avant les variantes", "Même une petite classe gagne à séparer ce qu'elle promet publiquement de la manière dont elle stocke réellement ses données.")
      ),
      lesson(
        "Piège classique : une API trop bavarde casse l'invariant au lieu de le défendre",
        paragraphs(
          "Le faux bon réflexe consiste à rendre les champs publics ou à générer mécaniquement des getters et setters pour tout. On croit alors 'faire de l'objet', mais on retire justement à la classe sa capacité à protéger l'état.",
          "Si n'importe qui peut écrire n'importe quelle valeur à tout moment, la classe n'est plus un contrat : c'est juste une structure de données déguisée."
        ),
        code(
          "cpp",
          `
struct FractionPublique {
    int numerateur;
    int denominateur;
};

FractionPublique f{1, 2};
f.denominateur = 0; // invariant cassé hors du contrôle de la classe
          `,
          "Le bug n'est pas dans une méthode, mais dans l'absence de frontière"
        ),
        callout("warn", "Piège classique", "Une classe avec des setters partout semble flexible, mais elle disperse les règles métier chez les appelants. Plus l'invariant est important, moins tu dois laisser l'état être modifié librement.")
      ),
      lesson(
        "Vérification active : ce qu'il faut savoir expliquer à l'oral",
        paragraphs(
          "À l'oral, tu dois pouvoir expliquer pourquoi un attribut est privé, pourquoi une méthode est marquée <code>const</code> et pourquoi telle opération mérite un nom métier plutôt qu'un simple accesseur automatique.",
          "Le pointeur implicite <code>this</code> sert à désigner l'objet courant. Il est surtout utile quand tu veux lever une ambiguïté de nom ou retourner l'objet lui-même pour chaîner des appels."
        ),
        table(
          ["Question", "Réponse attendue"],
          [
            ["Pourquoi mettre les données en <code>private</code> ?", "Pour empêcher des modifications qui casseraient l'invariant."],
            ["Pourquoi une méthode <code>const</code> ?", "Pour promettre une lecture sans modification de l'état logique."],
            ["Pourquoi éviter des getters/setters automatiques ?", "Parce qu'ils exposent souvent l'état sans vraie valeur métier."],
            ["Quand utiliser <code>this</code> ?", "Quand cela clarifie le code, par exemple pour retourner <code>*this</code>."]
          ]
        ),
        code(
          "cpp",
          `
class Compteur {
public:
    Compteur& incrementer() {
        ++valeur_;
        return *this;
    }

private:
    int valeur_{0};
};
          `,
          "Retourner *this"
        ),
        callout("info", "Ce qu'il faut savoir expliquer à l'oral", "Je peux dire quel invariant la classe protège, quelles méthodes lisent, quelles méthodes modifient, et pourquoi l'interface publique est plus petite que l'état interne.")
      ),
      lesson(
        "Pont vers la suite : quand une classe possède une ressource, sa durée de vie devient centrale",
        paragraphs(
          "Dès qu'une classe possède autre chose que de simples valeurs triviales, son cycle de vie devient un sujet de conception. Fichier, socket, buffer, mutex ou mémoire dynamique ne se gèrent pas comme un <code>int</code> : il faut réfléchir à l'acquisition et à la libération de la ressource.",
          "C'est ce qui mène naturellement au chapitre suivant. Une classe n'est pas seulement une frontière de données ; elle peut aussi devenir la gardienne d'une ressource grâce aux constructeurs, destructeurs et au principe RAII."
        ),
        code(
          "cpp",
          `
class Journal {
public:
    explicit Journal(const std::string& chemin);
    void ecrire(const std::string& message);

private:
    std::ofstream flux_;
};
          `,
          "Une classe peut protéger un invariant et posséder une ressource"
        ),
        callout("success", "Pont vers le chapitre suivant", "Après l'encapsulation, la question n'est plus seulement 'quelles données protéger ?', mais aussi 'comment garantir qu'une ressource est acquise et libérée au bon moment ?'")
      ),
      videoLesson(
        "Cette courte sélection aide bien à passer de l'idée de structure de données à celle de vraie classe métier.",
        [
          playlistVideo("classes", "pose les bases de la syntaxe et de la frontière publique / privée"),
          playlistVideo("revaninioClasses", "version francophone si tu préfères une introduction POO plus progressive"),
          playlistVideo("classesVsStructs", "utile pour clarifier ce que l'encapsulation change vraiment"),
          playlistVideo("writeClass", "fait le lien entre invariant, méthodes et interface")
        ]
      )
    ].join(""),
    checklist: [
      "Je peux formuler l'invariant principal d'une classe avant d'écrire ses méthodes.",
      "Je peux expliquer pourquoi des attributs privés protègent mieux l'objet que des champs publics.",
      "Je peux justifier l'usage d'une méthode <code>const</code> sur une API de lecture.",
      "Je peux distinguer une vraie opération métier d'un getter ou setter mécanique.",
      "Je peux expliquer le rôle de <code>this</code> sans le présenter comme une fin en soi.",
      "Je peux relire une classe et dire si son interface publique est plus grosse qu'elle ne devrait l'être."
    ],
    quiz: [
      {
        question: "Quel est le principal intérêt de rendre les attributs privés ?",
        options: [
          "Réduire la taille mémoire de l'objet",
          "Protéger l'invariant et contrôler les modifications",
          "Accélérer automatiquement les appels"
        ],
        answer: 1,
        explanation: "Le vrai gain n'est pas une optimisation technique, mais une garantie de cohérence. La classe peut filtrer les opérations autorisées au lieu de subir des écritures arbitraires."
      },
      {
        question: "Que signifie une méthode marquée <code>const</code> ?",
        options: [
          "Elle est compilée une seule fois",
          "Elle ne modifie pas l'état logique de l'objet",
          "Elle doit être appelée depuis <code>main</code>"
        ],
        answer: 1,
        explanation: "Le <code>const</code> fait partie du contrat public de la méthode. Il aide à distinguer lecture et écriture, ce qui améliore à la fois la sûreté et la lisibilité."
      },
      {
        question: "Quel problème révèle ce design ?<br><code>struct Fraction { int numerateur; int denominateur; };</code>",
        options: [
          "Aucun, car une structure publique est toujours préférable à une classe",
          "L'invariant peut être cassé librement depuis l'extérieur",
          "Le type ne pourra jamais être instancié"
        ],
        answer: 1,
        explanation: "Le risque n'est pas dans la syntaxe <code>struct</code> elle-même, mais dans l'absence de frontière. Un appelant peut rendre la fraction invalide sans passer par une règle métier."
      },
      {
        question: "Pourquoi une méthode peut-elle retourner <code>*this</code> ?",
        options: [
          "Pour retourner l'objet courant et permettre un chaînage d'appels",
          "Pour forcer la copie complète de l'objet",
          "Parce que <code>this</code> désigne toujours un objet global"
        ],
        answer: 0,
        explanation: "Retourner <code>*this</code> renvoie une référence sur l'objet courant. C'est utile pour chaîner des opérations tout en gardant une API lisible."
      }
    ],
    exercises: [
      {
        title: "Fraction robuste",
        difficulty: "Intermédiaire",
        time: "30 min",
        prompt: "Conçois une classe <code>Fraction</code> qui interdit un dénominateur nul, expose une API courte et lisible, et permet au moins l'affichage, la conversion en valeur réelle et une opération métier simple. Le but est d'écrire une classe qu'on peut utiliser sans avoir besoin de connaître ses champs internes.",
        deliverables: [
          "l'invariant formulé explicitement en une phrase",
          "un header et un source avec au moins une méthode <code>const</code>",
          "un petit programme de démonstration qui montre qu'on ne peut pas casser l'objet par l'extérieur"
        ]
      },
      {
        title: "Réviser une classe bavarde",
        difficulty: "Intermédiaire",
        time: "25 min",
        prompt: "Prends une classe volontairement bavarde, pleine de getters et setters, puis redessine une API plus métier. Supprime ce qui n'apporte pas de valeur, renomme les opérations restantes avec de vrais verbes, et explique ce que l'invariant gagne au passage.",
        deliverables: [
          "la version initiale annotée avec les points d'exposition inutiles",
          "la version révisée avec une interface publique plus petite",
          "une explication de ce que la simplification protège ou clarifie"
        ]
      }
    ],
    keywords: ["classe", "encapsulation", "const", "this", "invariant", "interface", "private", "api", "design"]
  },
  {
    id: "constructeurs-raii",
    shortTitle: "Cycle de vie et RAII",
    title: "Constructeurs, destructeurs et pensée RAII",
    level: "Intermédiaire",
    duration: "45 min",
    track: "SE2",
    summary:
      "Le vrai pouvoir du C++ apparaît quand on cesse de voir un objet comme un simple paquet de valeurs. Un objet peut aussi posséder une ressource et la libérer automatiquement quand sa durée de vie se termine : c'est tout l'esprit de RAII.",
    goals: [
      "expliquer ce qu'un constructeur garantit et ce qu'un destructeur nettoie réellement",
      "utiliser la liste d'initialisation quand elle correspond au vrai moment de construction des membres",
      "raisonner sur une ressource à partir de la durée de vie de l'objet qui la possède"
    ],
    highlights: ["constructeur", "destructeur", "liste d'initialisation", "RAII", "scope"],
    body: [
      lesson(
        "Modèle mental : un objet doit être valide dès sa construction",
        paragraphs(
          "Un constructeur ne sert pas seulement à remplir des champs. Il doit créer un objet déjà valide, prêt à être utilisé sans étape cachée supplémentaire. De la même façon, un destructeur ne sert pas à 'faire propre' au hasard : il libère ce que l'objet possède réellement.",
          "Le bon réflexe est donc temporel : qui acquiert la ressource, à quel moment, et quand cette responsabilité s'arrête-t-elle ? Dès que tu raisonnes comme cela, RAII devient une conséquence naturelle du design."
        ),
        table(
          ["Élément", "Rôle"],
          [
            ["Constructeur", "Créer immédiatement un objet valide."],
            ["Liste d'initialisation", "Construire les membres au bon moment, sans phase artificielle."],
            ["Destructeur", "Libérer les ressources possédées quand l'objet meurt."]
          ]
        ),
        callout("info", "Réflexe RAII", "Quand une ressource existe, cherche quel objet doit en être le gardien. Si la durée de vie du gardien est claire, la libération devient beaucoup plus fiable.")
      ),
      lesson(
        "Exemple minimal : la liste d'initialisation raconte le vrai cycle de construction",
        paragraphs(
          "Les membres d'un objet sont construits avant l'exécution du corps du constructeur. La liste d'initialisation colle donc au vrai déroulé de la construction. Elle évite de faire croire qu'un membre est 'd'abord vide puis rempli' alors qu'il a déjà été construit.",
          "Cette forme devient indispensable pour les références, les membres <code>const</code> et plusieurs types non assignables. Mais même quand elle n'est pas strictement obligatoire, elle raconte souvent mieux l'intention."
        ),
        code(
          "cpp",
          `
class Session {
public:
    Session(std::string utilisateur, int id)
        : utilisateur_{std::move(utilisateur)}, id_{id} {}

private:
    std::string utilisateur_;
    const int id_;
};
          `,
          "Liste d'initialisation"
        ),
        callout("success", "Exemple minimal avant les variantes", "Ici, l'objet est complet dès la fin de la construction. Il n'a pas besoin d'une méthode <code>init()</code> séparée pour devenir 'vraiment prêt'.")
      ),
      lesson(
        "Piège classique : gestion manuelle fragile dès qu'un chemin de sortie change",
        paragraphs(
          "Le bug typique de ce chapitre apparaît quand on acquiert une ressource manuellement puis qu'on oublie de la libérer sur un des chemins de sortie. Un <code>return</code> anticipé, une erreur ou une exception suffisent alors à transformer un code apparemment correct en fuite ou en état incohérent.",
          "RAII existe précisément pour éviter d'avoir à mémoriser tous ces chemins. La ressource doit être attachée à un objet dont la destruction automatique fera le nettoyage, même si l'exécution quitte le bloc plus tôt que prévu."
        ),
        code(
          "cpp",
          `
FILE* fichier = std::fopen("notes.txt", "r");
if (!fichier) {
    return;
}

if (!verifierEntete(fichier)) {
    return; // fuite si on oublie std::fclose(fichier)
}

std::fclose(fichier);
          `,
          "La logique métier semble correcte, la gestion de ressource non"
        ),
        callout("warn", "Piège classique", "Plus une ressource est gérée manuellement, plus le code dépend d'une discipline fragile. Le moindre nouveau chemin de sortie peut créer un oubli de nettoyage.")
      ),
      lesson(
        "Vérification active : ce qu'il faut savoir expliquer à l'oral",
        paragraphs(
          "Pour vérifier que l'idée est comprise, essaie d'expliquer RAII sans utiliser l'acronyme. Si tu peux dire 'une ressource est confiée à un objet qui la nettoie automatiquement quand il meurt', alors tu tiens l'essentiel.",
          "Tu dois aussi pouvoir justifier quand la liste d'initialisation est naturelle, et pourquoi un destructeur ne doit nettoyer que ce que l'objet possède réellement."
        ),
        table(
          ["Question", "Réponse attendue"],
          [
            ["Pourquoi la liste d'initialisation ?", "Parce que les membres sont construits avant le corps du constructeur."],
            ["Que garantit un constructeur réussi ?", "Un objet directement valide et utilisable."],
            ["Pourquoi RAII aide en cas de <code>return</code> anticipé ou d'exception ?", "Parce que la destruction à la sortie du scope reste automatique."],
            ["Que doit nettoyer un destructeur ?", "Uniquement les ressources réellement possédées par l'objet."]
          ]
        ),
        callout("info", "Ce qu'il faut savoir expliquer à l'oral", "Je peux raconter le cycle complet : construction, période de validité, sortie de portée et nettoyage automatique de la ressource.")
      ),
      lesson(
        "Pont vers la suite : RAII conduit naturellement à l'ownership explicite",
        paragraphs(
          "RAII fonctionne aussi pour la mémoire dynamique, mais écrire soi-même des couples <code>new</code> / <code>delete</code> reste fragile. Le pas suivant consiste donc à confier cette possession à des types standards qui encapsulent déjà ce cycle de vie.",
          "Autrement dit, une fois RAII compris, la question suivante devient : comment exprimer proprement la possession exclusive, la copropriété ou la simple observation d'une ressource ?"
        ),
        code(
          "cpp",
          `
class FichierLecture {
public:
    explicit FichierLecture(const std::string& chemin)
        : flux_{chemin} {
        if (!flux_) {
            throw std::runtime_error("impossible d'ouvrir le fichier");
        }
    }

    std::ifstream& flux() { return flux_; }

private:
    std::ifstream flux_;
};
          `,
          "Une ressource acquise à la construction, libérée à la destruction"
        ),
        callout("success", "Pont vers le chapitre suivant", "Le chapitre suivant prolonge exactement cette logique avec <code>std::vector</code>, <code>std::unique_ptr</code>, <code>std::shared_ptr</code> et <code>std::weak_ptr</code>.")
      ),
      videoLesson(
        "Pour fixer RAII et le cycle de vie d'un objet, ces vidéos sont les plus pertinentes de la playlist.",
        [
          playlistVideo("constructors", "repose bien ce qu'un constructeur garantit vraiment"),
          playlistVideo("revaninioConstructors", "alternative francophone centrée sur l'instanciation pas à pas"),
          playlistVideo("destructors", "utile pour comprendre le nettoyage et la fin de vie"),
          playlistVideo("initializerLists", "complète directement la partie liste d'initialisation"),
          playlistVideo("objectLifetime", "renforce l'intuition temporelle derrière RAII")
        ]
      )
    ].join(""),
    checklist: [
      "Je peux expliquer ce qu'un constructeur réussi garantit sur l'état de l'objet.",
      "Je peux dire pourquoi la liste d'initialisation correspond au vrai moment de construction des membres.",
      "Je peux repérer une ressource gérée manuellement de façon fragile dans un code avec plusieurs sorties possibles.",
      "Je peux expliquer RAII sans me limiter à l'acronyme.",
      "Je peux justifier ce qu'un destructeur doit nettoyer et ce qu'il ne doit pas faire.",
      "Je peux relier RAII à la notion plus large d'ownership."
    ],
    quiz: [
      {
        question: "Pourquoi la liste d'initialisation est-elle souvent préférable ?",
        options: [
          "Parce qu'elle est plus courte uniquement",
          "Parce qu'elle correspond au vrai moment d'initialisation des membres",
          "Parce qu'elle évite d'avoir un destructeur"
        ],
        answer: 1,
        explanation: "Le gain n'est pas cosmétique. La liste d'initialisation suit le vrai cycle de construction des membres au lieu de simuler une seconde phase d'affectation dans le corps du constructeur."
      },
      {
        question: "Quel énoncé décrit le mieux RAII ?",
        options: [
          "Une ressource est associée à un objet qui la gère sur toute sa durée de vie",
          "Toute ressource doit être globale",
          "Le destructeur doit afficher des logs à chaque fois"
        ],
        answer: 0,
        explanation: "RAII ne parle pas de style ou de logs. Il parle d'un lien fort entre ressource et objet gardien, afin que le nettoyage soit automatique à la fin de la portée."
      },
      {
        question: "Quel bug se cache dans ce pseudo-code ?<br><code>FILE* f = fopen(...); if (!verifier()) return;</code>",
        options: [
          "Aucun : le système fermera toujours immédiatement le fichier",
          "Un chemin de sortie oublie la libération de la ressource",
          "Le problème vient uniquement de l'extension du fichier"
        ],
        answer: 1,
        explanation: "La logique métier peut sembler correcte, mais la ressource n'est pas protégée par une durée de vie d'objet. Le <code>return</code> anticipé ouvre un chemin de fuite."
      },
      {
        question: "Dans quel cas la liste d'initialisation devient-elle indispensable ?",
        options: [
          "Pour un membre <code>const</code> ou une référence",
          "Uniquement pour les types primitifs",
          "Jamais, car on peut toujours affecter dans le corps"
        ],
        answer: 0,
        explanation: "Certains membres ne peuvent pas être assignés correctement après coup. La liste d'initialisation n'est alors pas un style, mais une nécessité."
      }
    ],
    exercises: [
      {
        title: "Chronomètre de scope",
        difficulty: "Intermédiaire",
        time: "25 min",
        prompt: "Écris une petite classe RAII qui mesure le temps passé dans une portée et affiche la durée à la destruction. Le but n'est pas seulement d'obtenir un chrono, mais de montrer que le nettoyage ou l'action finale se produisent automatiquement à la sortie du bloc.",
        deliverables: [
          "une classe construite avec une liste d'initialisation claire",
          "un exemple d'usage sur au moins deux blocs de portée différents",
          "une explication de ce que RAII garantit ici même en cas de sortie anticipée"
        ]
      },
      {
        title: "Gestionnaire de fichier propre",
        difficulty: "Intermédiaire",
        time: "30 min",
        prompt: "Encapsule l'ouverture d'un fichier texte dans une classe qui garantit que l'objet n'existe que si le fichier est vraiment disponible. L'idée est de supprimer les <code>open()</code> / <code>close()</code> dispersés du code appelant.",
        deliverables: [
          "une construction qui valide immédiatement la disponibilité du fichier",
          "une petite API utile en lecture ou écriture",
          "une démonstration qui montre que le code appelant n'a pas besoin d'un <code>close()</code> manuel"
        ]
      }
    ],
    keywords: ["constructeur", "destructeur", "raii", "lifetime", "init list", "resource", "scope", "ownership"]
  },
  {
    id: "memoire-smart-pointers",
    shortTitle: "Mémoire et ownership",
    title: "Mémoire dynamique, ownership et smart pointers",
    level: "Intermédiaire",
    duration: "45 min",
    track: "SE2",
    summary:
      "Ce chapitre ne te demande pas d'aimer <code>new</code> et <code>delete</code>. Il t'apprend surtout à poser la bonne question : qui possède cette ressource, qui la libère et quel type standard exprime le mieux cette responsabilité ?",
    goals: [
      "distinguer pile, tas et durée de vie, mais surtout relier ces notions à un choix d'ownership",
      "préférer une abstraction standard comme <code>std::vector</code> ou <code>std::unique_ptr</code> quand elle exprime déjà correctement la possession",
      "expliquer la différence entre possession exclusive, copropriété, observation et cycle de références"
    ],
    highlights: ["ownership", "std::vector", "unique_ptr", "shared_ptr", "weak_ptr"],
    body: [
      lesson(
        "Modèle mental : le vrai sujet n'est pas le tas, c'est la responsabilité",
        paragraphs(
          "La pile convient très bien à la majorité des objets locaux. Le tas devient utile quand la durée de vie dépasse le scope courant, quand la taille est dynamique ou quand la structure impose une indirection. Mais cette distinction n'est qu'un décor.",
          "La vraie question de conception est : qui possède la ressource et qui doit la libérer ? Dès que cette réponse est floue, les bugs apparaissent. Dès qu'elle est explicite, le code devient plus robuste et souvent plus simple."
        ),
        table(
          ["Situation", "Choix naturel"],
          [
            ["Objet local borné au scope", "Valeur locale sur la pile."],
            ["Collection dynamique", "<code>std::vector</code> plutôt qu'un tableau géré à la main."],
            ["Possession exclusive", "<code>std::unique_ptr</code>."],
            ["Copropriété justifiée", "<code>std::shared_ptr</code>."],
            ["Observation sans propriété", "Référence, pointeur brut ou <code>std::weak_ptr</code> selon le contexte."]
          ]
        ),
        callout("info", "Question centrale", "Ne demande pas d'abord 'est-ce que c'est sur le heap ?'. Demande d'abord 'qui est responsable de la destruction ?'")
      ),
      lesson(
        "Exemple minimal : éviter <code>new</code> dès que la bibliothèque sait déjà mieux faire",
        paragraphs(
          "Avant de multiplier les smart pointers, commence par le plus simple. Si tu as besoin d'un tableau dynamique, <code>std::vector</code> exprime déjà la bonne idée. Si tu as besoin d'un propriétaire unique sur une ressource allouée, <code>std::unique_ptr</code> rend cette propriété visible.",
          "Autrement dit, beaucoup de code mémoire 'bas niveau' disparaît quand on choisit le bon type au lieu de gérer soi-même des couples <code>new</code> / <code>delete</code>."
        ),
        code(
          "cpp",
          `
std::vector<int> notes{12, 15, 9};
notes.push_back(18);

auto rapport = std::make_unique<std::string>("semestre valide");
std::cout << *rapport << '\n';
          `,
          "Deux ressources, deux propriétaires explicites"
        ),
        bullets([
          "<code>std::vector</code> possède déjà sa mémoire dynamique.",
          "<code>std::make_unique</code> crée une ressource avec possession exclusive explicite.",
          "Aucun <code>delete</code> manuel n'apparaît dans le code appelant."
        ]),
        callout("success", "Exemple minimal avant les variantes", "Quand un type standard exprime déjà la bonne propriété, choisis-le avant d'inventer une gestion mémoire manuelle.")
      ),
      lesson(
        "Piège classique : on peut fuir ou sur-partager une ressource en croyant simplifier",
        paragraphs(
          "Le premier piège est la fuite évidente : un pointeur brut propriétaire qu'on oublie de libérer. Le second, plus subtil, consiste à utiliser <code>shared_ptr</code> 'pour être tranquille' alors que la copropriété n'est pas justifiée. On paie alors un coût conceptuel et parfois technique sans résoudre le vrai problème de design.",
          "Autre piège pédagogique fréquent : appeler <code>release()</code> sur un <code>unique_ptr</code> sans organiser explicitement la suite. La ressource n'est plus gérée automatiquement, mais rien ne la détruit pour autant."
        ),
        code(
          "cpp",
          `
auto texte = std::make_unique<std::string>("temporaire");
std::string* brut = texte.release(); // la possession est abandonnée
// oubli de delete brut; -> fuite mémoire
          `,
          "Sortir de RAII sans plan de reprise recrée un bug manuel"
        ),
        code(
          "cpp",
          `
struct Noeud {
    std::shared_ptr<Noeud> suivant;
    std::shared_ptr<Noeud> precedent;
};
          `,
          "Deux <code>shared_ptr</code> peuvent aussi fabriquer un cycle"
        ),
        callout("warn", "Piège classique", "Un type plus 'intelligent' ne remplace pas une réflexion sur la propriété. <code>shared_ptr</code> partout n'est pas une stratégie, c'est souvent un symptôme.")
      ),
      lesson(
        "Vérification active : ce qu'il faut savoir expliquer à l'oral",
        paragraphs(
          "À ce stade, tu dois pouvoir comparer plusieurs outils sans les réciter mécaniquement. L'important est de relier chaque type à une phrase claire : qui possède, qui observe, quand la ressource disparaît, et quel risque principal il faut surveiller.",
          "C'est aussi ici qu'on clarifie le rôle restant du pointeur brut. Il n'est pas interdit ; il sert encore très bien à observer une ressource non possédée, à interagir avec une API C ou à représenter une donnée optionnelle dans certains designs."
        ),
        table(
          ["Outil", "Sémantique", "Risque principal"],
          [
            ["<code>std::vector</code>", "Possession d'une collection dynamique", "Croire qu'il faut quand même un <code>new[]</code> manuel."],
            ["<code>unique_ptr</code>", "Possession exclusive", "Sortir de RAII avec <code>release()</code> sans reprise explicite."],
            ["<code>shared_ptr</code>", "Copropriété", "Créer des cycles ou sur-utiliser le partage."],
            ["<code>weak_ptr</code>", "Observation sans prolonger la durée de vie", "Oublier de vérifier avec <code>lock()</code>."],
            ["<code>T*</code> brut", "Observation ou interopération bas niveau", "L'utiliser comme propriétaire sans contrat clair."]
          ]
        ),
        code(
          "cpp",
          `
class Scene {
public:
    void definirCamera(Camera* camera) {
        cameraCourante_ = camera; // observation, pas possession
    }

private:
    Camera* cameraCourante_{nullptr};
};
          `,
          "Le pointeur brut reste utile comme observateur honnête"
        ),
        callout("info", "Ce qu'il faut savoir expliquer à l'oral", "Je peux dire pourquoi <code>unique_ptr</code> n'est pas copiable, ce que <code>shared_ptr</code> partage réellement, pourquoi <code>weak_ptr</code> existe et dans quel cas un pointeur brut reste le bon outil.")
      ),
      lesson(
        "Pont vers la suite : ownership et mouvement racontent la même histoire",
        paragraphs(
          "Dès que la possession devient explicite, la question de la copie change complètement. Un objet qui possède une ressource ne se copie pas à la légère : il faut penser duplication réelle, transfert de propriété ou interdiction de copie.",
          "C'est exactement ce qui prépare le chapitre suivant sur la copie, l'affectation, le mouvement et la règle de 0/3/5. L'ownership n'est donc pas un chapitre isolé ; c'est la base des choix de copie et de move."
        ),
        code(
          "cpp",
          `
auto source = std::make_unique<std::string>("rapport");
auto destination = std::move(source); // transfert de possession
          `,
          "Un transfert de ressource annonce déjà le chapitre sur le mouvement"
        ),
        callout("success", "Pont vers le chapitre suivant", "Ownership et move semantics se répondent directement : si je sais qui possède, je peux alors décider ce que signifie copier ou déplacer.")
      ),
      videoLesson(
        "Ces vidéos prolongent très bien la bascule entre mémoire manuelle, durée de vie et ownership explicite.",
        [
          playlistVideo("smartPointers", "la vidéo la plus directement reliée à ce chapitre"),
          playlistVideo("objectLifetime", "utile pour relier ownership et sortie de portée"),
          playlistVideo("newKeyword", "rappelle pourquoi le réflexe <code>new</code> manuel devient vite fragile")
        ]
      )
    ].join(""),
    checklist: [
      "Je peux expliquer ce que signifie posséder une ressource et pourquoi cette notion est plus importante que le simple mot 'heap'.",
      "Je peux justifier l'usage de <code>std::vector</code> pour une collection dynamique au lieu d'un tableau géré à la main.",
      "Je peux créer un <code>unique_ptr</code> avec <code>make_unique</code> et expliquer pourquoi il n'est pas copiable.",
      "Je peux décrire ce que <code>std::move</code> change dans un transfert de possession.",
      "Je peux expliquer les risques de <code>release()</code>, <code>get()</code> et <code>shared_ptr</code> utilisé par confort.",
      "Je peux expliquer pourquoi un cycle de <code>shared_ptr</code> fuit et comment <code>weak_ptr</code> le casse.",
      "Je peux distinguer un pointeur brut observateur d'un propriétaire réel."
    ],
    quiz: [
      {
        question: "Quel outil standard remplace le plus souvent un tableau dynamique alloué manuellement ?",
        options: ["<code>std::vector</code>", "<code>std::pair</code>", "<code>std::exception</code>"],
        answer: 0,
        explanation: "<code>std::vector</code> porte déjà la bonne idée métier : une séquence dynamique propriétaire de sa mémoire. Le remplacer par <code>new[]</code> manuel ajoute souvent des risques sans gain réel."
      },
      {
        question: "Que devient un <code>unique_ptr</code> après un <code>std::move</code> ?",
        options: [
          "Il garde une copie de la ressource",
          "Il devient <code>nullptr</code> — la possession est transférée",
          "Il est détruit immédiatement"
        ],
        answer: 1,
        explanation: "Le point important n'est pas la syntaxe de <code>std::move</code>, mais le contrat qui change : la source n'est plus propriétaire. Le transfert est donc explicite et visible."
      },
      {
        question: "Pourquoi un cycle de <code>shared_ptr</code> crée-t-il une fuite mémoire ?",
        options: [
          "Parce que <code>shared_ptr</code> ne gère pas les destructions",
          "Parce que le compteur de références reste supérieur à zéro indéfiniment, empêchant toute libération",
          "Parce que les cycles sont interdits par la norme"
        ],
        answer: 1,
        explanation: "Le problème n'est pas un 'bug d'implémentation' de <code>shared_ptr</code>. C'est un problème de design : deux objets se gardent mutuellement en vie sans propriétaire final capable de les libérer."
      },
      {
        question: "Quelle est la différence entre <code>p.get()</code> et <code>p.release()</code> sur un <code>unique_ptr</code> ?",
        options: [
          "<code>get()</code> et <code>release()</code> font la même chose",
          "<code>get()</code> observe sans céder la possession ; <code>release()</code> abandonne la possession sans détruire",
          "<code>get()</code> libère la mémoire ; <code>release()</code> ne fait rien"
        ],
        answer: 1,
        explanation: "<code>get()</code> laisse RAII intact. <code>release()</code>, au contraire, sort volontairement du cadre automatique : tu récupères le pointeur brut et la responsabilité de penser à sa destruction."
      }
    ],
    exercises: [
      {
        title: "Remplacer du <code>new[]</code> par <code>vector</code>",
        difficulty: "Intermédiaire",
        time: "20 min",
        prompt: "Reprends un code qui utilise <code>new[]</code> / <code>delete[]</code> pour gérer une collection dynamique et remplace toute la gestion manuelle par <code>std::vector</code>. Le but est d'obtenir exactement le même comportement visible avec moins de responsabilité mémoire dans le code applicatif.",
        deliverables: [
          "la version initiale avec les points de fragilité mémoire annotés",
          "la version équivalente avec <code>std::vector</code>",
          "une liste des risques éliminés, expliqués en langage simple"
        ]
      },
      {
        title: "Graphe d'ownership avec unique_ptr et shared_ptr",
        difficulty: "Avancé",
        time: "35 min",
        prompt: "Modélise un arbre de nœuds où chaque nœud possède ses enfants avec <code>unique_ptr</code> et observe éventuellement son parent sans en être propriétaire. La structure doit permettre de détruire la racine et de libérer naturellement tout l'arbre.",
        deliverables: [
          "une structure <code>Noeud</code> qui distingue clairement possession et observation",
          "une démonstration que la destruction de la racine suffit à tout libérer",
          "une justification écrite du choix entre pointeur brut observateur et <code>weak_ptr</code>"
        ]
      },
      {
        title: "Briser un cycle avec weak_ptr",
        difficulty: "Avancé",
        time: "30 min",
        prompt: "Crée deux classes qui se référencent mutuellement. Implémente d'abord une version naïve où elles se possèdent toutes les deux via <code>shared_ptr</code>, puis corrige le design pour qu'une des deux relations devienne non propriétaire avec <code>weak_ptr</code>.",
        deliverables: [
          "une première version qui montre le cycle par l'absence de destruction attendue",
          "une seconde version corrigée avec <code>weak_ptr</code>",
          "une explication de ce que signifie ici 'observer sans posséder'"
        ]
      }
    ],
    keywords: ["memory", "ownership", "vector", "unique_ptr", "shared_ptr", "weak_ptr", "heap", "make_unique", "make_shared", "reference counting", "cycle", "observer", "release", "reset"]
  },
  {
    id: "copie-mouvement",
    shortTitle: "Copie et mouvement",
    title: "Copie, affectation, mouvement et règle de 0/3/5",
    level: "Avancé",
    duration: "50 min",
    track: "SE3",
    summary:
      "Dès qu'une classe possède une ressource, la copie et l'affectation deviennent des sujets de conception. Le C++ moderne ajoute le mouvement pour transférer efficacement des ressources temporaires.",
    goals: [
      "distinguer construction par copie et affectation",
      "comprendre pourquoi la copie superficielle casse les classes propriétaires",
      "savoir quand viser la règle de 0 plutôt que la règle de 5"
    ],
    highlights: ["deep copy", "move", "rule of 0"],
    body: [
      lesson(
        "Copie superficielle : pourquoi elle peut être toxique",
        paragraphs(
          "Si une classe possède un pointeur vers une ressource allouée, la copie membre à membre du compilateur duplique l'adresse, pas la ressource. Deux objets se retrouvent alors à croire qu'ils possèdent la même zone mémoire.",
          "La conséquence typique est le <em>double delete</em>, mais le vrai problème est conceptuel : le modèle de propriété n'était pas explicite."
        ),
        code(
          "cpp",
          `
class Buffer {
public:
    explicit Buffer(std::size_t taille)
        : taille_{taille}, data_{new int[taille]{}} {}

    ~Buffer() {
        delete[] data_;
    }

private:
    std::size_t taille_;
    int* data_;
};
          `,
          "Classe propriétaire fragile"
        ),
        callout("danger", "Signal d'alerte", "Si une classe possède un pointeur brut, pose immédiatement la question de la copie, de l'affectation et du mouvement.")
      ),
      lesson(
        "La copie profonde et l'affectation",
        paragraphs(
          "Le constructeur de copie crée un nouvel objet à partir d'un autre. L'opérateur d'affectation copie l'état dans un objet déjà existant. Ce sont deux moments distincts du cycle de vie.",
          "Dans beaucoup de cours, cette différence est apprise comme une règle de syntaxe ; en pratique, c'est surtout une différence de responsabilité."
        ),
        code(
          "cpp",
          `
Buffer(const Buffer& other)
    : taille_{other.taille_}, data_{new int[other.taille_]} {
    std::copy(other.data_, other.data_ + other.taille_, data_);
}

Buffer& operator=(const Buffer& other) {
    if (this == &other) {
        return *this;
    }

    Buffer copie{other};
    echanger(copie);
    return *this;
}
          `,
          "Copie et affectation robustes"
        ),
        callout("success", "Bonne stratégie", "La technique copy-and-swap simplifie l'affectation et aide à gérer l'auto-affectation proprement.")
      ),
      lesson(
        "Move semantics et règle de 0",
        paragraphs(
          "Le mouvement permet de transférer la ressource d'un objet temporaire au lieu de la recopier. Mais la meilleure stratégie reste souvent d'éviter de gérer soi-même la ressource en utilisant des types standards.",
          "La règle de 0 dit : si tes membres savent déjà gérer leur propre copie, destruction et mouvement, ne réécris rien."
        ),
        code(
          "cpp",
          `
class Image {
public:
    Image(Image&& other) noexcept
        : largeur_{other.largeur_}, pixels_{std::move(other.pixels_)} {
        other.largeur_ = 0;
    }

private:
    int largeur_{0};
    std::vector<std::uint8_t> pixels_;
};
          `,
          "Déplacement"
        ),
        bullets([
          "La règle de 0 est souvent meilleure que la règle de 5.",
          "Le mot-clé <code>noexcept</code> aide les conteneurs à préférer le mouvement.",
          "Si ta classe ne possède rien directement, laisse le compilateur générer les opérations spéciales."
        ])
      ),
      videoLesson(
        "Pour ce chapitre, les deux vidéos les plus rentables sont celles qui distinguent copie coûteuse et transfert de ressource.",
        [
          playlistVideo("copyConstructors", "bonne explication du besoin de copie profonde et du coût réel de la copie"),
          playlistVideo("moveSemantics", "excellent complément pour comprendre le transfert de ressource et la règle de 0")
        ]
      )
    ].join(""),
    checklist: [
      "Je sais distinguer construction par copie et affectation.",
      "Je comprends pourquoi une copie superficielle peut être dangereuse.",
      "Je connais la règle de 0/3/5.",
      "Je sais quand le move est utile.",
      "Je n'écris pas de code spécial si les membres standards suffisent."
    ],
    quiz: [
      {
        question: "Quelle phrase décrit le mieux la règle de 0 ?",
        options: [
          "Toujours écrire cinq opérations spéciales",
          "Éviter d'écrire les opérations spéciales quand les membres gèrent déjà la ressource",
          "Interdire toute copie dans le projet"
        ],
        answer: 1,
        explanation: "La règle de 0 pousse à déléguer la gestion mémoire aux types standards pour ne pas réimplémenter inutilement le cycle de vie."
      },
      {
        question: "Pourquoi un move constructor marqué <code>noexcept</code> est-il utile ?",
        options: [
          "Parce qu'il évite toute allocation",
          "Parce qu'il permet à certains conteneurs de privilégier le déplacement en sécurité",
          "Parce qu'il interdit les destructeurs"
        ],
        answer: 1,
        explanation: "Les conteneurs standard peuvent choisir le déplacement seulement s'ils ont la garantie qu'il ne lancera pas d'exception."
      }
    ],
    exercises: [
      {
        title: "Autopsie d'une double libération",
        difficulty: "Avancé",
        time: "30 min",
        prompt: "Crée une classe propriétaire minimale, provoque volontairement une copie superficielle puis corrige-la avec copie profonde ou règle de 0.",
        deliverables: [
          "le scénario de bug",
          "l'explication de la double possession",
          "la version corrigée"
        ]
      },
      {
        title: "Passer de la règle de 5 à la règle de 0",
        difficulty: "Avancé",
        time: "30 min",
        prompt: "Refactorise une classe qui gère un buffer brut pour qu'elle s'appuie sur <code>std::vector</code> ou <code>std::string</code> et supprime les opérations spéciales maison.",
        deliverables: [
          "la classe initiale",
          "la classe simplifiée",
          "les fonctions spéciales supprimées"
        ]
      }
    ],
    keywords: ["copy", "move", "rule of 0", "rule of 5", "assignment", "deep copy"]
  },
  {
    id: "surcharge-operateurs",
    shortTitle: "Surcharge d'opérateurs",
    title: "Surcharge d'opérateurs avec une vraie sémantique",
    level: "Avancé",
    duration: "50 min",
    track: "SE3",
    summary:
      "Surcharger un opérateur n'est utile que si cela rend l'objet plus naturel à manipuler. Ce chapitre insiste sur la cohérence sémantique plutôt que sur la simple prouesse syntaxique.",
    goals: [
      "choisir entre opérateur membre et fonction libre",
      "respecter les attentes naturelles des opérateurs",
      "gérer correctement les flux et les comparaisons"
    ],
    highlights: ["friend", "operator<<", "cohérence"],
    body: [
      lesson(
        "Quand surcharger et quand s'abstenir",
        paragraphs(
          "Un opérateur est justifié si l'objet porte naturellement la sémantique associée. Une <code>Fraction</code> mérite <code>+</code> et <code>*</code> ; une classe <code>BaseDeDonnees</code> mérite rarement <code>operator+</code>.",
          "Le bon critère est la surprise : si l'opérateur fait autre chose que ce qu'un lecteur attend, mieux vaut une méthode nommée."
        ),
        callout("warn", "Mauvaise odeur", "Si tu dois expliquer longuement ce que fait un opérateur, c'est probablement qu'il ne fallait pas le surcharger.")
      ),
      lesson(
        "Membre ou non-membre ?",
        paragraphs(
          "Les opérateurs qui modifient l'objet de gauche sont souvent des méthodes membres comme <code>operator+=</code>. Les opérateurs binaires symétriques comme <code>operator+</code> sont souvent mieux exprimés en fonction libre pour conserver la symétrie des conversions.",
          "<code>operator&lt;&lt;</code> est un cas classique : son premier argument est le flux, donc ce n'est pas une méthode naturelle de votre classe."
        ),
        code(
          "cpp",
          `
class Fraction {
public:
    Fraction& operator+=(const Fraction& other);
    friend std::ostream& operator<<(std::ostream& out, const Fraction& value);
};

Fraction operator+(Fraction left, const Fraction& right) {
    left += right;
    return left;
}
          `,
          "Symétrie et réutilisation"
        ),
        bullets([
          "<code>+=</code> modifie l'objet courant : méthode membre.",
          "<code>+</code> réutilise <code>+=</code> : fonction libre.",
          "<code>&lt;&lt;</code> retourne le flux pour permettre le chaînage."
        ])
      ),
      lesson(
        "Comparaisons et contrats implicites",
        paragraphs(
          "Une comparaison doit être stable et intuitive. Si tu définis <code>==</code>, demande-toi immédiatement ce que signifie l'égalité pour ton type : identité mémoire, même valeur logique, même représentation simplifiée ?",
          "En C++20, le <code>spaceship operator</code> simplifie la génération des comparaisons, mais il ne remplace pas la réflexion sur le contrat métier."
        ),
        code(
          "cpp",
          `
bool operator==(const Fraction& left, const Fraction& right) {
    return left.numerateur() * right.denominateur() ==
           right.numerateur() * left.denominateur();
}
          `,
          "Égalité logique"
        ),
        callout("info", "Point de méthode", "Documente ce que signifie l'égalité d'un type. C'est souvent plus important que la syntaxe de l'opérateur lui-même.")
      ),
      lesson(
        "Opérateur d'extraction >> et les six comparaisons",
        paragraphs(
          "L'opérateur <code>operator&gt;&gt;</code> est le symétrique de <code>operator&lt;&lt;</code> : il lit depuis un flux vers un objet. Sa signature prend un <code>std::istream&amp;</code> en premier argument et retourne cette même référence, comme son pendant de sortie retourne un <code>std::ostream&amp;</code>.",
          "Les six opérateurs de comparaison (<code>==</code>, <code>!=</code>, <code>&lt;</code>, <code>&gt;</code>, <code>&lt;=</code>, <code>&gt;=</code>) forment un groupe cohérent. En C++ classique, si tu définis l'un d'eux, les autres doivent être en accord. La règle pratique : implémenter <code>==</code> et <code>&lt;</code> en logique, puis dériver les quatre restants."
        ),
        code(
          "cpp",
          `
class Date {
    short jour_, mois_;
    int annee_;
public:
    Date(short j, short m, int a) : jour_{j}, mois_{m}, annee_{a} {}

    // lecture depuis un flux : "12 3 2025"
    friend std::istream& operator>>(std::istream& in, Date& d) {
        in >> d.jour_ >> d.mois_ >> d.annee_;
        return in;
    }

    bool operator==(const Date& other) const {
        return annee_ == other.annee_ && mois_ == other.mois_ && jour_ == other.jour_;
    }
    bool operator!=(const Date& other) const { return !(*this == other); }
    bool operator< (const Date& other) const {
        if (annee_ != other.annee_) return annee_ < other.annee_;
        if (mois_  != other.mois_)  return mois_  < other.mois_;
        return jour_ < other.jour_;
    }
    bool operator> (const Date& other) const { return other < *this; }
    bool operator<=(const Date& other) const { return !(other < *this); }
    bool operator>=(const Date& other) const { return !(*this < other); }
};
          `,
          "operator>> et les 6 comparaisons"
        ),
        bullets([
          "<code>operator&gt;&gt;</code> retourne <code>istream&amp;</code> (non-const) pour permettre le chaînage.",
          "Déclarer en <code>friend</code> permet d'accéder aux membres privés depuis la fonction libre.",
          "Dériver <code>!=</code>, <code>&gt;</code>, <code>&lt;=</code>, <code>&gt;=</code> depuis <code>==</code> et <code>&lt;</code> évite la duplication de la logique de comparaison.",
          "En C++20, le <code>spaceship operator &lt;=&gt;</code> génère les six automatiquement."
        ]),
        callout("warn", "Opérateur hors de la classe", "Surcharger <code>&lt;</code> comme fonction libre plutôt que comme méthode membre permet d'éviter des problèmes d'accès en cas de type primitif à gauche, mais nécessite alors <code>friend</code> si l'implémentation lit des membres privés.")
      )
    ].join(""),
    checklist: [
      "Je surcharge seulement quand la sémantique est naturelle.",
      "Je sais distinguer opérateur membre et non-membre.",
      "Je fais retourner le flux dans <code>operator&lt;&lt;</code>.",
      "Je retourne <code>istream&amp;</code> dans <code>operator&gt;&gt;</code>.",
      "Je définis l'égalité selon un vrai contrat métier.",
      "Je réutilise les opérateurs composés pour limiter la duplication.",
      "Je sais dériver les 6 opérateurs de comparaison depuis <code>==</code> et <code>&lt;</code>.",
      "Je comprends pourquoi <code>friend</code> est nécessaire pour un opérateur non-membre accédant aux membres privés."
    ],
    quiz: [
      {
        question: "Pourquoi <code>operator&lt;&lt;</code> est-il souvent une fonction libre amie ?",
        options: [
          "Parce qu'une méthode ne peut pas retourner de référence",
          "Parce que le premier opérande est un flux et non l'objet affiché",
          "Parce qu'il est toujours plus rapide"
        ],
        answer: 1,
        explanation: "Le flux est à gauche de l'opérateur ; le design naturel est donc une fonction libre."
      },
      {
        question: "Quel opérateur a le plus de chances d'être une méthode membre ?",
        options: ["<code>operator+=</code>", "<code>operator+</code>", "<code>operator&lt;&lt;</code>"],
        answer: 0,
        explanation: "Il modifie l'objet courant et s'exprime naturellement comme comportement interne."
      },
      {
        question: "Quelle est la signature correcte de <code>operator&gt;&gt;</code> pour lire un objet <code>Foo</code> depuis un flux ?",
        options: [
          "<code>std::ostream&amp; operator&gt;&gt;(std::ostream&amp; in, Foo&amp; f)</code>",
          "<code>std::istream&amp; operator&gt;&gt;(std::istream&amp; in, Foo&amp; f)</code>",
          "<code>void operator&gt;&gt;(std::istream&amp; in, const Foo&amp; f)</code>"
        ],
        answer: 1,
        explanation: "operator>> prend un istream& (non-const) et l'objet destination par référence non-const, puis retourne le flux pour permettre le chaînage."
      }
    ],
    exercises: [
      {
        title: "Complexe lisible",
        difficulty: "Avancé",
        time: "30 min",
        prompt: "Ajoute à une classe <code>Complexe</code> les opérateurs <code>+=</code>, <code>+</code>, <code>==</code>, <code>&lt;&lt;</code> et <code>&gt;&gt;</code> avec une sémantique cohérente.",
        deliverables: [
          "une justification du choix membre / non-membre",
          "les opérateurs compilables",
          "une démonstration lecture/écriture sur flux"
        ]
      },
      {
        title: "Date comparable",
        difficulty: "Intermédiaire",
        time: "25 min",
        prompt: "Implémente les 6 opérateurs de comparaison sur une classe <code>Date</code> en les dérivant de <code>==</code> et <code>&lt;</code>.",
        deliverables: [
          "les 6 opérateurs",
          "un jeu de tests couvrant les cas limites (même mois, même jour...)",
          "une phrase expliquant le choix membre ou non-membre"
        ]
      },
      {
        title: "Égalité métier",
        difficulty: "Intermédiaire",
        time: "20 min",
        prompt: "Choisis un type de ton projet et rédige en une phrase ce que signifie l'égalité logique avant d'écrire l'opérateur.",
        deliverables: [
          "la définition métier",
          "l'implémentation",
          "un test contre un cas limite"
        ]
      }
    ],
    keywords: ["operator overloading", "friend", "ostream", "istream", "comparaison", "plus égale", "operator>>", "extraction"]
  },
  {
    id: "heritage-polymorphisme",
    shortTitle: "Héritage et polymorphisme",
    title: "Héritage, polymorphisme et interfaces abstraites",
    level: "Avancé",
    duration: "60 min",
    track: "SE4",
    summary:
      "Le polymorphisme n'est pas seulement un mécanisme de dispatch ; c'est une façon de concevoir des contrats extensibles. Ce chapitre montre aussi où se cachent les pièges classiques.",
    goals: [
      "utiliser l'héritage pour modéliser une relation est-un",
      "comprendre le dispatch dynamique via <code>virtual</code> et <code>override</code>",
      "choisir entre composition, classe abstraite et hiérarchie réelle"
    ],
    highlights: ["virtual", "override", "abstract class", "protected"],
    body: [
      lesson(
        "Relation est-un, classe de base et redéfinition",
        paragraphs(
          "L'héritage permet de spécialiser une classe existante pour en créer une plus précise. La question décisive reste toujours la même : la classe dérivée est-elle vraiment une sorte de la classe de base ? Si la réponse sonne faux en français, la modélisation est souvent mauvaise.",
          "On distingue alors la classe de base, qui porte le contrat commun, et la classe dérivée, qui ajoute ou adapte un comportement. Cela permet la réutilisation de code, l'ajout de nouvelles fonctionnalités et la redéfinition d'un comportement existant."
        ),
        code(
          "cpp",
          `
class Personne {
public:
    explicit Personne(std::string nom) : nom_{std::move(nom)} {}

    const std::string& nom() const { return nom_; }

    virtual void afficher() const {
        std::cout << nom_ << '\\n';
    }

    virtual ~Personne() = default;

private:
    std::string nom_;
};

class Etudiant : public Personne {
public:
    Etudiant(std::string nom, std::string id)
        : Personne(std::move(nom)), id_{std::move(id)} {}

    void afficher() const override {
        Personne::afficher();
        std::cout << id_ << '\\n';
    }

private:
    std::string id_;
};
          `,
          "Base et classe dérivée"
        ),
        bullets([
          "La redéfinition garde la même signature dans la dérivée ; la surcharge change la liste des paramètres dans une même portée logique.",
          "Une classe dérivée n'hérite pas de l'accès aux membres <code>private</code> de la base ; elle passe par l'interface publique ou protégée."
        ]),
        callout("info", "Vocabulaire utile", "Redéfinition et surcharge sont deux mécanismes différents. En C++, on peut redéfinir une méthode héritée et surcharger un nom de fonction, mais ce n'est pas la même idée.")
      ),
      lesson(
        "Constructeurs, destructeurs et ordre d'appel",
        paragraphs(
          "Quand on construit un objet dérivé, le constructeur de la base est toujours appelé en premier. À la destruction, l'ordre s'inverse : le destructeur de la dérivée s'exécute avant celui de la base.",
          "Si la classe de base ne possède pas de constructeur par défaut, la classe dérivée doit appeler explicitement un constructeur valide de la base dans sa liste d'initialisation. C'est une règle de compilation, pas un simple style."
        ),
        code(
          "cpp",
          `
class Personne {
public:
    explicit Personne(std::string nom) : nom_{std::move(nom)} {}
    virtual ~Personne() = default;

private:
    std::string nom_;
};

class Etudiant : public Personne {
public:
    Etudiant(std::string nom, std::string id)
        : Personne(std::move(nom)), id_{std::move(id)} {}

    ~Etudiant() override = default;

private:
    std::string id_;
};
          `,
          "Initialisation de la base"
        ),
        bullets([
          "Le constructeur de la base passe avant celui de la dérivée.",
          "Les destructeurs sont appelés dans l'ordre inverse.",
          "Appeler explicitement le constructeur parent rend l'intention plus lisible, même lorsqu'un constructeur par défaut existe."
        ]),
        callout("warn", "Règle importante", "Si la base n'a pas de constructeur par défaut, oublier de l'appeler dans la liste d'initialisation de la dérivée provoque une erreur de compilation.")
      ),
      lesson(
        "Modes d'héritage, protected et composition",
        paragraphs(
          "Le mot-clé placé après les deux-points contrôle la visibilité de ce que la dérivée reçoit de la base. En pratique, l'héritage <code>public</code> est celui qui exprime vraiment la relation <em>est-un</em> et c'est de loin le plus courant.",
          "Le niveau <code>protected</code> est intermédiaire : invisible depuis l'extérieur comme <code>private</code>, mais encore accessible dans les classes dérivées. Il faut l'utiliser avec sobriété, car il élargit quand même la surface de contrat."
        ),
        table(
          ["Mode", "Effet sur les membres publics de la base", "Cas typique"],
          [
            ["<code>public</code>", "Ils restent publics dans la dérivée.", "Vrai contrat est-un."],
            ["<code>protected</code>", "Ils deviennent protégés dans la dérivée.", "Conception rare, orientée famille de classes."],
            ["<code>private</code>", "Ils deviennent privés dans la dérivée.", "Détail d'implémentation ; la composition est souvent meilleure."]
          ]
        ),
        bullets([
          "L'héritage multiple existe, mais il complexifie fortement les contrats et peut mener au problème du diamant.",
          "Quand le besoin réel est 'contient un' ou 'utilise un', la composition reste plus souple que l'héritage."
        ]),
        callout("warn", "Réflexe de conception", "Commence par la composition. Garde l'héritage pour les cas où la substitution de la dérivée à la base est réellement défendable.")
      ),
      lesson(
        "Polymorphisme dynamique, virtual et override",
        paragraphs(
          "Le polymorphisme permet de choisir à l'exécution la bonne implémentation selon le type réel de l'objet, même si on le manipule via une référence ou un pointeur vers la base. Sans <code>virtual</code>, l'appel est résolu statiquement à la compilation.",
          "Le mot-clé <code>override</code> est une sécurité précieuse : il demande au compilateur de vérifier qu'on redéfinit bien une méthode virtuelle existante, ce qui évite des bugs silencieux."
        ),
        code(
          "cpp",
          `
class Polygon {
public:
    virtual ~Polygon() = default;
    virtual int getArea() const { return 0; }
};

class Rectangle : public Polygon {
public:
    Rectangle(int width, int height) : width_{width}, height_{height} {}

    int getArea() const override {
        return width_ * height_;
    }

private:
    int width_;
    int height_;
};

class Triangle : public Polygon {
public:
    Triangle(int width, int height) : width_{width}, height_{height} {}

    int getArea() const override {
        return width_ * height_ / 2;
    }

private:
    int width_;
    int height_;
};
          `,
          "Polymorphisme par classe de base"
        ),
        code(
          "cpp",
          `
std::vector<std::unique_ptr<Polygon>> formes;
formes.push_back(std::make_unique<Rectangle>(4, 5));
formes.push_back(std::make_unique<Triangle>(4, 5));

for (const auto& forme : formes) {
    std::cout << forme->getArea() << '\\n';
}
          `,
          "Collection polymorphique sûre"
        ),
        bullets([
          "Le mécanisme interne repose sur une vtable ; son coût existe mais reste généralement faible.",
          "Le polymorphisme dynamique a besoin de références ou de pointeurs sur la base."
        ])
      ),
      lesson(
        "Fonctions virtuelles pures, classes abstraites et slicing",
        paragraphs(
          "Une fonction virtuelle pure s'écrit avec <code>= 0</code> et transforme la classe en classe abstraite. Une telle classe ne peut pas être instanciée directement, mais elle constitue une excellente interface de rôle pour les classes dérivées concrètes.",
          "Les principaux pièges sont le slicing, qui détruit l'information dérivée lors d'une copie par valeur vers la base, et l'oubli d'un destructeur virtuel dans une base destinée à être détruite polymorphiquement."
        ),
        table(
          ["Type de méthode", "Syntaxe", "Effet"],
          [
            ["Non virtuelle", "<code>int f();</code>", "Résolution statique ; le comportement ne varie pas polymorphiquement."],
            ["Virtuelle", "<code>virtual int f();</code>", "Résolution dynamique avec implémentation par défaut possible."],
            ["Virtuelle pure", "<code>virtual int f() = 0;</code>", "Oblige les dérivées concrètes à fournir l'implémentation."]
          ]
        ),
        code(
          "cpp",
          `
class Shape {
public:
    virtual void draw() const = 0;
    virtual ~Shape() = default;
};

void afficher(const Shape& shape) {
    shape.draw();
}
          `,
          "Classe abstraite et référence polymorphique"
        ),
        callout("success", "Règle de survie", "Dès qu'une base est destinée à être utilisée polymorphiquement, donne-lui un destructeur virtuel et évite les copies par valeur vers ce type de base.")
      ),
      videoLesson(
        "Ces vidéos sont celles de la playlist qui épousent le mieux la progression héritage -> dispatch dynamique -> destruction correcte.",
        [
          playlistVideo("inheritance", "bonne introduction à la relation base / dérivée"),
          playlistVideo("virtualFunctions", "très utile pour visualiser le dispatch dynamique"),
          playlistVideo("virtualDestructors", "complète précisément le piège des bases polymorphiques")
        ]
      )
    ].join(""),
    checklist: [
      "Je justifie une relation d'héritage en termes de substitution réelle.",
      "Je distingue redéfinition et surcharge.",
      "Je sais que le constructeur de base s'exécute avant celui de la dérivée.",
      "Je sais appeler explicitement le constructeur parent dans la liste d'initialisation.",
      "Je connais le rôle de <code>protected</code> et les effets de <code>public</code>, <code>protected</code> et <code>private</code> à l'héritage.",
      "J'emploie <code>override</code> systématiquement.",
      "Je connais le problème du slicing.",
      "Je mets un destructeur virtuel dans une base polymorphique.",
      "Je sais quand préférer la composition à l'héritage."
    ],
    quiz: [
      {
        question: "Pourquoi un destructeur virtuel est-il crucial dans une base polymorphique ?",
        options: [
          "Parce qu'il accélère l'appel des méthodes",
          "Parce qu'il garantit la destruction complète de l'objet dérivé via un pointeur base",
          "Parce qu'il remplace tous les constructeurs"
        ],
        answer: 1,
        explanation: "Sans destructeur virtuel, la destruction via la base peut ignorer une partie du nettoyage propre au dérivé."
      },
      {
        question: "Qu'est-ce que le slicing ?",
        options: [
          "Une optimisation du compilateur",
          "La perte de la partie dérivée lors d'une copie par valeur vers le type base",
          "Une exception levée au runtime"
        ],
        answer: 1,
        explanation: "Le type statique base par valeur ne conserve pas le comportement dynamique du dérivé."
      },
      {
        question: "Que doit faire le constructeur d'une classe dérivée si la base n'a pas de constructeur par défaut ?",
        options: [
          "Rien, le compilateur en invente un automatiquement",
          "Appeler explicitement un constructeur de la base dans la liste d'initialisation",
          "Déplacer l'appel après le corps du constructeur"
        ],
        answer: 1,
        explanation: "La base doit être construite avant le corps de la dérivée ; l'appel se fait donc dans la liste d'initialisation."
      },
      {
        question: "Quel énoncé décrit le mieux <code>protected</code> ?",
        options: [
          "Visible partout comme public",
          "Invisible pour tout le monde comme private",
          "Invisible depuis l'extérieur mais accessible dans les classes dérivées"
        ],
        answer: 2,
        explanation: "<code>protected</code> ouvre l'accès aux dérivées tout en le fermant aux utilisateurs externes de la classe."
      }
    ],
    exercises: [
      {
        title: "Hiérarchie de formes",
        difficulty: "Intermédiaire",
        time: "30 min",
        prompt: "Construis une base abstraite <code>Forme</code> et au moins deux dérivés, puis stocke-les dans une collection polymorphique sans fuite mémoire ni slicing.",
        deliverables: [
          "la classe abstraite",
          "deux implémentations",
          "une démonstration sans fuite mémoire"
        ]
      },
      {
        title: "Composition ou héritage ?",
        difficulty: "Avancé",
        time: "20 min",
        prompt: "Pour trois cas métiers de ton choix, décide s'il faut composition ou héritage et justifie ton choix en une phrase chacun.",
        deliverables: [
          "les trois cas",
          "la solution retenue",
          "le critère utilisé"
        ]
      }
    ],
    keywords: ["heritage", "polymorphisme", "virtual", "override", "slicing", "abstract class", "protected", "destructeur virtuel", "heritage multiple", "composition"]
  },
  {
    id: "templates-stl",
    shortTitle: "Templates et STL",
    title: "Templates, conteneurs STL, itérateurs et algorithmes",
    level: "Avancé",
    duration: "75 min",
    track: "SE7",
    summary:
      "Les templates changent l'échelle du code C++ : on écrit des abstractions génériques sans sacrifier la performance. La STL rend ensuite ces abstractions immédiatement utiles.",
    goals: [
      "comprendre l'idée d'instanciation de template et son impact sur l'organisation du code",
      "choisir un conteneur STL adapté au besoin",
      "combiner algorithmes, itérateurs, foncteurs et lambdas"
    ],
    highlights: ["template", "vector", "iterator", "algorithm"],
    body: [
      lesson(
        "Fonctions template et instanciation",
        paragraphs(
          "Un template est un moule de code générique. Il ne devient une fonction ou une classe concrète que lorsque le compilateur l'instancie pour un type donné. Cela permet d'écrire une fois une logique commune et de la réutiliser pour plusieurs types sans perdre le typage statique.",
          "En pratique, cela signifie aussi que la définition complète d'un template doit généralement se trouver dans un header. Si le compilateur ne voit que la déclaration sans le corps, il ne peut pas générer l'instanciation nécessaire."
        ),
        code(
          "cpp",
          `
template <typename T>
T minimum(const T& a, const T& b) {
    return (a < b) ? a : b;
}

double d = minimum(3.14, 2.71);
int n = minimum(5, 3);
          `,
          "Fonction template"
        ),
        code(
          "cpp",
          `
template <typename T1, typename T2>
T2 calculerMoyenne(const T1 tableau[], int taille) {
    T2 somme = 0;
    for (int i = 0; i < taille; ++i) {
        somme += tableau[i];
    }
    return somme / taille;
}
          `,
          "Template avec plusieurs paramètres"
        ),
        callout("info", "Question clé", "Si ton template dépend de beaucoup d'opérations implicites sur <code>T</code>, explicite mentalement ces contraintes avant d'aller plus loin.")
      ),
      lesson(
        "Classes template et contraintes implicites",
        paragraphs(
          "On peut paramétrer une classe entière avec un type. C'est utile pour écrire une structure générique, mais cela impose aussi de raisonner sur ce qu'on attend réellement du type paramètre : est-il copiable, comparable, default-constructible, additionnable ?",
          "En production, cela ne signifie pas qu'il faut réécrire la STL. Une classe template maison est souvent un exercice pédagogique ; dans un vrai projet, <code>std::vector</code>, <code>std::map</code> ou <code>std::optional</code> couvrent déjà énormément de besoins."
        ),
        code(
          "cpp",
          `
template <typename T>
class Vector {
public:
    explicit Vector(unsigned int size) : elem_{new T[size]}, size_{size} {}
    ~Vector() { delete[] elem_; }

    T& operator[](unsigned int index) {
        if (index >= size_) {
            throw std::out_of_range{"Vector::operator[]"};
        }
        return elem_[index];
    }

    unsigned int size() const { return size_; }

private:
    T* elem_;
    unsigned int size_;
};
          `,
          "Classe template"
        ),
        bullets([
          "Un template n'efface pas les contraintes ; il les déplace dans le contrat implicite du type paramètre.",
          "Une structure pédagogique maison n'a de sens que si elle t'aide à comprendre ce que la STL fait déjà très bien."
        ]),
        callout("success", "Réflexe simple", "Si ton besoin ressemble à une séquence dynamique, commence par <code>std::vector</code> avant de songer à écrire ton propre conteneur.")
      ),
      lesson(
        "Choisir le bon conteneur STL",
        paragraphs(
          "La Standard Template Library réunit conteneurs, itérateurs, algorithmes et foncteurs. Le point essentiel n'est pas d'en mémoriser une liste exhaustive, mais de relier un besoin métier à la structure adaptée.",
          "Le bon conteneur n'est pas 'le plus avancé' mais celui qui rend les opérations dominantes simples, sûres et performantes."
        ),
        table(
          ["Conteneur", "Accès dominant", "Cas typique"],
          [
            ["<code>std::vector</code>", "Indexation rapide, ajout en fin", "Choix par défaut pour une séquence dynamique."],
            ["<code>std::list</code>", "Parcours séquentiel, insertions/suppressions ciblées", "Cas rares où la liste chaînée a un vrai intérêt."],
            ["<code>std::deque</code>", "Accès indexé et insertions aux extrémités", "File double-bout."],
            ["<code>std::map</code>", "Recherche par clé triée", "Dictionnaire ordonné."],
            ["<code>std::unordered_map</code>", "Recherche rapide par clé", "Dictionnaire sans besoin d'ordre."],
            ["<code>std::set</code>", "Unicité + ordre", "Ensemble trié sans doublons."],
            ["<code>std::stack</code> / <code>std::queue</code>", "Accès contrôlé au sommet ou à la tête", "Pile LIFO ou file FIFO."]
          ]
        ),
        callout("warn", "Choix par défaut", "Dans la majorité des exercices et de nombreux projets réels, <code>std::vector</code> reste le premier choix raisonnable grâce à sa localité mémoire et à sa simplicité.")
      ),
      lesson(
        "Itérateurs et parcours",
        paragraphs(
          "Un itérateur est l'abstraction qui permet de parcourir un conteneur sans connaître sa représentation interne. Les algorithmes STL travaillent sur des plages d'itérateurs, pas directement sur des <code>vector</code> ou des <code>map</code> en dur.",
          "La paire <code>begin()</code> / <code>end()</code> délimite une séquence. <code>end()</code> ne désigne pas le dernier élément : c'est une sentinelle située juste après le dernier."
        ),
        code(
          "cpp",
          `
std::vector<int> valeurs{4, 1, 9, 2, 7};

for (std::vector<int>::iterator it = valeurs.begin(); it != valeurs.end(); ++it) {
    std::cout << *it << '\\n';
}

for (const auto& valeur : valeurs) {
    std::cout << valeur << '\\n';
}
          `,
          "Itérateur explicite puis boucle range-for"
        ),
        table(
          ["Catégorie", "Exemple", "Capacité clé"],
          [
            ["Input iterator", "<code>istream_iterator</code>", "Lecture en avant."],
            ["Forward iterator", "<code>forward_list</code>", "Parcours avant réutilisable."],
            ["Bidirectional iterator", "<code>list</code>, <code>map</code>", "Parcours avant et arrière."],
            ["Random access iterator", "<code>vector</code>, <code>deque</code>", "Sauts directs en O(1)."]
          ]
        ),
        callout("info", "Repère important", "Le type d'itérateur disponible conditionne certains algorithmes. Par exemple, <code>std::sort</code> attend des itérateurs à accès aléatoire.")
      ),
      lesson(
        "Algorithmes, foncteurs et lambdas",
        paragraphs(
          "Les algorithmes STL sont des fonctions template qui opèrent sur des plages d'itérateurs. Ils rendent le code plus déclaratif : au lieu de décrire toute la mécanique de la boucle, on exprime une intention comme trier, chercher, compter, transformer ou accumuler.",
          "Les foncteurs sont des objets appelables grâce à <code>operator()</code>. Aujourd'hui, les lambdas remplacent beaucoup de foncteurs simples, mais les deux idées restent utiles pour comprendre la STL."
        ),
        code(
          "cpp",
          `
std::vector<int> v{3, 1, 4, 1, 5, 9, 2, 6};

int nbUns = std::count(v.begin(), v.end(), 1);
auto pos = std::find(v.begin(), v.end(), 9);
std::sort(v.begin(), v.end(), std::greater<int>());
int somme = std::accumulate(v.begin(), v.end(), 0);

std::transform(v.begin(), v.end(), v.begin(), [](int x) {
    return x * 2;
});

auto last = std::unique(v.begin(), v.end());
v.erase(last, v.end());
          `,
          "Algorithmes STL"
        ),
        bullets([
          "Un prédicat est un foncteur ou une lambda qui renvoie un booléen.",
          "Une lambda courte améliore souvent la lecture ; si elle grossit, donne un nom à l'opération.",
          "Les algorithmes standards évitent de réécrire des boucles répétitives pour des tâches déjà nommées."
        ])
      ),
      lesson(
        "Pile, file et algorithmes copy/transform",
        paragraphs(
          "<code>std::stack</code> et <code>std::queue</code> sont des adaptateurs de conteneur qui imposent une discipline d'accès. Une pile (LIFO) ne donne accès qu'au sommet ; une file (FIFO) ne donne accès qu'à la tête. Ils se construisent sur <code>std::deque</code> par défaut et exposent une interface volontairement restreinte.",
          "<code>std::copy</code> et <code>std::transform</code> sont deux algorithmes fondamentaux souvent combinés. <code>copy</code> recopie une plage vers une destination ; <code>transform</code> applique une opération élément par élément. Ces deux algorithmes illustrent le style déclaratif : on décrit ce qu'on fait, pas comment itérer."
        ),
        code(
          "cpp",
          `
#include <stack>
#include <queue>

std::stack<int> pile;
pile.push(1); pile.push(2); pile.push(3);
while (!pile.empty()) {
    std::cout << pile.top() << '\\n';   // affiche 3, 2, 1
    pile.pop();
}

std::queue<std::string> file;
file.push("A"); file.push("B"); file.push("C");
while (!file.empty()) {
    std::cout << file.front() << '\\n'; // affiche A, B, C
    file.pop();
}
          `,
          "Pile LIFO et file FIFO"
        ),
        code(
          "cpp",
          `
#include <algorithm>
#include <cctype>

std::vector<char> source{'a', 'b', 'c', 'd'};
std::vector<char> dest(source.size());

// copy : recopie vers dest
std::copy(source.begin(), source.end(), dest.begin());

// transform : convertit en majuscules dans dest
std::transform(source.begin(), source.end(), dest.begin(), [](char c) {
    return static_cast<char>(std::toupper(c));
});
// dest = {'A', 'B', 'C', 'D'}

// tri classique
std::sort(dest.begin(), dest.end());
          `,
          "copy, transform et sort"
        ),
        table(
          ["Conteneur / Algorithme", "Rôle", "Méthodes clés"],
          [
            ["<code>std::stack&lt;T&gt;</code>", "Pile LIFO", "<code>push</code>, <code>top</code>, <code>pop</code>, <code>empty</code>"],
            ["<code>std::queue&lt;T&gt;</code>", "File FIFO", "<code>push</code>, <code>front</code>, <code>back</code>, <code>pop</code>, <code>empty</code>"],
            ["<code>std::copy</code>", "Recopie une plage", "Itérateurs source + itérateur destination"],
            ["<code>std::transform</code>", "Applique une fonction sur chaque élément", "Plage source + destination + foncteur/lambda"]
          ]
        ),
        callout("info", "Quand choisir stack/queue ?", "Préfère <code>std::stack</code> ou <code>std::queue</code> quand la sémantique d'accès restreint (LIFO/FIFO) est un invariant métier réel. Si tu as besoin d'un accès libre à n'importe quel élément, reste sur <code>std::vector</code>.")
      ),
      videoLesson(
        "Pour ancrer les réflexes génériques les plus rentables, cette sélection est la plus proche du contenu de ce chapitre dans la playlist.",
        [
          playlistVideo("templates", "pose clairement l'idée d'instanciation et de code générique"),
          playlistVideo("vectorUsage", "bon complément sur le conteneur par défaut du quotidien"),
          playlistVideo("lambdas", "prolonge directement la partie algorithmes STL et opérations locales")
        ]
      )
    ].join(""),
    checklist: [
      "Je comprends l'idée générale d'un template et de son instanciation.",
      "Je sais pourquoi les définitions de templates vivent généralement dans des headers.",
      "Je comprends qu'une classe template impose des contraintes implicites à son type paramètre.",
      "Je sais choisir un conteneur par défaut raisonnable.",
      "Je sais ce que représentent <code>begin()</code> et <code>end()</code>.",
      "Je reconnais l'intérêt des algorithmes STL.",
      "Je peux lire une lambda simple ou un prédicat.",
      "Je n'écris pas une boucle maison quand un algorithme standard raconte mieux l'intention.",
      "Je connais la différence entre LIFO (<code>std::stack</code>) et FIFO (<code>std::queue</code>).",
      "Je sais utiliser <code>std::copy</code> et <code>std::transform</code> avec des itérateurs."
    ],
    quiz: [
      {
        question: "Quel conteneur est le plus souvent le bon premier choix pour une séquence dynamique ?",
        options: ["<code>std::vector</code>", "<code>std::stack</code>", "<code>std::set</code>"],
        answer: 0,
        explanation: "<code>std::vector</code> offre un très bon compromis général et reste le conteneur de séquence par défaut."
      },
      {
        question: "Pourquoi utiliser <code>std::sort</code> plutôt qu'une boucle de tri réécrite à la main ?",
        options: [
          "Parce que les boucles sont interdites en C++",
          "Parce que l'algorithme standard exprime mieux l'intention et évite du code inutile",
          "Parce qu'il impose l'usage de pointeurs"
        ],
        answer: 1,
        explanation: "Les algorithmes standards augmentent la lisibilité et s'appuient sur des implémentations éprouvées."
      },
      {
        question: "Pourquoi la définition d'un template se trouve-t-elle souvent dans un fichier d'en-tête ?",
        options: [
          "Parce qu'un template doit être visible au compilateur au moment de l'instanciation",
          "Parce que les templates ne peuvent jamais contenir de code",
          "Parce que les headers s'exécutent plus vite que les sources"
        ],
        answer: 0,
        explanation: "Le compilateur doit voir la définition complète du template pour générer la version concrète utilisée."
      },
      {
        question: "Que représente <code>end()</code> sur un conteneur STL ?",
        options: [
          "Le dernier élément du conteneur",
          "Un élément nul ajouté automatiquement",
          "Une position sentinelle située juste après le dernier élément"
        ],
        answer: 2,
        explanation: "<code>end()</code> marque la fin de la plage ; on ne le déréférence pas."
      },
      {
        question: "Quelle est la différence fondamentale entre <code>std::stack</code> et <code>std::queue</code> ?",
        options: [
          "stack est trié, queue ne l'est pas",
          "stack donne accès au dernier élément entré (LIFO), queue au premier entré (FIFO)",
          "stack n'accepte que des entiers, queue accepte tous les types"
        ],
        answer: 1,
        explanation: "stack = Last In First Out (le sommet est le dernier entré) ; queue = First In First Out (on sort dans l'ordre d'arrivée)."
      }
    ],
    exercises: [
      {
        title: "Mini bibliothèque générique",
        difficulty: "Avancé",
        time: "30 min",
        prompt: "Écris une ou deux fonctions templates simples mais utiles, puis démontre-les sur plusieurs types en expliquant les contraintes imposées au type paramètre.",
        deliverables: [
          "les fonctions génériques",
          "des exemples sur au moins deux types",
          "les contraintes implicites sur le type paramètre"
        ]
      },
      {
        title: "Refonte STL",
        difficulty: "Intermédiaire",
        time: "25 min",
        prompt: "Prends un exercice avec tableaux et boucles répétitives puis réécris-le avec conteneurs STL, itérateurs et algorithmes standards.",
        deliverables: [
          "le conteneur choisi",
          "les algorithmes utilisés",
          "le gain de lisibilité obtenu"
        ]
      },
      {
        title: "Pile et file de Pokémons",
        difficulty: "Intermédiaire",
        time: "25 min",
        prompt: "Lis une liste de noms depuis un fichier, stocke-les dans une <code>std::queue</code>, puis utilise <code>std::transform</code> pour les convertir en majuscules dans un <code>std::vector</code>.",
        deliverables: [
          "la lecture et le remplissage de la queue",
          "la transformation avec std::transform",
          "l'affichage du résultat final"
        ]
      }
    ],
    keywords: ["template", "stl", "vector", "map", "unordered_map", "algorithm", "lambda", "iterateur", "foncteur", "predicat", "stack", "queue", "copy", "transform", "lifo", "fifo"]
  },
  {
    id: "exceptions-io",
    shortTitle: "Exceptions et I/O",
    title: "Exceptions, assertions et gestion des entrées/sorties",
    level: "Avancé",
    duration: "75 min",
    track: "SE5/SE6",
    summary:
      "Un programme solide n'ignore ni l'échec ni la donnée imparfaite. Le C++ fournit des flux, des exceptions et des assertions ; encore faut-il savoir les combiner intelligemment.",
    goals: [
      "distinguer erreur de programmation, cas métier et erreur système",
      "utiliser <code>try</code>/<code>catch</code> avec modération et propagation claire",
      "lire et écrire des fichiers texte de manière robuste"
    ],
    highlights: ["try/catch", "ifstream", "getline", "std::exception"],
    body: [
      lesson(
        "Architecture des flux en C++",
        paragraphs(
          "En C++, les entrées-sorties passent par des flux. Un flux est une abstraction d'un canal de communication : il peut représenter la console, un fichier, voire d'autres sources de données. Les mêmes opérateurs <code>&lt;&lt;</code> et <code>&gt;&gt;</code> servent alors à écrire ou lire sur plusieurs supports.",
          "Les trois flux standards sont <code>std::cout</code> pour la sortie normale, <code>std::cin</code> pour l'entrée et <code>std::cerr</code> pour les messages d'erreur immédiats. Cette hiérarchie commune explique pourquoi la syntaxe de base reste cohérente entre console et fichiers."
        ),
        table(
          ["Flux", "Rôle", "Remarque"],
          [
            ["<code>std::cout</code>", "Sortie standard", "Souvent bufferisée."],
            ["<code>std::cin</code>", "Entrée standard", "Lecture au clavier ou via redirection."],
            ["<code>std::cerr</code>", "Sortie d'erreur", "Affichage immédiat, utile pour le diagnostic."]
          ]
        ),
        code(
          "cpp",
          `
std::string nom{};
std::cout << "Nom : ";
std::cin >> nom;

if (nom.empty()) {
    std::cerr << "Nom invalide\\n";
}
          `,
          "Flux standards"
        ),
        callout("info", "Hiérarchie utile", "La bibliothèque <code>&lt;iostream&gt;</code> sert pour la console ; <code>&lt;fstream&gt;</code> prolonge cette logique pour les fichiers.")
      ),
      lesson(
        "Fichiers, ouverture et modes",
        paragraphs(
          "Un fichier physique est une suite d'octets sur disque ; le fichier logique est l'objet C++ qui permet de le manipuler. Les classes principales sont <code>std::ifstream</code> pour la lecture, <code>std::ofstream</code> pour l'écriture et <code>std::fstream</code> pour les deux.",
          "Les flux fichier sont déjà RAII : ils se ferment automatiquement à la sortie de portée. L'effort du développeur porte surtout sur l'ouverture correcte, le choix du mode, puis la validation du contenu lu."
        ),
        table(
          ["Mode", "Effet principal"],
          [
            ["<code>std::ios::in</code>", "Lecture."],
            ["<code>std::ios::out</code>", "Écriture."],
            ["<code>std::ios::app</code>", "Ajout en fin de fichier."],
            ["<code>std::ios::trunc</code>", "Vidage du fichier à l'ouverture."],
            ["<code>std::ios::binary</code>", "Mode binaire sans transformation de texte."]
          ]
        ),
        code(
          "cpp",
          `
std::ofstream journal{"journal.txt", std::ios::app};
journal << "Lancement du programme\\n";

std::ifstream input{"notes.txt"};
if (!input) {
    std::cerr << "Impossible d'ouvrir notes.txt\\n";
    return;
}

std::string ligne;
while (std::getline(input, ligne)) {
    std::cout << ligne << '\\n';
}
          `,
          "Écriture puis lecture texte"
        ),
        bullets([
          "Tester le flux juste après l'ouverture.",
          "Utiliser <code>std::getline</code> pour les lignes textuelles.",
          "Éviter <code>std::ios::trunc</code> involontaire quand on veut append.",
          "Séparer la logique de parsing de la logique métier."
        ])
      ),
      lesson(
        "État d'un flux, position et lecture robuste",
        paragraphs(
          "Un flux peut être valide, en fin de fichier, en erreur de format ou dans un état plus grave. Les méthodes <code>good()</code>, <code>fail()</code>, <code>bad()</code> et <code>eof()</code> servent à diagnostiquer l'état de la lecture.",
          "Pour les lectures formatées, l'idiome robuste est <code>while (flux &gt;&gt; valeur)</code>. Éviter <code>while (!flux.eof())</code>, qui lit souvent une itération de trop. Les fonctions <code>tellg</code>, <code>seekg</code>, <code>tellp</code> et <code>seekp</code> permettent en plus de repositionner le curseur dans un fichier."
        ),
        code(
          "cpp",
          `
std::ifstream input{"valeurs.txt"};
int valeur = 0;

while (input >> valeur) {
    std::cout << valeur << '\\n';
}

if (input.fail() && !input.eof()) {
    std::cerr << "Format invalide detecte\\n";
}
          `,
          "Lecture formatée robuste"
        ),
        code(
          "cpp",
          `
input.clear();
input.seekg(0, std::ios::beg);
auto position = input.tellg();
          `,
          "Repositionner le curseur"
        ),
        callout("warn", "Piège classique", "La condition <code>while (!flux.eof())</code> semble intuitive mais produit souvent un traitement supplémentaire après un échec de lecture.")
      ),
      lesson(
        "try, throw, catch et propagation",
        paragraphs(
          "Les exceptions existent pour séparer le chemin normal du traitement d'erreur lorsqu'on ne veut pas continuer silencieusement. Une division par zéro, une ressource indispensable absente ou un format impossible à interpréter sont des exemples de ruptures du flot normal.",
          "Quand une exception n'est pas capturée localement, elle remonte la pile d'appels jusqu'à trouver un bloc <code>catch</code>. Capturer par référence constante évite les copies inutiles et préserve le polymorphisme des hiérarchies d'exceptions."
        ),
        code(
          "cpp",
          `
int division(int a, int b) {
    if (b == 0) {
        throw std::runtime_error("division par zero");
    }
    return a / b;
}

try {
    std::cout << division(10, 0) << '\\n';
}
catch (const std::runtime_error& e) {
    std::cerr << e.what() << '\\n';
}
          `,
          "Try / throw / catch"
        ),
        code(
          "cpp",
          `
catch (const std::exception& e) {
    journaliser(e.what());
    throw;
}
          `,
          "Propagation vers un niveau supérieur"
        ),
        callout("warn", "Ordre des catches", "Les blocs <code>catch</code> sont testés dans l'ordre. Le plus spécifique doit venir avant le plus général, et <code>catch(...)</code> en dernier.")
      ),
      lesson(
        "Assertions, exceptions métier et std::exception",
        paragraphs(
          "Une assertion protège surtout une hypothèse interne du développeur. Une exception représente une erreur d'exécution que l'appelant doit pouvoir comprendre, propager ou traduire. Un simple message console, lui, ne suffit pas à structurer une API robuste.",
          "La bonne pratique moderne consiste à lancer des objets d'exception, idéalement dérivés de <code>std::exception</code>, afin de fournir un message via <code>what()</code>. Le mot-clé <code>noexcept</code> sert, lui, à signaler qu'une fonction ne doit pas lever d'exception."
        ),
        table(
          ["Mécanisme", "Usage principal"],
          [
            ["<code>assert</code>", "Hypothèse interne censée toujours être vraie."],
            ["Exception", "Erreur d'exécution récupérable ou propagable."],
            ["Message console", "Information utilisateur ou diagnostic ponctuel."]
          ]
        ),
        code(
          "cpp",
          `
class MonErreur : public std::exception {
public:
    explicit MonErreur(std::string message) : message_{std::move(message)} {}

    const char* what() const noexcept override {
        return message_.c_str();
    }

private:
    std::string message_;
};
          `,
          "Classe d'exception personnalisée"
        ),
        callout("success", "Niveau de capture", "Attrape une exception au niveau où tu peux vraiment décider quoi faire : corriger, relancer avec plus de contexte, journaliser ou arrêter proprement.")
      ),
      lesson(
        "Arguments de ligne de commande : argc et argv",
        paragraphs(
          "Tout programme C++ peut recevoir des arguments directement depuis le terminal. La signature étendue de <code>main</code> expose ces arguments via deux paramètres : <code>argc</code> (le nombre d'arguments, toujours au moins 1 car <code>argv[0]</code> est le nom du programme) et <code>argv</code> (le tableau de chaînes de caractères correspondant).",
          "C'est le mécanisme utilisé dans les TPs pour passer le nom d'un fichier en paramètre au lieu de le coder en dur dans le programme. Il suffit de vérifier <code>argc &gt;= 2</code> avant d'accéder à <code>argv[1]</code>."
        ),
        code(
          "cpp",
          `
// Lancement : ./mon_programme Tournoi.txt
int main(int argc, char* argv[]) {
    if (argc < 2) {
        std::cerr << "Usage : " << argv[0] << " <fichier>\\n";
        return 1;
    }

    std::string nomFichier{argv[1]};  // "Tournoi.txt"
    std::ifstream fichier{nomFichier};

    if (!fichier) {
        std::cerr << "Impossible d'ouvrir " << nomFichier << "\\n";
        return 1;
    }

    // lecture...
}
          `,
          "argc / argv : passer un fichier en argument"
        ),
        table(
          ["Variable", "Type", "Contenu"],
          [
            ["<code>argc</code>", "<code>int</code>", "Nombre d'arguments (≥ 1)."],
            ["<code>argv[0]</code>", "<code>char*</code>", "Nom ou chemin du programme."],
            ["<code>argv[1]</code>", "<code>char*</code>", "Premier argument fourni par l'utilisateur."],
            ["<code>argv[argc]</code>", "<code>nullptr</code>", "Sentinelle de fin du tableau."]
          ]
        ),
        callout("warn", "Toujours vérifier argc", "Accéder à <code>argv[1]</code> sans vérifier que <code>argc &gt;= 2</code> est un comportement indéfini si l'utilisateur n'a pas fourni d'argument.")
      ),
      lesson(
        "Formatage de la sortie avec <iomanip>",
        paragraphs(
          "Par défaut, <code>std::cout</code> affiche les données sans alignement particulier. Pour produire des tableaux alignés en colonnes, on utilise les manipulateurs de la bibliothèque <code>&lt;iomanip&gt;</code>. Ces manipulateurs modifient l'état du flux et restent actifs jusqu'au prochain changement.",
          "<code>std::setw(n)</code> réserve une largeur de <em>n</em> caractères pour le prochain champ. <code>std::left</code> et <code>std::right</code> contrôlent l'alignement. <code>std::setfill(c)</code> remplace les espaces vides par le caractère <em>c</em>. <code>std::setprecision(n)</code> limite le nombre de chiffres significatifs pour les réels."
        ),
        code(
          "cpp",
          `
#include <iomanip>

// En-tête aligné
std::cout << std::left
          << std::setw(15) << "Équipe"
          << std::setw(8)  << "Points"
          << std::setw(8)  << "Buts"
          << "\\n";
std::cout << std::string(31, '-') << "\\n";

// Ligne de données
std::cout << std::left
          << std::setw(15) << "France"
          << std::right
          << std::setw(8)  << 9
          << std::setw(8)  << 6
          << "\\n";

// Réels
double pi = 3.14159265;
std::cout << std::fixed << std::setprecision(2) << pi << "\\n"; // 3.14
          `,
          "Alignement en colonnes avec iomanip"
        ),
        table(
          ["Manipulateur", "Effet"],
          [
            ["<code>std::setw(n)</code>", "Largeur du prochain champ uniquement (non persistant)."],
            ["<code>std::left</code> / <code>std::right</code>", "Alignement du texte dans la largeur réservée (persistant)."],
            ["<code>std::setfill(c)</code>", "Caractère de remplissage (persistant, défaut : espace)."],
            ["<code>std::setprecision(n)</code>", "Nombre de chiffres significatifs ou décimaux (persistant)."],
            ["<code>std::fixed</code>", "Notation décimale fixe pour les réels (persistant)."]
          ]
        ),
        callout("warn", "setw n'est pas persistant", "<code>std::setw</code> s'applique uniquement au prochain champ affiché et se remet à zéro ensuite. Tous les autres manipulateurs de ce tableau persistent jusqu'à modification.")
      )
    ].join(""),
    checklist: [
      "Je distingue <code>std::cout</code>, <code>std::cin</code> et <code>std::cerr</code>.",
      "Je connais les rôles de <code>ifstream</code>, <code>ofstream</code> et <code>fstream</code>.",
      "Je vérifie l'ouverture d'un fichier et je choisis le bon mode.",
      "Je sais utiliser <code>std::getline</code> et l'idiome <code>while (flux >> valeur)</code>.",
      "Je distingue assertion et exception.",
      "Je ne traite pas les exceptions comme du contrôle de flux normal.",
      "Je capture une exception par référence constante.",
      "Je sépare parsing et logique métier.",
      "Je place mes <code>catch</code> au bon niveau de responsabilité.",
      "Je sais déclarer <code>main(int argc, char* argv[])</code> et accéder aux arguments en vérifiant <code>argc</code>.",
      "Je connais les manipulateurs de base de <code>&lt;iomanip&gt;</code> pour aligner des sorties en colonnes."
    ],
    quiz: [
      {
        question: "Quel cas correspond le mieux à une assertion ?",
        options: [
          "Un fichier utilisateur absent",
          "Une hypothèse interne supposée toujours vraie dans le code",
          "Une saisie invalide fréquente"
        ],
        answer: 1,
        explanation: "L'assertion documente une hypothèse de programmation, pas un aléa normal d'exécution."
      },
      {
        question: "Que faut-il faire juste après avoir construit un <code>std::ifstream</code> ?",
        options: [
          "Le convertir en pointeur",
          "Vérifier que l'ouverture a réussi",
          "Appeler explicitement son destructeur"
        ],
        answer: 1,
        explanation: "Un flux invalide n'indique pas toujours une exception ; il faut contrôler son état."
      },
      {
        question: "Pourquoi capture-t-on en général les exceptions par référence constante ?",
        options: [
          "Pour empêcher toute propagation future",
          "Pour éviter une copie inutile et conserver le polymorphisme",
          "Parce que catch interdit les objets par valeur"
        ],
        answer: 1,
        explanation: "La capture par référence constante évite les copies et préserve le type dynamique de l'exception."
      },
      {
        question: "Quel idiome est le plus sûr pour lire une suite de valeurs formatées ?",
        options: [
          "<code>while (!ifs.eof())</code>",
          "<code>while (ifs >> valeur)</code>",
          "<code>while (true)</code>"
        ],
        answer: 1,
        explanation: "La condition <code>while (ifs >> valeur)</code> s'arrête exactement quand la lecture échoue."
      },
      {
        question: "Que contient <code>argv[0]</code> ?",
        options: [
          "Le premier argument passé par l'utilisateur",
          "Le nom ou chemin du programme lui-même",
          "Toujours la valeur <code>nullptr</code>"
        ],
        answer: 1,
        explanation: "argv[0] est le nom du programme ; les arguments utilisateur commencent à argv[1]."
      },
      {
        question: "Lequel de ces manipulateurs <code>&lt;iomanip&gt;</code> n'est PAS persistant ?",
        options: [
          "<code>std::left</code>",
          "<code>std::setw(10)</code>",
          "<code>std::setprecision(3)</code>"
        ],
        answer: 1,
        explanation: "std::setw s'applique uniquement au prochain champ affiché, puis se réinitialise. Les autres manipulateurs persistent."
      }
    ],
    exercises: [
      {
        title: "Classement en colonnes",
        difficulty: "Facile",
        time: "20 min",
        prompt: "Reçois un nom de fichier via <code>argv[1]</code>, lis des lignes \"equipe;points;buts\" et affiche un tableau aligné avec <code>&lt;iomanip&gt;</code>.",
        deliverables: [
          "vérification de argc avant lecture",
          "ouverture robuste du fichier",
          "affichage formaté en colonnes alignées"
        ]
      },
      {
        title: "Chargeur de notes",
        difficulty: "Intermédiaire",
        time: "25 min",
        prompt: "Lis un fichier de notes, détecte les lignes invalides, distingue erreur d'ouverture et erreur de format, puis construis un résumé statistique clair.",
        deliverables: [
          "ouverture robuste du fichier",
          "gestion d'une ligne invalide",
          "résumé final"
        ]
      },
      {
        title: "API qui sait échouer proprement",
        difficulty: "Avancé",
        time: "30 min",
        prompt: "Conçois une petite API dont certaines opérations lèvent une exception métier, puis décide à quel niveau l'attraper dans le programme principal.",
        deliverables: [
          "l'exception levée",
          "le niveau de capture choisi",
          "la justification architecturale"
        ]
      }
    ],
    keywords: ["exception", "assert", "ifstream", "ofstream", "runtime_error", "parsing", "getline", "cerr", "seekg", "tellg", "noexcept", "std::exception", "argc", "argv", "iomanip", "setw", "setfill", "setprecision"]
  },
  {
    id: "modern-cpp",
    shortTitle: "Modern C++",
    title: "Réflexes de C++ moderne : auto, range-for, optional et plus",
    level: "Avancé",
    duration: "40 min",
    track: "Extension",
    summary:
      "Le C++ moderne n'est pas juste une liste de nouveautés. C'est une manière de réduire la friction, mieux exprimer l'intention et s'appuyer davantage sur la bibliothèque standard.",
    goals: [
      "utiliser <code>auto</code> avec discernement",
      "connaître quelques outils modernes très rentables",
      "éviter le modernisme décoratif sans gain de clarté"
    ],
    highlights: ["auto", "optional", "structured bindings"],
    body: [
      lesson(
        "Utiliser <code>auto</code> sans perdre le lecteur",
        paragraphs(
          "<code>auto</code> est excellent quand le type est évident à droite ou franchement verbeux à gauche. Il devient nuisible lorsqu'il masque un type sémantiquement important pour la compréhension.",
          "La vraie question n'est pas 'faut-il utiliser auto ?' mais 'est-ce que cette ligne reste lisible pour quelqu'un qui ne connaît pas l'implémentation par cœur ?'."
        ),
        code(
          "cpp",
          `
auto compteur = 0;                       // lisible
auto it = tableDeSymboles.begin();       // utile
std::optional<double> moyenne = calculerMoyenne(notes);
          `,
          "auto utile"
        ),
        callout("warn", "Mesure", "N'utilise pas <code>auto</code> juste pour faire moderne. La lisibilité reste le critère principal.")
      ),
      lesson(
        "Des outils très rentables",
        paragraphs(
          "<code>std::optional</code> exprime l'absence possible d'une valeur sans passer par un code magique comme <code>-1</code>. Les <em>structured bindings</em> rendent la déstructuration de paires et tuples très lisible. Le <em>range-based for</em> simplifie le parcours.",
          "Ces outils réduisent les conventions implicites et rendent les contrats de données plus honnêtes."
        ),
        code(
          "cpp",
          `
std::optional<int> trouverPremierPair(const std::vector<int>& valeurs) {
    for (int valeur : valeurs) {
        if (valeur % 2 == 0) {
            return valeur;
        }
    }
    return std::nullopt;
}

for (const auto& [nom, note] : notesParEtudiant) {
    std::cout << nom << " -> " << note << std::endl;
}
          `,
          "optional et structured bindings"
        ),
        bullets([
          "<code>std::string_view</code> est utile pour observer une chaîne sans la copier.",
          "<code>[[nodiscard]]</code> aide à faire respecter certaines valeurs de retour.",
          "Les lambdas courtes améliorent souvent la lecture des algorithmes STL."
        ])
      ),
      lesson(
        "Moderniser sans bruit",
        paragraphs(
          "Le risque d'un code 'moderne' est de devenir démonstratif plutôt que pédagogique. Il faut préférer quelques outils bien compris à une accumulation de nouveautés dispersées.",
          "En contexte ING2, l'objectif est d'écrire du code plus fiable et plus clair, pas de collectionner les mots-clés récents."
        ),
        callout("success", "Ligne directrice", "Une nouveauté de langage mérite sa place si elle retire une convention implicite fragile ou rend l'intention plus explicite.")
      ),
      videoLesson(
        "Pour ce chapitre de consolidation, voici les vidéos les plus cohérentes avec les outils modernes déjà présentés dans le cours.",
        [
          playlistVideo("autoKeyword", "utile pour cadrer un usage sobre de <code>auto</code>"),
          playlistVideo("lambdas", "complète bien les algorithmes STL et les petites fonctions locales"),
          playlistVideo("structuredBindings", "prolonge directement la partie déstructuration lisible")
        ]
      )
    ].join(""),
    checklist: [
      "Je sais quand <code>auto</code> améliore réellement la lisibilité.",
      "Je peux citer un usage pertinent de <code>std::optional</code>.",
      "Je sais lire des structured bindings simples.",
      "Je garde une modernisation sobre et motivée.",
      "Je privilégie l'intention plutôt que l'effet de style."
    ],
    quiz: [
      {
        question: "Quel outil exprime proprement l'absence possible d'une valeur ?",
        options: ["<code>std::optional</code>", "<code>std::thread</code>", "<code>std::array</code>"],
        answer: 0,
        explanation: "<code>std::optional</code> rend explicite le fait qu'une valeur peut être présente ou absente."
      },
      {
        question: "Quand <code>auto</code> est-il le plus justifié ?",
        options: [
          "Quand il masque un type crucial pour comprendre la ligne",
          "Quand le type est évident ou très verbeux à écrire",
          "Quand on veut gagner quelques caractères sans autre raison"
        ],
        answer: 1,
        explanation: "Le gain recherché est la clarté, pas seulement la brièveté."
      }
    ],
    exercises: [
      {
        title: "Refonte moderne ciblée",
        difficulty: "Intermédiaire",
        time: "20 min",
        prompt: "Prends un petit exercice existant et introduis seulement trois améliorations modernes justifiées : pas plus.",
        deliverables: [
          "les trois outils choisis",
          "la raison de chaque choix",
          "le code avant / après"
        ]
      },
      {
        title: "Absence explicite",
        difficulty: "Facile",
        time: "15 min",
        prompt: "Remplace un code de retour spécial comme <code>-1</code> ou chaîne vide par <code>std::optional</code>.",
        deliverables: [
          "l'ancienne convention",
          "la nouvelle signature",
          "un appelant adapté"
        ]
      }
    ],
    keywords: ["auto", "optional", "structured bindings", "modern cpp", "string_view", "nodiscard"]
  },
  {
    id: "concurrence-threads",
    shortTitle: "Concurrence",
    title: "Threads, synchronisation et programmation concurrente",
    level: "Avancé",
    duration: "55 min",
    track: "Extension",
    summary:
      "Le C++11 a intégré un modèle de threads portable dans la bibliothèque standard. Ce chapitre pose les bases de la concurrence : créer des threads, protéger des données partagées et exprimer des tâches asynchrones de façon sûre.",
    goals: [
      "créer et synchroniser des <code>std::thread</code> avec <code>join()</code>",
      "protéger une ressource partagée avec <code>std::mutex</code> et <code>std::lock_guard</code>",
      "déléguer une tâche asynchrone avec <code>std::async</code> et récupérer son résultat via <code>std::future</code>"
    ],
    highlights: ["thread", "mutex", "async", "future"],
    body: [
      lesson(
        "Le modèle de concurrence du C++",
        paragraphs(
          "Depuis C++11, la norme inclut un modèle de mémoire multithreads et une bibliothèque de concurrence portable. Un <em>thread</em> est un fil d'exécution indépendant qui partage la mémoire du processus avec les autres threads.",
          "La difficulté fondamentale est que plusieurs threads accédant à la même donnée sans synchronisation créent un <em>data race</em> : comportement indéfini garanti. Comprendre ce risque avant d'écrire du code concurrent est la première étape indispensable."
        ),
        table(
          ["Abstraction", "Rôle"],
          [
            ["<code>std::thread</code>", "Créer et gérer un fil d'exécution."],
            ["<code>std::mutex</code>", "Protéger une section critique."],
            ["<code>std::lock_guard</code>", "Verrouillage RAII d'un mutex."],
            ["<code>std::async</code>", "Lancer une tâche asynchrone avec retour de valeur."],
            ["<code>std::future</code>", "Récupérer le résultat d'une tâche asynchrone."]
          ]
        ),
        callout("warn", "Data race : comportement indéfini", "Lire et écrire la même variable depuis plusieurs threads sans synchronisation est un comportement indéfini. Le programme peut sembler fonctionner, puis se comporter de façon erratique sous charge.")
      ),
      lesson(
        "std::thread : création, join et detach",
        paragraphs(
          "Un <code>std::thread</code> démarre à sa construction et exécute la fonction passée en argument. Avant la destruction de l'objet thread, il faut impérativement appeler <code>join()</code> ou <code>detach()</code>, sous peine de termination du programme.",
          "<code>join()</code> bloque le thread appelant jusqu'à la fin du thread cible. <code>detach()</code> laisse le thread vivre indépendamment, sans possibilité de récupérer son résultat ni de détecter sa fin. Dans la majorité des cas pédagogiques, <code>join()</code> est le bon choix."
        ),
        code(
          "cpp",
          `
#include <thread>
#include <iostream>

void traitement(int id) {
    std::cout << "Thread " << id << " en cours\\n";
}

int main() {
    std::thread t1{traitement, 1};
    std::thread t2{traitement, 2};

    t1.join();
    t2.join();

    std::cout << "Tous les threads ont terminé\\n";
}
          `,
          "Création et synchronisation de threads"
        ),
        code(
          "cpp",
          `
std::thread t{[](int n) {
    for (int i = 0; i < n; ++i) {
        std::cout << i << '\\n';
    }
}, 5};

t.join();
          `,
          "Thread avec lambda"
        ),
        callout("danger", "Piège majeur", "Si un objet <code>std::thread</code> est détruit sans join ni detach, le programme appelle <code>std::terminate()</code>. Utilise un garde RAII ou vérifie toujours l'état avant la destruction de l'objet.")
      ),
      lesson(
        "Mutex, lock_guard et protection des données partagées",
        paragraphs(
          "Le mutex est la primitive de synchronisation de base. Il garantit qu'un seul thread à la fois accède à une section critique. <code>std::lock_guard</code> verrouille le mutex à la construction et le déverrouille automatiquement à la destruction, suivant le principe RAII.",
          "Il faut protéger tous les accès à une donnée partagée, en lecture comme en écriture. Un mutex appliqué seulement aux écritures laisse passer les data races sur les lectures concurrentes."
        ),
        code(
          "cpp",
          `
#include <mutex>
#include <thread>
#include <iostream>

std::mutex verrou;
int compteur{0};

void incrementer(int n) {
    for (int i = 0; i < n; ++i) {
        std::lock_guard<std::mutex> garde{verrou};
        ++compteur;
    }
}

int main() {
    std::thread t1{incrementer, 1000};
    std::thread t2{incrementer, 1000};
    t1.join();
    t2.join();
    std::cout << compteur << '\\n'; // garantit 2000
}
          `,
          "Compteur partagé protégé"
        ),
        bullets([
          "<code>std::lock_guard</code> est libéré automatiquement même en cas d'exception.",
          "Minimise la taille de la section critique pour ne pas bloquer les autres threads inutilement.",
          "<code>std::unique_lock</code> est plus flexible que <code>lock_guard</code> mais implique un coût supplémentaire.",
          "Acquérir plusieurs mutex dans des ordres différents selon les threads est la recette classique du deadlock."
        ])
      ),
      lesson(
        "std::async et std::future : tâches asynchrones de haut niveau",
        paragraphs(
          "<code>std::async</code> lance une tâche dans un thread séparé et renvoie un <code>std::future</code>. Ce future permet de récupérer le résultat plus tard, de façon synchronisée, sans gérer soi-même les threads ni les mutex.",
          "C'est souvent l'abstraction la plus pratique pour un calcul parallèle ponctuel : on démarre les tâches, on continue d'autres traitements si possible, puis on récupère les résultats quand on en a besoin."
        ),
        code(
          "cpp",
          `
#include <future>
#include <iostream>

int calculerSomme(int debut, int fin) {
    int total = 0;
    for (int i = debut; i <= fin; ++i) {
        total += i;
    }
    return total;
}

int main() {
    auto f1 = std::async(std::launch::async, calculerSomme, 1, 5000);
    auto f2 = std::async(std::launch::async, calculerSomme, 5001, 10000);

    int resultat = f1.get() + f2.get();
    std::cout << "Somme : " << resultat << '\\n';
}
          `,
          "Calcul parallèle avec async"
        ),
        table(
          ["Méthode", "Comportement"],
          [
            ["<code>.get()</code>", "Bloque jusqu'au résultat et le retourne (ou relance l'exception levée dans la tâche)."],
            ["<code>.wait()</code>", "Bloque sans récupérer la valeur."],
            ["<code>.valid()</code>", "Vérifie si le future est associé à une valeur en attente."]
          ]
        ),
        callout("info", "std::launch::async", "Sans la politique <code>std::launch::async</code> explicite, l'exécution peut être différée (lazy). Spécifie-la pour garantir un vrai parallélisme.")
      )
    ].join(""),
    checklist: [
      "Je comprends ce qu'est un data race et pourquoi c'est un comportement indéfini.",
      "Je sais créer un thread, lui passer des arguments et appeler <code>join()</code>.",
      "Je protège les données partagées avec un mutex et <code>std::lock_guard</code>.",
      "Je connais la différence de sémantique entre <code>join()</code> et <code>detach()</code>.",
      "Je sais utiliser <code>std::async</code> pour déléguer un calcul dans un thread.",
      "Je récupère un résultat asynchrone via <code>std::future::get()</code>.",
      "Je minimise les sections critiques pour éviter les contentions inutiles."
    ],
    quiz: [
      {
        question: "Que se passe-t-il si un <code>std::thread</code> est détruit sans avoir été rejoint ni détaché ?",
        options: [
          "Le thread continue silencieusement en arrière-plan",
          "Le programme appelle <code>std::terminate()</code>",
          "Le thread est automatiquement rejoint par le runtime"
        ],
        answer: 1,
        explanation: "Détruire un thread joignable sans join ni detach déclenche <code>std::terminate()</code> : c'est une erreur de conception, pas un simple warning."
      },
      {
        question: "Quel outil garantit le déverrouillage d'un mutex même en cas d'exception ?",
        options: [
          "<code>std::thread</code>",
          "<code>std::lock_guard</code>",
          "<code>std::future</code>"
        ],
        answer: 1,
        explanation: "<code>lock_guard</code> suit le principe RAII : il déverrouille le mutex dans son destructeur, quelle que soit la cause de sortie de la portée."
      },
      {
        question: "Comment récupérer le résultat d'une tâche lancée avec <code>std::async</code> ?",
        options: [
          "En appelant <code>.result()</code> sur le thread",
          "En appelant <code>.get()</code> sur le <code>std::future</code> retourné",
          "En lisant directement la variable globale modifiée par la tâche"
        ],
        answer: 1,
        explanation: "<code>std::async</code> renvoie un <code>std::future</code> ; <code>.get()</code> bloque jusqu'à disponibilité du résultat et le retourne, ou relance l'exception."
      }
    ],
    exercises: [
      {
        title: "Calcul parallèle de statistiques",
        difficulty: "Avancé",
        time: "35 min",
        prompt: "Calcule la somme et la valeur maximale d'un grand vecteur en divisant le travail entre deux tâches <code>std::async</code>, puis agrège les résultats.",
        deliverables: [
          "les deux tâches asynchrones avec leur plage respective",
          "la récupération et l'agrégation correcte des résultats",
          "une vérification que le résultat est identique à la version séquentielle"
        ]
      },
      {
        title: "Compteur thread-safe encapsulé",
        difficulty: "Intermédiaire",
        time: "25 min",
        prompt: "Crée une classe <code>CompteurSur</code> qui encapsule un entier et un mutex pour garantir des incréments et lectures cohérents depuis plusieurs threads simultanés.",
        deliverables: [
          "la classe avec son mutex interne",
          "une démonstration avec deux threads qui incrémentent simultanément",
          "la vérification que le résultat final est toujours correct quel que soit l'entrelacement"
        ]
      }
    ],
    keywords: ["thread", "mutex", "lock_guard", "async", "future", "concurrence", "parallelisme", "synchronisation", "data race", "join", "detach"]
  },
  {
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
  }
];

// Chapitre tests-qualite inséré avant architecture-projet via splice pour conserver l'ordre
rawChapters.splice(rawChapters.length - 1, 0, {
    id: "tests-qualite",
    shortTitle: "Tests et qualité",
    title: "Tests unitaires, TDD et qualité du code C++",
    level: "Projet",
    duration: "45 min",
    track: "Extension",
    summary:
      "Un code non testé est un code dont on ignore le comportement réel. Ce chapitre introduit les principes de vérification automatique, l'outillage pratique avec Catch2 et la discipline TDD pour écrire du C++ fiable.",
    goals: [
      "distinguer tests unitaires, tests d'intégration et tests de système",
      "écrire des cas de test lisibles avec Catch2 et les macros <code>REQUIRE</code> / <code>CHECK</code>",
      "comprendre et appliquer le cycle TDD rouge-vert-refactoring"
    ],
    highlights: ["REQUIRE", "Catch2", "TDD"],
    body: [
      lesson(
        "Pourquoi tester et quelle stratégie adopter",
        paragraphs(
          "Un test est une affirmation exécutable : pour cette entrée, j'attends cette sortie. Quand il échoue, il localise un problème précis. Sans tests, chaque modification du code risque d'introduire silencieusement une régression.",
          "On distingue les tests unitaires, qui vérifient un module en isolation, les tests d'intégration, qui vérifient la coopération entre modules, et les tests de système, qui vérifient l'ensemble. En C++ pédagogique, les tests unitaires sont le point d'entrée le plus rentable."
        ),
        table(
          ["Type", "Cible", "Isolation"],
          [
            ["Test unitaire", "Une classe ou une fonction", "Maximale : dépendances minimales ou substituées."],
            ["Test d'intégration", "Plusieurs modules ensemble", "Partielle."],
            ["Test de système", "Comportement complet du programme", "Nulle."]
          ]
        ),
        callout("success", "Bonne règle de départ", "Un test unitaire doit être rapide, déterministe et ne tester qu'une seule chose à la fois.")
      ),
      lesson(
        "Premiers tests avec Catch2",
        paragraphs(
          "Catch2 est un framework de tests header-only très répandu en C++. Il permet d'écrire des cas de test lisibles avec des macros comme <code>TEST_CASE</code>, <code>REQUIRE</code> et <code>CHECK</code>.",
          "<code>REQUIRE</code> interrompt le test courant en cas d'échec ; <code>CHECK</code> continue et rapporte tous les échecs accumulés. L'enjeu est d'écrire des tests qui documentent le comportement attendu, pas seulement ceux qui 'semblent passer'."
        ),
        code(
          "cpp",
          `
#define CATCH_CONFIG_MAIN
#include <catch2/catch.hpp>

#include "fraction.h"

TEST_CASE("Fraction : valeur décimale correcte") {
    Fraction f{1, 4};
    REQUIRE(f.valeur() == Approx(0.25));
}

TEST_CASE("Fraction : dénominateur nul interdit") {
    REQUIRE_THROWS_AS(Fraction(1, 0), std::invalid_argument);
}

TEST_CASE("Fraction : addition de deux fractions") {
    Fraction a{1, 2};
    Fraction b{1, 3};
    Fraction c = a + b;
    REQUIRE(c.valeur() == Approx(5.0 / 6.0));
}
          `,
          "Tests Catch2 simples"
        ),
        bullets([
          "<code>Approx</code> gère les comparaisons à virgule flottante avec une tolérance configurable.",
          "Le nom du <code>TEST_CASE</code> décrit le comportement testé, pas l'implémentation.",
          "Couvre au minimum : cas normal, valeur limite, erreur attendue."
        ]),
        callout("info", "Intégration dans CMake", "Catch2 s'intègre facilement avec CMake via <code>FetchContent</code> ou un sous-module git, sans dépendance externe à installer manuellement.")
      ),
      lesson(
        "TDD : rouge, vert, refactoring",
        paragraphs(
          "Le Test-Driven Development propose d'écrire le test avant le code. Le cycle est : rouge (le test échoue car le code n'existe pas), vert (écrire le minimum pour faire passer le test), refactoring (améliorer sans casser les tests existants).",
          "Cette discipline force à penser l'API depuis l'usage avant de concevoir l'implémentation. Les interfaces qui émergent du TDD sont souvent plus simples et mieux délimitées."
        ),
        code(
          "cpp",
          `
// Étape 1 — Rouge : le test est écrit en premier
TEST_CASE("CompteBancaire : un dépôt augmente le solde") {
    CompteBancaire compte{100.0};
    compte.deposer(50.0);
    REQUIRE(compte.solde() == Approx(150.0));
}

// Étape 2 — Vert : implémentation minimale pour passer le test
class CompteBancaire {
public:
    explicit CompteBancaire(double solde) : solde_{solde} {}
    void deposer(double montant) { solde_ += montant; }
    double solde() const { return solde_; }
private:
    double solde_;
};

// Étape 3 — Refactoring : ajouter les contraintes et améliorer
          `,
          "Cycle TDD illustré sur CompteBancaire"
        ),
        callout("info", "TDD n'est pas obligatoire partout", "TDD est une pratique, pas une règle absolue. L'essentiel est d'avoir des tests utiles ; leur ordre d'écriture dépend du contexte et de la maturité du projet.")
      ),
      lesson(
        "Ce qu'un bon test vérifie — et ce qu'il évite",
        paragraphs(
          "Un bon test vérifie le comportement observable, pas les détails d'implémentation. Un test qui dépend des noms de méthodes privées ou du layout interne casse à chaque refactoring sain et décourage la maintenance.",
          "Les cas limites méritent une attention particulière : valeurs nulles, bords de tableau, fichier inexistant, entrée maximale. Ce sont souvent les oublis qui créent des bugs en production."
        ),
        table(
          ["À tester", "À éviter dans un test unitaire"],
          [
            ["Comportement observable par l'interface publique", "Détails d'implémentation internes."],
            ["Cas limites et comportements en erreur", "Logique triviale sans branche réelle."],
            ["Invariants importants de la classe", "Noms de membres ou méthodes privées."],
            ["Contrats des signatures publiques", "Ordre interne d'exécution."]
          ]
        ),
        callout("warn", "Fausse sécurité", "Un taux de couverture élevé ne signifie pas que les bons cas sont testés. Quelques tests précis sur les invariants valent mieux que beaucoup de tests superficiels.")
      )
    ].join(""),
    checklist: [
      "Je sais distinguer test unitaire, d'intégration et de système.",
      "Je peux écrire un test simple avec <code>REQUIRE</code> et <code>CHECK</code>.",
      "Je teste les cas normaux, les cas limites et les cas d'erreur.",
      "Je comprends le cycle TDD rouge-vert-refactoring.",
      "Je ne teste pas les détails d'implémentation internes.",
      "Je nomme mes tests par le comportement attendu, pas par le mécanisme."
    ],
    quiz: [
      {
        question: "Quel est le but premier d'un test unitaire ?",
        options: [
          "Prouver que le programme compile sans erreur ni warning",
          "Vérifier le comportement d'une unité en isolation et détecter les régressions",
          "Remplacer la relecture de code par un pair"
        ],
        answer: 1,
        explanation: "Un test unitaire documente le comportement attendu et alerte automatiquement en cas de régression lors d'une modification future."
      },
      {
        question: "Dans le cycle TDD, que désigne la phase 'rouge' ?",
        options: [
          "Le code produit une erreur mémoire à l'exécution",
          "Un test écrit avant le code échoue, comme prévu",
          "La compilation produit des warnings bloquants"
        ],
        answer: 1,
        explanation: "En TDD, le test est écrit en premier : il échoue d'abord (rouge) parce que le code n'existe pas encore, puis on implémente pour le faire passer (vert)."
      },
      {
        question: "Quelle macro Catch2 interrompt immédiatement le test en cas d'échec ?",
        options: ["<code>CHECK</code>", "<code>REQUIRE</code>", "<code>WARN</code>"],
        answer: 1,
        explanation: "<code>REQUIRE</code> arrête le test courant à l'échec ; <code>CHECK</code> continue et rapporte tous les problèmes rencontrés dans le test."
      }
    ],
    exercises: [
      {
        title: "Suite de tests pour Fraction",
        difficulty: "Intermédiaire",
        time: "30 min",
        prompt: "Écris une suite de tests Catch2 pour une classe <code>Fraction</code> : cas normaux, cas limites et exceptions.",
        deliverables: [
          "au moins cinq tests couvrant des comportements distincts",
          "un test d'erreur avec <code>REQUIRE_THROWS_AS</code>",
          "un bref commentaire sur les cas qui restent non couverts"
        ]
      },
      {
        title: "Mini session TDD sur une Pile générique",
        difficulty: "Avancé",
        time: "40 min",
        prompt: "Développe une classe <code>Pile&lt;T&gt;</code> en TDD : rédige d'abord les tests, implémente ensuite le strict minimum pour les faire passer.",
        deliverables: [
          "les tests rédigés avant toute implémentation",
          "l'implémentation minimale qui fait passer les tests",
          "les cas limites couverts : pile vide, dépilement sur pile vide"
        ]
      }
    ],
    keywords: ["tests", "catch2", "tdd", "assert", "REQUIRE", "unitaire", "integration", "regression", "qualite", "test case", "rouge vert"]
  }
);

const lessonDeepDivesByChapter = {
  "vision-outillage": [
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
  ],
  "fondamentaux-syntaxe": [
    {
      focus: "Cette première leçon doit être lue comme un vrai point de départ. Avant de penser objets, templates ou STL, il faut savoir reconnaître la forme d'un programme C++ : ce qui importe au compilateur, ce qui sera exécuté par la machine et ce qui relève simplement de l'organisation du fichier.",
      retenir: [
        "Le programme démarre dans la fonction main.",
        "Les includes rendent accessibles des bibliothèques ; ils ne sont pas de simples décorations."
      ],
      pitfalls: [
        "Voir les accolades, les points-virgules ou les includes comme une pure contrainte de syntaxe sans comprendre leur rôle.",
        "Penser qu'il faut connaître le C historique avant de pouvoir lire un programme C++ moderne."
      ],
      method: [
        "Relis chaque ligne d'un programme minimal en expliquant son rôle à voix haute.",
        "Distingue ce qui déclare, ce qui exécute et ce qui structure le code.",
        "Teste ensuite une petite variation du programme pour vérifier que tu maîtrises la structure."
      ],
      check: "Peux-tu expliquer le rôle exact de #include, de main, des accolades et d'une instruction terminée par un point-virgule ?"
    },
    {
      focus: "Les variables sont les premières briques concrètes du langage. Le vrai enjeu n'est pas seulement de savoir les déclarer, mais de comprendre qu'un type restreint volontairement les valeurs possibles et rend certaines erreurs visibles plus tôt.",
      retenir: [
        "Le type d'une variable exprime la nature de la donnée manipulée.",
        "Une affectation modifie une valeur existante, mais ne change jamais le type déclaré."
      ],
      pitfalls: [
        "Choisir un type parce qu'il 'compile' au lieu de choisir celui qui décrit bien la donnée.",
        "Utiliser des noms vagues qui empêchent de comprendre le rôle de la variable."
      ],
      method: [
        "Décris en français ce que contient chaque variable avant de coder.",
        "Associe ensuite cette donnée à un type clair et à un nom explicite.",
        "Vérifie enfin ce qui change au cours du programme et ce qui devrait rester stable."
      ],
      check: "Saurais-tu expliquer pourquoi age, moyenne et admis ne devraient pas tous utiliser le même type ?"
    },
    {
      focus: "L'entrée et la sortie console permettent de relier immédiatement syntaxe et comportement. C'est une excellente zone d'entraînement, car le programme dialogue tout de suite avec l'utilisateur et montre très vite si l'on manipule correctement texte et valeurs.",
      retenir: [
        "std::cout écrit vers la console ; std::cin lit depuis la console.",
        "std::string doit être ton outil de base pour le texte applicatif."
      ],
      pitfalls: [
        "Croire que le texte en C++ doit être manipulé avec des tableaux de char dès le départ.",
        "Mélanger lecture utilisateur, logique métier et formatage d'affichage sans structure."
      ],
      method: [
        "Commence par faire afficher une valeur simple.",
        "Ajoute ensuite une lecture utilisateur sur un type facile comme string ou int.",
        "Observe comment les opérateurs << et >> racontent le sens du flux."
      ],
      check: "Peux-tu expliquer la différence de rôle entre std::cout, std::cin et std::string dans un petit programme interactif ?"
    },
    {
      focus: "Initialiser correctement une valeur dès sa création est une habitude décisive. Cela réduit les états flous, rend les invariants plus lisibles et prépare très tôt à des classes saines lorsqu'on passera à la programmation objet.",
      retenir: [
        "Les accolades homogénéisent l'écriture et aident à bloquer certaines conversions réductrices.",
        "const et constexpr servent à exprimer des degrés différents de stabilité."
      ],
      pitfalls: [
        "Reporter l'initialisation à plus tard alors que la bonne valeur est déjà connue.",
        "Confondre une simple convention de style avec une vraie garantie de sécurité."
      ],
      method: [
        "Cherche la valeur correcte au moment de la création de la variable.",
        "Décide si cette valeur doit rester stable à l'exécution ou même dès la compilation.",
        "Utilise enum class quand tu veux modéliser des états métiers nommés."
      ],
      check: "Sais-tu repérer quand une variable devrait être const, constexpr ou carrément remplacée par un enum class ?"
    },
    {
      focus: "Les conditions sont la première forme de prise de décision dans le programme. Leur difficulté n'est pas syntaxique, mais sémantique : une bonne condition doit exprimer un critère métier clair et éviter toute ambiguïté de lecture.",
      retenir: [
        "== compare ; = affecte.",
        "Les opérateurs logiques combinent des règles, ils ne doivent pas les obscurcir."
      ],
      pitfalls: [
        "Écrire une condition correcte techniquement mais illisible humainement.",
        "Accumuler plusieurs négations ou comparaisons sans clarifier l'intention."
      ],
      method: [
        "Formule d'abord la règle métier en français.",
        "Traduis-la ensuite en comparaison simple puis en combinaison logique si nécessaire.",
        "Relis la condition comme une phrase pour vérifier qu'elle raconte bien ce que tu veux."
      ],
      check: "Peux-tu justifier chaque symbole d'une condition sans dire seulement 'c'est la syntaxe' ?"
    },
    {
      focus: "Les boucles doivent être pensées comme des parcours contrôlés, pas comme des répétitions automatiques. Une bonne boucle sait ce qu'elle parcourt, quand elle s'arrête et quelles variables lui appartiennent vraiment.",
      retenir: [
        "for est souvent idéal quand la forme du parcours est connue.",
        "La portée la plus petite possible réduit les erreurs et aide à comprendre le code."
      ],
      pitfalls: [
        "Laisser traîner des variables de boucle en dehors de la zone où elles sont utiles.",
        "Écrire une condition d'arrêt approximative qui masque un off-by-one ou une boucle infinie."
      ],
      method: [
        "Identifie l'élément répété et le critère d'arrêt.",
        "Place les variables de contrôle dans la boucle ou juste à côté si leur rôle l'exige.",
        "Teste à la main les premières et dernières itérations pour vérifier le comportement."
      ],
      check: "Quand tu lis une boucle, peux-tu énoncer ce qui est parcouru, ce qui change à chaque tour et ce qui provoque la sortie ?"
    }
  ],
  "pointeurs-memoire": [
    {
      focus: "Un pointeur n'est pas un concept mystérieux réservé aux experts : c'est une variable ordinaire dont la valeur est une adresse. Tout le reste — arithmétique, tableaux, allocation dynamique — découle de cette idée simple. Bien la comprendre déverrouille une grande partie de la mécanique interne du C++.",
      retenir: [
        "<code>&amp;</code> donne l'adresse d'une variable ; <code>*</code> en déclaration annonce un pointeur ; <code>*</code> en expression déréférence.",
        "Un pointeur non initialisé contient une adresse quelconque : le déréférencer est un comportement indéfini."
      ],
      pitfalls: [
        "Confondre <code>&amp;</code> (adresse) et <code>*</code> (déréférencement) selon le contexte déclaration vs expression.",
        "Oublier d'initialiser un pointeur et supposer qu'il vaut automatiquement <code>nullptr</code>."
      ],
      method: [
        "Lis une déclaration de pointeur de droite à gauche.",
        "Pour tout pointeur déclaré, demande-toi immédiatement : vers quoi pointe-t-il, et qui est responsable de la ressource ?",
        "Teste mentalement chaque opération : que contient le pointeur ? que vaut le déréférencement ?"
      ],
      check: "Peux-tu expliquer à voix haute la différence entre <code>int* p = &amp;x</code> et <code>*p = 99</code> ?"
    },
    {
      focus: "L'arithmétique des pointeurs est cohérente parce qu'elle raisonne en éléments, pas en octets. Cette propriété explique pourquoi les tableaux C se comportent comme des pointeurs, et pourquoi <code>arr[i]</code> et <code>*(arr + i)</code> sont identiques.",
      retenir: [
        "Incrémenter un pointeur avance d'une unité du type pointé, pas d'un octet.",
        "<code>arr[i]</code> est du sucre syntaxique pour <code>*(arr + i)</code> : les deux génèrent le même code."
      ],
      pitfalls: [
        "Croire qu'un tableau passé à une fonction conserve sa taille : il se transforme en pointeur nu.",
        "Sortir des bornes du tableau avec l'arithmétique : le compilateur ne le détecte pas toujours."
      ],
      method: [
        "Pour chaque accès par pointeur, vérifie que l'adresse reste dans les bornes du tableau source.",
        "Quand tu passes un tableau à une fonction, transmets aussi sa taille ou utilise un conteneur standard.",
        "Préfère <code>std::span</code> (C++20) ou <code>std::vector</code> pour les fonctions recevant des séquences."
      ],
      check: "Si <code>p</code> pointe vers <code>arr[1]</code>, que vaut <code>*(p + 2)</code> pour un tableau <code>{10, 20, 30, 40}</code> ?"
    },
    {
      focus: "Lire les qualificatifs <code>const</code> sur un pointeur de droite à gauche résout immédiatement toute ambiguïté. C'est une règle mécanique que le compilateur applique et que tout lecteur peut reproduire sans apprentissage supplémentaire.",
      retenir: [
        "<code>const</code> à gauche de <code>*</code> protège la valeur pointée.",
        "<code>const</code> à droite de <code>*</code> protège l'adresse stockée dans le pointeur."
      ],
      pitfalls: [
        "Retirer <code>const</code> pour 'faire marcher' le code : c'est souvent le signe d'un problème de conception plus profond.",
        "Confondre un pointeur vers <code>const</code> et un pointeur constant : deux contraintes distinctes."
      ],
      method: [
        "Lis la déclaration de droite à gauche.",
        "Pour chaque paramètre de fonction, demande-toi si tu lis, modifies ou possèdes la valeur pointée.",
        "Choisis la combinaison <code>const</code> la plus restrictive qui satisfait l'usage."
      ],
      check: "Quelle déclaration représente un pointeur qu'on ne peut pas rediriger mais dont la valeur cible reste modifiable ?"
    },
    {
      focus: "L'allocation dynamique est nécessaire quand la durée de vie doit dépasser le scope courant ou quand la taille n'est connue qu'à l'exécution. Mais la gestion manuelle est fragile : <code>new</code> / <code>delete</code> à la main n'est quasiment plus justifiable en C++ moderne.",
      retenir: [
        "Chaque <code>new</code> doit avoir exactement un <code>delete</code> ; chaque <code>new[]</code> exactement un <code>delete[]</code>.",
        "En C++ moderne, <code>std::vector</code> et <code>std::unique_ptr</code> rendent la gestion manuelle presque toujours inutile."
      ],
      pitfalls: [
        "Oublier <code>delete</code> après une sortie anticipée ou une exception : fuite mémoire garantie.",
        "Mélanger <code>delete</code> et <code>delete[]</code> : comportement indéfini."
      ],
      method: [
        "Chaque fois que tu écris <code>new</code>, demande-toi : quel objet appellera <code>delete</code> et dans quelle portée ?",
        "Si la réponse est complexe, utilise directement <code>std::unique_ptr</code>.",
        "Réserve <code>new</code> / <code>delete</code> manuels aux interfaces C héritées ou aux cas très spécifiques."
      ],
      check: "Qu'est-ce qui garantit qu'une fuite mémoire n'est pas possible avec <code>std::vector</code>, et comment retrouver cette garantie avec un pointeur brut ?"
    },
    {
      focus: "L'opérateur <code>-&gt;</code> est un raccourci de lecture essentiel. Comprendre qu'il combine déréférencement et accès membre aide à lire n'importe quel code orienté objet manipulant des pointeurs — y compris tout le polymorphisme dynamique du chapitre suivant.",
      retenir: [
        "<code>ptr-&gt;membre</code> est identique à <code>(*ptr).membre</code> : même sémantique, écriture plus claire.",
        "Les pointeurs sur fonctions existent mais sont supplantés par <code>std::function</code> et les lambdas pour la lisibilité."
      ],
      pitfalls: [
        "Utiliser <code>.</code> au lieu de <code>-&gt;</code> sur un pointeur : erreur de compilation.",
        "Retourner l'adresse d'une variable locale depuis une fonction : pointeur suspendu à l'appel suivant."
      ],
      method: [
        "Chaque fois que tu vois <code>-&gt;</code>, rappelle-toi que c'est un déréférencement : le pointeur doit être valide.",
        "Avant tout accès via pointeur, vérifie qu'il n'est pas <code>nullptr</code>.",
        "Pour les callbacks, préfère une lambda ou <code>std::function</code> à un pointeur sur fonction nu."
      ],
      check: "Si <code>p</code> est un <code>Point*</code>, que se passe-t-il si tu appelles <code>p-&gt;x</code> alors que <code>p == nullptr</code> ?"
    }
  ],
  "fonctions-references": [
    {
      focus: "Une fonction propre commence par une sémantique d'appel claire. Avant d'écrire le corps, il faut savoir si l'argument est lu, modifié, consommé ou simplement observé.",
      retenir: [
        "Le passage par valeur, par référence ou par référence constante raconte une intention différente.",
        "Une bonne signature réduit le besoin de commentaires explicatifs."
      ],
      pitfalls: [
        "Passer par référence non const 'par habitude' alors qu'aucune modification n'est prévue.",
        "Choisir la performance apparente au détriment de la lisibilité du contrat."
      ],
      method: [
        "Détermine d'abord le rôle exact de chaque paramètre.",
        "Choisis ensuite la forme de passage qui matérialise ce rôle.",
        "Vérifie enfin que le nom de la fonction et sa signature racontent la même histoire."
      ],
      check: "Pourrais-tu justifier, paramètre par paramètre, pourquoi une fonction doit recevoir une valeur, une référence ou une référence constante ?"
    },
    {
      focus: "La surcharge est puissante lorsqu'elle exprime plusieurs usages cohérents d'une même opération. Elle devient dangereuse dès qu'elle force le lecteur à deviner quelle version sera réellement appelée.",
      retenir: [
        "Des surcharges valables partagent un sens commun, pas seulement un nom commun.",
        "Les paramètres par défaut doivent simplifier l'appel sans rendre la résolution ambiguë."
      ],
      pitfalls: [
        "Multiplier les surcharges qui se distinguent par des détails trop subtils.",
        "Cacher des comportements très différents derrière le même verbe."
      ],
      method: [
        "Liste les usages réels de l'opération à modéliser.",
        "Garde uniquement les surcharges dont la sémantique reste stable.",
        "Teste mentalement plusieurs appels pour vérifier qu'aucune ambiguïté ne subsiste."
      ],
      check: "Si deux surcharges portent le même nom, peux-tu expliquer en quoi leur contrat reste tout de même cohérent ?"
    },
    {
      focus: "Les namespaces et la discipline de header servent à éviter l'entropie. Plus un projet grandit, plus les collisions de noms, les dépendances croisées et les inclusions inutiles deviennent coûteuses.",
      retenir: [
        "Un header doit exposer le minimum nécessaire pour rester stable et facile à inclure.",
        "Le namespace est un outil de structuration, pas un simple détail de syntaxe."
      ],
      pitfalls: [
        "Utiliser using namespace dans des headers ou dans des zones très larges.",
        "Inclure massivement sans distinguer dépendances d'interface et d'implémentation."
      ],
      method: [
        "Réduis chaque header à ce qu'il doit vraiment promettre.",
        "Place les noms dans un espace cohérent avec le domaine du projet.",
        "Relis les inclusions pour supprimer celles qui n'apportent rien à l'interface publique."
      ],
      check: "Saurais-tu expliquer pourquoi un header mal tenu finit par ralentir autant la compilation que la compréhension du code ?"
    }
  ],
  "classes-encapsulation": [
    {
      focus: "Une classe utile protège un état valide et propose des opérations qui ont du sens. Si elle ne fait que regrouper des champs publics, elle ne joue pas encore vraiment son rôle d'abstraction.",
      retenir: [
        "L'encapsulation sert à préserver des invariants, pas à cacher arbitrairement des données.",
        "Une classe doit être pensée depuis son contrat d'utilisation avant son stockage interne."
      ],
      pitfalls: [
        "Exposer trop vite les données au lieu de construire de vraies opérations métier.",
        "Ajouter des méthodes parce qu'elles sont faciles à coder, non parce qu'elles appartiennent à l'abstraction."
      ],
      method: [
        "Écris d'abord ce qu'un utilisateur légitime de la classe doit pouvoir faire.",
        "Déduis ensuite les invariants qui doivent toujours rester vrais.",
        "Enfin, choisis les données internes qui permettent de tenir ce contrat."
      ],
      check: "Peux-tu décrire l'invariant principal d'une classe sans citer sa représentation mémoire détaillée ?"
    },
    {
      focus: "Le découpage header/source et les méthodes const rendent l'interface plus fiable. Ils forcent à distinguer ce qui appartient au contrat public et ce qui relève du détail d'implémentation.",
      retenir: [
        "Une méthode const promet de ne pas modifier l'état observable de l'objet.",
        "Le lecteur doit comprendre l'API d'une classe sans ouvrir tout son .cpp."
      ],
      pitfalls: [
        "Retirer const pour 'faire marcher' le code au lieu d'interroger la conception.",
        "Mélanger dans le header des détails internes qui devraient rester en source."
      ],
      method: [
        "Passe en revue l'API en séparant clairement lecture et modification.",
        "Ajoute const partout où la promesse tient réellement.",
        "Déplace en source tout ce qui n'a pas besoin d'être visible publiquement."
      ],
      check: "Quand une méthode devrait-elle être const, et qu'est-ce que ce choix dit sur le contrat de la classe ?"
    },
    {
      focus: "Le pointeur this et la cohérence des noms aident à écrire des méthodes compréhensibles, surtout lorsque les paramètres ressemblent aux attributs. L'enjeu n'est pas d'utiliser this partout, mais de garder une intention limpide.",
      retenir: [
        "this rappelle qu'une méthode travaille toujours dans le contexte d'une instance précise.",
        "Des conventions de nommage stables limitent les ambiguïtés et les erreurs de lecture."
      ],
      pitfalls: [
        "Multiplier les noms flous comme value, data ou tmp alors que le domaine mérite mieux.",
        "Employer this de façon décorative au lieu de clarifier un conflit réel."
      ],
      method: [
        "Choisis une convention de nommage constante pour attributs et paramètres.",
        "Utilise this uniquement lorsque cela améliore vraiment la lisibilité.",
        "Relis les méthodes en supprimant toute ambiguïté entre entrée, état interne et résultat."
      ],
      check: "Peux-tu montrer comment une convention de noms cohérente évite un bug ou une confusion dans une méthode ?"
    }
  ],
  "constructeurs-raii": [
    {
      focus: "Le cycle de vie n'est pas un détail technique ajouté après coup : il fait partie du design de la classe. Si la création et la destruction ne sont pas pensées correctement, les invariants deviennent fragiles.",
      retenir: [
        "Un objet bien conçu doit être valide dès la fin de son constructeur.",
        "Toute ressource acquise doit avoir un propriétaire clairement identifié."
      ],
      pitfalls: [
        "Construire des objets partiellement valides qu'il faudrait 'finir' plus tard.",
        "Oublier que destruction et gestion d'erreur sont liées."
      ],
      method: [
        "Définis ce qui rend l'objet valide immédiatement après construction.",
        "Liste les ressources détenues et leur durée de vie.",
        "Vérifie que la destruction relâche exactement ce qui a été acquis."
      ],
      check: "Saurais-tu expliquer pourquoi une classe mal conçue du point de vue du cycle de vie devient vite difficile à tester ?"
    },
    {
      focus: "La liste d'initialisation n'est pas seulement une écriture élégante : elle construit directement les membres avec leur bonne valeur. Elle évite des créations temporaires inutiles et clarifie l'ordre réel d'initialisation.",
      retenir: [
        "Un membre doit idéalement être construit une seule fois, avec son état final.",
        "L'ordre d'initialisation suit l'ordre des membres dans la classe, pas l'ordre visuel de la liste."
      ],
      pitfalls: [
        "Croire qu'affecter dans le corps du constructeur est toujours équivalent à initialiser.",
        "Oublier l'ordre réel des membres, notamment avec des dépendances entre eux."
      ],
      method: [
        "Repère les membres qui doivent être construits immédiatement.",
        "Place leur valeur dans la liste d'initialisation plutôt que dans le corps.",
        "Relis l'ordre de déclaration des membres pour éviter les surprises."
      ],
      check: "Peux-tu donner un exemple où initialiser dans le corps du constructeur est moins correct qu'utiliser la liste d'initialisation ?"
    },
    {
      focus: "RAII devient vraiment clair lorsqu'on le voit comme un contrat automatique : la ressource entre dans l'objet à la construction, puis elle est libérée à la destruction, même en cas d'exception ou de retour anticipé.",
      retenir: [
        "RAII réduit la charge mentale en liant explicitement ressource et durée de vie.",
        "Le bon design fait du cas sûr le cas par défaut."
      ],
      pitfalls: [
        "Gérer la libération manuellement dans plusieurs branches du programme.",
        "Oublier qu'une erreur peut interrompre le flot avant le nettoyage explicite."
      ],
      method: [
        "Identifie la ressource à protéger : fichier, mutex, mémoire, socket.",
        "Encapsule-la dans un type qui sait l'acquérir et la relâcher.",
        "Teste mentalement les sorties prématurées pour vérifier que le nettoyage reste automatique."
      ],
      check: "Si une fonction quitte plus tôt que prévu, ton design RAII garantit-il encore la libération correcte de la ressource ?"
    }
  ],
  "memoire-smart-pointers": [
    {
      focus: "La vraie question n'est pas 'pile ou tas ?' mais 'qui possède quoi, et combien de temps ?'. Le modèle mémoire devient bien plus simple dès qu'on raisonne en ownership plutôt qu'en adresses isolées.",
      retenir: [
        "La pile favorise la simplicité, le tas répond aux besoins de durée de vie ou de taille dynamiques.",
        "Le choix mémoire doit suivre le besoin métier, pas une préférence de syntaxe."
      ],
      pitfalls: [
        "Allouer dynamiquement des objets qui pourraient vivre localement.",
        "Parler de mémoire sans parler du propriétaire réel de la ressource."
      ],
      method: [
        "Demande d'abord si l'objet peut vivre automatiquement dans une portée simple.",
        "Si non, identifie la raison précise qui impose une durée de vie plus souple.",
        "Associe ensuite chaque allocation à un propriétaire clair et unique ou partagé."
      ],
      check: "Quand choisis-tu le tas pour une bonne raison, et quand n'est-ce qu'une complication inutile ?"
    },
    {
      focus: "Éviter new/delete en première intention, c'est éviter une grande partie des bugs de durée de vie. Les conteneurs et smart pointers standard rendent les responsabilités plus explicites et beaucoup moins fragiles.",
      retenir: [
        "vector, string et les smart pointers couvrent déjà la majorité des besoins.",
        "Le standard library code mieux la gestion mémoire qu'un bricolage manuel répété partout."
      ],
      pitfalls: [
        "Utiliser new comme réflexe parce qu'on veut 'créer un objet'.",
        "Disperser les delete dans le code au lieu de centraliser la responsabilité."
      ],
      method: [
        "Cherche d'abord si un conteneur standard peut porter la ressource.",
        "Sinon, choisis un smart pointer qui exprime le bon ownership.",
        "Réserve les pointeurs bruts aux usages non propriétaires et documentés."
      ],
      check: "Peux-tu remplacer mentalement un new/delete manuel par un type standard plus sûr ?"
    },
    {
      focus: "Le pointeur brut n'est pas interdit, mais il doit être utilisé avec précision. Il reste utile pour observer, traverser ou interfacer une API, tant qu'il n'exprime pas une responsabilité de destruction cachée.",
      retenir: [
        "Un pointeur brut peut représenter une vue, pas forcément une propriété.",
        "Le danger vient surtout quand son rôle n'est pas explicite dans l'API."
      ],
      pitfalls: [
        "Confier à un pointeur brut une responsabilité de destruction implicite.",
        "Retourner une adresse sans préciser la durée de vie de l'objet pointé."
      ],
      method: [
        "Décide si le pointeur observe, possède ou transfère une ressource.",
        "Si le pointeur n'est pas propriétaire, fais-le comprendre dans le contrat.",
        "Vérifie toujours que la durée de vie de la cible dépasse celle de l'usage."
      ],
      check: "Dans une signature, saurais-tu distinguer immédiatement un pointeur d'observation d'un mécanisme de propriété ?"
    },
    {
      focus: "unique_ptr est l'outil de propriété par défaut. Il exprime sans ambiguïté 'une seule entité est responsable de cette ressource'. Comprendre ses opérations — move, release, reset, custom deleter — permet de couvrir l'immense majorité des besoins de gestion manuelle tout en restant sûr.",
      retenir: [
        "unique_ptr est non copiable : la possession ne peut être que transférée, jamais dupliquée.",
        "release() cède la responsabilité sans détruire ; c'est une porte de sortie vers du code C, pas un raccourci habituel."
      ],
      pitfalls: [
        "Appeler get() puis stocker le pointeur brut plus longtemps que le unique_ptr : dangling pointer garanti.",
        "Utiliser release() sans assurer ensuite la libération : c'est retrouver une fuite mémoire manuelle."
      ],
      method: [
        "Pour chaque ressource à durée de vie contrôlée, commence par unique_ptr.",
        "Si la ressource a un mode de libération non standard, encapsule-le dans un custom deleter.",
        "N'expose get() qu'aux fonctions qui observent ; n'expose jamais release() sauf interface C héritée."
      ],
      check: "Peux-tu distinguer quand utiliser get(), reset() et release() sur un unique_ptr, et les risques propres à chacun ?"
    },
    {
      focus: "shared_ptr résout un vrai problème : quand plusieurs entités ont besoin de prolonger la durée de vie d'une ressource. Mais son coût — atomique, bloc de contrôle, cycles possibles — est réel. Ne l'utilise pas par défaut ; utilise-le quand le besoin de copropriété est prouvé.",
      retenir: [
        "Le compteur de références de shared_ptr est géré de façon atomique : c'est plus cher qu'un simple entier.",
        "Un cycle de shared_ptr est une fuite mémoire silencieuse que le compilateur ne détecte pas."
      ],
      pitfalls: [
        "Choisir shared_ptr pour 'éviter de réfléchir à l'ownership' : cela déplace le problème sans le résoudre.",
        "Créer un shared_ptr à partir d'un pointeur brut déjà géré par un autre smart pointer : double deletion."
      ],
      method: [
        "Commence par unique_ptr. Passe à shared_ptr seulement si plusieurs propriétaires sont nécessaires.",
        "Dès qu'un cycle devient possible, introduis weak_ptr sur le côté 'observateur' de la relation.",
        "Utilise make_shared (pas new dans un shared_ptr) pour une seule allocation et une meilleure sécurité."
      ],
      check: "Comment reconnaîtrais-tu dans une architecture que deux classes forment un cycle de shared_ptr, avant même que la fuite ne soit visible ?"
    }
  ],
  "copie-mouvement": [
    {
      focus: "La copie superficielle devient dangereuse dès qu'un objet gère une ressource exclusive. Deux objets qui pensent posséder la même ressource finissent presque toujours par produire des doubles libérations ou des alias inattendus.",
      retenir: [
        "Une copie correcte doit préserver la validité et la sémantique du type.",
        "Les ressources possédées rendent la copie implicite suspecte tant qu'elle n'est pas examinée."
      ],
      pitfalls: [
        "Laisser le compilateur générer une copie par défaut pour un type propriétaire.",
        "Confondre égalité logique et duplication indépendante des ressources."
      ],
      method: [
        "Repère si le type possède une ressource non copiée automatiquement de façon sûre.",
        "Décris ce que doit signifier une copie du point de vue métier.",
        "Implémente ou interdits les opérations spéciales selon cette sémantique."
      ],
      check: "Si deux objets issus d'une copie se détruisent indépendamment, est-ce forcément sûr pour ta ressource ?"
    },
    {
      focus: "Copie profonde et affectation doivent garantir un état cohérent même en cas d'auto-affectation ou d'exception. Le sujet n'est pas seulement de 'copier toutes les données', mais de conserver un contrat robuste.",
      retenir: [
        "L'affectation remplace l'état d'un objet existant ; elle n'est pas identique à la construction.",
        "Une bonne implémentation pense aussi au cas où l'opération échoue au milieu."
      ],
      pitfalls: [
        "Réécrire l'affectation comme une suite de lignes sans stratégie de sécurité.",
        "Oublier l'auto-affectation ou laisser l'objet dans un état partiel."
      ],
      method: [
        "Définis d'abord ce que l'objet doit garantir après l'opération.",
        "Choisis ensuite une stratégie sûre : copie temporaire, swap, ou interdiction explicite.",
        "Teste mentalement le cas this == &other et le cas d'échec intermédiaire."
      ],
      check: "Peux-tu expliquer en quoi l'opérateur d'affectation a des contraintes différentes du constructeur de copie ?"
    },
    {
      focus: "Les move semantics permettent de transférer proprement une ressource au lieu de la copier. Mais la vraie maturité consiste souvent à concevoir des types qui n'ont même plus besoin de gérer explicitement la copie ou le mouvement : c'est l'esprit de la règle de 0.",
      retenir: [
        "Le move rend les transferts efficaces lorsque le type possède une ressource transférable.",
        "La règle de 0 reste l'objectif quand les membres standards savent déjà porter le comportement."
      ],
      pitfalls: [
        "Écrire les cinq opérations spéciales alors qu'un vector ou un string aurait suffi.",
        "Laisser après move un objet dans un état ambigu ou difficile à documenter."
      ],
      method: [
        "Commence par voir si tu peux déléguer la ressource à des types standards.",
        "Si un move explicite reste nécessaire, définis l'état valide de l'objet déplacé.",
        "Mesure ensuite si cette complexité apporte vraiment quelque chose."
      ],
      check: "Pour ton type, vaut-il mieux écrire une règle de 5 complète ou repenser la représentation pour revenir à la règle de 0 ?"
    }
  ],
  "surcharge-operateurs": [
    {
      focus: "Une surcharge d'opérateur n'est bonne que si elle reste naturelle pour le lecteur. L'objectif n'est pas d'être 'malin', mais de rendre l'objet plus facile à manipuler lorsqu'il ressemble vraiment à la notion mathématique ou métier visée.",
      retenir: [
        "Un opérateur surchargé doit préserver l'intuition attachée à cet opérateur.",
        "La lisibilité prime sur la démonstration technique."
      ],
      pitfalls: [
        "Surcharger un opérateur pour un effet de bord surprenant ou non intuitif.",
        "Imiter la syntaxe des types standards sans en respecter la sémantique."
      ],
      method: [
        "Décris en français le comportement attendu avant d'écrire l'opérateur.",
        "Vérifie qu'un lecteur pourrait deviner ce comportement sans commentaire.",
        "Abandonne la surcharge si le sens métier reste trop artificiel."
      ],
      check: "Si tu lis `a + b` sur ton type, le résultat attendu est-il évident sans documentation externe ?"
    },
    {
      focus: "Le choix entre membre et non-membre dépend du contrat recherché. Une opération symétrique ou nécessitant des conversions des deux côtés gagne souvent à être écrite hors de la classe, parfois en friend si nécessaire.",
      retenir: [
        "Une opération binaire n'appartient pas toujours naturellement au membre de gauche.",
        "Le non-membre évite parfois des asymétries inutiles dans l'API."
      ],
      pitfalls: [
        "Mettre tous les opérateurs en membres par réflexe.",
        "Oublier l'impact des conversions implicites sur l'appel résolu."
      ],
      method: [
        "Demande-toi si l'opération privilégie réellement l'objet de gauche.",
        "Teste mentalement les cas `objet + scalaire` et `scalaire + objet`.",
        "Choisis la forme qui garde le contrat le plus régulier."
      ],
      check: "Peux-tu justifier pourquoi un opérateur donné doit être membre, non-membre ou friend ?"
    },
    {
      focus: "Les comparaisons sont sensibles parce qu'elles transportent des hypothèses implicites : cohérence, transitivité, égalité logique. Une comparaison mal définie contamine ensuite tri, recherche, conteneurs associatifs et tests.",
      retenir: [
        "Comparer, c'est définir ce qui compte réellement dans l'identité ou l'ordre du type.",
        "Les opérateurs doivent former un ensemble cohérent, pas une collection de fonctions indépendantes."
      ],
      pitfalls: [
        "Comparer des détails de représentation au lieu de la signification métier.",
        "Définir `==` et `<` avec des critères incompatibles."
      ],
      method: [
        "Clarifie d'abord ce qui rend deux objets égaux du point de vue métier.",
        "Détermine ensuite si un ordre total ou partiel a un sens.",
        "Relis tous les opérateurs ensemble pour vérifier leur cohérence globale."
      ],
      check: "Ton opérateur d'égalité compare-t-il l'essentiel du métier ou seulement une représentation pratique ?"
    },
    {
      focus: "L'opérateur >> et les six comparaisons forment un groupe symétrique. La règle d'or : implémenter l'essentiel (== et <), puis dériver tout le reste mécaniquement pour garantir la cohérence.",
      retenir: [
        "operator>> retourne istream& non-const pour permettre le chaînage et modifier l'objet destination.",
        "Les 4 opérateurs >, !=, <=, >= se dérivent naturellement de == et < : pas de logique dupliquée."
      ],
      pitfalls: [
        "Oublier de retourner le flux dans operator>> — l'enchaînement `in >> a >> b` échoue silencieusement.",
        "Implémenter les 6 comparaisons de manière indépendante au lieu de les dériver : incohérence garantie à terme."
      ],
      method: [
        "Écris == et < avec la vraie logique métier.",
        "Dérive != comme `!(*this == other)`, > comme `other < *this`, etc.",
        "Teste un cas limite : objets égaux, ordre inverse, champs identiques sauf un."
      ],
      check: "Si tu modifies la logique de <, est-ce que >, >=, <= se mettent à jour automatiquement ?"
    }
  ],
  "heritage-polymorphisme": [
    {
      focus: "L'héritage n'est justifié que s'il porte une vraie relation de substitution. Le critère le plus simple reste linguistique et métier : la dérivée doit être une sorte crédible de la base, pas seulement une classe 'qui lui ressemble'.",
      retenir: [
        "La base porte un contrat commun, pas seulement du code à réutiliser.",
        "Redéfinition et surcharge sont deux mécanismes distincts."
      ],
      pitfalls: [
        "Hériter uniquement pour éviter de recopier quelques lignes.",
        "Confondre relation métier et proximité de structure interne."
      ],
      method: [
        "Formule la relation en français : 'un X est-il vraiment un Y ?'.",
        "Vérifie ensuite ce que la base promet réellement à ses utilisateurs.",
        "Ne garde l'héritage que si la dérivée peut tenir cette promesse."
      ],
      check: "Si tu remplaces partout la base par la dérivée, le contrat reste-t-il crédible sans surprise métier ?"
    },
    {
      focus: "Les constructeurs et destructeurs rappellent que l'héritage est aussi une affaire de cycle de vie. La base est construite en premier et détruite en dernier, ce qui impose une liste d'initialisation correcte dès qu'un état de base doit être satisfait.",
      retenir: [
        "La base est toujours construite avant la dérivée.",
        "L'appel explicite au constructeur parent rend l'intention claire et sûre."
      ],
      pitfalls: [
        "Oublier qu'une base sans constructeur par défaut doit être initialisée explicitement.",
        "Croire que le corps du constructeur peut réparer une base mal construite."
      ],
      method: [
        "Identifie les invariants de la base avant d'écrire la dérivée.",
        "Initialise chaque sous-objet dans la liste d'initialisation.",
        "Relis l'ordre de construction et de destruction quand une ressource est en jeu."
      ],
      check: "Peux-tu expliquer pourquoi l'appel au constructeur de base ne se place pas dans le corps du constructeur dérivé ?"
    },
    {
      focus: "Les modes d'héritage et le mot-clé protected servent à contrôler la visibilité du contrat transmis. En pratique, l'héritage public couvre l'immense majorité des cas utiles ; les autres modes doivent être justifiés par une intention très claire.",
      retenir: [
        "public conserve l'idée est-un auprès des utilisateurs de la classe.",
        "protected ouvre l'accès aux dérivées tout en restant caché à l'extérieur."
      ],
      pitfalls: [
        "Employer private inheritance alors qu'une composition ferait mieux le travail.",
        "Utiliser protected comme un raccourci de commodité au lieu d'un vrai choix d'API."
      ],
      method: [
        "Détermine qui doit voir ou manipuler l'information héritée.",
        "Choisis ensuite le mode d'héritage le plus simple qui respecte cette intention.",
        "Réévalue le design si l'héritage multiple ou le diamant apparaissent trop vite."
      ],
      check: "Peux-tu justifier un usage de protected autrement que par 'c'est plus pratique' ?"
    },
    {
      focus: "Le polymorphisme dynamique est puissant parce qu'il retarde le choix concret d'implémentation jusqu'à l'exécution. Il rend possible un code ouvert à l'extension, mais seulement si la base reste centrée sur un rôle stable et lisible.",
      retenir: [
        "virtual active une résolution dynamique via la base.",
        "override sécurise la redéfinition au moment de la compilation."
      ],
      pitfalls: [
        "Déclarer trop de méthodes virtuelles sans véritable besoin de variation concrète.",
        "Créer une base trop bavarde qui mélange contrat commun et détails d'implémentation."
      ],
      method: [
        "Isole ce qui doit vraiment varier selon le type concret.",
        "Fais porter ce rôle par une interface courte et stable.",
        "Teste le comportement via des références ou pointeurs vers la base."
      ],
      check: "Que t'apporte concrètement le polymorphisme par rapport à un simple appel direct sur les types concrets ?"
    },
    {
      focus: "Les classes abstraites et les fonctions virtuelles pures servent à exprimer une interface de rôle. Les plus gros pièges restent le slicing et l'oubli du destructeur virtuel, parce qu'ils cassent silencieusement le contrat polymorphique au moment du stockage ou de la destruction.",
      retenir: [
        "Une classe abstraite n'est pas instanciable mais peut servir de type de référence ou de pointeur.",
        "Le destructeur virtuel et l'absence de slicing sont deux conditions de survie d'une hiérarchie polymorphique."
      ],
      pitfalls: [
        "Stocker des objets dérivés par valeur dans un conteneur de base.",
        "Détruire via un pointeur base sans destructeur virtuel."
      ],
      method: [
        "Passe en revue les signatures et conteneurs pour traquer les copies par valeur vers la base.",
        "Vérifie que la destruction se fera bien via un destructeur virtuel.",
        "Garde la hiérarchie petite, motivée et explicitement polymorphique."
      ],
      check: "Si une hiérarchie polymorphique fuit ou perd son comportement, regarderais-tu d'abord le stockage, la destruction ou le contrat de base ?"
    }
  ],
  "templates-stl": [
    {
      focus: "Un template n'est pas du code directement exécutable mais un modèle que le compilateur instancie pour des types concrets. Comprendre cette idée explique à la fois la puissance du mécanisme et l'obligation fréquente de placer les définitions dans les headers.",
      retenir: [
        "Le template capture une famille de comportements, pas un cas isolé.",
        "L'instanciation a lieu au moment où le compilateur voit réellement le type utilisé."
      ],
      pitfalls: [
        "Écrire un template juste pour éviter une petite duplication prématurée.",
        "Oublier que le compilateur doit voir la définition complète au moment de l'instanciation."
      ],
      method: [
        "Repère ce qui est vraiment indépendant du type concret.",
        "Liste les opérations minimales exigées sur ce type.",
        "Teste ensuite l'idée sur plusieurs cas réellement différents."
      ],
      check: "Peux-tu expliquer pourquoi un template placé uniquement dans un .cpp pose souvent problème ?"
    },
    {
      focus: "Les classes template rendent la généricité structurelle, mais elles déplacent aussi beaucoup de contraintes dans le contrat implicite du type paramètre. Le vrai enjeu pédagogique est de reconnaître ces exigences au lieu de les laisser cachées.",
      retenir: [
        "Le type paramètre doit supporter les opérations utilisées dans la classe.",
        "Une classe template maison sert surtout à comprendre le mécanisme ; la STL reste la référence en pratique."
      ],
      pitfalls: [
        "Réinventer un conteneur standard sans raison métier sérieuse.",
        "Écrire une abstraction générique sans savoir quelles opérations elle attend du type."
      ],
      method: [
        "Écris d'abord le besoin concret sur un type simple.",
        "Factorise ensuite seulement ce qui ne dépend vraiment pas du type.",
        "Documente mentalement ou explicitement les prérequis sur le type paramètre."
      ],
      check: "Quand ton template échoue à compiler, sais-tu relier l'erreur à une opération manquante sur le type générique ?"
    },
    {
      focus: "Choisir un conteneur STL, c'est choisir un compromis entre accès, insertion, suppression, ordre et stabilité des références. Le bon choix part des usages dominants du problème, pas d'une préférence abstraite pour un conteneur 'plus avancé'.",
      retenir: [
        "vector est souvent le meilleur point de départ pour une séquence dynamique.",
        "Les complexités intéressantes sont celles des opérations vraiment fréquentes dans le scénario réel."
      ],
      pitfalls: [
        "Choisir list, map ou set par prestige plutôt que par besoin.",
        "Parler performances sans regarder la localité mémoire et les usages réels."
      ],
      method: [
        "Liste les opérations dominantes du problème.",
        "Choisis le conteneur le plus simple qui répond correctement à ces besoins.",
        "Réévalue si les usages changent, pas parce qu'un autre conteneur semble plus sophistiqué."
      ],
      check: "Peux-tu défendre un choix de conteneur en parlant d'opérations dominantes plutôt que de réputation générale ?"
    },
    {
      focus: "Les itérateurs unifient le parcours des conteneurs. Leur intérêt n'est pas seulement syntaxique : ils rendent possible un langage algorithmique commun à des structures de données différentes, à condition de respecter la catégorie d'itérateur attendue.",
      retenir: [
        "begin() et end() délimitent une plage ; end() est une sentinelle, pas un élément.",
        "Tous les conteneurs ne fournissent pas les mêmes capacités de déplacement."
      ],
      pitfalls: [
        "Déréférencer end() comme s'il s'agissait du dernier élément.",
        "Supposer qu'un algorithme exigeant du random access fonctionne sur n'importe quel conteneur."
      ],
      method: [
        "Identifie la plage de travail begin/end.",
        "Vérifie la catégorie d'itérateur offerte par le conteneur.",
        "Choisis ensuite l'algorithme compatible le plus expressif."
      ],
      check: "Saurais-tu expliquer pourquoi std::sort marche sur vector mais pas directement sur list ?"
    },
    {
      focus: "Les algorithmes STL, foncteurs et lambdas poussent vers un style plus déclaratif. L'enjeu n'est pas d'interdire les boucles, mais de choisir l'expression la plus lisible pour décrire une intention comme filtrer, transformer, compter ou accumuler.",
      retenir: [
        "Un algorithme standard met en avant l'opération conceptuelle plutôt que sa mécanique.",
        "Une lambda brève ou un prédicat bien choisi clarifie souvent le traitement."
      ],
      pitfalls: [
        "Écrire des lambdas trop longues qui cachent la logique au lieu de l'éclairer.",
        "Forcer un algorithme STL dans un cas où une boucle simple serait plus lisible."
      ],
      method: [
        "Nomine d'abord l'intention globale du traitement.",
        "Cherche l'algorithme standard qui raconte le mieux cette intention.",
        "Garde la règle injectée courte ; sinon, factorise-la clairement."
      ],
      check: "Quand préfères-tu une boucle explicite à un algorithme STL, et pour quelle raison de lisibilité ?"
    },
    {
      focus: "stack, queue, copy et transform sont la jonction entre la généricité des templates et le côté pratique de la STL. Ils illustrent que la discipline d'accès (LIFO/FIFO) peut être un choix de design autant qu'un détail d'implémentation.",
      retenir: [
        "stack et queue imposent un protocole d'accès, ce qui peut être une contrainte ou une garantie selon le contexte.",
        "copy et transform évitent les boucles de remplissage répétitives et expriment clairement l'intention."
      ],
      pitfalls: [
        "Utiliser stack ou queue alors qu'on a besoin d'accéder à un élément arbitraire — vector ou deque sont alors plus adaptés.",
        "Passer un itérateur d'insertion `back_inserter` à copy sans allouer préalablement l'espace dans dest."
      ],
      method: [
        "Identifie la discipline d'accès réelle du problème : LIFO, FIFO ou accès libre ?",
        "Choisis le conteneur adapté, puis exprime la transformation avec copy ou transform.",
        "Vérifie que la destination a la bonne taille avant d'appeler copy."
      ],
      check: "Pour le problème de Josephus, pourquoi queue est-il plus expressif qu'un vecteur avec un index manuel ?"
    }
  ],
  "exceptions-io": [
    {
      focus: "Les flux donnent une grammaire commune à l'entrée-sortie en C++. Comprendre cout, cin, cerr et la hiérarchie des streams aide à voir que la console et les fichiers ne sont pas deux mondes séparés, mais deux usages d'une même abstraction.",
      retenir: [
        "Les opérateurs << et >> expriment une circulation de données à travers un flux.",
        "cerr est destiné au diagnostic immédiat et se distingue de la sortie standard."
      ],
      pitfalls: [
        "Voir les flux comme une simple 'syntaxe à apprendre' sans comprendre le modèle sous-jacent.",
        "Mélanger affichage normal et messages d'erreur sans discipline."
      ],
      method: [
        "Associe chaque flux standard à son rôle concret.",
        "Observe le sens des opérateurs << et >> sur la console.",
        "Réutilise ensuite la même logique mentale pour les fichiers."
      ],
      check: "Peux-tu expliquer pourquoi la même écriture d'opérateurs fonctionne pour la console et pour les fichiers ?"
    },
    {
      focus: "Lire ou écrire un fichier proprement demande de séparer ressource, mode d'ouverture et traitement. Plus cette séquence est nette, plus il devient simple de savoir si l'échec vient du système, du format ou du métier.",
      retenir: [
        "ifstream, ofstream et fstream représentent le fichier logique côté programme.",
        "Le mode d'ouverture change réellement le comportement, notamment pour l'écriture et l'append."
      ],
      pitfalls: [
        "Ouvrir en sortie sans réaliser qu'ios::trunc peut vider le fichier existant.",
        "Enchaîner traitement et parsing sans valider l'ouverture d'abord."
      ],
      method: [
        "Ouvre la ressource avec le mode minimal nécessaire.",
        "Teste immédiatement l'état du flux.",
        "Sépare ensuite parsing brut et exploitation métier."
      ],
      check: "Si un fichier a été vidé sans le vouloir, irais-tu d'abord vérifier le mode d'ouverture utilisé ?"
    },
    {
      focus: "L'état d'un flux et sa position sont des outils de robustesse. Savoir lire fail(), eof() ou repositionner un curseur évite des diagnostics flous et rend le parsing plus fiable, surtout quand le format est imparfait ou qu'une reprise de lecture est nécessaire.",
      retenir: [
        "while (flux >> valeur) est l'idiome sûr pour la lecture formatée.",
        "tellg/seekg et tellp/seekp servent à raisonner explicitement sur la position dans le fichier."
      ],
      pitfalls: [
        "Utiliser while (!flux.eof()) et traiter une lecture ratée de trop.",
        "Ignorer si l'échec vient de la fin de fichier ou d'un mauvais format."
      ],
      method: [
        "Choisis un idiome de lecture qui repose sur l'état réel de l'opération.",
        "Après un échec, distingue fin de flux et erreur de format.",
        "Réinitialise et repositionne seulement si cela correspond à une vraie stratégie de reprise."
      ],
      check: "Quand une lecture s'arrête, sais-tu vérifier si le flux a atteint la fin ou s'il a rencontré une donnée invalide ?"
    },
    {
      focus: "Les exceptions servent à signaler une rupture du flot normal lorsqu'un traitement local n'est pas raisonnable. Leur vraie valeur apparaît quand on les utilise avec parcimonie, capture précise et propagation explicite vers le niveau qui peut réellement décider quoi faire.",
      retenir: [
        "Une exception n'est pas un substitut général au contrôle de flux ordinaire.",
        "La propagation remonte la pile jusqu'au niveau de responsabilité pertinent."
      ],
      pitfalls: [
        "Attraper trop tôt et masquer la cause réelle.",
        "Lancer des exceptions vagues sans contexte ni message utile."
      ],
      method: [
        "Décide d'abord si l'appelant local peut traiter raisonnablement l'erreur.",
        "Si non, lance une exception claire et capture-la plus haut.",
        "Respecte l'ordre du plus spécifique au plus général dans les catch."
      ],
      check: "Si une fonction ne peut pas corriger localement une erreur, que gagne-t-on à laisser l'exception remonter ?"
    },
    {
      focus: "Assertions, exceptions métier et std::exception forment trois niveaux complémentaires de diagnostic. Le but n'est pas seulement d'attraper une erreur, mais de transmettre assez de contexte pour permettre à l'appelant ou au développeur de comprendre ce qui s'est réellement passé.",
      retenir: [
        "assert protège surtout des incohérences internes supposées impossibles.",
        "Dériver de std::exception offre un contrat standard via what()."
      ],
      pitfalls: [
        "Utiliser assert pour gérer une erreur utilisateur normale.",
        "Créer une exception personnalisée sans message exploitable ni contexte métier."
      ],
      method: [
        "Réserve assert aux hypothèses internes du programme.",
        "Choisis une exception standard ou personnalisée selon le besoin d'expressivité.",
        "Ajoute du contexte au bon niveau sans déformer la cause initiale."
      ],
      check: "Dans ton code, saurais-tu distinguer ce qui relève d'un bug interne, d'un aléa système et d'une erreur métier signalable ?"
    },
    {
      focus: "argc/argv est le pont entre le programme et son contexte d'exécution. C'est souvent la première interface avec l'utilisateur : bien vérifier argc avant d'accéder à argv[1] est une règle absolue.",
      retenir: [
        "argc vaut toujours au moins 1 (argv[0] = nom du programme).",
        "argv[1]...argv[argc-1] sont les arguments utilisateur ; argv[argc] vaut nullptr."
      ],
      pitfalls: [
        "Accéder à argv[1] sans vérifier argc >= 2 — comportement indéfini si l'argument est absent.",
        "Oublier que argv contient des char* et pas des std::string directement."
      ],
      method: [
        "Commence par tester argc avant tout accès à argv.",
        "Convertis argv[i] en std::string dès que tu en as besoin pour traitement.",
        "Affiche un usage clair vers std::cerr si les arguments sont invalides."
      ],
      check: "Que se passe-t-il si l'utilisateur oublie de passer le nom de fichier et que ton code accède à argv[1] sans vérification ?"
    },
    {
      focus: "iomanip transforme cout en moteur de rendu simple. Le piège à retenir : setw ne s'applique qu'au prochain champ, les autres manipulateurs sont persistants — oublier cette asymétrie produit des alignements décalés.",
      retenir: [
        "setw est à usage unique ; left/right/setprecision/setfill persistent.",
        "fixed + setprecision(2) est la combinaison standard pour afficher des réels formatés."
      ],
      pitfalls: [
        "Réutiliser setw sans le rappeler pour chaque champ.",
        "Oublier de revenir à right après avoir utilisé left sur une colonne de texte."
      ],
      method: [
        "Dessine la structure de ta sortie avant de coder (largeurs, alignements).",
        "Applique setw juste avant chaque valeur à aligner.",
        "Teste avec des valeurs de longueurs différentes pour détecter les débordements."
      ],
      check: "Si tu affiches 5 colonnes, combien de fois dois-tu appeler setw ?"
    }
  ],
  "modern-cpp": [
    {
      focus: "auto est un excellent outil quand il réduit le bruit sans cacher le sens. Il ne doit pas transformer le code en devinette : on l'utilise pour mieux lire, pas pour écrire moins au hasard.",
      retenir: [
        "auto fonctionne très bien quand le type est évident à droite ou sans intérêt métier particulier.",
        "Le lecteur doit toujours pouvoir reconstruire facilement l'idée portée par la variable."
      ],
      pitfalls: [
        "Utiliser auto sur une expression dont le type change subtilement la sémantique.",
        "Empiler des auto dans un code où les notions métier deviennent invisibles."
      ],
      method: [
        "Demande-toi si le type exact aide vraiment le lecteur ici.",
        "Si oui, écris-le explicitement ; sinon, utilise auto pour alléger.",
        "Relis la ligne hors contexte pour vérifier que l'intention reste nette."
      ],
      check: "Sur une déclaration donnée, auto rend-il le code plus clair ou moins informatif ?"
    },
    {
      focus: "Les outils modernes rentables sont ceux qui simplifient un vrai problème : parcours, absence de valeur, vues légères, intentions plus explicites. Leur intérêt se mesure à la réduction des cas spéciaux et du bruit mental.",
      retenir: [
        "range-for, optional, string_view ou structured bindings servent d'abord la clarté du code.",
        "Le standard moderne aide à exprimer les cas d'usage fréquents avec moins de code accidentel."
      ],
      pitfalls: [
        "Adopter une nouveauté syntaxique sans comprendre la contrainte qu'elle résout.",
        "Utiliser optional ou string_view comme gadgets plutôt que comme outils de contrat."
      ],
      method: [
        "Repère les zones de code répétitives ou ambiguës.",
        "Choisis l'outil moderne qui clarifie exactement cette zone.",
        "Vérifie que la nouvelle écriture simplifie aussi l'explication à l'oral."
      ],
      check: "Peux-tu montrer un cas où optional ou range-for réduit réellement le risque de bug ou d'ambiguïté ?"
    },
    {
      focus: "Moderniser sans bruit, c'est refactorer avec mesure. Le but n'est pas de saupoudrer des idiomes modernes partout, mais d'améliorer la sécurité, la lisibilité et la cohérence sans casser le sens du code existant.",
      retenir: [
        "Une modernisation réussie laisse un code plus simple à lire qu'avant.",
        "Le meilleur refactoring est souvent local, progressif et justifié par un bénéfice concret."
      ],
      pitfalls: [
        "Tout réécrire en style moderne en une fois sans sécuriser le comportement.",
        "Confondre modernité syntaxique et amélioration de conception."
      ],
      method: [
        "Choisis un point douloureux précis à améliorer.",
        "Applique un changement moderne ciblé et vérifiable.",
        "Contrôle ensuite si la compréhension et la robustesse ont réellement progressé."
      ],
      check: "Si tu modernises une portion de code, quel bénéfice concret peux-tu annoncer avant même d'écrire la première ligne ?"
    }
  ],
  "architecture-projet": [
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
  ],
  "concurrence-threads": [
    {
      focus: "La concurrence n'est pas juste une question de performance ; c'est d'abord une question de correction. Un programme concurrent mal synchronisé peut sembler fonctionner pendant des heures, puis se comporter de façon imprévisible sous charge. Comprendre le data race avant d'écrire du code concurrent est le vrai point de départ.",
      retenir: [
        "Tout accès non synchronisé à une donnée partagée depuis plusieurs threads est un comportement indéfini.",
        "Le modèle de mémoire C++11 définit ce que le compilateur peut ou ne peut pas réordonner."
      ],
      pitfalls: [
        "Supposer que le code 'semble marcher' en test suffit à prouver l'absence de data race.",
        "Ignorer que le compilateur ou le processeur peut réordonner les instructions sans barrière mémoire."
      ],
      method: [
        "Identifie toutes les données accédées par plusieurs threads.",
        "Détermine qui lit et qui écrit chaque donnée partagée.",
        "Protège systématiquement ces accès avant de tester quoi que ce soit."
      ],
      check: "Pourrais-tu identifier dans un programme simple tous les endroits où une synchronisation est nécessaire ?"
    },
    {
      focus: "join() et detach() ne sont pas des détails techniques : ils expriment deux intentions radicalement différentes. Le premier dit 'j'attends ce thread', le second dit 'je n'en suis plus responsable'. Choisir entre les deux est une décision de conception, pas une formalité syntaxique.",
      retenir: [
        "Un thread détruit sans join ni detach termine le programme avec <code>std::terminate()</code>.",
        "detach() transfère la responsabilité au runtime ; join() maintient le contrôle dans le code appelant."
      ],
      pitfalls: [
        "Appeler join() sur un thread déjà rejoint provoque une exception.",
        "Utiliser detach() sans s'assurer que les données référencées restent valides pendant toute la durée du thread."
      ],
      method: [
        "Par défaut, préfère join() pour garder le contrôle sur la durée de vie des threads.",
        "Utilise detach() seulement pour des tâches réellement autonomes sans communication retour.",
        "Envisage un RAII wrapper pour garantir le join à la sortie de portée."
      ],
      check: "Dans quel scénario detach() est-il réellement justifié plutôt que simplement commode ?"
    },
    {
      focus: "Un mutex protège une section critique. L'enjeu n'est pas la taille du mutex mais celle de la section protégée : plus elle est grande, plus les threads attendent. L'optimisation d'un code concurrent commence souvent par la réduction des sections critiques.",
      retenir: [
        "<code>lock_guard</code> libère le mutex à la sortie de portée, même en cas d'exception.",
        "Protéger en lecture comme en écriture est indispensable ; une lecture non protégée d'une donnée écrite par un autre thread est aussi un data race."
      ],
      pitfalls: [
        "Acquérir deux mutex dans des ordres différents selon les chemins d'exécution : deadlock certain.",
        "Oublier de protéger les lectures qui semblent 'inoffensives'."
      ],
      method: [
        "Identifie la donnée partagée, puis toutes ses portes d'accès.",
        "Minimise la région protégée par le mutex.",
        "Documente clairement quel mutex protège quelle donnée."
      ],
      check: "Comment détecterais-tu qu'un deadlock est possible dans un code qui acquiert deux mutex ?"
    },
    {
      focus: "std::async et std::future sont l'abstraction de haut niveau pour les tâches parallèles ponctuelles. Plutôt que de gérer des threads et de la synchronisation manuellement, on exprime une tâche et on récupère son résultat quand on en a besoin — le runtime se charge du reste.",
      retenir: [
        "<code>std::async</code> avec <code>launch::async</code> garantit l'exécution dans un thread séparé.",
        "<code>future::get()</code> bloque jusqu'au résultat et propage les exceptions levées dans la tâche."
      ],
      pitfalls: [
        "Ne pas spécifier <code>launch::async</code> peut mener à une exécution différée non parallèle.",
        "Appeler <code>get()</code> deux fois sur le même future lève une exception."
      ],
      method: [
        "Utilise async pour des calculs indépendants que tu veux paralléliser sans gérer de threads.",
        "Lance plusieurs futures, puis collecte les résultats dans l'ordre qui fait sens.",
        "Gère les exceptions via try/catch autour de <code>get()</code>."
      ],
      check: "Réécrirais-tu ce calcul séquentiel en deux tâches async ? Si oui, quelles données chaque tâche ne doit-elle pas partager ?"
    }
  ],
  "tests-qualite": [
    {
      focus: "Tester n'est pas une étape facultative pour 'être sûr' : c'est un outil de conception. Un test bien écrit force à clarifier ce que doit faire une fonction avant de l'implémenter, ce qui conduit souvent à une meilleure interface et à un code plus simple.",
      retenir: [
        "Un test unitaire vérifie le comportement observable, pas l'implémentation interne.",
        "La valeur d'un test se mesure à sa capacité à détecter une régression, pas à sa quantité."
      ],
      pitfalls: [
        "Écrire des tests qui vérifient l'implémentation plutôt que le comportement : ils cassent à chaque refactoring sain.",
        "Confondre couverture de code élevée et qualité des tests."
      ],
      method: [
        "Pour chaque unité, énumère les cas normaux, les cas limites et les cas d'erreur.",
        "Nomme chaque test par le comportement attendu, pas par le mécanisme testé.",
        "Commence par les tests des invariants les plus importants de la classe ou de la fonction."
      ],
      check: "Peux-tu écrire les tests d'une fonction avant d'en connaître l'implémentation exacte ?"
    },
    {
      focus: "Catch2 rend les tests lisibles parce que les macros expriment des assertions en langage presque naturel. Mais l'outil n'est pas l'essentiel : c'est la rigueur dans le choix des cas testés qui fait la différence entre des tests utiles et du bruit.",
      retenir: [
        "<code>REQUIRE</code> arrête le test à l'échec ; <code>CHECK</code> continue pour rapporter tous les problèmes du test.",
        "<code>Approx</code> permet de comparer des flottants sans dépendre de l'égalité exacte."
      ],
      pitfalls: [
        "Utiliser <code>CHECK</code> là où <code>REQUIRE</code> s'impose : continuer après un état incohérent masque la vraie cause.",
        "Oublier les cas d'erreur et les exceptions dans les tests."
      ],
      method: [
        "Écris un <code>TEST_CASE</code> par comportement à vérifier, pas par classe ou par méthode.",
        "Utilise <code>REQUIRE</code> pour les préconditions et les résultats critiques.",
        "Couvre au minimum : cas normal, valeur limite, erreur attendue."
      ],
      check: "Pourrais-tu donner le même nom à deux TEST_CASEs distincts ? Que t'apprendrait cette situation sur la clarté de tes tests ?"
    },
    {
      focus: "TDD change l'ordre d'écriture, pas seulement la séquence des actions. Son vrai bénéfice est de forcer à penser l'interface depuis l'usage avant l'implémentation. Quand on écrit le test en premier, on adopte naturellement le point de vue de l'appelant.",
      retenir: [
        "Rouge : test échoue (code inexistant). Vert : code minimal qui fait passer. Refactoring : améliorer sans casser.",
        "Le cycle TDD est court : on ne vise pas 'tout implémenter', mais 'faire passer ce test précis'."
      ],
      pitfalls: [
        "Écrire trop de code pendant la phase verte et contourner la discipline du cycle court.",
        "Refactorer avant que tous les tests soient verts."
      ],
      method: [
        "Commence par le test le plus simple qui peut échouer.",
        "Implémente juste assez pour le faire passer, pas plus.",
        "Refactorise seulement quand tous les tests existants sont verts."
      ],
      check: "Qu'est-ce que le compilateur te dirait si tu écrivais uniquement les tests d'une classe sans son implémentation ?"
    },
    {
      focus: "Un bon test vérifie le comportement, pas l'implémentation. Cette distinction est subtile mais décisive : un test dépendant des détails internes casse à chaque refactoring sain et finit par décourager les améliorations de code.",
      retenir: [
        "Teste par l'interface publique : ce qu'un appelant légitime peut observer.",
        "Les cas limites révèlent souvent plus de bugs que les cas normaux."
      ],
      pitfalls: [
        "Un taux de couverture élevé ne garantit pas des tests pertinents.",
        "Tester des méthodes privées directement fragilise les tests sans apporter de valeur supplémentaire."
      ],
      method: [
        "Pour chaque test, demande-toi : quel invariant ou quelle promesse de l'interface vérifie-t-il ?",
        "Ajoute un test à chaque bug corrigé pour éviter la régression.",
        "Garde les tests rapides et indépendants les uns des autres."
      ],
      check: "Si tu renommes un attribut privé d'une classe, combien de tes tests devraient casser idéalement ?"
    }
  ]
};

const glossary = [
  {
    term: "Algorithme (STL)",
    text: "Fonction template capable de s'appliquer à une collection d'éléments en naviguant via des itérateurs.",
    tags: ["stl", "algorithmes"]
  },
  {
    term: "Allocation dynamique",
    text: "Réservation d'une zone mémoire sur le tas, généralement avec <code>new</code> ou <code>new[]</code>. En C++ moderne, on préfère souvent laisser <code>std::vector</code> ou un smart pointer exprimer cette allocation.",
    tags: ["memoire", "heap"]
  },
  {
    term: "Bibliothèque dynamique",
    text: "Bibliothèque dont l'emplacement est indiqué au programme pour être chargée en mémoire après son lancement.",
    tags: ["build", "linkage"]
  },
  {
    term: "Bibliothèque statique",
    text: "Bibliothèque dont les définitions de fonctions sont incluses directement dans l'exécutable pendant l'édition de liens.",
    tags: ["build", "linkage"]
  },
  {
    term: "Bloc catch",
    text: "Gestionnaire d'exception qui traite l'erreur une fois que le programme a été dérouté par l'instruction throw.",
    tags: ["exceptions", "erreurs"]
  },
  {
    term: "Bloc try",
    text: "Morceau de programme mis sous surveillance pour détecter une exception qui pourrait s'y produire.",
    tags: ["exceptions", "erreurs"]
  },
  {
    term: "Classe",
    text: "Type qui regroupe un état et des opérations, mais surtout un contrat : ce qu'un objet valide peut faire et ce qu'il doit toujours garantir.",
    tags: ["poo", "objet"]
  },
  {
    term: "Classe abstraite",
    text: "Classe contenant au moins une fonction virtuelle pure, ce qui empêche son instanciation.",
    tags: ["poo", "polymorphisme"]
  },
  {
    term: "Const-correctness",
    text: "Discipline qui consiste à dire explicitement ce qui peut être modifié ou non dans une API, afin que le contrat soit visible dès la signature.",
    tags: ["api", "const"]
  },
  {
    term: "Constructeur",
    text: "Fonction membre spéciale appelée à la création de l'objet. Son rôle n'est pas seulement de remplir des champs, mais de produire un objet immédiatement valide.",
    tags: ["poo", "cycle de vie"]
  },
  {
    term: "Conteneurs associatifs",
    text: "Classes de la STL où les éléments sont ordonnés et identifiés par une clé, comme map ou set.",
    tags: ["stl", "conteneurs"]
  },
  {
    term: "Conteneurs séquentiels",
    text: "Classes de la STL où les éléments sont ordonnés et où l'on peut insérer ou supprimer explicitement à un endroit, comme vector, list ou deque.",
    tags: ["stl", "conteneurs"]
  },
  {
    term: "Copy constructor",
    text: "Constructeur qui crée un nouvel objet à partir d'un objet du même type.",
    tags: ["copie", "poo"]
  },
  {
    term: "Destructeur",
    text: "Fonction membre spéciale appelée automatiquement en fin de vie d'un objet pour libérer les ressources qu'il possède réellement.",
    tags: ["poo", "cycle de vie", "raii"]
  },
  {
    term: "Encapsulation",
    text: "Principe qui consiste à protéger l'état interne d'un objet derrière une interface, afin de défendre son invariant au lieu d'exposer librement ses données.",
    tags: ["poo", "design"]
  },
  {
    term: "Espace de noms (namespace)",
    text: "Mécanisme de regroupement logique qui évite les collisions de noms et signale qu'un type ou une fonction appartient à un domaine précis.",
    tags: ["compilation", "organisation"]
  },
  {
    term: "Exception",
    text: "Événement indiquant une erreur pendant l'exécution, entraînant une suspension du flux normal et le déroutement vers un gestionnaire dédié.",
    tags: ["exceptions", "erreurs"]
  },
  {
    term: "Fichier logique",
    text: "Variable de flux comme ifstream, ofstream ou fstream liée au fichier physique pour l'utiliser dans le programme.",
    tags: ["fichiers", "io"]
  },
  {
    term: "Flot / Flux",
    text: "Canal intermédiaire standard pour les entrées et sorties en C++, comme cin, cout ou cerr.",
    tags: ["io", "flux"]
  },
  {
    term: "Fonction virtuelle",
    text: "Fonction permettant l'héritage d'interface et d'implémentation par défaut, avec choix dynamique de la méthode selon le type de l'objet.",
    tags: ["poo", "polymorphisme"]
  },
  {
    term: "Fonction virtuelle pure",
    text: "Méthode déclarée avec = 0 qui impose aux classes dérivées concrètes de fournir son implémentation.",
    tags: ["poo", "polymorphisme"]
  },
  {
    term: "Foncteur (Function object)",
    text: "Objet se comportant comme une fonction grâce à la surcharge de l'opérateur().",
    tags: ["stl", "operateurs"]
  },
  {
    term: "Friend function",
    text: "Fonction non membre autorisée à accéder aux membres privés d'une classe si cela sert le contrat de l'API.",
    tags: ["operateurs", "poo"]
  },
  {
    term: "Héritage",
    text: "Déclaration d'une classe dérivée à partir d'une classe de base pour hériter de ses membres, réutiliser le code et ajouter des fonctionnalités.",
    tags: ["poo", "polymorphisme"]
  },
  {
    term: "Héritage multiple",
    text: "Fait pour une classe de dériver de plusieurs classes simultanément et d'hériter ainsi des données et fonctions de toutes ces classes mères.",
    tags: ["poo", "polymorphisme"]
  },
  {
    term: "Implémentation de classe",
    text: "Code définissant les fonctions déclarées dans l'interface, généralement placé dans un fichier .cpp.",
    tags: ["poo", "organisation"]
  },
  {
    term: "Instanciation",
    text: "Action de créer un objet d'un type donné, analogue à la déclaration d'une variable.",
    tags: ["poo", "objet"]
  },
  {
    term: "Interface de classe",
    text: "Description de la structure incluant les données membres et le prototype des fonctions membres, souvent contenue dans un fichier .h.",
    tags: ["poo", "organisation"]
  },
  {
    term: "Invariant",
    text: "Propriété qui doit rester vraie pour qu'un objet soit considéré comme cohérent et utilisable. Une bonne classe organise son API autour de cette règle.",
    tags: ["design", "classe"]
  },
  {
    term: "Iterator",
    text: "Abstraction de parcours utilisée par les conteneurs et les algorithmes de la STL.",
    tags: ["stl", "iterateurs"]
  },
  {
    term: "Linker",
    text: "Outil qui assemble les fichiers objets et résout les symboles entre modules.",
    tags: ["build", "edition de liens"]
  },
  {
    term: "Modes d'ouverture",
    text: "Paramètres déterminant l'action sur un fichier, comme ios::in pour la lecture, ios::out pour l'écriture, ios::app pour l'ajout et ios::trunc pour le vidage à l'ouverture.",
    tags: ["fichiers", "io"]
  },
  {
    term: "Move semantics",
    text: "Mécanisme permettant de transférer une ressource au lieu de la recopier.",
    tags: ["performance", "ownership"]
  },
  {
    term: "Optional",
    text: "Type standard exprimant qu'une valeur peut être présente ou absente.",
    tags: ["modern cpp", "std"]
  },
  {
    term: "Ownership",
    text: "Relation qui désigne qui est responsable de la durée de vie d'une ressource et donc de sa libération. C'est l'idée centrale derrière RAII, <code>unique_ptr</code> et <code>shared_ptr</code>.",
    tags: ["memoire", "ressources"]
  },
  {
    term: "Pile d'exécution (stack)",
    text: "Zone mémoire où vivent notamment les variables locales automatiques et les cadres d'appels de fonctions. Les objets qui y sont créés sont détruits automatiquement à la sortie du scope.",
    tags: ["memoire", "stack"]
  },
  {
    term: "Pointeur this",
    text: "Pointeur implicite vers l'objet courant à l'intérieur d'une méthode. Il sert surtout à lever une ambiguïté de nom ou à retourner <code>*this</code> dans une API chaînable.",
    tags: ["poo", "objet"]
  },
  {
    term: "Polymorphisme",
    text: "Capacité à manipuler des objets de types différents via une interface commune.",
    tags: ["objet", "poo"]
  },
  {
    term: "Prédicat",
    text: "Type de foncteur prenant un seul argument et renvoyant un booléen pour tester une propriété particulière d'un objet.",
    tags: ["stl", "algorithmes"]
  },
  {
    term: "Propagation d'une exception",
    text: "Retransmission d'une exception vers la fonction appelante ou vers le niveau try/catch immédiatement supérieur si elle n'est pas gérée localement.",
    tags: ["exceptions", "erreurs"]
  },
  {
    term: "RAII",
    text: "Principe qui confie une ressource à un objet dès sa construction et la libère automatiquement à sa destruction. Cela évite d'éparpiller des <code>open()</code>, <code>close()</code>, <code>new</code> et <code>delete</code> dans le code appelant.",
    tags: ["lifetime", "resource", "raii"]
  },
  {
    term: "Redéfinition",
    text: "Modification du comportement d'une méthode existante héritée d'une classe de base.",
    tags: ["poo", "heritage"]
  },
  {
    term: "Référence (&)",
    text: "Alias sur un objet existant. Une référence exprime un lien obligatoire avec une cible valide, ce qui la rend souvent plus lisible qu'un pointeur pour les paramètres non optionnels.",
    tags: ["syntaxe", "parametres"]
  },
  {
    term: "Rule of 0",
    text: "Principe qui recommande de laisser le compilateur gérer les opérations spéciales quand les membres standard savent déjà le faire.",
    tags: ["design", "copie"]
  },
  {
    term: "Slicing",
    text: "Perte de la partie dérivée lorsqu'un objet polymorphique est copié par valeur dans un objet base.",
    tags: ["polymorphisme", "copie"]
  },
  {
    term: "STL",
    text: "Bibliothèque standard regroupant des algorithmes et des structures de données fondamentales testées et optimisées.",
    tags: ["stl", "standard library"]
  },
  {
    term: "Surcharge des opérateurs",
    text: "Possibilité de redéfinir le comportement des opérateurs standards pour des objets personnalisés, comme les opérateurs arithmétiques, de comparaison ou de flux.",
    tags: ["operateurs", "poo"]
  },
  {
    term: "Tas (heap)",
    text: "Zone de mémoire de taille variable utilisée pour le stockage des données allouées dynamiquement.",
    tags: ["memoire", "heap"]
  },
  {
    term: "Template",
    text: "Mécanisme de programmation générique permettant à une fonction ou une classe d'utiliser différents types tout en conservant un typage strict.",
    tags: ["template", "genericite"]
  },
  {
    term: "Template instantiation",
    text: "Génération par le compilateur d'une version concrète d'un template pour un type donné.",
    tags: ["template", "compilation"]
  },
  {
    term: "Translation unit",
    text: "Résultat d'un fichier source après passage du préprocesseur, avant linkage.",
    tags: ["compilation", "build"]
  },
  {
    term: "Undefined behavior",
    text: "Comportement pour lequel la norme ne garantit rien ; le programme peut sembler marcher puis casser ailleurs.",
    tags: ["safety", "debug"]
  },
  {
    term: "Lambda",
    text: "Fonction anonyme définie en ligne, capturant éventuellement des variables du contexte via sa liste de capture. Syntaxe : <code>[capture](params) { corps }</code>.",
    tags: ["syntaxe", "modern cpp", "stl"]
  },
  {
    term: "unique_ptr",
    text: "Smart pointer à possession exclusive. Il dit clairement : 'un seul propriétaire gère cette ressource'. Il n'est pas copiable, mais sa possession peut être transférée avec <code>std::move</code>.",
    tags: ["memoire", "ownership", "modern cpp"]
  },
  {
    term: "shared_ptr",
    text: "Smart pointer à possession partagée. Plusieurs objets peuvent copropriéter la même ressource, détruite quand le dernier propriétaire disparaît. À utiliser seulement quand cette copropriété est réelle et justifiée.",
    tags: ["memoire", "ownership", "modern cpp"]
  },
  {
    term: "weak_ptr",
    text: "Observateur non propriétaire d'une ressource gérée par <code>shared_ptr</code>. Il ne prolonge pas la durée de vie de l'objet et sert notamment à casser les cycles de références.",
    tags: ["memoire", "ownership", "modern cpp"]
  },
  {
    term: "nullptr",
    text: "Littéral représentant l'absence de cible pour un pointeur. Il remplace utilement <code>NULL</code> et <code>0</code> car il est typé et évite des ambiguïtés.",
    tags: ["syntaxe", "pointeur", "modern cpp"]
  },
  {
    term: "override",
    text: "Mot-clé placé après la signature d'une méthode dérivée pour demander au compilateur de vérifier qu'elle redéfinit bien une méthode virtuelle de la base.",
    tags: ["poo", "heritage", "polymorphisme"]
  },
  {
    term: "auto",
    text: "Mot-clé demandant au compilateur de déduire le type d'une variable ou d'un retour de fonction. Améliore la lisibilité quand le type est évident ou très verbeux.",
    tags: ["syntaxe", "modern cpp"]
  },
  {
    term: "noexcept",
    text: "Spécificateur indiquant qu'une fonction ne lancera pas d'exception. Permet aux conteneurs standard de préférer le déplacement à la copie en toute sécurité.",
    tags: ["exceptions", "modern cpp", "performance"]
  },
  {
    term: "Mutex",
    text: "Primitive de synchronisation qui garantit qu'un seul thread à la fois accède à une section critique. En C++, <code>std::mutex</code> se verrouille avec <code>lock()</code> et se déverrouille avec <code>unlock()</code>.",
    tags: ["concurrence", "thread", "safety"]
  },
  {
    term: "Thread",
    text: "Fil d'exécution indépendant partageant la mémoire du processus. En C++, représenté par <code>std::thread</code> ; doit être rejoint (<code>join()</code>) ou détaché (<code>detach()</code>) avant sa destruction.",
    tags: ["concurrence", "thread"]
  },
  {
    term: "Data race",
    text: "Accès concurrent non synchronisé à une même donnée par au moins deux threads, dont l'un au moins est en écriture. Constitue un comportement indéfini en C++.",
    tags: ["concurrence", "safety", "debug"]
  },
  {
    term: "std::future",
    text: "Objet permettant de récupérer le résultat d'une tâche asynchrone lancée avec <code>std::async</code>. L'appel à <code>.get()</code> bloque jusqu'à disponibilité du résultat.",
    tags: ["concurrence", "modern cpp"]
  },
  {
    term: "TDD (Test-Driven Development)",
    text: "Pratique de développement consistant à écrire le test avant le code. Cycle : rouge (test échoue) → vert (implémentation minimale) → refactoring.",
    tags: ["qualite", "design"]
  },
  {
    term: "Test unitaire",
    text: "Test automatisé qui vérifie le comportement d'une unité de code (fonction, classe) en isolation, indépendamment des autres modules.",
    tags: ["qualite", "debug"]
  },
  {
    term: "Dangling pointer",
    text: "Pointeur dont la cible n'existe plus, par exemple après un <code>delete</code> ou après la sortie de portée d'une variable locale. Le déréférencer produit un comportement indéfini.",
    tags: ["pointeur", "memoire", "safety", "debug"]
  },
  {
    term: "Fuite mémoire",
    text: "Ressource allouée dynamiquement qui n'est jamais libérée. En C++, résulte typiquement d'un <code>new</code> sans <code>delete</code> correspondant.",
    tags: ["memoire", "safety", "debug"]
  },
  {
    term: "lvalue / rvalue",
    text: "<em>lvalue</em> : expression désignant un objet persistant, addressable. <em>rvalue</em> : valeur temporaire sans adresse stable. La distinction guide les règles de move semantics.",
    tags: ["syntaxe", "modern cpp", "copie"]
  },
  {
    term: "Structured bindings",
    text: "Syntaxe C++17 permettant de décomposer une paire, un tuple ou une struct en variables nommées : <code>auto [clé, valeur] = ...</code>.",
    tags: ["syntaxe", "modern cpp"]
  },
  {
    term: "Copy-and-swap",
    text: "Idiome d'implémentation de l'opérateur d'affectation : créer une copie locale, l'échanger avec <code>*this</code> via <code>swap</code>, laisser le destructeur nettoyer l'ancienne valeur. Garantit la sécurité aux exceptions.",
    tags: ["copie", "design", "poo"]
  },
  {
    term: "vtable",
    text: "Table de pointeurs de fonctions virtuelles générée par le compilateur pour chaque classe polymorphique. Permet la résolution dynamique des appels de méthodes virtuelles à l'exécution.",
    tags: ["poo", "polymorphisme", "performance"]
  },
  {
    term: "lock_guard",
    text: "Wrapper RAII autour d'un mutex : verrouille à la construction, déverrouille automatiquement à la destruction, même en cas d'exception.",
    tags: ["concurrence", "raii", "memoire"]
  },
  {
    term: "std::move",
    text: "Fonction utilitaire qui convertit une expression en rvalue, autorisant le transfert de ressources plutôt que leur copie. N'effectue aucun déplacement par elle-même.",
    tags: ["copie", "modern cpp", "performance"]
  },
  {
    term: "Sanitizer",
    text: "Outil de détection dynamique d'erreurs activé à la compilation (<code>-fsanitize=address,undefined</code>). Détecte les débordements, accès invalides et comportements indéfinis à l'exécution.",
    tags: ["debug", "safety"]
  },
  {
    term: "Portée (scope)",
    text: "Région du code où un identifiant est visible et utilisable. En C++, délimitée par des accolades <code>{ }</code>. Les objets locaux sont détruits à la sortie de leur portée.",
    tags: ["syntaxe", "memoire"]
  },
  {
    term: "explicit",
    text: "Mot-clé appliqué à un constructeur pour interdire les conversions implicites. Force l'appelant à construire explicitement l'objet.",
    tags: ["poo", "syntaxe"]
  },
  {
    term: "Règle de 3 / 5",
    text: "Si une classe définit l'un des éléments suivants (destructeur, constructeur de copie, opérateur d'affectation), elle doit définir les trois (règle de 3) ou les cinq avec move (règle de 5).",
    tags: ["poo", "copie", "memoire"]
  },
  {
    term: "std::string_view",
    text: "Vue légère non propriétaire sur une chaîne de caractères existante. Évite la copie lors de la lecture d'une chaîne sans en modifier le contenu.",
    tags: ["modern cpp", "performance", "std"]
  },
  {
    term: "argc / argv",
    text: "Paramètres de <code>main(int argc, char* argv[])</code> permettant de récupérer les arguments passés en ligne de commande. <code>argc</code> est leur nombre (≥ 1) ; <code>argv[0]</code> est le nom du programme, <code>argv[1]</code> le premier argument utilisateur.",
    tags: ["syntaxe", "io", "compilation"]
  },
  {
    term: "iomanip / setw",
    text: "Bibliothèque <code>&lt;iomanip&gt;</code> fournissant des manipulateurs de flux : <code>std::setw(n)</code> réserve une largeur, <code>std::left</code>/<code>std::right</code> aligne, <code>std::setprecision(n)</code> contrôle les décimales. <code>setw</code> n'est pas persistant ; les autres le sont.",
    tags: ["io", "flux", "formatage"]
  },
  {
    term: "std::stack",
    text: "Adaptateur de conteneur STL implémentant une pile LIFO (Last In First Out). Interface : <code>push</code>, <code>top</code>, <code>pop</code>, <code>empty</code>, <code>size</code>. Construit sur <code>std::deque</code> par défaut.",
    tags: ["stl", "conteneurs"]
  },
  {
    term: "std::queue",
    text: "Adaptateur de conteneur STL implémentant une file FIFO (First In First Out). Interface : <code>push</code>, <code>front</code>, <code>back</code>, <code>pop</code>, <code>empty</code>. Construit sur <code>std::deque</code> par défaut.",
    tags: ["stl", "conteneurs"]
  },
  {
    term: "std::copy",
    text: "Algorithme STL qui recopie les éléments d'une plage source vers une destination. Nécessite que l'espace de destination soit déjà alloué.",
    tags: ["stl", "algorithmes"]
  },
  {
    term: "std::transform",
    text: "Algorithme STL qui applique une fonction à chaque élément d'une plage source et écrit le résultat dans une destination. Remplace avantageusement une boucle de transformation manuelle.",
    tags: ["stl", "algorithmes"]
  },
  {
    term: "LIFO / FIFO",
    text: "<em>LIFO</em> (Last In First Out) : le dernier élément inséré est le premier retiré — modèle de la pile (<code>std::stack</code>). <em>FIFO</em> (First In First Out) : le premier inséré est le premier retiré — modèle de la file (<code>std::queue</code>).",
    tags: ["stl", "algorithmes", "conteneurs"]
  },
  {
    term: "Constructeur par recopie",
    text: "Constructeur qui crée un nouvel objet comme copie d'un objet existant du même type. Signature : <code>MaClasse(const MaClasse&amp; other)</code>. Appelé automatiquement lors d'un passage par valeur ou d'une initialisation par copie.",
    tags: ["poo", "copie", "cycle de vie"]
  },
  {
    term: "Opérateur d'affectation",
    text: "Opérateur <code>operator=</code> qui copie l'état d'un objet dans un objet existant du même type. Distinct du constructeur par recopie : l'objet cible existe déjà. Doit gérer l'auto-affectation et respecter la règle de 3/5.",
    tags: ["operateurs", "poo", "copie"]
  },
  {
    term: "Opérateur d'extraction (>>)",
    text: "Surcharge de <code>operator&gt;&gt;</code> pour lire un objet depuis un flux. Retourne <code>std::istream&amp;</code> pour permettre le chaînage. Généralement déclaré <code>friend</code> pour accéder aux membres privés.",
    tags: ["operateurs", "io", "flux"]
  },
  {
    term: "Nombre rationnel",
    text: "Nombre de la forme p/q (numérateur entier, dénominateur entier non nul). En C++, souvent modélisé par une classe <code>Fraction</code> surchargeant les opérateurs arithmétiques et de comparaison.",
    tags: ["poo", "operateurs", "maths"]
  },
  {
    term: "std::list",
    text: "Conteneur séquentiel STL implémentant une liste doublement chaînée. Insertions et suppressions en O(1) à n'importe quel endroit, mais accès indexé en O(n). À préférer à <code>std::vector</code> uniquement si les insertions au milieu sont l'opération dominante.",
    tags: ["stl", "conteneurs"]
  }
].sort((left, right) => left.term.localeCompare(right.term, "fr", { sensitivity: "base" }));

const chapters = rawChapters.map((chapter, index) => {
  const enrichedBody = injectLessonDeepDives(
    chapter.body,
    lessonDeepDivesByChapter[chapter.id] || []
  );

  return Object.assign({}, chapter, {
    body: enrichedBody,
    order: index + 1,
    searchText: normaliseForSearch([
      chapter.title,
      chapter.shortTitle,
      chapter.summary,
      chapter.track,
      chapter.level,
      chapter.goals.join(" "),
      chapter.checklist.join(" "),
      chapter.keywords.join(" "),
      stripHtml(enrichedBody),
      chapter.exercises.map((exercise) => `${exercise.title} ${exercise.prompt}`).join(" ")
    ].join(" "))
  });
});

window.COURSE_DATA = {
  courseMeta,
  roadmap,
  glossary,
  chapters
};
