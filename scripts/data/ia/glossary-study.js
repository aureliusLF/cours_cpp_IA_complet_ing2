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
    "Machine Learning": {
      example: "On donne au modèle des exemples passés avec leurs variables et parfois leurs réponses, puis on vérifie s'il prédit correctement sur de nouveaux cas.",
      visual: visual("mlTrainValidationTestSplit", "Le machine learning se juge sur des données gardées hors entraînement.")
    },
    "Dataset": {
      example: "Un tableau de maisons peut contenir surface, ville et nombre de pièces comme features, puis le prix comme label.",
      visual: visual("mlTrainValidationTestSplit", "Un dataset se découpe avant d'entraîner et de comparer les modèles.")
    },
    "Feature": {
      example: "Pour prédire un prix immobilier, la surface et le nombre de pièces sont des features ; le prix à prédire est le label.",
      visual: visual("mlTrainValidationTestSplit", "Les features alimentent le modèle pendant l'entraînement.")
    },
    "Label": {
      example: "Dans un dataset de spam, le texte du mail est l'entrée et le label indique spam ou non-spam.",
      visual: visual("mlTrainValidationTestSplit", "Le label sert de réponse cible dans l'apprentissage supervisé.")
    },
    "Classification": {
      example: "Reconnaître si un email est spam/non-spam ou si une image contient un chat/chien est une classification.",
      visual: visual("mlConfusionMetrics", "La classification se diagnostique souvent avec une matrice de confusion.")
    },
    "Régression": {
      example: "Prédire un prix, une température ou une consommation électrique est une régression : la sortie est une valeur continue.",
      visual: visual("mlTrainValidationTestSplit", "La régression suit le même découpage train/validation/test.")
    },
    "Jeu d'entraînement": {
      example: "Le modèle voit le jeu d'entraînement pendant <code>fit</code> : c'est là que ses poids sont ajustés.",
      visual: visual("mlTrainValidationTestSplit", "Train : apprendre les paramètres.")
    },
    "Jeu de validation": {
      example: "On utilise la validation pour choisir le taux d'apprentissage, la profondeur, le seuil ou le moment d'arrêt, sans toucher au test.",
      visual: visual("mlTrainValidationTestSplit", "Validation : choisir les réglages sans tricher sur le test.")
    },
    "Jeu de test": {
      example: "Le test sert une seule fois à la fin pour estimer la performance finale, comme un examen blanc que le modèle n'a jamais vu.",
      visual: visual("mlTrainValidationTestSplit", "Test : estimation finale après les choix de modèle.")
    },
    "Généralisation": {
      example: "Un modèle utile n'est pas celui qui récite le train, mais celui qui garde un bon score sur validation et test.",
      visual: visual("mlOverfittingBiasVariance", "La généralisation se lit dans l'écart entre train et validation/test.")
    },
    "Sous-apprentissage": {
      example: "Si l'erreur train et l'erreur validation restent toutes les deux hautes, le modèle est probablement trop simple ou mal entraîné.",
      visual: visual("mlOverfittingBiasVariance", "Sous-apprentissage : train mauvais, validation mauvaise.")
    },
    "Compromis biais-variance": {
      example: "Un modèle trop rigide a beaucoup de biais ; un modèle trop flexible peut avoir trop de variance et coller au bruit.",
      visual: visual("mlOverfittingBiasVariance", "Le bon modèle cherche la zone où la validation est minimale.")
    },
    "Data leakage": {
      example: "Normaliser tout le dataset avant le split laisse le test influencer le scaler : le score devient trop optimiste.",
      visual: visual("mlTrainValidationTestSplit", "Le test ne doit jamais aider à entraîner ou choisir le modèle.")
    },
    "Baseline": {
      example: "Avant un gros modèle, on compare à une règle simple : prédire la classe majoritaire ou la moyenne de la cible.",
      visual: visual("mlTrainValidationTestSplit", "La baseline sert de plancher à battre honnêtement.")
    },
    "Hold-out": {
      example: "On sépare une fois les données, par exemple 70 % train, 15 % validation, 15 % test.",
      visual: visual("mlTrainValidationTestSplit", "Hold-out : un découpage fixe des données.")
    },
    "Validation croisée": {
      example: "Avec 5-fold CV, chaque cinquième des données sert une fois de validation, puis on moyenne les cinq scores.",
      visual: visual("mlCrossValidationFolds", "La validation croisée réduit la dépendance à un seul split.")
    },
    "K-fold": {
      example: "Si k=5, on entraîne cinq fois : quatre folds pour apprendre, un fold pour valider, puis on tourne.",
      visual: visual("mlCrossValidationFolds", "Chaque fold devient validation une fois.")
    },
    "Stratification": {
      example: "Si la classe positive vaut 5 % du dataset, un split stratifié essaie de garder environ 5 % de positifs dans chaque fold.",
      visual: visual("mlCrossValidationFolds", "La stratification garde des proportions de classes comparables.")
    },
    "Classes déséquilibrées": {
      example: "Si 99 % des emails sont non-spam, prédire toujours non-spam donne 99 % d'accuracy mais rate tous les spams.",
      visual: visual("mlConfusionMetrics", "La matrice de confusion révèle ce que l'accuracy cache.")
    },
    "Precision": {
      example: "Si le modèle signale 10 fraudes et que 8 sont vraiment des fraudes, sa precision vaut 8/10.",
      visual: visual("mlConfusionMetrics", "Precision = parmi les positifs prédits, lesquels sont vrais ?")
    },
    "Recall": {
      example: "Si 20 fraudes existent et que le modèle en retrouve 15, son recall vaut 15/20.",
      visual: visual("mlConfusionMetrics", "Recall = parmi les vrais positifs, combien sont retrouvés ?")
    },
    "F1-score": {
      example: "Le F1-score devient faible si la precision ou le recall s'effondre : il force à équilibrer les deux.",
      visual: visual("mlConfusionMetrics", "F1 = moyenne harmonique entre precision et recall.")
    },
    "Seuil de décision": {
      example: "Passer le seuil de 0.5 à 0.2 détecte plus de positifs, mais augmente souvent les faux positifs.",
      visual: visual("mlConfusionMetrics", "Le seuil déplace le compromis precision/recall.")
    },
    "ROC-AUC": {
      example: "Une ROC-AUC élevée signifie que le modèle classe souvent un positif au-dessus d'un négatif, quel que soit le seuil choisi.",
      visual: visual("mlConfusionMetrics", "Les métriques de seuil complètent la matrice de confusion.")
    },
    "PR-AUC": {
      example: "Quand les positifs sont rares, la PR-AUC raconte mieux la qualité du détecteur que l'accuracy ou parfois ROC-AUC.",
      visual: visual("mlConfusionMetrics", "Precision et recall deviennent centraux en cas de classe rare.")
    },
    "MAE": {
      example: "Si les erreurs absolues valent 2, 4 et 6 euros, la MAE vaut 4 euros.",
      visual: visual("mlTrainValidationTestSplit", "En régression aussi, on compare les métriques sur validation puis test.")
    },
    "MSE": {
      example: "Une erreur de 10 pèse cent fois plus qu'une erreur de 1 dans la MSE, car les erreurs sont mises au carré.",
      visual: visual("mlTrainValidationTestSplit", "La MSE pénalise fortement les grosses erreurs.")
    },
    "RMSE": {
      example: "La RMSE est la racine de la MSE : elle reste sensible aux grosses erreurs, mais revient dans l'unité de la cible.",
      visual: visual("mlTrainValidationTestSplit", "La RMSE se lit dans la même unité que la variable prédite.")
    },
    "R²": {
      example: "Un R² proche de 1 indique que le modèle explique beaucoup mieux la cible qu'une prédiction constante par la moyenne.",
      visual: visual("mlTrainValidationTestSplit", "R² compare le modèle à une baseline qui prédit la moyenne.")
    },
    "Sélection d'hyperparamètres": {
      example: "On essaie plusieurs profondeurs ou taux d'apprentissage sur validation, puis on ne garde le test que pour la mesure finale.",
      visual: visual("mlTrainValidationTestSplit", "Les hyperparamètres se choisissent avec validation, pas avec test.")
    },
    "Pipeline ML": {
      example: "Un pipeline évite de normaliser, encoder ou sélectionner les features avec des informations venues du test.",
      visual: visual("mlTrainValidationTestSplit", "Le pipeline transporte le même prétraitement du train vers validation/test.")
    },
    "Paramètre appris": {
      example: "Les coefficients d'un filtre CNN, les matrices U/V/W d'un RNN ou la table Q(s,a) en Q-Learning sont appris pendant l'entraînement ou l'interaction.",
      visual: visual("mlParamHyperparamMap", "Les paramètres appris changent grâce au train ou aux rewards.")
    },
    "NLP": {
      example: "La prédiction du mot suivant, l'analyse de sentiments et la traduction automatique sont des tâches NLP.",
      visual: visual("languageModelSoftmax", "En NLP, le modèle produit souvent une distribution sur un vocabulaire.")
    },
    "Tokenisation": {
      example: "La phrase « je mange » peut être découpée en mots, sous-mots ou caractères selon le tokenizer choisi.",
      visual: visual("tokenEncodingCompare", "Le texte devient une suite de tokens avant d'entrer dans le modèle.")
    },
    "Vocabulaire": {
      example: "Si le vocabulaire contient 10 000 tokens, la softmax finale produit typiquement 10 000 scores.",
      visual: visual("languageModelSoftmax", "La taille du vocabulaire fixe la taille de sortie du modèle de langage.")
    },
    "Longueur de contexte": {
      example: "Un contexte de 128 tokens signifie que le modèle ne regarde au maximum que les 128 positions fournies à l'entrée.",
      visual: visual("rnnUnrolledTime", "La longueur de contexte limite combien de positions peuvent influencer la sortie.")
    },
    "F1 macro": {
      example: "Si une classe rare a un F1 très faible, le F1 macro le fait apparaître, même si la classe majoritaire domine le dataset.",
      visual: visual("mlConfusionMetrics", "Le F1 macro moyenne les scores classe par classe.")
    },
    "Balanced accuracy": {
      example: "Si un modèle ignore la classe rare, la balanced accuracy chute parce qu'elle moyenne les recalls par classe.",
      visual: visual("mlConfusionMetrics", "La balanced accuracy corrige une partie du biais de l'accuracy brute.")
    },
    "GroupKFold": {
      example: "Si un patient a plusieurs images, GroupKFold garde toutes ses images dans le même fold pour éviter une fuite patient.",
      visual: visual("mlCrossValidationFolds", "Les folds doivent parfois être construits par groupe, pas ligne par ligne.")
    },
    "Nested cross-validation": {
      example: "La boucle interne choisit les hyperparamètres ; la boucle externe mesure la performance de ce choix.",
      visual: visual("mlCrossValidationFolds", "Deux niveaux de validation évitent d'annoncer un score trop optimiste.")
    },
    "Calibration": {
      example: "Si le modèle annonce 0.8 sur 100 cas, on espère environ 80 cas positifs si les probabilités sont calibrées.",
      visual: visual("mlConfusionMetrics", "La calibration concerne la fiabilité des probabilités, pas seulement le classement.")
    },
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
      visual: visual("mlParamHyperparamMap", "Un hyperparamètre est choisi avant ou avec la validation.")
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
      visual: visual("mlOverfittingBiasVariance", "Sur-apprentissage : l'entraînement s'améliore, mais la validation se dégrade.")
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
      visual: visual("mlConfusionMetrics", "L'accuracy peut masquer les faux positifs et les faux négatifs.")
    },
    "Matrice de confusion": {
      example: "Un tableau qui montre, pour chaque vraie classe, combien d'exemples ont été prédits dans chaque classe — on y repère les confusions systématiques.",
      visual: visual("mlConfusionMetrics", "Les cases TP, FP, FN et TN expliquent precision, recall, F1 et accuracy.")
    },
    "Early stopping": {
      example: "On arrête l'entraînement quand la perte sur l'ensemble de validation cesse de diminuer — pour éviter le sur-apprentissage.",
      visual: visual("mlOverfittingBiasVariance", "On surveille la validation pour arrêter avant le sur-apprentissage.")
    },
    "Réseau feedforward": {
      example: "Une entrée fixe arrive, une sortie fixe repart, et rien ne boucle du futur vers le passé : c'est le cas standard des réseaux acycliques.",
      visual: visual("rnnFeedforwardVsRecurrent", "Le réseau feedforward lit puis répond, sans mémoriser explicitement le pas précédent.")
    },
    "Réseau récurrent": {
      example: "À chaque pas de temps, le réseau combine l'entrée courante avec un état caché issu du pas précédent pour garder une mémoire de la séquence.",
      visual: visual("rnnFeedforwardVsRecurrent", "Le RNN ajoute une boucle temporelle : l'état du passé revient influencer le présent.")
    },
    "Couche récurrente": {
      example: "On peut la voir comme une couche cachée qui relit sans cesse l'entrée courante à la lumière d'un résumé du passé.",
      visual: visual("rnnMatrixMap", "Une couche récurrente combine X_t, H_(t−1), puis produit H_t et Y_t.")
    },
    "Pas de temps": {
      example: "Dans une phrase, chaque mot lu correspond à un pas de temps supplémentaire ; dans une série boursière, chaque jour ajoute un pas de temps.",
      visual: visual("rnnUnrolledTime", "Le temps est ici explicite : un même bloc réapparaît à t−1, t et t+1.")
    },
    "Déroulage temporel": {
      example: "Pour comprendre l'apprentissage, on remplace la boucle d'un RNN par une chaîne de copies identiques du même bloc, une par pas de temps.",
      visual: visual("rnnUnrolledTime", "Le réseau replié devient une chaîne de blocs partagés dans le temps.")
    },
    "Poids partagés dans le temps": {
      example: "Les matrices U, V et W ne changent pas d'un pas de temps au suivant : le même bloc est réutilisé à t=1, t=2, t=3, etc.",
      visual: visual("bpttFlow", "Le même bloc est répété ; les gradients s'accumulent sur les mêmes poids.")
    },
    "État caché": {
      example: "Dans une phrase lue mot par mot, l'état caché garde une trace compacte des mots déjà rencontrés pour aider à traiter le mot suivant.",
      visual: visual("rnnMatrixMap", "H_t est la mémoire compacte qui relie l'entrée courante à la sortie et au futur.")
    },
    "Unités d'état": {
      example: "Dans un réseau de Jordan, elles stockent la sortie précédente pour la réinjecter à l'entrée du pas suivant.",
      visual: visual("jordanElmanComparison", "Dans Jordan, la sortie Y_(t−1) est recopiée vers des unités d'état.")
    },
    "Unités de contexte": {
      example: "Dans un réseau d'Elman, elles recopient l'état caché précédent pour aider à calculer l'état caché courant.",
      visual: visual("jordanElmanComparison", "Dans Elman, c'est l'état caché H_(t−1) qui revient via les unités contexte.")
    },
    "Réseau de Jordan": {
      example: "Le réseau de Jordan renvoie la sortie précédente du réseau vers l'entrée au pas suivant au moyen d'unités d'état.",
      visual: visual("jordanElmanComparison", "Jordan recycle Y_(t−1) : la boucle passe par la sortie.")
    },
    "Réseau d'Elman": {
      example: "Le réseau d'Elman recycle l'état caché précédent plutôt que la sortie ; il est donc plus proche du RNN conventionnel moderne.",
      visual: visual("jordanElmanComparison", "Elman recycle H_(t−1) : la boucle passe par la mémoire interne.")
    },
    "Rétropropagation à travers le temps": {
      example: "On déroule un RNN sur tous les pas de temps puis on applique une rétropropagation classique du dernier pas vers les premiers en accumulant les gradients.",
      visual: visual("bpttFlow", "BPTT = rétropropagation classique, mais appliquée au réseau déroulé dans le temps.")
    },
    "Séquence temporelle": {
      example: "Un historique de prix quotidiens, une mesure capteur ou un signal audio sont des séquences temporelles : leur ordre compte autant que leurs valeurs.",
      visual: visual("seq2seqTypes", "Une séquence n'est pas un simple vecteur figé : elle se parcourt dans le temps.")
    },
    "Séquence à séquence": {
      example: "Une phrase source en français est lue par un encodeur, puis une phrase cible en anglais est produite mot par mot par un décodeur.",
      visual: visual("seq2seqTypes", "Le cas many-to-many est le cœur des problèmes Seq2Seq.")
    },
    "Many-to-many": {
      example: "En traduction, on lit une séquence de mots source et on produit une séquence de mots cible : c'est le cas many-to-many par excellence.",
      visual: visual("seq2seqTypes", "Une séquence complète entre, une séquence complète sort.")
    },
    "Many-to-one": {
      example: "En analyse de sentiments, on lit tout un texte puis on produit une seule décision, par exemple positif ou négatif.",
      visual: visual("seq2seqTypes", "La séquence entière est résumée en une seule sortie.")
    },
    "One-to-many": {
      example: "En génération de légende d'image, une entrée unique peut servir à produire toute une séquence de mots.",
      visual: visual("seq2seqTypes", "Une seule entrée peut engendrer plusieurs sorties ordonnées.")
    },
    "Encodage one-hot": {
      example: "Si le vocabulaire contient 10 000 mots, chaque mot devient un vecteur de taille 10 000 avec un seul 1 à la bonne position.",
      visual: visual("tokenEncodingCompare", "Le one-hot est très sparse : un seul 1, le reste à 0.")
    },
    "Word embedding": {
      example: "Le mot 'chat' peut être représenté par un petit vecteur dense appris, par exemple de dimension 50 ou 100, au lieu d'un grand one-hot creux.",
      visual: visual("tokenEncodingCompare", "L'embedding troque un grand vecteur vide contre peu de dimensions, mais riches.")
    },
    "Modélisation du langage": {
      example: "On donne les mots déjà vus à un RNN et il renvoie une distribution de probabilité sur tous les mots qui pourraient venir ensuite.",
      visual: visual("languageModelSoftmax", "L'état caché devient une distribution sur le vocabulaire via la softmax.")
    },
    "Mémoire courte": {
      example: "Un RNN simple peut bien gérer les dépendances proches, mais perdre l'information utile quand elle doit survivre sur beaucoup de pas de temps.",
      visual: visual("rnnGradientInstability", "Quand le signal de correction s'atténue, la mémoire longue devient difficile à apprendre.")
    },
    "LSTM": {
      example: "Un LSTM garde une mémoire de cellule séparée de sa sortie cachée et apprend à oublier, écrire et exposer l'information utile au bon moment.",
      visual: visual("lstmGatesCell", "Un LSTM sépare la mémoire longue C_t de la sortie visible H_t.")
    },
    "État de cellule": {
      example: "Dans un LSTM, l'état de cellule transporte la mémoire longue, tandis que l'état caché correspond davantage à ce qui est exposé au pas courant.",
      visual: visual("lstmGatesCell", "C_t joue le rôle d'autoroute de mémoire entre les pas de temps.")
    },
    "Porte d'oubli": {
      example: "Si la porte d'oubli vaut presque 0, le LSTM efface presque tout l'état passé ; si elle vaut presque 1, il le conserve presque intact.",
      visual: visual("lstmGatesCell", "La porte d'oubli décide quelle part de C_(t−1) survit dans C_t.")
    },
    "Porte d'entrée": {
      example: "La porte d'entrée dose ce qui doit vraiment être écrit dans la mémoire à partir de la nouvelle information candidate.",
      visual: visual("lstmGatesCell", "La porte d'entrée filtre l'écriture de la nouvelle information.")
    },
    "Porte de sortie": {
      example: "La porte de sortie détermine quelle partie de la mémoire interne doit être montrée sous forme d'état caché visible.",
      visual: visual("lstmGatesCell", "La porte de sortie contrôle ce qui devient H_t.")
    },
    "État candidat": {
      example: "Le LSTM calcule d'abord une nouvelle information potentielle, puis décide quelle fraction de cette proposition mérite d'entrer en mémoire.",
      visual: visual("lstmGatesCell", "c̃_t est l'information candidate avant filtrage par la porte d'entrée.")
    },
    "Connexions peephole": {
      example: "Certaines variantes de LSTM laissent les portes regarder directement l'état de cellule précédent, comme si elles jetaient un œil à la mémoire interne avant de décider.",
      visual: visual("lstmGatesCell", "Les peephole connections ajoutent un regard direct des portes sur la mémoire.")
    },
    "Encodeur-décodeur": {
      example: "L'encodeur lit la séquence source, puis le décodeur génère la séquence cible à partir de la représentation produite par l'encodeur.",
      visual: visual("encoderDecoderAttention", "L'encodeur résume la source, puis le décodeur produit la cible.")
    },
    "Vecteur-contexte": {
      example: "Dans un encodeur-décodeur simple, toute la phrase source doit tenir dans un seul vecteur transmis au décodeur : c'est pratique, mais vite trop compressé.",
      visual: visual("encoderDecoderAttention", "Le contexte est ce résumé intermédiaire envoyé au décodeur.")
    },
    "Attention": {
      example: "Pour traduire un mot cible, le modèle peut regarder davantage certains mots sources que d'autres, au lieu d'utiliser un seul résumé global identique partout.",
      visual: visual("encoderDecoderAttention", "Les poids d'attention mettent en avant les positions source utiles à l'instant courant.")
    },
    "Transformeur": {
      example: "Au lieu de lire les mots un par un comme un RNN, un transformeur peut traiter toute la séquence en parallèle grâce à l'attention.",
      visual: visual("transformerParallelAttention", "Le transformeur abandonne la lecture strictement séquentielle au profit d'un regard parallèle.")
    },
    "Explosion du gradient": {
      example: "Si le signal de correction grossit trop en remontant dans le temps, les mises à jour deviennent gigantesques et l'entraînement peut diverger.",
      visual: visual("rnnGradientInstability", "Dans le cas exploding, le gradient enfle à chaque pas rétropropagé.")
    },
    "Fenêtre glissante": {
      example: "Pour une série de prix, on peut prendre les 30 derniers jours comme entrée et demander au réseau de prédire le 31e : on recommence ensuite en glissant d'un jour.",
      visual: visual("rnnUnrolledTime", "Une fenêtre glissante prélève plusieurs pas successifs pour en faire un exemple."),
    },
    "Génération caractère par caractère": {
      example: "Le modèle lit une séquence seed, prédit un caractère, l'ajoute à la fin, puis recommence : la sortie d'un pas nourrit l'entrée du suivant.",
      visual: visual("languageModelSoftmax", "Même logique qu'en modélisation du langage, mais au niveau des caractères.")
    },
    "Apprentissage par renforcement": {
      example: "Un agent teste des actions dans un environnement, reçoit des rewards, puis apprend progressivement une stratégie qui rapporte plus à long terme.",
      visual: visual("rlAgentEnvironmentLoop", "L'AR repose sur la boucle agent → action → environnement → état + reward.")
    },
    "Agent": {
      example: "Dans un jeu, l'agent est le joueur artificiel qui observe la position courante et choisit le prochain coup.",
      visual: visual("rlAgentEnvironmentLoop", "L'agent est le bloc qui décide des actions.")
    },
    "Environnement": {
      example: "Dans un robot-grille, l'environnement contient les murs, la nourriture, les pièges et les règles de déplacement.",
      visual: visual("rlAgentEnvironmentLoop", "L'environnement répond à l'action par un nouvel état et un reward.")
    },
    "État en renforcement": {
      example: "La position du robot, l'état du plateau ou la configuration actuelle du jeu sont des états possibles.",
      visual: visual("rlMdpBellman", "Un état est un nœud dans le graphe de transitions.")
    },
    "Action": {
      example: "Aller à gauche, aller à droite, sauter, acheter ou vendre sont des actions selon le problème.",
      visual: visual("rlAgentEnvironmentLoop", "L'action est la décision envoyée de l'agent vers l'environnement.")
    },
    "Signal de renforcement": {
      example: "Un +1 pour atteindre le but, -1 pour tomber dans un piège, ou 0 pour un déplacement neutre.",
      visual: visual("rlAgentEnvironmentLoop", "Le signal de renforcement revient de l'environnement vers l'agent.")
    },
    "Récompense": {
      example: "Gagner une partie, trouver de la nourriture ou réduire une erreur de contrôle peut produire une récompense positive.",
      visual: visual("rlAgentEnvironmentLoop", "La récompense est le retour qui guide l'apprentissage.")
    },
    "Punition": {
      example: "Heurter un obstacle ou perdre une partie peut être encodé par un reward négatif.",
      visual: visual("rlAgentEnvironmentLoop", "Une punition est un reward défavorable.")
    },
    "Fonction de récompense": {
      example: "Dans une grille, R(s,a) peut valoir +10 si l'action mène au but, -5 si elle mène à un piège, et -0.1 sinon.",
      visual: visual("rlMdpBellman", "Le reward fait partie de chaque transition de décision.")
    },
    "Stratégie": {
      example: "Une stratégie peut dire : si je suis près d'un mur, tourner ; si je suis près de la récompense, avancer.",
      visual: visual("rlPlanningIterations", "La stratégie π est ce que l'on cherche à améliorer.")
    },
    "Observabilité totale": {
      example: "Dans une petite grille visible entièrement, l'agent connaît directement sa position et celle des obstacles : I(s)=s.",
      visual: visual("rlAgentEnvironmentLoop", "Avec observabilité totale, l'état reçu par l'agent est l'état réel.")
    },
    "Stationnarité": {
      example: "Si une action a 70 % de chances de réussir aujourd'hui, elle garde cette probabilité demain ; les règles ne changent pas pendant l'apprentissage.",
      visual: visual("rlMdpBellman", "La fonction de transition reste stable dans le temps.")
    },
    "Retour actualisé": {
      example: "Un gain immédiat compte pleinement, un gain dans deux pas est pondéré par γ, puis γ², etc.",
      visual: visual("rlOptimalityHorizons", "Le modèle actualisé donne moins de poids aux récompenses éloignées.")
    },
    "Facteur d'actualisation": {
      example: "Avec γ=0.1, l'agent regarde surtout l'immédiat ; avec γ=0.99, il accepte plus facilement un détour pour une grosse récompense future.",
      visual: visual("rlOptimalityHorizons", "γ règle la myopie ou la prévoyance de l'agent.")
    },
    "Épisode": {
      example: "Une partie de jeu complète, du début jusqu'à la victoire ou la défaite, est un épisode.",
      visual: visual("rlAgentEnvironmentLoop", "Un épisode est une suite de boucles agent-environnement.")
    },
    "État terminal": {
      example: "Victoire, défaite, sortie de piste ou fin de mission : après cet état, l'épisode s'arrête.",
      visual: visual("rlAgentEnvironmentLoop", "L'état terminal arrête la boucle pour l'épisode courant.")
    },
    "Processus stochastique": {
      example: "La position future d'un agent soumis à du bruit est une variable aléatoire indexée par le temps.",
      visual: visual("rlMdpBellman", "Les transitions entre états peuvent être probabilistes.")
    },
    "Propriété de Markov": {
      example: "Si l'état courant contient déjà la position, la vitesse et les règles utiles, l'historique complet n'ajoute rien pour prédire le prochain état.",
      visual: visual("rlMdpBellman", "Le futur dépend du présent, pas de toute la trajectoire.")
    },
    "Chaîne de Markov": {
      example: "Une météo simplifiée soleil/pluie peut être une chaîne de Markov si demain dépend seulement de la météo d'aujourd'hui.",
      visual: visual("rlMdpBellman", "Une chaîne de Markov relie des états par des transitions probabilistes.")
    },
    "Matrice de transition": {
      example: "Une ligne de la matrice peut dire : depuis s1, 10 % vers s1, 60 % vers s2, 30 % vers s3.",
      visual: visual("rlMdpBellman", "Chaque transition porte une probabilité.")
    },
    "Processus de décision markovien": {
      example: "Un robot dans une grille avec actions haut/bas/gauche/droite, probabilités de déplacement et rewards est un MDP.",
      visual: visual("rlMdpBellman", "Un MDP ajoute les actions et rewards à une dynamique markovienne.")
    },
    "Fonction de transition": {
      example: "T(s, droite, s') peut valoir 0.8 si l'action réussit souvent, et répartir 0.2 sur des déplacements ratés.",
      visual: visual("rlMdpBellman", "T(s,a,s') décrit les prochains états possibles après une action.")
    },
    "Fonction valeur": {
      example: "Un état proche du but aura une grande valeur si l'agent peut ensuite obtenir une récompense élevée.",
      visual: visual("rlMdpBellman", "Bellman calcule une valeur à partir du reward et des valeurs futures.")
    },
    "Valeur optimale": {
      example: "V*(s) est ce que l'on peut espérer de mieux depuis s si l'on agit parfaitement ensuite.",
      visual: visual("rlPlanningIterations", "Value Iteration cherche à approcher V*.")
    },
    "Équation de Bellman": {
      example: "La valeur d'un état se calcule comme reward immédiat + valeur actualisée des prochains états possibles.",
      visual: visual("rlMdpBellman", "Bellman relie le présent au futur.")
    },
    "Bellman d'optimalité": {
      example: "On ajoute un max sur les actions pour choisir la meilleure décision possible depuis chaque état.",
      visual: visual("rlMdpBellman", "La version optimale choisit l'action qui maximise le backup.")
    },
    "Value Iteration": {
      example: "On initialise V, puis on applique des backups Bellman max jusqu'à ce que les valeurs changent très peu.",
      visual: visual("rlPlanningIterations", "Value Iteration améliore directement la table des valeurs.")
    },
    "Policy Iteration": {
      example: "On évalue la stratégie actuelle, puis on la remplace par une meilleure stratégie ; on répète jusqu'à stabilisation.",
      visual: visual("rlPlanningIterations", "Policy Iteration alterne évaluation et amélioration de π.")
    },
    "Model-based": {
      example: "L'agent estime les probabilités de transition et les rewards, puis utilise ce modèle pour planifier.",
      visual: visual("rlModelBasedFreeDyna", "Model-based apprend ou utilise un modèle T̂, R̂.")
    },
    "Model-free": {
      example: "Q-Learning apprend directement quelles actions valent le plus sans construire explicitement la transition T.",
      visual: visual("rlModelBasedFreeDyna", "Model-free apprend directement une valeur ou une stratégie.")
    },
    "Dyna": {
      example: "Après une vraie interaction, Dyna met à jour son modèle puis simule plusieurs mises à jour internes supplémentaires.",
      visual: visual("rlModelBasedFreeDyna", "Dyna combine expérience réelle et planning simulé.")
    },
    "Q-Learning": {
      example: "L'agent met à jour Q(s,a) après chaque transition avec la récompense observée et la meilleure valeur estimée dans le prochain état.",
      visual: visual("rlQLearningUpdate", "Q-Learning corrige une valeur état-action avec une cible TD.")
    },
    "Fonction Q": {
      example: "Si Q(s, gauche)=2 et Q(s, droite)=5, l'action droite est actuellement jugée meilleure depuis s.",
      visual: visual("rlQLearningUpdate", "Q compare les actions possibles dans un même état.")
    },
    "Exploration": {
      example: "Tester une action peu connue peut découvrir un chemin meilleur que celui que l'agent utilise déjà.",
      visual: visual("rlQLearningUpdate", "Avec probabilité ε, l'agent explore au hasard.")
    },
    "Exploitation": {
      example: "Prendre l'action avec le Q le plus élevé revient à exploiter ce que l'agent croit déjà savoir.",
      visual: visual("rlQLearningUpdate", "Avec probabilité 1−ε, l'agent exploite la meilleure action estimée.")
    },
    "ε-greedy": {
      example: "Avec ε=0.1, environ 10 % des décisions sont exploratoires et 90 % exploitent la meilleure action connue.",
      visual: visual("rlQLearningUpdate", "ε règle le compromis entre hasard et action maximale.")
    },
    "Facteur d'apprentissage": {
      example: "Avec α proche de 1, la nouvelle observation change fortement Q ; avec α proche de 0, la correction est prudente.",
      visual: visual("rlQLearningUpdate", "α contrôle la taille de la correction.")
    },
    "Cible TD": {
      example: "En Q-Learning, la cible TD est le reward immédiat plus la meilleure valeur future estimée.",
      visual: visual("rlQLearningUpdate", "La cible TD est ce que Q(s,a) devrait devenir selon la transition observée.")
    },
    "Erreur TD": {
      example: "Si la cible vaut 8 et que Q(s,a) vaut 5, l'erreur TD vaut 3 : il faut augmenter Q(s,a).",
      visual: visual("rlQLearningUpdate", "L'erreur TD donne le sens et l'amplitude de la correction.")
    }
  };

  // Fallbacks par tag, quand un terme n'a pas d'override dédié.
  const tagFallbacks = [
    {
      test: (tags) => tags.includes("ml") || tags.includes("dataset") || tags.includes("donnees") || tags.includes("feature") || tags.includes("label") || tags.includes("validation") || tags.includes("cross-validation") || tags.includes("classification") || tags.includes("regression") || tags.includes("auc") || tags.includes("seuil") || tags.includes("leakage") || tags.includes("baseline") || tags.includes("biais-variance") || tags.includes("underfitting") || tags.includes("overfitting"),
      example: "Cette notion sert à entraîner, valider ou évaluer un modèle sans confondre performance sur données vues et performance sur nouveaux exemples.",
      visual: visual("mlTrainValidationTestSplit", "Réflexe ML : séparer apprendre, choisir et évaluer.")
    },
    {
      test: (tags) => tags.includes("renforcement") || tags.includes("rl") || tags.includes("ar") || tags.includes("mdp") || tags.includes("markov") || tags.includes("bellman") || tags.includes("qlearning") || tags.includes("dyna") || tags.includes("policy") || tags.includes("reward") || tags.includes("exploration") || tags.includes("exploitation"),
      example: "Cette notion sert à relier état, action, récompense et décision à long terme dans une boucle agent-environnement.",
      visual: visual("rlAgentEnvironmentLoop", "Boucle fondamentale de l'apprentissage par renforcement.")
    },
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
      test: (tags) => tags.includes("sequence") || tags.includes("recurrence") || tags.includes("rnn") || tags.includes("lstm") || tags.includes("memoire") || tags.includes("langage") || tags.includes("attention") || tags.includes("transformeur"),
      example: "Cette notion sert a traiter une sequence pas a pas, ou a raisonner sur la memoire et les dependances entre positions.",
      visual: visual("rnnUnrolledTime", "Le temps remplace ici la profondeur : le même bloc se répète le long de la séquence.")
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
