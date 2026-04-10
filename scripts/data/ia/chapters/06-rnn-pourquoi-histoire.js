(function registerChapterBundle6(globalScope) {
const registry = globalScope.CourseDataRegistry;

if (!registry) {
  console.error("CourseDataRegistry est indisponible. Vérifie que scripts/data/course-runtime.js est chargé avant les chapitres.");
  return;
}

const figures = globalScope.IA_FIGURES || {};

const {
  lesson,
  paragraphs,
  bullets,
  callout,
  code,
  table,
  formula,
  figure
} = registry.helpers;

function fig(key, caption) {
  const body = figures[key];
  if (!body) {
    return "";
  }
  return figure(body, { caption });
}

registry.registerChapterBundle({
  order: 6,
  chapter: {
    id: "rnn-pourquoi-histoire",
    shortTitle: "Pourquoi RNN",
    title: "Pourquoi les RNN existent",
    level: "Fondations",
    duration: "1 h 15",
    track: "IA2",
    summary:
      "Les ConvNet nous ont appris a traiter des donnees spatiales fixes. Les RNN apparaissent quand on veut raisonner sur des sequences : mots, prix boursiers, trames audio, evenements. Ce chapitre reprend le debut du cours de RNN presque point par point : limites du feedforward, notion de cycle, etat cache, puis deux ancetres historiques qu'il faut vraiment savoir distinguer, Jordan et Elman.",
    goals: [
      "expliquer pourquoi les réseaux feedforward sont mal adaptés aux séquences de longueur variable",
      "définir la récurrence comme l'introduction d'une boucle et d'un état caché",
      "comparer clairement un réseau de Jordan et un réseau d'Elman",
      "comprendre qu'une couche récurrente peut être un bloc parmi d'autres dans un réseau plus large"
    ],
    highlights: [
      "séquences",
      "récurrence",
      "état caché",
      "Jordan",
      "Elman",
      "cycles"
    ],
    body: [
      lesson(
        "Pourquoi les réseaux feedforward coincent sur les séquences",
        paragraphs(
          "Les réseaux de neurones standards, tout comme les ConvNet classiques, sont <strong>feedforward</strong> : l'information circule uniquement de l'entrée vers la sortie. Ils sont très efficaces quand l'entrée a une taille fixée d'avance, comme un vecteur de variables tabulaires ou une image de taille connue. Le problème est que beaucoup de données utiles dans le monde réel sont des <strong>séquences</strong>."
        ),
        paragraphs(
          "Une séquence a un ordre interne et une longueur qui peut varier. Une phrase peut faire 5 mots ou 50. Une série temporelle peut contenir 30 jours ou 3000 jours. Un réseau feedforward accepte bien des vecteurs de taille fixe, mais il n'a aucune mémoire native de ce qui a été vu juste avant."
        ),
        bullets([
          "la taille de l'entrée est fixée par le nombre de neurones d'entrée",
          "la taille de la sortie est fixée par le nombre de neurones de sortie",
          "le nombre de couches est lui aussi fixé à l'avance",
          "en l'absence de mémoire, l'ordre des éléments d'une séquence n'est pas naturellement pris en compte"
        ]),
        table(
          ["Famille", "Entrée", "Sortie", "Mémoire explicite", "Cycles"],
          [
            ["Réseau dense standard", "taille fixe", "taille fixe", "non", "non"],
            ["ConvNet classique", "grille de taille fixée", "taille fixe", "non", "non"],
            ["RNN", "suite <code>X_1 ... X_T</code>", "un ou plusieurs <code>Y_t</code>", "oui, via un état caché", "oui"]
          ]
        ),
        fig("rnnFeedforwardVsRecurrent", "À gauche : flux sans mémoire. À droite : la sortie courante dépend aussi d'un état venu du pas précédent."),
        callout(
          "info",
          "Ce qui varie vraiment",
          "Dans un RNN, chaque élément individuel <code>X_t</code> garde une dimension fixe. Ce qui peut varier, c'est la longueur <code>T</code> de la séquence. Autrement dit, le réseau traite une suite de vecteurs de taille fixe, pas un grand vecteur dont la taille change à chaque exemple."
        )
      ),

      lesson(
        "L'idée des RNN : ajouter une boucle",
        paragraphs(
          "L'idée la plus simple pour traiter une séquence est de relâcher l'interdiction des cycles. Au lieu de calculer une sortie uniquement à partir de l'entrée courante, on autorise le réseau a reutiliser une trace de ce qu'il a calcule au pas precedent. Cette trace s'appelle l'<strong>etat cache</strong>."
        ),
        code(
          "text",
          `
Reseau feedforward
------------------
X  --->  reseau  --->  Y

Reseau recurrent
----------------
X_t + h_(t-1)  --->  reseau  --->  Y_t
                     |
                     +-----> h_t ----+
                                      |
                                      +--> reutilise au temps suivant
          `,
          "Feedforward vs récurrent"
        ),
        formula(
          `<var>H</var><sup>t</sup> <span class="op">=</span> <span class="fn">f</span>(<var>X</var><sup>t</sup>, <var>H</var><sup>t−1</sup>)`,
          { caption: "Un RNN combine l'entrée courante avec une mémoire issue du pas précédent." }
        ),
        paragraphs(
          "Le mot important est <strong>memoire</strong>. Le reseau ne stocke pas toute la sequence telle quelle : il la compresse progressivement dans un vecteur interne. Cette compression sera parfois suffisante, parfois trop agressive. C'est exactement ce qui expliquera plus tard les limites des RNN standards."
        ),
        callout(
          "warn",
          "Une boucle, pas un stockage brut",
          "Le RNN ne garde pas la séquence complète en mémoire comme une liste. Il reconstruit à chaque temps <code>t</code> un résumé interne de tout ce qui a été vu jusque-là."
        )
      ),

      lesson(
        "Le réseau de Jordan",
        paragraphs(
          "Le réseau de Jordan, introduit par <strong>M. I. Jordan en 1986</strong>, est une des premières architectures récurrentes pédagogiques. Son idée : <strong>recycler la sortie précédente du réseau</strong> pour influencer le calcul suivant. La couche d'entrée contient donc des <strong>unités d'état</strong> alimentées par la sortie précédente."
        ),
        paragraphs(
          "Dans les slides du cours, deux types de connexions apparaissent : les connexions entraînables, dont les poids sont appris, et des connexions <strong>un pour un à poids fixe égal à 1.0</strong> qui recopient la sortie précédente vers ces unités d'état."
        ),
        formula(
          `<var>H</var><sup>t</sup> <span class="op">=</span> σ<sub>h</sub>(<var>U</var><var>X</var><sup>t</sup> <span class="op">+</span> <var>V</var><var>Y</var><sup>t−1</sup> <span class="op">+</span> <var>B</var><sup>h</sup>)`,
          { caption: "Dans Jordan, c'est la sortie passée <var>Y</var><sup>t−1</sup> qui revient dans le calcul caché." }
        ),
        formula(
          `<var>Y</var><sup>t</sup> <span class="op">=</span> σ<sub>y</sub>(<var>W</var><var>H</var><sup>t</sup> <span class="op">+</span> <var>B</var><sup>y</sup>)`,
          { caption: "La sortie est produite à partir de la couche cachée courante." }
        ),
        callout(
          "warn",
          "Ce qu'il faut retenir",
          "Dans un réseau de Jordan, la boucle transporte l'information via la sortie du réseau. C'est historiquement important, mais ce n'est pas la variante qui a fini par devenir la plus standard."
        )
      ),

      lesson(
        "Le réseau d'Elman",
        paragraphs(
          "Le réseau d'Elman, introduit par <strong>J. L. Elman en 1990</strong>, modifie un point cle : ce n'est plus la sortie du reseau qui est recopiee, mais la <strong>sortie cachee precedente</strong>. La couche d'entrée contient alors des <strong>unités contexte</strong>."
        ),
        paragraphs(
          "Là encore, les slides distinguent les connexions entraînables et la copie fixe un pour un, de poids 1.0. Mais cette fois, c'est l'état caché précédent qui alimente le calcul courant, ce qui colle beaucoup mieux a l'idee moderne d'un état interne qui résume le passé."
        ),
        formula(
          `<var>H</var><sup>t</sup> <span class="op">=</span> σ<sub>h</sub>(<var>U</var><var>X</var><sup>t</sup> <span class="op">+</span> <var>V</var><var>H</var><sup>t−1</sup> <span class="op">+</span> <var>B</var><sup>h</sup>)`,
          { caption: "Dans Elman, la boucle réinjecte l'état caché précédent." }
        ),
        formula(
          `<var>Y</var><sup>t</sup> <span class="op">=</span> σ<sub>y</sub>(<var>W</var><var>H</var><sup>t</sup> <span class="op">+</span> <var>B</var><sup>y</sup>)`,
          { caption: "La sortie reste calculée à partir de l'état caché courant." }
        ),
        fig("jordanElmanComparison", "Jordan boucle via la sortie précédente. Elman boucle via l'état caché précédent."),
        table(
          ["Architecture", "Ce qui est recopié", "Nom des unités", "Intuition"],
          [
            ["Jordan", "<code>Y^{t-1}</code>", "unités d'état", "on réinjecte la sortie précédente"],
            ["Elman", "<code>H^{t-1}</code>", "unités contexte", "on réinjecte la mémoire interne précédente"]
          ]
        ),
        callout(
          "success",
          "Vers le RNN standard",
          "Le RNN conventionnel moderne est beaucoup plus proche d'Elman que de Jordan : on considère qu'un état caché interne résume mieux le passé qu'une simple sortie précédente."
        )
      ),

      lesson(
        "Une couche récurrente n'est pas forcément tout le réseau",
        paragraphs(
          "Quand on ecrit les equations d'un RNN, on decrit souvent une architecture tres simple : une entree, une couche cachee recurrente, puis une sortie. Mais ce qui est reellement defini est surtout une <strong>couche recurrente</strong>. Rien n'empeche ensuite d'empiler plusieurs couches recurrentes, d'ajouter une couche dense de sortie, ou de combiner ce bloc recurrent avec d'autres types de couches."
        ),
        bullets([
          "un RNN simple = une seule couche récurrente",
          "un RNN profond = plusieurs couches récurrentes empilées",
          "un système réel = souvent un mélange de couches récurrentes, d'embeddings, et de têtes de sortie spécialisées"
        ]),
        paragraphs(
          "Cette remarque est importante pour la suite : quand on parlera de LSTM ou de GRU, on parlera encore d'un <strong>type de couche recurrente</strong>. L'architecture finale peut rester simple ou devenir tres profonde."
        )
      )
    ].join(""),

    checklist: [
      "Je peux expliquer pourquoi un réseau feedforward est naturellement mal adapté aux séquences de longueur variable.",
      "Je peux définir l'idée d'un RNN comme l'ajout d'une boucle et d'un état caché.",
      "Je sais dire en une phrase ce que recycle un réseau de Jordan et ce que recycle un réseau d'Elman.",
      "Je sais rappeler que Jordan et Elman utilisent aussi une copie fixe un pour un de poids 1.0.",
      "Je comprends que l'état caché joue le rôle d'une mémoire compacte du passé.",
      "Je sais qu'une couche récurrente peut être un bloc parmi d'autres dans une architecture plus large."
    ],

    quiz: [
      {
        question: "Pourquoi les réseaux feedforward classiques sont-ils mal adaptés aux séquences longues ou de taille variable ?",
        options: [
          "Parce qu'ils n'ont pas de fonction d'activation",
          "Parce qu'ils imposent un flux sans mémoire avec entrée et sortie de taille fixée",
          "Parce qu'ils ne peuvent pas être entraînés par descente de gradient",
          "Parce qu'ils sont réservés aux images couleur"
        ],
        answer: 1,
        explanation: "Un réseau feedforward accepte des tenseurs de forme prévue d'avance et ne transporte pas naturellement d'information d'un pas à l'autre. Les séquences demandent au contraire ordre, mémoire et parfois longueur variable."
      },
      {
        question: "Dans un réseau récurrent, quel objet joue le rôle de mémoire interne ?",
        options: [
          "Le padding",
          "Le stride",
          "L'état caché <code>h_t</code>",
          "Le filtre de convolution"
        ],
        answer: 2,
        explanation: "L'état caché résume ce que le réseau a déjà vu et permet au pas suivant de ne pas repartir de zéro."
      },
      {
        question: "Quelle est la différence fondamentale entre Jordan et Elman ?",
        options: [
          "Jordan est convolutif, Elman est dense",
          "Jordan recycle la sortie précédente, Elman recycle l'état caché précédent",
          "Jordan n'a pas de biais, Elman en a",
          "Jordan utilise ReLU, Elman softmax"
        ],
        answer: 1,
        explanation: "Jordan boucle via la sortie du réseau, tandis qu'Elman boucle via la couche cachée. C'est la différence historique à retenir."
      },
      {
        question: "Dans les schémas historiques de Jordan et d'Elman, les connexions pointillées correspondent à :",
        options: [
          "des poids appris par descente de gradient",
          "des convolutions 3 x 3",
          "des copies un pour un avec un poids fixe de 1.0",
          "des neurones dropout"
        ],
        answer: 2,
        explanation: "Les slides insistent sur ce point : la boucle historique passe souvent par une simple copie fixe du signal précédent, pas par une nouvelle famille de poids appris."
      },
      {
        question: "Dire qu'un réseau est récurrent signifie avant tout que :",
        options: [
          "il contient une boucle temporelle",
          "il a plus de 100 couches",
          "il possède au moins un filtre 3 x 3",
          "il remplace la perte par une softmax"
        ],
        answer: 0,
        explanation: "La récurrence, c'est l'existence d'un retour d'information d'un pas de temps vers le suivant."
      },
      {
        question: "Quand on décrit un RNN simple avec une seule couche cachée, on décrit en réalité surtout :",
        options: [
          "une fonction de perte seulement",
          "une couche récurrente qui peut être réutilisée dans un réseau plus grand",
          "une architecture réservée à la traduction",
          "une forme particulière de pooling"
        ],
        answer: 1,
        explanation: "Les équations de base décrivent le coeur recurrent. Rien n'empêche ensuite de l'intégrer dans une architecture plus riche."
      }
    ],

    exercises: [
      {
        title: "Comparer feedforward et RNN",
        difficulty: "Facile",
        time: "10 min",
        prompt: "Prends trois problèmes parmi les suivants : prédire un prix boursier à partir des 30 derniers jours, classer une image, traduire une phrase, détecter du spam dans un mail. Pour chacun, dis si un réseau feedforward suffit naturellement ou si la récurrence apporte quelque chose de décisif. Justifie à chaque fois.",
        deliverables: [
          "3 mini-analyses problemes par probleme",
          "au moins une justification liée à la mémoire",
          "au moins une justification liée à la longueur variable d'une séquence"
        ]
      },
      {
        title: "Jordan ou Elman ?",
        difficulty: "Intermédiaire",
        time: "12 min",
        prompt: "On te donne deux équations récurrentes. Dans le premier cas, la couche cachée dépend de <code>Y^{t-1}</code>. Dans le second, elle dépend de <code>H^{t-1}</code>. Identifie le type de réseau dans chaque cas, puis explique en une phrase l'intuition derrière ce choix.",
        deliverables: [
          "le nom de chaque architecture",
          "une phrase d'intuition pour Jordan",
          "une phrase d'intuition pour Elman"
        ]
      },
      {
        title: "Décrire la mémoire d'un RNN",
        difficulty: "Intermédiaire",
        time: "15 min",
        prompt: "Imagine un RNN qui lit une phrase mot par mot. Décris en 120-180 mots ce que pourrait contenir l'état caché après lecture de chacun des mots d'une courte phrase de ton choix.",
        deliverables: [
          "la phrase choisie",
          "une interpretation qualitative de l'etat cache a plusieurs pas de temps",
          "une conclusion sur le caractere compresse de cette memoire"
        ]
      }
    ],

    keywords: [
      "rnn",
      "récurrence",
      "séquence",
      "feedforward",
      "état caché",
      "jordan",
      "elman",
      "mémoire",
      "cycles"
    ]
  }
});
})(window);
