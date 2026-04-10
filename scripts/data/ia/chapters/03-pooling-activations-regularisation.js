(function registerChapterBundle3(globalScope) {
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
  order: 3,
  chapter: {
    id: "pooling-activations-regularisation",
    shortTitle: "Pooling & co",
    title: "Pooling, activations et régularisation",
    level: "Fondations",
    duration: "1 h 15",
    track: "IA1",
    summary:
      "La convolution seule ne suffit pas. Trois familles de briques se glissent entre les couches Conv pour faire tenir le tout : le pooling qui résume l'information, les fonctions d'activation (ReLU et ses variantes) qui introduisent la non-linéarité, et la régularisation (dropout, batch norm) qui empêche le modèle de tricher. Chaque brique a un rôle précis — à toi de savoir lequel.",
    goals: [
      "expliquer à quoi sert le pooling et comment le calculer à la main",
      "comparer max-pooling et average-pooling et savoir quand utiliser l'un ou l'autre",
      "dessiner la courbe de ReLU et comprendre pourquoi elle remplace la sigmoïde",
      "citer au moins deux variantes de ReLU et leurs motivations",
      "décrire le dropout et ses deux modes (entraînement vs inférence)",
      "comprendre l'idée de la batch normalization en une phrase"
    ],
    highlights: [
      "max-pooling",
      "ReLU",
      "Leaky ReLU",
      "dropout",
      "batch normalization",
      "régularisation"
    ],
    body: [
      lesson(
        "Pourquoi on pool",
        paragraphs(
          "Après une couche de convolution, on cherche souvent à <strong>réduire la taille spatiale</strong> des feature maps. Deux raisons à ça : d'abord, un réseau qui garde des feature maps de taille 224 × 224 à chaque couche explose en mémoire et en calcul. Ensuite, on veut que le réseau se soucie de <em>la présence</em> d'un motif, pas de sa position exacte au pixel près. Si le chat est deux pixels plus à droite, l'étiquette « chat » ne doit pas changer."
        ),
        paragraphs(
          "Le <strong>pooling</strong> résout ces deux problèmes d'un coup. Il découpe la feature map en petits blocs (typiquement 2 × 2), et remplace chaque bloc par une seule valeur — le maximum, la moyenne, ou autre. Résultat : la taille est divisée par 4 (si blocs 2 × 2), et les petits décalages du motif sont absorbés parce qu'ils ne changent pas le résumé du bloc."
        ),
        callout(
          "info",
          "Pool ou convolution avec stride ?",
          "On peut aussi réduire la taille avec une convolution stride = 2 — et c'est ce que font certaines architectures modernes (ResNet, par exemple). La différence : le pooling n'a <em>aucun paramètre à apprendre</em>, tandis qu'une convolution à stride 2 a ses poids. Les deux sont valides, et le choix relève plus du goût que d'une règle stricte."
        )
      ),

      lesson(
        "Max-pooling pas à pas",
        paragraphs(
          "Le <strong>max-pooling</strong> est la variante la plus courante. Son principe : pour chaque bloc, on garde la valeur maximale. C'est une façon de dire « je retiens l'activation la plus forte de cette zone »."
        ),
        fig("maxPoolExample", "Max-pooling 2 × 2 : une feature map 4 × 4 devient 2 × 2 en ne gardant que le maximum de chaque quadrant."),
        code(
          "text",
          `
Max-pooling 2 x 2 sur une feature map 4 x 4 :

Entrée :                       Sortie :
+----+----+----+----+
|  8 | 11 | 21 | 14 |          +----+----+
+----+----+----+----+          | 11 | 21 |
|  6 |  4 |  7 | 13 |          +----+----+
+----+----+----+----+    -->   | 22 | 14 |
| 11 |  3 | 14 | 10 |          +----+----+
+----+----+----+----+
| 22 | 15 | 10 |  5 |
+----+----+----+----+

On regroupe en 4 carres de 2 x 2 et on garde le max de chacun :
  max{ 8, 11, 6, 4}  = 11
  max{21, 14, 7, 13} = 21
  max{11,  3, 22, 15} = 22
  max{14, 10, 10,  5} = 14
          `,
          "Max-pooling : exemple numérique"
        ),
        paragraphs(
          "Il existe aussi l'<em>average-pooling</em> (on prend la moyenne du bloc) et, plus rarement, le <em>L2-pooling</em> (racine carrée de la somme des carrés). Le max-pooling reste la variante par défaut parce qu'il préserve les activations fortes — ce qui correspond intuitivement aux endroits où « quelque chose a été détecté ». L'average-pooling, lui, lisse les activations : il est utilisé en fin de réseau dans certaines architectures modernes (global average pooling) pour résumer chaque feature map en un seul nombre avant la couche de classification."
        )
      ),

      lesson(
        "Hyperparamètres du pooling",
        paragraphs(
          "Le pooling a ses propres hyperparamètres, analogues à ceux de la convolution :"
        ),
        bullets([
          "<strong>Taille du bloc <var>p</var></strong> : la fenêtre qu'on résume (typiquement 2 × 2 ou 3 × 3).",
          "<strong>Stride <var>s</var></strong> : le pas avec lequel cette fenêtre se déplace (souvent égal à <var>p</var>, auquel cas les blocs ne se chevauchent pas).",
          "<strong>Padding</strong> : rare en pooling, mais possible."
        ]),
        paragraphs(
          "Pour une entrée de taille <var>n</var>, la taille de sortie d'un pooling de fenêtre <var>p</var> et stride <var>s</var> (sans padding) est : <code>⌊(n − p) / s⌋ + 1</code>. Avec les choix les plus courants (<var>p</var> = 2, <var>s</var> = 2), c'est simplement <code>n / 2</code>."
        ),
        table(
          ["Entrée", "Fenêtre", "Stride", "Sortie"],
          [
            ["32 × 32", "2 × 2", "2", "16 × 16"],
            ["16 × 16", "2 × 2", "2", "8 × 8"],
            ["8 × 8", "2 × 2", "2", "4 × 4"],
            ["32 × 32", "3 × 3", "2", "15 × 15 (légère superposition)"]
          ]
        ),
        callout(
          "warn",
          "Le pooling n'a pas de poids",
          "Contrairement à la convolution, le pooling n'apprend <em>rien</em>. Il n'a pas de paramètres, pas de biais, pas de gradient à calculer sur des poids. C'est une opération purement géométrique. Ça veut dire aussi qu'il ne peut pas s'adapter — le max reste le max."
        )
      ),

      lesson(
        "Pourquoi ReLU plutôt que la sigmoïde",
        paragraphs(
          "Une couche de convolution est fondamentalement une opération linéaire : sans non-linéarité, empiler 10 couches de convolution reviendrait à en avoir une seule (le produit de 10 transformations linéaires est encore une transformation linéaire). Pour que la profondeur serve à quelque chose, il faut intercaler une <strong>fonction d'activation non linéaire</strong> entre les couches."
        ),
        paragraphs(
          "Pendant longtemps on utilisait la <em>sigmoïde</em> (<code>σ(x) = 1 / (1 + e⁻ˣ)</code>) ou la tangente hyperbolique. Elles ont un défaut majeur : leur dérivée devient minuscule pour les grandes valeurs absolues. C'est exactement ce qui cause le vanishing gradient vu au chapitre 1. La <strong>ReLU</strong> (<em>Rectified Linear Unit</em>) règle ce problème avec une définition désarmante :"
        ),
        formula(
          `<span class="fn">ReLU</span>(<var>x</var>) <span class="op">=</span> <span class="fn">max</span>(0,&thinsp;<var>x</var>)`
        ),
        fig("reluCurve", "Toutes les valeurs négatives passent à zéro, les valeurs positives passent telles quelles."),
        paragraphs(
          "Toutes les valeurs négatives deviennent zéro, les valeurs positives passent telles quelles. C'est tout. Mais comme sa dérivée vaut 1 partout où elle est positive, le gradient circule sans s'atténuer dans ces zones, et l'entraînement devient beaucoup plus rapide. C'est l'une des raisons majeures du décollage pratique du deep learning autour de 2012."
        ),
        code(
          "python",
          `
import numpy as np

def relu(x):
    return np.maximum(0, x)

x = np.array([-3.0, -0.5, 0.0, 0.7, 2.1])
print(relu(x))   # [0.  0.  0.  0.7 2.1]
          `,
          "ReLU en une ligne"
        ),
        callout(
          "success",
          "Règle pratique",
          "Par défaut, utilise ReLU dans toutes les couches cachées d'un ConvNet. Ne sors de cette règle que si tu as une raison précise (problème spécifique à la sortie, neurones qui meurent, architecture particulière)."
        )
      ),

      lesson(
        "Les variantes de ReLU",
        paragraphs(
          "La ReLU classique a un défaut : un neurone dont la sortie devient négative pour <em>toutes</em> les entrées du jeu d'entraînement reste bloqué à zéro — et son gradient aussi. Ce neurone est dit « mort » et n'apprendra plus jamais. Plusieurs variantes corrigent ce problème en laissant passer une petite fraction des valeurs négatives."
        ),
        fig("sigmoidTanhReluCompare", "Sigmoïde, tanh, ReLU, Leaky ReLU : quatre activations courantes et leur forme."),
        table(
          ["Activation", "Formule", "Ce qu'elle apporte"],
          [
            ["ReLU", "max(0, x)", "Simple, rapide, règle le vanishing gradient pour x > 0."],
            ["Leaky ReLU", "max(α·x, x) avec α ≈ 0.01", "Laisse passer une petite pente négative ; évite les neurones morts."],
            ["PReLU", "max(α·x, x), α appris", "Même idée que Leaky, mais la pente α est apprise au lieu d'être fixée."],
            ["ELU", "x si x ≥ 0, sinon α(exp(x) − 1)", "Transition douce autour de 0, moyenne des sorties plus proche de 0."],
            ["Softplus", "log(1 + exp(x))", "Version lisse de ReLU, dérivable partout (utile dans certains cas rares)."]
          ]
        ),
        paragraphs(
          "Dans la pratique, <strong>ReLU classique reste le choix par défaut</strong>, et les variantes ne sortent que si on observe un réel problème — typiquement une perte qui stagne ou beaucoup de neurones dont la sortie reste à zéro. Leaky ReLU est la première variante à essayer parce qu'elle coûte quasiment rien et qu'elle suffit souvent."
        ),
        callout(
          "info",
          "Une exception : la couche de sortie",
          "En couche de sortie d'un classifieur multi-classes, on n'utilise pas ReLU mais <strong>softmax</strong>, qui transforme un vecteur de scores en distribution de probabilités. Pour une régression, on n'utilise souvent aucune activation (sortie linéaire). La règle « ReLU partout » ne vaut que pour les couches <em>cachées</em>."
        )
      ),

      lesson(
        "Dropout : éteindre des neurones au hasard",
        paragraphs(
          "Un réseau profond a beaucoup de paramètres, donc beaucoup de liberté pour apprendre par cœur les exemples d'entraînement. C'est le <em>sur-apprentissage</em> : le modèle excelle sur les données qu'il a vues mais se vautre sur les nouvelles. Le <strong>dropout</strong> est une technique étonnamment efficace pour l'atténuer."
        ),
        paragraphs(
          "Le principe : pendant l'entraînement, on met aléatoirement à zéro une fraction <code>p</code> des sorties d'une couche (typiquement <code>p = 0.25</code> ou <code>p = 0.5</code>). Les neurones désactivés ne participent ni au passage avant, ni à la rétropropagation. À chaque mini-batch, un sous-ensemble différent est tiré. Résultat : le réseau ne peut pas s'appuyer sur un neurone précis pour faire son travail — si ce neurone est éteint la prochaine fois, il faut que l'information soit quand même disponible ailleurs. Le réseau apprend des représentations plus redondantes et plus robustes."
        ),
        fig("dropoutExample", "À chaque pas d'entraînement, un sous-ensemble différent de neurones est masqué."),
        callout(
          "warn",
          "Entraînement vs inférence",
          "Le dropout ne s'active <strong>que pendant l'entraînement</strong>. À l'inférence (quand on utilise le modèle pour prédire), on désactive le dropout et on utilise tous les neurones. Si tu oublies cette bascule, les prédictions seront aléatoires et inutilisables."
        ),
        paragraphs(
          "Une façon de voir le dropout : c'est comme si on entraînait implicitement un <em>grand ensemble de sous-réseaux différents</em>, tous partageant les mêmes poids. À l'inférence, utiliser tous les neurones revient à faire un vote entre tous ces sous-réseaux — une forme d'ensemble learning gratuite."
        ),
        code(
          "python",
          `
import torch
from torch import nn

# Couche de dropout avec probabilité 0.5
dropout = nn.Dropout(p=0.5)

# Mode entraînement : 50 % des valeurs sont mises à zéro
dropout.train()
x = torch.ones(10)
print(dropout(x))   # ~[2, 0, 2, 2, 0, 0, 2, 0, 2, 2] (aléatoire)

# Mode inference : tout passe (on a appelle dropout.eval() au prealable)
dropout.eval()
print(dropout(x))   # [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
          `,
          "Dropout en PyTorch"
        )
      ),

      lesson(
        "Batch normalization : stabiliser le signal",
        paragraphs(
          "La <strong>batch normalization</strong> (BN, 2015) est une autre technique qui a transformé l'entraînement des réseaux profonds. Son principe : entre deux couches, on <em>normalise</em> les activations de sorte qu'elles aient une moyenne proche de 0 et une variance proche de 1 — calculées sur le mini-batch courant. Après cette normalisation, deux paramètres appris (un scale <var>γ</var> et un bias <var>β</var>) permettent au réseau de retrouver la distribution qu'il préfère si la normalisation était trop brutale."
        ),
        paragraphs(
          "Pourquoi c'est utile ? Parce que l'entraînement souffre quand la distribution des activations dérive d'une couche à l'autre — un phénomène qu'on appelait (à l'époque) <em>internal covariate shift</em>. En normalisant à chaque couche, on empêche cette dérive et on peut entraîner plus vite, avec un taux d'apprentissage plus élevé, et sur des réseaux beaucoup plus profonds."
        ),
        bullets([
          "Elle <strong>accélère</strong> l'entraînement — souvent d'un facteur 2 à 10.",
          "Elle <strong>stabilise</strong> les réseaux profonds et rend l'initialisation moins critique.",
          "Elle a un effet <strong>régularisant</strong> accessoire : on peut parfois se passer de dropout après une BN."
        ]),
        callout(
          "info",
          "Où la placer",
          "Dans un ConvNet classique, la BN se glisse après la convolution et avant l'activation : <code>Conv → BatchNorm → ReLU</code>. C'est devenu un standard depuis 2015, et la plupart des architectures modernes (ResNet, DenseNet, etc.) l'utilisent systématiquement."
        ),
        paragraphs(
          "Il existe d'autres variantes de normalisation (Layer Norm, Group Norm, Instance Norm) qui opèrent sur des axes différents. Elles sont utiles dans des contextes particuliers (petites tailles de batch, données séquentielles) mais la Batch Norm reste la plus répandue pour les ConvNet d'images."
        )
      )
    ].join(""),

    checklist: [
      "Je peux expliquer en une phrase à quoi sert le pooling et pourquoi il apporte de l'invariance par translation.",
      "Je sais calculer une sortie de max-pooling 2 × 2 à la main sur une petite feature map.",
      "Je peux calculer la taille de sortie d'une couche de pooling avec les bons hyperparamètres.",
      "Je connais la formule de ReLU et je peux dessiner sa courbe sans hésiter.",
      "Je peux citer au moins deux variantes de ReLU et dire pourquoi elles existent.",
      "Je comprends le dropout, sa mécanique pendant l'entraînement, et pourquoi on le désactive à l'inférence.",
      "Je peux expliquer en une phrase ce que fait la batch normalization et où la placer dans une architecture."
    ],

    quiz: [
      {
        question: "Appliqué au carré 2 × 2 contenant les valeurs {3, 9, 5, 7}, que retourne un max-pooling ?",
        options: [
          "6 (la moyenne)",
          "7 (le dernier élément)",
          "9 (la valeur maximale)",
          "24 (la somme)"
        ],
        answer: 2,
        explanation: "Le max-pooling garde le maximum de chaque bloc : max{3, 9, 5, 7} = 9."
      },
      {
        question: "Quelle est la principale différence entre max-pooling et average-pooling ?",
        options: [
          "Max-pooling a des paramètres à apprendre, pas l'average-pooling",
          "Max-pooling préserve les activations fortes, average-pooling les lisse",
          "Max-pooling réduit la taille par 4, average-pooling par 2",
          "Max-pooling ne fonctionne que sur des images en couleur"
        ],
        answer: 1,
        explanation: "Ni l'un ni l'autre n'a de paramètres. La vraie différence est conceptuelle : le max-pooling garde l'activation la plus forte de chaque bloc (« quelque chose a été détecté ici »), l'average-pooling calcule la moyenne (lissage)."
      },
      {
        question: "Pourquoi utilise-t-on ReLU plutôt que la sigmoïde dans les couches cachées d'un ConvNet ?",
        options: [
          "Parce que ReLU sature plus vite et empêche le sur-apprentissage",
          "Parce que ReLU a une dérivée constante (= 1) pour les valeurs positives, ce qui évite le vanishing gradient et accélère l'entraînement",
          "Parce que ReLU est une fonction linéaire, plus simple à dériver",
          "Parce que ReLU est bornée entre 0 et 1, comme la sigmoïde"
        ],
        answer: 1,
        explanation: "La sigmoïde sature pour les grandes valeurs absolues : sa dérivée devient minuscule et bloque l'apprentissage en couche profonde. ReLU a une dérivée égale à 1 partout où elle est positive, ce qui laisse le gradient circuler sans s'atténuer."
      },
      {
        question: "Pourquoi les variantes de ReLU (Leaky, PReLU, ELU) existent-elles ?",
        options: [
          "Pour réduire le nombre de paramètres du réseau",
          "Pour éviter les « neurones morts » qui restent bloqués à zéro",
          "Pour remplacer définitivement la convolution",
          "Pour accélérer le calcul sur CPU"
        ],
        answer: 1,
        explanation: "Un neurone ReLU dont la sortie devient négative pour toutes les entrées reste bloqué à zéro et son gradient aussi. Les variantes laissent passer une petite pente négative pour éviter cet effet « neurone mort »."
      },
      {
        question: "Quel est l'intérêt principal du dropout pendant l'entraînement ?",
        options: [
          "Accélérer le calcul en désactivant aléatoirement des neurones",
          "Réduire le sur-apprentissage en forçant le réseau à ne pas dépendre de neurones spécifiques",
          "Améliorer la précision à l'inférence en gardant certains neurones éteints",
          "Rendre le modèle plus petit en mémoire"
        ],
        answer: 1,
        explanation: "En désactivant aléatoirement une fraction des neurones à chaque passage, le dropout oblige le réseau à construire des représentations plus redondantes et plus robustes, ce qui limite le sur-apprentissage."
      },
      {
        question: "Quelle est la règle concernant le dropout entre entraînement et inférence ?",
        options: [
          "Il est actif dans les deux modes, avec la même probabilité p",
          "Il est actif uniquement pendant l'entraînement ; désactivé à l'inférence",
          "Il est actif uniquement à l'inférence, pour ajouter du bruit aux prédictions",
          "Il est automatiquement ajusté par le framework selon le moment"
        ],
        answer: 1,
        explanation: "Pendant l'entraînement, le dropout éteint aléatoirement des neurones pour régulariser. À l'inférence, on veut utiliser le modèle en entier pour prédire : on le désactive en basculant le modèle en mode inférence."
      },
      {
        question: "Que fait la batch normalization dans un ConvNet ?",
        options: [
          "Elle normalise les poids du réseau à chaque pas de gradient",
          "Elle normalise les activations (moyenne ≈ 0, variance ≈ 1) calculées sur le mini-batch courant",
          "Elle réduit la taille spatiale des feature maps comme un pooling",
          "Elle remplace la fonction d'activation ReLU"
        ],
        answer: 1,
        explanation: "La BN calcule la moyenne et l'écart-type des activations sur le mini-batch, puis les normalise avant de les passer à la couche suivante. Elle ajoute deux paramètres appris (γ, β) qui laissent le réseau retrouver la distribution qu'il préfère si besoin."
      }
    ],

    exercises: [
      {
        title: "Pooling à la main",
        difficulty: "Facile",
        time: "10 min",
        prompt: "Prends une feature map 6 × 6 remplie de chiffres de ton choix (par exemple des valeurs aléatoires entre 0 et 20). Applique un max-pooling 2 × 2 avec stride = 2 et écris la feature map 3 × 3 résultante. Puis fais le même exercice avec un average-pooling. Compare les deux sorties et note ce qui change concrètement.",
        deliverables: [
          "la feature map d'entrée 6 × 6",
          "la sortie 3 × 3 après max-pooling",
          "la sortie 3 × 3 après average-pooling",
          "deux phrases comparant les deux résultats"
        ]
      },
      {
        title: "Choisir la bonne activation",
        difficulty: "Intermédiaire",
        time: "15 min",
        prompt: "Pour chacun des cas suivants, propose une fonction d'activation adaptée et justifie en une phrase : (a) la couche cachée d'un ConvNet profond, (b) la sortie d'un classifieur binaire (chat ou non-chat), (c) la sortie d'un classifieur multi-classes à 10 classes, (d) la sortie d'une régression prédisant le prix d'une maison, (e) une couche cachée où tu observes beaucoup de neurones dont la sortie reste à zéro.",
        deliverables: [
          "une activation pour chaque cas (a) à (e)",
          "une phrase de justification pour chacune",
          "mention explicite de au moins une variante de ReLU quelque part"
        ]
      },
      {
        title: "Où placer le dropout ?",
        difficulty: "Intermédiaire",
        time: "15 min",
        prompt: "On te donne ce petit réseau : Conv(32) → ReLU → MaxPool → Conv(64) → ReLU → MaxPool → Flatten → Linear(128) → ReLU → Linear(10). On veut ajouter deux couches de dropout pour limiter le sur-apprentissage. Où les placerais-tu, et avec quel taux p chacune ? Justifie ton choix.",
        deliverables: [
          "l'architecture finale avec les dropouts placés",
          "la valeur de p pour chacun",
          "une justification en trois phrases maximum du placement choisi"
        ]
      },
      {
        title: "BN ou pas BN ?",
        difficulty: "Avancé",
        time: "20 min",
        prompt: "Tu entraînes un ConvNet de 20 couches sans batch normalization. Au bout de quelques epochs, la perte stagne et les gradients sont très petits dans les premières couches (tu as vérifié avec un outil de debug). Explique en 150-200 mots : (1) quel est probablement le problème, (2) comment la batch normalization pourrait aider, (3) où tu la placerais dans une couche type <code>Conv → ReLU</code>, et (4) quel autre levier tu pourrais essayer en complément.",
        deliverables: [
          "le diagnostic du problème",
          "une explication de l'effet de la BN",
          "l'emplacement précis de la BN dans la couche",
          "au moins un autre levier mentionné (initialisation, skip connection, etc.)"
        ]
      }
    ],

    keywords: [
      "pooling",
      "max-pooling",
      "average-pooling",
      "relu",
      "leaky relu",
      "elu",
      "prelu",
      "activation",
      "dropout",
      "batch normalization",
      "régularisation",
      "sur-apprentissage",
      "overfitting",
      "neurone mort"
    ]
  }
});
})(window);
