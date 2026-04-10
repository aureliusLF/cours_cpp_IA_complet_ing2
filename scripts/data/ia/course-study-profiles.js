(function registerCourseStudyProfiles(globalScope) {
globalScope.COURSE_STUDY_PROFILES = {
  "profondeur-motivation": {
    review: {
      expectations: [
        "Expliquer sans jargon pourquoi un réseau profond représente des concepts de plus en plus abstraits couche après couche.",
        "Citer au moins deux raisons pour lesquelles on préfère un réseau profond à un réseau très large mais peu profond.",
        "Décrire l'analogie avec le cortex visuel et ce qu'on retient des aires V1, V2, V4.",
        "Expliquer ce qu'est le vanishing gradient et pourquoi il freine les réseaux profonds mal conçus.",
        "Situer LeNet, AlexNet et ResNet dans la petite histoire du deep learning."
      ],
      commonMistakes: [
        "Confondre « réseau profond » avec « réseau avec beaucoup de neurones » — la profondeur est le nombre de couches, pas leur largeur.",
        "Penser que la profondeur résout tout : sans ReLU, sans initialisation correcte, sans partage de poids, on n'avance pas.",
        "Oublier que le vanishing gradient est d'abord un problème d'activation (sigmoïde qui sature) avant d'être un problème d'architecture.",
        "Réduire le cortex visuel à « quelque chose qui ressemble à un CNN » : c'est une inspiration, pas une copie."
      ],
      oralCheck: "Explique en deux minutes, sans slide, pourquoi on dit que les couches successives d'un réseau profond construisent des représentations « de plus en plus abstraites ». Donne au moins un exemple concret pour les pixels → concepts."
    },
    assistant: {
      focus: "Donner à l'étudiant des images mentales solides : niveaux d'abstraction, cône du champ récepteur, courbe du vanishing gradient. Peu de maths, beaucoup d'intuition.",
      mustInclude: [
        "Au moins un exercice qui demande de nommer les niveaux d'abstraction d'un réseau face à une image.",
        "Au moins un exercice qui fait réfléchir au compromis largeur / profondeur sur un exemple chiffré.",
        "Une question ouverte sur « pourquoi ça a marché à partir de 2012 et pas avant »."
      ],
      avoid: [
        "Pas de formules de rétropropagation à ce stade : on motive, on ne dérive pas.",
        "Ne pas aborder les variantes de ReLU en détail — elles arrivent au chapitre 3."
      ]
    }
  },

  "convolution-filtres": {
    review: {
      expectations: [
        "Poser à la main le calcul d'une convolution 3 × 3 sur une matrice 5 × 5 et retrouver la taille de sortie avec la formule <code>(n + 2p − f) / s + 1</code>.",
        "Expliquer ce que fait le <em>stride</em> et ce que fait le <em>padding</em>, et dire ce qui change sur la taille de sortie dans chaque cas.",
        "Justifier le partage de poids en chiffrant le gain par rapport à une couche <em>fully connected</em> équivalente.",
        "Décrire ce qu'est le <em>champ récepteur</em> d'un neurone d'une couche profonde et comment il grandit avec l'empilement.",
        "Expliquer pourquoi une couche de convolution produit un volume de <em>feature maps</em> et pas juste une image 2D."
      ],
      commonMistakes: [
        "Confondre la taille du filtre, le stride et la taille de la fenêtre de pooling — trois notions distinctes.",
        "Oublier le <code>+ 2p</code> dans la formule de taille de sortie quand il y a du padding.",
        "Traiter une couche Conv comme un tableau 2D alors que c'est un volume (hauteur × largeur × nombre de filtres).",
        "Confondre partage de poids et connexions locales : ce sont deux idées distinctes qui se combinent.",
        "Calculer le champ récepteur couche par couche sans se rendre compte qu'il croît en cascade."
      ],
      oralCheck: "On te donne une image 32 × 32 × 3 et une couche Conv avec 16 filtres 5 × 5, stride = 1, padding = 2. Donne la taille de sortie et le nombre de paramètres de la couche. Puis explique ce qui change si on passe à stride = 2."
    },
    assistant: {
      focus: "Ancrer chaque hyperparamètre (taille de filtre, stride, padding) sur un exemple chiffré où l'étudiant recalcule tout à la main.",
      mustInclude: [
        "Au moins un exercice où l'étudiant pose à la main le calcul d'une convolution sur une petite matrice.",
        "Au moins un exercice qui fait calculer la taille de sortie avec au moins deux valeurs de stride ou de padding différentes.",
        "Au moins un exercice qui compare le nombre de paramètres entre FC et Conv sur une même image."
      ],
      avoid: [
        "Éviter les dérivations mathématiques lourdes : on veut comprendre ce que fait l'opération, pas démontrer ses propriétés.",
        "Pas de rétropropagation à travers la convolution à ce stade — ça vient au chapitre 4."
      ]
    }
  },

  "pooling-activations-regularisation": {
    review: {
      expectations: [
        "Calculer la sortie d'un max-pooling 2 × 2 sur une feature map donnée.",
        "Expliquer le rôle du pooling : réduire la taille spatiale et introduire une petite invariance par translation.",
        "Justifier l'usage de ReLU à la place de la sigmoïde et nommer au moins deux variantes (Leaky, ELU) en expliquant leur motivation.",
        "Expliquer le dropout : ce qui se passe pendant l'entraînement, et ce qui se passe à l'inférence.",
        "Décrire en une phrase ce que fait la batch normalization et pourquoi elle stabilise l'entraînement."
      ],
      commonMistakes: [
        "Confondre pooling et convolution avec stride — les deux réduisent la taille mais par des mécanismes différents.",
        "Oublier que le dropout ne s'active qu'en mode entraînement et pas à l'inférence.",
        "Penser que ReLU résout tout : un neurone ReLU peut « mourir » s'il ne s'active plus jamais.",
        "Mettre du dropout partout au hasard, sans réfléchir à son emplacement (plutôt après les FC ou les grosses couches)."
      ],
      oralCheck: "Reprends la formule de ReLU, dessine sa courbe, puis explique en une phrase pourquoi Leaky ReLU existe. Enfin, décris ce que fait le dropout pendant une passe d'entraînement avec p = 0.5."
    },
    assistant: {
      focus: "Faire la différence entre ce qui résume l'information (pooling), ce qui non-linéarise (activations) et ce qui régularise (dropout, batch norm). Chaque brique a un rôle précis.",
      mustInclude: [
        "Au moins un exercice de max-pooling à la main sur une petite feature map.",
        "Au moins un exercice qui demande de choisir la bonne activation dans un contexte donné (couche cachée, sortie, classification).",
        "Au moins un exercice qui justifie où placer un dropout dans un petit ConvNet."
      ],
      avoid: [
        "Ne pas démontrer mathématiquement la régularisation implicite du dropout — on reste au niveau de l'intuition.",
        "Éviter les détails d'implémentation de la batch norm (moyennes mobiles, etc.) : retenir l'idée et quand l'utiliser."
      ]
    }
  },

  "architecture-entrainement": {
    review: {
      expectations: [
        "Décrire et dessiner le pipeline typique <code>Input → (Conv → ReLU → Pool) × n → FC → Softmax</code>.",
        "Énumérer les hyperparamètres à fixer avant d'entraîner un ConvNet (taille des filtres, stride, padding, pooling, dropout, optimiseur, taux d'apprentissage).",
        "Expliquer l'idée de la rétropropagation en une phrase et citer la règle de dérivation en chaîne.",
        "Nommer au moins deux optimiseurs modernes (Adam, RMSProp) et dire ce qu'ils apportent par rapport à la SGD de base.",
        "Lire une courbe train/val et repérer un sur-apprentissage ou un sous-apprentissage.",
        "Citer les métriques de base en classification (accuracy, précision, rappel, matrice de confusion) et dire quand l'accuracy est trompeuse."
      ],
      commonMistakes: [
        "Oublier qu'un optimiseur adaptatif ne règle pas un taux d'apprentissage mal choisi : il le rend seulement moins critique.",
        "Confondre accuracy et F1 sur des classes déséquilibrées.",
        "Penser qu'un modèle qui fait 99 % en train généralise bien — c'est souvent l'inverse.",
        "Arrêter l'early stopping trop tôt sur une courbe bruitée (oublier la tolérance / patience)."
      ],
      oralCheck: "Décris le cycle d'un mini-batch de bout en bout : forward pass, calcul de la perte, rétropropagation, mise à jour par l'optimiseur. Puis dis ce que tu surveilles sur les courbes train/val pour décider d'arrêter."
    },
    assistant: {
      focus: "Relier les briques (Conv, Pool, ReLU, Dropout) en un modèle entraînable et donner à l'étudiant les réflexes de diagnostic pendant et après l'entraînement.",
      mustInclude: [
        "Au moins un exercice qui demande de lire une architecture PyTorch/Keras et de retrouver les tailles à chaque étape.",
        "Au moins un exercice de diagnostic sur une courbe train/val.",
        "Au moins un exercice qui fait choisir une métrique adaptée à un problème déséquilibré."
      ],
      avoid: [
        "Ne pas demander de dérivations complètes de la rétropropagation — on veut l'intuition et la règle de chaîne.",
        "Pas de déploiement en production, pas d'optimisation GPU bas niveau : on reste sur la démarche scientifique."
      ]
    }
  }
};
})(window);
