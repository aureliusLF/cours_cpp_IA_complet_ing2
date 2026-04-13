(function registerChapterBundle17(globalScope) {
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

function fig(key, caption) {
  const body = figures[key];
  if (!body) {
    return "";
  }
  return figure(body, { caption });
}

registry.registerChapterBundle({
  order: 17,
  chapter: {
    id: "nlp-analyse-syntaxique",
    shortTitle: "Syntaxe NLP",
    title: "Analyse syntaxique : grammaires, CFG et arbres de parsing",
    level: "Intermédiaire",
    duration: "1 h 50",
    track: "IA4",
    summary:
      "On formalise la structure des phrases avec des grammaires. Le chapitre rappelle qu'une phrase n'est pas une simple liste de mots, définit terminaux, non-terminaux, symbole de départ et règles de production, puis explique les grammaires hors contexte et le parsing. Le TD est repris avec une grammaire française, ses symboles, ses arbres et une version NLTK exécutable.",
    goals: [
      "expliquer pourquoi la syntaxe analyse la structure des phrases",
      "définir une grammaire par terminaux, non-terminaux, symbole de départ et règles",
      "reconnaître une grammaire hors contexte",
      "identifier terminaux et non-terminaux dans la grammaire du TD",
      "décrire un parse tree et une représentation parenthésée",
      "écrire un petit parser NLTK pour vérifier des phrases"
    ],
    highlights: [
      "syntaxe",
      "grammaire",
      "CFG",
      "terminaux",
      "non-terminaux",
      "parser",
      "arbre d'analyse"
    ],
    body: [
      lesson(
        "Pourquoi analyser la syntaxe ?",
        paragraphs(
          "La phrase est l'unité de base du sens dans le texte. Pour extraire ce sens, on ne peut pas toujours traiter une phrase comme une simple suite linéaire de mots. Les mots se regroupent en syntagmes, et ces syntagmes suivent des règles de structure.",
          "L'<strong>analyse syntaxique</strong> cherche donc à déterminer comment les mots d'une phrase se combinent : groupe nominal, groupe verbal, préposition, conjonction, dépendances et emboîtements."
        ),
        fig("nlpCfgParseTree", "Une grammaire fournit des règles ; un parser les applique pour produire un arbre d'analyse."),
        callout(
          "info",
          "Image mentale",
          "La tokenisation dit quels morceaux existent. La syntaxe dit comment ces morceaux s'accrochent pour former une phrase."
        )
      ),

      lesson(
        "Définir une grammaire",
        paragraphs(
          "Le cours définit une grammaire formelle avec quatre composants. Cette notation est le socle du TD sur les grammaires hors contexte."
        ),
        table(
          ["Composant", "Notation", "Rôle"],
          [
            ["Terminaux", "<code>Σ</code>", "symboles qui apparaissent réellement dans les phrases : mots, ponctuation"],
            ["Non-terminaux", "<code>N</code>", "catégories abstraites : <code>S</code>, <code>NP</code>, <code>VP</code>"],
            ["Symbole de départ", "<code>S</code>", "non-terminal qui représente la phrase complète"],
            ["Règles de production", "<code>LHS → RHS</code>", "règles de réécriture qui développent les non-terminaux"]
          ]
        ),
        code(
          "text",
          `
Exemple minimal :

S  -> NP VP
NP -> Det N
VP -> V NP
Det -> the | a
N -> dog | cat
V -> sees | likes
          `,
          "Une grammaire jouet"
        )
      ),

      lesson(
        "Grammaires hors contexte",
        paragraphs(
          "Après Chomsky, on distingue plusieurs classes de grammaires. Dans le cours, le point important est que les grammaires du langage naturel demandent au moins souvent la puissance des grammaires hors contexte, ou <strong>context-free grammars</strong>."
        ),
        callout(
          "success",
          "Critère CFG",
          "Une règle est hors contexte si son côté gauche contient un seul symbole non-terminal. Exemple : <code>NP → Det N</code>. Le développement de <code>NP</code> ne dépend pas explicitement de ce qui l'entoure."
        ),
        table(
          ["Règle", "CFG ?", "Pourquoi"],
          [
            ["<code>S → NP VP</code>", "oui", "côté gauche = un seul non-terminal"],
            ["<code>VP → V PP</code>", "oui", "côté gauche = un seul non-terminal"],
            ["<code>NP Conj NP → NP</code>", "non", "côté gauche = plusieurs symboles"],
            ["<code>a N → b</code>", "non", "côté gauche contient un terminal et un non-terminal"]
          ]
        )
      ),

      lesson(
        "Grammaire du TD : symboles et règles",
        paragraphs(
          "Le TD donne une petite grammaire française avec des règles conditionnelles, des alternatives, des groupes nominaux, des groupes verbaux et des groupes prépositionnels. Les règles sont bien de type CFG car chaque côté gauche est un seul non-terminal."
        ),
        code(
          "text",
          `
S  -> si S alors S
S  -> soit S soit S
S  -> NP VP

NP -> Det N
NP -> PN
NP -> NP Conj NP

Det -> un | une | le | la
VP  -> V NP
VP  -> V PP
PP  -> Prep NP

N    -> garçon | fille | chien | chat | nourriture | restaurant | maison | glace | cantine
V    -> mange | aime | monte | va
PN   -> il | elle
Prep -> à | au
Conj -> et | ou
          `,
          "Grammaire du TD, forme lisible"
        ),
        table(
          ["Non-terminaux", "Terminaux"],
          [
            ["<code>S, NP, VP, PP, Det, N, V, PN, Prep, Conj</code>", "<code>si, alors, soit, un, une, le, la, garçon, fille, chien, chat, nourriture, restaurant, maison, glace, cantine, mange, aime, monte, va, il, elle, à, au, et, ou</code>"]
          ]
        ),
        callout(
          "warn",
          "Petit piège du TD",
          "Les phrases proposées contiennent <em>a faim</em>. Si on garde exactement la liste de verbes et noms ci-dessus, <em>a</em> et <em>faim</em> ne sont pas reconnus. Pour parser ces phrases telles quelles, il faut compléter la grammaire."
        )
      ),

      lesson(
        "Parsing et arbre d'analyse",
        paragraphs(
          "Un <strong>parser</strong> applique la grammaire à une phrase pour vérifier si elle est bien formée et produire une analyse. Une façon classique de représenter le résultat est l'arbre syntaxique : la racine est la phrase, les nœuds internes sont les catégories, les feuilles sont les mots."
        ),
        code(
          "text",
          `
Phrase :
  the dog swam and Mary slept or talked to John

Représentation parenthésée simplifiée :

(S
  (S
    (NP (Det the) (N dog))
    (VP (V swam)))
  (Conj and)
  (S
    (NP (PN Mary))
    (VP
      (VP (V slept))
      (Conj or)
      (VP (V talked) (Prep to) (NP (PN John))))))
          `,
          "Arbre sous forme parenthésée"
        ),
        paragraphs(
          "Cette représentation est compacte et très utilisée : chaque paire de parenthèses indique un sous-arbre."
        )
      ),

      lesson(
        "TD — parser la grammaire avec NLTK",
        paragraphs(
          "Voici une version exécutable qui reprend la grammaire du TD et l'enrichit juste assez pour reconnaître les phrases avec <em>a faim</em> et <em>au restaurant</em>. Les accents sont retirés pour éviter les soucis d'encodage dans les tokens."
        ),
        code(
          "python",
          `
import nltk

grammar = nltk.CFG.fromstring("""
S -> 'si' S 'alors' S
S -> 'soit' S 'soit' S
S -> NP VP

NP -> Det N
NP -> PN
NP -> N
NP -> NP Conj NP

VP -> V NP
VP -> V PP
VP -> V N

PP -> Prep NP

Det -> 'un' | 'une' | 'le' | 'la'
N -> 'garcon' | 'fille' | 'chien' | 'chat' | 'nourriture'
N -> 'restaurant' | 'maison' | 'glace' | 'cantine' | 'faim'
V -> 'mange' | 'aime' | 'monte' | 'va' | 'a'
PN -> 'il' | 'elle'
Prep -> 'a' | 'au'
Conj -> 'et' | 'ou'
""")

parser = nltk.ChartParser(grammar)

sentences = [
    "si la fille a faim alors elle va au restaurant",
    "soit il mange a la maison soit il va au restaurant",
    "si le chat a faim alors soit il mange a la maison soit il va au restaurant",
]

for sentence in sentences:
    print("\\nPhrase :", sentence)
    tokens = sentence.split()
    trees = list(parser.parse(tokens))
    print("Nombre d'analyses :", len(trees))

    for tree in trees[:2]:
        print(tree)
          `,
          "Parser CFG pour le TD"
        ),
        callout(
          "info",
          "Lire la sortie",
          "S'il y a plusieurs arbres, la phrase est syntaxiquement ambiguë pour cette grammaire. C'est une passerelle directe vers le chapitre suivant sur l'ambiguïté."
        )
      )
    ].join(""),

    checklist: [
      "Je peux définir terminaux, non-terminaux, symbole de départ et règles de production.",
      "Je sais reconnaître une règle de grammaire hors contexte.",
      "Je peux lister les symboles de la grammaire du TD.",
      "Je comprends ce qu'un parser produit.",
      "Je sais lire une représentation parenthésée d'un arbre.",
      "Je repère qu'une grammaire doit parfois être enrichie pour reconnaître une phrase donnée."
    ],

    quiz: [
      {
        question: "Dans une grammaire, les terminaux sont :",
        options: [
          "les symboles qui apparaissent dans les phrases",
          "uniquement les couches de sortie d'un réseau",
          "les hyperparamètres du parser",
          "les récompenses terminales en RL"
        ],
        answer: 0,
        explanation: "Les terminaux sont les mots ou symboles réellement présents dans les phrases reconnues."
      },
      {
        question: "Une règle CFG a un côté gauche composé :",
        options: [
          "d'un seul non-terminal",
          "d'au moins trois terminaux",
          "d'une phrase complète en français",
          "d'une matrice de transition"
        ],
        answer: 0,
        explanation: "Dans une grammaire hors contexte, chaque règle réécrit un seul non-terminal."
      },
      {
        question: "Un parse tree représente :",
        options: [
          "la structure syntaxique d'une phrase",
          "la courbe de loss d'un modèle",
          "les poids d'un ConvNet",
          "la table Q d'un agent"
        ],
        answer: 0,
        explanation: "L'arbre d'analyse montre comment la phrase est dérivée depuis le symbole de départ."
      },
      {
        question: "Si une grammaire produit plusieurs arbres pour la même phrase, cela signale souvent :",
        options: [
          "une ambiguïté syntaxique",
          "une erreur de tokenisation impossible à corriger",
          "une absence totale de terminaux",
          "un apprentissage supervisé parfait"
        ],
        answer: 0,
        explanation: "Plusieurs arbres signifient que plusieurs structures syntaxiques sont compatibles avec la phrase."
      }
    ],

    exercises: [
      {
        title: "Prouver que la grammaire est CFG",
        difficulty: "Facile",
        time: "12 min",
        prompt: "Reprends les règles du TD et explique pourquoi chacune a un seul non-terminal à gauche.",
        deliverables: [
          "la liste des côtés gauches",
          "une phrase de justification",
          "un contre-exemple de règle qui ne serait pas CFG"
        ]
      },
      {
        title: "Arbre d'une phrase du TD",
        difficulty: "Intermédiaire",
        time: "25 min",
        prompt: "Choisis une des phrases du TD. Construis son arbre parenthésé avec la grammaire complétée, puis indique où apparaissent S, NP, VP et PP.",
        deliverables: [
          "la phrase choisie",
          "l'arbre parenthésé",
          "un repérage des principaux non-terminaux"
        ]
      }
    ],

    keywords: [
      "analyse syntaxique",
      "grammaire",
      "CFG",
      "hors contexte",
      "terminal",
      "non-terminal",
      "symbole de départ",
      "règle de production",
      "parser",
      "parse tree",
      "arbre syntaxique"
    ]
  }
});
})(window);
