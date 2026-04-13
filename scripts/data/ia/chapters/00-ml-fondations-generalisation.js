(function registerChapterBundleMl0(globalScope) {
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
  order: 0.1,
  chapter: {
    id: "ml-fondations-generalisation",
    shortTitle: "Bases ML",
    title: "Machine Learning essentiel : données, généralisation, overfitting",
    level: "Fondations",
    duration: "2 h 25",
    track: "IA0",
    summary:
      "Avant les réseaux profonds, il faut les réflexes de base du machine learning : dataset, features, labels, types d'apprentissage, qualité des données, train/validation/test, généralisation, sur-apprentissage, sous-apprentissage, biais/variance, fuite de données, baselines et pipeline de prétraitement.",
    goals: [
      "définir ce qu'un modèle apprend à partir d'un dataset",
      "distinguer features, labels, classification, régression et apprentissage supervisé/non supervisé",
      "comprendre les grandes familles d'apprentissage : supervisé, non supervisé, auto-supervisé et renforcement",
      "identifier les problèmes de qualité de données qui faussent un apprentissage",
      "comprendre la généralisation comme objectif réel du ML",
      "repérer sous-apprentissage, bon compromis et sur-apprentissage",
      "expliquer le compromis biais/variance",
      "distinguer paramètres appris et hyperparamètres choisis",
      "éviter les fuites de données et les erreurs de prétraitement",
      "savoir construire une baseline et un protocole expérimental simple"
    ],
    highlights: [
      "dataset",
      "features",
      "label",
      "supervisé",
      "qualité des données",
      "généralisation",
      "overfitting",
      "data leakage",
      "pipeline"
    ],
    body: [
      lesson(
        "Ce qu'un modèle apprend vraiment",
        paragraphs(
          "Un modèle de machine learning apprend une relation à partir d'exemples. Dans un problème supervisé, chaque exemple contient des <strong>features</strong> notées souvent <code>X</code>, et une cible ou <strong>label</strong> notée <code>y</code>. Le but n'est pas de mémoriser les exemples, mais de produire de bonnes prédictions sur des données nouvelles."
        ),
        table(
          ["Notion", "Exemple", "Rôle"],
          [
            ["Feature", "âge, pixel, prix d'hier", "variable d'entrée"],
            ["Label", "classe chat/chien, prix demain", "valeur à prédire"],
            ["Classification", "spam ou non-spam", "prédire une catégorie"],
            ["Régression", "prix d'une maison", "prédire une valeur continue"],
            ["Modèle", "arbre, SVM, réseau de neurones", "fonction apprise à partir des données"]
          ]
        ),
        callout(
          "success",
          "La phrase à retenir",
          "Un bon modèle n'est pas celui qui récite le train. C'est celui qui généralise correctement sur des exemples jamais vus."
        )
      ),

      lesson(
        "Les grandes familles d'apprentissage",
        paragraphs(
          "Le mot <strong>machine learning</strong> regroupe plusieurs cadres. La différence principale vient de ce que l'on donne au modèle comme signal d'apprentissage. Est-ce qu'on donne une bonne réponse ? Est-ce qu'on donne seulement des données brutes ? Est-ce qu'on donne une récompense après action ? Cette distinction évite de mélanger des problèmes très différents."
        ),
        table(
          ["Famille", "Signal disponible", "Exemples", "Ce que le modèle apprend"],
          [
            ["Supervisé", "features <code>X</code> + labels <code>y</code>", "classification spam, régression de prix", "associer une entrée à une cible"],
            ["Non supervisé", "features <code>X</code> seules", "clustering clients, réduction de dimension", "trouver une structure sans labels explicites"],
            ["Auto-supervisé", "labels fabriqués à partir des données", "prédire un mot masqué, prédire la prochaine frame", "apprendre une représentation utile"],
            ["Renforcement", "état, action, récompense", "jeu, robot, contrôle", "choisir des actions qui maximisent le retour futur"]
          ]
        ),
        callout(
          "info",
          "Lien avec la suite du cours",
          "Les CNN et RNN seront souvent utilisés en supervisé. Les modèles de langage relèvent beaucoup de l'auto-supervisé. L'apprentissage par renforcement ajoute ensuite la boucle état → action → reward."
        )
      ),

      lesson(
        "Qualité des données : le modèle apprend ce qu'on lui donne",
        paragraphs(
          "Un modèle n'apprend pas une vérité abstraite : il apprend à partir d'un dataset concret, avec ses biais, ses trous, ses doublons et ses erreurs. Avant de comparer des architectures, il faut donc inspecter les données. Beaucoup de modèles « mauvais » sont en réalité entraînés sur une définition de problème floue ou sur des données mal préparées."
        ),
        table(
          ["Problème", "Symptôme", "Risque", "Réflexe"],
          [
            ["Valeurs manquantes", "cases vides, NaN", "modèle instable ou suppression massive de lignes", "imputation ou modèle qui gère les valeurs manquantes"],
            ["Doublons", "mêmes exemples répétés", "test trop facile si un doublon existe en train", "dédupliquer avant le split ou splitter par groupe"],
            ["Labels bruités", "erreurs d'annotation", "plafond de performance artificiel", "auditer un échantillon et mesurer l'accord annotateur"],
            ["Échantillon non représentatif", "train très différent du monde réel", "mauvaise généralisation", "revoir l'échantillonnage et documenter la population"],
            ["Classes déséquilibrées", "une classe très rare", "accuracy trompeuse", "stratification, métriques adaptées, pondération"]
          ]
        ),
        bullets([
          "<strong>poser la cible</strong> : que cherche-t-on exactement à prédire ?",
          "<strong>poser l'unité d'exemple</strong> : une ligne = un patient, une image, une transaction, une fenêtre temporelle ?",
          "<strong>poser la date</strong> : quelles informations sont réellement disponibles au moment de la prédiction ?",
          "<strong>poser le groupe</strong> : un même utilisateur ou patient peut-il apparaître à la fois dans train et test ?"
        ]),
        callout(
          "warn",
          "La question qui sauve du leakage",
          "Au moment où le modèle ferait sa prédiction dans la vraie vie, est-ce que cette information serait déjà connue ? Si la réponse est non, la feature ne doit pas entrer dans le train."
        )
      ),

      lesson(
        "Train, validation, test",
        paragraphs(
          "On sépare les données pour ne pas se mentir. Le <strong>train</strong> sert à ajuster les paramètres. La <strong>validation</strong> sert à choisir les hyperparamètres et comparer les modèles. Le <strong>test</strong> sert à estimer la performance finale, une seule fois, quand les choix sont faits."
        ),
        fig("mlTrainValidationTestSplit", "Train pour apprendre, validation pour choisir, test pour mesurer honnêtement à la fin."),
        bullets([
          "<strong>train</strong> : le modèle voit ces exemples pendant l'apprentissage",
          "<strong>validation</strong> : on s'en sert pour régler profondeur, régularisation, learning rate, etc.",
          "<strong>test</strong> : on le garde de côté jusqu'à la toute fin",
          "<strong>danger</strong> : si tu ajustes ton modèle sur le test, le test n'est plus un vrai test"
        ]),
        callout(
          "warn",
          "Le test n'est pas une validation bis",
          "Regarder le score test à chaque tentative revient à entraîner indirectement sur le test. C'est une fuite méthodologique très classique."
        )
      ),

      lesson(
        "Généralisation, underfitting, overfitting",
        paragraphs(
          "La <strong>généralisation</strong> est la capacité d'un modèle à rester bon sur de nouvelles données. Deux erreurs opposées peuvent arriver. Le <strong>sous-apprentissage</strong> arrive quand le modèle est trop simple pour capturer la structure. Le <strong>sur-apprentissage</strong> arrive quand le modèle colle trop au train, y compris au bruit."
        ),
        fig("mlOverfittingBiasVariance", "Un modèle trop simple rate la tendance ; un modèle trop complexe suit le bruit ; le bon modèle cherche le compromis."),
        table(
          ["Cas", "Symptôme train", "Symptôme validation/test", "Action possible"],
          [
            ["Sous-apprentissage", "mauvais score", "mauvais score", "modèle plus riche, meilleures features, entraînement plus long"],
            ["Bon compromis", "bon score", "bon score proche du train", "conserver et vérifier la robustesse"],
            ["Sur-apprentissage", "excellent score", "score nettement plus faible", "régularisation, dropout, early stopping, plus de données"]
          ]
        ),
        paragraphs(
          "Les courbes d'apprentissage sont très utiles : si la perte train descend mais la perte validation remonte, le modèle commence probablement à sur-apprendre."
        )
      ),

      lesson(
        "Biais, variance et complexité",
        paragraphs(
          "Le compromis <strong>biais/variance</strong> donne une autre lecture. Un modèle à fort biais impose une forme trop simple : il sous-apprend. Un modèle à forte variance change beaucoup selon les exemples du train : il risque de sur-apprendre."
        ),
        table(
          ["Profil", "Intuition", "Erreur typique"],
          [
            ["Fort biais", "hypothèse trop rigide", "underfitting"],
            ["Forte variance", "modèle trop sensible aux exemples", "overfitting"],
            ["Bon compromis", "assez flexible sans suivre le bruit", "meilleure généralisation"]
          ]
        ),
        callout(
          "info",
          "Où se placent les réseaux profonds ?",
          "Les réseaux profonds ont beaucoup de capacité. Ils peuvent être excellents, mais ils demandent donc une vraie discipline : validation, régularisation, data augmentation, early stopping et métriques adaptées."
        )
      ),

      lesson(
        "Paramètres appris et hyperparamètres choisis",
        paragraphs(
          "Le vocabulaire est important. Les <strong>paramètres</strong> sont appris automatiquement pendant l'entraînement : poids d'un réseau, biais, coefficients d'un modèle linéaire, valeurs d'une table Q. Les <strong>hyperparamètres</strong> sont choisis par l'humain ou par une procédure de recherche avant ou autour de l'entraînement : profondeur, learning rate, taille de batch, nombre de folds, facteur d'actualisation, etc."
        ),
        table(
          ["Catégorie", "Exemples", "Qui les fixe ?", "Avec quel split ?"],
          [
            ["Paramètres appris", "poids <code>W</code>, biais <code>b</code>, filtres CNN, matrices RNN", "l'algorithme d'apprentissage", "train"],
            ["Hyperparamètres modèle", "nombre de couches, taille cachée, taille de filtre, dropout", "concepteur ou recherche d'hyperparamètres", "validation"],
            ["Hyperparamètres entraînement", "learning rate, batch size, epochs, optimiseur", "concepteur ou scheduler", "validation"],
            ["Évaluation finale", "score test final", "personne ne l'optimise", "test gardé intact"]
          ]
        ),
        callout(
          "success",
          "Raccourci mental",
          "Si la valeur change par gradient descent ou par une règle d'apprentissage pendant <code>fit</code>, c'est probablement un paramètre. Si tu dois la choisir avant de lancer l'expérience, c'est probablement un hyperparamètre."
        )
      ),

      lesson(
        "Data leakage : l'erreur qui fausse tout",
        paragraphs(
          "Une <strong>fuite de données</strong> arrive quand une information du test ou du futur se retrouve dans le train ou dans le choix du modèle. Le score devient artificiellement bon, puis s'effondre en conditions réelles."
        ),
        bullets([
          "normaliser les données avec moyenne/écart-type calculés sur tout le dataset au lieu du train uniquement",
          "faire de la sélection de features en utilisant le test",
          "mélanger des observations temporelles alors que le futur ne devrait pas être connu",
          "avoir le même patient, client ou document dans train et test sous deux formes proches"
        ]),
        code(
          "python",
          `
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler

# 1. On split d'abord
X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42,
    stratify=y
)

# 2. On ajuste le scaler seulement sur le train
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)

# 3. On applique la même transformation au test
# sans recalculer moyenne/écart-type sur le test
X_test_scaled = scaler.transform(X_test)
          `,
          "Prétraitement sans fuite de données"
        )
      ),

      lesson(
        "Prétraitements : transformer sans tricher",
        paragraphs(
          "Les données brutes entrent rarement directement dans un modèle. On normalise des variables numériques, on encode des catégories, on transforme du texte en tokens, on remplit parfois des valeurs manquantes. Ces étapes doivent être apprises sur le train puis appliquées telles quelles à la validation et au test."
        ),
        table(
          ["Prétraitement", "À apprendre sur train", "À appliquer sur validation/test", "Erreur fréquente"],
          [
            ["Standardisation", "moyenne et écart-type", "même moyenne, même écart-type", "recalculer la moyenne sur le test"],
            ["Encodage catégoriel", "vocabulaire des catégories", "même mapping", "laisser le test créer de nouvelles colonnes"],
            ["Imputation", "médiane, moyenne, valeur la plus fréquente", "même règle", "calculer la médiane sur tout le dataset"],
            ["Tokenisation NLP", "vocabulaire ou tokenizer", "même tokenizer", "adapter le vocabulaire sur le test"],
            ["Sélection de features", "features retenues", "mêmes colonnes", "choisir les features avec le score test"]
          ]
        ),
        code(
          "python",
          `
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OneHotEncoder, StandardScaler
from sklearn.impute import SimpleImputer
from sklearn.linear_model import LogisticRegression

numeric_features = ["age", "income"]
categorical_features = ["city", "segment"]

numeric_pipe = Pipeline([
    ("imputer", SimpleImputer(strategy="median")),
    ("scaler", StandardScaler())
])

categorical_pipe = Pipeline([
    ("imputer", SimpleImputer(strategy="most_frequent")),
    ("encoder", OneHotEncoder(handle_unknown="ignore"))
])

preprocess = ColumnTransformer([
    ("num", numeric_pipe, numeric_features),
    ("cat", categorical_pipe, categorical_features)
])

model = Pipeline([
    ("preprocess", preprocess),
    ("classifier", LogisticRegression(max_iter=1000))
])

# Le pipeline apprend les transformations sur X_train seulement.
model.fit(X_train, y_train)
score = model.score(X_valid, y_valid)
          `,
          "Pipeline scikit-learn pour éviter les fuites de prétraitement"
        )
      ),

      lesson(
        "Baselines et pipelines",
        paragraphs(
          "Un réflexe simple : toujours comparer ton modèle à une <strong>baseline</strong>. Si un modèle compliqué ne bat pas une règle naïve, il n'a pas encore justifié sa complexité."
        ),
        bullets([
          "classification : comparer à la classe majoritaire",
          "régression : comparer à la moyenne ou à la médiane",
          "série temporelle : comparer à la prédiction naïve « demain = aujourd'hui »",
          "pipeline : enchaîner proprement preprocessing, modèle et évaluation pour éviter les fuites"
        ]),
        callout(
          "success",
          "Réflexe d'ingénieur",
          "Un score isolé ne veut presque rien dire. Il faut savoir contre quoi on compare, sur quel split, avec quelle métrique, et avec quelle incertitude."
        )
      ),

      lesson(
        "Protocole minimal d'une expérience ML",
        paragraphs(
          "Un cours de deep learning peut vite donner envie de commencer par le modèle. En pratique, la bonne discipline commence avant : définir la cible, figer le split, choisir la métrique, poser une baseline, puis seulement entraîner un modèle plus ambitieux."
        ),
        code(
          "text",
          `
1. Définir la cible y et les features X disponibles au moment de prédiction.
2. Nettoyer les doublons évidents et documenter les valeurs manquantes.
3. Séparer train / validation / test, avec stratification ou split temporel si nécessaire.
4. Construire une baseline simple.
5. Entraîner un premier modèle simple.
6. Observer train vs validation : underfitting, bon compromis ou overfitting.
7. Régler les hyperparamètres sur validation uniquement.
8. Mesurer le score final sur test une seule fois.
9. Rapporter la métrique, le split, la baseline et les limites connues.
          `,
          "Checklist d'expérience propre"
        ),
        callout(
          "info",
          "Pourquoi cette discipline compte",
          "Un modèle moyen évalué proprement vaut mieux qu'un modèle impressionnant évalué avec fuite de données. Le premier permet de progresser ; le second donne une illusion de performance."
        )
      )
    ].join(""),

    checklist: [
      "Je peux expliquer features, labels, classification et régression.",
      "Je sais à quoi servent train, validation et test.",
      "Je sais distinguer supervisé, non supervisé, auto-supervisé et renforcement.",
      "Je sais citer des problèmes de qualité de données à vérifier avant l'entraînement.",
      "Je peux reconnaître underfitting et overfitting sur des scores train/validation.",
      "Je sais expliquer le compromis biais/variance.",
      "Je sais distinguer paramètres appris et hyperparamètres choisis.",
      "Je peux citer au moins trois formes de data leakage.",
      "Je pense à comparer à une baseline simple.",
      "Je sais écrire un protocole expérimental minimal sans toucher au test."
    ],

    quiz: [
      {
        question: "Le vrai objectif d'un modèle de ML est surtout de :",
        options: [
          "mémoriser parfaitement le train",
          "généraliser sur des exemples nouveaux",
          "maximiser uniquement le nombre de paramètres",
          "utiliser forcément un réseau profond"
        ],
        answer: 1,
        explanation: "Le train sert à apprendre, mais l'objectif est la performance sur des données jamais vues."
      },
      {
        question: "Un modèle avec très bon score train mais mauvais score validation souffre probablement de :",
        options: [
          "sur-apprentissage",
          "sous-apprentissage",
          "absence de label",
          "normalisation parfaite"
        ],
        answer: 0,
        explanation: "Il a trop collé au train et généralise mal."
      },
      {
        question: "Pour éviter une fuite de données lors d'une standardisation, il faut :",
        options: [
          "ajuster le scaler sur tout le dataset",
          "ajuster le scaler sur le train puis transformer validation/test",
          "ajuster le scaler sur le test seulement",
          "ne jamais standardiser"
        ],
        answer: 1,
        explanation: "Les statistiques de normalisation doivent venir du train uniquement."
      },
      {
        question: "Le learning rate d'un réseau est plutôt :",
        options: [
          "un paramètre appris sur le train",
          "un hyperparamètre choisi avant ou pendant la recherche",
          "un label",
          "une métrique de test"
        ],
        answer: 1,
        explanation: "Le learning rate contrôle l'entraînement : il n'est pas appris comme un poids du modèle."
      },
      {
        question: "Dans un problème auto-supervisé, les labels sont généralement :",
        options: [
          "toujours fournis par un humain",
          "fabriqués à partir des données elles-mêmes",
          "remplacés par un reward",
          "interdits"
        ],
        answer: 1,
        explanation: "Par exemple, prédire un mot masqué crée une cible à partir du texte lui-même."
      }
    ],

    exercises: [
      {
        title: "Diagnostiquer un modèle",
        difficulty: "Facile",
        time: "10 min",
        prompt: "On obtient accuracy train = 99 % et accuracy validation = 72 %. Diagnose le problème et propose trois corrections.",
        deliverables: [
          "diagnostic",
          "trois corrections possibles",
          "une phrase sur la généralisation"
        ]
      },
      {
        title: "Trouver la fuite",
        difficulty: "Intermédiaire",
        time: "15 min",
        prompt: "Liste trois scénarios de data leakage possibles dans un projet médical ou financier, puis explique comment les éviter.",
        deliverables: [
          "trois fuites possibles",
          "une correction pour chacune",
          "une règle générale"
        ]
      },
      {
        title: "Paramètre ou hyperparamètre ?",
        difficulty: "Facile",
        time: "10 min",
        prompt: "Classe les éléments suivants : poids d'une couche Dense, nombre de filtres d'une convolution, learning rate, biais d'un neurone, taille de batch, vocabulaire d'un tokenizer, valeur Q(s,a) tabulaire.",
        deliverables: [
          "tableau paramètre / hyperparamètre / état appris du prétraitement",
          "une justification courte pour chaque élément"
        ]
      },
      {
        title: "Protocole propre",
        difficulty: "Intermédiaire",
        time: "20 min",
        prompt: "Tu dois prédire si un client va résilier son abonnement. Propose un protocole complet : cible, features autorisées, split, baseline, métrique, risque de leakage et test final.",
        deliverables: [
          "définition de la cible",
          "stratégie de split",
          "baseline",
          "métrique principale",
          "au moins deux risques de fuite"
        ]
      }
    ],

    keywords: [
      "machine learning",
      "dataset",
      "features",
      "label",
      "supervisé",
      "non supervisé",
      "auto-supervisé",
      "généralisation",
      "overfitting",
      "underfitting",
      "biais variance",
      "data leakage",
      "baseline",
      "pipeline",
      "qualité des données",
      "paramètres",
      "hyperparamètres"
    ]
  }
});
})(window);
