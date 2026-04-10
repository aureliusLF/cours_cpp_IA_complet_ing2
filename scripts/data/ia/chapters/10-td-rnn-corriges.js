(function registerChapterBundle10(globalScope) {
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
  order: 10,
  chapter: {
    id: "td-rnn-corriges",
    shortTitle: "TD RNN",
    title: "Résolution des TD RNN",
    level: "Pratique",
    duration: "2 h 10",
    track: "IA2",
    summary:
      "Cette partie transforme le PDF de TD RNN en corrigés guidés. On y trouve un RNN minimal en NumPy/Python standard, une prédiction de série temporelle avec Keras sur MSFT, puis un LSTM simple pour générer du texte caractère par caractère. Comme demandé, le code reste volontairement simple et commenté.",
    goals: [
      "écrire un RNN minimal à la main en Python standard avec tanh et softmax",
      "préparer une série temporelle en fenêtres glissantes pour un RNN Keras",
      "choisir la bonne activation de sortie, la bonne perte et une métrique cohérente pour la prédiction de prix",
      "construire une pipeline de génération de texte caractère par caractère avec dictionnaires, one-hot, LSTM et boucle de génération",
      "transformer les énoncés des TD en corrigés réutilisables pour révision ou mise en pratique"
    ],
    highlights: [
      "TD corrigés",
      "Python simple",
      "SimpleRNN",
      "MSFT",
      "LSTM",
      "génération de texte"
    ],
    body: [
      callout(
        "success",
        "Principe des corrigés RNN",
        "Comme pour les TD ConvNet, on garde ici le code le plus simple possible. L'objectif n'est pas de faire la version la plus performante, mais la version la plus lisible pour revoir les idées du cours."
      ),

      lesson(
        "TD 1 — Illustrer le fonctionnement d'un RNN en Python standard",
        paragraphs(
          "Le premier exercice du PDF demande un <strong>script Python standard</strong> qui illustre le fonctionnement d'un RNN simple. Le cahier des charges est précis : une seule couche cachée, tailles choisies par l'utilisateur, activation <code>tanh</code> pour la couche cachée, <code>softmax</code> pour la sortie, et génération aléatoire des poids, des biais et de la séquence d'entrée."
        ),
        fig("rnnMatrixMap", "Le script ci-dessous suit exactement cette structure : X_t -> H_t -> Y_t, avec retour de H_(t−1) vers H_t."),
        table(
          ["Quantité", "Choisie par", "Rôle"],
          [
            ["<code>n</code>", "l'utilisateur", "taille d'entrée"],
            ["<code>m</code>", "l'utilisateur", "taille de la couche cachée"],
            ["<code>p</code>", "l'utilisateur", "taille de la sortie"],
            ["<code>T</code>", "l'utilisateur", "longueur de la séquence"],
            ["<code>U, V, W, b_h, b_o</code>", "tirage aléatoire", "paramètres illustratifs du réseau"]
          ]
        ),
        code(
          "python",
          `
import numpy as np

# Softmax simple pour transformer des scores en probabilités
def softmax(z):
    z = z - np.max(z)          # stabilité numérique
    exp_z = np.exp(z)
    return exp_z / np.sum(exp_z)

# On laisse l'utilisateur choisir la taille du problème
n = int(input("Taille de l'entrée n : "))
m = int(input("Taille cachée m : "))
p = int(input("Taille de la sortie p : "))
T = int(input("Longueur de la séquence T : "))

# Séquence d'entrée aléatoire : T vecteurs de taille n
X = np.random.randn(T, n)

# Poids et biais aléatoires
U = np.random.randn(m, n) * 0.1
V = np.random.randn(m, m) * 0.1
W = np.random.randn(p, m) * 0.1
b_h = np.zeros(m)
b_o = np.zeros(p)

# Au début, on prend un état caché nul
h_prev = np.zeros(m)

print("\\n--- Déroulage du RNN ---")

for t in range(T):
    # État caché courant : entrée actuelle + mémoire passée
    h_t = np.tanh(U @ X[t] + V @ h_prev + b_h)

    # Sortie courante : distribution de probabilité
    y_t = softmax(W @ h_t + b_o)

    print(f"Temps {t + 1}")
    print("x_t =", np.round(X[t], 3))
    print("h_t =", np.round(h_t, 3))
    print("y_t =", np.round(y_t, 3))
    print()

    # La mémoire du pas courant devient la mémoire du pas suivant
    h_prev = h_t
          `,
          "Correction simple et commentée du TD 1"
        ),
        callout(
          "info",
          "Ce qu'il faut regarder quand tu l'exécutes",
          "Observe surtout que <code>h_t</code> dépend à la fois de <code>X[t]</code> et de <code>h_prev</code>. C'est ce détail qui distingue vraiment le RNN d'une couche dense classique."
        )
      ),

      lesson(
        "TD 2 — Prédire le cours de Microsoft avec Keras",
        paragraphs(
          "Le second exercice applique un RNN à une <strong>série temporelle</strong>. Le PDF demande de lire <code>MSFT.csv</code>, de n'utiliser que les prix à la fermeture, de faire très attention à la <strong>forme</strong> des tenseurs, puis de choisir correctement l'activation de sortie, la perte et la métrique."
        ),
        table(
          ["Objet", "Forme typique", "Commentaire"],
          [
            ["Prix de clôture", "<code>(N, 1)</code>", "une seule variable par jour"],
            ["Fenêtres d'entrée", "<code>(samples, window, 1)</code>", "format attendu par Keras pour un RNN"],
            ["Cible", "<code>(samples, 1)</code>", "prix suivant à prédire"],
            ["Sortie du modèle", "<code>Dense(1)</code>", "régression donc sortie linéaire"]
          ]
        ),
        code(
          "python",
          `
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from sklearn.preprocessing import MinMaxScaler
from tensorflow.keras import Sequential
from tensorflow.keras.layers import SimpleRNN, Dense

# Lecture du fichier CSV
df = pd.read_csv("MSFT.csv")

# On garde uniquement le prix à la fermeture
close_prices = df["Close"].values.reshape(-1, 1)

# Normalisation dans [0, 1] pour stabiliser l'entraînement
scaler = MinMaxScaler()
close_scaled = scaler.fit_transform(close_prices)

# Fonction simple de création de fenêtres glissantes
def make_windows(values, window=30):
    X, y = [], []

    for i in range(len(values) - window):
        # X = les 30 jours précédents
        X.append(values[i:i + window])
        # y = le jour suivant
        y.append(values[i + window])

    return np.array(X), np.array(y)

X, y = make_windows(close_scaled, window=30)

# Séparation train / test en gardant l'ordre temporel
split = int(len(X) * 0.8)
X_train, X_test = X[:split], X[split:]
y_train, y_test = y[:split], y[split:]

print("X_train :", X_train.shape)  # (samples, 30, 1)
print("y_train :", y_train.shape)  # (samples, 1)

# Réseau simple : une couche récurrente puis une sortie linéaire
model = Sequential([
    SimpleRNN(32, activation="tanh", input_shape=(X_train.shape[1], 1)),
    Dense(1)  # pas d'activation : on fait une régression
])

# En régression, on choisit une perte de type MSE
# et une métrique lisible comme la MAE
model.compile(
    optimizer="adam",
    loss="mse",
    metrics=["mae"]
)

# Entraînement
history = model.fit(
    X_train,
    y_train,
    epochs=20,
    batch_size=32,
    validation_split=0.2,
    verbose=1
)

# Prédictions sur le test
y_pred_scaled = model.predict(X_test)

# Retour à l'échelle réelle
y_pred = scaler.inverse_transform(y_pred_scaled)
y_real = scaler.inverse_transform(y_test)

# Comparaison visuelle
plt.figure(figsize=(10, 4))
plt.plot(y_real, label="Réel")
plt.plot(y_pred, label="Prédit")
plt.title("Cours Microsoft : réel vs prédit")
plt.xlabel("Jour")
plt.ylabel("Prix de clôture")
plt.legend()
plt.tight_layout()
plt.show()
          `,
          "Correction simple et commentée du TD 2"
        ),
        callout(
          "warn",
          "Les trois pièges classiques de ce TD",
          "1) oublier la forme <code>(samples, window, 1)</code>, 2) mettre un <code>softmax</code> ou une <code>sigmoid</code> alors qu'on prédit une valeur réelle, 3) choisir une métrique de classification au lieu d'une métrique de régression comme la MAE."
        )
      ),

      lesson(
        "TD 3 — Un LSTM pour générer du texte caractère par caractère",
        paragraphs(
          "Le troisième exercice veut faire comprendre la logique complète d'une <strong>génération de texte</strong> : lire un document, construire deux dictionnaires <code>char_indices</code> et <code>indices_char</code>, créer des exemples qui se chevauchent, les encoder en one-hot, entraîner un LSTM, puis générer un caractère après l'autre."
        ),
        fig("lstmGatesCell", "Le LSTM est particulièrement adapté ici parce qu'il garde mieux certaines dépendances dans la séquence de caractères."),
        table(
          ["Étape", "Ce qu'on fait", "Pourquoi"],
          [
            ["1", "analyser le texte", "connaître sa longueur et son alphabet"],
            ["2", "construire les dictionnaires", "passer des caractères aux indices et inversement"],
            ["3", "créer des séquences chevauchantes", "fabriquer les exemples d'entraînement"],
            ["4", "one-hot encoder", "obtenir un tenseur lisible par le réseau"],
            ["5", "entraîner LSTM + Dense", "prédire le caractère suivant"],
            ["6", "reboucler la sortie", "générer du texte caractère par caractère"]
          ]
        ),
        code(
          "python",
          `
import numpy as np
from tensorflow.keras import Sequential
from tensorflow.keras.layers import LSTM, Dense

# Lecture du texte
with open("texte.txt", "r", encoding="utf-8") as f:
    text = f.read().lower()

print("Nombre total de caractères :", len(text))
print("Début du texte :", text[:120])

# Alphabet du texte
chars = sorted(list(set(text)))
print("Nombre de caractères différents :", len(chars))

# Dictionnaires caractère -> index et index -> caractère
char_indices = {char: idx for idx, char in enumerate(chars)}
indices_char = {idx: char for idx, char in enumerate(chars)}

# Longueur d'une séquence d'entrée
seqlen = 40
step = 3

sequences = []
next_chars = []

# On crée des couples (séquence, caractère suivant)
for i in range(0, len(text) - seqlen, step):
    sequences.append(text[i:i + seqlen])
    next_chars.append(text[i + seqlen])

print("Nombre d'exemples :", len(sequences))

# Encodage one-hot
x = np.zeros((len(sequences), seqlen, len(chars)), dtype=np.float32)
y = np.zeros((len(sequences), len(chars)), dtype=np.float32)

for i, seq in enumerate(sequences):
    for t, char in enumerate(seq):
        x[i, t, char_indices[char]] = 1.0
    y[i, char_indices[next_chars[i]]] = 1.0

# Réseau minimal : une couche LSTM puis une sortie softmax
model = Sequential([
    LSTM(128, input_shape=(seqlen, len(chars))),
    Dense(len(chars), activation="softmax")
])

model.compile(
    optimizer="adam",
    loss="categorical_crossentropy"
)

model.fit(x, y, epochs=20, batch_size=128)

def generate_text(seed, length=200):
    generated = seed.lower()

    for _ in range(length):
        # On prépare la dernière fenêtre de seqlen caractères
        window = generated[-seqlen:]
        sample = np.zeros((1, seqlen, len(chars)), dtype=np.float32)

        for t, char in enumerate(window):
            if char in char_indices:
                sample[0, t, char_indices[char]] = 1.0

        # Prédiction du caractère suivant
        preds = model.predict(sample, verbose=0)[0]
        next_index = np.argmax(preds)  # version la plus simple
        next_char = indices_char[next_index]

        # On ajoute le caractère et on continue
        generated += next_char

    return generated

seed = text[:seqlen]
print(generate_text(seed, length=300))
          `,
          "Correction simple et commentée du TD 3"
        ),
        callout(
          "info",
          "Pourquoi la génération reboucle sur elle-même",
          "Le modèle ne produit qu'un seul caractère à la fois. Pour continuer, on ajoute ce caractère à la fin de la séquence courante, on décale la fenêtre, puis on repasse cette nouvelle séquence au réseau."
        )
      ),

      lesson(
        "Ce que les trois TD t'apprennent ensemble",
        paragraphs(
          "Ces trois exercices couvrent presque toute la chaîne pédagogique du cours RNN. Le premier fixe les équations dans la tête. Le deuxième montre comment transformer une série temporelle en tenseurs compatibles avec Keras. Le troisième fait le pont vers la génération séquentielle, avec un LSTM et un encodage one-hot."
        ),
        fig("languageModelSoftmax", "Qu'on prédise un mot, un caractère ou une valeur, la logique reste la même : un état résume le passé puis sert à produire la sortie courante."),
        bullets([
          "TD 1 : comprendre le calcul d'un pas de temps",
          "TD 2 : manipuler correctement les formes <code>(samples, time, features)</code>",
          "TD 3 : comprendre le passage données texte -> exemples -> LSTM -> génération"
        ])
      )
    ].join(""),

    checklist: [
      "Je peux écrire un petit script RNN en Python standard avec tanh et softmax.",
      "Je sais préparer une série temporelle en fenêtres glissantes pour Keras.",
      "Je sais expliquer pourquoi la sortie d'un modèle de prédiction de prix doit être linéaire et la perte de type MSE.",
      "Je sais construire les dictionnaires caractère -> index et index -> caractère pour un TD de génération de texte.",
      "Je peux expliquer pourquoi le texte est généré caractère par caractère dans une boucle."
    ],

    quiz: [
      {
        question: "Dans le TD 1, quelle activation est utilisée dans la couche cachée du RNN ?",
        options: [
          "ReLU",
          "tanh",
          "softmax",
          "sigmoid uniquement en sortie"
        ],
        answer: 1,
        explanation: "Le PDF demande explicitement la tangente hyperbolique pour la couche cachée du RNN illustratif."
      },
      {
        question: "Pour prédire un prix de clôture, la dernière couche doit naturellement être :",
        options: [
          "<code>Dense(10, activation=\"softmax\")</code>",
          "<code>Dense(1, activation=\"sigmoid\")</code>",
          "<code>Dense(1)</code>",
          "une couche dropout"
        ],
        answer: 2,
        explanation: "On fait de la régression. On veut donc une seule sortie réelle, sans activation de classification."
      },
      {
        question: "La forme attendue par un <code>SimpleRNN</code> Keras est en général :",
        options: [
          "<code>(samples, features)</code>",
          "<code>(samples, time, features)</code>",
          "<code>(time, samples)</code>",
          "<code>(features, time, samples)</code>"
        ],
        answer: 1,
        explanation: "Keras attend un lot d'exemples, chacun étant une séquence de longueur donnée contenant un certain nombre de features par pas."
      },
      {
        question: "Dans le TD de génération de texte, à quoi servent <code>char_indices</code> et <code>indices_char</code> ?",
        options: [
          "à calculer la perte MSE",
          "à faire le lien entre caractères et indices entiers",
          "à normaliser le texte dans [0, 1]",
          "à mélanger les fenêtres d'entraînement"
        ],
        answer: 1,
        explanation: "Le réseau ne manipule pas directement les caractères bruts. On doit pouvoir convertir un caractère en indice et refaire le chemin inverse."
      },
      {
        question: "Pourquoi le texte est-il généré dans une boucle après l'entraînement ?",
        options: [
          "parce que le modèle prédit toute la phrase d'un seul coup",
          "parce qu'on prédit un caractère, puis on le réinjecte dans la séquence suivante",
          "parce que LSTM ne sait pas produire de probabilités",
          "pour éviter l'encodage one-hot"
        ],
        answer: 1,
        explanation: "La génération se fait pas à pas : un caractère prédit est ajouté à la fin de la séquence, puis cette nouvelle fenêtre sert à prédire le suivant."
      }
    ],

    exercises: [
      {
        title: "Vérifier les formes du TD 2",
        difficulty: "Facile",
        time: "12 min",
        prompt: "Explique pourquoi un tableau de prix de forme <code>(N, 1)</code> doit devenir un tenseur de forme <code>(samples, window, 1)</code> avant d'entrer dans un RNN Keras.",
        deliverables: [
          "une phrase sur l'axe samples",
          "une phrase sur l'axe time",
          "une phrase sur l'axe features"
        ]
      },
      {
        title: "Rejouer le TD 1 à la main",
        difficulty: "Intermédiaire",
        time: "15 min",
        prompt: "Prends <code>n = 2</code>, <code>m = 2</code>, <code>p = 2</code>, une séquence de longueur 2, puis invente de petits poids et biais. Calcule à la main <code>h_1</code>, <code>y_1</code>, puis <code>h_2</code> en montrant le rôle de la mémoire.",
        deliverables: [
          "les valeurs choisies pour U, V, W, b_h, b_o",
          "le calcul de h_1 et y_1",
          "le calcul de h_2 en réutilisant h_1"
        ]
      },
      {
        title: "Simplifier un générateur de texte",
        difficulty: "Intermédiaire",
        time: "20 min",
        prompt: "Explique, sans écrire plus de 12 lignes de pseudo-code, la boucle de génération caractère par caractère d'un LSTM. Tu dois faire apparaître la fenêtre courante, la prédiction, puis l'ajout du nouveau caractère.",
        deliverables: [
          "un pseudo-code court",
          "la fenêtre de taille seqlen",
          "la mise à jour de la chaîne générée"
        ]
      }
    ],

    keywords: [
      "td rnn",
      "simplernn",
      "série temporelle",
      "fenêtre glissante",
      "msft",
      "lstm",
      "génération de texte",
      "one-hot"
    ]
  }
});
})(window);
