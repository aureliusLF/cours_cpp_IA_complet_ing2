(function registerChapterBundle15(globalScope) {
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
  order: 15,
  chapter: {
    id: "nlp-introduction-approches",
    shortTitle: "Intro NLP",
    title: "Introduction au NLP : langage naturel, tâches et approches",
    level: "Fondations",
    duration: "1 h 20",
    track: "IA4",
    summary:
      "On ouvre le bloc NLP avec la question de base : comment faire communiquer une machine avec une langue humaine ? Le chapitre situe le NLP dans l'IA, distingue langage naturel et langage formel, liste les applications, puis compare les approches symbolique, statistique et connexionniste avant de présenter les niveaux d'analyse.",
    goals: [
      "définir le NLP comme branche de l'intelligence artificielle dédiée au langage naturel",
      "distinguer langage naturel, langage formel, texte écrit et parole transcrite",
      "citer des applications typiques : traduction, question-réponse, résumé, sentiment",
      "comparer approches symbolique, statistique et connexionniste",
      "placer les niveaux phonologique, morphologique, lexical, syntaxique, sémantique, discours et pragmatique",
      "comprendre pourquoi le cours se concentre surtout sur lexical, syntaxique et sémantique"
    ],
    highlights: [
      "NLP",
      "TALN",
      "langage naturel",
      "symbolique",
      "statistique",
      "connexionniste",
      "niveaux d'analyse"
    ],
    body: [
      lesson(
        "Ce que le NLP essaie de faire",
        paragraphs(
          "Le <strong>Natural Language Processing</strong>, ou <strong>traitement automatique du langage naturel</strong>, est une branche de l'intelligence artificielle. L'objectif est de permettre à une machine d'analyser, représenter ou produire des textes et de la parole transcrite dans une langue humaine.",
          "Le cours insiste sur une différence simple : une langue naturelle comme le français, l'anglais ou l'arabe n'est pas un langage formel. Elle contient de l'ambiguïté, des exceptions, du contexte, des conventions et parfois des phrases très éloignées de ce qu'une grammaire scolaire attendrait."
        ),
        fig("nlpAnalysisPipeline", "Le bloc NLP du cours suit les trois niveaux centraux : analyse lexicale, syntaxique, puis sémantique."),
        callout(
          "info",
          "Définition utile",
          "Pour réviser, retiens ceci : le NLP regroupe des techniques de calcul qui analysent et représentent des textes naturels à un ou plusieurs niveaux linguistiques afin de réaliser des tâches de compréhension ou de génération."
        )
      ),

      lesson(
        "Quels documents et quelles applications ?",
        paragraphs(
          "Le NLP peut traiter des documents écrits directement, ou de la parole une fois transcrite. Les entrées sont donc très variées : tweets, articles, questions, documents longs, conversations, commentaires, pages web ou corpus spécialisés."
        ),
        table(
          ["Application", "Entrée", "Sortie attendue"],
          [
            ["Traduction automatique", "phrase ou document source", "phrase ou document dans une autre langue"],
            ["Question answering", "question + corpus ou contexte", "réponse courte ou passage pertinent"],
            ["Résumé automatique", "texte long", "version plus courte qui garde l'essentiel"],
            ["Analyse de sentiments", "tweet, avis, commentaire", "classe positive, négative ou neutre"]
          ]
        ),
        paragraphs(
          "Ces tâches n'exigent pas toutes la même profondeur d'analyse. Extraire des hashtags demande surtout des expressions régulières et une bonne tokenisation ; comprendre une ambiguïté ou construire une réponse fiable demande davantage de syntaxe et de sémantique."
        )
      ),

      lesson(
        "Méthodes mobilisées",
        paragraphs(
          "Le PDF cite plusieurs familles d'outils : théorie des automates, apprentissage automatique, statistiques et logique. Ce n'est pas une liste décorative : chacune correspond à une façon de regarder le langage."
        ),
        table(
          ["Famille", "Idée", "Exemple dans ce bloc"],
          [
            ["Automates / regex", "reconnaître des motifs de caractères", "extraire @utilisateur, #hashtag ou URL"],
            ["Machine learning", "apprendre un comportement à partir d'exemples", "classifieur de sentiments"],
            ["Statistiques", "choisir l'analyse la plus probable selon le contexte", "POS tagging ou modèle bayésien"],
            ["Logique", "représenter du sens et raisonner", "sémantique compositionnelle"]
          ]
        ),
        callout(
          "success",
          "Le bon réflexe",
          "Ne choisis pas l'outil avant la tâche. Une regex suffit pour une extraction locale bien définie ; un classifieur devient utile quand il faut généraliser sur des formulations variées."
        )
      ),

      lesson(
        "Trois grandes approches",
        paragraphs(
          "Le cours distingue trois approches historiques et pratiques. Elles ne s'excluent pas toujours, mais elles donnent trois manières très différentes de construire un système NLP."
        ),
        table(
          ["Approche", "Principe", "Force", "Limite"],
          [
            ["Symbolique", "représenter la connaissance avec des règles ou des faits", "explicable et contrôlable", "coûteux à maintenir à grande échelle"],
            ["Statistique", "apprendre des régularités sur de grands corpus", "robuste aux variations fréquentes", "dépend fortement des données"],
            ["Connexionniste", "utiliser des réseaux de neurones", "apprend des représentations riches", "plus difficile à interpréter et à contrôler"]
          ]
        ),
        paragraphs(
          "Dans les slides, les réseaux cités pour le NLP moderne sont notamment les LSTM et les réseaux convolutifs. Dans le cours IA que tu as déjà, le bloc RNN/LSTM prépare donc naturellement l'arrivée du NLP."
        )
      ),

      lesson(
        "Les niveaux de traitement du langage",
        paragraphs(
          "Un système NLP peut travailler à plusieurs niveaux linguistiques. Le cours les présente comme une progression : sons, formes des mots, rôle des mots, structure des phrases, sens, texte global, puis usage en contexte."
        ),
        table(
          ["Niveau", "Question posée", "Exemple"],
          [
            ["Phonologie", "quels sons composent les mots ?", "utile surtout pour la parole"],
            ["Morphologie", "comment les mots sont formés ?", "<code>commanded = command + ed</code>"],
            ["Lexical", "quel rôle et quel sens local pour chaque mot ?", "POS tag et lexique"],
            ["Syntaxique", "comment les mots forment une phrase ?", "arbre d'analyse"],
            ["Sémantique", "quel est le sens ?", "ambiguïtés et relations de sens"],
            ["Discours", "comment les phrases forment un texte ?", "cohérence globale"],
            ["Pragmatique", "que signifie l'énoncé en contexte ?", "conventions et connaissance du monde"]
          ]
        ),
        callout(
          "info",
          "Périmètre du cours",
          "Le support se concentre surtout sur les niveaux lexical, syntaxique et sémantique, avec un peu de pratique autour des regex et de l'analyse de sentiments."
        )
      ),

      lesson(
        "Mini-carte mentale",
        code(
          "text",
          `
NLP / TALN
  Entrées
    - textes écrits
    - parole transcrite

  Tâches
    - traduire
    - répondre à une question
    - résumer
    - classer un sentiment
    - extraire des motifs

  Approches
    - symbolique : règles et faits
    - statistique : corpus et probabilités
    - connexionniste : réseaux de neurones

  Niveaux principaux du cours
    - lexical : tokens, POS, lemmes
    - syntaxique : grammaire, parsing, arbre
    - sémantique : sens, ambiguïté, relations
          `,
          "Fiche de révision NLP"
        )
      )
    ].join(""),

    checklist: [
      "Je peux définir le NLP et donner au moins trois applications.",
      "Je distingue langage naturel et langage formel.",
      "Je sais comparer approches symbolique, statistique et connexionniste.",
      "Je peux citer les niveaux de traitement du langage.",
      "Je sais pourquoi le cours insiste sur lexical, syntaxique et sémantique."
    ],

    quiz: [
      {
        question: "Le NLP traite principalement :",
        options: [
          "des langages naturels humains, écrits ou parlés puis transcrits",
          "uniquement des langages de programmation",
          "uniquement des images 2D",
          "uniquement des politiques de Q-Learning"
        ],
        answer: 0,
        explanation: "Le NLP vise les langues humaines comme le français, l'anglais ou l'arabe, sous forme écrite ou transcrite."
      },
      {
        question: "Une approche symbolique représente surtout la connaissance comme :",
        options: [
          "des règles ou des faits",
          "des pixels",
          "des récompenses cumulées",
          "des noyaux de convolution uniquement"
        ],
        answer: 0,
        explanation: "L'approche symbolique s'appuie principalement sur des règles, faits ou représentations explicites."
      },
      {
        question: "Quel niveau s'intéresse à la structure des phrases ?",
        options: [
          "phonologique",
          "syntaxique",
          "discours",
          "pragmatique seulement"
        ],
        answer: 1,
        explanation: "L'analyse syntaxique étudie comment les mots se combinent pour former une phrase."
      },
      {
        question: "Pour extraire des hashtags bien définis dans des tweets, le premier outil raisonnable est souvent :",
        options: [
          "une expression régulière",
          "Value Iteration",
          "un arbre de Bellman",
          "une couche de pooling"
        ],
        answer: 0,
        explanation: "Les regex sont adaptées aux motifs locaux de caractères comme hashtags, mentions ou URL."
      }
    ],

    exercises: [
      {
        title: "Classer les tâches NLP",
        difficulty: "Facile",
        time: "10 min",
        prompt: "Pour traduction, résumé, extraction de hashtags, question-réponse et analyse de sentiments, indique l'entrée, la sortie et l'approche qui te semble naturelle pour démarrer.",
        deliverables: [
          "un tableau tâche / entrée / sortie",
          "une approche candidate pour chaque tâche",
          "une justification courte"
        ]
      },
      {
        title: "Niveaux d'analyse",
        difficulty: "Intermédiaire",
        time: "15 min",
        prompt: "Prends une phrase simple en français. Décris ce que tu regarderais au niveau morphologique, lexical, syntaxique et sémantique.",
        deliverables: [
          "une phrase choisie",
          "quatre analyses courtes",
          "une ambiguïté possible si tu en trouves une"
        ]
      }
    ],

    keywords: [
      "NLP",
      "TALN",
      "langage naturel",
      "approche symbolique",
      "approche statistique",
      "approche connexionniste",
      "niveaux d'analyse",
      "lexical",
      "syntaxique",
      "sémantique"
    ]
  }
});
})(window);
