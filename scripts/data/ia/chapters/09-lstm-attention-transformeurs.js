(function registerChapterBundle9(globalScope) {
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
  order: 9,
  chapter: {
    id: "lstm-attention-transformeurs",
    shortTitle: "LSTM & suite",
    title: "Des RNN au LSTM et aux transformeurs",
    level: "Intermédiaire",
    duration: "1 h 30",
    track: "IA2",
    summary:
      "Le RNN standard est elegant, mais sa memoire est courte et son apprentissage instable sur les dependances longues. Ce chapitre montre d'abord d'ou viennent ces limites, puis introduit le LSTM comme remede base sur des portes. Il se termine par la suite logique : encodeur-decodeur, attention, puis transformeurs.",
    goals: [
      "expliquer pourquoi un RNN standard oublie vite sur les longues séquences",
      "relier cette mémoire courte au vanishing/exploding gradient dans le temps",
      "interpréter les équations principales d'un LSTM",
      "décrire le rôle des trois portes d'un LSTM et de l'état de cellule",
      "comprendre le goulot d'étranglement encodeur-décodeur et l'apport de l'attention",
      "situer les transformeurs comme une architecture de séquences sans récurrence explicite"
    ],
    highlights: [
      "mémoire courte",
      "LSTM",
      "portes",
      "état de cellule",
      "attention",
      "transformeur"
    ],
    body: [
      lesson(
        "Pourquoi le RNN standard oublie",
        paragraphs(
          "Le RNN standard resume tout le passe dans un seul etat cache <code>h_t</code>. C'est elegant, mais aussi tres contraignant : plus la sequence est longue, plus cet etat doit comprimer d'informations. Quand une dependance importante est tres lointaine, le reseau a souvent du mal a la conserver."
        ),
        paragraphs(
          "Exemple classique tiré du cours : dans une longue phrase, un pronom final peut renvoyer a un nom apparu bien plus tot. Si l'etat cache a deja ecrase cette information, la prediction locale devient bancale. Dans la phrase « Elle m'a annoncé son intention de se présenter aux élections. Je n'y croyais pas, mais, par amitié, je lui ai écrit pour lui souhaiter bonne chance », il faut encore se souvenir de « Elle » très loin plus tard pour interpréter correctement « lui »."
        ),
        callout(
          "warn",
          "Mémoire courte",
          "Dire qu'un RNN a une memoire ne signifie pas qu'il se souvient facilement de tout. La memoire existe, mais elle est fragile sur les longues dependances."
        )
      ),

      lesson(
        "Vanishing et exploding gradient dans le temps",
        paragraphs(
          "Cette memoire courte est directement liee au mecanisme d'apprentissage. Pendant BPTT, le gradient doit remonter a travers de nombreux pas de temps. Or il est multiplie a repetion par la matrice recurrente <code>V</code> et par les derivees des activations."
        ),
        fig("rnnGradientInstability", "Sur une longue chaîne temporelle, le signal de correction peut soit s'éteindre, soit exploser."),
        bullets([
          "<strong>vanishing gradient</strong> : les produits successifs deviennent tres petits, le signal de correction s'evapore, les dependances lointaines ne s'apprennent plus",
          "<strong>exploding gradient</strong> : les produits successifs deviennent enormes, l'optimisation devient instable et peut diverger"
        ]),
        paragraphs(
          "Intuitivement, si la dynamique recurrente contracte trop l'information, le passe lointain cesse d'influencer utilement le present. Si elle l'amplifie trop, l'apprentissage devient numeriquement ingérable. Le LSTM a ete concu precisement pour ouvrir un chemin de memoire plus stable."
        )
      ),

      lesson(
        "LSTM : une mémoire contrôlée par des portes",
        paragraphs(
          "Le LSTM ajoute une memoire plus explicite, notee <code>c_t</code>, appelee <strong>etat de cellule</strong>. L'idee cle est de separer ce qui est memorise sur la duree de ce qui est expose en sortie a court terme."
        ),
        fig("lstmGatesCell", "Le trajet principal de la mémoire passe par l'état de cellule, modulé par trois portes apprises."),
        formula(
          `<var>c</var><sub>t</sub> <span class="op">=</span> <var>f</var><sub>t</sub> * <var>c</var><sub>t−1</sub> <span class="op">+</span> <var>i</var><sub>t</sub> * <span class="tilde">c</span><sub>t</sub>`,
          { caption: "L'état de cellule mélange l'ancienne mémoire et une nouvelle proposition d'information." }
        ),
        formula(
          `<var>h</var><sub>t</sub> <span class="op">=</span> <var>o</var><sub>t</sub> * tanh(<var>c</var><sub>t</sub>)`,
          { caption: "La sortie cachée dépend de l'état de cellule courant filtré par la porte de sortie." }
        ),
        table(
          ["Porte", "Symbole", "Rôle"],
          [
            ["Porte d'oubli", "<code>f_t</code>", "quelle part de l'ancienne mémoire garder"],
            ["Porte d'entrée", "<code>i_t</code>", "quelle part de la nouvelle information écrire"],
            ["Porte de sortie", "<code>o_t</code>", "quelle part de la mémoire exposer en sortie"]
          ]
        ),
        callout(
          "success",
          "L'intuition la plus utile",
          "Un LSTM apprend a oublier, a ecrire et a montrer. Toute la sophistication du modele tient dans cette idee de portes continues entre 0 et 1."
        )
      ),

      lesson(
        "Les équations complètes du LSTM",
        paragraphs(
          "Chaque porte du LSTM a ses propres poids et son propre biais. Cela explique pourquoi un LSTM a sensiblement plus de parametres qu'un RNN simple."
        ),
        code(
          "text",
          `
Porte d'entree :
I_t = sigma(Wxi X_t + Whi H_(t-1) + Bi)

Porte d'oubli :
F_t = sigma(Wxf X_t + Whf H_(t-1) + Bf)

Porte de sortie :
O_t = sigma(Wxo X_t + Who H_(t-1) + Bo)

Etat candidat :
C~_t = tanh(Wxc X_t + Whc H_(t-1) + Bc)

Etat de cellule :
C_t = F_t * C_(t-1) + I_t * C~_t

Sortie cachee :
H_t = O_t * tanh(C_t)
          `,
          "Formules matricielles d'un LSTM"
        ),
        paragraphs(
          "Comme il y a quatre ensembles de poids principaux (trois portes plus l'etat candidat), on retient souvent qu'un LSTM a <strong>environ quatre fois plus de parametres</strong> qu'un RNN standard de taille cachee comparable."
        ),
        callout(
          "info",
          "Variante à connaître",
          "Les slides mentionnent aussi les <strong>peephole connections</strong> : dans certaines variantes, les portes <code>i_t</code>, <code>f_t</code> et <code>o_t</code> dépendent aussi de l'état de cellule précédent <code>c_{t-1}</code>."
        ),
        code(
          "python",
          `
from tensorflow.keras import Sequential
from tensorflow.keras.layers import Embedding, LSTM, Dense

# Exemple minimal : classification de sequence
model = Sequential([
    Embedding(input_dim=10000, output_dim=64),
    LSTM(128),
    Dense(2, activation="softmax")
])
          `,
          "LSTM minimal en Keras"
        )
      ),

      lesson(
        "Encodeur-décodeur et goulot d'étranglement",
        paragraphs(
          "Les RNN et les LSTM peuvent etre utilises directement sur des problemes Seq2Seq, mais une architecture importante a consisté a séparer le travail en deux blocs : un <strong>encodeur</strong> lit la sequence source, puis un <strong>decodeur</strong> genere la sequence cible."
        ),
        code(
          "text",
          `
Sequence source  --->  RNN encodeur  --->  vecteur-contexte  --->  RNN decodeur  --->  Sequence cible
          `,
          "Schéma encodeur-décodeur"
        ),
        paragraphs(
          "Le probleme de cette version simple est le <strong>goulot d'etranglement</strong> : toute la sequence source doit etre compressee dans un seul <strong>vecteur-contexte</strong>. Sur une phrase longue, cette compression unique devient vite trop pauvre."
        ),
        fig("encoderDecoderAttention", "Au lieu d'un seul résumé figé, le décodeur peut pondérer différemment les sorties de l'encodeur selon le mot qu'il produit."),
        paragraphs(
          "L'<strong>attention</strong> corrige cela en laissant le decodeur regarder differemment les sorties de l'encodeur selon le mot qu'il est en train de produire. Les slides insistent sur l'intuition : pour traduire un mot, on n'a pas besoin de toute la phrase source avec la même intensité, mais surtout de quelques positions pertinentes."
        ),
        callout(
          "success",
          "Comment les poids d'attention sont obtenus",
          "Le mécanisme d'attention ajoute un autre réseau de neurones, non récurrent, qui apprend en même temps que l'encodeur-décodeur à attribuer plus ou moins de poids aux sorties successives de l'encodeur."
        )
      ),

      lesson(
        "Des RNN aux transformeurs",
        paragraphs(
          "Le transformeur pousse l'idée d'attention jusqu'au bout : il abandonne la recurrence explicite et mise sur des mecanismes d'attention capables de traiter toute la sequence en parallele."
        ),
        fig("transformerParallelAttention", "À gauche, traitement pas à pas. À droite, attention parallèle entre positions d'une même séquence."),
        table(
          ["Bloc", "Idée clé", "Limite ou avantage"],
          [
            ["Encodeur-décodeur simple", "un seul vecteur-contexte résume la source", "bottleneck sur les longues séquences"],
            ["Attention", "pondérer différemment les positions de la source", "meilleure gestion des dépendances utiles"],
            ["Transformeur", "attention sans récurrence explicite", "traitement parallèle et forte montée en échelle"]
          ]
        ),
        paragraphs(
          "C'est cette parallelisation qui a largement fait basculer le traitement moderne du langage loin des RNN. Les slides le disent clairement : le transformeur est conçu pour le passage à l'échelle. Plus on lui donne de données et de calcul, plus il devient redoutable."
        ),
        callout(
          "info",
          "Ce qu'il faut retenir historiquement",
          "Les RNN ont introduit la memoire sequentielle. Les LSTM ont rendu cette memoire plus stable. L'attention a ensuite desserre le goulot seq2seq, puis les transformeurs ont pris le relais en supprimant la recurrence explicite."
        )
      )
    ].join(""),

    checklist: [
      "Je peux expliquer pourquoi un RNN standard oublie vite sur une longue séquence.",
      "Je sais relier cette faiblesse au vanishing/exploding gradient dans le temps.",
      "Je peux interpréter les équations simples <code>c_t = f_t * c_{t-1} + i_t * c~_t</code> et <code>h_t = o_t * tanh(c_t)</code>.",
      "Je sais dire le rôle des portes d'oubli, d'entrée et de sortie.",
      "Je connais l'idée des peephole connections comme variante possible du LSTM.",
      "Je comprends le rôle du vecteur-contexte dans un encodeur-décodeur.",
      "Je peux expliquer qualitativement pourquoi l'attention et les transformeurs ont largement remplacé les RNN sur beaucoup de tâches."
    ],

    quiz: [
      {
        question: "La principale faiblesse du RNN standard sur de longues séquences est :",
        options: [
          "son incapacité à utiliser softmax",
          "sa mémoire courte et sa difficulté à apprendre des dépendances lointaines",
          "l'absence totale de paramètres récurrents",
          "le fait qu'il n'accepte pas d'entrée vectorielle"
        ],
        answer: 1,
        explanation: "Le RNN simple compresse tout le passe dans un seul etat cache fragile. Les dependances lointaines sont donc difficiles a conserver et a apprendre."
      },
      {
        question: "Quelle porte du LSTM décide quoi garder de l'ancien état de cellule ?",
        options: [
          "la porte d'entrée",
          "la porte de sortie",
          "la porte d'oubli",
          "la softmax"
        ],
        answer: 2,
        explanation: "La forget gate <code>f_t</code> module la part de <code>c_{t-1}</code> qui survit dans <code>c_t</code>."
      },
      {
        question: "Pourquoi dit-on qu'un LSTM a plus de paramètres qu'un RNN simple ?",
        options: [
          "Parce qu'il ajoute plusieurs portes, chacune avec ses propres poids et biais",
          "Parce qu'il supprime la couche de sortie",
          "Parce qu'il remplace les matrices par des convolutions",
          "Parce qu'il ne partage plus aucun poids dans le temps"
        ],
        answer: 0,
        explanation: "Le LSTM introduit plusieurs sous-calculs : trois portes plus un etat candidat, chacun avec ses matrices et biais."
      },
      {
        question: "Quel problème l'attention vient-elle d'abord corriger dans l'encodeur-décodeur classique ?",
        options: [
          "le manque d'images dans l'entrée",
          "le goulot d'étranglement d'un unique vecteur-contexte",
          "le fait que softmax retourne des probabilités",
          "l'absence de couche dense finale"
        ],
        answer: 1,
        explanation: "Compresser toute la sequence source dans un seul vecteur est limitant. L'attention permet au decodeur de regarder plus finement les positions utiles."
      },
      {
        question: "Pourquoi les transformeurs sont-ils particulièrement efficaces à grande échelle ?",
        options: [
          "Parce qu'ils utilisent uniquement des sigmoïdes",
          "Parce qu'ils peuvent traiter les positions d'une séquence en parallèle",
          "Parce qu'ils suppriment toute fonction de perte",
          "Parce qu'ils remplacent les poids par des constantes"
        ],
        answer: 1,
        explanation: "Contrairement aux RNN, les transformeurs n'imposent pas un traitement strictement pas a pas. Cette parallelisation accelere fortement l'entrainement."
      },
      {
        question: "Dans une variante dite peephole d'un LSTM, les portes peuvent aussi dépendre de :",
        options: [
          "la taille du vocabulaire",
          "l'état de cellule précédent <code>c_{t-1}</code>",
          "la matrice de confusion",
          "la couche softmax uniquement"
        ],
        answer: 1,
        explanation: "Les peephole connections ajoutent une dépendance explicite aux valeurs de la mémoire de cellule précédente pour calculer certaines portes."
      }
    ],

    exercises: [
      {
        title: "Interpréter les portes d'un LSTM",
        difficulty: "Intermédiaire",
        time: "15 min",
        prompt: "On te donne trois situations : (a) <code>f_t ≈ 1</code>, <code>i_t ≈ 0</code>, (b) <code>f_t ≈ 0</code>, <code>i_t ≈ 1</code>, (c) <code>o_t ≈ 0</code>. Décris qualitativement ce que fait la cellule dans chaque cas.",
        deliverables: [
          "une interpretation qualitative pour chaque cas",
          "une phrase sur la memoire conservée ou oubliee",
          "une phrase sur la sortie visible ou masquee"
        ]
      },
      {
        title: "Du RNN au transformeur",
        difficulty: "Intermédiaire",
        time: "20 min",
        prompt: "Compare en 180-220 mots trois architectures : RNN standard, LSTM et transformeur. Tu dois expliquer ce que chacune apporte par rapport a la precedente.",
        deliverables: [
          "un texte de 180 a 220 mots",
          "une mention explicite du vanishing gradient",
          "une mention explicite de l'attention et de la parallelisation"
        ]
      },
      {
        title: "Comprendre le goulot d'étranglement",
        difficulty: "Avancé",
        time: "20 min",
        prompt: "Explique pourquoi compresser toute une phrase source dans un seul vecteur-contexte peut poser problème en traduction automatique. Puis propose l'idée générale de l'attention comme remède.",
        deliverables: [
          "une explication du bottleneck",
          "une explication de l'attention sans detail technique inutile",
          "un exemple concret sur une phrase un peu longue"
        ]
      }
    ],

    keywords: [
      "lstm",
      "état de cellule",
      "porte d'oubli",
      "porte d'entrée",
      "porte de sortie",
      "attention",
      "encodeur-décodeur",
      "vecteur-contexte",
      "transformeur",
      "exploding gradient"
    ]
  }
});
})(window);
