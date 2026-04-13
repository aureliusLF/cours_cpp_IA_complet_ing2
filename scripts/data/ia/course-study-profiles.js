(function registerCourseStudyProfiles(globalScope) {
globalScope.COURSE_STUDY_PROFILES = {
  "ml-fondations-generalisation": {
    review: {
      expectations: [
        "Distinguer clairement dataset, features, labels, modèle, paramètres et hyperparamètres.",
        "Distinguer apprentissage supervisé, non supervisé, auto-supervisé et renforcement.",
        "Identifier les problèmes de qualité de données : doublons, labels bruités, classes déséquilibrées, non-représentativité.",
        "Expliquer pourquoi on sépare train, validation et test, et ce que chaque split autorise ou interdit.",
        "Reconnaître un sous-apprentissage et un sur-apprentissage à partir des courbes train/validation.",
        "Expliquer le compromis biais-variance sans formule lourde : modèle trop simple, bon compromis, modèle trop flexible.",
        "Citer plusieurs sources de data leakage et proposer une correction simple, notamment avec les prétraitements."
      ],
      commonMistakes: [
        "Évaluer plusieurs modèles sur le test puis choisir le meilleur : le test devient alors une validation déguisée.",
        "Normaliser ou sélectionner les features avant le split, ce qui fait fuiter de l'information dans l'entraînement.",
        "Confondre hyperparamètres et paramètres appris par le modèle.",
        "Dire qu'un très bon score train suffit à prouver qu'un modèle est bon.",
        "Oublier la baseline avant de justifier un modèle complexe."
      ],
      oralCheck: "Explique en deux minutes le pipeline ML correct : dataset, split train/validation/test, entraînement, choix des hyperparamètres, test final. Ajoute un exemple de data leakage."
    },
    assistant: {
      focus: "Installer les réflexes de base avant le deep learning : découpage propre des données, généralisation, overfitting/underfitting, fuite de données et baseline.",
      mustInclude: [
        "Au moins un exercice de diagnostic sur courbes train/validation.",
        "Au moins un exercice où l'étudiant doit repérer une fuite de données.",
        "Au moins un exercice de protocole complet : cible, split, baseline, métrique et test final.",
        "Un mini-exemple qui distingue paramètre appris et hyperparamètre choisi."
      ],
      avoid: [
        "Ne pas partir tout de suite vers des architectures de réseaux : ce chapitre sert de socle ML.",
        "Ne pas présenter le test comme un outil de tuning."
      ]
    }
  },

  "ml-evaluation-validation": {
    review: {
      expectations: [
        "Comparer hold-out, k-fold cross-validation et stratified k-fold, avec leurs cas d'usage.",
        "Choisir un split groupé ou temporel lorsque les données ne sont pas indépendantes.",
        "Lire une matrice de confusion binaire et calculer accuracy, precision, recall et F1-score.",
        "Distinguer F1 macro, micro et weighted pour les problèmes multi-classes.",
        "Expliquer pourquoi l'accuracy devient trompeuse avec des classes déséquilibrées.",
        "Décrire le rôle du seuil de décision dans le compromis precision/recall.",
        "Choisir une métrique adaptée selon le problème : F1, recall, precision, ROC-AUC, PR-AUC, MAE, RMSE ou R².",
        "Savoir qu'une série temporelle ne se valide pas par mélange aléatoire classique."
      ],
      commonMistakes: [
        "Confondre precision et recall : la precision regarde les positifs prédits, le recall regarde les vrais positifs retrouvés.",
        "Utiliser F1-score sans réfléchir au coût réel des faux positifs et faux négatifs.",
        "Faire une cross-validation aléatoire sur des données temporelles où le futur fuite vers le passé.",
        "Comparer des modèles sur des métriques différentes ou sur des splits différents.",
        "Interpréter R² comme une accuracy de régression, alors que ce n'est pas une proportion d'exemples corrects."
      ],
      oralCheck: "On te donne TP=40, FP=10, FN=20, TN=930. Calcule accuracy, precision, recall et F1, puis explique pourquoi l'accuracy seule peut être trompeuse."
    },
    assistant: {
      focus: "Faire manipuler les métriques à la main, puis relier chaque métrique à une décision métier ou scientifique.",
      mustInclude: [
        "Au moins un calcul de precision, recall et F1 depuis une matrice de confusion.",
        "Au moins un exercice où l'étudiant choisit la métrique selon le coût des erreurs.",
        "Au moins un exercice où il choisit entre split stratifié, groupé et temporel.",
        "Une comparaison claire entre hold-out et cross-validation."
      ],
      avoid: [
        "Ne pas réduire l'évaluation à l'accuracy.",
        "Ne pas faire de code scikit-learn sans expliquer d'abord ce que les scores mesurent."
      ]
    }
  },

  "fiche-parametres-hyperparametres": {
    review: {
      expectations: [
        "Définir paramètres appris et hyperparamètres sans les confondre.",
        "Lister les paramètres et hyperparamètres principaux d'un CNN : filtres, biais, kernel size, stride, padding, dropout, learning rate.",
        "Lister ceux d'un RNN/LSTM : matrices U/V/W, portes LSTM, hidden size, longueur de séquence, BPTT, gradient clipping.",
        "Lister ceux du NLP : tokenizer, vocabulaire, embeddings, dimension d'embedding, longueur de contexte, température de génération.",
        "Lister ceux du RL : V(s), Q(s,a), T̂/R̂, gamma, alpha, epsilon, épisodes, planning steps de Dyna.",
        "Expliquer que les hyperparamètres se règlent sur validation et que le test mesure seulement à la fin."
      ],
      commonMistakes: [
        "Appeler hyperparamètre une matrice de poids apprise par gradient.",
        "Appeler paramètre le facteur gamma ou epsilon en Q-Learning.",
        "Oublier que certains objets sont des états appris de prétraitement, comme le vocabulaire ou les statistiques d'un scaler.",
        "Utiliser le test pour choisir une taille de réseau, un seuil ou un learning rate.",
        "Confondre sortie softmax apprise et hyperparamètre de génération comme température/top-p."
      ],
      oralCheck: "Compare CNN, RNN, NLP et Q-Learning du point de vue paramètres/hyperparamètres. Donne deux exemples appris et deux exemples choisis pour chaque famille."
    },
    assistant: {
      focus: "Construire une fiche mentale transversale : ce qui est appris, ce qui est choisi, ce qui est évalué. L'objectif est de préparer l'oral et d'éviter les confusions de vocabulaire.",
      mustInclude: [
        "Au moins un exercice de classement paramètres vs hyperparamètres.",
        "Au moins un exercice oral comparant CNN, RNN, NLP et RL.",
        "Une mention explicite du rôle de la validation et du test."
      ],
      avoid: [
        "Ne pas introduire trop de modèles non étudiés en détail.",
        "Ne pas noyer la fiche dans des dérivations : elle doit rester récapitulative."
      ]
    }
  },

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
  },

  "td-corriges": {
    review: {
      expectations: [
        "Écrire une convolution 2D valide et un max-pooling simples en NumPy pour retrouver l'intuition calculatoire des ConvNet.",
        "Préparer MNIST pour deux cas différents : un réseau dense (<code>N × 784</code>) et un ConvNet Keras (<code>N × 28 × 28 × 1</code>).",
        "Choisir correctement la sortie et la perte d'un modèle Keras selon le cas binaire (<code>sigmoid</code> + <code>binary_crossentropy</code>) ou multi-classes (<code>softmax</code> + <code>categorical_crossentropy</code>).",
        "Lire un <code>model.summary()</code> et vérifier la cohérence des dimensions avant de lancer un entraînement.",
        "Analyser un classifieur CIFAR-10 avec accuracy, matrice de confusion, rapport précision/rappel et exemples mal classés."
      ],
      commonMistakes: [
        "Normaliser les images après le reshape ou avant le reshape n'a pas d'importance, mais oublier la conversion en <code>float32</code> conduit souvent à des surprises de type.",
        "Confondre labels entiers et labels one-hot dans Keras, puis choisir la mauvaise perte.",
        "Évaluer directement sur le test sans garder de validation pendant le développement.",
        "Regarder uniquement l'accuracy CIFAR-10 sans inspecter les classes confondues."
      ],
      oralCheck: "Montre le pipeline complet d'un TD au choix : chargement des données, préparation des tenseurs, définition du réseau, compile, fit, evaluate, puis un diagnostic de sortie."
    },
    assistant: {
      focus: "Faire passer l'étudiant du cours à la pratique : moins de théorie isolée, plus de pipelines complets qui s'exécutent et se diagnostiquent.",
      mustInclude: [
        "Au moins un exercice où l'étudiant code une petite opération ConvNet à la main.",
        "Au moins un exercice où il corrige une erreur de forme de tenseur Keras.",
        "Au moins un exercice où il interprète une matrice de confusion ou quelques images mal classées."
      ],
      avoid: [
        "Ne pas transformer les corrigés en pavés opaques : chaque solution doit rester lisible et découpée.",
        "Éviter les architectures trop ambitieuses qui noient le geste pédagogique de base."
      ]
    }
  },

  "rnn-pourquoi-histoire": {
    review: {
      expectations: [
        "Expliquer pourquoi les réseaux feedforward et les ConvNet classiques sont mal adaptés aux entrées ou sorties séquentielles de longueur variable.",
        "Définir clairement la notion de cycle dans un réseau et dire ce que la récurrence ajoute par rapport à un flux purement forward.",
        "Comparer le réseau de Jordan et le réseau d'Elman en identifiant ce qui est recopié d'un pas de temps au suivant.",
        "Décrire le rôle de l'état caché comme mémoire compacte de la séquence déjà vue."
      ],
      commonMistakes: [
        "Confondre une couche de plus avec une boucle de récurrence : la vraie nouveauté est le retour d'information d'un temps vers le suivant.",
        "Dire qu'un RNN accepte n'importe quelle dimension d'entrée brute : chaque <code>X_t</code> garde une dimension fixe, c'est la longueur <code>T</code> de la séquence qui varie.",
        "Mélanger Jordan et Elman alors que l'un recycle la sortie et l'autre l'état caché."
      ],
      oralCheck: "Explique en deux minutes la difference entre un reseau feedforward et un RNN, puis distingue Jordan et Elman sans regarder tes notes."
    },
    assistant: {
      focus: "Installer les bonnes images mentales : sequence, cycle, etat cache, difference entre boucle sur la sortie et boucle sur l'etat interne.",
      mustInclude: [
        "Au moins un exercice de comparaison feedforward vs recurrent.",
        "Au moins un exercice demandant de retrouver si un schema correspond a Jordan ou Elman.",
        "Une explication concrete du mot 'memoire' dans un RNN."
      ],
      avoid: [
        "Ne pas rentrer trop tot dans les details d'optimisation ou de BPTT.",
        "Ne pas supposer que l'etudiant connait deja le vocabulaire du NLP."
      ]
    }
  },

  "rnn-conventionnel-deroulage": {
    review: {
      expectations: [
        "Ecrire les equations matricielles d'un RNN conventionnel <code>H^t = sigma(U X^t + V H^{t-1} + B^h)</code> et <code>Y^t = sigma(W H^t + B^o)</code>.",
        "Donner les dimensions de <code>U</code>, <code>V</code>, <code>W</code>, <code>B^h</code> et <code>B^o</code> en fonction de <code>n</code>, <code>m</code> et <code>p</code>.",
        "Expliquer pourquoi la matrice <code>V</code> est celle qui porte la récurrence.",
        "Déplier un RNN dans le temps et expliquer l'idée de poids partagés entre les pas de temps."
      ],
      commonMistakes: [
        "Inverser les dimensions de <code>U</code> et <code>W</code>.",
        "Croire qu'un RNN déroulé a des poids différents à chaque pas de temps.",
        "Oublier qu'une couche récurrente n'est pas forcément tout le réseau."
      ],
      oralCheck: "On te donne n, m et p. Redonne les dimensions des matrices du RNN conventionnel, puis explique a quoi correspond exactement V."
    },
    assistant: {
      focus: "Faire passer l'etudiant d'un schema intuitif a une ecriture propre en matrices, puis a la lecture d'un reseau deroule.",
      mustInclude: [
        "Au moins un exercice sur les dimensions de U, V, W.",
        "Au moins un exercice qui traduit la formule matricielle en formule neurone par neurone.",
        "Au moins un exercice sur le deroulage temporel."
      ],
      avoid: [
        "Ne pas transformer la notation en algebre abstraite illisible.",
        "Eviter les preuves lourdes : on veut la lecture des equations, pas un cours de calcul tensoriel."
      ]
    }
  },

  "rnn-sequences-apprentissage": {
    review: {
      expectations: [
        "Distinguer les cas many-to-many, many-to-one et one-to-many et donner un exemple concret pour chacun.",
        "Expliquer comment un RNN fait de la modélisation du langage en prédisant le mot suivant avec une sortie softmax.",
        "Définir l'erreur totale comme somme des pertes à chaque pas de temps.",
        "Décrire la rétropropagation à travers le temps (BPTT) comme une rétropropagation classique appliquée au réseau déroulé."
      ],
      commonMistakes: [
        "Dire qu'un problème Seq2Seq implique forcément la même longueur en entrée et en sortie.",
        "Confondre one-hot et embedding : le premier est creux et très grand, le second est dense et compact.",
        "Oublier que les gradients s'accumulent sur les mêmes poids partagés au fil du temps."
      ],
      oralCheck: "Prends l'exemple de la prediction du mot suivant et explique de bout en bout : entree, etat cache, softmax, perte, puis BPTT."
    },
    assistant: {
      focus: "Relier la theorie RNN a des taches de sequences concretes : texte, sentiment, traduction, prediction du mot suivant.",
      mustInclude: [
        "Au moins un exercice de typologie many-to-many / many-to-one / one-to-many.",
        "Au moins un exercice sur la lecture d'une softmax de vocabulaire.",
        "Au moins un exercice qui raconte BPTT avec un reseau deroule."
      ],
      avoid: [
        "Ne pas faire comme si tous les problemes de sequences relevaient du texte uniquement.",
        "Ne pas cacher le role de la perte totale sommee dans le temps."
      ]
    }
  },

  "lstm-attention-transformeurs": {
    review: {
      expectations: [
        "Expliquer la mémoire courte d'un RNN standard et la relier au vanishing/exploding gradient dans le temps.",
        "Écrire et interpréter les équations centrales du LSTM : état de cellule, porte d'oubli, porte d'entrée, porte de sortie.",
        "Décrire l'architecture encodeur-décodeur et le problème du vecteur-contexte unique.",
        "Expliquer qualitativement pourquoi l'attention et les transformeurs ont largement remplacé les RNN sur de nombreuses tâches de langage."
      ],
      commonMistakes: [
        "Confondre état caché <code>h_t</code> et état de cellule <code>c_t</code> dans un LSTM.",
        "Voir les portes comme des décisions tout-ou-rien alors qu'elles prennent des valeurs continues entre 0 et 1.",
        "Dire que le transformeur est un RNN plus rapide : il abandonne justement la récurrence explicite."
      ],
      oralCheck: "Explique pourquoi un LSTM garde mieux l'information qu'un RNN simple, puis compare en une minute encodeur-decodeur, attention et transformeur."
    },
    assistant: {
      focus: "Faire comprendre les remedes : d'abord LSTM pour la memoire, puis attention et transformeurs pour depasser le goulot d'etranglement seq2seq.",
      mustInclude: [
        "Au moins un exercice qui interprete les trois portes d'un LSTM.",
        "Au moins un exercice sur le vecteur-contexte et le goulot d'etranglement.",
        "Au moins un exercice comparatif RNN vs transformeur."
      ],
      avoid: [
        "Ne pas rentrer dans tous les details de multi-head attention si ce n'est pas demande.",
        "Eviter de presenter le transformeur comme une boite noire magique sans lien avec les limites des RNN."
      ]
    }
  },

  "td-rnn-corriges": {
    review: {
      expectations: [
        "Écrire un script Python standard qui déroule un RNN simple avec une couche cachée, des poids aléatoires, tanh en caché et softmax en sortie.",
        "Préparer une série temporelle de prix en fenêtres glissantes de forme <code>(samples, time, features)</code> avant de l'envoyer dans un <code>SimpleRNN</code> Keras.",
        "Choisir correctement une sortie linéaire, une perte de type MSE et une métrique de régression pour une prédiction de prix.",
        "Construire les dictionnaires <code>char_indices</code> et <code>indices_char</code>, créer des exemples chevauchants et les encoder en one-hot pour un LSTM de génération de texte.",
        "Expliquer la boucle de génération caractère par caractère après entraînement."
      ],
      commonMistakes: [
        "Oublier que la sortie d'un problème de régression n'est ni une softmax ni une sigmoïde.",
        "Confondre <code>(samples, features)</code> et <code>(samples, time, features)</code> dans le TD de série temporelle.",
        "Créer les fenêtres glissantes sans respecter l'ordre temporel pour le train et le test.",
        "Construire les séquences de texte sans faire de paires (séquence, caractère suivant)."
      ],
      oralCheck: "Explique un TD RNN au choix de bout en bout : données, forme des tenseurs, architecture, loss, métrique, puis ce que tu affiches à la fin pour vérifier que ça tient debout."
    },
    assistant: {
      focus: "Faire passer l'étudiant de la théorie au geste : formes de tenseurs, choix de loss, code simple, et vérifications minimales pour ne pas se tromper de problème.",
      mustInclude: [
        "Au moins un exercice où l'étudiant vérifie explicitement les shapes du TD de série temporelle.",
        "Au moins un exercice où il explique pourquoi la sortie du modèle de prix est linéaire.",
        "Au moins un exercice où il raconte la génération de texte caractère par caractère."
      ],
      avoid: [
        "Ne pas proposer de versions inutilement sophistiquées des corrigés.",
        "Éviter de diluer les gestes de base sous trop d'optimisations ou de callbacks avancés."
      ]
    }
  },

  "rl-fondations-objectifs": {
    review: {
      expectations: [
        "Définir l'apprentissage par renforcement comme une boucle agent-environnement fondée sur essai-erreur.",
        "Identifier états, actions, rewards, stratégie et retour actualisé dans un exemple concret.",
        "Expliquer l'observabilité totale et la stationnarité.",
        "Comparer horizon fini, horizon infini actualisé et récompense moyenne.",
        "Distinguer l'AR de l'apprentissage supervisé et non supervisé."
      ],
      commonMistakes: [
        "Croire que le reward donne directement la bonne action à exécuter.",
        "Confondre état observé et reward reçu.",
        "Oublier que γ proche de 0 rend l'agent myope.",
        "Présenter l'AR comme une simple classification avec labels retardés."
      ],
      oralCheck: "Décris une tâche de robot ou de jeu sous forme agent, environnement, états, actions, rewards, puis explique pourquoi le choix de γ change le comportement."
    },
    assistant: {
      focus: "Installer la boucle agent-environnement et l'objectif long terme avant toute équation lourde.",
      mustInclude: [
        "Au moins un exercice d'identification S, A, rewards sur un exemple concret.",
        "Au moins un exercice sur le choix de γ.",
        "Une comparaison courte avec supervisé et non supervisé."
      ],
      avoid: [
        "Ne pas partir directement sur Q-Learning avant que reward, stratégie et retour soient clairs.",
        "Ne pas utiliser des exemples trop abstraits sans actions visibles."
      ]
    }
  },

  "rl-mdp-bellman": {
    review: {
      expectations: [
        "Définir la propriété de Markov et l'interpréter en langage simple.",
        "Lire une matrice de transition et vérifier que chaque ligne somme à 1.",
        "Exprimer une probabilité de trajectoire comme produit de transitions markoviennes.",
        "Écrire la valeur d'un état comme reward immédiat moyen plus futur actualisé.",
        "Définir un MDP par <code>S, A, T, R, γ</code> et écrire l'équation de Bellman."
      ],
      commonMistakes: [
        "Dire que Markov signifie que le passé n'a jamais compté, alors que l'état courant peut résumer ce passé.",
        "Oublier que <code>T(s,a,s')</code> est une probabilité conditionnelle.",
        "Mélanger récompense immédiate <code>R(s,a)</code> et valeur long terme <code>V(s)</code>.",
        "Construire une matrice de transition dont les lignes ne somment pas à 1."
      ],
      oralCheck: "Explique un MDP simple en grille, puis écris l'équation de Bellman en commentant reward immédiat, γ, transition et valeur future."
    },
    assistant: {
      focus: "Faire sentir que Bellman est une récursion intuitive avant d'être une formule.",
      mustInclude: [
        "Au moins un exercice sur une matrice de transition.",
        "Au moins un exercice demandant de définir S, A, T, R, γ.",
        "Une lecture terme par terme de l'équation de Bellman."
      ],
      avoid: [
        "Ne pas noyer l'étudiant dans des probabilités abstraites.",
        "Ne pas passer à l'optimalité sans distinguer valeur et reward."
      ]
    }
  },

  "rl-strategies-iteration": {
    review: {
      expectations: [
        "Distinguer stratégie déterministe et stratégie stochastique.",
        "Écrire et interpréter <code>Vπ(s)</code> et <code>V*(s)</code>.",
        "Lire l'équation de Bellman d'optimalité et extraire une stratégie optimale par argmax.",
        "Décrire Value Iteration avec initialisation, backups max, critère <code>ΔV &lt; ε</code> et extraction de π.",
        "Décrire Policy Iteration comme alternance évaluation/amélioration."
      ],
      commonMistakes: [
        "Confondre Value Iteration et Policy Iteration : l'une met à jour V, l'autre alterne sur π.",
        "Oublier que ces algorithmes supposent un modèle T et R connu.",
        "Lire <code>argmax</code> comme une valeur au lieu d'une action.",
        "Ne pas distinguer <code>Vπ</code> d'une valeur optimale <code>V*</code>."
      ],
      oralCheck: "Explique comment passer de Bellman d'optimalité à Value Iteration, puis comment récupérer une stratégie une fois V stabilisée."
    },
    assistant: {
      focus: "Ancrer les algorithmes de planning comme méthodes avec modèle connu.",
      mustInclude: [
        "Au moins un exercice de lecture de Bellman d'optimalité.",
        "Au moins un exercice comparatif Value Iteration / Policy Iteration.",
        "Une mention claire du critère d'arrêt de Value Iteration."
      ],
      avoid: [
        "Ne pas présenter ces méthodes comme model-free.",
        "Ne pas faire de preuve de convergence longue."
      ]
    }
  },

  "rl-qlearning-dyna": {
    review: {
      expectations: [
        "Distinguer model-based et model-free, et situer Dyna et Q-Learning.",
        "Définir <code>Q*(s,a)</code>, puis retrouver <code>V*(s)</code> et <code>π*(s)</code> par max/argmax.",
        "Expliquer exploration, exploitation et stratégie ε-greedy.",
        "Interpréter la mise à jour Q-Learning comme ancienne valeur + α fois l'erreur TD.",
        "Résumer les conditions de convergence : rewards bornés, visites suffisantes, facteur d'apprentissage adapté."
      ],
      commonMistakes: [
        "Confondre γ et α : γ actualise le futur, α règle la vitesse d'apprentissage.",
        "Oublier le <code>max_a'</code> dans la cible Q-Learning.",
        "Dire que Q-Learning nécessite de connaître T et R.",
        "Explorer trop peu et conclure trop vite qu'une action est mauvaise."
      ],
      oralCheck: "Calcule une mise à jour Q-Learning sur un petit exemple numérique, puis explique le rôle de ε, α et γ."
    },
    assistant: {
      focus: "Faire comprendre la mise à jour Q comme une correction vers une cible observée, avec le compromis exploration/exploitation.",
      mustInclude: [
        "Au moins un exercice numérique de mise à jour Q.",
        "Au moins un exercice sur ε-greedy.",
        "Une explication simple de model-based/model-free et de Dyna."
      ],
      avoid: [
        "Ne pas introduire deep Q-learning si la table Q n'est pas claire.",
        "Ne pas réduire la convergence à une phrase magique sans les conditions de visite et d'alpha."
      ]
    }
  }
};
})(window);
