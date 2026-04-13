(function registerChapterBundleMl00c(globalScope) {
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
  order: 0.3,
  chapter: {
    id: "fiche-parametres-hyperparametres",
    shortTitle: "Fiche paramètres",
    title: "Fiche récap : paramètres et hyperparamètres des modèles étudiés",
    level: "Fiche",
    duration: "1 h 10",
    track: "IA0",
    summary:
      "Une fiche transversale pour ne plus mélanger ce que le modèle apprend et ce que l'on choisit : CNN, RNN, LSTM, NLP, transformeurs vus en introduction, apprentissage par renforcement tabulaire, Dyna et Q-Learning.",
    goals: [
      "distinguer paramètres appris, hyperparamètres de modèle et hyperparamètres d'entraînement",
      "lister les paramètres et hyperparamètres essentiels d'un CNN",
      "lister ceux d'un RNN simple, d'un LSTM et d'un modèle NLP",
      "lister ceux de l'apprentissage par renforcement tabulaire, de Dyna et du Q-Learning",
      "savoir quoi régler avec validation et quoi mesurer seulement sur test"
    ],
    highlights: [
      "paramètres",
      "hyperparamètres",
      "CNN",
      "RNN",
      "NLP",
      "Q-Learning"
    ],
    body: [
      lesson(
        "La distinction qui évite beaucoup de confusion",
        paragraphs(
          "Dans tous les chapitres du cours, on retrouve la même séparation. Les <strong>paramètres appris</strong> sont modifiés par l'algorithme pendant l'entraînement ou l'interaction. Les <strong>hyperparamètres</strong> sont les choix de conception ou de procédure : on les fixe avant, ou on les choisit avec la validation. Le <strong>test</strong>, lui, ne sert pas à choisir : il sert à mesurer à la fin."
        ),
        fig("mlParamHyperparamMap", "À gauche ce qui est appris, à droite ce qui est choisi ; le test ne règle rien."),
        table(
          ["Catégorie", "Définition", "Exemples", "Source de choix"],
          [
            ["Paramètres appris", "valeurs ajustées automatiquement", "poids, biais, filtres, matrices RNN, embeddings, table Q", "train ou interactions"],
            ["Hyperparamètres du modèle", "structure ou capacité du modèle", "nombre de couches, taille cachée, taille de filtre, vocabulaire, nombre d'actions", "design + validation"],
            ["Hyperparamètres d'entraînement", "manière d'apprendre", "learning rate, batch size, epochs, optimizer, alpha, epsilon", "validation + courbes"],
            ["Métriques et protocole", "manière de mesurer", "F1 macro, RMSE, retour actualisé, split temporel", "choisis avant l'expérience"]
          ]
        ),
        callout(
          "success",
          "Test mental",
          "Si la valeur est mise à jour automatiquement à partir des exemples ou des rewards, c'est un paramètre appris. Si tu dois décider une valeur ou une règle avant de lancer, c'est un hyperparamètre."
        )
      ),

      lesson(
        "CNN / ConvNet",
        paragraphs(
          "Un CNN apprend surtout des <strong>filtres</strong> : chaque filtre est un petit tenseur de poids appliqué partout dans l'image. Le partage de poids fait que ces paramètres restent relativement peu nombreux par rapport à une couche fully connected équivalente."
        ),
        table(
          ["Bloc", "Paramètres appris", "Hyperparamètres à choisir"],
          [
            ["Convolution", "poids des filtres <code>W</code> et biais <code>b</code>", "nombre de filtres, taille du kernel, stride, padding, dilation"],
            ["Batch normalization", "<code>gamma</code> et <code>beta</code> appris", "utiliser BN ou non, position avant/après activation"],
            ["Activation", "souvent aucun paramètre pour ReLU", "fonction : ReLU, Leaky ReLU, tanh, sigmoid"],
            ["Pooling", "aucun paramètre appris en max/avg pooling", "taille de fenêtre, stride, type max/average"],
            ["Dropout", "aucun poids appris", "probabilité <code>p</code> de mise à zéro"],
            ["Fully connected", "poids et biais de chaque neurone", "nombre de couches denses, nombre de neurones"],
            ["Entraînement", "les poids ci-dessus sont ajustés", "optimizer, learning rate, batch size, epochs, augmentation, early stopping"]
          ]
        ),
        code(
          "text",
          `
Paramètres d'une Conv2D :
(kernel_height × kernel_width × canaux_entrée + biais) × nombre_de_filtres

Exemple :
filtre 3 × 3, 16 canaux d'entrée, 32 filtres
(3 × 3 × 16 + 1) × 32 = 4640 paramètres
          `,
          "Compter les paramètres d'une couche Conv"
        )
      ),

      lesson(
        "RNN, LSTM et traitement des séquences",
        paragraphs(
          "Dans un RNN simple, les paramètres importants sont les matrices qui relient l'entrée à l'état caché, l'état caché précédent à l'état caché courant, puis l'état caché à la sortie. Dans un LSTM, cette logique est multipliée par les portes : oubli, entrée, sortie et état candidat."
        ),
        table(
          ["Modèle", "Paramètres appris", "Hyperparamètres à choisir"],
          [
            ["RNN simple", "<code>U</code>, <code>V</code>, <code>W</code>, <code>B^h</code>, <code>B^o</code>", "taille cachée <code>m</code>, nombre de couches, activation, longueur de séquence, BPTT tronqué ou non"],
            ["LSTM", "matrices et biais des portes <code>I</code>, <code>F</code>, <code>O</code> et de l'état candidat", "taille de cellule, nombre de couches, dropout, bidirectionnel ou non"],
            ["GRU si utilisé", "matrices des portes update/reset et état candidat", "taille cachée, nombre de couches, dropout"],
            ["Sortie séquentielle", "projection caché → sortie et biais", "many-to-one, many-to-many, one-to-many, loss utilisée"],
            ["Entraînement", "toutes les matrices ci-dessus", "optimizer, learning rate, batch size, gradient clipping, epochs"]
          ]
        ),
        callout(
          "warn",
          "Piège classique",
          "La longueur de séquence n'est pas un paramètre appris. C'est un choix de préparation ou de modèle : combien de pas de temps le réseau voit-il avant de produire ou corriger une sortie ?"
        )
      ),

      lesson(
        "NLP : vocabulaire, embeddings et modèles de langage",
        paragraphs(
          "Dans ce cours, le NLP apparaît via la modélisation du langage, les embeddings, le Seq2Seq, l'attention et les transformeurs. Le vocabulaire exact peut varier selon les architectures, mais la séparation paramètres/hyperparamètres reste stable."
        ),
        table(
          ["Élément NLP", "Paramètres appris", "Hyperparamètres à choisir"],
          [
            ["Tokenisation", "souvent aucun poids si tokenizer fixé ; parfois tokenizer appris avant le modèle", "type de tokenizer, taille du vocabulaire, traitement des inconnus"],
            ["Embedding", "matrice d'embedding <code>|V| × d</code>", "dimension <code>d</code>, vocabulaire <code>|V|</code>, embeddings gelés ou entraînables"],
            ["RNN de langage", "matrices RNN/LSTM + projection vers vocabulaire", "taille cachée, nombre de couches, longueur de contexte"],
            ["Attention/transformeur", "matrices <code>Q</code>, <code>K</code>, <code>V</code>, projections, MLP, embeddings positionnels", "nombre de couches, nombre de têtes, dimension modèle, longueur de contexte"],
            ["Génération", "les poids du modèle ne changent pas en inférence", "température, top-k, top-p, longueur maximale, pénalité de répétition"]
          ]
        ),
        callout(
          "info",
          "Vocabulaire et taille de sortie",
          "Si le vocabulaire contient 10 000 tokens, la couche de sortie d'un modèle de langage produit typiquement 10 000 scores avant softmax. La taille du vocabulaire est donc un hyperparamètre qui influence directement le nombre de paramètres de sortie."
        )
      ),

      lesson(
        "Apprentissage par renforcement : MDP, Dyna, Q-Learning",
        paragraphs(
          "En apprentissage par renforcement, le mot « paramètre » dépend de la méthode. Dans un Q-Learning tabulaire, ce qui est appris est la table <code>Q(s,a)</code>. Dans une méthode model-based comme Dyna, on apprend aussi un modèle estimé de l'environnement. Dans un réseau profond de RL, on aurait des poids de réseau, mais ce n'est pas l'objet principal de ce cours."
        ),
        table(
          ["Méthode", "Paramètres / objets appris", "Hyperparamètres à choisir"],
          [
            ["MDP connu", "aucun si <code>T</code> et <code>R</code> sont donnés", "facteur <code>γ</code>, critère d'arrêt, horizon selon le modèle"],
            ["Value Iteration", "valeurs <code>V(s)</code> mises à jour jusqu'à convergence", "<code>γ</code>, tolérance <code>ε</code>, initialisation de <code>V</code>"],
            ["Policy Iteration", "valeur <code>Vπ</code> et stratégie <code>π</code> améliorée", "<code>γ</code>, initialisation de stratégie, critère d'arrêt"],
            ["Dyna", "modèle estimé <code>T̂</code>, <code>R̂</code> et valeurs <code>Q</code>", "<code>γ</code>, <code>α</code>, <code>ε</code>, nombre <code>k</code> de mises à jour simulées"],
            ["Q-Learning", "table <code>Q(s,a)</code>", "<code>γ</code>, learning rate <code>α</code>, exploration <code>ε</code>, decay de <code>ε</code>, épisodes, max steps"]
          ]
        ),
        table(
          ["Symbole", "Rôle", "Paramètre ou hyperparamètre ?"],
          [
            ["<code>Q(s,a)</code>", "qualité apprise d'une action dans un état", "paramètre appris en tabulaire"],
            ["<code>γ</code>", "poids du futur", "hyperparamètre"],
            ["<code>α</code>", "vitesse de correction Q", "hyperparamètre"],
            ["<code>ε</code>", "probabilité d'exploration", "hyperparamètre"],
            ["<code>r</code>", "reward observé", "signal de l'environnement, pas un paramètre"],
            ["<code>T(s,a,s')</code>", "transition du MDP", "donné dans un MDP connu, estimé dans model-based"]
          ]
        )
      ),

      lesson(
        "Fiche express pour l'oral",
        paragraphs(
          "Quand on te demande de lister les paramètres et hyperparamètres, réponds toujours dans cet ordre : ce que le modèle apprend, ce que tu choisis pour sa structure, ce que tu choisis pour l'entraînement, puis ce que tu utilises pour l'évaluer."
        ),
        code(
          "text",
          `
CNN
- appris : filtres, biais, poids FC
- choisis : kernels, filtres, stride, padding, pooling, dropout, optimizer, lr

RNN / LSTM
- appris : U, V, W, biais ; portes LSTM
- choisis : hidden size, couches, longueur de séquence, activation, BPTT, clipping

NLP
- appris : embeddings, matrices RNN/attention, projection softmax
- choisis : tokenizer, vocabulaire, embedding dim, contexte, température en génération

RL
- appris : V(s), Q(s,a), stratégie ou modèle T̂/R̂ selon la méthode
- choisis : γ, α, ε, épisodes, horizon, tolérance, k de Dyna
          `,
          "Réponse courte à mémoriser"
        ),
        callout(
          "success",
          "La formule de phrase",
          "« Les paramètres sont appris sur les données ou les interactions ; les hyperparamètres règlent la structure, l'apprentissage et l'exploration ; le test ne sert qu'à mesurer. »"
        )
      )
    ].join(""),

    checklist: [
      "Je sais distinguer paramètres appris et hyperparamètres.",
      "Je sais lister les paramètres et hyperparamètres d'un CNN.",
      "Je sais lister ceux d'un RNN et d'un LSTM.",
      "Je sais lister ceux d'un modèle NLP de langage.",
      "Je sais lister ceux d'un algorithme de RL tabulaire.",
      "Je sais expliquer pourquoi le test ne sert pas à choisir les hyperparamètres."
    ],

    quiz: [
      {
        question: "Dans une couche Conv2D, les poids du filtre sont :",
        options: [
          "des paramètres appris",
          "des hyperparamètres",
          "des métriques",
          "des rewards"
        ],
        answer: 0,
        explanation: "Les valeurs du filtre sont apprises pendant l'entraînement."
      },
      {
        question: "Dans Q-Learning tabulaire, <code>γ</code> est :",
        options: [
          "une valeur Q apprise",
          "un hyperparamètre qui pondère le futur",
          "un label supervisé",
          "une matrice d'embedding"
        ],
        answer: 1,
        explanation: "Gamma règle l'importance accordée aux récompenses futures."
      },
      {
        question: "La taille du vocabulaire en NLP est surtout :",
        options: [
          "un hyperparamètre ou choix de prétraitement",
          "un biais appris par softmax",
          "une métrique de régression",
          "une erreur TD"
        ],
        answer: 0,
        explanation: "Le vocabulaire est choisi ou appris avant l'entraînement principal, et il détermine la forme des embeddings et de la sortie."
      }
    ],

    exercises: [
      {
        title: "Classer les éléments",
        difficulty: "Facile",
        time: "10 min",
        prompt: "Classe : filtre 3x3 appris, taille de filtre, embedding matrix, dimension d'embedding, Q(s,a), gamma, epsilon, batch size, nombre de têtes d'attention.",
        deliverables: [
          "colonne paramètres appris",
          "colonne hyperparamètres",
          "une justification par famille"
        ]
      },
      {
        title: "Fiche orale complète",
        difficulty: "Intermédiaire",
        time: "20 min",
        prompt: "Prépare une réponse orale de 2 minutes qui compare CNN, RNN, NLP et RL du point de vue paramètres/hyperparamètres.",
        deliverables: [
          "réponse structurée en quatre familles",
          "au moins deux exemples par famille",
          "une phrase sur le rôle de la validation"
        ]
      }
    ],

    keywords: [
      "paramètres",
      "hyperparamètres",
      "CNN",
      "RNN",
      "LSTM",
      "NLP",
      "embedding",
      "Q-Learning",
      "gamma",
      "alpha",
      "epsilon"
    ]
  }
});
})(window);
