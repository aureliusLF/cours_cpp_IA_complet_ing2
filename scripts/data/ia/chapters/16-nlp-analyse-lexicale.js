(function registerChapterBundle16(globalScope) {
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
  order: 16,
  chapter: {
    id: "nlp-analyse-lexicale",
    shortTitle: "Lexical NLP",
    title: "Analyse lexicale : tokens, POS tags, stemming et lemmatisation",
    level: "Intermédiaire",
    duration: "1 h 45",
    track: "IA4",
    summary:
      "On passe du texte brut à une suite d'unités exploitables. Le chapitre détaille la tokenisation, les catégories grammaticales, l'ambiguïté des POS tags, le rôle du lexique, puis compare stemming et lemmatisation. Les exercices du TD sont intégrés avec des regex pour mentions, hashtags et URL, puis un pipeline NLTK de nettoyage, POS tagging et lemmatisation.",
    goals: [
      "définir l'analyse lexicale comme analyse au niveau du mot",
      "expliquer le rôle de la tokenisation",
      "associer les principaux POS tags à des exemples",
      "distinguer stemming et lemmatisation",
      "écrire des expressions régulières pour mentions Twitter, hashtags et URL simplifiées",
      "construire un pipeline Python avec nettoyage, POS tagging et lemmatisation"
    ],
    highlights: [
      "tokenisation",
      "POS tagging",
      "lexique",
      "stemming",
      "lemmatisation",
      "regex",
      "NLTK"
    ],
    body: [
      lesson(
        "Analyse lexicale : le texte au niveau du mot",
        paragraphs(
          "L'<strong>analyse lexicale</strong> étudie le texte au niveau des mots et des unités élémentaires. Avant de raisonner sur une phrase, il faut déjà décider ce que sont les unités manipulables : mots, nombres, ponctuation, mentions, hashtags, URL ou symboles.",
          "Le PDF présente deux étapes centrales : découper le texte en tokens, puis associer à certains tokens une catégorie grammaticale, appelée <strong>part-of-speech tag</strong> ou POS tag."
        ),
        fig("nlpLexicalPipeline", "Tokenisation, POS tagging et lemmatisation transforment le texte brut en unités annotées."),
        callout(
          "info",
          "Lexique",
          "Une analyse lexicale sérieuse s'appuie sur un lexique : une base de mots autorisés avec des informations grammaticales et parfois sémantiques."
        )
      ),

      lesson(
        "Tokenisation",
        paragraphs(
          "La <strong>tokenisation</strong> est la première opération du pipeline. Elle découpe un document en tokens : mots, marques de ponctuation, nombres et autres unités discrètes. Cette étape paraît simple, mais elle détermine tout ce que le modèle verra ensuite."
        ),
        code(
          "text",
          `
Texte :
  Ernest Hemingway (July 21, 1899 - July 2, 1961) was an American novelist.

Tokens possibles :
  Ernest
  Hemingway
  (
  July
  21
  ,
  1899
  -
  July
  2
  ,
  1961
  )
  was
  an
  American
  novelist
          `,
          "Exemple de tokenisation"
        ),
        callout(
          "warn",
          "Attention",
          "Supprimer la ponctuation trop tôt peut être une erreur. Pour certaines tâches, elle porte du sens ; pour d'autres, elle peut être retirée avant le POS tagging ou la classification."
        )
      ),

      lesson(
        "Part-of-speech tags",
        paragraphs(
          "Le POS tagging consiste à associer une catégorie grammaticale à chaque mot. Le cours liste neuf catégories fréquentes : adjectif, adverbe, conjonction, déterminant, nom, préposition, pronom, nom propre et verbe."
        ),
        table(
          ["POS", "Rôle", "Exemples"],
          [
            ["Adjectif", "qualifie un nom", "high, nice, ugly"],
            ["Adverbe", "modifie un verbe ou adjectif", "easily, here, often"],
            ["Conjonction", "relie des éléments", "and, but, or"],
            ["Déterminant", "introduit un nom", "a, an, the"],
            ["Nom", "désigne une entité ou notion", "bike, cat, dog"],
            ["Préposition", "marque une relation", "at, in, from"],
            ["Pronom", "remplace un nom", "I, he, it"],
            ["Nom propre", "désigne une entité nommée", "Albert, France, Python"],
            ["Verbe", "exprime action ou état", "open, read, went"]
          ]
        ),
        paragraphs(
          "La difficulté est que le même mot peut avoir plusieurs rôles. Dans <em>He likes to fish</em>, <em>fish</em> fonctionne comme un verbe ; dans <em>He caught a fish</em>, il fonctionne comme un nom. Le tag le plus probable dépend donc du contexte."
        )
      ),

      lesson(
        "Stemming vs lemmatisation",
        paragraphs(
          "Le <strong>stemming</strong> coupe les affixes pour revenir à une racine approximative. Il est rapide, mais la racine obtenue n'est pas toujours un mot valide. La <strong>lemmatisation</strong> cherche plutôt la forme de dictionnaire, appelée lemme, et a souvent besoin du POS tag."
        ),
        table(
          ["Mot", "Stemming possible", "Lemme attendu", "Remarque"],
          [
            ["goes", "go", "go", "cas simple"],
            ["computers", "computer", "computer", "pluriel régulier"],
            ["commanded", "command", "command", "suffixe passé"],
            ["studies", "studi", "study", "le stem peut être invalide"],
            ["better", "better", "good", "la lemmatisation utilise le sens/POS"],
            ["meeting", "meet ou meeting", "meet ou meeting", "dépend du POS : verbe ou nom"]
          ]
        ),
        callout(
          "success",
          "À retenir",
          "Le stemming normalise vite. La lemmatisation normalise mieux, mais elle demande plus d'information linguistique."
        )
      ),

      lesson(
        "TD — expressions régulières Twitter et URL",
        paragraphs(
          "Le TD demande d'écrire des regex pour des noms d'utilisateurs Twitter, des hashtags et des URL simplifiées. L'idée pédagogique est bonne : avant un modèle complexe, on apprend à reconnaître des motifs textuels précis."
        ),
        code(
          "python",
          `
import re
from collections import Counter

# @ + 4 à 15 lettres, chiffres ou underscores.
USER_RE = re.compile(r"(?<!\\w)@[A-Za-z0-9_]{4,15}(?!\\w)")

# Version simple : hashtag avec lettres, chiffres ou underscores.
HASHTAG_SIMPLE_RE = re.compile(r"#[A-Za-z0-9_]+")

# Version plus large : on refuse les espaces et ponctuations usuelles.
HASHTAG_LARGE_RE = re.compile(r"#[^\\s\\.,;:!?()\\[\\]{}<>]+")

# URL simplifiée : schéma, domaine, chemin, requête et fragment optionnels.
URL_RE = re.compile(
    r"https?://(?:www\\.)?[A-Za-z0-9.-]+\\.[A-Za-z]{2,}"
    r"(?:/[^\\s?#]*)?"
    r"(?:\\?[^\\s#]*)?"
    r"(?:#[^\\s]*)?"
)

def extract_all(text):
    return {
        "users": USER_RE.findall(text),
        "hashtags_simple": HASHTAG_SIMPLE_RE.findall(text),
        "hashtags_large": HASHTAG_LARGE_RE.findall(text),
        "urls": URL_RE.findall(text),
    }

tweets = [
    "Merci @alice_42 pour #NLP et #IA2026 https://example.org/path?q=nlp#intro",
    "Vu avec @Bob_test : #machine-learning est partout.",
]

all_hashtags = []

for tweet in tweets:
    extracted = extract_all(tweet)
    print(extracted)
    all_hashtags.extend(extracted["hashtags_large"])

print(Counter(all_hashtags).most_common(10))
          `,
          "Regex issues du TD, version simplifiée"
        ),
        callout(
          "warn",
          "Regex et vraies URL",
          "La regex d'URL ici suit l'annexe simplifiée du TD. Les URL réelles sont plus complexes ; en production, on préfère souvent un parseur ou une bibliothèque dédiée."
        )
      ),

      lesson(
        "TD — pipeline NLTK lexical",
        paragraphs(
          "L'autre exercice demande de tokeniser et nettoyer un texte, de taguer les mots par POS, d'afficher la description des tags, puis de lemmatiser. Voici une version compacte et lisible du pipeline."
        ),
        code(
          "python",
          `
from collections import defaultdict
import nltk
from nltk import pos_tag, word_tokenize
from nltk.corpus import wordnet
from nltk.stem import WordNetLemmatizer

def wordnet_pos(treebank_tag):
    if treebank_tag.startswith("J"):
        return wordnet.ADJ
    if treebank_tag.startswith("V"):
        return wordnet.VERB
    if treebank_tag.startswith("N"):
        return wordnet.NOUN
    if treebank_tag.startswith("R"):
        return wordnet.ADV
    return wordnet.NOUN

text = "The dogs are running in the garden, and one dog likes to fish."

# Tokenisation puis nettoyage minimal.
tokens = word_tokenize(text)
clean_tokens = [token.lower() for token in tokens if token.isalpha()]

# POS tagging.
tagged = pos_tag(clean_tokens)

by_tag = defaultdict(list)
for word, tag in tagged:
    by_tag[tag].append(word)

print("Mots par tag :")
for tag, words in sorted(by_tag.items()):
    print(tag, words)

# Aide NLTK pour comprendre une famille de tags.
nltk.help.upenn_tagset("NN.*")

# Lemmatisation avec information POS.
lemmatizer = WordNetLemmatizer()
lemmas = [
    lemmatizer.lemmatize(word, pos=wordnet_pos(tag))
    for word, tag in tagged
]

print("Lemmes :", lemmas)
          `,
          "Tokenisation, POS tagging et lemmatisation"
        )
      )
    ].join(""),

    checklist: [
      "Je sais expliquer la tokenisation.",
      "Je peux citer les POS tags principaux et leur rôle.",
      "Je comprends pourquoi le contexte aide à choisir un POS tag.",
      "Je distingue stemming et lemmatisation.",
      "Je peux écrire une regex simple pour @user, #hashtag ou URL simplifiée.",
      "Je peux construire un pipeline NLTK lexical minimal."
    ],

    quiz: [
      {
        question: "La tokenisation sert à :",
        options: [
          "découper le texte en unités manipulables",
          "calculer une valeur Q optimale",
          "remplacer toutes les phrases par une image",
          "garantir que chaque mot n'a qu'un seul sens"
        ],
        answer: 0,
        explanation: "La tokenisation transforme le texte brut en tokens : mots, ponctuation, nombres ou autres unités."
      },
      {
        question: "Dans <em>He caught a fish</em>, le mot <em>fish</em> est plutôt :",
        options: [
          "un verbe",
          "un nom",
          "une préposition",
          "un déterminant"
        ],
        answer: 1,
        explanation: "Ici, <em>fish</em> désigne l'objet attrapé : c'est un nom."
      },
      {
        question: "Quelle différence est correcte ?",
        options: [
          "Le stemming coupe des affixes ; la lemmatisation cherche une forme de dictionnaire.",
          "Le stemming construit toujours un arbre syntaxique.",
          "La lemmatisation ne dépend jamais du POS.",
          "Les deux opérations sont uniquement utilisées en RL."
        ],
        answer: 0,
        explanation: "Le stemming est plus mécanique ; la lemmatisation vise un lemme valide, souvent avec l'aide du POS."
      },
      {
        question: "Une regex est particulièrement utile pour :",
        options: [
          "extraire des motifs textuels bien définis",
          "prouver qu'une grammaire naturelle n'est jamais ambiguë",
          "entraîner automatiquement un LSTM sans données",
          "remplacer toute sémantique"
        ],
        answer: 0,
        explanation: "Les regex sont adaptées aux motifs locaux : mentions, hashtags, URL simplifiées, formats."
      }
    ],

    exercises: [
      {
        title: "Regex Twitter",
        difficulty: "Facile",
        time: "15 min",
        prompt: "Écris une regex pour les noms d'utilisateurs Twitter du TD : @ suivi de 4 à 15 lettres, chiffres ou underscores. Teste-la sur trois tweets inventés.",
        deliverables: [
          "la regex",
          "trois tweets de test",
          "les mentions extraites"
        ]
      },
      {
        title: "Comparer stem et lemme",
        difficulty: "Intermédiaire",
        time: "20 min",
        prompt: "Prends dix mots anglais fléchis, puis donne pour chacun un stem possible et un lemme. Repère au moins deux cas où le stem n'est pas une forme valide.",
        deliverables: [
          "une table de dix mots",
          "stem et lemme",
          "deux remarques sur les différences"
        ]
      }
    ],

    keywords: [
      "analyse lexicale",
      "tokenisation",
      "token",
      "POS tagging",
      "part-of-speech",
      "lexique",
      "stemming",
      "lemmatisation",
      "expression régulière",
      "hashtag",
      "URL",
      "NLTK"
    ]
  }
});
})(window);
