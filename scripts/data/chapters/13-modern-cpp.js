(function registerChapterBundle13(globalScope) {
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
  order: 13,
  chapter:   {
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
  deepDives: [
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
  ]
});
})(window);
