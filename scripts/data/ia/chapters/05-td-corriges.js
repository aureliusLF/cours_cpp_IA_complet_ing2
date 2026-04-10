(function registerChapterBundle5(globalScope) {
const registry = globalScope.CourseDataRegistry;

if (!registry) {
  console.error("CourseDataRegistry est indisponible. Vérifie que scripts/data/course-runtime.js est chargé avant les chapitres.");
  return;
}

const {
  lesson,
  paragraphs,
  bullets,
  callout,
  code,
  table
} = registry.helpers;

registry.registerChapterBundle({
  order: 5,
  chapter: {
    id: "td-corriges",
    shortTitle: "TD corrigés",
    title: "Résolution des TD ConvNet",
    level: "Pratique",
    duration: "2 h",
    track: "IA1",
    summary:
      "Cette partie transforme les TD fournis en corrigés guidés. On reprend les opérations ConvNet à la main, l'exploration de MNIST, un premier réseau dense binaire avec Keras, un ConvNet sur MNIST, puis un pipeline CIFAR-10 avec évaluation détaillée. Le code est volontairement simple, court et commenté pour servir de vraie base de révision.",
    goals: [
      "coder à la main une convolution 2D simple, une ReLU et un max-pooling pour ancrer les calculs",
      "inspecter, normaliser et reformater MNIST selon qu'on vise un réseau dense ou un ConvNet",
      "construire un réseau Keras binaire sur des données tabulaires et choisir la bonne fonction de perte",
      "entraîner un ConvNet Keras sur MNIST en niveaux de gris et vérifier sa cohérence avec model.summary()",
      "monter un pipeline CIFAR-10 raisonnable avec entraînement, accuracy, matrice de confusion et images mal classées",
      "lire des corrigés dont le code reste minimal et commenté ligne à ligne"
    ],
    highlights: [
      "corrigés guidés",
      "NumPy",
      "MNIST",
      "Keras",
      "CIFAR-10",
      "diagnostic"
    ],
    body: [
      callout(
        "success",
        "Principe des corrigés",
        "Dans toute cette partie, on privilégie le code le plus simple possible. Les exemples sont volontairement courts et commentés pour que chaque ligne corresponde à une idée du cours."
      ),

      lesson(
        "TD 1 — Opérations ConvNet à la main",
        paragraphs(
          "Le premier TD demande de revenir aux gestes les plus bas niveau : convolution, activation, pooling. C'est excellent pour comprendre ce qu'une couche fait vraiment avant de la laisser au framework."
        ),
        paragraphs(
          "L'idée du corrigé est simple : on écrit une convolution <em>valid</em> sur une image 2D, on lui applique une ReLU, puis on réduit la feature map avec un max-pooling. Le but n'est pas la performance, mais la lisibilité."
        ),
        code(
          "python",
          `
import numpy as np

# Convolution 2D simple sans padding et sans stride
def conv2d_valid(x, kernel, bias=0.0):
    h, w = x.shape
    kh, kw = kernel.shape
    out = np.zeros((h - kh + 1, w - kw + 1), dtype=np.float32)

    for i in range(out.shape[0]):
        for j in range(out.shape[1]):
            # On prend une petite zone de l'image
            patch = x[i:i + kh, j:j + kw]
            # Produit terme à terme puis somme
            out[i, j] = np.sum(patch * kernel) + bias

    return out

# ReLU : tout ce qui est négatif devient 0
def relu(x):
    return np.maximum(0, x)

# Max-pooling 2D très simple
def max_pool2d(x, pool=2, stride=2):
    out_h = (x.shape[0] - pool) // stride + 1
    out_w = (x.shape[1] - pool) // stride + 1
    out = np.zeros((out_h, out_w), dtype=x.dtype)

    for i in range(out_h):
        for j in range(out_w):
            # On prend une petite fenêtre
            patch = x[i * stride:i * stride + pool, j * stride:j * stride + pool]
            # On garde la plus grande valeur
            out[i, j] = np.max(patch)

    return out

# Petite image de test
image = np.random.randint(0, 256, size=(6, 6)).astype("float32")

# Filtre vertical simple
kernel = np.array([
    [1, 0, -1],
    [1, 0, -1],
    [1, 0, -1]
], dtype="float32")

# Étapes du mini pipeline ConvNet
feature_map = conv2d_valid(image, kernel)
activated = relu(feature_map)
pooled = max_pool2d(activated)

# On vérifie les tailles de sortie
print(feature_map.shape, pooled.shape)
          `,
          "Correction simple et commentée du TD 1"
        ),
        callout(
          "info",
          "Ce qu'il faut vérifier",
          "Commence toujours par vérifier la taille de sortie. Avec une convolution valid, une entrée 6 x 6 et un filtre 3 x 3 donnent une sortie 4 x 4. Un max-pooling 2 x 2 stride 2 sur cette sortie donne ensuite 2 x 2."
        )
      ),

      lesson(
        "TD 2 — Récupérer, inspecter et visualiser MNIST",
        paragraphs(
          "Ici, le vrai réflexe attendu est l'exploration des données avant tout apprentissage : dimensions, type, bornes, premières images, et adaptation du format selon le modèle visé."
        ),
        table(
          ["Objet", "Valeur attendue"],
          [
            ["<code>x_train</code>", "<code>(60000, 28, 28)</code> en entiers 0..255"],
            ["<code>y_train</code>", "<code>(60000,)</code> avec labels 0..9"],
            ["Version dense", "<code>(N, 784)</code> après flatten"],
            ["Version ConvNet Keras", "<code>(N, 28, 28, 1)</code> après ajout du canal"]
          ]
        ),
        code(
          "python",
          `
import matplotlib.pyplot as plt
from tensorflow.keras.datasets import mnist

# Chargement du dataset
(x_train, y_train), (x_test, y_test) = mnist.load_data()

# Vérification rapide des tableaux
for name, array in [
    ("x_train", x_train),
    ("y_train", y_train),
    ("x_test", x_test),
    ("y_test", y_test),
]:
    print(name, array.shape, array.dtype, array.min(), array.max())

# Version pour un réseau dense : on aplatit l'image
x_train_dense = x_train.reshape(x_train.shape[0], -1).astype("float32") / 255.0
x_test_dense = x_test.reshape(x_test.shape[0], -1).astype("float32") / 255.0

# Version pour un ConvNet : on garde la forme image
x_train_conv = x_train.astype("float32") / 255.0
x_test_conv = x_test.astype("float32") / 255.0

# On ajoute un canal gris final
x_train_conv = x_train_conv[..., None]
x_test_conv = x_test_conv[..., None]

# On affiche quelques exemples
plt.figure(figsize=(6, 3))
for idx in range(6):
    plt.subplot(2, 3, idx + 1)
    plt.imshow(x_train[idx], cmap="gray")
    plt.title(str(y_train[idx]))
    plt.axis("off")
plt.tight_layout()
plt.show()
          `,
          "Correction simple et commentée de MNIST"
        ),
        callout(
          "success",
          "Dense ou ConvNet ?",
          "Le même dataset peut être préparé de deux façons différentes. Un réseau dense lit un vecteur de 784 pixels. Un ConvNet lit une image structurée 28 x 28 avec un canal. Le choix du modèle détermine donc la forme du tenseur."
        )
      ),

      lesson(
        "TD 3 — Premier réseau dense binaire avec Keras",
        paragraphs(
          "Le troisième exercice sort un instant de la vision pour ancrer le workflow Keras sur un problème binaire classique : prédire l'apparition d'un diabète à partir de variables tabulaires. L'intérêt pédagogique est très bon : on voit clairement le lien entre type de sortie, activation finale et fonction de perte."
        ),
        bullets([
          "entrée tabulaire : on charge simplement les colonnes de données",
          "sortie binaire : une seule neurone final avec <code>sigmoid</code>",
          "perte adaptée : <code>binary_crossentropy</code>",
          "évaluation : accuracy d'abord, puis éventuellement précision/rappel"
        ]),
        code(
          "python",
          `
import numpy as np
from sklearn.model_selection import train_test_split
from tensorflow.keras import Sequential
from tensorflow.keras.layers import Dense

# Chargement du fichier CSV
data = np.loadtxt("pima-indians-diabetes.csv", delimiter=",")

# X = variables d'entrée, y = cible binaire
X = data[:, :-1].astype("float32")
y = data[:, -1].astype("float32")

# Séparation simple train / test
X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42,
    stratify=y
)

# Réseau très simple
model = Sequential([
    Dense(16, activation="relu", input_shape=(X_train.shape[1],)),
    Dense(1, activation="sigmoid")
])

# Compilation : binaire donc sigmoid + binary_crossentropy
model.compile(
    optimizer="adam",
    loss="binary_crossentropy",
    metrics=["accuracy"]
)

# Entraînement
model.fit(X_train, y_train, epochs=20, batch_size=32, validation_split=0.2)

# Évaluation finale
print(model.evaluate(X_test, y_test, verbose=0))
          `,
          "Correction simple et commentée du réseau binaire"
        ),
        callout(
          "warn",
          "Le bon couple sortie/perte",
          "C'est un point de vigilance majeur des TD : une classification binaire ne se traite pas comme un problème à 10 classes. Ici, on veut <code>Dense(1, activation=\"sigmoid\")</code> avec <code>binary_crossentropy</code>, pas un softmax."
        )
      ),

      lesson(
        "TD 4 — ConvNet Keras sur MNIST",
        paragraphs(
          "Le quatrième TD met tout bout à bout sur un petit sous-ensemble de MNIST. La logique attendue est : charger, réduire éventuellement le dataset pour aller vite, reformater les images, encoder les labels, définir le réseau, afficher son résumé, puis entraîner et évaluer."
        ),
        code(
          "python",
          `
from tensorflow.keras import Sequential
from tensorflow.keras.datasets import mnist
from tensorflow.keras.layers import Conv2D, MaxPooling2D, Flatten, Dense
from tensorflow.keras.utils import to_categorical

# Chargement de MNIST
(x_train, y_train), (x_test, y_test) = mnist.load_data()

# On prend un petit sous-ensemble pour aller vite
x_train = x_train[:1000].astype("float32") / 255.0
x_test = x_test[:100].astype("float32") / 255.0

# On transforme les labels en one-hot
y_train = to_categorical(y_train[:1000], 10)
y_test = to_categorical(y_test[:100], 10)

# Keras attend (N, hauteur, largeur, canaux)
x_train = x_train.reshape(-1, 28, 28, 1)
x_test = x_test.reshape(-1, 28, 28, 1)

# ConvNet minimal
model = Sequential([
    Conv2D(32, (3, 3), activation="relu", input_shape=(28, 28, 1)),
    MaxPooling2D((2, 2)),
    Flatten(),
    Dense(10, activation="softmax")
])

# Multiclasse donc softmax + categorical_crossentropy
model.compile(
    optimizer="adam",
    loss="categorical_crossentropy",
    metrics=["accuracy"]
)

# Vérification rapide de l'architecture
model.summary()

# Entraînement puis test
model.fit(x_train, y_train, epochs=10, batch_size=32, validation_split=0.2)
print(model.evaluate(x_test, y_test, verbose=0))
          `,
          "Correction simple et commentée du ConvNet MNIST"
        ),
        callout(
          "info",
          "Pourquoi afficher model.summary()",
          "Le TD le demande explicitement pour une bonne raison : c'est la vérification la plus rapide de cohérence. On y lit les dimensions intermédiaires et le nombre de paramètres de chaque couche avant de lancer l'entraînement."
        )
      ),

      lesson(
        "TD 5 — CIFAR-10 couleur : entraînement et diagnostic",
        paragraphs(
          "Le dernier TD demande un pipeline plus complet : découvrir CIFAR-10, préparer les données, entraîner un ConvNet couleur, puis analyser les résultats avec une matrice de confusion, des scores par classe et des exemples mal classés."
        ),
        callout(
          "info",
          "Note sur l'annexe fournie",
          "Dans les deux PDF transmis ici, l'annexe détaille clairement le workflow Keras (add, compile, fit, evaluate, Dense, Conv2D, MaxPooling2D, Dropout, Flatten), mais ne donne pas une architecture CIFAR-10 entièrement figée. Le corrigé ci-dessous propose donc une architecture raisonnable, cohérente avec l'esprit du TD."
        ),
        paragraphs(
          "Ici aussi, on reste volontairement sur une architecture simple. L'idée est d'avoir une base lisible pour comprendre le pipeline complet, pas d'optimiser le dernier point d'accuracy."
        ),
        code(
          "python",
          `
import numpy as np
from tensorflow.keras import Sequential
from tensorflow.keras.datasets import cifar10
from tensorflow.keras.layers import Conv2D, MaxPooling2D, Flatten, Dense
from tensorflow.keras.utils import to_categorical

class_names = [
    "airplane", "automobile", "bird", "cat", "deer",
    "dog", "frog", "horse", "ship", "truck"
]

# Chargement du dataset
(x_train, y_train), (x_test, y_test) = cifar10.load_data()

# Vérification rapide
print(x_train.shape, x_train.dtype, x_train.min(), x_train.max())
print(y_train.shape, y_train.dtype)

# Normalisation des images
x_train = x_train.astype("float32") / 255.0
x_test = x_test.astype("float32") / 255.0

# Labels one-hot pour la sortie softmax
y_train_cat = to_categorical(y_train, 10)
y_test_cat = to_categorical(y_test, 10)

# Modèle volontairement simple
model = Sequential([
    Conv2D(32, (3, 3), activation="relu", input_shape=(32, 32, 3)),
    MaxPooling2D((2, 2)),
    Flatten(),
    Dense(64, activation="relu"),
    Dense(10, activation="softmax")
])

# Compilation
model.compile(
    optimizer="adam",
    loss="categorical_crossentropy",
    metrics=["accuracy"]
)

# Résumé puis entraînement
model.summary()
model.fit(
    x_train,
    y_train_cat,
    epochs=10,
    batch_size=64,
    validation_split=0.1
)
          `,
          "Correction simple et commentée du pipeline CIFAR-10"
        ),
        code(
          "python",
          `
import matplotlib.pyplot as plt
from sklearn.metrics import classification_report, confusion_matrix

# Score final sur le test
test_loss, test_acc = model.evaluate(x_test, y_test_cat, verbose=0)
print(test_loss, test_acc)

# Probabilités puis classe prédite
y_proba = model.predict(x_test, verbose=0)
y_pred = np.argmax(y_proba, axis=1)
y_true = y_test.reshape(-1)

# Diagnostic global
print(confusion_matrix(y_true, y_pred))
print(classification_report(y_true, y_pred, target_names=class_names))

# On récupère quelques erreurs
wrong = np.where(y_pred != y_true)[0][:9]

# Affichage simple des images mal classées
plt.figure(figsize=(8, 8))
for plot_idx, sample_idx in enumerate(wrong):
    plt.subplot(3, 3, plot_idx + 1)
    plt.imshow(x_test[sample_idx])
    plt.title(f"vrai={class_names[y_true[sample_idx]]}\\npred={class_names[y_pred[sample_idx]]}")
    plt.axis("off")
plt.tight_layout()
plt.show()
          `,
          "Diagnostic simple et commenté sur CIFAR-10"
        ),
        paragraphs(
          "Ce diagnostic vaut presque autant que l'accuracy finale. Si le modèle confond surtout <em>cat</em> et <em>dog</em>, ce n'est pas la même histoire que s'il confond <em>ship</em> et <em>frog</em>. Les erreurs racontent ce que le réseau a compris ou non."
        )
      )
    ].join(""),

    checklist: [
      "Je peux écrire une convolution 2D valide simple et un max-pooling en NumPy.",
      "Je sais inspecter MNIST, le normaliser, puis le reformater pour un réseau dense ou un ConvNet.",
      "Je sais choisir correctement <code>sigmoid + binary_crossentropy</code> pour un problème binaire.",
      "Je peux entraîner un ConvNet Keras minimal sur MNIST et lire <code>model.summary()</code>.",
      "Je peux monter un pipeline CIFAR-10 avec accuracy, matrice de confusion et visualisation des erreurs."
    ],

    quiz: [
      {
        question: "Pourquoi normalise-t-on généralement les pixels en divisant par 255.0 avant l'entraînement ?",
        options: [
          "Pour transformer les images en labels",
          "Pour ramener les valeurs dans une plage stable pour l'optimisation",
          "Pour réduire automatiquement le nombre de paramètres du réseau",
          "Pour éviter d'avoir besoin d'une fonction de perte"
        ],
        answer: 1,
        explanation: "Les pixels bruts sont souvent des entiers entre 0 et 255. Les ramener dans [0, 1] stabilise l'optimisation et évite d'alimenter le réseau avec des échelles trop grandes."
      },
      {
        question: "Quelle préparation convient à MNIST si l'on veut utiliser Conv2D dans Keras ?",
        options: [
          "Aplatir en <code>(N, 784)</code> sans normalisation",
          "Passer en <code>(N, 28, 28, 1)</code> après normalisation",
          "Passer en <code>(28, 28, N)</code>",
          "Garder les labels sous forme d'images 28 x 28"
        ],
        answer: 1,
        explanation: "Un ConvNet Keras attend des tenseurs image structurés avec un axe canal final. Pour MNIST, cela donne <code>(N, 28, 28, 1)</code> après normalisation."
      },
      {
        question: "Quel couple est correct pour une classification binaire en Keras ?",
        options: [
          "<code>Dense(10, softmax)</code> + <code>categorical_crossentropy</code>",
          "<code>Dense(1, sigmoid)</code> + <code>binary_crossentropy</code>",
          "<code>Dense(1, relu)</code> + <code>mse</code>",
          "<code>Dense(2, relu)</code> + <code>hinge</code>"
        ],
        answer: 1,
        explanation: "En sortie binaire, on veut une probabilité scalaire dans [0, 1], donc un neurone sigmoïde et une perte binaire."
      },
      {
        question: "À quoi sert surtout <code>model.summary()</code> dans un TD d'introduction ?",
        options: [
          "À télécharger automatiquement le dataset",
          "À visualiser la courbe d'entraînement avant l'entraînement",
          "À vérifier la cohérence des dimensions et le nombre de paramètres",
          "À choisir le meilleur batch size sans essai"
        ],
        answer: 2,
        explanation: "Le résumé du modèle permet de repérer très tôt un enchaînement incohérent de couches ou un modèle démesuré en paramètres."
      },
      {
        question: "Pourquoi afficher des images mal classées après un entraînement CIFAR-10 ?",
        options: [
          "Parce que l'accuracy ne s'affiche plus si on ne le fait pas",
          "Pour comprendre quelles classes se ressemblent pour le modèle et où il échoue",
          "Pour recalculer les gradients à la main",
          "Pour convertir automatiquement le modèle en version plus profonde"
        ],
        answer: 1,
        explanation: "Les erreurs visuelles et la matrice de confusion donnent une lecture qualitative du comportement du modèle, bien plus riche qu'un seul score global."
      }
    ],

    exercises: [
      {
        title: "Rejouer MNIST en PyTorch",
        difficulty: "Intermédiaire",
        time: "25 min",
        prompt: "Réécris le corrigé MNIST du TD 4 en PyTorch : dataset, DataLoader, petit ConvNet, boucle d'entraînement sur 3 epochs, puis accuracy sur le test.",
        deliverables: [
          "la définition du modèle PyTorch",
          "la boucle train et la boucle test",
          "la justification du format <code>(N, C, H, W)</code>"
        ]
      },
      {
        title: "Comparer deux batch sizes sur CIFAR-10",
        difficulty: "Intermédiaire",
        time: "20 min",
        prompt: "Relance le pipeline CIFAR-10 avec <code>batch_size=32</code> puis <code>batch_size=128</code>. Compare vitesse, stabilité des courbes et accuracy finale.",
        deliverables: [
          "un tableau comparatif des deux runs",
          "une hypothèse sur l'effet du batch size",
          "une conclusion argumentée sur le meilleur compromis"
        ]
      },
      {
        title: "Corriger une erreur de labels",
        difficulty: "Débutant",
        time: "10 min",
        prompt: "On te donne un modèle multi-classes compilé avec <code>binary_crossentropy</code> et des labels one-hot. Explique pourquoi c'est incohérent, puis propose deux corrections valides.",
        deliverables: [
          "l'explication de l'erreur",
          "une correction avec <code>categorical_crossentropy</code>",
          "une correction alternative avec labels entiers et <code>sparse_categorical_crossentropy</code>"
        ]
      }
    ],

    keywords: [
      "td",
      "corrigé",
      "numpy",
      "keras",
      "mnist",
      "cifar10",
      "convolution",
      "max pooling",
      "normalisation",
      "binary crossentropy",
      "categorical crossentropy",
      "model summary",
      "matrice de confusion",
      "images mal classées"
    ]
  }
});
})(window);
