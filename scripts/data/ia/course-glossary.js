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
// - recurrence, sequence, rnn, lstm, memoire, langage, attention, transformeur → famille "Récurrence & séquences"
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
    term: "Paramètre appris",
    text: "Valeur ajustée automatiquement pendant l'entraînement ou l'interaction, comme un poids, un biais, un filtre, une matrice récurrente, une embedding matrix ou une table Q.",
    aliases: ["paramètre du modèle", "poids appris", "paramètres appris"],
    tags: ["ml", "apprentissage", "parametre"]
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
  },
  {
    term: "Réseau feedforward",
    text: "Réseau sans cycle dans lequel l'information circule uniquement de l'entrée vers la sortie. Les réseaux denses classiques et les ConvNet standards sont feedforward.",
    aliases: ["feedforward", "feed-forward", "réseau acyclique"],
    tags: ["sequence", "architecture", "feedforward"]
  },
  {
    term: "Réseau récurrent",
    text: "Réseau de neurones comportant une boucle temporelle : à chaque pas, il combine l'entrée courante avec un état issu du pas précédent. Il est conçu pour traiter des séquences.",
    aliases: ["RNN", "réseau de neurones récurrent", "réseaux récurrents"],
    tags: ["rnn", "recurrence", "sequence"]
  },
  {
    term: "Couche récurrente",
    text: "Couche de neurones dont la sortie au temps t dépend à la fois de l'entrée courante et d'un état caché venu du temps précédent. C'est la vraie brique de base d'un RNN.",
    aliases: ["recurrent layer"],
    tags: ["rnn", "architecture", "sequence"]
  },
  {
    term: "Pas de temps",
    text: "Indice temporel noté en général t dans un RNN. Chaque pas correspond au traitement d'un élément supplémentaire de la séquence.",
    aliases: ["time step", "temps t"],
    tags: ["rnn", "sequence"]
  },
  {
    term: "Déroulage temporel",
    text: "Transformation conceptuelle d'un RNN replié avec boucle en une chaîne de copies du même bloc, une par pas de temps. Elle sert à comprendre le calcul et l'apprentissage.",
    aliases: ["unrolling", "dépliage dans le temps"],
    tags: ["rnn", "sequence", "architecture"]
  },
  {
    term: "Poids partagés dans le temps",
    text: "Principe selon lequel les mêmes matrices U, V et W sont réutilisées à chaque pas de temps d'un RNN déroulé. On n'apprend pas un nouveau jeu de poids pour chaque t.",
    aliases: ["shared weights through time", "partage de poids dans le temps"],
    tags: ["rnn", "sequence", "architecture"]
  },
  {
    term: "État caché",
    text: "Vecteur interne d'un RNN, noté en général <code>h_t</code>, qui résume ce que le réseau a déjà vu dans la séquence jusqu'au temps <code>t</code>.",
    aliases: ["hidden state", "état interne"],
    tags: ["rnn", "sequence", "memoire"]
  },
  {
    term: "Unités d'état",
    text: "Dans le réseau de Jordan, unités ajoutées à l'entrée pour recopier la sortie précédente du réseau vers le pas de temps suivant.",
    aliases: ["state units"],
    tags: ["rnn", "architecture", "sequence"]
  },
  {
    term: "Unités de contexte",
    text: "Dans le réseau d'Elman, unités qui recopient l'état caché précédent afin d'alimenter le calcul du pas de temps courant.",
    aliases: ["context units"],
    tags: ["rnn", "architecture", "sequence"]
  },
  {
    term: "Réseau de Jordan",
    text: "Architecture récurrente historique dans laquelle c'est la sortie précédente du réseau qui est recopiée vers des unités d'état à l'entrée pour influencer le pas de temps suivant.",
    aliases: ["Jordan network"],
    tags: ["rnn", "recurrence", "architecture"]
  },
  {
    term: "Réseau d'Elman",
    text: "Architecture récurrente historique dans laquelle c'est l'état caché précédent, et non la sortie du réseau, qui est recopié vers des unités de contexte.",
    aliases: ["Elman network"],
    tags: ["rnn", "recurrence", "architecture"]
  },
  {
    term: "Rétropropagation à travers le temps",
    text: "Adaptation de la rétropropagation aux réseaux récurrents. On déroule le réseau sur les pas de temps, puis on propage le gradient du dernier pas vers les premiers en accumulant les contributions sur les poids partagés.",
    aliases: ["BPTT", "backpropagation through time"],
    tags: ["rnn", "sequence", "gradient", "apprentissage", "bptt"]
  },
  {
    term: "Séquence temporelle",
    text: "Suite ordonnée de valeurs observées au fil du temps, comme un historique boursier, une mesure capteur ou un signal audio. Les RNN sont souvent utilisés sur ce type de données.",
    aliases: ["time series", "série temporelle"],
    tags: ["sequence", "rnn"]
  },
  {
    term: "Séquence à séquence",
    text: "Problème dans lequel une séquence d'entrée est transformée en une séquence de sortie. Les longueurs d'entrée et de sortie ne sont pas nécessairement égales.",
    aliases: ["Seq2Seq", "sequence-to-sequence"],
    tags: ["sequence", "langage", "architecture"]
  },
  {
    term: "Many-to-many",
    text: "Famille de problèmes où une séquence d'entrée produit une séquence de sortie. La traduction automatique est l'exemple classique.",
    aliases: ["plusieurs-à-plusieurs"],
    tags: ["sequence", "rnn", "langage"]
  },
  {
    term: "Many-to-one",
    text: "Famille de problèmes où une séquence d'entrée est résumée en une seule sortie. Exemple : analyse de sentiments d'un document.",
    aliases: ["plusieurs-à-un"],
    tags: ["sequence", "rnn", "langage"]
  },
  {
    term: "One-to-many",
    text: "Famille de problèmes où une entrée unique produit une séquence. Exemple : génération d'une légende textuelle à partir d'une image.",
    aliases: ["un-à-plusieurs"],
    tags: ["sequence", "rnn", "langage"]
  },
  {
    term: "Encodage one-hot",
    text: "Représentation d'un symbole discret par un grand vecteur contenant un seul 1 et des 0 ailleurs. Utile conceptuellement, mais peu compacte pour les grands vocabulaires.",
    aliases: ["one hot", "one-hot"],
    tags: ["sequence", "langage"]
  },
  {
    term: "Word embedding",
    text: "Représentation dense d'un mot par un vecteur réel de petite dimension, apprise ou fournie par un modèle. Elle remplace avantageusement l'encodage one-hot en NLP.",
    aliases: ["embedding", "word embeddings"],
    tags: ["sequence", "langage"]
  },
  {
    term: "NLP",
    text: "Traitement automatique du langage naturel : famille de tâches portant sur du texte ou de la parole transcrite, comme classification de texte, traduction, résumé ou modélisation du langage.",
    aliases: ["traitement automatique du langage naturel", "natural language processing", "TALN"],
    tags: ["sequence", "langage", "nlp"]
  },
  {
    term: "Tokenisation",
    text: "Découpage d'un texte en unités manipulables par le modèle, appelées tokens : mots, morceaux de mots, caractères ou symboles.",
    aliases: ["tokenizer", "tokens"],
    tags: ["sequence", "langage", "nlp", "tokenisation"]
  },
  {
    term: "Vocabulaire",
    text: "Ensemble des tokens connus par un modèle de langage ou un tokenizer. Sa taille influence la matrice d'embedding et la taille de la sortie softmax.",
    aliases: ["vocabulary", "vocab"],
    tags: ["sequence", "langage", "nlp", "vocabulaire"]
  },
  {
    term: "Longueur de contexte",
    text: "Nombre maximal de tokens ou de pas de temps qu'un modèle peut prendre en compte pour produire sa sortie.",
    aliases: ["context length", "fenêtre de contexte"],
    tags: ["sequence", "langage", "nlp", "longueur-contexte"]
  },
  {
    term: "Modélisation du langage",
    text: "Tâche qui consiste à apprendre une distribution de probabilité sur des suites de mots ou de caractères, par exemple en prédisant le mot suivant.",
    aliases: ["language modeling", "prédiction du mot suivant"],
    tags: ["sequence", "langage", "rnn"]
  },
  {
    term: "Mémoire courte",
    text: "Faiblesse d'un RNN standard qui peine à conserver de l'information utile sur de longues dépendances temporelles ou linguistiques.",
    aliases: ["short memory"],
    tags: ["rnn", "memoire", "sequence"]
  },
  {
    term: "LSTM",
    text: "Variante de RNN conçue pour mieux conserver l'information sur de longues séquences grâce à un état de cellule et trois portes apprises qui contrôlent ce qui est gardé, ajouté ou exposé.",
    aliases: ["Long Short-Term Memory"],
    tags: ["lstm", "rnn", "sequence", "architecture"]
  },
  {
    term: "État de cellule",
    text: "Mémoire interne d'un LSTM, notée <code>c_t</code>. Elle transporte l'information sur la durée et est modulée par les portes d'oubli et d'entrée.",
    aliases: ["cell state"],
    tags: ["lstm", "memoire", "sequence"]
  },
  {
    term: "Porte d'oubli",
    text: "Porte d'un LSTM qui décide quelle fraction de l'ancien état de cellule <code>c_{t-1}</code> est conservée au temps <code>t</code>.",
    aliases: ["forget gate"],
    tags: ["lstm", "sequence", "memoire"]
  },
  {
    term: "Porte d'entrée",
    text: "Porte d'un LSTM qui contrôle quelle fraction de l'état candidat est écrite dans l'état de cellule courant.",
    aliases: ["input gate"],
    tags: ["lstm", "sequence", "memoire"]
  },
  {
    term: "Porte de sortie",
    text: "Porte d'un LSTM qui contrôle quelle fraction de l'état de cellule courant est exposée en sortie cachée <code>h_t</code>.",
    aliases: ["output gate"],
    tags: ["lstm", "sequence", "memoire"]
  },
  {
    term: "État candidat",
    text: "Nouvelle information potentielle calculée dans un LSTM avant d'être filtrée par la porte d'entrée et injectée dans l'état de cellule.",
    aliases: ["candidate state", "c tilde"],
    tags: ["lstm", "sequence", "memoire"]
  },
  {
    term: "Connexions peephole",
    text: "Variante de LSTM dans laquelle certaines portes dépendent aussi de l'état de cellule précédent, ce qui leur permet de \"regarder\" directement la mémoire interne.",
    aliases: ["peephole connections", "peephole"],
    tags: ["lstm", "sequence", "architecture"]
  },
  {
    term: "Encodeur-décodeur",
    text: "Architecture Seq2Seq composée de deux réseaux : un encodeur lit la séquence source et un décodeur produit la séquence cible à partir d'une représentation intermédiaire.",
    aliases: ["encoder-decoder", "encodeur decodeur"],
    tags: ["sequence", "architecture", "attention"]
  },
  {
    term: "Vecteur-contexte",
    text: "Vecteur produit par l'encodeur dans une architecture encodeur-décodeur pour résumer la séquence source avant sa transmission au décodeur.",
    aliases: ["context vector", "contexte"],
    tags: ["sequence", "langage", "attention"]
  },
  {
    term: "Attention",
    text: "Mécanisme qui attribue un poids d'importance aux différentes positions d'une séquence source afin de se concentrer sur les éléments pertinents pour la prédiction en cours.",
    tags: ["attention", "sequence", "architecture"]
  },
  {
    term: "Transformeur",
    text: "Architecture de traitement de séquences fondée sur l'attention et non sur la récurrence explicite. Elle traite les positions en parallèle, ce qui facilite fortement le passage à l'échelle.",
    aliases: ["Transformer", "transformers"],
    tags: ["transformeur", "attention", "sequence", "architecture"]
  },
  {
    term: "Explosion du gradient",
    text: "Phénomène où le gradient devient très grand pendant l'entraînement, en particulier lorsqu'il est rétropropagé sur de longues séquences. Il peut rendre l'optimisation instable ou divergente.",
    aliases: ["exploding gradient"],
    tags: ["gradient", "apprentissage", "rnn", "sequence"]
  },
  {
    term: "Fenêtre glissante",
    text: "Sous-séquence de longueur fixe extraite d'une série temporelle ou d'un texte pour fabriquer un exemple d'entraînement. Très utilisée dans les TD RNN sur séries de prix et génération de texte.",
    aliases: ["sliding window"],
    tags: ["sequence", "rnn"]
  },
  {
    term: "Génération caractère par caractère",
    text: "Procédé dans lequel un modèle lit une séquence de caractères, prédit le suivant, l'ajoute à la séquence, puis recommence pour produire un texte progressivement.",
    aliases: ["character-level generation", "génération de texte"],
    tags: ["sequence", "rnn", "lstm", "langage"]
  },
  {
    term: "Apprentissage par renforcement",
    text: "Famille d'apprentissage où un agent apprend à agir par interactions avec un environnement, en utilisant des récompenses ou punitions comme signal d'amélioration.",
    aliases: ["AR", "RL", "reinforcement learning"],
    tags: ["renforcement", "rl", "ar"]
  },
  {
    term: "Agent",
    text: "Entité qui observe l'état de l'environnement, choisit une action et apprend progressivement une stratégie pour maximiser ses récompenses à long terme.",
    tags: ["renforcement", "agent", "rl"]
  },
  {
    term: "Environnement",
    text: "Monde dans lequel l'agent agit. Il reçoit une action, renvoie un nouvel état et un signal de récompense.",
    tags: ["renforcement", "environnement", "rl"]
  },
  {
    term: "État en renforcement",
    text: "Description de la situation courante de l'environnement dans un problème d'apprentissage par renforcement. On le note souvent <code>s</code> ou <code>S_t</code>.",
    aliases: ["état RL", "state"],
    tags: ["renforcement", "rl", "markov"]
  },
  {
    term: "Action",
    text: "Décision exécutée par l'agent dans un état donné. Une action influence le reward reçu et le prochain état.",
    tags: ["renforcement", "rl", "agent"]
  },
  {
    term: "Signal de renforcement",
    text: "Retour scalaire envoyé à l'agent après une action. Il peut être positif, négatif ou nul selon la conséquence observée.",
    aliases: ["reinforcement signal"],
    tags: ["renforcement", "reward", "rl"]
  },
  {
    term: "Récompense",
    text: "Signal positif ou valeur scalaire qui indique qu'une conséquence est favorable pour l'objectif de l'agent.",
    aliases: ["reward"],
    tags: ["renforcement", "reward", "rl"]
  },
  {
    term: "Punition",
    text: "Signal négatif ou reward défavorable indiquant qu'une action a conduit à une conséquence mauvaise pour l'agent.",
    aliases: ["penalty"],
    tags: ["renforcement", "reward", "rl"]
  },
  {
    term: "Fonction de récompense",
    text: "Fonction qui associe à un état, ou à un couple état-action, le reward moyen attendu. Dans un MDP, on l'écrit souvent <code>R(s,a)</code>.",
    aliases: ["reward function"],
    tags: ["renforcement", "reward", "mdp"]
  },
  {
    term: "Stratégie",
    text: "Comportement de l'agent. Une stratégie déterministe associe une action à chaque état ; une stratégie stochastique donne une probabilité à chaque action.",
    aliases: ["policy", "politique"],
    tags: ["renforcement", "strategie", "policy"]
  },
  {
    term: "Observabilité totale",
    text: "Hypothèse selon laquelle l'agent observe directement l'état réel de l'environnement. Dans le cours, cela correspond à prendre la fonction d'entrée <code>I</code> comme identité.",
    aliases: ["full observability"],
    tags: ["renforcement", "rl"]
  },
  {
    term: "Stationnarité",
    text: "Hypothèse selon laquelle les probabilités de transition et de reward ne changent pas au cours du temps.",
    aliases: ["stationarity"],
    tags: ["renforcement", "markov", "rl"]
  },
  {
    term: "Retour actualisé",
    text: "Somme des récompenses futures pondérées par le facteur d'actualisation <code>γ</code>. On le note souvent <code>G_t</code>.",
    aliases: ["return", "discounted return", "gain actualisé"],
    tags: ["renforcement", "reward", "rl"]
  },
  {
    term: "Facteur d'actualisation",
    text: "Paramètre <code>γ</code> compris entre 0 et 1 qui contrôle l'importance accordée aux récompenses futures.",
    aliases: ["gamma", "discount factor"],
    tags: ["renforcement", "reward", "rl"]
  },
  {
    term: "Épisode",
    text: "Séquence d'interactions entre l'agent et l'environnement, depuis un état initial jusqu'à un état terminal.",
    aliases: ["episode"],
    tags: ["renforcement", "rl"]
  },
  {
    term: "État terminal",
    text: "État qui met fin à un épisode, par exemple une victoire, une défaite, une collision ou la fin d'une trajectoire.",
    aliases: ["terminal state"],
    tags: ["renforcement", "rl"]
  },
  {
    term: "Processus stochastique",
    text: "Famille de variables aléatoires indexées par le temps. Les chaînes de Markov utilisées en AR en sont un exemple.",
    tags: ["renforcement", "markov"]
  },
  {
    term: "Propriété de Markov",
    text: "Propriété selon laquelle le futur dépend du présent mais pas de tout l'historique, une fois l'état courant connu.",
    aliases: ["Markov property"],
    tags: ["renforcement", "markov", "mdp"]
  },
  {
    term: "Chaîne de Markov",
    text: "Suite de variables aléatoires à valeurs dans un espace d'états fini ou dénombrable et vérifiant la propriété de Markov.",
    aliases: ["Markov chain"],
    tags: ["renforcement", "markov"]
  },
  {
    term: "Matrice de transition",
    text: "Matrice contenant les probabilités de passer d'un état à un autre dans une chaîne de Markov. Chaque ligne est une distribution et somme à 1.",
    aliases: ["transition matrix"],
    tags: ["renforcement", "markov", "transition"]
  },
  {
    term: "Processus de décision markovien",
    text: "Modèle formel d'un problème d'AR défini par un ensemble d'états, un ensemble d'actions, une fonction de transition, une fonction de récompense et un facteur d'actualisation.",
    aliases: ["MDP", "Markov Decision Process"],
    tags: ["renforcement", "mdp", "markov"]
  },
  {
    term: "Fonction de transition",
    text: "Fonction <code>T(s,a,s')</code> qui donne la probabilité de passer à l'état <code>s'</code> après avoir exécuté l'action <code>a</code> dans l'état <code>s</code>.",
    aliases: ["transition function"],
    tags: ["renforcement", "transition", "mdp"]
  },
  {
    term: "Fonction valeur",
    text: "Fonction qui associe à un état la récompense cumulée moyenne attendue à partir de cet état, éventuellement sous une stratégie donnée.",
    aliases: ["value function", "V(s)", "Vπ"],
    tags: ["renforcement", "bellman", "mdp"]
  },
  {
    term: "Valeur optimale",
    text: "Meilleure valeur possible d'un état lorsque l'agent suit une stratégie optimale. On la note <code>V*(s)</code>.",
    aliases: ["optimal value", "V star"],
    tags: ["renforcement", "bellman", "policy"]
  },
  {
    term: "Équation de Bellman",
    text: "Équation récursive reliant la valeur d'un état à son reward immédiat et aux valeurs actualisées des états suivants.",
    aliases: ["Bellman equation"],
    tags: ["renforcement", "bellman", "mdp"]
  },
  {
    term: "Bellman d'optimalité",
    text: "Version optimale de l'équation de Bellman qui choisit l'action maximisant reward immédiat plus valeur future attendue.",
    aliases: ["Bellman optimality equation"],
    tags: ["renforcement", "bellman", "policy"]
  },
  {
    term: "Value Iteration",
    text: "Algorithme de programmation dynamique qui met à jour les valeurs des états par backups Bellman max jusqu'à convergence vers <code>V*</code>.",
    tags: ["renforcement", "planning", "bellman"]
  },
  {
    term: "Policy Iteration",
    text: "Algorithme de programmation dynamique qui alterne évaluation d'une stratégie et amélioration de cette stratégie jusqu'à stabilisation.",
    tags: ["renforcement", "planning", "policy"]
  },
  {
    term: "Model-based",
    text: "Famille de méthodes d'AR qui estiment ou utilisent un modèle de l'environnement, c'est-à-dire les fonctions de transition et de reward.",
    aliases: ["méthode avec modèle"],
    tags: ["renforcement", "model-based", "modele"]
  },
  {
    term: "Model-free",
    text: "Famille de méthodes d'AR qui apprennent directement une stratégie ou une fonction de valeur sans construire explicitement un modèle de transition et de reward.",
    aliases: ["méthode sans modèle"],
    tags: ["renforcement", "model-free", "modele"]
  },
  {
    term: "Dyna",
    text: "Méthode model-based qui met à jour un modèle à partir des vraies transitions, puis l'utilise pour effectuer des mises à jour simulées supplémentaires.",
    tags: ["renforcement", "dyna", "model-based"]
  },
  {
    term: "Q-Learning",
    text: "Méthode model-free qui apprend la valeur des couples état-action <code>Q(s,a)</code>, puis choisit les actions de valeur maximale.",
    aliases: ["Q learning", "qlearning"],
    tags: ["renforcement", "qlearning", "model-free"]
  },
  {
    term: "Fonction Q",
    text: "Fonction qui donne la qualité d'un couple état-action, c'est-à-dire la récompense cumulée attendue si l'agent exécute cette action puis agit optimalement.",
    aliases: ["Q function", "action-value function", "Q(s,a)"],
    tags: ["renforcement", "q", "qlearning"]
  },
  {
    term: "Exploration",
    text: "Choix volontaire d'actions incertaines ou aléatoires pour découvrir de meilleurs comportements possibles.",
    tags: ["renforcement", "exploration", "rl"]
  },
  {
    term: "Exploitation",
    text: "Choix de l'action actuellement estimée comme la meilleure selon la fonction de valeur ou la fonction Q.",
    tags: ["renforcement", "exploitation", "rl"]
  },
  {
    term: "ε-greedy",
    text: "Stratégie de choix d'action qui exploite avec probabilité <code>1 − ε</code> et explore au hasard avec probabilité <code>ε</code>.",
    aliases: ["epsilon-greedy", "e-greedy"],
    tags: ["renforcement", "exploration", "exploitation"]
  },
  {
    term: "Facteur d'apprentissage",
    text: "Paramètre <code>α</code> de la mise à jour Q-Learning qui contrôle le poids accordé à la nouvelle observation par rapport à l'ancienne estimation.",
    aliases: ["learning rate", "alpha"],
    tags: ["renforcement", "qlearning", "apprentissage"]
  },
  {
    term: "Cible TD",
    text: "Quantité observée vers laquelle on rapproche une estimation de valeur. En Q-Learning, elle vaut <code>r + γ max_a' Q(s',a')</code>.",
    aliases: ["TD target", "temporal-difference target"],
    tags: ["renforcement", "qlearning", "bellman"]
  },
  {
    term: "Erreur TD",
    text: "Différence entre la cible TD et l'estimation actuelle. Elle indique dans quel sens corriger la valeur apprise.",
    aliases: ["TD error", "temporal-difference error"],
    tags: ["renforcement", "qlearning", "bellman"]
  },
  {
    term: "Machine Learning",
    text: "Famille de méthodes où un modèle apprend à partir de données pour améliorer ses prédictions ou décisions sur de nouveaux exemples.",
    aliases: ["ML", "apprentissage automatique"],
    tags: ["ml", "donnees"]
  },
  {
    term: "Dataset",
    text: "Ensemble d'exemples utilisés pour entraîner, valider ou tester un modèle. Il contient souvent des features <code>X</code> et parfois des labels <code>y</code>.",
    aliases: ["jeu de données", "données"],
    tags: ["ml", "dataset", "donnees"]
  },
  {
    term: "Feature",
    text: "Variable d'entrée utilisée par un modèle pour faire une prédiction : pixel, âge, prix d'hier, mot, mesure capteur, etc.",
    aliases: ["variable explicative", "caractéristique"],
    tags: ["ml", "feature", "donnees"]
  },
  {
    term: "Label",
    text: "Valeur cible à prédire dans un problème supervisé, par exemple une classe ou une valeur continue.",
    aliases: ["cible", "target", "étiquette"],
    tags: ["ml", "label", "donnees"]
  },
  {
    term: "Classification",
    text: "Tâche supervisée où le modèle prédit une catégorie discrète, comme spam/non-spam ou chat/chien.",
    tags: ["ml", "classification", "metrique"]
  },
  {
    term: "Régression",
    text: "Tâche supervisée où le modèle prédit une valeur continue, comme un prix, une température ou une durée.",
    aliases: ["regression"],
    tags: ["ml", "regression", "metrique"]
  },
  {
    term: "Jeu d'entraînement",
    text: "Partie des données utilisée pour ajuster les paramètres du modèle.",
    aliases: ["train set", "training set"],
    tags: ["ml", "validation", "dataset"]
  },
  {
    term: "Jeu de validation",
    text: "Partie des données utilisée pour choisir les hyperparamètres, comparer les modèles et décider quand arrêter l'entraînement.",
    aliases: ["validation set"],
    tags: ["ml", "validation", "dataset"]
  },
  {
    term: "Jeu de test",
    text: "Partie des données gardée de côté jusqu'à la fin pour estimer honnêtement la performance finale du modèle.",
    aliases: ["test set"],
    tags: ["ml", "validation", "dataset"]
  },
  {
    term: "Généralisation",
    text: "Capacité d'un modèle à produire de bonnes prédictions sur des exemples nouveaux, non vus pendant l'entraînement.",
    aliases: ["generalization"],
    tags: ["ml", "generalisation", "overfitting"]
  },
  {
    term: "Sous-apprentissage",
    text: "Situation où le modèle est trop simple ou mal entraîné pour capturer la structure des données. Il est mauvais sur train et sur validation.",
    aliases: ["underfitting"],
    tags: ["ml", "underfitting", "generalisation"]
  },
  {
    term: "Compromis biais-variance",
    text: "Lecture de l'erreur de généralisation : trop de biais mène au sous-apprentissage, trop de variance mène au sur-apprentissage.",
    aliases: ["bias-variance tradeoff"],
    tags: ["ml", "biais-variance", "generalisation"]
  },
  {
    term: "Data leakage",
    text: "Fuite de données : information du test, de la validation ou du futur qui se retrouve dans l'entraînement ou le choix du modèle, faussant le score.",
    aliases: ["fuite de données", "leakage"],
    tags: ["ml", "leakage", "validation"]
  },
  {
    term: "Baseline",
    text: "Modèle ou règle simple servant de point de comparaison minimal avant de justifier un modèle plus complexe.",
    aliases: ["modèle de référence"],
    tags: ["ml", "baseline", "evaluation"]
  },
  {
    term: "Hold-out",
    text: "Méthode d'évaluation qui consiste à séparer une fois les données en train, validation et/ou test.",
    aliases: ["train-test split"],
    tags: ["ml", "validation"]
  },
  {
    term: "Validation croisée",
    text: "Méthode d'évaluation qui répète l'entraînement et la validation sur plusieurs découpages afin d'obtenir une estimation plus robuste du score.",
    aliases: ["cross-validation", "validation croisee"],
    tags: ["ml", "cross-validation", "validation"]
  },
  {
    term: "K-fold",
    text: "Forme de validation croisée où les données sont divisées en k blocs ; chaque bloc sert une fois de validation pendant que les autres servent d'entraînement.",
    aliases: ["k-fold cross-validation"],
    tags: ["ml", "cross-validation", "validation"]
  },
  {
    term: "Stratification",
    text: "Technique de découpage qui conserve approximativement les proportions des classes dans chaque split ou fold.",
    aliases: ["stratified split", "stratified k-fold"],
    tags: ["ml", "validation", "classification"]
  },
  {
    term: "Classes déséquilibrées",
    text: "Situation où certaines classes sont beaucoup plus fréquentes que d'autres, rendant l'accuracy souvent trompeuse.",
    aliases: ["class imbalance", "déséquilibre de classes"],
    tags: ["ml", "classification", "metrique"]
  },
  {
    term: "Precision",
    text: "Métrique de classification : parmi les exemples prédits positifs, proportion qui est réellement positive. Formule : <code>TP / (TP + FP)</code>.",
    aliases: ["précision"],
    tags: ["ml", "classification", "metrique"]
  },
  {
    term: "Recall",
    text: "Métrique de classification : parmi les vrais positifs, proportion retrouvée par le modèle. Formule : <code>TP / (TP + FN)</code>.",
    aliases: ["rappel", "sensibilité", "sensitivity"],
    tags: ["ml", "classification", "metrique"]
  },
  {
    term: "F1-score",
    text: "Moyenne harmonique de la precision et du recall. Utile quand on veut équilibrer faux positifs et faux négatifs.",
    aliases: ["F1", "score F1"],
    tags: ["ml", "classification", "metrique"]
  },
  {
    term: "F1 macro",
    text: "Moyenne non pondérée des F1-scores calculés classe par classe. Elle donne le même poids aux classes rares et fréquentes.",
    aliases: ["macro F1", "F1-score macro"],
    tags: ["ml", "classification", "metrique"]
  },
  {
    term: "Balanced accuracy",
    text: "Moyenne des recalls par classe. Elle est plus informative que l'accuracy brute quand les classes sont déséquilibrées.",
    aliases: ["accuracy équilibrée", "balanced acc"],
    tags: ["ml", "classification", "metrique"]
  },
  {
    term: "GroupKFold",
    text: "Validation croisée où tous les exemples d'un même groupe restent dans le même fold. Utile lorsqu'il existe plusieurs lignes par patient, client ou document.",
    aliases: ["split par groupe", "validation groupée"],
    tags: ["ml", "cross-validation", "validation"]
  },
  {
    term: "Nested cross-validation",
    text: "Validation croisée imbriquée : une boucle interne règle les hyperparamètres, une boucle externe estime la performance de cette procédure de sélection.",
    aliases: ["nested CV", "validation croisée imbriquée"],
    tags: ["ml", "cross-validation", "validation"]
  },
  {
    term: "Calibration",
    text: "Qualité d'un modèle dont les probabilités annoncées correspondent aux fréquences observées. Par exemple, les prédictions à 0.8 devraient être correctes environ 80 % du temps.",
    aliases: ["calibration des probabilités"],
    tags: ["ml", "classification", "evaluation"]
  },
  {
    term: "Seuil de décision",
    text: "Valeur à partir de laquelle une probabilité prédite est convertie en classe positive. Modifier le seuil change le compromis precision/recall.",
    aliases: ["decision threshold", "threshold"],
    tags: ["ml", "classification", "seuil"]
  },
  {
    term: "ROC-AUC",
    text: "Aire sous la courbe ROC, qui évalue la capacité du modèle à classer les positifs au-dessus des négatifs sur différents seuils.",
    aliases: ["AUC", "aire sous la courbe ROC"],
    tags: ["ml", "auc", "classification"]
  },
  {
    term: "PR-AUC",
    text: "Aire sous la courbe précision-rappel, souvent plus informative que ROC-AUC lorsque la classe positive est rare.",
    aliases: ["precision-recall AUC"],
    tags: ["ml", "auc", "classification"]
  },
  {
    term: "MAE",
    text: "Mean Absolute Error : moyenne des erreurs absolues en régression. Elle se lit dans la même unité que la cible.",
    aliases: ["mean absolute error", "erreur absolue moyenne"],
    tags: ["ml", "regression", "metrique"]
  },
  {
    term: "MSE",
    text: "Mean Squared Error : moyenne des erreurs au carré. Elle pénalise fortement les grosses erreurs.",
    aliases: ["mean squared error", "erreur quadratique moyenne"],
    tags: ["ml", "regression", "metrique"]
  },
  {
    term: "RMSE",
    text: "Racine carrée de la MSE. Elle pénalise les grosses erreurs tout en revenant dans l'unité de la cible.",
    aliases: ["root mean squared error"],
    tags: ["ml", "regression", "metrique"]
  },
  {
    term: "R²",
    text: "Métrique de régression qui mesure la part de variance expliquée par le modèle par rapport à une prédiction de moyenne.",
    aliases: ["R2", "coefficient de détermination"],
    tags: ["ml", "regression", "metrique"]
  },
  {
    term: "Sélection d'hyperparamètres",
    text: "Processus de choix des réglages non appris directement par le modèle, comme la profondeur, le taux d'apprentissage ou la régularisation, à partir de la validation.",
    aliases: ["hyperparameter tuning"],
    tags: ["ml", "validation", "optimisation"]
  },
  {
    term: "Pipeline ML",
    text: "Chaîne complète qui enchaîne prétraitement, entraînement et évaluation de manière reproductible, en évitant les fuites de données.",
    aliases: ["pipeline machine learning"],
    tags: ["ml", "validation", "dataset"]
  }
]);
})(window);
