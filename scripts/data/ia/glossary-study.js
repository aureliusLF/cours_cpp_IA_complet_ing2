(function initialiseIaGlossaryStudy(globalScope) {
  const { normalise, slugify } = globalScope.CourseAppStrings || {};
  const figures = globalScope.IA_FIGURES || {};

  // Raccourci : enveloppe un SVG brut dans une figure avec légende.
  function visual(svgKey, caption) {
    const body = figures[svgKey];
    if (!body) {
      return "";
    }
    return `
      <figure class="figure figure--tight">
        <div class="figure__body">${body}</div>
        ${caption ? `<figcaption class="figure__caption">${caption}</figcaption>` : ""}
      </figure>
    `;
  }

  // Overrides par terme : pour les concepts qui ont un schéma dédié.
  const termOverrides = {
    "Apprentissage profond": {
      example: "Plusieurs couches successives transforment les pixels bruts en concepts reconnaissables (« voiture », « chat »).",
      visual: visual("featureHierarchy", "Pixels → motifs → parties → concept.")
    },
    "Biais": {
      example: "Sans biais, la sortie d'un neurone reste toujours nulle quand l'entrée est nulle — le biais permet de décaler la frontière de décision.",
      visual: ""
    },
    "Carte de caractéristiques": {
      example: "Quand on applique un filtre « détecteur de bord horizontal » à une image, la carte résultante est allumée là où il y a un bord horizontal.",
      visual: visual("convolutionSlide", "Une carte de caractéristiques = la sortie d'un filtre appliqué partout.")
    },
    "Champ récepteur": {
      example: "Un neurone de la 3ᵉ couche « voit » une zone 7 × 7 de l'image originale, même si son filtre local ne fait que 3 × 3.",
      visual: visual("receptiveFieldGrowth", "Le champ récepteur grandit à chaque couche empilée.")
    },
    "Convolution": {
      example: "On fait glisser un filtre 3 × 3 sur une image et on calcule, à chaque position, la somme pondérée des pixels recouverts.",
      visual: visual("convolutionSlide", "Le filtre glisse et produit une sortie allumée là où le motif est présent.")
    },
    "Descente de gradient": {
      example: "À chaque itération, on ajuste les poids d'un petit pas dans la direction qui diminue le plus la perte — comme une bille qui roule vers le fond d'une vallée.",
      visual: visual("gradientDescent2D", "Descente itérative vers le minimum de la perte.")
    },
    "Dropout": {
      example: "Pendant l'entraînement, on éteint aléatoirement 50 % des neurones d'une couche à chaque passe — le réseau apprend à ne pas dépendre d'un seul chemin.",
      visual: visual("dropoutExample", "À chaque pas, des neurones différents sont masqués.")
    },
    "Filtre": {
      example: "Un petit tableau 3 × 3 de poids appris : ses valeurs définissent le motif que ce filtre cherche dans l'image.",
      visual: visual("convolutionNumeric", "Un filtre 3 × 3 et son action sur une fenêtre de l'entrée.")
    },
    "Fonction d'activation": {
      example: "Sans activation non-linéaire, empiler 10 couches linéaires reviendrait à en avoir une seule : la non-linéarité est indispensable.",
      visual: visual("sigmoidTanhReluCompare", "Quelques activations courantes et leur forme.")
    },
    "Fully connected": {
      example: "La dernière couche d'un ConvNet de classification est souvent un FC qui transforme les features extraites en probabilités de classes.",
      visual: ""
    },
    "Gradient": {
      example: "Le gradient d'une perte par rapport à un poids indique : « si j'augmente ce poids un peu, de combien la perte change-t-elle ? »",
      visual: ""
    },
    "Hyperparamètre": {
      example: "Le taux d'apprentissage, la taille du filtre, ou le nombre de couches sont des hyperparamètres : on les choisit à la main avant l'entraînement.",
      visual: ""
    },
    "Max-pooling": {
      example: "Sur une carte 4 × 4, on prend le maximum de chaque bloc 2 × 2 pour obtenir une carte 2 × 2 plus robuste aux petits décalages.",
      visual: visual("maxPoolExample", "Chaque quadrant 2 × 2 garde uniquement sa valeur maximale.")
    },
    "Optimiseur": {
      example: "Adam ajuste automatiquement la taille du pas pour chaque paramètre, ce qui évite de régler un taux d'apprentissage unique pour tous.",
      visual: ""
    },
    "Partage de poids": {
      example: "Un même filtre 5 × 5 (25 poids) est appliqué à toutes les positions d'une image 224 × 224 — au lieu de 50 176 × 25 poids indépendants.",
      visual: visual("weightSharingVisualisation", "Un seul filtre réutilisé partout dans l'image.")
    },
    "Pooling": {
      example: "Le pooling résume une région — par exemple 2 × 2 — en une seule valeur (max ou moyenne), réduisant la taille de la carte.",
      visual: visual("maxPoolExample", "Max-pooling : on ne garde que le maximum de chaque bloc.")
    },
    "ReLU": {
      example: "ReLU(x) = max(0, x) : les valeurs négatives deviennent 0, les positives passent telles quelles. Simple, rapide, et évite le vanishing gradient côté positif.",
      visual: visual("reluCurve", "La fonction ReLU : rampe linéaire à partir de 0.")
    },
    "Réseau convolutif": {
      example: "Image → Conv → ReLU → Pool → Conv → ReLU → Pool → FC → Softmax. Le tenseur rapetisse en hauteur/largeur et s'épaissit en canaux.",
      visual: visual("convnetPipeline", "Pipeline typique d'un ConvNet de classification.")
    },
    "Rétropropagation": {
      example: "On calcule la perte en sortie, puis on « remonte » le réseau couche par couche pour savoir de combien chaque poids doit bouger.",
      visual: ""
    },
    "Sur-apprentissage": {
      example: "Un modèle qui atteint 99 % sur le train mais 70 % sur le test : il a mémorisé les exemples au lieu d'apprendre à généraliser.",
      visual: ""
    },
    "Vanishing gradient": {
      example: "Dans un réseau profond mal conçu, le gradient passe de 1 à 0,01 à 0,0001 en remontant les couches — les premières couches n'apprennent plus rien.",
      visual: visual("vanishingGradientHeatmap", "Le gradient s'évapore dans les couches profondes.")
    },
    "Stride": {
      example: "Un stride de 2 fait sauter le filtre de 2 cases à chaque déplacement, divisant la taille de sortie par 2 — une alternative au pooling pour réduire la dimension.",
      visual: visual("strideExample", "Stride = 1 vs stride = 2 : le pas change tout.")
    },
    "Padding": {
      example: "Ajouter une bordure de zéros autour de l'image permet au filtre de traiter aussi les bords — sans padding, l'image rétrécit à chaque convolution.",
      visual: visual("paddingExample", "Avec padding = 1, une entrée 4 × 4 devient 6 × 6.")
    },
    "Taille de sortie": {
      example: "Pour une entrée n, un filtre f, un padding p et un stride s : taille de sortie = (n + 2p − f) / s + 1. Exemple : n=32, f=5, p=2, s=1 → 32.",
      visual: ""
    },
    "Batch normalization": {
      example: "On normalise les activations d'une couche (moyenne 0, variance 1) avant de les passer à la suivante — l'entraînement devient plus stable et rapide.",
      visual: ""
    },
    "Leaky ReLU": {
      example: "Au lieu de tuer complètement les valeurs négatives, Leaky ReLU les laisse passer avec un petit coefficient (par ex. 0.01·x) pour éviter les « neurones morts ».",
      visual: visual("sigmoidTanhReluCompare", "Leaky ReLU a une petite pente pour x < 0.")
    },
    "Softmax": {
      example: "Softmax transforme un vecteur de scores en distribution de probabilités : chaque valeur est entre 0 et 1, et leur somme vaut 1.",
      visual: ""
    },
    "Entropie croisée": {
      example: "Fonction de perte standard en classification : elle pénalise fortement un modèle qui met une faible probabilité sur la bonne classe.",
      visual: ""
    },
    "Accuracy": {
      example: "Proportion d'exemples correctement classés. Simple à lire, mais trompeuse si les classes sont déséquilibrées.",
      visual: ""
    },
    "Matrice de confusion": {
      example: "Un tableau qui montre, pour chaque vraie classe, combien d'exemples ont été prédits dans chaque classe — on y repère les confusions systématiques.",
      visual: ""
    },
    "Early stopping": {
      example: "On arrête l'entraînement quand la perte sur l'ensemble de validation cesse de diminuer — pour éviter le sur-apprentissage.",
      visual: ""
    }
  };

  // Fallbacks par tag, quand un terme n'a pas d'override dédié.
  const tagFallbacks = [
    {
      test: (tags) => tags.includes("operation") || tags.includes("convolution"),
      example: "L'opération s'applique localement à l'entrée pour en extraire une caractéristique utile.",
      visual: visual("convolutionSlide", "Opération locale appliquée sur toute l'entrée.")
    },
    {
      test: (tags) => tags.includes("convnet") || tags.includes("architecture"),
      example: "Ce bloc prend place dans l'empilement d'un réseau convolutif entre les couches de convolution et de pooling.",
      visual: visual("convnetPipeline", "Pipeline typique d'un ConvNet.")
    },
    {
      test: (tags) => tags.includes("activation"),
      example: "Cette fonction introduit la non-linéarité qui permet au réseau d'apprendre des relations complexes.",
      visual: visual("sigmoidTanhReluCompare", "Activations courantes et leur allure.")
    },
    {
      test: (tags) => tags.includes("apprentissage") || tags.includes("optimisation") || tags.includes("gradient"),
      example: "Le concept intervient pendant l'entraînement, quand on ajuste les poids pour faire diminuer la perte.",
      visual: visual("gradientDescent2D", "Descente de gradient : on suit la pente.")
    },
    {
      test: (tags) => tags.includes("regularisation") || tags.includes("generalisation"),
      example: "Technique qui aide le réseau à mieux généraliser au-delà des exemples vus pendant l'entraînement.",
      visual: visual("dropoutExample", "Le dropout est un exemple typique de régularisation.")
    },
    {
      test: (tags) => tags.includes("neurone") || tags.includes("parametre"),
      example: "Paramètre interne appris par le réseau pendant l'entraînement, couche après couche.",
      visual: ""
    },
    {
      test: (tags) => tags.includes("diagnostic") || tags.includes("metrique") || tags.includes("evaluation"),
      example: "Ce critère sert à évaluer la qualité du modèle après entraînement — on le suit sur le jeu de validation.",
      visual: ""
    },
    {
      test: () => true,
      example: "Cette notion joue un rôle clé dans le raisonnement sur le modèle ou son entraînement.",
      visual: ""
    }
  ];

  function getFallback(tags) {
    return tagFallbacks.find((entry) => entry.test(tags)) || tagFallbacks[tagFallbacks.length - 1];
  }

  function buildGlossaryEntries(rawGlossary) {
    return rawGlossary.map((entry) => {
      const override = termOverrides[entry.term];
      const fallback = getFallback(entry.tags);
      const example = (override && override.example) || fallback.example;
      const visualHtml = (override && override.visual !== undefined) ? override.visual : fallback.visual;

      return Object.assign({}, entry, {
        id: entry.id || slugify(entry.term),
        example,
        visual: visualHtml || "",
        codeExample: null,
        searchText: normalise([
          entry.term,
          entry.text,
          Array.isArray(entry.aliases) ? entry.aliases.join(" ") : "",
          entry.tags.join(" "),
          example
        ].join(" "))
      });
    });
  }

  globalScope.CourseAppGlossaryStudy = {
    buildGlossaryEntries
  };
})(window);
