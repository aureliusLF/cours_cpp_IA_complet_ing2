(function registerCourseGlossary(globalScope) {
const registry = globalScope.CourseDataRegistry;

if (!registry) {
  console.error("CourseDataRegistry est indisponible. Vérifie que scripts/data/course-runtime.js est chargé avant les données du cours.");
  return;
}

// Tags utilisés :
// - fondations, "deep learning", neurone, parametre  → famille "Fondations du deep learning"
// - activation, convolution, operation, filtre, pooling → famille "Opérations de base"
// - convnet, architecture                           → famille "Couches & architectures"
// - apprentissage, optimisation, gradient            → famille "Apprentissage & optimisation"
// - regularisation, generalisation                   → famille "Régularisation & généralisation"
// - diagnostic, metrique, evaluation                  → famille "Évaluation & diagnostics"

registry.setGlossary([
  {
    term: "Apprentissage profond",
    text: "Famille de méthodes d'apprentissage statistique reposant sur des réseaux de neurones à plusieurs couches, capables d'apprendre des représentations hiérarchiques des données.",
    aliases: ["deep learning"],
    tags: ["fondations", "deep learning"]
  },
  {
    term: "Biais",
    text: "Paramètre scalaire ajouté à la somme pondérée d'un neurone avant l'application de la fonction d'activation. Il permet de décaler la frontière de décision.",
    tags: ["neurone", "parametre"]
  },
  {
    term: "Carte de caractéristiques",
    text: "Tableau 2D produit par un filtre appliqué à la couche d'entrée d'un ConvNet. Chaque case indique la présence locale du motif détecté par le filtre.",
    aliases: ["feature map", "feature maps", "cartes de caractéristiques"],
    tags: ["convnet", "operation"]
  },
  {
    term: "Champ récepteur",
    text: "Zone de l'entrée qui influence réellement la sortie d'un neurone d'une couche donnée. Il grandit couche après couche, ce qui permet aux neurones profonds de voir une zone plus large.",
    aliases: ["receptive field"],
    tags: ["convnet", "architecture"]
  },
  {
    term: "Convolution",
    text: "Opération qui fait glisser un petit filtre sur une entrée 2D (ou 3D) et calcule en chaque position la somme pondérée des valeurs recouvertes. C'est la brique de base d'un ConvNet.",
    tags: ["convolution", "operation"]
  },
  {
    term: "Descente de gradient",
    text: "Algorithme d'optimisation qui ajuste les paramètres d'un modèle en suivant l'opposé du gradient de la fonction de perte. Les variantes modernes (SGD, Adam) changent la manière de calculer ce pas.",
    aliases: ["gradient descent"],
    tags: ["apprentissage", "optimisation", "gradient"]
  },
  {
    term: "Dropout",
    text: "Technique de régularisation qui met à zéro une fraction aléatoire des sorties d'une couche pendant l'entraînement. Elle force le réseau à ne pas dépendre de neurones particuliers.",
    tags: ["regularisation", "generalisation"]
  },
  {
    term: "Filtre",
    text: "Petit tableau de poids appris pendant l'entraînement, utilisé par une couche de convolution pour détecter un motif local. Aussi appelé <em>kernel</em> ou <em>template</em>.",
    aliases: ["kernel", "noyau", "template", "filtres"],
    tags: ["filtre", "convolution", "operation"]
  },
  {
    term: "Fonction d'activation",
    text: "Fonction non-linéaire appliquée à la sortie d'un neurone (ReLU, sigmoïde, tanh, etc.). Sans elle, un empilement de couches se réduirait à une simple combinaison linéaire.",
    aliases: ["activation"],
    tags: ["activation", "neurone"]
  },
  {
    term: "Fully connected",
    text: "Couche dans laquelle chaque neurone est relié à tous les neurones de la couche précédente. C'est la structure classique des réseaux de neurones, et le bloc de décision final des ConvNet.",
    aliases: ["FC", "couche dense", "dense", "totalement connectée", "entièrement connectée"],
    tags: ["architecture", "convnet"]
  },
  {
    term: "Gradient",
    text: "Vecteur des dérivées partielles d'une fonction de perte par rapport aux paramètres du modèle. Il indique la direction dans laquelle il faut bouger les poids pour faire diminuer l'erreur.",
    tags: ["gradient", "apprentissage"]
  },
  {
    term: "Hyperparamètre",
    text: "Paramètre de configuration du modèle ou de l'entraînement qui n'est pas appris automatiquement (taille du filtre, nombre de couches, taux d'apprentissage, etc.).",
    aliases: ["hyperparamètres"],
    tags: ["apprentissage", "optimisation"]
  },
  {
    term: "Max-pooling",
    text: "Type de pooling qui conserve, pour chaque bloc p × p, la valeur maximale. C'est la variante la plus courante car elle préserve les activations fortes tout en réduisant la taille.",
    aliases: ["max pooling"],
    tags: ["pooling", "operation", "convnet"]
  },
  {
    term: "Optimiseur",
    text: "Algorithme qui décide comment utiliser le gradient pour mettre à jour les poids. Adam, RMSProp et Adagrad adaptent le taux d'apprentissage par paramètre pour accélérer la convergence.",
    aliases: ["optimiseurs", "optimizer"],
    tags: ["optimisation", "apprentissage"]
  },
  {
    term: "Partage de poids",
    text: "Principe selon lequel un même filtre (avec ses poids et son biais) est réutilisé à toutes les positions spatiales d'une couche. Cela réduit drastiquement le nombre de paramètres.",
    aliases: ["weight sharing"],
    tags: ["convnet", "architecture"]
  },
  {
    term: "Pooling",
    text: "Opération qui résume l'information d'un bloc de voisins spatiaux (par exemple un carré 2 × 2) en une seule valeur. Elle réduit la taille des feature maps et rend le réseau plus robuste aux petits décalages.",
    tags: ["pooling", "operation"]
  },
  {
    term: "ReLU",
    text: "Fonction d'activation définie par <code>max(0, x)</code>. Elle remplace les valeurs négatives par zéro, ce qui accélère l'apprentissage en évitant le problème du gradient qui s'atténue pour les valeurs positives.",
    aliases: ["rectified linear unit"],
    tags: ["activation"]
  },
  {
    term: "Réseau convolutif",
    text: "Réseau profond spécialisé pour les données à structure spatiale (images, signaux), combinant des couches de convolution, de pooling et enfin quelques couches entièrement connectées pour la décision finale.",
    aliases: ["ConvNet", "CNN", "réseaux convolutifs"],
    tags: ["convnet", "architecture"]
  },
  {
    term: "Rétropropagation",
    text: "Algorithme qui propage l'erreur de la sortie du réseau vers l'entrée en appliquant la règle de dérivation en chaîne, pour calculer le gradient de la perte par rapport à chaque paramètre.",
    aliases: ["backpropagation", "rétropropagation du gradient"],
    tags: ["apprentissage", "gradient"]
  },
  {
    term: "Sur-apprentissage",
    text: "Situation où un modèle apprend trop précisément les exemples d'entraînement, au point de mal généraliser à de nouvelles données. Le dropout et d'autres techniques de régularisation servent à le limiter.",
    aliases: ["overfitting"],
    tags: ["generalisation", "regularisation", "diagnostic"]
  },
  {
    term: "Vanishing gradient",
    text: "Phénomène où le gradient devient très petit dans les couches profondes, ce qui freine ou empêche l'apprentissage. ReLU et d'autres choix d'activation/architecture aident à l'atténuer.",
    aliases: ["gradient qui s'atténue", "disparition du gradient"],
    tags: ["gradient", "apprentissage"]
  },
  {
    term: "Stride",
    text: "Pas avec lequel le filtre se déplace à chaque étape de la convolution. Un stride de 2 saute une case sur deux et divise la taille de sortie par 2.",
    aliases: ["pas"],
    tags: ["convolution", "operation"]
  },
  {
    term: "Padding",
    text: "Bordure de zéros (ou d'autres valeurs) ajoutée autour de l'entrée avant de la convoler. Un padding bien choisi permet de conserver la taille de sortie ou de traiter correctement les bords.",
    aliases: ["padding zero"],
    tags: ["convolution", "operation"]
  },
  {
    term: "Taille de sortie",
    text: "Taille spatiale d'une feature map après convolution. Pour une entrée <code>n</code>, un filtre <code>f</code>, un padding <code>p</code> et un stride <code>s</code>, elle vaut <code>(n + 2p − f) / s + 1</code>.",
    tags: ["convolution", "architecture"]
  },
  {
    term: "Batch normalization",
    text: "Technique qui normalise les activations d'une couche (moyenne nulle, variance unitaire) avant la couche suivante. Elle stabilise et accélère l'entraînement, surtout pour les réseaux profonds.",
    aliases: ["batch norm", "BN"],
    tags: ["regularisation", "apprentissage"]
  },
  {
    term: "Leaky ReLU",
    text: "Variante de ReLU qui laisse passer une petite fraction (par exemple 0.01) des valeurs négatives, afin d'éviter les « neurones morts » qui ne s'activent plus jamais.",
    aliases: ["leaky relu"],
    tags: ["activation"]
  },
  {
    term: "Softmax",
    text: "Fonction qui transforme un vecteur de scores en une distribution de probabilités (valeurs entre 0 et 1, somme égale à 1). Elle est utilisée à la dernière couche d'un classifieur multi-classes.",
    tags: ["activation", "architecture"]
  },
  {
    term: "Entropie croisée",
    text: "Fonction de perte standard en classification. Elle compare la distribution prédite par le modèle à la distribution cible (one-hot) et pénalise fortement les erreurs confiantes.",
    aliases: ["cross-entropy", "cross entropy"],
    tags: ["apprentissage", "metrique"]
  },
  {
    term: "Accuracy",
    text: "Proportion d'exemples correctement classés par le modèle. Métrique simple, mais peu informative quand les classes sont déséquilibrées.",
    aliases: ["taux de bonne classification", "exactitude"],
    tags: ["metrique", "evaluation", "diagnostic"]
  },
  {
    term: "Matrice de confusion",
    text: "Tableau croisant les classes réelles et les classes prédites. Elle permet de repérer les confusions systématiques entre classes proches.",
    aliases: ["confusion matrix"],
    tags: ["metrique", "evaluation", "diagnostic"]
  },
  {
    term: "Early stopping",
    text: "Technique qui interrompt l'entraînement dès que la perte sur l'ensemble de validation cesse de diminuer, pour éviter le sur-apprentissage.",
    aliases: ["arrêt précoce"],
    tags: ["regularisation", "generalisation", "diagnostic"]
  }
]);
})(window);
