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
  withChapterTheme,
  videoLesson,
  playlistVideo
} = registry.helpers;

registry.registerChapterBundle({
  order: 13,
  chapter: withChapterTheme("modern-cpp", () => ({
    id: "modern-cpp",
    shortTitle: "Modern C++",
    title: "Réflexes de C++ moderne : auto, range-for, optional et plus",
    level: "Avancé",
    duration: "1 h 30",
    track: "Extension",
    summary:
      "Le C++ moderne n'est pas une collection de mots-clés à la mode. C'est surtout une manière d'écrire moins de bruit, d'exprimer l'intention plus vite et de s'appuyer davantage sur la bibliothèque standard, avec des outils comme <code>auto</code>, les bindings structurés, <code>optional</code>, <code>string_view</code>, <code>variant</code>, <code>filesystem</code> ou <code>if constexpr</code>.",
    goals: [
      "utiliser <code>auto</code> quand il aide vraiment la lecture, pas quand il cache l'information utile",
      "connaître plusieurs outils modernes très rentables pour écrire moins de code répétitif et exprimer plus honnêtement les contrats",
      "éviter le modernisme décoratif quand il n'apporte ni clarté, ni sécurité, ni gain réel de conception"
    ],
    highlights: ["auto", "range-for", "optional", "structured bindings", "string_view", "variant", "filesystem", "if constexpr"],
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
        bullets([
          "<code>auto</code> ne veut pas dire 'type inconnu' : le compilateur le déduit précisément.",
          "<code>const auto&amp;</code> est souvent le bon choix pour lire un élément coûteux sans copie.",
          "<code>auto*</code> et <code>auto&amp;</code> gardent visibles la nature pointeur ou référence de la variable."
        ]),
        callout("warn", "Mesure", "N'utilise pas <code>auto</code> juste pour faire moderne. La lisibilité reste le critère principal.")
      ),
      lesson(
        "Range-for, bindings structurés et instructions avec initialisation",
        paragraphs(
          "Le C++ moderne cherche à réduire le bruit cérémoniel autour des boucles et des décompositions simples. Le <em>range-based for</em> évite les itérateurs explicites quand le but est simplement de parcourir une séquence. Les <em>structured bindings</em> rendent l'accès à des paires ou tuples beaucoup plus lisible. Les <code>if</code> et <code>switch</code> avec initialisation rapprochent quant à eux une variable de contrôle de la décision qu'elle sert.",
          "Ces outils ont un point commun : ils raccourcissent le trajet entre l'intention du code et sa lecture. Ils n'ajoutent pas une 'nouvelle façon compliquée de faire pareil' ; ils permettent au contraire d'exprimer plus directement ce que l'on manipule."
        ),
        code(
          "cpp",
          `
for (const auto& valeur : valeurs) {
    std::cout << valeur << '\n';
}

for (const auto& [nom, note] : notesParEtudiant) {
    std::cout << nom << " -> " << note << '\n';
}

if (auto it = indexParNom.find("Ines"); it != indexParNom.end()) {
    std::cout << it->second << '\n';
}
          `,
          "Trois outils modernes qui reduisent le bruit"
        ),
        table(
          ["Outil", "Gain principal"],
          [
            ["Range-for", "Parcourir une séquence sans mécanique d'itérateur explicite."],
            ["Structured bindings", "Nommer directement les composantes d'une paire ou d'un tuple."],
            ["<code>if</code> avec initialisation", "Limiter la portée d'une variable de décision au test qui l'utilise."],
            ["<code>switch</code> avec initialisation", "Même idée pour une décision multi-cas."]
          ]
        ),
        callout("success", "Réflexe de lisibilité", "Quand une variable n'a de sens que pour tester ou parcourir quelque chose, rapproche sa déclaration de cet usage plutôt que de la faire vivre trop longtemps.")
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
        "<code>optional</code>, <code>variant</code> et contrats de retour plus honnêtes",
        paragraphs(
          "Le C++ moderne offre plusieurs manières plus honnêtes d'exprimer l'incertitude ou la pluralité de formes. <code>std::optional&lt;T&gt;</code> dit qu'une valeur de type <code>T</code> peut être absente. <code>std::variant&lt;...&gt;</code> dit qu'une donnée peut prendre l'une de plusieurs formes bien connues. Ces outils évitent d'encoder le contrat dans des conventions fragiles comme <code>-1</code>, chaîne vide ou entier magique.",
          "Le bon outil dépend de la question métier. 'Il y a peut-être une valeur' appelle souvent <code>optional</code>. 'La donnée peut être soit un entier, soit un message, soit un état particulier' appelle plutôt <code>variant</code>. Dans les deux cas, l'intérêt est de rendre le contrat visible dans le type."
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

std::variant<int, std::string> lireIdentifiant(bool numerique) {
    if (numerique) {
        return 42;
    }
    return std::string{"INVITE"};
}
          `,
          "Absence de valeur ou pluralite de formes : deux contrats differents"
        ),
        bullets([
          "<code>value_or</code> est utile pour fournir une valeur de repli lisible sur un <code>optional</code>.",
          "<code>std::visit</code> permet de traiter explicitement les différentes formes d'un <code>variant</code>.",
          "Ces types remplacent souvent des conventions informelles fragiles et difficiles à relire."
        ]),
        callout("info", "Question simple", "La donnée peut-elle être absente, ou peut-elle réellement exister sous plusieurs formes différentes ? La réponse oriente souvent immédiatement vers <code>optional</code> ou <code>variant</code>.")
      ),
      lesson(
        "<code>string_view</code> et autres vues non propriétaires : puissantes mais sensibles à la durée de vie",
        paragraphs(
          "<code>std::string_view</code> est un excellent outil pour observer une chaîne sans la copier. Mais cette économie cache une responsabilité supplémentaire : une vue n'est pas propriétaire de ses données. Si la chaîne d'origine disparaît, la vue devient invalide. C'est donc un outil très puissant pour les API de lecture, mais qui demande une vraie rigueur de durée de vie.",
          "Le même raisonnement existe avec d'autres vues non propriétaires comme <code>std::span</code> en C++20 pour les séquences. Le point moderne important n'est pas juste la syntaxe, mais la capacité à distinguer clairement possession et simple observation."
        ),
        code(
          "cpp",
          `
void afficherNom(std::string_view nom) {
    std::cout << nom << '\n';
}

std::string nom{"Amina"};
afficherNom(nom);          // OK
afficherNom("Ines");       // OK

// std::string_view vueDangereuse = std::string{"temporaire"}; // duree de vie fragile
          `,
          "Une vue lit sans posseder"
        ),
        table(
          ["Type", "Rôle", "Vigilance"],
          [
            ["<code>std::string</code>", "Possède la chaîne", "Copie ou déplace réellement les caractères."],
            ["<code>std::string_view</code>", "Observe une chaîne sans la posséder", "La source doit rester vivante."],
            ["<code>std::span&lt;T&gt;</code>", "Observe une plage contiguë sans la posséder", "Même exigence sur la durée de vie de la source."]
          ]
        ),
        callout("warn", "Piège moderne classique", "Le code moderne réduit les copies, mais il n'efface jamais la question de la durée de vie. Une vue non propriétaire reste sûre seulement tant que sa source reste valide.")
      ),
      lesson(
        "Petits outils modernes très rentables : <code>[[nodiscard]]</code>, <code>filesystem</code> et <code>if constexpr</code>",
        paragraphs(
          "Le C++ moderne ne se limite pas à quelques types plus pratiques. Il fournit aussi des outils ponctuels très efficaces pour renforcer le contrat du code. <code>[[nodiscard]]</code> demande au compilateur de signaler qu'une valeur de retour importante ne devrait pas être ignorée. <code>std::filesystem</code> rend la manipulation de chemins plus expressive que les chaînes bricolées. <code>if constexpr</code>, enfin, permet de sélectionner du code à la compilation selon des propriétés de type.",
          "Ces outils ont un point commun : ils réduisent le nombre de conventions silencieuses dans le code. On explique davantage au compilateur et au lecteur ce que l'on attend réellement."
        ),
        code(
          "cpp",
          `
[[nodiscard]] bool chargerConfiguration(const std::filesystem::path& chemin) {
    return std::filesystem::exists(chemin);
}

template <typename T>
void afficherCategorie() {
    if constexpr (std::is_integral_v<T>) {
        std::cout << "type entier\n";
    } else {
        std::cout << "autre type\n";
    }
}
          `,
          "Des outils petits mais tres rentables"
        ),
        bullets([
          "<code>std::filesystem::path</code> porte mieux l'idée de chemin qu'une simple chaîne.",
          "<code>[[nodiscard]]</code> aide à éviter qu'un résultat critique soit ignoré par inadvertance.",
          "<code>if constexpr</code> sélectionne une branche à la compilation, pas à l'exécution."
        ]),
        callout("success", "Modernité utile", "Les meilleurs outils modernes sont souvent les plus discrets : ils enlèvent des conventions fragiles sans attirer l'attention sur eux.")
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
      "Je peux expliquer la différence entre <code>auto</code>, <code>auto&amp;</code>, <code>const auto&amp;</code> et <code>auto*</code> sur une ligne donnée.",
      "Je sais lire et écrire un range-for ainsi qu'un <code>if</code> avec initialisation.",
      "Je peux citer un usage pertinent de <code>std::optional</code>.",
      "Je peux expliquer quand <code>std::variant</code> est plus juste que <code>std::optional</code>.",
      "Je sais lire des structured bindings simples.",
      "Je comprends qu'une vue comme <code>std::string_view</code> n'est pas propriétaire et dépend de la durée de vie de sa source.",
      "Je peux citer un usage crédible de <code>std::filesystem</code>, <code>[[nodiscard]]</code> ou <code>if constexpr</code>.",
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
      },
      {
        question: "Quel outil exprime le mieux qu'une valeur peut être absente sans utiliser un code magique ?",
        options: [
          "<code>std::optional</code>",
          "<code>std::variant</code>",
          "<code>std::filesystem::path</code>"
        ],
        answer: 0,
        explanation: "<code>std::optional</code> rend explicite l'absence possible d'une valeur. C'est plus honnête qu'un <code>-1</code> ou qu'une chaîne vide conventionnelle."
      },
      {
        question: "Quel est le vrai risque principal avec <code>std::string_view</code> ?",
        options: [
          "Il copie toujours trop de mémoire",
          "Il n'est pas propriétaire, donc la source doit rester valide",
          "Il ne peut pas être passé en paramètre de fonction"
        ],
        answer: 1,
        explanation: "La vue est légère parce qu'elle ne possède rien. Sa sûreté dépend donc entièrement de la durée de vie de la chaîne observée."
      },
      {
        question: "Que permet <code>if constexpr</code> par rapport à un <code>if</code> classique ?",
        options: [
          "Choisir une branche à la compilation selon les propriétés d'un type",
          "Créer automatiquement des threads",
          "Remplacer toutes les surcharges de fonctions"
        ],
        answer: 0,
        explanation: "Le choix est résolu à la compilation. Cela permet de garder un code générique lisible tout en évitant de compiler une branche non pertinente pour le type courant."
      },
      {
        question: "Pourquoi <code>[[nodiscard]]</code> est-il utile ?",
        options: [
          "Parce qu'il demande au compilateur de signaler qu'une valeur importante ne devrait pas être ignorée",
          "Parce qu'il supprime tout warning",
          "Parce qu'il remplace les exceptions"
        ],
        answer: 0,
        explanation: "C'est une petite annotation très rentable pour renforcer le contrat d'une fonction dont le résultat a une importance réelle."
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
      },
      {
        title: "Vues non propriétaires sous contrôle",
        difficulty: "Intermédiaire",
        time: "25 min",
        prompt: "Refactorise une petite API de lecture de chaînes ou de séquences pour utiliser <code>std::string_view</code> et, si ton standard le permet, <code>std::span</code>. Pour chaque fonction, explique pourquoi la durée de vie de la source reste sûre ou ce qu'il faut interdire.",
        deliverables: [
          "les signatures modernisées",
          "un exemple sûr et un exemple volontairement dangereux commenté",
          "une explication centrée sur l'ownership et la durée de vie"
        ]
      },
      {
        title: "Trois modernisations qui comptent",
        difficulty: "Avancé",
        time: "30 min",
        prompt: "Prends un mini-module existant et introduis exactement trois modernisations à fort impact parmi <code>optional</code>, <code>string_view</code>, <code>filesystem</code>, <code>[[nodiscard]]</code>, <code>structured bindings</code>, <code>if constexpr</code>. L'objectif est d'améliorer le contrat du code, pas seulement son style.",
        deliverables: [
          "les trois outils retenus",
          "le code avant/après",
          "une justification du bénéfice concret pour chacun"
        ]
      }
    ],
    keywords: ["auto", "optional", "variant", "structured bindings", "range-for", "modern cpp", "string_view", "span", "filesystem", "nodiscard", "if constexpr"]
  })),
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
      focus: "Les syntaxes modernes de parcours et de décomposition servent à rapprocher le code de l'intention métier. range-for, bindings structurés et if avec initialisation raccourcissent le trajet entre la donnée observée et la décision prise sur elle.",
      retenir: [
        "Une variable de contrôle vit idéalement dans la plus petite portée possible.",
        "Décomposer une paire ou un tuple avec un nom clair réduit le bruit de lecture."
      ],
      pitfalls: [
        "Continuer à écrire un itérateur verbeux par habitude alors qu'un range-for dirait la même chose plus clairement.",
        "Utiliser des structured bindings sans faire attention à la copie ou à la référence selon le contexte."
      ],
      method: [
        "Repère d'abord les boucles et tests qui contiennent beaucoup de mécanique répétitive.",
        "Remplace ensuite cette mécanique par un outil moderne plus local et plus lisible.",
        "Vérifie enfin si tu copies ou observes les données selon l'intention réelle."
      ],
      check: "Sur une boucle donnée, le range-for clarifie-t-il le code ou masque-t-il au contraire un détail important du parcours ?"
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
      focus: "Les vues non propriétaires comme string_view sont très puissantes car elles rendent les API de lecture plus légères et plus souples. Mais elles dépendent entièrement de la durée de vie de la source : moderniser en ce sens ne retire jamais l'obligation de raisonner sur l'ownership.",
      retenir: [
        "Une vue observe une ressource existante ; elle ne la garde pas en vie.",
        "L'économie de copie est réelle, mais elle échange ce confort contre une responsabilité de durée de vie."
      ],
      pitfalls: [
        "Construire un string_view à partir d'une chaîne temporaire qui disparaît aussitôt.",
        "Présenter une vue comme si elle possédait les données qu'elle montre."
      ],
      method: [
        "Identifie d'abord qui possède réellement les données.",
        "Vérifie ensuite que cette source vivra plus longtemps que la vue.",
        "Si ce n'est pas garanti, reviens à un type propriétaire comme std::string."
      ],
      check: "Quand tu choisis string_view en paramètre ou en variable locale, sais-tu nommer précisément l'objet qui porte la vraie propriété des caractères ?"
    },
    {
      focus: "Les petits outils modernes comme [[nodiscard]], filesystem ou if constexpr sont rentables parce qu'ils ajoutent du contrat sans alourdir le code. Ils incarnent bien l'idée de modernité sobre : plus d'intention, moins de convention implicite.",
      retenir: [
        "[[nodiscard]] prévient quand ignorer un résultat est probablement une erreur.",
        "filesystem et if constexpr expriment respectivement mieux les chemins et les branches dépendantes du type."
      ],
      pitfalls: [
        "Adopter un outil moderne uniquement parce qu'il est récent, sans bénéfice précis.",
        "Utiliser if constexpr alors qu'une simple surcharge ou une structure plus claire suffirait."
      ],
      method: [
        "Cherche d'abord une convention implicite fragile dans le code existant.",
        "Choisis ensuite l'outil moderne qui la rend explicite ou la supprime.",
        "Refuse l'ajout si l'amélioration reste purement cosmétique."
      ],
      check: "Peux-tu annoncer le bénéfice concret d'un outil moderne avant même de l'introduire dans le code ?"
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
