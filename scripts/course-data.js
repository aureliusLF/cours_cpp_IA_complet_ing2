const escapeHtml = (value) => value
  .replace(/&/g, "&amp;")
  .replace(/</g, "&lt;")
  .replace(/>/g, "&gt;");

const stripHtml = (value) => value.replace(/<[^>]+>/g, " ");

const normaliseForSearch = (value) => String(value)
  .normalize("NFD")
  .replace(/[\u0300-\u036f]/g, "")
  .toLowerCase();

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
      "Ce chapitre repart de zéro et ne suppose aucune base en C. On y construit la forme minimale d'un programme C++, les variables, les types de base, les chaînes, les entrées/sorties, l'initialisation, les conditions et les boucles.",
    goals: [
      "lire et écrire un programme C++ minimal avec <code>main</code>, <code>#include</code> et <code>std::cout</code>",
      "manipuler des variables, des types de base, <code>std::string</code> et des constantes sans réflexes hérités du C",
      "utiliser initialisation, conditions et boucles avec une syntaxe claire et sûre"
    ],
    highlights: ["main()", "std::cout", "std::string", "{}", "if/for"],
    body: [
      lesson(
        "Lire un premier programme C++ sans bagage en C",
        paragraphs(
          "Un programme C++ est composé d'instructions regroupées dans des blocs entre accolades. Quand le programme démarre, la fonction <code>main</code> est exécutée. Tu peux donc lire un premier fichier comme une recette : importer ce dont on a besoin, entrer dans <code>main</code>, puis exécuter les instructions une par une.",
          "Les lignes commençant par <code>#include</code> servent à rendre disponibles des outils de la bibliothèque standard. Par exemple, <code>&lt;iostream&gt;</code> donne accès à l'affichage console avec <code>std::cout</code>, et <code>&lt;string&gt;</code> permet de manipuler du texte de façon sûre avec <code>std::string</code>."
        ),
        code(
          "cpp",
          `
#include <iostream>
#include <string>

int main() {
    std::string prenom{"Ines"};
    std::cout << "Bonjour " << prenom << '\n';
    return 0;
}
          `,
          "Programme complet minimal"
        ),
        table(
          ["Élément", "Rôle"],
          [
            ["<code>#include</code>", "Rend disponible une bibliothèque standard ou un header du projet."],
            ["<code>int main()</code>", "Point d'entrée du programme."],
            ["<code>{ ... }</code>", "Délimite un bloc d'instructions."],
            ["<code>;</code>", "Marque la fin d'une instruction simple."],
            ["<code>std::cout</code>", "Affiche du texte ou des valeurs dans le terminal."]
          ]
        ),
        callout("info", "Aucun prérequis C n'est supposé", "Tu n'as pas besoin de connaître les tableaux de <code>char</code>, les pointeurs arithmétiques ou les habitudes historiques du C pour comprendre ce chapitre. On part volontairement d'une base C++ moderne.")
      ),
      lesson(
        "Variables, types de base et premières affectations",
        paragraphs(
          "Une variable associe un nom, un type et une valeur. Le type indique ce que la variable peut contenir et quelles opérations ont du sens. En C++ moderne, on manipule très tôt <code>int</code> pour les entiers, <code>double</code> pour les réels, <code>bool</code> pour le vrai/faux et <code>std::string</code> pour le texte.",
          "L'affectation avec <code>=</code> remplace la valeur d'une variable existante. Déclarer une variable puis la modifier plus tard est courant, mais il faut rester attentif : le type, lui, ne change jamais. Si <code>age</code> est un <code>int</code>, il restera un entier jusqu'à la fin de sa portée."
        ),
        table(
          ["Type", "Quand l'utiliser"],
          [
            ["<code>int</code>", "Compteurs, quantités entières, indices simples."],
            ["<code>double</code>", "Mesures, moyennes, valeurs réelles."],
            ["<code>bool</code>", "Réponse oui/non, état vrai/faux."],
            ["<code>std::string</code>", "Texte utilisateur, noms, messages."]
          ]
        ),
        code(
          "cpp",
          `
int age{19};
double moyenne{14.75};
bool admis{moyenne >= 10.0};
std::string groupe{"ING2-A"};

age = age + 1;
moyenne = 15.25;
          `,
          "Déclarer puis réaffecter"
        ),
        code(
          "cpp",
          `
std::cout << "Age : " << age << '\n';
std::cout << "Moyenne : " << moyenne << '\n';
std::cout << "Admission : " << admis << '\n';
std::cout << "Groupe : " << groupe << '\n';
          `,
          "Afficher des valeurs de types différents"
        ),
        callout("success", "Bonne habitude", "Donne à chaque variable un nom qui décrit son rôle métier. Un bon nom aide souvent plus qu'un commentaire.")
      ),
      lesson(
        "Texte, affichage console et première saisie utilisateur",
        paragraphs(
          "La console est le terrain d'entraînement le plus simple pour apprendre la syntaxe. Avec <code>std::cout</code>, on affiche des valeurs ; avec <code>std::cin</code>, on lit une saisie utilisateur. L'opérateur <code>&lt;&lt;</code> envoie des données vers la sortie, tandis que <code>&gt;&gt;</code> récupère des données depuis l'entrée.",
          "Pour le texte, préfère <code>std::string</code> aux chaînes du C. Une <code>std::string</code> sait gérer sa mémoire toute seule, se compare facilement et se combine sans manipulations dangereuses."
        ),
        code(
          "cpp",
          `
#include <iostream>
#include <string>

int main() {
    std::string prenom{};
    std::cout << "Quel est ton prénom ? ";
    std::cin >> prenom;

    std::cout << "Bienvenue, " << prenom << " !\n";
    return 0;
}
          `,
          "Première interaction clavier"
        ),
        code(
          "cpp",
          `
std::string nomComplet{"Ada Lovelace"};
std::cout << "Longueur : " << nomComplet.size() << '\n';
std::cout << "Première lettre : " << nomComplet[0] << '\n';
          `,
          "Manipuler simplement std::string"
        ),
        callout("warn", "Réflexe moderne", "Quand tu manipules du texte applicatif, <code>std::string</code> est presque toujours le bon point de départ. Les tableaux de <code>char</code> appartiennent à des cas plus bas niveau.")
      ),
      lesson(
        "Initialisation sûre, constantes et états explicites",
        paragraphs(
          "L'initialisation avec accolades évite plusieurs pièges historiques et harmonise la syntaxe entre types simples et objets. Elle détecte aussi les <em>narrowing conversions</em> à la compilation, c'est-à-dire les conversions qui pourraient perdre de l'information.",
          "<code>const</code> dit qu'une valeur ne doit plus changer après son initialisation. <code>constexpr</code> va plus loin : il exprime qu'une valeur ou une fonction peut être calculée à la compilation. Enfin, <code>enum class</code> permet de représenter des états nommés sans créer de collisions de noms."
        ),
        code(
          "cpp",
          `
const int maxTentatives{3};
constexpr double pi{3.1415926535};
int nbEtudiants{32};
double moyenne{14.6};
// int i{moyenne}; // erreur : conversion réductrice

enum class EtatProjet {
    EnConception,
    EnDeveloppement,
    Termine
};
          `,
          "Initialisation, const et enum class"
        ),
        code(
          "cpp",
          `
enum class Menu {
    Jouer,
    Options,
    Quitter
};

Menu choix{Menu::Options};
          `,
          "Exprimer un état métier avec enum class"
        ),
        callout("warn", "À éviter", "Ne mélangez pas syntaxe C ancienne et style moderne sans raison. Un projet gagne en clarté lorsque la convention d'initialisation reste cohérente.")
      ),
      lesson(
        "Expressions booléennes et conditions",
        paragraphs(
          "Une condition répond à une question vraie ou fausse. Les opérateurs <code>==</code>, <code>!=</code>, <code>&lt;</code>, <code>&lt;=</code>, <code>&gt;</code> et <code>&gt;=</code> servent à comparer des valeurs. Les opérateurs <code>&amp;&amp;</code> et <code>||</code> combinent plusieurs tests.",
          "L'un des pièges classiques pour les débutants est de confondre <code>=</code> et <code>==</code> : le premier affecte une valeur, le second compare deux valeurs. Une condition lisible doit exprimer une règle claire, pas une énigme."
        ),
        table(
          ["Expression", "Signification"],
          [
            ["<code>age &gt;= 18</code>", "La valeur de <code>age</code> est au moins 18."],
            ["<code>note == 20</code>", "La variable <code>note</code> vaut exactement 20."],
            ["<code>admis &amp;&amp; present</code>", "Les deux conditions doivent être vraies."],
            ["<code>retard || absent</code>", "Au moins une des deux conditions est vraie."]
          ]
        ),
        code(
          "cpp",
          `
double note{13.5};

if (note >= 16.0) {
    std::cout << "Très bien\n";
} else if (note >= 10.0) {
    std::cout << "Valide\n";
} else {
    std::cout << "À retravailler\n";
}
          `,
          "Chaîne de conditions simple"
        ),
        callout("warn", "Piège classique", "Si tu écris <code>if (note = 10)</code>, tu modifies la variable au lieu de comparer. Le compilateur peut t'aider à détecter ce type d'erreur si les warnings sont activés.")
      ),
      lesson(
        "Boucles, portée des variables et premiers parcours",
        paragraphs(
          "Les boucles répètent un traitement. Une boucle <code>for</code> est pratique quand on connaît à l'avance la structure du parcours ; une boucle <code>while</code> est adaptée quand on répète jusqu'à ce qu'une condition devienne fausse. La portée d'une variable doit rester la plus petite possible : cela réduit les erreurs et simplifie la lecture.",
          "En C++ moderne, le <code>range-based for</code> permet de parcourir directement les éléments d'une collection. C'est souvent plus lisible qu'une boucle manuelle sur des indices lorsque tu veux simplement traiter chaque élément."
        ),
        code(
          "cpp",
          `
for (int i{1}; i <= 3; ++i) {
    std::cout << "Tour " << i << '\n';
}
          `,
          "Boucle for bornée"
        ),
        code(
          "cpp",
          `
#include <vector>

std::vector<int> notes{12, 15, 9, 18};

for (int note : notes) {
    if (note >= 10) {
        std::cout << "validée\n";
    } else {
        std::cout << "à retravailler\n";
    }
}
          `,
          "Parcours d'une collection"
        ),
        code(
          "cpp",
          `
int tentative{0};

while (tentative < 3) {
    std::cout << "Tentative " << tentative + 1 << '\n';
    ++tentative;
}
          `,
          "Boucle while simple"
        ),
        bullets([
          "Déclarer une variable dans la boucle si elle n'est utile que là.",
          "Préférer une boucle lisible à une boucle 'maligne' mais opaque.",
          "Relire la condition d'arrêt pour éviter les boucles infinies accidentelles."
        ])
      )
    ].join(""),
    checklist: [
      "Je sais lire la structure minimale d'un programme avec <code>main</code>.",
      "Je distingue déclaration, initialisation et affectation.",
      "Je sais afficher et lire une valeur simple avec <code>std::cout</code> et <code>std::cin</code>.",
      "Je préfère <code>std::string</code> aux chaînes C pour les cas courants.",
      "Je comprends la différence entre <code>const</code> et <code>constexpr</code>.",
      "J'utilise l'initialisation avec accolades.",
      "Je fais la différence entre <code>=</code> et <code>==</code>.",
      "Je limite la portée des variables et je choisis correctement entre <code>if</code>, <code>for</code> et <code>while</code>.",
      "Je peux justifier l'usage d'un <code>enum class</code>."
    ],
    quiz: [
      {
        question: "Quel est le rôle de <code>int main()</code> dans un programme C++ ?",
        options: [
          "Déclarer une variable globale spéciale",
          "Définir le point d'entrée du programme",
          "Activer automatiquement toutes les bibliothèques standard"
        ],
        answer: 1,
        explanation: "La fonction <code>main</code> est le point d'entrée exécuté au démarrage du programme."
      },
      {
        question: "Que protège principalement l'initialisation <code>{}</code> ?",
        options: [
          "Elle accélère toujours le programme",
          "Elle interdit certaines conversions dangereuses",
          "Elle remplace tous les constructeurs"
        ],
        answer: 1,
        explanation: "Les accolades empêchent notamment les conversions réductrices silencieuses comme <code>int i{7.4};</code>."
      },
      {
        question: "Pourquoi préférer <code>enum class</code> à <code>enum</code> ?",
        options: [
          "Parce qu'il prend toujours moins de mémoire",
          "Parce qu'il force une meilleure qualification des valeurs et évite des collisions de noms",
          "Parce qu'il est réservé aux exceptions"
        ],
        answer: 1,
        explanation: "<code>enum class</code> évite la pollution de l'espace global et renforce la sécurité de type."
      },
      {
        question: "Quelle expression compare deux valeurs au lieu de modifier une variable ?",
        options: ["<code>a = b</code>", "<code>a == b</code>", "<code>a &lt;&lt; b</code>"],
        answer: 1,
        explanation: "<code>==</code> sert à comparer ; <code>=</code> sert à affecter."
      }
    ],
    exercises: [
      {
        title: "Fiche identité console",
        difficulty: "Facile",
        time: "15 min",
        prompt: "Écris un petit programme qui lit un prénom, un âge et une moyenne, puis affiche un résumé propre avec un message différent selon que la moyenne valide ou non le semestre.",
        deliverables: [
          "des variables bien typées",
          "une lecture clavier simple",
          "au moins une condition <code>if / else</code> lisible"
        ]
      },
      {
        title: "Audit des conversions",
        difficulty: "Intermédiaire",
        time: "20 min",
        prompt: "Repère dans un petit programme toutes les conversions implicites, puis décide lesquelles doivent être interdites, explicitées ou conservées.",
        deliverables: [
          "une liste de conversions observées",
          "les corrections apportées",
          "la justification de chaque correction"
        ]
      }
    ],
    keywords: ["syntaxe", "main", "cout", "cin", "types", "string", "initialisation", "constexpr", "enum class", "conditions", "boucles", "if", "for", "while"]
  },
  {
    id: "pointeurs-memoire",
    shortTitle: "Pointeurs et mémoire",
    title: "Pointeurs, adresses mémoire et allocation dynamique",
    level: "Fondations",
    duration: "50 min",
    track: "SE1",
    summary:
      "Un pointeur n'est pas une abstraction de niveau avancé : c'est simplement une variable qui contient une adresse. Comprendre ce mécanisme ouvre la porte à la gestion mémoire, aux tableaux dynamiques, aux structures chaînées et au polymorphisme.",
    goals: [
      "lire et écrire une déclaration de pointeur avec <code>&amp;</code> et <code>*</code> sans confondre leurs rôles",
      "raisonner sur l'arithmétique des pointeurs et la relation tableau / pointeur",
      "distinguer les différentes combinaisons de <code>const</code> avec un pointeur",
      "identifier les pièges classiques : pointeur non initialisé, pointeur suspendu, confusion <code>delete</code>/<code>delete[]</code>"
    ],
    highlights: ["&", "*", "nullptr", "new/delete", "->"],
    body: [
      lesson(
        "L'adresse d'une variable et la déclaration d'un pointeur",
        paragraphs(
          "La mémoire RAM est un tableau de cases numérotées. Chaque variable occupe une ou plusieurs cases consécutives, et l'adresse d'une variable est le numéro de sa première case. Un <strong>pointeur</strong> est simplement une variable dont la valeur est une adresse.",
          "L'opérateur <code>&amp;</code> renvoie l'adresse d'une variable existante. L'opérateur <code>*</code> a deux rôles distincts : dans une déclaration, il indique que la variable est un pointeur ; dans une expression, il <em>déréférence</em> le pointeur, c'est-à-dire accède à la valeur stockée à l'adresse pointée."
        ),
        code(
          "cpp",
          `
int x = 42;
int* p = &x;   // p contient l'adresse de x

std::cout << p  << '\\n';  // affiche l'adresse (ex: 0x7ffe1c)
std::cout << *p << '\\n';  // affiche 42 — déréférencement

*p = 99;                   // modifie x à travers p
std::cout << x  << '\\n';  // affiche 99
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
        callout("danger", "Toujours initialiser", "Un pointeur non initialisé contient une adresse aléatoire. Le déréférencer provoque un comportement indéfini, souvent un crash. Si l'adresse cible n'est pas encore connue, utilise <code>nullptr</code>.")
      ),
      lesson(
        "Arithmétique des pointeurs et relation avec les tableaux",
        paragraphs(
          "Quand on incrémente un pointeur, il avance non pas d'un octet, mais d'une case du type pointé. Sur un <code>int*</code>, <code>p + 1</code> avance de <code>sizeof(int)</code> octets, soit généralement 4. Le compilateur gère ce calcul automatiquement.",
          "Le nom d'un tableau se comporte comme un pointeur constant vers son premier élément. La notation <code>arr[i]</code> est strictement équivalente à <code>*(arr + i)</code> : c'est la même instruction, deux syntaxes différentes."
        ),
        code(
          "cpp",
          `
int arr[] = {10, 20, 30, 40};
int* p = arr;          // pointe vers arr[0]

std::cout << *p        << '\\n';  // 10
p++;                              // avance d'un int (4 octets)
std::cout << *p        << '\\n';  // 20
std::cout << *(arr + 2)<< '\\n';  // 30 — équivalent à arr[2]
          `,
          "Arithmétique sur pointeur"
        ),
        bullets([
          "Incrémenter avance d'un élément du type pointé, pas d'un octet.",
          "<code>arr[i]</code> et <code>*(arr + i)</code> sont identiques pour le compilateur.",
          "La soustraction de deux pointeurs retourne un nombre d'éléments (type <code>ptrdiff_t</code>).",
          "L'arithmétique n'est valide qu'à l'intérieur d'un même tableau ; sortir des bornes est un comportement indéfini."
        ]),
        callout("warn", "Tableau en paramètre de fonction", "Un tableau passé à une fonction se transforme en pointeur (<em>decay</em>). <code>sizeof</code> donnera la taille du pointeur (8 octets), pas du tableau. Préfère <code>std::vector</code>, <code>std::array</code> ou <code>std::span</code> pour conserver l'information de taille.")
      ),
      lesson(
        "Const et pointeurs : quatre combinaisons",
        paragraphs(
          "Le mot-clé <code>const</code> peut qualifier soit la valeur pointée, soit le pointeur lui-même, soit les deux. La règle de lecture est simple : lis de droite à gauche. Ce qui est à gauche de <code>*</code> protège la valeur ; ce qui est à droite protège l'adresse.",
          "La combinaison la plus courante en pratique est le pointeur vers une valeur constante (<code>const T*</code>), utilisé pour recevoir un tableau en lecture seule sans copie."
        ),
        table(
          ["Déclaration", "Valeur modifiable ?", "Adresse modifiable ?", "Usage typique"],
          [
            ["<code>int* p</code>", "Oui", "Oui", "Pointeur classique, propriété ou observation mutable."],
            ["<code>const int* p</code>", "Non", "Oui", "Lecture seule de la valeur. Équivalent d'une <code>const T&amp;</code>."],
            ["<code>int* const p</code>", "Oui", "Non", "Adresse fixe, valeur modifiable. Rare."],
            ["<code>const int* const p</code>", "Non", "Non", "Tout est figé. Pointeur immuable vers donnée immuable."]
          ]
        ),
        code(
          "cpp",
          `
int val = 10;
const int* pc = &val;   // lecture seule — *pc = 20 interdit
int* const cp = &val;   // adresse fixe — cp++ interdit
*cp = 20;               // valeur modifiable — ok
          `,
          "Les quatre combinaisons"
        )
      ),
      lesson(
        "Allocation dynamique : syntaxe de new et delete",
        paragraphs(
          "<code>new</code> alloue un objet sur le tas et retourne un pointeur vers lui. <code>delete</code> libère la mémoire correspondante et appelle le destructeur. Pour un tableau, les formes <code>new[]</code> et <code>delete[]</code> sont obligatoires — les mélanger avec leurs homologues simples est un comportement indéfini.",
          "La règle mécanique est absolue : un <code>new</code> ↔ un <code>delete</code>, un <code>new[]</code> ↔ un <code>delete[]</code>. C'est la contrainte principale que la syntaxe impose. Quand utiliser ces primitives plutôt que des abstractions standards, et comment exprimer la propriété mémoire, fait l'objet du chapitre <em>Mémoire et ownership</em>."
        ),
        code(
          "cpp",
          `
// Objet unique
int* p = new int(42);        // alloue un int sur le tas, valeur 42
std::cout << *p << '\\n';    // 42 — déréférencement
delete p;                    // libère la mémoire et appelle le destructeur
p = nullptr;                 // bonne pratique : évite un double-delete accidentel

// Tableau
int* arr = new int[5]{10, 20, 30, 40, 50};
arr[2] = 99;                 // accès indexé normal
std::cout << arr[2] << '\\n'; // 99
delete[] arr;                // [] obligatoire — ne pas utiliser delete simple
arr = nullptr;
          `,
          "Syntaxe new / delete et new[] / delete[]"
        ),
        table(
          ["Allocation", "Libération", "Erreur si mélangé"],
          [
            ["<code>new T</code>", "<code>delete p</code>", "Comportement indéfini si on utilise <code>delete[]</code>."],
            ["<code>new T[n]</code>", "<code>delete[] p</code>", "Comportement indéfini si on utilise <code>delete</code>."]
          ]
        ),
        callout("warn", "Règle mécanique", "Oublier <code>delete</code> = fuite mémoire. Appeler <code>delete</code> deux fois = comportement indéfini. Mettre le pointeur à <code>nullptr</code> après <code>delete</code> protège contre la seconde erreur.")
      ),
      lesson(
        "Opérateur flèche, pointeurs sur fonctions et pièges classiques",
        paragraphs(
          "L'opérateur <code>-&gt;</code> combine déréférencement et accès à un membre : <code>ptr-&gt;x</code> est exactement équivalent à <code>(*ptr).x</code>. C'est la notation dominante dès qu'on manipule des objets via un pointeur.",
          "En C++ moderne, les pointeurs sur fonctions existent toujours mais sont supplantés par <code>std::function</code> et les lambdas, plus flexibles et plus lisibles."
        ),
        code(
          "cpp",
          `
struct Point { double x; double y; };

Point* pt = new Point{3.0, 4.0};
std::cout << pt->x << '\\n';  // équivalent à (*pt).x
delete pt;

// Pointeur sur fonction
int addition(int a, int b) { return a + b; }
using BinaryOp = int(*)(int, int);
BinaryOp op = addition;
std::cout << op(3, 4) << '\\n';  // 7

// Même chose avec std::function (préférable)
std::function<int(int, int)> op2 = addition;
          `,
          "Opérateur flèche et pointeur sur fonction"
        ),
        bullets([
          "<strong>Pointeur non initialisé :</strong> toujours initialiser à <code>nullptr</code>.",
          "<strong>Pointeur suspendu (dangling) :</strong> ne jamais retourner l'adresse d'une variable locale.",
          "<strong>Confusion <code>delete</code> / <code>delete[]</code> :</strong> <code>new[]</code> impose <code>delete[]</code>.",
          "<strong>Double libération :</strong> mettre le pointeur à <code>nullptr</code> après <code>delete</code> pour éviter une seconde suppression accidentelle.",
          "<strong>Dépassement de borne :</strong> l'arithmétique hors d'un tableau est un comportement indéfini ; préférer <code>std::vector</code>."
        ])
      )
    ].join(""),
    checklist: [
      "Je sais lire une déclaration de pointeur et distinguer <code>&amp;</code> (adresse) et <code>*</code> (déréférencement).",
      "Je comprends ce que contient un pointeur et ce que signifie le déréférencer.",
      "Je sais pourquoi <code>p++</code> avance d'un élément du type pointé, pas d'un octet.",
      "Je peux lire les quatre combinaisons <code>const</code> / pointeur.",
      "Je sais utiliser <code>new</code> / <code>delete</code> et je comprends pourquoi les éviter en C++ moderne.",
      "Je connais l'opérateur <code>-&gt;</code> et son équivalence avec <code>(*ptr).membre</code>.",
      "Je peux citer trois pièges classiques des pointeurs et leur parade."
    ],
    quiz: [
      {
        question: "Quelle est la différence entre <code>&amp;x</code> et <code>*p</code> ?",
        options: [
          "<code>&amp;x</code> copie la valeur de x ; <code>*p</code> crée un nouveau pointeur",
          "<code>&amp;x</code> retourne l'adresse de x ; <code>*p</code> retourne la valeur à l'adresse contenue dans p",
          "Ces deux expressions sont interchangeables"
        ],
        answer: 1,
        explanation: "<code>&amp;</code> produit une adresse ; <code>*</code> en expression déréférence un pointeur pour lire ou écrire la valeur cible."
      },
      {
        question: "Si <code>p</code> est un <code>int*</code> pointant vers <code>arr[0]</code>, que vaut <code>*(p + 2)</code> pour <code>arr = {10, 20, 30}</code> ?",
        options: ["20", "30", "L'adresse de arr[2]"],
        answer: 1,
        explanation: "<code>p + 2</code> avance de deux <code>int</code>, soit vers <code>arr[2]</code>. Le déréférencement <code>*(p + 2)</code> donne la valeur 30."
      },
      {
        question: "Quelle déclaration exprime un pointeur dont <strong>l'adresse</strong> ne peut pas être modifiée mais dont la <strong>valeur pointée</strong> peut l'être ?",
        options: [
          "<code>const int* p</code>",
          "<code>int* const p</code>",
          "<code>const int* const p</code>"
        ],
        answer: 1,
        explanation: "Lire de droite à gauche : <code>const</code> à droite de <code>*</code> protège l'adresse ; l'absence de <code>const</code> à gauche laisse la valeur modifiable."
      },
      {
        question: "Pourquoi faut-il utiliser <code>delete[]</code> et non <code>delete</code> pour libérer un tableau alloué avec <code>new int[5]</code> ?",
        options: [
          "C'est une convention stylistique sans impact réel",
          "<code>delete</code> ne libère que le premier élément ; <code>delete[]</code> libère tout le bloc et appelle les destructeurs de chaque élément",
          "<code>delete[]</code> est obligatoire uniquement pour les types avec destructeur"
        ],
        answer: 1,
        explanation: "Mélanger <code>new[]</code> et <code>delete</code> est un comportement indéfini. <code>delete[]</code> sait que le bloc contient plusieurs objets et les détruit correctement."
      }
    ],
    exercises: [
      {
        title: "Exploration d'adresses",
        difficulty: "Facile",
        time: "15 min",
        prompt: "Déclare plusieurs variables de types différents, affiche leurs adresses avec <code>&amp;</code>, puis modifie-les à travers des pointeurs. Observe l'alignement mémoire.",
        deliverables: [
          "affichage des adresses de chaque variable",
          "modification via déréférencement et vérification",
          "observation de l'écart entre deux adresses consécutives de même type"
        ]
      },
      {
        title: "Parcours de tableau par arithmétique de pointeurs",
        difficulty: "Intermédiaire",
        time: "20 min",
        prompt: "Écris une fonction qui reçoit un tableau et sa taille, calcule la somme et trouve le maximum en utilisant uniquement l'arithmétique de pointeurs (sans <code>[]</code>).",
        deliverables: [
          "la fonction avec pointeur d'entrée et fin",
          "une démonstration dans <code>main</code>",
          "une version équivalente avec <code>std::vector</code> pour comparer"
        ]
      },
      {
        title: "Gestion manuelle avec new/delete puis refactoring",
        difficulty: "Intermédiaire",
        time: "25 min",
        prompt: "Implémente une pile d'entiers avec allocation dynamique manuelle (<code>new[]</code> / <code>delete[]</code>), puis refactorise-la pour utiliser <code>std::vector</code> et supprimer toute gestion manuelle.",
        deliverables: [
          "version avec allocation manuelle fonctionnelle",
          "version refactorisée avec <code>std::vector</code>",
          "liste des problèmes éliminés par la refactorisation"
        ]
      }
    ],
    keywords: ["pointeur", "adresse", "dereferencement", "nullptr", "new", "delete", "arithmetique pointeur", "tableau", "const pointeur", "fleche", "dangling pointer", "fuite memoire"]
  },
  {
    id: "fonctions-references",
    shortTitle: "Fonctions et références",
    title: "Fonctions, surcharge, références et espaces de noms",
    level: "Fondations",
    duration: "35 min",
    track: "SE1",
    summary:
      "Une grande partie du style C++ repose sur la qualité des signatures : ce qu'elles prennent, ce qu'elles promettent et ce qu'elles modifient. Le chapitre introduit ces notions sans supposer de pratique préalable des pointeurs du C.",
    goals: [
      "choisir entre passage par valeur, pointeur, référence et référence constante",
      "utiliser la surcharge et les paramètres par défaut sans ambiguïté",
      "organiser le code avec des namespaces et des headers propres"
    ],
    highlights: ["const&", "namespace", "API"],
    body: [
      lesson(
        "Passage d'arguments : quelle sémantique veux-tu exprimer ?",
        paragraphs(
          "Le passage par valeur copie l'argument ; il convient aux petits types et aux scénarios où l'on souhaite un objet local indépendant. La référence constante évite la copie tout en promettant l'absence de modification.",
          "Si tu n'as jamais fait de C, retiens un point simple : en C++ moderne, la référence est souvent une meilleure porte d'entrée que le pointeur pour exprimer un accès à une donnée existante.",
          "La référence non constante signale une modification voulue. Le pointeur reste utile pour exprimer une présence optionnelle, une structure de graphe ou une API bas niveau, mais il ne doit pas être le réflexe par défaut."
        ),
        table(
          ["Signature", "Intention"],
          [
            ["<code>void f(int x)</code>", "Copie locale, bon choix pour les petits types triviaux."],
            ["<code>void f(const std::string& s)</code>", "Lecture seule sans copie coûteuse."],
            ["<code>void f(Point& p)</code>", "Modification du paramètre."],
            ["<code>void f(Node* n)</code>", "Possibilité d'absence ou manipulation explicite d'adresse."]
          ]
        ),
        code(
          "cpp",
          `
double moyenne(const std::vector<double>& notes);
void normaliser(std::vector<double>& notes);
void afficher(const Compte& compte);
          `,
          "Des signatures qui racontent une intention"
        )
      ),
      lesson(
        "Surcharge et paramètres par défaut",
        paragraphs(
          "La surcharge permet de conserver un nom métier stable tout en variant les types ou le nombre de paramètres. Elle doit cependant rester lisible : trop de variantes créent vite de l'ambiguïté.",
          "Les paramètres par défaut simplifient certaines API, mais ils doivent rester proches du cas courant. Une valeur par défaut bizarre est souvent le signe qu'il faut plusieurs fonctions nommées."
        ),
        code(
          "cpp",
          `
class Complexe {
public:
    Complexe(double reel = 0.0, double imag = 0.0);
};

void tracer(const Point& p);
void tracer(const Segment& s);
          `,
          "Surcharge simple"
        ),
        callout("warn", "Règle simple", "Si le lecteur doit réfléchir trop longtemps pour savoir quelle surcharge sera appelée, ton interface est probablement trop compliquée.")
      ),
      lesson(
        "Namespaces et discipline de header",
        paragraphs(
          "Les <code>namespace</code> empêchent les collisions de noms et structurent les modules. Dans un vrai projet, ils remplacent des préfixes de fonctions bricolés comme <code>calc_</code> ou <code>proj_</code>.",
          "Dans les headers, évite <code>using namespace std;</code>. Un header est inclus partout ; il ne doit pas imposer des choix globaux aux autres fichiers."
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
        bullets([
          "Un header déclare et documente une interface.",
          "Un source contient les détails d'implémentation.",
          "Un namespace exprime un domaine fonctionnel cohérent."
        ])
      )
    ].join(""),
    checklist: [
      "Je sais quand utiliser <code>const T&</code>.",
      "Je n'écris pas <code>using namespace std;</code> dans un header.",
      "Je peux expliquer la différence entre pointeur et référence.",
      "Je garde mes surcharges lisibles.",
      "Je fais correspondre la signature à l'intention métier."
    ],
    quiz: [
      {
        question: "Quel paramètre exprime le mieux une lecture sans copie d'un objet potentiellement coûteux ?",
        options: ["<code>T</code>", "<code>const T&</code>", "<code>T*</code>"],
        answer: 1,
        explanation: "La référence constante évite la copie et garantit l'absence de modification observable."
      },
      {
        question: "Pourquoi éviter <code>using namespace std;</code> dans un header ?",
        options: [
          "Parce que c'est interdit par la norme",
          "Parce que le header polluerait tous les fichiers qui l'incluent",
          "Parce que <code>std</code> ne fonctionne qu'en C"
        ],
        answer: 1,
        explanation: "Un header doit rester discret et ne pas injecter de noms globaux chez ses consommateurs."
      }
    ],
    exercises: [
      {
        title: "Nettoyer une API",
        difficulty: "Intermédiaire",
        time: "25 min",
        prompt: "Prends une classe ou un exercice existant et révise toutes les signatures pour exprimer clairement lecture, écriture et propriété.",
        deliverables: [
          "les anciennes signatures annotées",
          "les nouvelles signatures",
          "une justification ligne par ligne"
        ]
      },
      {
        title: "Mini bibliothèque de géométrie",
        difficulty: "Intermédiaire",
        time: "30 min",
        prompt: "Crée un namespace <code>geometrie</code> avec deux types simples et au moins trois fonctions libres bien signées.",
        deliverables: [
          "un header et un source",
          "un <code>main.cpp</code> démonstrateur",
          "des signatures argumentées"
        ]
      }
    ],
    keywords: ["fonctions", "surcharge", "reference", "const ref", "namespace", "header"]
  },
  {
    id: "classes-encapsulation",
    shortTitle: "Classes et encapsulation",
    title: "Classes, encapsulation et conception d'interface",
    level: "Intermédiaire",
    duration: "40 min",
    track: "SE2",
    summary:
      "Une classe n'est pas un simple regroupement de variables ; elle formalise un invariant métier et expose une API. Ce chapitre insiste sur cette idée de frontière.",
    goals: [
      "concevoir une classe autour d'un invariant métier",
      "séparer clairement l'interface publique de l'état interne",
      "utiliser les méthodes <code>const</code> et les accesseurs avec discernement"
    ],
    highlights: ["private", "invariant", "this"],
    body: [
      lesson(
        "Une classe est un contrat, pas un sac de données",
        paragraphs(
          "L'encapsulation protège la cohérence interne de l'objet. Si tout est public, n'importe quel appelant peut casser l'invariant sans que la classe ne puisse l'empêcher.",
          "Par exemple, une <code>Fraction</code> devrait empêcher un dénominateur nul ; un <code>Compte</code> peut vouloir interdire certains états négatifs ; un <code>Rectangle</code> doit garder largeur et hauteur dans un domaine valide."
        ),
        code(
          "cpp",
          `
class Fraction {
public:
    Fraction(int numerateur, int denominateur);
    double valeur() const;
    void simplifier();

private:
    int numerateur_;
    int denominateur_;
};
          `,
          "La donnée reste privée"
        ),
        callout("success", "Question utile", "Si un champ est public, demande-toi : est-ce vraiment une donnée libre, ou est-ce un état qui devrait être défendu par la classe ?")
      ),
      lesson(
        "Organisation header/source et méthode const",
        paragraphs(
          "Les méthodes qui ne modifient pas l'objet doivent être marquées <code>const</code>. Ce n'est pas une coquetterie : cela documente l'API, autorise des usages sur des objets constants et aide le compilateur à détecter des erreurs.",
          "La définition hors classe avec l'opérateur <code>::</code> garde le header léger et lisible."
        ),
        code(
          "cpp",
          `
class Point {
public:
    Point(double x, double y);
    double x() const;
    double y() const;
    void translater(double dx, double dy);

private:
    double x_;
    double y_;
};

double Point::x() const {
    return x_;
}
          `,
          "Méthodes const"
        ),
        bullets([
          "Les accesseurs doivent être justifiés, pas automatiques.",
          "Une méthode <code>const</code> promet de ne pas modifier l'état logique de l'objet.",
          "Un nom de méthode doit raconter l'action ou l'information retournée."
        ])
      ),
      lesson(
        "Le rôle de <code>this</code> et la cohérence des noms",
        paragraphs(
          "Le pointeur implicite <code>this</code> désigne l'objet courant. Il est utile pour lever une ambiguïté de nom ou retourner une référence sur soi dans certaines méthodes chaînables.",
          "Dans un code pédagogique, nommer les membres avec un suffixe comme <code>_</code> évite des collisions inutiles avec les paramètres et rend l'implémentation plus lisible."
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
        callout("info", "Point d'attention", "Le vrai sujet n'est pas la syntaxe de <code>this</code>, mais la cohérence globale de l'interface : quels verbes exposes-tu et quels états garantis-tu ?")
      )
    ].join(""),
    checklist: [
      "Je conçois une classe autour d'un invariant.",
      "Je garde les attributs privés par défaut.",
      "Je marque les méthodes en lecture avec <code>const</code>.",
      "Je différencie clairement rôle public et détail interne.",
      "Je ne génère pas mécaniquement des getters et setters inutiles."
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
        explanation: "L'encapsulation donne à la classe le pouvoir d'imposer ses règles de cohérence."
      },
      {
        question: "Que signifie une méthode marquée <code>const</code> ?",
        options: [
          "Elle est compilée une seule fois",
          "Elle ne modifie pas l'état logique de l'objet",
          "Elle doit être appelée depuis <code>main</code>"
        ],
        answer: 1,
        explanation: "Le mot-clé fait partie du contrat de lecture et participe à la sûreté de l'API."
      }
    ],
    exercises: [
      {
        title: "Fraction robuste",
        difficulty: "Intermédiaire",
        time: "30 min",
        prompt: "Conçois une classe <code>Fraction</code> qui interdit un dénominateur nul, simplifie l'écriture et expose une API minimaliste.",
        deliverables: [
          "l'invariant explicitement formulé",
          "un header et un source",
          "un petit programme de démonstration"
        ]
      },
      {
        title: "Réviser une classe bavarde",
        difficulty: "Intermédiaire",
        time: "25 min",
        prompt: "Prends une classe avec trop de getters et setters et redessine une API plus métier, plus compacte et plus sûre.",
        deliverables: [
          "la version initiale",
          "la version révisée",
          "les raisons de la simplification"
        ]
      }
    ],
    keywords: ["classe", "encapsulation", "const", "this", "invariant", "interface"]
  },
  {
    id: "constructeurs-raii",
    shortTitle: "Cycle de vie et RAII",
    title: "Constructeurs, destructeurs et pensée RAII",
    level: "Intermédiaire",
    duration: "45 min",
    track: "SE2",
    summary:
      "Le cœur du C++ est là : un objet acquiert ses ressources à la construction et les relâche à la destruction. Comprendre cette idée change la façon de concevoir tout le reste du code.",
    goals: [
      "distinguer les différents constructeurs usuels",
      "privilégier les listes d'initialisation",
      "raisonner en termes de ressource acquise par l'objet"
    ],
    highlights: ["liste d'initialisation", "destructeur", "RAII"],
    body: [
      lesson(
        "Le cycle de vie fait partie du design",
        paragraphs(
          "Un constructeur ne sert pas à 'mettre des valeurs quelque part' ; il sert à créer un objet valide immédiatement. Un destructeur ne sert pas à faire joli ; il ferme proprement la ressource possédée par l'objet.",
          "Quand l'objet représente une ressource, la question clé devient : qui possède quoi, et jusqu'à quand ?"
        ),
        table(
          ["Élément", "Rôle"],
          [
            ["Constructeur par défaut", "Créer un objet dans un état valide sans argument."],
            ["Constructeur paramétré", "Exprimer les dépendances nécessaires à la création."],
            ["Destructeur", "Nettoyer ce que l'objet possède réellement."]
          ]
        ),
        callout("info", "Réflexe RAII", "Une ressource doit être liée à un objet dont la durée de vie est claire : fichier, verrou, buffer, socket, mémoire allouée.")
      ),
      lesson(
        "Pourquoi préférer la liste d'initialisation",
        paragraphs(
          "Les membres sont toujours initialisés avant l'entrée dans le corps du constructeur. La liste d'initialisation exprime cette réalité directement et évite souvent une double initialisation inutile.",
          "Elle est obligatoire pour les membres <code>const</code>, les références et certains types non assignables."
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
        callout("warn", "Erreur pédagogique fréquente", "Affecter dans le corps du constructeur donne l'illusion d'une initialisation correcte, mais les membres ont déjà été construits auparavant.")
      ),
      lesson(
        "RAII sur un vrai cas simple",
        paragraphs(
          "Le principe RAII se voit très bien avec un fichier ou un timer de scope. L'objet acquiert la ressource à l'entrée du bloc et la libère automatiquement à la sortie, y compris en cas d'exception.",
          "C'est cette propriété qui rend le C++ puissant : la sûreté peut émerger du modèle de durée de vie plutôt que d'une discipline manuelle fragile."
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
          "RAII et fichier"
        ),
        bullets([
          "L'objet est valide ou la construction échoue.",
          "La fermeture du flux est automatique à la destruction.",
          "Le code appelant n'a pas à penser à un <code>close()</code> dispersé."
        ])
      )
    ].join(""),
    checklist: [
      "Je comprends ce que garantit un constructeur.",
      "Je sais quand la liste d'initialisation est indispensable.",
      "Je relie ressource et durée de vie d'objet.",
      "Je sais expliquer pourquoi RAII réduit les fuites et oublis.",
      "Je n'utilise pas le destructeur pour des effets de bord non maîtrisés."
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
        explanation: "Les membres sont construits avant le corps du constructeur ; la liste d'initialisation est donc la forme naturelle."
      },
      {
        question: "Quel énoncé décrit le mieux RAII ?",
        options: [
          "Une ressource est associée à un objet qui la gère sur toute sa durée de vie",
          "Toute ressource doit être globale",
          "Le destructeur doit afficher des logs à chaque fois"
        ],
        answer: 0,
        explanation: "RAII rattache acquisition et libération au cycle de vie d'un objet."
      }
    ],
    exercises: [
      {
        title: "Chronomètre de scope",
        difficulty: "Intermédiaire",
        time: "25 min",
        prompt: "Écris une petite classe RAII qui mesure le temps passé dans une portée et l'affiche à la destruction.",
        deliverables: [
          "la classe",
          "un exemple d'usage sur deux blocs",
          "une explication du bénéfice de RAII ici"
        ]
      },
      {
        title: "Gestionnaire de fichier propre",
        difficulty: "Intermédiaire",
        time: "30 min",
        prompt: "Encapsule l'ouverture d'un fichier texte avec une classe qui garantit que l'objet n'existe que si le fichier est vraiment disponible.",
        deliverables: [
          "gestion d'erreur à la construction",
          "une méthode d'accès utile",
          "une démonstration dans <code>main</code>"
        ]
      }
    ],
    keywords: ["constructeur", "destructeur", "raii", "lifetime", "init list", "resource"]
  },
  {
    id: "memoire-smart-pointers",
    shortTitle: "Mémoire et ownership",
    title: "Mémoire dynamique, ownership et smart pointers",
    level: "Intermédiaire",
    duration: "45 min",
    track: "SE2",
    summary:
      "L'objectif n'est pas de mémoriser <code>new</code> et <code>delete</code>, mais de comprendre la propriété mémoire et de savoir quand s'appuyer sur la bibliothèque standard pour l'exprimer.",
    goals: [
      "distinguer pile, tas et durée de vie automatique",
      "identifier une relation de propriété mémoire",
      "préférer <code>std::vector</code> et <code>std::unique_ptr</code> aux pointeurs nus propriétaires"
    ],
    highlights: ["stack", "heap", "unique_ptr"],
    body: [
      lesson(
        "Pile, tas et vraies questions de conception",
        paragraphs(
          "La pile est gérée automatiquement et convient à la plupart des objets locaux. Le tas intervient quand la durée de vie doit dépasser le scope courant, quand la taille est dynamique ou quand la structure impose une indirection.",
          "Le problème majeur n'est pas 'tas contre pile' mais 'qui possède cette ressource et qui doit la libérer ?'."
        ),
        table(
          ["Situation", "Choix naturel"],
          [
            ["Objet local borné au scope", "Allocation automatique sur la pile."],
            ["Collection dynamique", "<code>std::vector</code> plutôt qu'un tableau géré à la main."],
            ["Possession exclusive d'un objet", "<code>std::unique_ptr</code>."],
            ["Partage réel de propriété", "<code>std::shared_ptr</code> avec justification forte."]
          ]
        ),
        callout("warn", "Point sensible", "Un pointeur nu n'exprime pas la propriété. Il peut simplement désigner un objet sans en être responsable.")
      ),
      lesson(
        "Pourquoi éviter <code>new</code>/<code>delete</code> en première intention",
        paragraphs(
          "L'allocation manuelle expose aux fuites, doubles libérations et sorties prématurées. La bibliothèque standard fournit presque toujours une abstraction plus sûre.",
          "Si vous pensez tableau dynamique, pensez d'abord <code>std::vector</code>. Si vous pensez possession exclusive, pensez <code>std::unique_ptr</code>."
        ),
        code(
          "cpp",
          `
auto buffer = std::make_unique<std::vector<int>>();
buffer->push_back(10);
buffer->push_back(20);

for (int valeur : *buffer) {
    std::cout << valeur << std::endl;
}
          `,
          "Ownership explicite"
        ),
        callout("success", "Réflexe moderne", "Plus une ressource est gérée par un type standard, moins vous avez d'endroits où un bug mémoire peut se cacher.")
      ),
      lesson(
        "Cas où le pointeur brut reste pertinent",
        paragraphs(
          "Les pointeurs nus gardent un rôle : navigation dans une structure, API C héritée, paramètre optionnel non propriétaire ou optimisation très contrôlée. Ils ne sont pas interdits ; ils doivent juste être honnêtes sur leur sémantique.",
          "Un bon design sépare la possession réelle de la simple observation."
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
          "Pointeur observateur"
        ),
        bullets([
          "Un pointeur observateur doit être documenté comme tel.",
          "Éviter <code>shared_ptr</code> par confort : son coût et sa sémantique sont réels.",
          "Quand un objet est optionnel sans propriété, <code>T*</code> ou <code>std::optional</code> peuvent être plus justes qu'un partage artificiel."
        ])
      ),
      lesson(
        "unique_ptr en détail : transfert, release et custom deleter",
        paragraphs(
          "<code>std::unique_ptr</code> incarne la possession exclusive : un seul propriétaire à la fois, destruction automatique à la sortie de portée. Il est non copiable mais mobile, ce qui permet de transférer la propriété explicitement avec <code>std::move</code>.",
          "Les opérations clés sont <code>release()</code> (abandonne la possession sans détruire), <code>reset()</code> (remplace ou libère la ressource) et <code>get()</code> (observe sans posséder). Une ressource non standard — socket, descripteur de fichier, verrou C — peut être gérée via un <em>custom deleter</em>."
        ),
        code(
          "cpp",
          `
#include <memory>

auto p1 = std::make_unique<std::string>("hello");
// auto p2 = p1;             // ❌ copie interdite
auto p2 = std::move(p1);     // ✅ transfert de propriété
// p1 est maintenant nullptr

p2.reset();                  // libère la ressource immédiatement
p2.reset(new std::string("world")); // remplace par une nouvelle valeur

auto p3 = std::make_unique<std::string>("temp");
std::string* raw = p3.release(); // p3 n'est plus propriétaire
delete raw;                       // responsabilité transférée manuellement
          `,
          "Opérations de unique_ptr"
        ),
        code(
          "cpp",
          `
// Custom deleter pour une ressource C (ex: FILE*)
auto fermerFichier = [](FILE* f) { if (f) std::fclose(f); };
std::unique_ptr<FILE, decltype(fermerFichier)>
    fichier{std::fopen("data.txt", "r"), fermerFichier};

if (fichier) {
    // lecture...
} // fermeture automatique à la sortie de portée, même en cas d'exception
          `,
          "Custom deleter RAII sur ressource C"
        ),
        table(
          ["Opération", "Effet"],
          [
            ["<code>std::move(p)</code>", "Transfère la possession. <code>p</code> devient <code>nullptr</code>."],
            ["<code>p.get()</code>", "Retourne le pointeur brut sans céder la possession."],
            ["<code>p.release()</code>", "Abandonne la possession, retourne le pointeur brut. Responsabilité transférée à l'appelant."],
            ["<code>p.reset()</code>", "Libère la ressource. <code>p</code> devient <code>nullptr</code>."],
            ["<code>p.reset(q)</code>", "Libère l'ancienne ressource et prend possession de <code>q</code>."]
          ]
        ),
        callout("info", "Préférer make_unique", "<code>std::make_unique&lt;T&gt;(args...)</code> est préférable à <code>new</code> direct : aucune fuite possible en cas d'exception dans les arguments, et le code est plus lisible.")
      ),
      lesson(
        "shared_ptr, weak_ptr et cycles de dépendance",
        paragraphs(
          "<code>std::shared_ptr</code> permet la copropriété : plusieurs smart pointers partagent la même ressource, qui ne sera détruite que lorsque le dernier propriétaire disparaît. Ce mécanisme repose sur un <em>compteur de références</em> (reference count) maintenu dans un bloc de contrôle alloué séparément.",
          "Le coût de <code>shared_ptr</code> est réel — incrémentation/décrémentation atomique, allocation supplémentaire — et sa sémantique implique de la réflexion : un cycle de <code>shared_ptr</code> (A pointe vers B qui pointe vers A) fait monter le compteur sans jamais le redescendre à zéro, créant une fuite mémoire. <code>std::weak_ptr</code> brise ces cycles en observant sans posséder."
        ),
        code(
          "cpp",
          `
#include <memory>
#include <iostream>

auto p1 = std::make_shared<int>(42);
std::cout << p1.use_count() << '\\n'; // 1

auto p2 = p1;   // copie — compteur passe à 2
auto p3 = p1;   // compteur passe à 3
std::cout << p1.use_count() << '\\n'; // 3

p2.reset();     // compteur passe à 2
p3.reset();     // compteur passe à 1
// quand p1 sort de portée : compteur → 0, ressource détruite
          `,
          "Compteur de références de shared_ptr"
        ),
        code(
          "cpp",
          `
struct Noeud {
    std::string valeur;
    std::shared_ptr<Noeud> suivant;
    std::weak_ptr<Noeud>   precedent; // weak_ptr brise le cycle
};

auto n1 = std::make_shared<Noeud>("A");
auto n2 = std::make_shared<Noeud>("B");

n1->suivant   = n2;
n2->precedent = n1;   // weak_ptr : n1 n'est pas co-possédé par n2

// n1 et n2 seront bien détruits à la fin du scope
          `,
          "Liste doublement chaînée sans cycle"
        ),
        code(
          "cpp",
          `
std::weak_ptr<int> observateur;
{
    auto propriétaire = std::make_shared<int>(100);
    observateur = propriétaire;

    if (auto verrou = observateur.lock()) {   // tente d'obtenir un shared_ptr
        std::cout << *verrou << '\\n';         // 100 — ressource encore vivante
    }
}
// propriétaire est détruit ici

if (observateur.expired()) {
    std::cout << "ressource libérée\\n";      // vrai
}
          `,
          "weak_ptr : observer sans posséder"
        ),
        table(
          ["Type", "Possession", "Copie", "Coût extra", "Cas typique"],
          [
            ["<code>unique_ptr</code>", "Exclusive", "Interdit (move seulement)", "Nul", "Possession simple, factory, RAII."],
            ["<code>shared_ptr</code>", "Partagée", "Autorisée (incrémente le compteur)", "Bloc de contrôle + atomique", "Copropriété réelle et justifiée."],
            ["<code>weak_ptr</code>", "Aucune", "Autorisée", "Faible", "Observer sans prolonger la durée de vie ; briser les cycles."]
          ]
        ),
        callout("warn", "shared_ptr n'est pas la solution par défaut", "La tentation d'utiliser <code>shared_ptr</code> partout pour 'ne pas se poser de questions' est un piège courant. Commence toujours par <code>unique_ptr</code> et passe à <code>shared_ptr</code> seulement quand le besoin de copropriété est réel et justifiable.")
      )
    ].join(""),
    checklist: [
      "Je peux expliquer ce que signifie posséder un objet et pourquoi cette notion est centrale en C++.",
      "Je préfère <code>std::vector</code> à un tableau dynamique brut.",
      "Je sais créer et utiliser un <code>unique_ptr</code> avec <code>make_unique</code>.",
      "Je comprends que <code>unique_ptr</code> est non copiable et que <code>std::move</code> transfère la possession.",
      "Je connais les opérations <code>get()</code>, <code>reset()</code> et <code>release()</code> de <code>unique_ptr</code>.",
      "Je sais expliquer le compteur de références de <code>shared_ptr</code> et ce qui le fait descendre à zéro.",
      "Je comprends pourquoi un cycle de <code>shared_ptr</code> est une fuite mémoire et comment <code>weak_ptr</code> le brise.",
      "Je réserve <code>shared_ptr</code> aux copropriétés réellement justifiées.",
      "Je sais décrire le rôle d'un pointeur nu observateur et le distinguer d'un pointeur propriétaire."
    ],
    quiz: [
      {
        question: "Quel outil standard remplace le plus souvent un tableau dynamique alloué manuellement ?",
        options: ["<code>std::vector</code>", "<code>std::exception</code>", "<code>std::pair</code>"],
        answer: 0,
        explanation: "<code>std::vector</code> gère allocation, destruction, taille et accès de façon sûre, sans aucun <code>new[]</code> / <code>delete[]</code> manuel."
      },
      {
        question: "Que devient un <code>unique_ptr</code> après un <code>std::move</code> ?",
        options: [
          "Il garde une copie de la ressource",
          "Il devient <code>nullptr</code> — la possession est transférée",
          "Il est détruit immédiatement"
        ],
        answer: 1,
        explanation: "<code>std::move</code> transfère la possession : le <code>unique_ptr</code> source perd la ressource et vaut <code>nullptr</code>."
      },
      {
        question: "Pourquoi un cycle de <code>shared_ptr</code> crée-t-il une fuite mémoire ?",
        options: [
          "Parce que <code>shared_ptr</code> ne gère pas les destructions",
          "Parce que le compteur de références reste supérieur à zéro indéfiniment, empêchant toute libération",
          "Parce que les cycles sont interdits par la norme"
        ],
        answer: 1,
        explanation: "Si A et B se possèdent mutuellement via <code>shared_ptr</code>, leurs compteurs ne descendent jamais à zéro et les destructeurs ne sont jamais appelés."
      },
      {
        question: "Quelle est la différence entre <code>p.get()</code> et <code>p.release()</code> sur un <code>unique_ptr</code> ?",
        options: [
          "<code>get()</code> et <code>release()</code> font la même chose",
          "<code>get()</code> observe sans céder la possession ; <code>release()</code> abandonne la possession sans détruire",
          "<code>get()</code> libère la mémoire ; <code>release()</code> ne fait rien"
        ],
        answer: 1,
        explanation: "<code>get()</code> est une simple observation : le <code>unique_ptr</code> reste propriétaire. <code>release()</code> cède la responsabilité à l'appelant sans appeler le destructeur."
      }
    ],
    exercises: [
      {
        title: "Remplacer du <code>new[]</code> par <code>vector</code>",
        difficulty: "Intermédiaire",
        time: "20 min",
        prompt: "Reprends un exercice avec tableau dynamique et remplace toute la gestion manuelle par un conteneur standard. Identifie les bugs potentiels éliminés.",
        deliverables: [
          "la version initiale avec <code>new[]</code> / <code>delete[]</code>",
          "la version avec <code>std::vector</code>",
          "la liste des risques éliminés (fuite, double delete, taille perdue)"
        ]
      },
      {
        title: "Graphe d'ownership avec unique_ptr et shared_ptr",
        difficulty: "Avancé",
        time: "35 min",
        prompt: "Modélise un arbre de noeuds où chaque noeud possède ses enfants (<code>unique_ptr</code>) et peut observer son parent (<code>T*</code> ou <code>weak_ptr</code>). Vérifie que la destruction de la racine libère tout l'arbre.",
        deliverables: [
          "la structure <code>Noeud</code> avec ses enfants en <code>unique_ptr</code>",
          "la relation parent en pointeur non propriétaire",
          "une démonstration de destruction automatique en cascade"
        ]
      },
      {
        title: "Briser un cycle avec weak_ptr",
        difficulty: "Avancé",
        time: "30 min",
        prompt: "Crée deux classes qui se référencent mutuellement. Implémente d'abord la version avec deux <code>shared_ptr</code> (observe la fuite), puis corrige avec un <code>weak_ptr</code>.",
        deliverables: [
          "la version cyclique avec fuite confirmée (par log de destructeurs absents)",
          "la version corrigée avec <code>weak_ptr</code>",
          "l'explication de pourquoi le cycle était impossible à résoudre avec <code>shared_ptr</code> seul"
        ]
      }
    ],
    keywords: ["memory", "ownership", "vector", "unique_ptr", "shared_ptr", "weak_ptr", "heap", "make_unique", "make_shared", "reference counting", "cycle", "deleter", "release", "reset"]
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
    duration: "40 min",
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
      )
    ].join(""),
    checklist: [
      "Je surcharge seulement quand la sémantique est naturelle.",
      "Je sais distinguer opérateur membre et non-membre.",
      "Je fais retourner le flux dans <code>operator&lt;&lt;</code>.",
      "Je définis l'égalité selon un vrai contrat métier.",
      "Je réutilise les opérateurs composés pour limiter la duplication."
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
      }
    ],
    exercises: [
      {
        title: "Complexe lisible",
        difficulty: "Avancé",
        time: "30 min",
        prompt: "Ajoute à une classe <code>Complexe</code> les opérateurs <code>+=</code>, <code>+</code>, <code>==</code> et <code>&lt;&lt;</code> avec une sémantique cohérente.",
        deliverables: [
          "une justification du choix membre / non-membre",
          "les opérateurs compilables",
          "un jeu d'exemples simples"
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
    keywords: ["operator overloading", "friend", "ostream", "comparaison", "plus égale"]
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
    duration: "65 min",
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
      "Je n'écris pas une boucle maison quand un algorithme standard raconte mieux l'intention."
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
      }
    ],
    keywords: ["template", "stl", "vector", "map", "unordered_map", "algorithm", "lambda", "iterateur", "foncteur", "predicat"]
  },
  {
    id: "exceptions-io",
    shortTitle: "Exceptions et I/O",
    title: "Exceptions, assertions et gestion des entrées/sorties",
    level: "Avancé",
    duration: "60 min",
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
      "Je place mes <code>catch</code> au bon niveau de responsabilité."
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
      }
    ],
    exercises: [
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
    keywords: ["exception", "assert", "ifstream", "ofstream", "runtime_error", "parsing", "getline", "cerr", "seekg", "tellg", "noexcept", "std::exception"]
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
    text: "Création d'espace mémoire sur le tas à l'aide des opérateurs new ou new[].",
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
    text: "Prototype définissant des attributs et des méthodes communes à tous les objets d'une certaine nature.",
    tags: ["poo", "objet"]
  },
  {
    term: "Classe abstraite",
    text: "Classe contenant au moins une fonction virtuelle pure, ce qui empêche son instanciation.",
    tags: ["poo", "polymorphisme"]
  },
  {
    term: "Const-correctness",
    text: "Discipline consistant à qualifier précisément ce qui est modifiable ou non dans l'API.",
    tags: ["api", "const"]
  },
  {
    term: "Constructeur",
    text: "Fonction membre particulière qui porte le nom de la classe, n'a pas de type de retour et sert à initialiser un objet.",
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
    text: "Méthode invoquée automatiquement en fin de vie d'une instance pour assurer la libération des ressources.",
    tags: ["poo", "cycle de vie", "raii"]
  },
  {
    term: "Encapsulation",
    text: "Regroupement des variables et des fonctions au sein d'une même entité appelée classe.",
    tags: ["poo", "design"]
  },
  {
    term: "Espace de noms (namespace)",
    text: "Mécanisme indiquant quel environnement de noms utiliser pour éviter les conflits d'identificateurs.",
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
    text: "Propriété qui doit rester vraie pour qu'un objet soit considéré comme valide.",
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
    text: "Relation de propriété qui désigne qui est responsable de la durée de vie d'une ressource.",
    tags: ["memoire", "ressources"]
  },
  {
    term: "Pile d'exécution (stack)",
    text: "Zone de taille fixe gérant les appels de fonctions et stockant les variables locales automatiques.",
    tags: ["memoire", "stack"]
  },
  {
    term: "Pointeur this",
    text: "Pointeur interne permettant à chaque objet d'avoir accès à sa propre adresse en mémoire.",
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
    text: "Technique qui lie l'acquisition et la libération d'une ressource à la durée de vie d'un objet.",
    tags: ["lifetime", "resource", "raii"]
  },
  {
    term: "Redéfinition",
    text: "Modification du comportement d'une méthode existante héritée d'une classe de base.",
    tags: ["poo", "heritage"]
  },
  {
    term: "Référence (&)",
    text: "Alias déclaré sur une variable existante, offrant un code plus clair et plus sûr que l'utilisation de pointeurs bruts.",
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
