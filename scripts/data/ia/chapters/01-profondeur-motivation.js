(function registerChapterBundle1(globalScope) {
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

// Petit raccourci local : enveloppe un SVG d'IA_FIGURES dans une figure.
function fig(key, caption) {
  const body = figures[key];
  if (!body) {
    return "";
  }
  return figure(body, { caption });
}

registry.registerChapterBundle({
  order: 1,
  chapter: {
    id: "profondeur-motivation",
    shortTitle: "Profondeur",
    title: "Pourquoi la profondeur change la donne",
    level: "Fondations",
    duration: "1 h",
    track: "IA1",
    summary:
      "Avant de plonger dans les convolutions, on prend le temps de comprendre ce que la profondeur apporte vraiment à un réseau de neurones. On y voit pourquoi empiler des couches permet de représenter des concepts de plus en plus abstraits, pourquoi on ne peut pas simplement « élargir » une couche pour obtenir la même chose, et pourquoi ce décollage spectaculaire est récent.",
    goals: [
      "expliquer ce qu'on appelle la profondeur d'un réseau et pourquoi elle compte",
      "décrire les niveaux d'abstraction qu'un réseau profond construit couche après couche",
      "comparer un réseau large et un réseau profond à expressivité équivalente",
      "comprendre l'origine du vanishing gradient et pourquoi il freine les réseaux mal conçus",
      "situer LeNet, AlexNet et ResNet dans l'histoire récente du deep learning"
    ],
    highlights: [
      "profondeur",
      "abstraction",
      "cortex visuel",
      "vanishing gradient",
      "histoire"
    ],
    body: [
      lesson(
        "Qu'est-ce que la profondeur d'un réseau ?",
        paragraphs(
          "On appelle <strong>profondeur</strong> d'un réseau de neurones son nombre de couches. Un réseau profond (<em>deep</em>) a tout simplement plus de couches qu'un réseau ordinaire (<em>shallow</em>). Mais la vraie question n'est pas « combien de couches », c'est « à quoi servent les couches supplémentaires ».",
          "La réponse tient en un mot : <strong>abstraction</strong>. Chaque couche transforme les sorties de la précédente en une représentation un peu plus éloignée des pixels bruts et un peu plus proche du concept qui nous intéresse. Les premières couches repèrent des coins, des bords, des textures. Les couches intermédiaires combinent ces morceaux en motifs plus riches (un œil, une oreille). Les dernières couches parlent directement en termes d'objets reconnaissables."
        ),
        fig("featureHierarchy", "Pixels → motifs → parties d'objet → concept : chaque couche construit une représentation un peu plus abstraite."),
        bullets([
          "<strong>Niveau bas</strong> : pixels individuels, variations locales de luminosité.",
          "<strong>Niveau intermédiaire</strong> : petits motifs (coins, bords, textures récurrentes).",
          "<strong>Niveau haut</strong> : parties d'objets reconnaissables (œil, roue, silhouette).",
          "<strong>Niveau sémantique</strong> : l'objet complet et son étiquette (« chat », « voiture »)."
        ]),
        callout(
          "info",
          "Profond ≠ large",
          "Attention au piège le plus classique : un réseau avec beaucoup de neurones sur une seule couche n'est <em>pas</em> profond, il est juste large. La profondeur compte le nombre de transformations successives, pas le nombre de paramètres."
        )
      ),

      lesson(
        "Une inspiration venue du cortex visuel",
        paragraphs(
          "L'idée d'empiler des couches n'est pas tombée du ciel : elle est en partie inspirée du <strong>cortex visuel</strong>, la partie du cerveau qui traite les images captées par nos yeux. Les travaux de Hubel et Wiesel dans les années 1960 ont montré que le cortex visuel traite l'information par aires successives, chacune spécialisée dans un niveau d'abstraction différent.",
          "Schématiquement : l'aire V1 détecte des bords orientés, V2 commence à combiner ces bords en motifs, V4 reconnaît des formes plus complexes, et l'aire IT (inferotemporale) répond à des objets entiers comme des visages. Chaque aire « voit » une zone un peu plus large du champ visuel que la précédente — un peu comme les couches d'un ConvNet dont le champ récepteur grandit avec la profondeur."
        ),
        callout(
          "warn",
          "Inspiration, pas copie",
          "Les ConvNet ne <em>sont</em> pas des modèles du cerveau. On parle d'inspiration : quelques idées ont été empruntées (hiérarchie, localité, invariance), mais les mécanismes biologiques réels sont bien plus complexes et encore mal compris."
        ),
        paragraphs(
          "Ce qu'on retient : la Nature elle-même semble privilégier une stratégie hiérarchique pour comprendre les images. C'est un indice fort que cette stratégie n'est pas arbitraire, et ça rend moins surprenant qu'une famille de modèles inspirée de ce principe fonctionne bien sur des tâches visuelles."
        )
      ),

      lesson(
        "Shallow vs deep : pourquoi élargir ne suffit pas",
        paragraphs(
          "Un résultat théorique célèbre (théorème d'approximation universelle) dit qu'un réseau à <strong>une seule couche cachée</strong>, assez large, peut approcher n'importe quelle fonction continue. Alors pourquoi ne pas simplement élargir cette couche au lieu de se compliquer la vie avec des réseaux profonds ? Parce qu'en pratique, « assez large » peut vouloir dire <em>astronomiquement large</em>."
        ),
        table(
          ["Stratégie", "Nombre de couches", "Paramètres (ordre de grandeur)", "Entraînable en pratique ?"],
          [
            ["Réseau large peu profond", "1 couche cachée de 10⁶ neurones", "∼ 10¹¹ poids", "Non : impossible à stocker, impossible à entraîner"],
            ["Réseau profond modéré", "20 couches de 500 neurones", "∼ 5 × 10⁶ poids", "Oui : taille standard d'un modèle moderne"],
            ["ConvNet profond (images)", "20 couches, partage de poids", "∼ 10⁶ poids", "Oui, et généralise bien"]
          ]
        ),
        paragraphs(
          "L'intuition : une fonction « compliquée » peut souvent s'écrire comme une composition de fonctions « simples ». Un réseau profond est taillé pour exploiter cette structure — il peut représenter une fonction exponentiellement plus compacte qu'un réseau peu profond équivalent. C'est ce qu'on appelle parfois l'<em>efficacité en profondeur</em>.",
          "Autrement dit : pour un budget de paramètres donné, mieux vaut les répartir sur plusieurs couches que les concentrer sur une seule. C'est l'un des arguments les plus solides en faveur du deep learning."
        ),
        callout(
          "success",
          "Ce qu'il faut retenir",
          "La profondeur n'est pas décorative : elle permet de représenter des fonctions compliquées avec beaucoup moins de paramètres qu'un réseau plat. On gagne sur le stockage, sur le temps d'entraînement, et surtout sur la capacité à généraliser."
        )
      ),

      lesson(
        "Le problème du vanishing gradient",
        paragraphs(
          "Si les réseaux profonds sont si merveilleux, pourquoi a-t-il fallu attendre les années 2010 pour qu'ils décollent ? Parce qu'un réseau profond est difficile à <em>entraîner</em>. Le principal obstacle s'appelle le <strong>vanishing gradient</strong> : quand on remonte le réseau de la sortie vers l'entrée pour corriger les poids, le signal de correction (le gradient) rapetisse à chaque couche traversée. Dans les premières couches, il devient tellement petit que les poids ne bougent plus — les couches profondes apprennent, les couches de tête restent figées."
        ),
        fig("vanishingGradientHeatmap", "Le gradient s'évapore en remontant le réseau : les premières couches n'apprennent presque rien."),
        paragraphs(
          "Pourquoi le gradient rapetisse-t-il ? Parce qu'à chaque couche, il est multiplié par la dérivée de la fonction d'activation. Or la sigmoïde, longtemps utilisée par défaut, a une dérivée qui sature à 0 pour les grandes valeurs absolues. Multiplier plusieurs petites valeurs entre elles donne une valeur encore plus petite. Sur 20 couches de sigmoïdes, le gradient peut se retrouver divisé par 10⁴ ou pire.",
          "Trois leviers ont permis de contourner ce problème, et ce sont exactement ceux qui ont déclenché la révolution deep learning de 2012 :"
        ),
        bullets([
          "<strong>Des activations qui ne saturent pas</strong> : ReLU, dont la dérivée vaut 1 partout où elle est positive, maintient le gradient intact dans les zones actives.",
          "<strong>Des schémas d'initialisation intelligents</strong> : choisir les poids initiaux pour que la variance du signal ne s'effondre pas (Xavier, He).",
          "<strong>Des architectures résiduelles</strong> : ResNet (2015) ajoute des « raccourcis » qui permettent au gradient de sauter par-dessus des blocs entiers, court-circuitant l'évaporation."
        ]),
        callout(
          "warn",
          "Le vrai défi du deep learning",
          "Empiler 50 couches n'est pas difficile — quelques lignes de code suffisent. Ce qui est difficile, c'est que ces 50 couches apprennent quelque chose d'utile. C'est là que la plupart des innovations récentes ont eu lieu."
        )
      ),

      lesson(
        "Petite histoire express du deep learning",
        paragraphs(
          "Pour mettre les idées en perspective, voici cinq jalons historiques qui expliquent d'où vient ce qu'on étudie maintenant."
        ),
        table(
          ["Année", "Modèle", "Ce qu'il apporte"],
          [
            ["1958", "Perceptron (Rosenblatt)", "Un seul neurone, appris à partir d'exemples : le premier réseau « qui apprend »."],
            ["1989", "LeNet-5 (LeCun)", "Premier ConvNet entraînable par rétropropagation, utilisé pour lire les chèques manuscrits."],
            ["2012", "AlexNet (Krizhevsky)", "Écrase la compétition ImageNet (erreur top-5 : 15 % contre 26 % pour le 2ᵉ). Déclencheur de la vague actuelle."],
            ["2014", "VGG & Inception", "Réseaux beaucoup plus profonds (16-22 couches), standardisation des blocs Conv empilés."],
            ["2015", "ResNet (He et al.)", "Connexions résiduelles, 152 couches entraînables, et on continue de descendre en erreur."]
          ]
        ),
        paragraphs(
          "Deux choses frappent en lisant cette chronologie. D'abord, le gros de la vague est remarquablement récent : entre 2012 et 2015, on passe d'un domaine académique marginal à une technologie qui transforme l'industrie. Ensuite, aucune de ces percées n'est purement théorique — ce sont des combinaisons d'idées anciennes (convolution, rétropropagation) avec de la puissance de calcul (GPU) et de gros jeux de données (ImageNet).",
          "C'est un point à garder en tête : beaucoup de concepts qu'on présente comme « modernes » ont en fait été inventés il y a 30 ou 40 ans. Ce qui est moderne, c'est leur mise à l'échelle."
        ),
        callout(
          "info",
          "Pour aller plus loin",
          "Une lecture agréable sur cette histoire : <em>Quand la machine apprend</em> de Yann LeCun, qui couvre de l'inside tout le parcours de l'IA connexionniste de 1980 à aujourd'hui."
        )
      )
    ].join(""),

    checklist: [
      "Je peux définir la profondeur d'un réseau et la distinguer clairement de sa largeur.",
      "Je peux décrire les niveaux d'abstraction qu'un réseau profond construit couche après couche face à une image.",
      "Je peux expliquer en une phrase l'inspiration venue du cortex visuel et ses limites.",
      "Je sais justifier pourquoi un réseau profond est plus efficace qu'un réseau large équivalent.",
      "Je comprends ce qu'est le vanishing gradient, pourquoi il survient avec la sigmoïde, et quelles sont les trois parades qui l'ont résolu.",
      "Je peux citer LeNet, AlexNet et ResNet et dire ce que chacun apporte."
    ],

    quiz: [
      {
        question: "Laquelle de ces affirmations décrit le mieux la profondeur d'un réseau de neurones ?",
        options: [
          "Le nombre total de neurones du réseau",
          "Le nombre de couches empilées entre l'entrée et la sortie",
          "Le nombre de paramètres appris pendant l'entraînement",
          "La largeur de la couche d'entrée"
        ],
        answer: 1,
        explanation: "La profondeur désigne le nombre de couches successives — pas la largeur (le nombre de neurones par couche) ni le nombre total de paramètres."
      },
      {
        question: "Pourquoi préfère-t-on généralement un réseau profond à un réseau très large mais peu profond ?",
        options: [
          "Parce qu'un réseau profond est toujours plus rapide à entraîner",
          "Parce qu'un réseau profond peut représenter la même fonction avec beaucoup moins de paramètres",
          "Parce qu'un réseau peu profond ne peut mathématiquement pas approximer une fonction continue",
          "Parce que les réseaux profonds évitent automatiquement le sur-apprentissage"
        ],
        answer: 1,
        explanation: "Un théorème dit qu'un réseau à une seule couche cachée peut théoriquement approximer toute fonction continue, mais la largeur nécessaire devient astronomique. La profondeur permet d'atteindre la même expressivité avec beaucoup moins de paramètres."
      },
      {
        question: "D'où vient principalement le problème du vanishing gradient dans un réseau profond classique ?",
        options: [
          "De la taille trop grande des images en entrée",
          "Du fait que la dérivée de certaines activations (comme la sigmoïde) sature à 0, ce qui atténue le gradient multiplié couche après couche",
          "Du nombre insuffisant de couches cachées",
          "De l'absence de dropout dans les premières couches"
        ],
        answer: 1,
        explanation: "À chaque couche, le gradient est multiplié par la dérivée de l'activation. Quand cette dérivée est petite (sigmoïde saturée), le produit sur beaucoup de couches devient microscopique et les premières couches cessent d'apprendre."
      },
      {
        question: "Lequel de ces leviers a directement permis d'atténuer le vanishing gradient dans les réseaux profonds modernes ?",
        options: [
          "Remplacer la sigmoïde par ReLU dans les couches cachées",
          "Augmenter drastiquement le nombre de neurones par couche",
          "Utiliser exclusivement le CPU au lieu du GPU",
          "Diminuer la taille du jeu d'entraînement pour éviter le bruit"
        ],
        answer: 0,
        explanation: "ReLU a une dérivée constante (= 1) pour tous les x > 0, ce qui fait circuler le gradient sans s'atténuer dans les zones actives. C'est l'un des trois leviers majeurs avec l'initialisation intelligente et les connexions résiduelles."
      },
      {
        question: "Quel modèle est généralement considéré comme le déclencheur de la vague moderne du deep learning ?",
        options: [
          "LeNet-5 (1989)",
          "AlexNet (2012)",
          "ResNet (2015)",
          "Le perceptron de Rosenblatt (1958)"
        ],
        answer: 1,
        explanation: "AlexNet a gagné la compétition ImageNet 2012 avec une marge spectaculaire (erreur top-5 à 15 % contre 26 % pour le deuxième). C'est l'événement qui a convaincu la communauté que les ConvNet profonds passaient à l'échelle."
      },
      {
        question: "Vrai ou faux : les ConvNet sont des modèles fidèles du fonctionnement du cortex visuel.",
        options: [
          "Vrai : les ConvNet reproduisent exactement les aires V1, V2, V4 du cerveau",
          "Faux : ils s'en inspirent (hiérarchie, localité) mais les mécanismes biologiques réels sont très différents",
          "Vrai : chaque neurone artificiel correspond à un vrai neurone biologique",
          "Faux : il n'y a aucun lien entre ConvNet et cortex visuel"
        ],
        answer: 1,
        explanation: "Le cortex visuel a servi d'inspiration (traitement hiérarchique, champ récepteur local, invariance par translation), mais les ConvNet ne prétendent pas modéliser fidèlement la biologie. C'est une source d'idées, pas une copie."
      }
    ],

    exercises: [
      {
        title: "Nommer les niveaux d'abstraction",
        difficulty: "Facile",
        time: "10 min",
        prompt: "Prends une photo de ton choix (un chat, une voiture, un paysage). Décris par écrit ce qu'un ConvNet pourrait détecter aux 4 niveaux successifs : (1) niveau pixel, (2) niveau motif local, (3) niveau partie d'objet, (4) niveau sémantique. Pour chaque niveau, donne au moins deux exemples concrets.",
        deliverables: [
          "la photo choisie (ou sa description)",
          "au moins 2 exemples par niveau, soit 8 éléments au total",
          "une phrase expliquant pourquoi ces niveaux doivent nécessairement se construire dans cet ordre"
        ]
      },
      {
        title: "Chiffrer le compromis largeur / profondeur",
        difficulty: "Intermédiaire",
        time: "15 min",
        prompt: "On veut approcher une fonction compliquée qui a besoin de 10 millions de paramètres minimum pour être correctement représentée. Compare deux architectures : (A) un réseau à 1 couche cachée de N neurones recevant 1024 entrées ; (B) un réseau à 10 couches de 100 neurones chacune. Pour chaque option, calcule le nombre total de paramètres en fonction de N, puis détermine la valeur de N nécessaire pour que l'option A ait 10 millions de paramètres. Conclus : quelle option est la plus économique en pratique ?",
        deliverables: [
          "le nombre de paramètres de l'option A en fonction de N",
          "le nombre de paramètres de l'option B (chiffre précis)",
          "la valeur de N nécessaire pour l'option A",
          "une phrase de conclusion sur l'économie en paramètres"
        ]
      },
      {
        title: "Pourquoi 2012 et pas avant ?",
        difficulty: "Avancé",
        time: "20 min",
        prompt: "Écris un petit texte argumentatif (200-300 mots) qui répond à la question suivante : « Les idées fondamentales du deep learning (convolution, rétropropagation, neurones artificiels) existent depuis les années 1980. Pourquoi a-t-il fallu attendre 2012 pour qu'elles explosent en pratique ? » Ton texte doit mentionner au moins trois facteurs distincts, dont au moins un lié au matériel, un aux données, et un aux algorithmes.",
        deliverables: [
          "un texte de 200 à 300 mots",
          "au moins 3 facteurs explicites et distincts",
          "au moins un exemple chiffré ou historique concret (ImageNet, GPU, AlexNet, etc.)"
        ]
      }
    ],

    keywords: [
      "profondeur",
      "couches",
      "abstraction",
      "cortex visuel",
      "hiérarchie",
      "largeur",
      "vanishing gradient",
      "sigmoïde",
      "relu",
      "lenet",
      "alexnet",
      "resnet",
      "imagenet",
      "deep learning",
      "apprentissage profond"
    ]
  }
});
})(window);
