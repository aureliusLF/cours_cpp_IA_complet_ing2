(function registerChapterBundle7(globalScope) {
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
  order: 7,
  chapter: {
    id: "rnn-conventionnel-deroulage",
    shortTitle: "RNN formel",
    title: "Définir un RNN pas à pas",
    level: "Intermédiaire",
    duration: "1 h 20",
    track: "IA2",
    summary:
      "On passe ici du schema intuitif a la formulation propre. Le RNN conventionnel est decrit par deux equations, quelques matrices de poids, des biais et un etat cache qui se propage dans le temps. Le point cle du chapitre est le deroulage temporel : une fois deplié, le RNN ressemble a un reseau feedforward tres profond dont les poids sont partages a chaque pas.",
    goals: [
      "écrire les équations matricielles d'un RNN conventionnel",
      "donner les dimensions des matrices U, V, W et des vecteurs de biais",
      "traduire l'écriture matricielle en équations neurone par neurone",
      "dérouler un RNN dans le temps et interpréter le partage de poids",
      "distinguer ce qui relève des hyperparamètres et ce qui relève des paramètres appris"
    ],
    highlights: [
      "U V W",
      "état caché",
      "poids partagés",
      "déroulage",
      "hyperparamètres",
      "paramètres"
    ],
    body: [
      lesson(
        "Le RNN conventionnel en deux équations",
        paragraphs(
          "Le RNN conventionnel le plus simple comporte une couche d'entree, une couche cachee recurrente et une couche de sortie. Son entrée est une séquence <code>X_t</code>, <code>t = 1, ..., T</code>, et la longueur <code>T</code> peut varier d'un exemple à l'autre. Pour chaque pas de temps <code>t</code>, le calcul est resume par deux equations."
        ),
        formula(
          `<var>H</var><sup>t</sup> <span class="op">=</span> σ<sub>h</sub>(<var>U</var><var>X</var><sup>t</sup> <span class="op">+</span> <var>V</var><var>H</var><sup>t−1</sup> <span class="op">+</span> <var>B</var><sup>h</sup>)`,
          { caption: "L'état caché courant dépend de l'entrée courante et de l'état caché précédent." }
        ),
        formula(
          `<var>Y</var><sup>t</sup> <span class="op">=</span> σ<sub>o</sub>(<var>W</var><var>H</var><sup>t</sup> <span class="op">+</span> <var>B</var><sup>o</sup>)`,
          { caption: "La sortie courante est calculée à partir de l'état caché courant." }
        ),
        paragraphs(
          "On utilise souvent une sigmoide ou une tangente hyperbolique pour la couche cachee. Pour la sortie, le choix depend de la tache : softmax pour une classification multi-classes, sigmoide pour un cas binaire, ou sortie lineaire pour une regression."
        ),
        callout(
          "info",
          "Remarque importante",
          "Ce que ces équations définissent vraiment, c'est une <strong>couche récurrente</strong>. Cette couche peut ensuite vivre seule, être empilée plusieurs fois, ou cohabiter avec d'autres types de couches dans une architecture plus profonde."
        )
      ),

      lesson(
        "Dimensions des matrices et des vecteurs",
        paragraphs(
          "Notons <code>n</code> le nombre de neurones d'entree, <code>m</code> le nombre de neurones caches et <code>p</code> le nombre de neurones de sortie. Les dimensions des objets mathematiques suivent directement cette convention."
        ),
        table(
          ["Symbole", "Dimension", "Rôle"],
          [
            ["<code>X^t</code>", "<code>n</code>", "entrée au temps t"],
            ["<code>H^t</code>", "<code>m</code>", "état caché au temps t"],
            ["<code>Y^t</code>", "<code>p</code>", "sortie au temps t"],
            ["<code>U</code>", "<code>(m, n)</code>", "poids entrée -> caché"],
            ["<code>V</code>", "<code>(m, m)</code>", "poids caché précédent -> caché courant"],
            ["<code>W</code>", "<code>(p, m)</code>", "poids caché -> sortie"],
            ["<code>B^h</code>", "<code>m</code>", "biais caché"],
            ["<code>B^o</code>", "<code>p</code>", "biais sortie"]
          ]
        ),
        fig("rnnMatrixMap", "Le cœur du RNN : X_t va vers H_t via U, H_(t−1) revient via V, puis H_t produit Y_t via W."),
        callout(
          "info",
          "La matrice la plus importante",
          "Si tu dois en retenir une seule, retiens <code>V</code>. C'est la matrice de recurrence : elle relie l'etat cache du pas precedent a l'etat cache courant. C'est elle qui porte la memoire temporelle du modele."
        )
      ),

      lesson(
        "Notations détaillées et lecture neurone par neurone",
        paragraphs(
          "Les slides du cours détaillent aussi les notations. On note <code>x_i^t</code> la i-eme composante de l'entrée <code>X^t</code>, <code>h_j^t</code> la sortie du j-eme neurone caché, et <code>y_k^t</code> la sortie du k-eme neurone de sortie. On note également <code>u_ij</code>, <code>v_j'j</code> et <code>w_jk</code> les coefficients individuels des matrices <code>U</code>, <code>V</code> et <code>W</code>."
        ),
        table(
          ["Symbole", "Lecture", "Ce que cela représente"],
          [
            ["<code>x_i^t</code>", "entrée i au temps t", "une composante de <code>X^t</code>"],
            ["<code>h_j^t</code>", "neurone caché j au temps t", "une composante de <code>H^t</code>"],
            ["<code>y_k^t</code>", "sortie k au temps t", "une composante de <code>Y^t</code>"],
            ["<code>u_ij</code>", "poids entrée i -> caché j", "un coefficient de <code>U</code>"],
            ["<code>v_j'j</code>", "poids caché j' passé -> caché j courant", "un coefficient de <code>V</code>"],
            ["<code>w_jk</code>", "poids caché j -> sortie k", "un coefficient de <code>W</code>"]
          ]
        ),
        paragraphs(
          "L'ecriture matricielle est compacte, mais il faut savoir la redescendre au niveau d'un neurone. Pour le j-ieme neurone cache, on somme d'abord les contributions de l'entree, puis celles de l'etat precedent, puis on ajoute le biais avant l'activation."
        ),
        formula(
          `<var>h</var><sub>j</sub><sup>t</sup> <span class="op">=</span> σ<sub>h</sub>(<span class="sum">∑</span><span class="sum-limits"><span class="top"><var>n</var></span><span class="bot"><var>i</var>=1</span></span> <var>u</var><sub>ij</sub><var>x</var><sub>i</sub><sup>t</sup> <span class="op">+</span> <span class="sum">∑</span><span class="sum-limits"><span class="top"><var>m</var></span><span class="bot"><var>j'</var>=1</span></span> <var>v</var><sub>j'j</sub><var>h</var><sub>j'</sub><sup>t−1</sup> <span class="op">+</span> <var>b</var><sub>j</sub><sup>h</sup>)`,
          { caption: "Chaque neurone caché mélange l'entrée courante et toute la mémoire cachée précédente." }
        ),
        formula(
          `<var>y</var><sub>k</sub><sup>t</sup> <span class="op">=</span> σ<sub>o</sub>(<span class="sum">∑</span><span class="sum-limits"><span class="top"><var>m</var></span><span class="bot"><var>j</var>=1</span></span> <var>w</var><sub>jk</sub><var>h</var><sub>j</sub><sup>t</sup> <span class="op">+</span> <var>b</var><sub>k</sub><sup>o</sup>)`,
          { caption: "La sortie du reseau dépend uniquement de l'état caché courant." }
        ),
        paragraphs(
          "Cette lecture neurone par neurone permet de voir tres concretement que le RNN est un melange entre une couche dense classique et une connexion vers le passe."
        )
      ),

      lesson(
        "Déplier le réseau dans le temps",
        paragraphs(
          "Tant qu'on garde le RNN sous forme repliee, la boucle masque un peu le calcul. Pour comprendre l'apprentissage, on le <strong>deplie</strong> dans le temps. On obtient alors une chaine de copies identiques du meme bloc, une copie par pas de temps."
        ),
        fig("rnnUnrolledTime", "Une seule boucle vue de près devient une suite de copies identiques du même bloc le long du temps."),
        code(
          "text",
          `
Forme repliee
-------------
          +-------------+
X_t ----> |    RNN      | ----> Y_t
          |   h_t       |
          +-------------+
               ^   |
               |   |
               +---+

Forme deroulee
--------------
X_(t-1) --> [RNN] --> Y_(t-1)
              |
              v
             h_(t-1)

X_t     --> [RNN] --> Y_t
              |
              v
             h_t

X_(t+1) --> [RNN] --> Y_(t+1)
          `,
          "Le même bloc répété sur les pas de temps"
        ),
        paragraphs(
          "Le point crucial est que les copies du réseau deroule ne portent pas des poids differents. Elles reemploient toutes les memes matrices <code>U</code>, <code>V</code> et <code>W</code>. On a donc un reseau tres profond du point de vue du temps, mais avec <strong>partage de poids</strong> d'un pas au suivant."
        ),
        code(
          "python",
          `
import torch
from torch import nn

# 8 sequences, 12 pas de temps, 50 variables par pas
x = torch.randn(8, 12, 50)

# RNN simple
rnn = nn.RNN(input_size=50, hidden_size=128, batch_first=True)

# h_seq contient un etat cache pour chaque pas
h_seq, h_last = rnn(x)

print(h_seq.shape)   # (8, 12, 128)
print(h_last.shape)  # (1, 8, 128)
          `,
          "Lire les formes d'un RNN en PyTorch"
        )
      ),

      lesson(
        "Hyperparamètres d'un côté, paramètres de l'autre",
        paragraphs(
          "Comme pour les ConvNet, il faut distinguer ce que le concepteur choisit avant l'entrainement de ce que l'algorithme apprend ensuite. Les slides donnent trois familles d'hyperparamètres particulièrement importantes : le nombre de couches cachées, le nombre de neurones par couche, et les fonctions d'activation des couches cachées et de sortie."
        ),
        table(
          ["Nature", "Exemples", "Qui les fixe ?"],
          [
            ["Hyperparamètres", "nombre de couches récurrentes, taille cachée m, fonction d'activation, dimension d'entrée/sortie", "le concepteur"],
            ["Paramètres appris", "matrices U, V, W et biais B^h, B^o", "l'apprentissage"]
          ]
        ),
        callout(
          "warn",
          "Il n'y a pas de formule magique",
          "Comme pour les autres réseaux profonds, il n'existe pas de règle universelle qui donne les bons hyperparamètres d'un RNN. On part d'une configuration simple, on observe les courbes, puis on ajuste."
        )
      )
    ].join(""),

    checklist: [
      "Je peux écrire les deux équations d'un RNN conventionnel.",
      "Je sais donner les dimensions de U, V, W, B^h et B^o en fonction de n, m et p.",
      "Je sais expliquer les notations x_i^t, h_j^t, y_k^t, u_ij, v_j'j et w_jk.",
      "Je peux expliquer pourquoi V est la matrice de récurrence.",
      "Je peux lire une équation matricielle RNN au niveau neurone par neurone.",
      "Je comprends ce que signifie dérouler un RNN dans le temps et pourquoi les poids y sont partagés.",
      "Je sais distinguer hyperparamètres choisis et paramètres appris."
    ],

    quiz: [
      {
        question: "Dans l'équation <code>H^t = sigma(U X^t + V H^{t-1} + B^h)</code>, quel terme transporte la mémoire du pas précédent ?",
        options: [
          "<code>U X^t</code>",
          "<code>V H^{t-1}</code>",
          "<code>B^h</code>",
          "<code>sigma</code>"
        ],
        answer: 1,
        explanation: "Le produit <code>V H^{t-1}</code> injecte l'etat cache du pas precedent dans le calcul courant. C'est le coeur de la recurrence."
      },
      {
        question: "Si <code>n = 50</code>, <code>m = 128</code> et <code>p = 10</code>, quelle est la dimension de <code>V</code> ?",
        options: [
          "<code>(128, 50)</code>",
          "<code>(10, 128)</code>",
          "<code>(128, 128)</code>",
          "<code>(50, 128)</code>"
        ],
        answer: 2,
        explanation: "La matrice V relie l'etat cache precedent a l'etat cache courant. Elle va donc de m a m, ici (128, 128)."
      },
      {
        question: "Dérouler un RNN dans le temps revient surtout à :",
        options: [
          "changer les poids à chaque pas de temps",
          "dupliquer le même bloc sur plusieurs pas de temps avec poids partagés",
          "supprimer complètement la couche de sortie",
          "transformer le réseau en ConvNet"
        ],
        answer: 1,
        explanation: "Le reseau deroule est une chaine de copies du meme bloc recurrent. Les memes poids sont reutilises a chaque pas."
      },
      {
        question: "Que représente précisément le coefficient <code>v_j'j</code> ?",
        options: [
          "un poids entre l'entrée i et le neurone caché j",
          "un poids entre le neurone caché j' au temps précédent et le neurone caché j au temps courant",
          "un biais de sortie",
          "une probabilité softmax"
        ],
        answer: 1,
        explanation: "Le coefficient v_j'j appartient à la matrice V, celle qui transporte l'information d'un état caché précédent vers l'état caché courant."
      },
      {
        question: "Lequel des éléments suivants est un hyperparamètre et non un paramètre appris ?",
        options: [
          "la matrice U",
          "la matrice V",
          "le nombre de neurones cachés m",
          "le biais de sortie B^o"
        ],
        answer: 2,
        explanation: "La taille cachee m est choisie par le concepteur. Les matrices et les biais, eux, sont appris pendant l'entrainement."
      },
      {
        question: "La sortie <code>Y^t</code> d'un RNN conventionnel dépend directement de :",
        options: [
          "l'état caché courant <code>H^t</code>",
          "l'état caché précédent <code>H^{t-1}</code> uniquement",
          "l'entrée <code>X^t</code> uniquement",
          "la taille de la séquence T uniquement"
        ],
        answer: 0,
        explanation: "La sortie est calculee a partir de l'etat cache courant via la matrice W et le biais de sortie."
      }
    ],

    exercises: [
      {
        title: "Dimensions de matrices",
        difficulty: "Facile",
        time: "12 min",
        prompt: "On te donne un RNN avec n = 20, m = 64 et p = 5. Redonne les dimensions de X^t, H^t, Y^t, U, V, W, B^h et B^o, puis explique a quoi sert chacune de ces matrices.",
        deliverables: [
          "les dimensions des 8 objets",
          "une phrase de rôle pour U, V et W",
          "une phrase expliquant pourquoi V est carree"
        ]
      },
      {
        title: "Passer du matriciel au neurone",
        difficulty: "Intermédiaire",
        time: "15 min",
        prompt: "Réécris l'équation matricielle de la couche cachée d'un RNN en version neurone par neurone pour h_j^t. Puis fais la même chose pour y_k^t.",
        deliverables: [
          "l'equation de h_j^t",
          "l'equation de y_k^t",
          "une phrase expliquant le sens de chaque somme"
        ]
      },
      {
        title: "Dérouler le réseau",
        difficulty: "Intermédiaire",
        time: "15 min",
        prompt: "Dessine ou decris textuellement un RNN deroule sur 4 pas de temps. Fais apparaitre X_1 a X_4, H_0 a H_4 et Y_1 a Y_4, puis explique ou intervient le partage de poids.",
        deliverables: [
          "un schema ou une description ordonnee des 4 pas",
          "la place de l'etat cache entre les pas",
          "une explication claire du partage de poids"
        ]
      }
    ],

    keywords: [
      "rnn",
      "état caché",
      "déroulage",
      "poids partagés",
      "matrice U",
      "matrice V",
      "matrice W",
      "biais",
      "hyperparamètres"
    ]
  }
});
})(window);
