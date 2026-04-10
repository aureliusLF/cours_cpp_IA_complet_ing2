(function registerChapterBundle8(globalScope) {
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
  order: 8,
  chapter: {
    id: "rnn-sequences-apprentissage",
    shortTitle: "Séquences",
    title: "Traiter des séquences et apprendre dans le temps",
    level: "Intermédiaire",
    duration: "1 h 25",
    track: "IA2",
    summary:
      "Une fois le RNN defini, il faut comprendre a quelles taches il sert vraiment. Ce chapitre parcourt les grandes familles de problemes sequentiels, l'exemple cle de la prediction du mot suivant, puis l'apprentissage lui-meme avec une perte qui se somme dans le temps et une retropropagation adaptee : BPTT.",
    goals: [
      "reconnaître les grandes familles de tâches séquentielles traitées par les RNN",
      "distinguer many-to-many, many-to-one et one-to-many",
      "expliquer le principe de la modélisation du langage par prédiction du mot suivant",
      "écrire la perte totale d'un RNN comme une somme sur les pas de temps",
      "décrire la rétropropagation à travers le temps comme une rétropropagation sur le réseau déroulé"
    ],
    highlights: [
      "many-to-many",
      "many-to-one",
      "seq2seq",
      "softmax",
      "BPTT",
      "word embedding"
    ],
    body: [
      lesson(
        "Pourquoi les séquences changent le problème",
        paragraphs(
          "Une sequence n'est pas un simple sac de donnees. Elle a un <strong>ordre</strong>, et souvent cet ordre porte le sens. Dans une phrase, inverser deux mots peut changer completement l'interpretation. Dans une serie temporelle, l'ordre des jours est essentiel. Le RNN est justement construit pour traiter ces dependances ordonnees."
        ),
        bullets([
          "séries temporelles : prix, capteurs, signaux physiologiques",
          "documents : suites de mots ou de caractères",
          "audio : suite d'échantillons ou de trames acoustiques",
          "vidéo : suite ordonnée d'images"
        ]),
        paragraphs(
          "L'etat cache joue ici le role de memoire compressée de tout ce qui a deja ete vu. Au temps <code>t</code>, le reseau ne traite donc pas seulement <code>X_t</code> : il traite <code>X_t</code> a la lumiere de ce qu'il a retenu de <code>X_1 ... X_{t-1}</code>."
        )
      ),

      lesson(
        "Many-to-many, many-to-one, one-to-many",
        paragraphs(
          "Tous les problemes sequentiels n'ont pas la meme forme. On distingue souvent trois grands cas selon la relation entre la sequence d'entree et celle de sortie."
        ),
        fig("seq2seqTypes", "Trois schémas à connaître : séquence vers séquence, séquence vers classe, ou entrée unique vers séquence."),
        table(
          ["Type", "Entrée", "Sortie", "Exemple"],
          [
            ["Many-to-many", "séquence", "séquence", "traduction automatique"],
            ["Many-to-one", "séquence", "une seule valeur", "analyse de sentiments"],
            ["One-to-many", "une seule entrée", "séquence", "image captioning"]
          ]
        ),
        callout(
          "info",
          "Seq2Seq ne veut pas dire tailles égales",
          "Dans un probleme sequence a sequence, la longueur de sortie n'est pas obligee d'etre la meme que celle de l'entree. Une phrase francaise et sa traduction anglaise peuvent avoir des longueurs differentes."
        )
      ),

      lesson(
        "Exemple central : prédire le mot suivant",
        paragraphs(
          "La modelisation du langage consiste a predire le mot suivant a partir des mots deja vus. C'est un exemple tres formateur, car il montre comment un RNN combine une memoire cachee avec une <strong>sortie softmax</strong> sur un grand vocabulaire."
        ),
        paragraphs(
          "Dans les slides, l'exemple type prend un vocabulaire de taille <code>|A| = 10000</code>, une représentation d'entrée de dimension <code>n = 50</code>, une couche cachée de taille <code>500</code>, puis une sortie de taille <code>|A|</code>. Chaque mot de l'entree peut etre represente soit par un <strong>one-hot</strong>, soit par un <strong>embedding</strong>. Le one-hot est grand et creux, l'embedding est dense et compact. Dans la pratique moderne, on prefere presque toujours l'embedding."
        ),
        fig("tokenEncodingCompare", "One-hot : un seul 1 dans un grand vecteur. Embedding : peu de dimensions, mais des valeurs denses apprises."),
        table(
          ["Objet", "Valeur d'exemple", "Rôle"],
          [
            ["Taille du vocabulaire", "<code>10000</code>", "nombre de mots candidats en sortie"],
            ["Dimension d'entrée", "<code>50</code>", "taille du vecteur représentant un mot"],
            ["Taille cachée", "<code>500</code>", "capacité de mémoire du RNN"],
            ["Activation cachée", "<code>sigmoïde</code> ou <code>tanh</code>", "non-linéarité de la couche récurrente"],
            ["Activation de sortie", "<code>softmax</code>", "distribution de probabilité sur le vocabulaire"]
          ]
        ),
        formula(
          `<var>Y</var><sup>t</sup>[<var>k</var>] <span class="op">=</span> <span class="fraction"><span class="num">exp((<var>W</var><var>H</var><sub>t</sub> <span class="op">+</span> <var>B</var><sup>o</sup>)[<var>k</var>])</span><span class="den"><span class="sum">∑</span><span class="sum-limits"><span class="top">|<var>V</var>|</span><span class="bot"><var>i</var>=1</span></span> exp((<var>W</var><var>H</var><sub>t</sub> <span class="op">+</span> <var>B</var><sup>o</sup>)[<var>i</var>])</span></span>`,
          { caption: "Softmax : le RNN transforme son état caché en une distribution de probabilité sur le vocabulaire." }
        ),
        fig("languageModelSoftmax", "L'état caché devient une distribution sur tous les mots du vocabulaire ; le plus probable est choisi."),
        code(
          "python",
          `
import torch
from torch import nn

# 32 sequences, 20 mots par sequence, 50 features par mot
x = torch.randn(32, 20, 50)

# RNN simple
rnn = nn.RNN(input_size=50, hidden_size=128, batch_first=True)
hidden_seq, _ = rnn(x)

# On utilise le dernier etat cache pour predire le mot suivant
head = nn.Linear(128, 10000)
logits = head(hidden_seq[:, -1, :])

print(logits.shape)  # (32, 10000)
          `,
          "Prédire un mot suivant : formes minimales"
        ),
        callout(
          "success",
          "Ce que signifie la softmax",
          "Apres softmax, chaque composante de la sortie correspond a la probabilite attribuee a un mot du vocabulaire. Le mot predit est celui qui recoit la probabilite la plus forte."
        )
      ),

      lesson(
        "La perte totale se somme dans le temps",
        paragraphs(
          "Un RNN produit une suite de sorties. L'erreur totale se decompose donc naturellement en une somme d'erreurs locales, une par pas de temps. Cette ecriture est simple, mais elle est essentielle pour comprendre BPTT."
        ),
        formula(
          `<var>E</var>(<var>P</var>) <span class="op">=</span> <span class="sum">∑</span><span class="sum-limits"><span class="top"><var>T</var></span><span class="bot"><var>t</var>=1</span></span> <var>E</var><sup>t</sup>(<var>P</var>)`,
          { caption: "La perte totale est la somme des pertes calculées à chaque pas de temps." }
        ),
        formula(
          `<var>E</var><sup>t</sup>(<var>P</var>) <span class="op">=</span> <span class="fn">loss</span>(Ŷ<sup>t</sup>, <var>Y</var><sup>t</sup>)`,
          { caption: "À chaque pas, on compare la sortie prédite à la cible locale." }
        ),
        paragraphs(
          "Dans les slides, plusieurs fonctions de perte sont rappelées selon la tâche : erreur quadratique pour certains problèmes de régression, entropie croisée binaire pour la classification binaire, entropie croisée catégorielle pour la classification multi-classes."
        ),
        bullets([
          "<strong>∂E / ∂u_ij</strong> : gradient des poids entrée -> caché",
          "<strong>∂E / ∂v_j'j</strong> : gradient des poids récurrents caché -> caché",
          "<strong>∂E / ∂b_j^h</strong> : gradient des biais cachés",
          "<strong>∂E / ∂w_jk</strong> : gradient des poids caché -> sortie",
          "<strong>∂E / ∂b_k^o</strong> : gradient des biais de sortie"
        ]),
        bullets([
          "<strong>gradients sur U</strong> : influence de l'entrée courante sur la couche cachée",
          "<strong>gradients sur V</strong> : influence de la mémoire passée sur la mémoire courante",
          "<strong>gradients sur W</strong> : influence de l'état caché sur la sortie",
          "<strong>gradients sur les biais</strong> : ajustement des décalages cachés et de sortie"
        ])
      ),

      lesson(
        "BPTT : la rétropropagation à travers le temps",
        paragraphs(
          "Le principe de BPTT est presque decevant de simplicite une fois qu'on a vu le reseau deroule : on applique une retropropagation classique au reseau deroule, mais on remonte a la fois dans les couches et dans le temps."
        ),
        fig("bpttFlow", "On additionne les pertes, puis on propage les gradients du dernier pas vers les premiers sur les mêmes poids partagés."),
        code(
          "text",
          `
1. On deroule le RNN sur toute la sequence.
2. On calcule la perte a chaque pas de temps.
3. On additionne ces pertes.
4. On retropropage du dernier pas vers le premier.
5. On accumule les gradients sur les memes poids U, V, W.
          `,
          "BPTT en cinq étapes"
        ),
        paragraphs(
          "Le detail important est l'<strong>accumulation</strong>. Comme les memes poids sont reutilises a chaque pas, le gradient total sur <code>U</code>, <code>V</code> ou <code>W</code> est la somme des contributions de tous les pas de temps."
        ),
        callout(
          "warn",
          "Pourquoi BPTT peut devenir difficile",
          "Plus la sequence est longue, plus le reseau deroule devient profond dans le temps. C'est exactement ce qui fera apparaitre les problemes de vanishing et d'exploding gradient dans le chapitre suivant."
        )
      )
    ].join(""),

    checklist: [
      "Je peux distinguer many-to-many, many-to-one et one-to-many avec un exemple concret.",
      "Je comprends comment un RNN peut servir à prédire le mot suivant.",
      "Je peux expliquer la différence entre one-hot et embedding.",
      "Je sais écrire la perte totale d'un RNN comme une somme des pertes locales dans le temps.",
      "Je sais citer les dérivées partielles qu'on cherche pendant l'apprentissage d'un RNN.",
      "Je peux décrire BPTT comme une rétropropagation appliquée au réseau déroulé avec accumulation des gradients."
    ],

    quiz: [
      {
        question: "La traduction automatique est en général un problème de type :",
        options: [
          "many-to-one",
          "one-to-many",
          "many-to-many",
          "one-to-one"
        ],
        answer: 2,
        explanation: "Une sequence source complete est transformee en une sequence cible complete. C'est le cas typique many-to-many."
      },
      {
        question: "Dans une tâche d'analyse de sentiments sur un texte, quel schéma est le plus naturel ?",
        options: [
          "many-to-one",
          "one-to-many",
          "many-to-many",
          "aucun, les RNN ne conviennent pas"
        ],
        answer: 0,
        explanation: "On lit toute une sequence de mots puis on produit une seule sortie, par exemple positif ou negatif."
      },
      {
        question: "Pourquoi préfère-t-on souvent un embedding à un encodage one-hot ?",
        options: [
          "Parce que le one-hot ne fonctionne pas avec les RNN",
          "Parce que l'embedding est dense et compact, alors que le one-hot est très grand et creux",
          "Parce que l'embedding remplace la fonction de perte",
          "Parce que le one-hot interdit l'usage de softmax"
        ],
        answer: 1,
        explanation: "Le one-hot devient vite gigantesque sur de grands vocabulaires. Les embeddings offrent une representation plus compacte et plus riche."
      },
      {
        question: "La perte totale d'un RNN sur une séquence s'écrit le plus naturellement comme :",
        options: [
          "le produit des pertes locales",
          "la somme des pertes à chaque pas de temps",
          "la moyenne des poids du réseau",
          "la perte du dernier pas uniquement, toujours"
        ],
        answer: 1,
        explanation: "On ecrit classiquement la perte totale comme la somme des pertes locales calculees a chaque temps t."
      },
      {
        question: "BPTT consiste essentiellement à :",
        options: [
          "changer la fonction d'activation d'un RNN",
          "appliquer la rétropropagation au réseau déroulé dans le temps",
          "remplacer U, V, W par des filtres convolutifs",
          "désactiver les biais pendant l'apprentissage"
        ],
        answer: 1,
        explanation: "Le reseau est deroule, puis on remonte le gradient du dernier pas de temps vers les premiers en accumulant les contributions sur les poids partages."
      },
      {
        question: "Dans l'exemple classique de prédiction du mot suivant, quel est le rôle de la couche softmax finale ?",
        options: [
          "fabriquer l'état caché H_t",
          "compresser le vocabulaire dans 50 dimensions",
          "produire une distribution de probabilité sur tous les mots du vocabulaire",
          "supprimer le besoin d'une fonction de perte"
        ],
        answer: 2,
        explanation: "Le vecteur de sortie du RNN est converti en probabilités de mot suivant possibles. Le mot retenu est celui qui obtient la plus grande probabilité."
      }
    ],

    exercises: [
      {
        title: "Identifier le bon type de tâche",
        difficulty: "Facile",
        time: "10 min",
        prompt: "Classe chacun des problèmes suivants dans many-to-many, many-to-one ou one-to-many : traduction automatique, analyse de sentiments, génération de légende d'image, transcription audio mot à mot.",
        deliverables: [
          "la categorie de chaque probleme",
          "une justification courte pour chacun"
        ]
      },
      {
        title: "Lire une softmax de vocabulaire",
        difficulty: "Intermédiaire",
        time: "15 min",
        prompt: "On te donne la sortie softmax d'un RNN sur un vocabulaire de 5 mots : [0.05, 0.10, 0.60, 0.15, 0.10]. Quel mot est prédit ? Que signifient concrètement ces cinq valeurs ?",
        deliverables: [
          "le mot predit",
          "une interpretation probabiliste des 5 composantes",
          "une phrase sur le role de softmax"
        ]
      },
      {
        title: "Raconter BPTT simplement",
        difficulty: "Intermédiaire",
        time: "15 min",
        prompt: "Explique en 150-200 mots comment fonctionne BPTT sur une séquence de longueur 4. Tu dois mentionner le déroulage, la somme des pertes, la remontée temporelle et l'accumulation des gradients.",
        deliverables: [
          "un texte de 150 a 200 mots",
          "les 4 notions demandees",
          "une phrase finale sur la difficulte quand T grandit"
        ]
      }
    ],

    keywords: [
      "séquence",
      "seq2seq",
      "many-to-many",
      "many-to-one",
      "one-to-many",
      "softmax",
      "embedding",
      "one-hot",
      "bptt",
      "modélisation du langage"
    ]
  }
});
})(window);
