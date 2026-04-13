(function registerChapterBundleMl00b(globalScope) {
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
  order: 0.2,
  chapter: {
    id: "ml-evaluation-validation",
    shortTitle: "Évaluer ML",
    title: "Évaluer un modèle : cross-validation, F1-score et métriques",
    level: "Fondations",
    duration: "2 h 35",
    track: "IA0",
    summary:
      "Ce chapitre donne les réflexes d'évaluation indispensables : hold-out, validation croisée, stratification, GroupKFold, time series split, nested cross-validation, matrice de confusion, accuracy, balanced accuracy, précision, rappel, F1-score, ROC-AUC, PR-AUC, métriques de régression, seuil de décision, reporting et classes déséquilibrées.",
    goals: [
      "distinguer hold-out, validation simple et cross-validation",
      "comprendre la validation croisée k-fold et la stratification",
      "choisir un split adapté aux groupes et aux séries temporelles",
      "comprendre le rôle de la nested cross-validation quand on fait du tuning",
      "lire une matrice de confusion binaire",
      "calculer accuracy, précision, recall et F1-score",
      "distinguer les moyennes micro, macro et weighted en multi-classes",
      "choisir une métrique adaptée aux classes déséquilibrées",
      "connaître les métriques de régression MAE, MSE, RMSE et R²",
      "comprendre l'effet d'un seuil de décision",
      "rapporter proprement une évaluation avec baseline, moyenne et écart-type"
    ],
    highlights: [
      "cross-validation",
      "matrice de confusion",
      "precision",
      "recall",
      "F1-score",
      "macro average",
      "ROC-AUC"
    ],
    body: [
      lesson(
        "Hold-out et cross-validation",
        paragraphs(
          "Le <strong>hold-out</strong> consiste à faire un découpage fixe, par exemple train/validation/test. C'est simple et rapide, mais le score peut dépendre du découpage choisi. La <strong>cross-validation</strong> réduit cette dépendance en répétant l'évaluation sur plusieurs découpages."
        ),
        fig("mlCrossValidationFolds", "En k-fold, chaque bloc joue une fois le rôle de validation, puis on moyenne les scores."),
        bullets([
          "<strong>k-fold</strong> : diviser les données en k blocs, entraîner k fois, valider sur un bloc différent à chaque tour",
          "<strong>stratified k-fold</strong> : garder à peu près les mêmes proportions de classes dans chaque fold",
          "<strong>time series split</strong> : pour les séries temporelles, respecter l'ordre du temps au lieu de mélanger le futur dans le passé"
        ]),
        callout(
          "warn",
          "Pas de shuffle aveugle en série temporelle",
          "Si tu prédis demain avec des données d'hier, le split doit respecter le temps. Mélanger les lignes peut injecter du futur dans le train."
        )
      ),

      lesson(
        "Choisir le bon split : stratifié, groupé ou temporel",
        paragraphs(
          "Le split n'est pas un détail technique : il définit ce que ton score veut dire. Un split aléatoire classique convient si les exemples sont indépendants et identiquement distribués. Mais dès qu'il existe des groupes, du temps, ou des doublons proches, il faut adapter la validation."
        ),
        table(
          ["Situation", "Split adapté", "Pourquoi"],
          [
            ["Classes équilibrées, exemples indépendants", "train/validation/test aléatoire", "simple et suffisant pour un premier protocole"],
            ["Classes déséquilibrées", "stratified split / stratified k-fold", "conserve les proportions de classes"],
            ["Plusieurs lignes par patient/client/document", "GroupKFold ou split par groupe", "évite que le même individu apparaisse en train et validation"],
            ["Série temporelle", "time series split", "empêche le futur d'aider à prédire le passé"],
            ["Très petit dataset", "k-fold ou repeated k-fold", "utilise mieux les données et réduit la variance du score"]
          ]
        ),
        callout(
          "warn",
          "Le split doit imiter l'usage réel",
          "Si le modèle sera utilisé sur de nouveaux clients, il faut valider sur des clients absents du train. Si le modèle sera utilisé demain, il faut valider sur le futur, pas sur un mélange aléatoire du passé et du futur."
        )
      ),

      lesson(
        "Nested cross-validation : quand on règle des hyperparamètres",
        paragraphs(
          "Une validation croisée simple sert à estimer un score. Mais si on teste beaucoup d'hyperparamètres et qu'on garde la meilleure configuration, on optimise déjà le score de validation. Pour estimer honnêtement la performance d'une procédure complète de tuning, on utilise une <strong>nested cross-validation</strong> : une boucle interne choisit les hyperparamètres, une boucle externe estime la performance."
        ),
        table(
          ["Niveau", "Rôle", "Ce qu'on y fait"],
          [
            ["Boucle interne", "sélection de modèle", "tester learning rate, régularisation, profondeur, etc."],
            ["Boucle externe", "estimation de performance", "évaluer la configuration choisie par la boucle interne"],
            ["Test final", "annonce finale si disponible", "mesurer une seule fois après tous les choix"]
          ]
        ),
        bullets([
          "<strong>validation simple</strong> : rapide, suffisante pour beaucoup de TD et prototypes",
          "<strong>k-fold</strong> : score plus robuste quand le dataset est petit",
          "<strong>nested CV</strong> : plus coûteuse, mais plus honnête quand la recherche d'hyperparamètres est large"
        ]),
        callout(
          "info",
          "À retenir pour l'examen",
          "Si tu utilises le même score de cross-validation pour choisir les hyperparamètres et annoncer la performance finale, ton estimation peut devenir trop optimiste."
        )
      ),

      lesson(
        "Matrice de confusion",
        paragraphs(
          "Pour une classification binaire, la matrice de confusion croise les vraies classes et les classes prédites. Elle permet de savoir quel type d'erreur le modèle fait : faux positif ou faux négatif."
        ),
        fig("mlConfusionMetrics", "TP, FP, FN, TN sont la base de la plupart des métriques de classification."),
        table(
          ["Case", "Nom", "Sens"],
          [
            ["TP", "vrai positif", "réel positif, prédit positif"],
            ["TN", "vrai négatif", "réel négatif, prédit négatif"],
            ["FP", "faux positif", "réel négatif, prédit positif"],
            ["FN", "faux négatif", "réel positif, prédit négatif"]
          ]
        )
      ),

      lesson(
        "Accuracy, précision, recall, F1-score",
        paragraphs(
          "L'<strong>accuracy</strong> mesure la proportion totale de bonnes prédictions. Elle est intuitive, mais peut être trompeuse si les classes sont déséquilibrées. Exemple : si 99 % des emails ne sont pas du spam, un modèle qui prédit toujours « non-spam » a 99 % d'accuracy, mais il est inutile pour détecter le spam."
        ),
        formula(
          `<span class="fn">Accuracy</span> <span class="op">=</span> <span class="fraction"><span class="num">TP + TN</span><span class="den">TP + TN + FP + FN</span></span>`,
          { caption: "Score global de bonnes réponses." }
        ),
        formula(
          `<span class="fn">Precision</span> <span class="op">=</span> <span class="fraction"><span class="num">TP</span><span class="den">TP + FP</span></span>`,
          { caption: "Parmi les prédictions positives, combien sont vraiment positives ?" }
        ),
        formula(
          `<span class="fn">Recall</span> <span class="op">=</span> <span class="fraction"><span class="num">TP</span><span class="den">TP + FN</span></span>`,
          { caption: "Parmi les vrais positifs, combien le modèle en retrouve ?" }
        ),
        formula(
          `<span class="fn">F1</span> <span class="op">=</span> 2 × <span class="fraction"><span class="num">Precision × Recall</span><span class="den">Precision + Recall</span></span>`,
          { caption: "Moyenne harmonique de la précision et du rappel." }
        ),
        table(
          ["Métrique", "Quand elle est utile"],
          [
            ["Accuracy", "classes équilibrées et coût d'erreur similaire"],
            ["Precision", "quand les faux positifs coûtent cher"],
            ["Recall", "quand les faux négatifs coûtent cher"],
            ["F1-score", "quand on veut équilibrer precision et recall"]
          ]
        )
      ),

      lesson(
        "Multi-classes : micro, macro, weighted",
        paragraphs(
          "En multi-classes, on peut calculer précision, recall et F1 pour chaque classe, puis les moyenner. La manière de moyenner change l'interprétation du score, surtout quand les classes sont déséquilibrées."
        ),
        table(
          ["Moyenne", "Principe", "Lecture"],
          [
            ["Macro", "moyenne simple des scores par classe", "chaque classe compte autant, même si elle est rare"],
            ["Weighted", "moyenne pondérée par le nombre d'exemples de chaque classe", "les classes fréquentes pèsent davantage"],
            ["Micro", "agrège tous les TP/FP/FN avant de calculer le score", "donne plus de poids au comportement global"],
            ["Balanced accuracy", "moyenne des recalls par classe", "utile quand l'accuracy brute favorise la classe majoritaire"]
          ]
        ),
        callout(
          "success",
          "Bon réflexe",
          "Sur un dataset déséquilibré, regarde au minimum la matrice de confusion et le F1 macro. L'accuracy seule peut cacher qu'une classe rare est totalement ignorée."
        )
      ),

      lesson(
        "Seuil de décision, ROC-AUC et PR-AUC",
        paragraphs(
          "Beaucoup de classifieurs produisent une probabilité, pas directement une classe. Le <strong>seuil de décision</strong> transforme cette probabilité en classe. Par défaut, on prend souvent 0.5, mais ce n'est pas toujours le meilleur choix."
        ),
        bullets([
          "baisser le seuil augmente souvent le recall, mais peut augmenter les faux positifs",
          "monter le seuil augmente souvent la précision, mais peut rater plus de vrais positifs",
          "ROC-AUC mesure la capacité de classement sur tous les seuils avec taux de vrais positifs et taux de faux positifs",
          "PR-AUC est souvent plus informative que ROC-AUC quand la classe positive est rare"
        ]),
        callout(
          "info",
          "Exemple concret",
          "Pour un dépistage médical, on préfère souvent un recall élevé : rater un vrai malade coûte cher. Pour un système d'alerte qui déclenche une intervention coûteuse, la précision peut devenir prioritaire."
        )
      ),

      lesson(
        "Seuil, coût métier et calibration",
        paragraphs(
          "Le seuil de décision doit être relié au coût réel des erreurs. Une probabilité de 0.3 peut être suffisante pour déclencher une vérification manuelle peu coûteuse, mais insuffisante pour bloquer automatiquement un compte client. On peut donc chercher le seuil qui optimise une métrique ou qui respecte une contrainte métier."
        ),
        table(
          ["Choix", "Effet habituel", "Exemple"],
          [
            ["Seuil plus bas", "plus de positifs prédits, recall plus haut", "dépistage : on préfère revoir trop de cas que rater un malade"],
            ["Seuil plus haut", "moins de positifs prédits, precision plus haute", "intervention coûteuse : on veut éviter les fausses alertes"],
            ["Seuil optimisé F1", "compromis precision/recall", "détection où FP et FN ont des coûts proches"],
            ["Seuil sous contrainte", "ex. recall ≥ 95 % puis precision maximale", "fraude, sécurité, santé"]
          ]
        ),
        paragraphs(
          "La <strong>calibration</strong> pose une autre question : quand le modèle annonce 0.8, est-ce que l'événement arrive vraiment environ 80 % du temps ? Un modèle peut bien classer les exemples (bonne AUC) tout en produisant des probabilités mal calibrées."
        ),
        callout(
          "warn",
          "Ne pas confondre score et probabilité fiable",
          "Une sortie élevée peut très bien être un bon score de classement sans être une probabilité bien calibrée. Pour prendre une décision risquée, il faut vérifier la calibration."
        )
      ),

      lesson(
        "Métriques de régression",
        paragraphs(
          "En régression, la sortie est une valeur continue. On ne parle donc pas de TP/FP/FN/TN. Les métriques mesurent la distance entre la prédiction et la valeur réelle."
        ),
        table(
          ["Métrique", "Formule ou intuition", "Lecture"],
          [
            ["MAE", "moyenne des erreurs absolues", "facile à lire dans l'unité de y"],
            ["MSE", "moyenne des erreurs au carré", "punit fortement les grosses erreurs"],
            ["RMSE", "racine de MSE", "revient dans l'unité de y"],
            ["R²", "part de variance expliquée", "comparaison au modèle qui prédit la moyenne"]
          ]
        ),
        callout(
          "warn",
          "Attention à l'unité",
          "Une MAE de 2000 n'a aucun sens seule : il faut savoir si on prédit des euros, des mètres, des secondes, ou une quantité normalisée."
        )
      ),

      lesson(
        "Régression : regarder aussi les résidus",
        paragraphs(
          "Une métrique moyenne peut cacher des erreurs structurées. En régression, on regarde souvent les <strong>résidus</strong>, c'est-à-dire <code>y_true - y_pred</code>. Si les résidus sont beaucoup plus grands pour certaines valeurs, certains groupes ou certaines périodes, le modèle n'est pas uniformément fiable."
        ),
        table(
          ["Observation sur les résidus", "Interprétation possible", "Action"],
          [
            ["erreurs très grandes sur quelques points", "outliers ou données bruitées", "inspecter les cas, comparer MAE et RMSE"],
            ["erreurs qui augmentent avec la cible", "variance non constante", "transformer la cible, changer de modèle ou pondérer"],
            ["erreurs positives sur un groupe", "biais systématique", "ajouter features, auditer le split, vérifier représentativité"],
            ["bon score moyen, mauvais cas critiques", "métrique mal alignée avec le risque", "choisir une métrique métier ou par segment"]
          ]
        ),
        callout(
          "info",
          "MAE vs RMSE en une phrase",
          "La MAE décrit l'erreur moyenne typique ; la RMSE crie plus fort quand il existe quelques grosses erreurs."
        )
      ),

      lesson(
        "Code minimal d'évaluation",
        paragraphs(
          "Voici un bloc minimal à connaître avec scikit-learn. Le point important n'est pas la bibliothèque, mais la lecture des métriques."
        ),
        code(
          "python",
          `
from sklearn.metrics import (
    accuracy_score,
    precision_score,
    recall_score,
    f1_score,
    confusion_matrix,
    classification_report,
    roc_auc_score
)

# y_true : vraies classes 0/1
# y_pred : classes prédites 0/1
# y_proba : probabilité prédite pour la classe positive

print("Accuracy :", accuracy_score(y_true, y_pred))
print("Precision :", precision_score(y_true, y_pred))
print("Recall :", recall_score(y_true, y_pred))
print("F1 :", f1_score(y_true, y_pred))
print("Matrice de confusion :")
print(confusion_matrix(y_true, y_pred))

# ROC-AUC se calcule avec les scores/probas, pas les classes dures
print("ROC-AUC :", roc_auc_score(y_true, y_proba))

print(classification_report(y_true, y_pred))
          `,
          "Évaluer une classification binaire"
        )
      ),

      lesson(
        "Code minimal de cross-validation",
        paragraphs(
          "Voici un exemple simple pour obtenir un score moyen et un écart-type. Dans un vrai projet, le modèle devrait idéalement être un pipeline complet avec prétraitement inclus, pour que chaque fold apprenne ses transformations uniquement sur son train local."
        ),
        code(
          "python",
          `
from sklearn.model_selection import StratifiedKFold, cross_validate
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression

model = Pipeline([
    ("scaler", StandardScaler()),
    ("classifier", LogisticRegression(max_iter=1000))
])

cv = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)

scores = cross_validate(
    model,
    X,
    y,
    cv=cv,
    scoring=["accuracy", "f1_macro", "roc_auc"],
    return_train_score=True
)

for name in ["test_accuracy", "test_f1_macro", "test_roc_auc"]:
    mean = scores[name].mean()
    std = scores[name].std()
    print(f"{name}: {mean:.3f} ± {std:.3f}")
          `,
          "Cross-validation stratifiée avec pipeline"
        ),
        callout(
          "success",
          "Pourquoi le pipeline est dans la CV",
          "Le scaler est réappris à l'intérieur de chaque fold sur le train du fold. C'est exactement ce qui évite une fuite de prétraitement."
        )
      ),

      lesson(
        "Choisir une métrique avant d'entraîner",
        paragraphs(
          "Un piège classique consiste à entraîner un modèle, regarder beaucoup de métriques, puis choisir celle qui raconte la meilleure histoire. En pratique, il faut choisir la métrique principale <strong>avant</strong> l'expérience, en fonction du coût réel des erreurs."
        ),
        table(
          ["Situation", "Métrique souvent pertinente"],
          [
            ["classes équilibrées", "accuracy + matrice de confusion"],
            ["classe positive rare", "F1, PR-AUC, recall/precision"],
            ["faux négatifs très coûteux", "recall prioritaire"],
            ["faux positifs très coûteux", "precision prioritaire"],
            ["régression avec grosses erreurs critiques", "RMSE ou MSE"],
            ["régression robuste aux outliers", "MAE"]
          ]
        )
      ),

      lesson(
        "Reporter une évaluation proprement",
        paragraphs(
          "Une évaluation utile doit être reproductible et lisible. Dire « mon modèle fait 92 % » ne suffit pas : 92 % de quoi, sur quel split, avec quelle baseline, quelle variance, quelles classes, quel seuil ?"
        ),
        table(
          ["Élément à rapporter", "Pourquoi"],
          [
            ["dataset et taille des splits", "savoir combien d'exemples soutiennent le score"],
            ["stratégie de split", "savoir si le protocole respecte groupes, temps et stratification"],
            ["baseline", "savoir si le modèle apporte vraiment quelque chose"],
            ["métrique principale choisie avant", "éviter de choisir après coup le score flatteur"],
            ["moyenne ± écart-type en CV", "donner une idée de la stabilité"],
            ["matrice de confusion ou scores par classe", "voir où le modèle échoue"],
            ["seuil utilisé", "rendre les résultats de classification reproductibles"],
            ["limites connues", "ne pas transformer un score en promesse abusive"]
          ]
        ),
        callout(
          "info",
          "Phrase modèle",
          "« Sur un test groupé de 2 000 exemples jamais vus, le modèle obtient F1 macro = 0.81 contre 0.54 pour la baseline, avec un recall de 0.76 sur la classe rare. »"
        )
      )
    ].join(""),

    checklist: [
      "Je peux expliquer la validation croisée k-fold.",
      "Je sais choisir entre split stratifié, groupé et temporel.",
      "Je comprends pourquoi la nested CV peut être nécessaire quand on règle beaucoup d'hyperparamètres.",
      "Je sais lire TP, FP, FN et TN dans une matrice de confusion.",
      "Je peux calculer accuracy, precision, recall et F1-score.",
      "Je sais distinguer F1 macro, micro et weighted.",
      "Je sais pourquoi l'accuracy est dangereuse sur classes déséquilibrées.",
      "Je connais l'effet d'un seuil de décision.",
      "Je sais choisir une métrique de régression adaptée.",
      "Je sais rédiger un reporting court avec baseline, split, métrique et limite."
    ],

    quiz: [
      {
        question: "Le recall répond à la question :",
        options: [
          "Parmi les prédictions positives, combien sont correctes ?",
          "Parmi les vrais positifs, combien le modèle retrouve-t-il ?",
          "Quelle part de variance est expliquée ?",
          "Combien de folds sont utilisés ?"
        ],
        answer: 1,
        explanation: "Recall = TP / (TP + FN)."
      },
      {
        question: "Le F1-score est particulièrement utile quand :",
        options: [
          "on veut équilibrer précision et recall",
          "on fait uniquement de la régression",
          "les données n'ont pas de labels",
          "on veut ignorer les faux négatifs"
        ],
        answer: 0,
        explanation: "F1 est la moyenne harmonique de la précision et du rappel."
      },
      {
        question: "Pourquoi l'accuracy peut être trompeuse sur classes déséquilibrées ?",
        options: [
          "Parce qu'elle ne marche jamais",
          "Parce qu'un modèle peut prédire seulement la classe majoritaire et obtenir un score élevé",
          "Parce qu'elle exige un réseau profond",
          "Parce qu'elle ne dépend pas des prédictions"
        ],
        answer: 1,
        explanation: "Si une classe domine, prédire toujours cette classe peut donner une bonne accuracy mais un modèle inutile."
      },
      {
        question: "En multi-classes déséquilibré, le F1 macro est utile parce que :",
        options: [
          "il donne le même poids à chaque classe",
          "il ignore les classes rares",
          "il remplace le split train/test",
          "il est identique à l'accuracy"
        ],
        answer: 0,
        explanation: "Le F1 macro moyenne les scores par classe sans pondérer par la fréquence de la classe."
      },
      {
        question: "Si plusieurs lignes appartiennent au même patient, le split le plus prudent est souvent :",
        options: [
          "un split aléatoire ligne par ligne",
          "un split par groupe pour garder un patient dans un seul split",
          "un split qui met tous les patients en train",
          "aucun split"
        ],
        answer: 1,
        explanation: "Sinon le modèle peut voir un patient en train et être évalué sur le même patient en test, ce qui gonfle le score."
      },
      {
        question: "La nested cross-validation sert surtout à :",
        options: [
          "remplacer les labels",
          "estimer honnêtement une procédure qui règle des hyperparamètres",
          "calculer une matrice de confusion sans prédictions",
          "augmenter artificiellement le dataset"
        ],
        answer: 1,
        explanation: "La boucle interne sélectionne les hyperparamètres, la boucle externe estime la performance de cette sélection."
      }
    ],

    exercises: [
      {
        title: "Calculer F1",
        difficulty: "Facile",
        time: "10 min",
        prompt: "On a TP=40, FP=10, FN=20, TN=130. Calcule precision, recall, F1 et accuracy.",
        deliverables: [
          "precision",
          "recall",
          "F1-score",
          "accuracy"
        ]
      },
      {
        title: "Choisir la métrique",
        difficulty: "Intermédiaire",
        time: "15 min",
        prompt: "Pour un modèle de détection de fraude avec très peu de fraudes, explique pourquoi l'accuracy seule ne suffit pas et propose deux métriques plus adaptées.",
        deliverables: [
          "critique de l'accuracy",
          "deux métriques adaptées",
          "une phrase sur le coût des faux positifs/faux négatifs"
        ]
      },
      {
        title: "Macro ou weighted ?",
        difficulty: "Intermédiaire",
        time: "15 min",
        prompt: "Un dataset contient 900 exemples de classe A, 90 de classe B et 10 de classe C. Explique pourquoi il faut regarder F1 macro en plus de F1 weighted.",
        deliverables: [
          "différence macro / weighted",
          "risque sur la classe C",
          "métriques à reporter"
        ]
      },
      {
        title: "Choisir le split",
        difficulty: "Intermédiaire",
        time: "20 min",
        prompt: "Pour chaque cas, propose un split : prédiction de ventes futures, classification d'images avec plusieurs images par patient, classification spam avec classes déséquilibrées.",
        deliverables: [
          "split temporel pour les ventes",
          "split par groupe pour les patients",
          "split stratifié pour le spam",
          "justification courte"
        ]
      },
      {
        title: "Reporting propre",
        difficulty: "Avancé",
        time: "25 min",
        prompt: "Rédige un paragraphe de résultat pour un modèle de détection de fraude : dataset, split, baseline, métrique principale, score, seuil et limite connue.",
        deliverables: [
          "paragraphe de 5 à 7 lignes",
          "mention de la baseline",
          "mention du seuil",
          "au moins une limite"
        ]
      }
    ],

    keywords: [
      "cross-validation",
      "k-fold",
      "stratification",
      "matrice de confusion",
      "accuracy",
      "precision",
      "recall",
      "F1-score",
      "F1 macro",
      "balanced accuracy",
      "GroupKFold",
      "nested cross-validation",
      "ROC-AUC",
      "PR-AUC",
      "MAE",
      "RMSE"
    ]
  }
});
})(window);
