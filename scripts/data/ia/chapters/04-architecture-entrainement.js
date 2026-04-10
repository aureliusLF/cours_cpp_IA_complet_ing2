(function registerChapterBundle4(globalScope) {
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
  order: 4,
  chapter: {
    id: "architecture-entrainement",
    shortTitle: "Architecture",
    title: "Assembler et entraîner un ConvNet",
    level: "Fondations",
    duration: "1 h 30",
    track: "IA1",
    summary:
      "On a toutes les briques : convolution, pooling, ReLU, dropout, batch norm. Il est temps de les assembler en un vrai ConvNet, de le faire tourner, et d'apprendre à lire ce qu'il fait. Ce chapitre couvre l'architecture typique, l'énumération des hyperparamètres, le cycle forward/backprop/update, les optimiseurs modernes, et les réflexes de diagnostic à avoir pendant et après l'entraînement.",
    goals: [
      "décrire et reconnaître l'architecture typique d'un ConvNet de classification",
      "énumérer les hyperparamètres à fixer avant d'entraîner un modèle",
      "expliquer le cycle forward pass → perte → rétropropagation → mise à jour",
      "comparer SGD, SGD momentum, RMSProp et Adam et savoir quand choisir lequel",
      "lire une courbe train/val et diagnostiquer sur-apprentissage ou sous-apprentissage",
      "choisir une métrique adaptée au problème (accuracy, précision, rappel, F1)",
      "citer quelques références pour aller plus loin"
    ],
    highlights: [
      "pipeline",
      "rétropropagation",
      "Adam",
      "early stopping",
      "matrice de confusion",
      "métriques"
    ],
    body: [
      lesson(
        "L'architecture typique d'un ConvNet de classification",
        paragraphs(
          "Un ConvNet classique suit une recette remarquablement stable. On alterne des blocs <strong>Conv → (BatchNorm) → ReLU → Pool</strong> plusieurs fois — chaque bloc réduit la taille spatiale et augmente le nombre de feature maps — puis on termine par une ou plusieurs couches entièrement connectées qui prennent la décision finale, avec un <strong>softmax</strong> à la toute fin pour un classifieur multi-classes."
        ),
        fig("convnetPipeline", "Image → Conv → ReLU → Pool → Conv → ReLU → Pool → FC → Softmax : la forme canonique d'un ConvNet de classification."),
        code(
          "text",
          `
Input  →  Conv  →  ReLU  →  Pool  →  Conv  →  ReLU  →  Pool  →  ... →  FC  →  Softmax

Dimensions spatiales qui diminuent       Nombre de feature maps qui augmente
<----------------------------            ---------------------->
(32 x 32 -> 16 x 16 -> 8 x 8)            (3 -> 32 -> 64 -> 128)
          `,
          "Forme typique d'un ConvNet"
        ),
        paragraphs(
          "La règle de conception empirique : à chaque bloc Conv → Pool, on <strong>double le nombre de feature maps</strong> tout en <strong>divisant par deux la taille spatiale</strong>. L'idée sous-jacente : au fur et à mesure qu'on monte en niveau d'abstraction, il faut plus de canaux pour exprimer les concepts de haut niveau (beaucoup de types de motifs), mais on peut se permettre une résolution spatiale plus faible (la position exacte importe moins)."
        ),
        formula(
          `<span class="pipeline"><span class="group">Input</span><span class="arrow">→</span><span class="group">Conv <span class="arrow" style="padding:0 0.15em">→</span> Pool</span><span class="arrow" style="padding:0 0.3em">×&nbsp;<var>n</var></span><span class="arrow">→</span><span class="group">FC</span><span class="arrow">→</span><span class="group">Softmax</span></span>`,
          { caption: "La structure compacte : on répète n blocs Conv-Pool, puis on classifie." }
        )
      ),

      lesson(
        "Les hyperparamètres à fixer",
        paragraphs(
          "Avant d'entraîner un ConvNet, il faut <strong>choisir à la main</strong> une bonne dizaine de valeurs qu'aucune partie du modèle n'apprendra. C'est ce qu'on appelle les <em>hyperparamètres</em>. Voici la liste complète, regroupée par famille :"
        ),
        table(
          ["Famille", "Hyperparamètre", "Choix typiques"],
          [
            ["Architecture", "Nombre de couches Conv", "2 à 100 (selon la profondeur visée)"],
            ["Architecture", "Taille des filtres", "3 × 3 le plus souvent, parfois 5 × 5 ou 7 × 7"],
            ["Architecture", "Nombre de filtres par couche", "32, 64, 128, 256 (on double à chaque bloc)"],
            ["Architecture", "Stride et padding", "stride = 1, padding = « same » par défaut"],
            ["Pooling", "Type de pooling", "max-pooling, taille 2 × 2, stride 2"],
            ["Régularisation", "Taux de dropout", "0 (aucun) à 0.5 (agressif)"],
            ["Régularisation", "Batch normalization", "oui ou non, généralement après chaque Conv"],
            ["Optimisation", "Optimiseur", "Adam par défaut, SGD momentum pour les gros projets"],
            ["Optimisation", "Taux d'apprentissage", "10⁻³ à 10⁻⁴ par défaut"],
            ["Optimisation", "Taille du mini-batch", "32, 64, 128, 256"],
            ["Optimisation", "Nombre d'epochs", "10 à 200 selon la taille du dataset"],
            ["Régularisation", "Data augmentation", "flip, rotation, crop, color jitter..."]
          ]
        ),
        callout(
          "warn",
          "Ne pas régler tout en même temps",
          "Résister à la tentation de tout changer en même temps. La règle d'or : un hyperparamètre à la fois. Commence par le taux d'apprentissage (c'est le plus impactant), puis la taille du modèle, puis les régularisations. Tenir un petit journal des expériences (avec les courbes) vaut tout l'or du monde quand on cherche à comprendre pourquoi une configuration marche mieux qu'une autre."
        )
      ),

      lesson(
        "Le cycle d'apprentissage : forward, backprop, update",
        paragraphs(
          "Entraîner un ConvNet, c'est répéter inlassablement quatre étapes sur chaque mini-batch de données."
        ),
        bullets([
          "<strong>1. Forward pass</strong> : on injecte le mini-batch en entrée du réseau, les couches le transforment successivement, et on obtient un vecteur de prédictions en sortie.",
          "<strong>2. Calcul de la perte</strong> : on compare les prédictions à la vérité terrain (les étiquettes) avec une fonction de perte — entropie croisée en classification, erreur quadratique en régression.",
          "<strong>3. Rétropropagation</strong> : on propage l'erreur de la sortie vers l'entrée en appliquant la règle de dérivation en chaîne, pour calculer le gradient de la perte par rapport à chaque poids du réseau.",
          "<strong>4. Mise à jour</strong> : l'optimiseur utilise ces gradients pour ajuster les poids d'un petit pas dans la direction qui diminue la perte."
        ]),
        paragraphs(
          "La <strong>rétropropagation</strong> n'est pas une magie noire : c'est simplement l'application systématique de la règle de dérivation en chaîne, couche par couche, de la sortie vers l'entrée. Pour chaque poids <var>w</var>, on veut savoir : « si j'augmente <var>w</var> un tout petit peu, de combien la perte <var>L</var> change-t-elle ? » La réponse est <code>∂L/∂w</code>, et la règle de chaîne permet de calculer ce gradient en réutilisant les gradients calculés dans les couches plus profondes."
        ),
        formula(
          `<span class="fraction"><span class="num">∂<var>L</var></span><span class="den">∂<var>w</var></span></span> <span class="op">=</span> <span class="fraction"><span class="num">∂<var>L</var></span><span class="den">∂<var>y</var></span></span> · <span class="fraction"><span class="num">∂<var>y</var></span><span class="den">∂<var>w</var></span></span>`,
          { caption: "Règle de dérivation en chaîne : le gradient traverse le réseau couche par couche." }
        ),
        callout(
          "info",
          "Ce que fait le framework pour toi",
          "En PyTorch ou TensorFlow, tu n'écris jamais la rétropropagation à la main. Tu construis le forward pass avec des couches, tu calcules la perte, et un simple appel fait tout le travail du backward pass. Le framework garde la trace des opérations effectuées (le <em>graphe de calcul</em>) et applique la règle de chaîne automatiquement."
        )
      ),

      lesson(
        "Descente de gradient et optimiseurs modernes",
        paragraphs(
          "Une fois les gradients calculés, il faut décider comment s'en servir. L'algorithme le plus simple s'appelle la <strong>descente de gradient stochastique</strong> (SGD) : pour chaque paramètre, on fait <code>w ← w − η · ∂L/∂w</code>, où <var>η</var> est le <em>taux d'apprentissage</em>. On avance d'un petit pas dans la direction opposée au gradient."
        ),
        fig("gradientDescent2D", "La descente de gradient : une bille qui roule vers le fond d'une vallée, par petits pas."),
        paragraphs(
          "Cette SGD brute fonctionne mais a deux défauts majeurs : elle est sensible au choix du taux d'apprentissage, et elle a du mal dans les <em>ravins</em> du paysage de perte (zones allongées où le gradient oscille d'un côté à l'autre au lieu d'avancer). Les optimiseurs modernes améliorent ce comportement en combinant deux idées :"
        ),
        bullets([
          "<strong>Momentum</strong> : au lieu de suivre uniquement le gradient courant, on garde une moyenne mobile des gradients précédents, comme une bille qui prend de l'élan. Ça lisse les oscillations et accélère dans les directions cohérentes.",
          "<strong>Taux d'apprentissage adaptatif par paramètre</strong> : au lieu d'un unique <var>η</var> pour tous les poids, chaque paramètre a son propre pas, ajusté automatiquement selon l'historique de ses gradients. Les paramètres rarement mis à jour avancent plus vite, ceux qui oscillent avancent moins vite."
        ]),
        table(
          ["Optimiseur", "Momentum", "Pas adaptatif", "Quand l'utiliser"],
          [
            ["SGD", "Non", "Non", "Baseline, études théoriques"],
            ["SGD + momentum", "Oui (β ≈ 0.9)", "Non", "Compétitions ImageNet, gros modèles image"],
            ["RMSProp", "Partiel", "Oui", "Réseaux récurrents, cas particuliers"],
            ["Adam", "Oui (β₁ ≈ 0.9)", "Oui (β₂ ≈ 0.999)", "Choix par défaut pour presque tout"]
          ]
        ),
        callout(
          "success",
          "Règle de pouce",
          "Commence toujours avec <strong>Adam</strong> et un taux d'apprentissage de <code>10⁻³</code>. Ça marche dans 90 % des cas. Si tu vises les meilleurs scores sur un benchmark image, essaie ensuite <strong>SGD + momentum</strong> avec un taux d'apprentissage plus grand (~10⁻¹) et un <em>scheduler</em> qui le divise progressivement — c'est souvent un peu meilleur mais demande plus de réglage."
        )
      ),

      lesson(
        "Lire une courbe train/val",
        paragraphs(
          "Pendant l'entraînement, on suit deux courbes : la <strong>perte sur le jeu d'entraînement</strong> (ce que le modèle voit) et la <strong>perte sur le jeu de validation</strong> (un jeu mis de côté qu'il ne voit jamais). Leur comportement relatif raconte tout ce qu'il faut savoir."
        ),
        table(
          ["Forme des courbes", "Diagnostic", "Remède"],
          [
            ["Les deux restent élevées et plates", "Sous-apprentissage : le modèle n'est pas assez puissant ou mal optimisé", "Modèle plus gros, plus d'epochs, meilleur taux d'apprentissage"],
            ["Train descend, val descend aussi", "Entraînement sain, continuer", "Rien, juste attendre la convergence"],
            ["Train descend, val se stabilise puis remonte", "Sur-apprentissage classique", "Plus de dropout, data augmentation, early stopping"],
            ["Train descend vite, val très au-dessus", "Sur-apprentissage sévère, modèle trop gros", "Réduire la capacité, augmenter le dataset"],
            ["Les deux oscillent sans converger", "Taux d'apprentissage trop élevé", "Baisser le learning rate d'un facteur 10"]
          ]
        ),
        paragraphs(
          "L'<strong>early stopping</strong> est la technique la plus simple pour gérer le sur-apprentissage : on arrête l'entraînement dès que la perte sur le jeu de validation cesse de diminuer depuis <var>k</var> epochs (la <em>patience</em>, souvent 5 à 20). On garde alors les poids du meilleur point observé. C'est quasi gratuit à implémenter et ça évite beaucoup de temps de calcul inutile."
        ),
        callout(
          "warn",
          "Ne jamais toucher au jeu de test",
          "Pendant le développement, on travaille avec deux jeux : train (pour apprendre) et val (pour régler les hyperparamètres et décider quand arrêter). Le jeu de <strong>test</strong> reste soigneusement à part et ne sert qu'<em>une seule fois</em>, à la fin, pour annoncer le score final du modèle. Si tu regardes le test pendant le réglage, tu le contamines et ton score final devient trompeur."
        )
      ),

      lesson(
        "Les métriques qui comptent vraiment",
        paragraphs(
          "Pour mesurer la qualité d'un classifieur, on a plusieurs métriques, et la plus simple (l'accuracy) est souvent celle qui nous égare le plus. Voici les quatre métriques à connaître et quand les utiliser."
        ),
        bullets([
          "<strong>Accuracy</strong> : proportion d'exemples correctement classés. Simple, intuitive, mais très trompeuse quand les classes sont déséquilibrées.",
          "<strong>Précision</strong> : parmi les exemples prédits positifs, combien le sont vraiment. « Quand je dis oui, ai-je raison ? »",
          "<strong>Rappel</strong> (sensibilité) : parmi les vrais positifs, combien ai-je réussi à en détecter. « De tous les oui qui existent, combien j'en trouve ? »",
          "<strong>F1-score</strong> : moyenne harmonique de la précision et du rappel. Utile quand on veut un seul chiffre qui résume les deux."
        ]),
        callout(
          "warn",
          "Le piège de l'accuracy",
          "Imagine un détecteur de fraude où 99 % des transactions sont légitimes. Un modèle qui répond toujours « non-fraude » atteint une accuracy de 99 %. Impressionnant sur le papier, totalement inutile en pratique (il ne détecte aucune fraude). Sur les classes déséquilibrées, préfère toujours le F1 ou la précision/rappel à l'accuracy seule."
        ),
        paragraphs(
          "La <strong>matrice de confusion</strong> est l'outil le plus utile pour diagnostiquer un classifieur multi-classes. C'est un tableau qui croise les classes réelles et les classes prédites : chaque case (i, j) compte combien d'exemples de la classe <var>i</var> ont été prédits comme classe <var>j</var>. La diagonale contient les bons, tout le reste contient les erreurs. En regardant les cases hors diagonale, on repère instantanément les confusions systématiques (« le modèle confond chien et chat, mais jamais chien et voiture »)."
        ),
        code(
          "python",
          `
from sklearn.metrics import confusion_matrix, classification_report

y_true = [0, 1, 2, 2, 0, 1, 0, 2, 1, 0]
y_pred = [0, 1, 1, 2, 0, 2, 0, 2, 1, 0]

print(confusion_matrix(y_true, y_pred))
# [[4 0 0]
#  [0 2 1]
#  [0 1 2]]

print(classification_report(y_true, y_pred, target_names=['chat', 'chien', 'oiseau']))
# Affiche precision, rappel et F1 par classe + accuracy globale
          `,
          "Matrice de confusion et rapport complet en sklearn"
        )
      ),

      lesson(
        "Pour aller plus loin",
        paragraphs(
          "Ce chapitre clôt la boucle « comprendre et entraîner un ConvNet ». Pour aller plus loin, voici quelques pistes qui ont fait leurs preuves. Les articles originaux des grandes architectures restent étonnamment lisibles et sont une excellente façon de continuer."
        ),
        bullets([
          "<strong>LeNet-5</strong> (LeCun, 1998) — l'ancêtre historique, papier court et pédagogique.",
          "<strong>AlexNet</strong> (Krizhevsky, Sutskever, Hinton, 2012) — le déclencheur de la vague moderne, beaucoup d'astuces d'implémentation.",
          "<strong>VGG</strong> (Simonyan & Zisserman, 2014) — la beauté de la simplicité : des 3 × 3 empilés, rien de plus.",
          "<strong>GoogLeNet / Inception</strong> (Szegedy, 2014) — les modules Inception et l'idée que plusieurs tailles de filtres en parallèle valent mieux qu'une seule.",
          "<strong>ResNet</strong> (He, 2015) — les connexions résiduelles qui ont permis d'aller à 152 couches et au-delà.",
          "<strong>Deep Learning</strong> (Goodfellow, Bengio, Courville) — le livre de référence, disponible gratuitement en ligne.",
          "<strong>CS231n</strong> de Stanford (notes et vidéos) — le cours qui a formé une génération entière de chercheurs en vision."
        ]),
        paragraphs(
          "Et au-delà des ConvNet : les <strong>Transformers</strong> (Vaswani et al., 2017) ont en grande partie remplacé les architectures récurrentes pour le traitement du langage, et attaquent sérieusement la vision depuis 2020 avec les <em>Vision Transformers</em> (ViT). Les principes généraux que tu as appris ici (hiérarchie, entraînement par gradient, régularisation, diagnostic train/val) s'appliquent tels quels aux Transformers — seules les couches changent."
        ),
        callout(
          "success",
          "Le mot de la fin",
          "Tu as maintenant les bases solides pour lire, comprendre, implémenter et diagnostiquer un ConvNet. Ces idées — connexions locales, partage de poids, hiérarchie d'abstraction, rétropropagation, régularisation — sont le socle commun de presque tout ce qui se fait en deep learning aujourd'hui. Le reste est une question de pratique."
        )
      )
    ].join(""),

    checklist: [
      "Je peux décrire l'architecture typique <code>Input → (Conv → ReLU → Pool) × n → FC → Softmax</code> et expliquer pourquoi le nombre de canaux monte pendant que la taille spatiale descend.",
      "Je peux énumérer au moins 8 hyperparamètres à fixer avant d'entraîner un ConvNet.",
      "Je peux décrire en une phrase chacune des quatre étapes du cycle d'entraînement (forward, perte, backward, update).",
      "Je connais la règle de dérivation en chaîne et je peux expliquer en une phrase comment la rétropropagation l'utilise.",
      "Je peux comparer SGD, SGD + momentum et Adam et dire lequel choisir par défaut.",
      "Je sais lire une courbe train/val et repérer sur-apprentissage, sous-apprentissage et instabilité d'optimisation.",
      "Je peux expliquer pourquoi l'accuracy est trompeuse sur des classes déséquilibrées et citer une meilleure métrique dans ce cas.",
      "Je comprends ce qu'est une matrice de confusion et comment la lire."
    ],

    quiz: [
      {
        question: "Dans un ConvNet de classification typique, qu'arrive-t-il généralement en même temps aux dimensions quand on progresse de l'entrée vers la sortie ?",
        options: [
          "La taille spatiale augmente et le nombre de canaux diminue",
          "La taille spatiale diminue et le nombre de canaux augmente",
          "Les deux dimensions augmentent proportionnellement",
          "Les deux dimensions restent constantes"
        ],
        answer: 1,
        explanation: "La règle de conception classique : à chaque bloc Conv-Pool, on double le nombre de feature maps et on divise par deux la taille spatiale. Plus on monte en abstraction, plus on a besoin de canaux pour exprimer les concepts, mais moins la résolution spatiale compte."
      },
      {
        question: "Lors d'un pas d'entraînement sur un mini-batch, quel est le bon ordre des étapes ?",
        options: [
          "Forward pass → rétropropagation → calcul de la perte → mise à jour",
          "Forward pass → calcul de la perte → rétropropagation → mise à jour",
          "Rétropropagation → forward pass → mise à jour → calcul de la perte",
          "Calcul de la perte → forward pass → mise à jour → rétropropagation"
        ],
        answer: 1,
        explanation: "L'ordre correct : (1) on fait le forward pour obtenir les prédictions, (2) on compare aux étiquettes pour calculer la perte, (3) on rétropropage pour obtenir les gradients, (4) l'optimiseur met à jour les poids."
      },
      {
        question: "Quel optimiseur est généralement un bon choix par défaut pour un projet de deep learning ?",
        options: [
          "SGD avec un taux d'apprentissage fixe",
          "Adam avec un taux d'apprentissage de 10⁻³",
          "Un optimiseur sans momentum pour éviter les oscillations",
          "Un optimiseur conçu spécifiquement pour les réseaux récurrents"
        ],
        answer: 1,
        explanation: "Adam combine momentum et pas adaptatif par paramètre. Il est robuste à beaucoup de situations et fonctionne bien avec un taux d'apprentissage autour de 10⁻³. C'est le choix par défaut raisonnable dans 90 % des cas."
      },
      {
        question: "Sur une courbe d'entraînement, tu observes que la perte sur le train continue de descendre alors que la perte sur la validation a commencé à remonter. Que se passe-t-il ?",
        options: [
          "Le modèle est en sous-apprentissage : il faut plus de couches",
          "Le modèle est en sur-apprentissage : il mémorise le train au détriment de la généralisation",
          "Le taux d'apprentissage est trop faible, il faut l'augmenter",
          "Le jeu de validation est mal préparé, il faut le remélanger"
        ],
        answer: 1,
        explanation: "C'est la signature typique du sur-apprentissage : le modèle apprend de mieux en mieux les exemples d'entraînement (perte train qui descend) mais généralise de moins en moins bien (perte val qui remonte). Remèdes : plus de dropout, data augmentation, early stopping."
      },
      {
        question: "Sur un problème de détection de fraude où 99 % des transactions sont légitimes, un modèle qui prédit toujours « non-fraude » obtient une accuracy de 99 %. Pourquoi cette accuracy est-elle trompeuse ?",
        options: [
          "Parce que l'accuracy ne sait pas compter au-delà de 50 %",
          "Parce que le modèle ne détecte aucune fraude — son rappel sur la classe positive est 0",
          "Parce que l'accuracy devrait toujours être calculée sur le jeu de test",
          "Parce que la fraude n'est pas un vrai problème de classification"
        ],
        answer: 1,
        explanation: "Sur des classes très déséquilibrées, l'accuracy est dominée par la classe majoritaire. Un modèle qui ignore complètement la classe rare atteint une accuracy élevée sans être utile. Il faut regarder la précision/rappel ou le F1 sur la classe minoritaire pour avoir une vraie mesure."
      },
      {
        question: "À quoi sert la matrice de confusion ?",
        options: [
          "À calculer automatiquement le meilleur taux d'apprentissage",
          "À croiser les classes réelles et les classes prédites pour repérer les confusions systématiques",
          "À mesurer la confusion interne d'un neurone pendant l'entraînement",
          "À compter le nombre de paramètres du modèle"
        ],
        answer: 1,
        explanation: "La matrice de confusion est un tableau où chaque case (i, j) compte combien d'exemples de la classe i ont été prédits comme j. La diagonale contient les bons, le reste contient les erreurs — et on y voit instantanément quelles classes le modèle confond."
      },
      {
        question: "Quelle est la règle d'or concernant le jeu de test pendant le développement d'un modèle ?",
        options: [
          "L'utiliser à chaque epoch pour suivre la progression",
          "L'utiliser à la place de la validation si elle est trop petite",
          "Ne l'utiliser qu'une seule fois, à la fin, pour annoncer le score final",
          "L'utiliser en complément de la validation pour réduire le bruit"
        ],
        answer: 2,
        explanation: "Le jeu de test doit rester rigoureusement à part pendant tout le développement. Si on le regarde pendant le réglage des hyperparamètres, on finit par y optimiser implicitement, ce qui rend le score final faux. Un jeu de test qui a été « touché » n'est plus un jeu de test."
      }
    ],

    exercises: [
      {
        title: "Décortiquer une architecture PyTorch",
        difficulty: "Intermédiaire",
        time: "20 min",
        prompt: "On te donne le petit ConvNet suivant en PyTorch. Calcule à la main la taille du tenseur à la sortie de chaque couche pour une entrée 3 × 32 × 32. Vérifie que la valeur <code>64 * 8 * 8</code> dans la couche Linear est bien cohérente. Enfin, propose une modification pour adapter ce réseau à des images 64 × 64.",
        deliverables: [
          "le tableau des tailles intermédiaires après chaque couche",
          "la justification du chiffre 64 * 8 * 8",
          "la modification nécessaire pour des images 64 × 64 (ligne de code précise)",
          "le nombre total de paramètres du réseau"
        ]
      },
      {
        title: "Diagnostic de courbes",
        difficulty: "Intermédiaire",
        time: "15 min",
        prompt: "On te décrit trois scénarios de courbes d'entraînement : (A) perte train à 2.3, perte val à 2.3, plates sur 20 epochs ; (B) perte train à 0.01, perte val à 1.2, train qui descend encore, val qui remonte ; (C) perte train qui oscille violemment entre 0.3 et 1.5, perte val qui suit sans jamais descendre. Pour chaque scénario, donne (1) un diagnostic précis, (2) un remède prioritaire, (3) un second levier à essayer si le premier ne suffit pas.",
        deliverables: [
          "diagnostic + 2 remèdes pour chacun des 3 scénarios (9 éléments au total)",
          "au moins une mention d'early stopping et une mention de taux d'apprentissage"
        ]
      },
      {
        title: "Choisir les bonnes métriques",
        difficulty: "Intermédiaire",
        time: "15 min",
        prompt: "Pour chacun des problèmes suivants, propose la ou les métriques les plus pertinentes et justifie en une phrase : (a) classifieur de chiffres manuscrits MNIST (10 classes équilibrées), (b) détection de tumeurs sur IRM (positifs très rares), (c) classifieur de mails spam/non-spam (on préfère laisser passer un spam plutôt que bloquer un mail légitime), (d) classification de 1000 espèces d'oiseaux à partir d'images.",
        deliverables: [
          "une métrique principale pour chaque cas (a) à (d)",
          "une justification en une phrase pour chaque",
          "pour le cas (c), expliquer précisément si on optimise plutôt la précision ou le rappel et pourquoi"
        ]
      },
      {
        title: "Projet complet sur CIFAR-10",
        difficulty: "Avancé",
        time: "60 min",
        prompt: "Écris le squelette complet (en pseudo-code PyTorch, pas besoin de l'exécuter) d'un pipeline d'entraînement d'un ConvNet sur CIFAR-10 : (1) chargement et découpage train/val/test, (2) définition d'un ConvNet à 4 blocs Conv-BN-ReLU-Pool, (3) boucle d'entraînement avec Adam et early stopping sur la val loss, (4) calcul de la matrice de confusion sur le test à la fin. Commente chaque partie pour expliquer tes choix.",
        deliverables: [
          "le squelette de code complet",
          "la définition du modèle avec au moins 4 blocs",
          "la boucle d'entraînement avec early stopping",
          "la matrice de confusion finale sur le test",
          "des commentaires justifiant les choix d'hyperparamètres"
        ]
      }
    ],

    keywords: [
      "architecture",
      "convnet",
      "pipeline",
      "softmax",
      "entropie croisée",
      "rétropropagation",
      "descente de gradient",
      "sgd",
      "adam",
      "rmsprop",
      "momentum",
      "taux d'apprentissage",
      "early stopping",
      "train val test",
      "accuracy",
      "précision",
      "rappel",
      "f1",
      "matrice de confusion"
    ]
  }
});
})(window);
