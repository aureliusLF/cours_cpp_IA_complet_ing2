(function registerCourseRoadmap(globalScope) {
const registry = globalScope.CourseDataRegistry;

if (!registry) {
  console.error("CourseDataRegistry est indisponible. Vérifie que scripts/data/course-runtime.js est chargé avant les données du cours.");
  return;
}

registry.setRoadmap([
  {
    index: "00A",
    title: "Bases ML et généralisation",
    text: "Installer les réflexes indispensables avant le deep learning : données, splits, généralisation, overfitting, biais/variance et fuites de données.",
    bullets: [
      "features, labels, classification, régression",
      "train / validation / test",
      "overfitting, underfitting, data leakage"
    ]
  },
  {
    index: "00B",
    title: "Évaluation et métriques",
    text: "Choisir une méthode d'évaluation et une métrique adaptée au problème avant de comparer les modèles.",
    bullets: [
      "cross-validation et stratification",
      "matrice de confusion, precision, recall, F1",
      "ROC-AUC, PR-AUC, MAE, RMSE, R²"
    ]
  },
  {
    index: "00C",
    title: "Fiche paramètres",
    text: "Récapituler ce qui est appris et ce qui est choisi pour les modèles étudiés : CNN, RNN, NLP et apprentissage par renforcement.",
    bullets: [
      "paramètres appris vs hyperparamètres",
      "CNN, RNN, LSTM, NLP",
      "MDP, Dyna, Q-Learning"
    ]
  },
  {
    index: "01",
    title: "Fondations du deep learning",
    text: "Comprendre ce qu'apporte la profondeur, d'ou viennent les niveaux d'abstraction, et pourquoi le deep learning a decolle.",
    bullets: [
      "profondeur, largeur et abstraction",
      "cortex visuel et vanishing gradient",
      "jalons historiques du deep learning"
    ]
  },
  {
    index: "02",
    title: "Convolution et filtres",
    text: "Comprendre comment un filtre glisse, calcule une somme ponderee, puis construit des feature maps.",
    bullets: [
      "formule de convolution",
      "stride, padding, taille de sortie",
      "partage de poids et champ recepteur"
    ]
  },
  {
    index: "03",
    title: "Pooling, activations, régularisation",
    text: "Ajouter les briques qui rendent un ConvNet entrainable et plus robuste.",
    bullets: [
      "max-pooling et average-pooling",
      "ReLU et ses variantes",
      "dropout et batch normalization"
    ]
  },
  {
    index: "04",
    title: "Assembler et entraîner un ConvNet",
    text: "Passer du bloc local a une architecture complete, puis la diagnostiquer proprement.",
    bullets: [
      "pipeline Keras et preparation de donnees",
      "optimiseurs, courbes train/val",
      "metriques et matrice de confusion"
    ]
  },
  {
    index: "05",
    title: "TD corrigés ConvNet",
    text: "Transformer les premiers TD en reflexes de pratique : NumPy, MNIST, reseaux Keras, CIFAR-10.",
    bullets: [
      "corrections guidées des TD",
      "workflow add/compile/fit/evaluate",
      "diagnostic par matrice de confusion"
    ]
  },
  {
    index: "06",
    title: "Pourquoi les RNN",
    text: "Comprendre pourquoi les reseaux feedforward sont mal a l'aise avec les sequences, puis introduire la recurrence.",
    bullets: [
      "entrees et sorties de taille variable",
      "cycles et etat cache",
      "reseaux de Jordan et d'Elman"
    ]
  },
  {
    index: "07",
    title: "RNN formel et déroulage",
    text: "Ecrire proprement les equations d'un RNN, lire les matrices U, V, W, puis le deplier dans le temps.",
    bullets: [
      "etat cache et sortie a chaque temps t",
      "dimensions des matrices",
      "poids partages dans le temps"
    ]
  },
  {
    index: "08",
    title: "Séquences et BPTT",
    text: "Traiter des problemes many-to-many, many-to-one, one-to-many, puis apprendre par retropropagation dans le temps.",
    bullets: [
      "Seq2Seq et modelisation du langage",
      "softmax sur le mot suivant",
      "perte totale et BPTT"
    ]
  },
  {
    index: "09",
    title: "LSTM, attention, transformeurs",
    text: "Comprendre les limites des RNN standards puis la transition vers les architectures modernes.",
    bullets: [
      "memoire courte et gradients instables",
      "portes du LSTM et etat de cellule",
      "encodeur-decodeur, attention, transformeurs"
    ]
  },
  {
    index: "10",
    title: "TD corrigés RNN",
    text: "Passer des slides aux gestes concrets : RNN Python, prédiction de série temporelle et LSTM pour générer du texte.",
    bullets: [
      "RNN minimal avec tanh et softmax",
      "MSFT avec fenêtres glissantes et Keras",
      "génération caractère par caractère avec LSTM"
    ]
  },
  {
    index: "11",
    title: "Fondations de l'AR",
    text: "Introduire la boucle agent-environnement, les rewards, la stratégie et les modèles d'optimalité.",
    bullets: [
      "essai-erreur, action, reward",
      "observabilité totale et stationnarité",
      "horizon fini, actualisé, reward moyen"
    ]
  },
  {
    index: "12",
    title: "MDP et Bellman",
    text: "Formaliser les états, transitions, récompenses et valeurs avec les processus de décision markoviens.",
    bullets: [
      "propriété de Markov",
      "matrice de transition",
      "fonction valeur et équation de Bellman"
    ]
  },
  {
    index: "13",
    title: "Stratégies optimales",
    text: "Calculer la valeur optimale et la stratégie optimale quand le modèle du MDP est connu.",
    bullets: [
      "policy déterministe ou stochastique",
      "Bellman d'optimalité",
      "Value Iteration et Policy Iteration"
    ]
  },
  {
    index: "14",
    title: "Dyna et Q-Learning",
    text: "Passer au modèle inconnu : méthodes model-based, model-free, Dyna et Q-Learning.",
    bullets: [
      "exploration vs exploitation",
      "mise à jour Q et erreur TD",
      "conditions de convergence"
    ]
  },
  {
    index: "15",
    title: "Introduction au NLP",
    text: "Situer le traitement automatique du langage naturel dans l'IA : tâches, documents, méthodes, approches et niveaux d'analyse.",
    bullets: [
      "langage naturel vs langage formel",
      "symbolique, statistique, connexionniste",
      "lexical, syntaxique, sémantique"
    ]
  },
  {
    index: "16",
    title: "Analyse lexicale",
    text: "Transformer un texte brut en unités exploitables : tokens, POS tags, stems, lemmes et motifs regex.",
    bullets: [
      "tokenisation et POS tagging",
      "stemming vs lemmatisation",
      "regex Twitter et URL"
    ]
  },
  {
    index: "17",
    title: "Analyse syntaxique",
    text: "Formaliser la structure des phrases avec des grammaires hors contexte, des parsers et des arbres d'analyse.",
    bullets: [
      "terminaux et non-terminaux",
      "règles de production CFG",
      "parse trees avec NLTK"
    ]
  },
  {
    index: "18",
    title: "Sémantique et sentiments",
    text: "Comprendre le sens : ambiguïtés, relations lexicales, WordNet, compositionnalité et classification de sentiments.",
    bullets: [
      "ambiguïtés lexicale, syntaxique, référentielle",
      "WordNet et synsets",
      "classifieur bayésien de tweets"
    ]
  }
]);
})(window);
