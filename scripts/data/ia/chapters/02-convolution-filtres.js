(function registerChapterBundle2(globalScope) {
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
  order: 2,
  chapter: {
    id: "convolution-filtres",
    shortTitle: "Convolution",
    title: "La convolution, des filtres qui glissent",
    level: "Fondations",
    duration: "1 h 30",
    track: "IA1",
    summary:
      "La convolution est l'opération qui donne son nom aux ConvNet. Dans ce chapitre, on la démonte pas à pas : l'intuition du filtre glissant, la formule mathématique, un exemple chiffré à la main, puis les trois hyperparamètres (taille, stride, padding) qui contrôlent tout. On finit par le partage de poids et le champ récepteur — les deux idées qui rendent les ConvNet à la fois économes et capables de voir large.",
    goals: [
      "décrire intuitivement ce que fait un filtre qui glisse sur une image",
      "poser à la main le calcul d'une convolution 2D sur une petite matrice",
      "calculer la taille de sortie avec la formule (n + 2p − f) / s + 1",
      "savoir régler les trois hyperparamètres : taille de filtre, stride, padding",
      "chiffrer le gain du partage de poids face à une couche fully connected",
      "comprendre comment le champ récepteur grandit couche après couche"
    ],
    highlights: [
      "convolution",
      "filtre",
      "stride",
      "padding",
      "partage de poids",
      "champ récepteur"
    ],
    body: [
      lesson(
        "Intuition : un filtre qui cherche un motif",
        paragraphs(
          "L'idée est simple : on prend un petit tableau de poids qu'on appelle un <strong>filtre</strong> (ou <em>kernel</em>), et on le fait glisser sur l'image d'entrée, position par position. À chaque position, on calcule une somme pondérée des pixels recouverts par le filtre. Là où le filtre « ressemble » à ce qu'il survole, le résultat est grand. Partout ailleurs, il est petit. On obtient ainsi une nouvelle image qui dit « le motif cherché est ici, et là, et encore là »."
        ),
        fig("convolutionSlide", "Le filtre glisse sur l'entrée et produit une carte qui s'illumine là où le motif est présent."),
        paragraphs(
          "C'est exactement comme si on promenait un gabarit sur une image à la recherche d'une forme précise. Un filtre qui détecte les bords verticaux va allumer les endroits où l'image a des bords verticaux. Un filtre qui détecte les textures granuleuses va allumer les zones granuleuses. Le génie de la méthode : on ne code pas ces filtres à la main — on les <em>apprend</em> pendant l'entraînement. Le réseau découvre lui-même quels motifs sont utiles à détecter pour résoudre la tâche."
        ),
        callout(
          "info",
          "Une « carte » par filtre",
          "Le résultat de la convolution d'un filtre sur toute l'entrée s'appelle une <em>feature map</em> (carte de caractéristiques). Une couche de convolution utilise généralement plusieurs filtres en parallèle, donc elle produit plusieurs feature maps empilées — un volume 3D, pas une simple image 2D."
        )
      ),

      lesson(
        "La formule, pas à pas",
        paragraphs(
          "Traduisons l'intuition en maths. Si <var>T</var> est un tableau <var>n</var>&thinsp;×&thinsp;<var>n</var> et <var>W</var> un filtre <var>m</var>&thinsp;×&thinsp;<var>m</var> avec <var>m</var>&nbsp;≤&nbsp;<var>n</var>, la convolution (sans padding ni stride supplémentaire) produit un tableau <var>Conv</var> de taille (<var>n</var>&nbsp;−&nbsp;<var>m</var>&nbsp;+&nbsp;1)&thinsp;×&thinsp;(<var>n</var>&nbsp;−&nbsp;<var>m</var>&nbsp;+&nbsp;1), où chaque case vaut :"
        ),
        formula(
          `<var>Conv</var>(<var>i</var>,&thinsp;<var>j</var>) <span class="op">=</span> <span class="sum">∑</span><span class="sum-limits"><span class="top"><var>m</var>−1</span><span class="bot"><var>k</var>=0</span></span> <span class="sum">∑</span><span class="sum-limits"><span class="top"><var>m</var>−1</span><span class="bot"><var>l</var>=0</span></span> <var>W</var>(<var>k</var>,&thinsp;<var>l</var>) · <var>T</var>(<var>i</var>&thinsp;+&thinsp;<var>k</var>,&thinsp; <var>j</var>&thinsp;+&thinsp;<var>l</var>)`,
          { caption: "Chaque case de la sortie est une somme pondérée des pixels recouverts par le filtre." }
        ),
        paragraphs(
          "Traduit en français : on pose le filtre sur la zone qui commence en position (<var>i</var>,&nbsp;<var>j</var>), on multiplie chaque poids par le pixel en dessous, on additionne tout, et on écrit le résultat en (<var>i</var>,&nbsp;<var>j</var>) de la sortie. En pratique, on ajoute aussi un <strong>biais</strong> <var>b</var> et une fonction d'activation <var>σ</var> (par exemple ReLU), donc la sortie d'un neurone de la couche de convolution s'écrit plus précisément :"
        ),
        formula(
          `<var>y</var>(<var>i</var>,&thinsp;<var>j</var>) <span class="op">=</span> <span class="fn">σ</span>(<var>b</var> <span class="op">+</span> <span class="sum">∑</span><span class="sum-limits"><span class="top"><var>m</var>−1</span><span class="bot"><var>k</var>=0</span></span> <span class="sum">∑</span><span class="sum-limits"><span class="top"><var>m</var>−1</span><span class="bot"><var>l</var>=0</span></span> <var>w</var>(<var>k</var>,&thinsp;<var>l</var>) · <var>x</var>(<var>i</var>&thinsp;+&thinsp;<var>k</var>,&thinsp; <var>j</var>&thinsp;+&thinsp;<var>l</var>))`,
          { caption: "σ = activation ; b = biais ; w(k, l) = poids partagés du filtre ; x = sortie de la couche précédente." }
        ),
        callout(
          "warn",
          "Un détail important",
          "Ce qu'on appelle « convolution » en deep learning est en fait une <em>corrélation croisée</em> au sens mathématique strict (la vraie convolution retournerait le filtre). Cette nuance ne change rien en pratique car les poids sont appris : le réseau apprend le filtre retourné s'il le faut. On garde le nom « convolution » par habitude."
        )
      ),

      lesson(
        "Un exemple chiffré à poser sur feuille",
        paragraphs(
          "Passons du symbolique au concret. Voici une entrée 4 × 4, un filtre 3 × 3, et le détail d'un calcul :"
        ),
        fig("convolutionNumeric", "Le filtre est posé en haut à gauche, les 9 produits sont listés, puis sommés."),
        code(
          "text",
          `
Entrée 4 x 4                  Filtre 3 x 3
+---+---+---+---+             +---+---+---+
| 1 | 2 | 0 | 1 |             | 1 | 0 | 1 |
+---+---+---+---+             +---+---+---+
| 0 | 1 | 3 | 2 |             | 0 | 1 | 0 |
+---+---+---+---+             +---+---+---+
| 2 | 1 | 0 | 0 |             | 1 | 0 | 1 |
+---+---+---+---+
| 0 | 3 | 1 | 2 |
+---+---+---+---+

On pose le filtre sur la zone en haut a gauche :

Conv(0, 0) = 1*1 + 2*0 + 0*1
           + 0*0 + 1*1 + 3*0
           + 2*1 + 1*0 + 0*1
           = 1 + 1 + 2
           = 4

Taille de sortie : (4 - 3 + 1) = 2, donc Conv est un tableau 2 x 2.
          `,
          "Convolution manuelle (taille 4 x 4, filtre 3 x 3)"
        ),
        paragraphs(
          "En NumPy, cette même opération tient en quelques lignes. Le code n'a rien à envier à la formule : c'en est la traduction directe."
        ),
        code(
          "python",
          `
import numpy as np

T = np.array([[1, 2, 0, 1],
              [0, 1, 3, 2],
              [2, 1, 0, 0],
              [0, 3, 1, 2]])

W = np.array([[1, 0, 1],
              [0, 1, 0],
              [1, 0, 1]])

n, m = T.shape[0], W.shape[0]
conv = np.zeros((n - m + 1, n - m + 1))

for i in range(n - m + 1):
    for j in range(n - m + 1):
        conv[i, j] = np.sum(W * T[i:i+m, j:j+m])

print(conv)
# [[4. 5.]
#  [4. 6.]]
          `,
          "Convolution 2D en NumPy pur"
        ),
        callout(
          "info",
          "Interprétation visuelle",
          "Une valeur élevée dans Conv signifie : « ici, dans l'image d'entrée, il y a quelque chose qui ressemble au filtre ». Si le filtre détecte des lignes verticales, les endroits où Conv est grand sont ceux où l'image contient des lignes verticales. Le filtre est littéralement un <em>template</em> que l'on fait glisser."
        )
      ),

      lesson(
        "Les trois hyperparamètres : taille, stride, padding",
        paragraphs(
          "Quand on définit une couche de convolution, on doit fixer trois nombres qui contrôlent entièrement sa géométrie : la taille du filtre <var>f</var>, le stride <var>s</var>, et le padding <var>p</var>. Regardons ce que chacun change."
        ),
        paragraphs(
          "<strong>Taille du filtre <var>f</var>.</strong> C'est la largeur (et hauteur) du petit tableau de poids. Les choix classiques sont 3 × 3, 5 × 5, ou 7 × 7. Un filtre plus grand voit une zone plus large, mais a plus de poids à apprendre. En pratique, les architectures modernes empilent plutôt plusieurs petits filtres 3 × 3 qu'un gros filtre 7 × 7 — deux couches 3 × 3 voient la même zone qu'un 5 × 5 mais avec moins de poids et plus de non-linéarités."
        ),
        paragraphs(
          "<strong>Stride <var>s</var>.</strong> C'est le pas avec lequel on déplace le filtre à chaque étape. Un stride de 1 signifie qu'on avance d'une case à chaque fois (le mode par défaut). Un stride de 2 signifie qu'on saute une case sur deux, ce qui divise la taille de sortie par 2 — c'est une façon de réduire la dimension en même temps qu'on convole."
        ),
        fig("strideExample", "Stride = 1 : le filtre couvre toutes les positions. Stride = 2 : il saute une case sur deux."),
        paragraphs(
          "<strong>Padding <var>p</var>.</strong> C'est une bordure de zéros qu'on ajoute autour de l'image avant de convoler. Sans padding, une convolution 3 × 3 sur une entrée 32 × 32 produit une sortie 30 × 30 — on perd 2 pixels sur chaque dimension. Avec un padding de 1, on récupère exactement la taille d'entrée (32 × 32). C'est le mode « same » qu'on voit souvent dans les frameworks."
        ),
        fig("paddingExample", "Sans padding : la sortie rétrécit. Avec padding = 1 : la taille est préservée."),
        callout(
          "success",
          "Règle de géométrie universelle",
          "Pour une entrée de taille <var>n</var>, un filtre <var>f</var>, un padding <var>p</var> et un stride <var>s</var>, la taille de sortie est : <code>(n + 2p − f) / s + 1</code>. Apprends cette formule par cœur — tu en auras besoin à chaque fois que tu liras ou que tu écriras une architecture."
        ),
        table(
          ["Entrée", "Filtre", "Padding", "Stride", "Taille de sortie"],
          [
            ["32 × 32", "3 × 3", "0", "1", "30 × 30"],
            ["32 × 32", "3 × 3", "1", "1", "32 × 32 (mode « same »)"],
            ["32 × 32", "5 × 5", "2", "1", "32 × 32"],
            ["32 × 32", "3 × 3", "1", "2", "16 × 16"],
            ["224 × 224", "7 × 7", "3", "2", "112 × 112 (première couche d'AlexNet/VGG)"]
          ]
        )
      ),

      lesson(
        "Partage de poids : le gain spectaculaire",
        paragraphs(
          "Voici la partie qui change tout, et qui justifie à elle seule l'existence des ConvNet. Dans une couche de convolution, <strong>le même filtre (les mêmes poids, le même biais) est utilisé à toutes les positions spatiales</strong>. C'est le <em>partage de poids</em>. L'intuition : si une ligne verticale est un motif utile à détecter, elle est utile <em>partout</em> dans l'image, pas seulement dans le coin en haut à gauche."
        ),
        fig("weightSharingVisualisation", "Un seul filtre, appliqué à toutes les positions spatiales — un seul jeu de poids à apprendre."),
        paragraphs(
          "Chiffrons le gain. Imagine une image <strong>224 × 224 en couleur</strong>. Ça fait 224 × 224 × 3 = 150 528 entrées. Si la première couche cachée a 1000 neurones :"
        ),
        bullets([
          "<strong>Avec une couche fully connected</strong> : chaque neurone a son propre jeu de poids vers les 150 528 entrées. Total : 150 528 × 1000 ≈ <strong>150 millions</strong> de paramètres pour une seule couche.",
          "<strong>Avec une convolution</strong> utilisant 32 filtres 5 × 5 × 3 : chaque filtre a 5 × 5 × 3 = 75 poids (partagés sur toute l'image) + 1 biais = 76 paramètres. Total : 32 × 76 = <strong>2432 paramètres</strong>.",
          "<strong>Rapport</strong> : on passe de ~10⁸ à ~10³ paramètres, soit environ 60 000 fois moins."
        ]),
        callout(
          "warn",
          "Pourquoi c'est si important",
          "Avec 150 millions de poids à apprendre rien que pour la première couche, aucun modèle ne tiendrait en mémoire, et aucun jeu de données ne serait assez grand pour éviter le sur-apprentissage. Le partage de poids n'est pas une optimisation accessoire : c'est <em>la</em> condition qui rend les ConvNet entraînables sur des images."
        ),
        paragraphs(
          "Il y a aussi un bénéfice conceptuel : en imposant qu'un même filtre soit utilisé partout, on code dans l'architecture elle-même l'hypothèse que les motifs utiles sont <em>invariants par translation</em>. Le réseau ne peut pas « tricher » en apprenant un détecteur de chat qui ne marche qu'en haut à gauche — il est forcé d'apprendre un détecteur qui marche partout."
        )
      ),

      lesson(
        "Champ récepteur et empilement des couches",
        paragraphs(
          "Un filtre 3 × 3 ne regarde qu'une zone 3 × 3 de son entrée. Alors comment un réseau avec seulement des convolutions 3 × 3 peut-il finalement « voir » une image entière ? La réponse tient en un mot : l'<strong>empilement</strong>. Chaque couche superposée voit un peu plus de l'image initiale, parce qu'elle regarde les sorties d'une couche qui a elle-même regardé un peu plus loin."
        ),
        fig("receptiveFieldGrowth", "Le champ récepteur grandit couche après couche, comme un cône qui s'élargit en profondeur."),
        paragraphs(
          "On appelle <strong>champ récepteur</strong> d'un neurone la zone de l'entrée originelle qui influence réellement sa valeur. À la première couche (filtre 3 × 3), le champ récepteur est 3 × 3. À la deuxième couche, il devient 5 × 5 (chaque neurone regarde un 3 × 3 de neurones qui voient chacun un 3 × 3 légèrement décalé). À la troisième, 7 × 7. Et ainsi de suite : le champ récepteur grandit en <var>2k + 1</var> après <var>k</var> couches 3 × 3 empilées avec stride 1."
        ),
        table(
          ["Couche", "Taille du filtre", "Stride", "Champ récepteur cumulé"],
          [
            ["1", "3 × 3", "1", "3 × 3"],
            ["2", "3 × 3", "1", "5 × 5"],
            ["3", "3 × 3", "1", "7 × 7"],
            ["4", "3 × 3", "1", "9 × 9"],
            ["5", "3 × 3", "1", "11 × 11"]
          ]
        ),
        paragraphs(
          "Le stride et le pooling accélèrent encore la croissance du champ récepteur. Dans les architectures réelles, les dernières couches voient généralement toute l'image, ce qui leur permet de prendre des décisions globales (« il y a un chat dans cette image »). Les premières couches, en revanche, se contentent de repérer des motifs locaux (« bord vertical ici », « tache rouge là »)."
        ),
        callout(
          "info",
          "Le cône de vision qui s'élargit",
          "Une image mentale utile : imagine un cône renversé qui part de chaque neurone profond et s'élargit vers l'entrée. Ce cône est le champ récepteur. Plus on est profond dans le réseau, plus le cône est large — et donc plus le neurone voit une zone étendue de l'image."
        )
      ),

      lesson(
        "Feature maps multiples : penser en volumes",
        paragraphs(
          "Dernière étape de ce chapitre : réaliser qu'une couche de convolution ne travaille pas sur des images 2D, mais sur des <strong>volumes 3D</strong>. L'entrée d'une couche Conv a trois dimensions : hauteur, largeur, et <strong>profondeur</strong> (nombre de canaux). Pour une image RGB, la profondeur d'entrée est 3 (rouge, vert, bleu). Pour la sortie d'une couche qui utilisait 32 filtres, la profondeur est 32."
        ),
        code(
          "text",
          `
Un volume de feature maps, c'est empiler plusieurs cartes 2D :

     feature map 1 (bords verticaux)
    +---+---+---+---+
    |   |   |   |   |
    +---+---+---+---+
     feature map 2 (bords horizontaux)
    +---+---+---+---+
    |   |   |   |   |
    +---+---+---+---+
     feature map 3 (textures)
    +---+---+---+---+
    |   |   |   |   |
    +---+---+---+---+
     ... (32 feature maps au total si la couche a 32 filtres)

Un pixel de la sortie a donc trois coordonnees : (ligne, colonne, canal).
          `,
          "Empilement de feature maps"
        ),
        paragraphs(
          "Quand la couche suivante convole à son tour ce volume, elle doit utiliser des filtres qui ont eux-mêmes une profondeur 32. Un filtre <code>3 × 3 × 32</code> fait exactement 3 × 3 × 32 = 288 produits par position, puis somme le tout. La convolution est donc en réalité une convolution <strong>3D</strong> du point de vue des tenseurs, mais elle ne glisse que sur les deux dimensions spatiales — la dimension des canaux est entièrement recouverte à chaque position."
        ),
        callout(
          "warn",
          "Ne pas confondre",
          "La <strong>profondeur de la couche</strong> (le nombre de feature maps qu'elle produit, typiquement 32, 64, 128…) n'a rien à voir avec la <strong>profondeur du réseau</strong> (le nombre de couches empilées). Les deux concepts utilisent malheureusement le même mot."
        ),
        paragraphs(
          "Pour compter les paramètres d'une couche Conv précise, la formule complète est : <code>(f × f × C_in + 1) × C_out</code>, où <code>C_in</code> est le nombre de canaux d'entrée, <code>C_out</code> le nombre de filtres (= canaux de sortie), et le <code>+ 1</code> correspond au biais de chaque filtre."
        )
      )
    ].join(""),

    checklist: [
      "Je peux décrire en une phrase ce que fait un filtre qui glisse sur une image.",
      "Je sais poser à la main le calcul d'une convolution 3 × 3 sur une matrice 4 × 4 ou 5 × 5.",
      "Je connais par cœur la formule de taille de sortie <code>(n + 2p − f) / s + 1</code> et je peux l'appliquer rapidement.",
      "Je comprends individuellement les rôles de la taille du filtre, du stride et du padding.",
      "Je peux chiffrer le gain du partage de poids sur un exemple concret (image 224 × 224, filtre 5 × 5).",
      "Je peux expliquer comment le champ récepteur grandit quand on empile des couches.",
      "Je comprends qu'une couche Conv produit un volume de feature maps, pas une simple image 2D.",
      "Je peux calculer le nombre exact de paramètres d'une couche Conv avec la formule <code>(f · f · C_in + 1) · C_out</code>."
    ],

    quiz: [
      {
        question: "On applique une couche Conv avec 16 filtres 5 × 5, stride = 1, padding = 0, sur une entrée 32 × 32 × 3. Quelle est la taille spatiale de sortie ?",
        options: [
          "32 × 32",
          "28 × 28",
          "16 × 16",
          "5 × 5"
        ],
        answer: 1,
        explanation: "Formule : (32 + 2·0 − 5) / 1 + 1 = 28. Chaque dimension perd f − 1 = 4 pixels. La sortie est donc 28 × 28 × 16."
      },
      {
        question: "Même entrée 32 × 32 × 3, même filtre 5 × 5, mais cette fois avec padding = 2 et stride = 1. Taille de sortie ?",
        options: [
          "32 × 32",
          "28 × 28",
          "30 × 30",
          "36 × 36"
        ],
        answer: 0,
        explanation: "(32 + 2·2 − 5) / 1 + 1 = 32. Un padding de (f − 1) / 2 préserve exactement la taille d'entrée quand le stride vaut 1. C'est le mode « same »."
      },
      {
        question: "Quel est le rôle principal du stride dans une couche de convolution ?",
        options: [
          "Contrôler la taille du filtre appris",
          "Ajouter des zéros autour de l'image",
          "Fixer le pas de déplacement du filtre, et donc réduire la taille de sortie quand il est grand",
          "Choisir la fonction d'activation appliquée après la convolution"
        ],
        answer: 2,
        explanation: "Le stride est le pas avec lequel on déplace le filtre. Un stride de 2 saute une case sur deux et divise la taille de sortie par 2 — une alternative au pooling pour réduire la dimension."
      },
      {
        question: "Pourquoi ajoute-t-on du padding à une entrée avant de la convoler ?",
        options: [
          "Pour que le filtre puisse traiter correctement les bords et pour préserver la taille d'entrée",
          "Pour accélérer le calcul sur GPU",
          "Pour réduire le nombre de paramètres du filtre",
          "Pour éviter le sur-apprentissage"
        ],
        answer: 0,
        explanation: "Sans padding, les bords sont sous-représentés (le filtre ne s'y pose que partiellement) et l'image rétrécit à chaque convolution. Avec un padding bien choisi, on traite tous les pixels équitablement et on conserve la taille d'entrée."
      },
      {
        question: "Quel est le rôle fondamental du partage de poids dans une couche de convolution ?",
        options: [
          "Accélérer la convergence en gelant certains poids pendant l'entraînement",
          "Réduire drastiquement le nombre de paramètres en réutilisant le même filtre à toutes les positions",
          "Permettre au réseau de mémoriser les exemples d'entraînement",
          "Transformer les activations en probabilités normalisées"
        ],
        answer: 1,
        explanation: "Le partage de poids revient à dire « ce filtre est utile partout », ce qui divise le nombre de paramètres de plusieurs ordres de grandeur et rend l'entraînement réaliste. Accessoirement, ça impose aussi une invariance par translation au niveau de l'architecture."
      },
      {
        question: "Une couche Conv prend en entrée 28 × 28 × 16 et utilise 32 filtres 3 × 3. Combien a-t-elle de paramètres au total (biais inclus) ?",
        options: [
          "3 · 3 · 16 + 32 = 176",
          "(3 · 3 · 16 + 1) · 32 = 4640",
          "(3 · 3 + 1) · 32 = 320",
          "3 · 3 · 32 = 288"
        ],
        answer: 1,
        explanation: "Chaque filtre a une profondeur égale au nombre de canaux d'entrée : 3 · 3 · 16 = 144 poids, plus 1 biais, soit 145 paramètres par filtre. Avec 32 filtres : 145 · 32 = 4640 paramètres."
      },
      {
        question: "En empilant 4 couches de convolution 3 × 3 avec stride = 1 et sans pooling, quel est le champ récepteur d'un neurone de la 4ᵉ couche ?",
        options: [
          "3 × 3",
          "5 × 5",
          "7 × 7",
          "9 × 9"
        ],
        answer: 3,
        explanation: "Pour des filtres 3 × 3 avec stride 1 empilés, le champ récepteur après k couches vaut 2k + 1. Après 4 couches : 2 · 4 + 1 = 9. Autrement dit, chaque neurone de la 4ᵉ couche voit une zone 9 × 9 de l'entrée originelle."
      }
    ],

    exercises: [
      {
        title: "Convolution à la main",
        difficulty: "Facile",
        time: "15 min",
        prompt: "Prends une matrice <code>T</code> de taille 5 × 5 remplie de chiffres de ton choix et un filtre <code>W</code> 3 × 3. Calcule manuellement les 9 valeurs de la convolution <code>Conv(i, j)</code> avec stride = 1 et sans padding. Vérifie ensuite ton résultat en écrivant le même calcul en NumPy (quelques lignes de boucles suffisent).",
        deliverables: [
          "la matrice d'entrée et le filtre choisis",
          "les 9 valeurs de la sortie, avec le détail d'au moins un calcul",
          "le code NumPy qui reproduit le même résultat"
        ]
      },
      {
        title: "Jongler avec stride et padding",
        difficulty: "Intermédiaire",
        time: "20 min",
        prompt: "Tu as une entrée 64 × 64 × 3 et tu veux produire une sortie de taille exactement 32 × 32 en utilisant une seule couche de convolution avec un filtre 5 × 5. Trouve une combinaison (stride, padding) qui donne cette taille de sortie. Ensuite, calcule le nombre de paramètres de ta couche si elle utilise 64 filtres. Enfin, propose une deuxième combinaison différente qui donne aussi 32 × 32 et justifie laquelle tu préfères.",
        deliverables: [
          "une combinaison (stride, padding) valide et le détail du calcul de taille",
          "une deuxième combinaison différente",
          "le nombre exact de paramètres de la couche",
          "une phrase justifiant ton choix préféré"
        ]
      },
      {
        title: "Économie de paramètres",
        difficulty: "Intermédiaire",
        time: "20 min",
        prompt: "On dispose d'une image d'entrée 64 × 64 en niveaux de gris. On veut produire une couche cachée de taille 64 × 64 avec : option A — une couche <em>fully connected</em> qui va de 64 × 64 = 4096 entrées vers 4096 sorties, option B — une convolution avec un seul filtre 3 × 3 et padding = 1 (mode « same »). Compte précisément le nombre de paramètres de chaque option, puis explique ce que cette différence implique pour l'entraînement et la généralisation.",
        deliverables: [
          "le calcul exact du nombre de paramètres pour A et pour B",
          "le rapport entre les deux",
          "deux phrases justifiant pourquoi la version convolution généralise mieux"
        ]
      },
      {
        title: "Champ récepteur en cascade",
        difficulty: "Avancé",
        time: "25 min",
        prompt: "Considère une petite architecture : Conv 3 × 3 stride 1 → Conv 3 × 3 stride 1 → MaxPool 2 × 2 stride 2 → Conv 3 × 3 stride 1 → Conv 3 × 3 stride 1. Calcule le champ récepteur d'un neurone de la dernière couche sur l'entrée originelle. Puis explique pourquoi, dans les architectures modernes, on préfère souvent empiler deux couches 3 × 3 plutôt que d'utiliser une seule couche 5 × 5.",
        deliverables: [
          "le calcul couche par couche du champ récepteur",
          "la valeur finale du champ récepteur",
          "deux raisons concrètes pour lesquelles deux couches 3 × 3 sont préférables à une couche 5 × 5 (nombre de paramètres, non-linéarités)"
        ]
      }
    ],

    keywords: [
      "convolution",
      "filtre",
      "kernel",
      "stride",
      "padding",
      "feature map",
      "partage de poids",
      "weight sharing",
      "champ récepteur",
      "receptive field",
      "taille de sortie",
      "hyperparamètre",
      "convnet",
      "cnn"
    ]
  }
});
})(window);
