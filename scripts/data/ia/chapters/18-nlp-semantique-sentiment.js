(function registerChapterBundle18(globalScope) {
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
  order: 18,
  chapter: {
    id: "nlp-semantique-sentiment",
    shortTitle: "Sémantique NLP",
    title: "Analyse sémantique : sens, ambiguïtés, WordNet et sentiments",
    level: "Intermédiaire",
    duration: "2 h",
    track: "IA4",
    summary:
      "On termine le bloc NLP par le sens. Le chapitre distingue sémantique lexicale et supralexicale, présente les ambiguïtés lexicales, syntaxiques et référentielles, puis les relations de sens comme synonymie, antonymie, hyponymie et méronymie. On relie ensuite WordNet, la sémantique compositionnelle et le TD d'analyse de sentiments avec un classifieur bayésien.",
    goals: [
      "définir l'analyse sémantique comme étude du sens",
      "distinguer sémantique lexicale et supralexicale",
      "identifier ambiguïtés lexicales, syntaxiques et référentielles",
      "décrire les relations lexicales : synonymie, antonymie, homonymie, polysémie, hyponymie, méronymie",
      "expliquer le rôle de WordNet et des synsets",
      "comprendre le principe de la sémantique compositionnelle",
      "construire un classifieur bayésien simple pour l'analyse de sentiments"
    ],
    highlights: [
      "sémantique",
      "ambiguïté",
      "WordNet",
      "synset",
      "compositionnalité",
      "analyse de sentiments",
      "Naive Bayes"
    ],
    body: [
      lesson(
        "Comprendre le sens",
        paragraphs(
          "L'<strong>analyse sémantique</strong> s'intéresse au sens des mots, expressions, phrases et documents. Tous les niveaux précédents y contribuent : la tokenisation identifie les unités, la syntaxe organise les relations, puis la sémantique cherche ce que l'ensemble signifie.",
          "Le cours distingue deux niveaux : la <strong>sémantique lexicale</strong>, qui étudie les unités individuelles, et la <strong>sémantique supralexicale</strong>, qui étudie le sens produit par les combinaisons de mots."
        ),
        fig("nlpAmbiguityMap", "L'ambiguïté montre pourquoi le sens ne se lit pas toujours directement mot par mot."),
        table(
          ["Niveau", "Objet", "Question"],
          [
            ["Lexical", "mot, affixe, expression figée", "que signifie cette unité et quelles relations a-t-elle ?"],
            ["Supralexical", "groupe, phrase, document", "quel sens émerge de la combinaison des unités ?"]
          ]
        )
      ),

      lesson(
        "Ambiguïtés du langage naturel",
        paragraphs(
          "Les phrases naturelles sont souvent ambiguës : elles acceptent plusieurs interprétations. Un système NLP doit donc choisir ou représenter plusieurs lectures possibles."
        ),
        table(
          ["Type", "Définition", "Exemple"],
          [
            ["Lexicale", "un mot a plusieurs sens", "<em>The priest married my sister</em>"],
            ["Syntaxique", "une phrase admet plusieurs structures", "<em>Police help dog bite victim</em>"],
            ["Référentielle", "un pronom ou groupe peut viser plusieurs entités", "<em>He told the news to his father. He was happy.</em>"]
          ]
        ),
        paragraphs(
          "Le PDF donne aussi l'exemple français du <em>Prix Goncourt</em> : selon le contexte, l'expression peut désigner un prix, une somme, une personne, un jury, un livre ou un événement. C'est un bon rappel : le sens dépend souvent de l'usage."
        ),
        callout(
          "warn",
          "À l'oral",
          "Quand on te demande un type d'ambiguïté, ne réponds pas seulement avec l'exemple : explique ce qui varie entre les interprétations, le sens du mot, l'arbre syntaxique ou le référent."
        )
      ),

      lesson(
        "TD — Time flies like an arrow",
        paragraphs(
          "Le TD demande d'analyser la phrase <em>Time flies like an arrow</em>, connue pour ses lectures multiples. Le point important n'est pas de mémoriser quatre traductions, mais de voir que les catégories grammaticales possibles changent l'arbre."
        ),
        table(
          ["Mot", "Lecture 1", "Autres lectures possibles"],
          [
            ["time", "nom : le temps", "verbe impératif : chronomètre"],
            ["flies", "verbe : passe / vole", "nom pluriel : mouches"],
            ["like", "préposition : comme", "verbe : aiment"],
            ["an arrow", "groupe nominal de comparaison", "objet du verbe <em>like</em>"]
          ]
        ),
        bullets([
          "lecture courante : le temps file comme une flèche",
          "lecture impérative : chronomètre des mouches comme on chronométrerait une flèche",
          "lecture nominale : des mouches liées au temps aiment une flèche",
          "d'autres arbres apparaissent selon la manière de rattacher <em>like an arrow</em>"
        ]),
        callout(
          "info",
          "Ce que tu dois produire",
          "Pour le TD, annote d'abord les POS possibles, puis dessine un arbre par lecture. Cela évite de mélanger ambiguïté lexicale et ambiguïté syntaxique."
        )
      ),

      lesson(
        "Relations lexicales et WordNet",
        paragraphs(
          "La sémantique lexicale étudie aussi les relations entre unités. Certaines relations sont horizontales, entre mots de même niveau ; d'autres sont verticales, entre concepts plus généraux et plus spécifiques, ou entre tout et partie."
        ),
        table(
          ["Relation", "Idée", "Exemple"],
          [
            ["Synonymie", "sens identique ou proche", "small / little"],
            ["Antonymie", "opposition", "big / small"],
            ["Conversité", "relation inverse", "teach / learn, give / take"],
            ["Homonymie", "même forme, mots différents", "light clair / light léger"],
            ["Polysémie", "même mot, plusieurs sens liés", "satellite objet spatial / État dépendant"],
            ["Hyponymie / hyperonymie", "spécifique / général", "rose / flower, orange / fruit"],
            ["Méronymie", "partie / tout", "wheel / car, nose / face"]
          ]
        ),
        paragraphs(
          "<strong>WordNet</strong> est une base lexicale électronique pour l'anglais. Elle regroupe noms, verbes, adjectifs et adverbes en ensembles de synonymes cognitifs, appelés <strong>synsets</strong>, et stocke des relations entre ces synsets."
        ),
        code(
          "python",
          `
from nltk.corpus import wordnet as wn

synsets = wn.synsets("dog", pos=wn.NOUN)

for synset in synsets[:3]:
    print("Synset :", synset.name())
    print("Définition :", synset.definition())
    print("Lemmes :", synset.lemma_names())
    print("Hyperonymes :", [h.name() for h in synset.hypernyms()])
    print()
          `,
          "Explorer WordNet avec NLTK"
        )
      ),

      lesson(
        "Sémantique compositionnelle",
        paragraphs(
          "La sémantique compositionnelle part d'un principe simple : le sens d'une combinaison de mots dépend du sens des parties et de la façon dont elles sont combinées. Une approche logique représente alors le sens avec variables, constantes, prédicats, connecteurs et quantificateurs."
        ),
        formula(
          `<span class="text">Some teachers are sick</span> <span class="op">→</span> ∃<var>x</var> (teacher(<var>x</var>) ∧ sick(<var>x</var>))`,
          { caption: "Une phrase existentielle en logique du premier ordre." }
        ),
        formula(
          `<span class="text">All French students learn English</span> <span class="op">→</span> ∀<var>x</var> ((french(<var>x</var>) ∧ student(<var>x</var>)) ⇒ learn(<var>x</var>, english))`,
          { caption: "Une phrase universelle avec implication." }
        ),
        paragraphs(
          "Cette approche permet aussi de raisonner avec des règles d'inférence. Par exemple, si <em>Pierre est malade</em> et <em>quand Pierre est malade, il reste à la maison</em>, alors on peut conclure <em>Pierre reste à la maison</em> : c'est l'idée du modus ponens."
        )
      ),

      lesson(
        "TD — classifieur bayésien de sentiments",
        paragraphs(
          "Le dernier exercice du TD demande de construire un classifieur bayésien capable de classer des tweets en <strong>positif</strong> ou <strong>négatif</strong>. La pipeline est : récupérer les tweets NLTK, tokeniser, nettoyer, transformer en features, entraîner puis tester."
        ),
        fig("nlpSentimentPipeline", "Analyse de sentiments : tweets, nettoyage, features, puis classifieur bayésien."),
        code(
          "python",
          `
import random
import string
import nltk
from nltk import NaiveBayesClassifier, classify
from nltk.corpus import stopwords, twitter_samples, wordnet
from nltk.stem import WordNetLemmatizer
from nltk.tag import pos_tag
from nltk.tokenize import TweetTokenizer

tokenizer = TweetTokenizer(preserve_case=False, strip_handles=True, reduce_len=True)
lemmatizer = WordNetLemmatizer()
stop_words = set(stopwords.words("english"))
punctuation = set(string.punctuation)

def wordnet_pos(tag):
    if tag.startswith("J"):
        return wordnet.ADJ
    if tag.startswith("V"):
        return wordnet.VERB
    if tag.startswith("N"):
        return wordnet.NOUN
    if tag.startswith("R"):
        return wordnet.ADV
    return wordnet.NOUN

def clean_tweet(tweet):
    tokens = tokenizer.tokenize(tweet)
    tagged = pos_tag(tokens)
    cleaned = []

    for token, tag in tagged:
        if token.startswith("http"):
            continue
        if token in punctuation or token in stop_words:
            continue
        if not any(char.isalpha() for char in token):
            continue

        lemma = lemmatizer.lemmatize(token, pos=wordnet_pos(tag))
        cleaned.append(lemma)

    return cleaned

def features(tokens):
    return {f"contains({token})": True for token in tokens}

positive = twitter_samples.strings("positive_tweets.json")
negative = twitter_samples.strings("negative_tweets.json")

dataset = [
    (features(clean_tweet(tweet)), "Positive")
    for tweet in positive
] + [
    (features(clean_tweet(tweet)), "Negative")
    for tweet in negative
]

random.shuffle(dataset)

split = int(0.8 * len(dataset))
train_set = dataset[:split]
test_set = dataset[split:]

classifier = NaiveBayesClassifier.train(train_set)

print("Accuracy :", classify.accuracy(classifier, test_set))
classifier.show_most_informative_features(10)

tweet = "I love this course, NLP is surprisingly fun!"
print(classifier.classify(features(clean_tweet(tweet))))
          `,
          "Classifieur bayésien simple pour tweets"
        ),
        callout(
          "success",
          "Lien avec le cours ML",
          "Cette partie réutilise les réflexes vus au début du cours : données, train/test, features, métrique, puis interprétation. Le NLP ajoute surtout le prétraitement linguistique."
        )
      )
    ].join(""),

    checklist: [
      "Je peux définir l'analyse sémantique.",
      "Je distingue sémantique lexicale et supralexicale.",
      "Je peux reconnaître ambiguïté lexicale, syntaxique et référentielle.",
      "Je connais les principales relations lexicales.",
      "Je sais expliquer WordNet et les synsets.",
      "Je comprends le principe de compositionnalité.",
      "Je peux décrire la pipeline d'analyse de sentiments du TD."
    ],

    quiz: [
      {
        question: "Une ambiguïté syntaxique apparaît quand :",
        options: [
          "une phrase peut recevoir plusieurs arbres d'analyse",
          "un token est toujours supprimé",
          "un mot n'existe pas dans WordNet",
          "un classifieur n'a pas assez d'epochs"
        ],
        answer: 0,
        explanation: "L'ambiguïté syntaxique correspond à plusieurs structures possibles pour la même phrase."
      },
      {
        question: "Dans WordNet, un synset regroupe :",
        options: [
          "des synonymes cognitifs exprimant un concept",
          "des pixels voisins",
          "des actions Q-Learning",
          "des filtres 3 x 3"
        ],
        answer: 0,
        explanation: "WordNet organise les mots en synsets : ensembles de lemmes liés à un même concept."
      },
      {
        question: "Rose / flower illustre surtout :",
        options: [
          "hyponymie / hyperonymie",
          "méronymie",
          "BPTT",
          "dropout"
        ],
        answer: 0,
        explanation: "Rose est plus spécifique que flower : c'est une relation hyponyme / hyperonyme."
      },
      {
        question: "Dans le TD de sentiments, le classifieur bayésien reçoit typiquement :",
        options: [
          "des features extraites des tokens nettoyés",
          "un arbre de Bellman",
          "une image CIFAR-10 brute",
          "uniquement le nombre de pages du PDF"
        ],
        answer: 0,
        explanation: "Après nettoyage, les tweets sont transformés en features textuelles avant l'entraînement du classifieur."
      }
    ],

    exercises: [
      {
        title: "Classer les ambiguïtés",
        difficulty: "Facile",
        time: "15 min",
        prompt: "Pour trois phrases ambiguës de ton choix, indique si l'ambiguïté est lexicale, syntaxique ou référentielle. Justifie en une phrase.",
        deliverables: [
          "trois phrases",
          "un type d'ambiguïté par phrase",
          "une justification courte"
        ]
      },
      {
        title: "Pipeline de sentiments",
        difficulty: "Intermédiaire",
        time: "25 min",
        prompt: "Décris la pipeline du classifieur bayésien de tweets sans code : données, tokenisation, nettoyage, features, entraînement, test. Ajoute une limite de cette approche.",
        deliverables: [
          "six étapes de pipeline",
          "une limite",
          "une amélioration possible"
        ]
      }
    ],

    keywords: [
      "analyse sémantique",
      "sémantique lexicale",
      "sémantique supralexicale",
      "ambiguïté",
      "WordNet",
      "synset",
      "synonymie",
      "antonymie",
      "hyponymie",
      "méronymie",
      "compositionnalité",
      "analyse de sentiments",
      "classifieur bayésien"
    ]
  }
});
})(window);
