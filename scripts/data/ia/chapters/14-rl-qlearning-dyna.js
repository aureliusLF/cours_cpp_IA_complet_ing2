(function registerChapterBundle14(globalScope) {
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
  order: 14,
  chapter: {
    id: "rl-qlearning-dyna",
    shortTitle: "Q-Learning",
    title: "Model-based, Dyna et Q-Learning",
    level: "Intermédiaire",
    duration: "2 h",
    track: "IA3",
    summary:
      "On termine la séquence AR par le passage du planning au vrai apprentissage : que faire quand le modèle T et R n'est pas connu ? Le chapitre distingue model-based, model-free, introduit Dyna, puis détaille Q-Learning, ε-greedy, la mise à jour TD, le facteur d'apprentissage et les conditions de convergence.",
    goals: [
      "distinguer méthodes model-based et model-free",
      "décrire le principe de Dyna comme combinaison modèle + mises à jour simulées",
      "définir Q*(s,a) comme valeur optimale d'un couple état-action",
      "déduire V*(s) et π*(s) à partir de Q*(s,a)",
      "expliquer le compromis exploration/exploitation via ε-greedy",
      "interpréter la mise à jour Q-Learning avec α, γ, cible TD et erreur TD",
      "résumer les conditions de convergence déterministes et stochastiques"
    ],
    highlights: [
      "model-free",
      "Dyna",
      "Q-Learning",
      "epsilon-greedy",
      "TD error",
      "alpha"
    ],
    body: [
      lesson(
        "Du modèle connu au modèle inconnu",
        paragraphs(
          "Value Iteration et Policy Iteration supposent que l'on connaît déjà <code>T(s,a,s')</code> et <code>R(s,a)</code>. Or l'apprentissage par renforcement réel commence souvent justement quand ce modèle n'est pas connu. L'agent doit interagir avec l'environnement pour apprendre ce qui se passe."
        ),
        fig("rlModelBasedFreeDyna", "Model-based apprend ou utilise un modèle ; model-free apprend directement une fonction utile pour agir ; Dyna mélange les deux."),
        table(
          ["Famille", "Principe", "Exemple"],
          [
            ["Model-based", "estimer un modèle <code>T̂, R̂</code> puis planifier", "Dyna, Value Iteration sur modèle appris"],
            ["Model-free", "apprendre directement une stratégie ou une fonction de valeur sans modèle explicite", "Q-Learning"]
          ]
        ),
        callout(
          "info",
          "Apprentissage indirect vs direct",
          "Model-based = apprentissage indirect : on apprend le monde puis on calcule. Model-free = apprentissage direct : on apprend directement quoi faire ou quelle action vaut quoi."
        )
      ),

      lesson(
        "Dyna : apprendre un modèle et l'utiliser tout de suite",
        paragraphs(
          "L'algorithme <strong>Dyna</strong> est une méthode model-based qui imbrique l'estimation du modèle et l'optimisation de la stratégie. Chaque vraie interaction fournit un quadruplet <code>(s, a, s', r)</code>. Dyna l'utilise pour mettre à jour son modèle, puis effectue aussi des mises à jour simulées sur d'autres couples état-action."
        ),
        code(
          "text",
          `
À chaque vraie transition (s, a, s', r) :

1. Mettre à jour le modèle estimé T̂ et R̂

2. Mettre à jour Q(s,a) avec le modèle courant :
   Q(s,a) = R̂(s,a) + γ Σ_s' T̂(s,a,s') max_a' Q(s',a')

3. Choisir k autres couples (s_i, a_i) au hasard
   et faire k mises à jour simulées

4. Choisir une nouvelle action en s' et continuer
          `,
          "Idée de Dyna"
        ),
        paragraphs(
          "L'intérêt de Dyna est de rentabiliser chaque expérience réelle. Une transition réellement observée sert non seulement à corriger le modèle, mais aussi à déclencher plusieurs petits raisonnements internes."
        )
      ),

      lesson(
        "La fonction Q",
        paragraphs(
          "Le <strong>Q-Learning</strong> ne cherche pas directement la valeur d'un état seul. Il apprend la qualité d'un couple <strong>état-action</strong>. <code>Q*(s,a)</code> représente la récompense cumulée moyenne lorsque l'agent est dans <code>s</code>, exécute <code>a</code>, puis se comporte de manière optimale."
        ),
        formula(
          `<var>Q</var><sup>*</sup>(<var>s</var>, <var>a</var>) <span class="op">=</span> <var>R</var>(<var>s</var>, <var>a</var>) <span class="op">+</span> γ <span class="sum">∑</span><span class="sum-limits"><span class="top"><var>s'</var></span><span class="bot"></span></span> <var>T</var>(<var>s</var>, <var>a</var>, <var>s'</var>) <span class="max">max</span><sub><var>a'</var></sub> <var>Q</var><sup>*</sup>(<var>s'</var>, <var>a'</var>)`,
          { caption: "Équation optimale sur les couples état-action." }
        ),
        formula(
          `<var>V</var><sup>*</sup>(<var>s</var>) <span class="op">=</span> <span class="max">max</span><sub><var>a</var></sub> <var>Q</var><sup>*</sup>(<var>s</var>, <var>a</var>)`,
          { caption: "La valeur optimale d'un état se déduit de la meilleure action disponible." }
        ),
        formula(
          `π<sup>*</sup>(<var>s</var>) <span class="op">=</span> <span class="argmax">argmax</span><sub><var>a</var></sub> <var>Q</var><sup>*</sup>(<var>s</var>, <var>a</var>)`,
          { caption: "La stratégie optimale choisit l'action avec la plus grande valeur Q." }
        ),
        callout(
          "success",
          "Pourquoi Q est pratique",
          "Si on connaît Q(s,a), on n'a plus besoin de connaître explicitement T et R pour choisir une action : on prend simplement l'action dont Q est maximal."
        )
      ),

      lesson(
        "Exploration contre exploitation",
        paragraphs(
          "À chaque étape, l'agent doit choisir une action. Il peut <strong>exploiter</strong> ce qu'il sait déjà en prenant l'action de plus grande valeur Q, ou <strong>explorer</strong> en testant une action au hasard pour apprendre quelque chose de nouveau."
        ),
        fig("rlQLearningUpdate", "ε-greedy décide entre l'action actuellement meilleure et une action aléatoire ; la mise à jour Q corrige ensuite l'estimation."),
        table(
          ["Choix", "Probabilité", "Intuition"],
          [
            ["Exploitation", "<code>1 − ε</code>", "choisir l'action avec la plus grande valeur Q"],
            ["Exploration", "<code>ε</code>", "choisir une action au hasard"]
          ]
        ),
        paragraphs(
          "Cette stratégie s'appelle <strong>ε-greedy</strong>. Au début, on choisit souvent un <code>ε</code> assez grand pour explorer. Puis on peut le diminuer progressivement afin d'exploiter davantage ce que l'agent a appris."
        )
      ),

      lesson(
        "Mise à jour Q-Learning",
        paragraphs(
          "L'algorithme Q-Learning apprend progressivement la fonction Q. À chaque transition, l'agent observe <code>s</code>, choisit <code>a</code>, reçoit <code>r</code>, observe <code>s'</code>, puis met à jour <code>Q(s,a)</code>."
        ),
        formula(
          `<var>Q</var>(<var>s</var>, <var>a</var>) <span class="op">←</span> <var>Q</var>(<var>s</var>, <var>a</var>) <span class="op">+</span> α(<var>r</var> <span class="op">+</span> γ <span class="max">max</span><sub><var>a'</var></sub><var>Q</var>(<var>s'</var>, <var>a'</var>) <span class="op">−</span> <var>Q</var>(<var>s</var>, <var>a</var>))`,
          { caption: "Règle de mise à jour Q-Learning." }
        ),
        formula(
          `<span class="target">cible TD</span> <span class="op">=</span> <var>r</var> <span class="op">+</span> γ <span class="max">max</span><sub><var>a'</var></sub> <var>Q</var>(<var>s'</var>, <var>a'</var>)`,
          { caption: "La cible combine reward immédiat et meilleure valeur estimée dans le nouvel état." }
        ),
        formula(
          `<span class="target">erreur TD</span> <span class="op">=</span> <span class="target">cible TD</span> <span class="op">−</span> <var>Q</var>(<var>s</var>, <var>a</var>)`,
          { caption: "On corrige Q(s,a) dans la direction de cette erreur." }
        ),
        paragraphs(
          "Le paramètre <code>α</code>, compris entre 0 et 1, est le <strong>facteur d'apprentissage</strong>. Si <code>α</code> est proche de 1, les observations récentes pèsent beaucoup. Si <code>α</code> est proche de 0, l'agent modifie lentement ses estimations."
        ),
        callout(
          "info",
          "Off-policy",
          "Le Q-Learning est classiquement une méthode <strong>off-policy</strong> : la mise à jour utilise <code>max_a' Q(s',a')</code>, c'est-à-dire la meilleure action estimée, même si l'action réellement choisie ensuite peut être exploratoire."
        )
      ),

      lesson(
        "Mini-code : Q-Learning tabulaire",
        paragraphs(
          "Ce code reste volontairement simple. Il suppose un environnement avec deux méthodes : <code>reset()</code> pour démarrer un épisode, et <code>step(action)</code> pour exécuter une action et récupérer <code>s_next, reward, done</code>."
        ),
        code(
          "python",
          `
import random
import numpy as np

def choose_action(Q, state, actions, epsilon):
    # Exploration : action aléatoire
    if random.random() < epsilon:
        return random.choice(actions)

    # Exploitation : meilleure action connue
    values = [Q[(state, a)] for a in actions]
    return actions[int(np.argmax(values))]

def q_learning(env, states, actions, episodes=500, alpha=0.1, gamma=0.95, epsilon=0.1):
    # Table Q initialisée à 0
    Q = {(s, a): 0.0 for s in states for a in actions}

    for _ in range(episodes):
        state = env.reset()
        done = False

        while not done:
            action = choose_action(Q, state, actions, epsilon)

            # Interaction réelle avec l'environnement
            next_state, reward, done = env.step(action)

            # Meilleure valeur future estimée
            best_next = max(Q[(next_state, a)] for a in actions)

            # Cible TD
            target = reward + gamma * best_next

            # Mise à jour Q-Learning
            Q[(state, action)] += alpha * (target - Q[(state, action)])

            state = next_state

    return Q
          `,
          "Q-Learning tabulaire minimal"
        )
      ),

      lesson(
        "Convergence : ce qu'il faut retenir",
        paragraphs(
          "Le cours distingue le cas déterministe et le cas stochastique. Dans le cas déterministe, si chaque couple <code>(s,a)</code> est visité infiniment souvent, alors les valeurs apprises <code>Q_n(s,a)</code> convergent vers <code>Q*(s,a)</code>."
        ),
        paragraphs(
          "Dans le cas stochastique, le résultat classique demande notamment des récompenses bornées et un facteur d'apprentissage qui décroît correctement au fil des visites. Le cours donne une forme utile :"
        ),
        formula(
          `α<sub>n</sub> <span class="op">=</span> <span class="fraction"><span class="num">1</span><span class="den"><var>n</var><sup>w</sup></span></span> <span class="text"> avec </span> <span class="fraction"><span class="num">1</span><span class="den">2</span></span> <span class="op">&lt;</span> <var>w</var> <span class="op">≤</span> 1`,
          { caption: "Exemple de suite de facteurs d'apprentissage vérifiant les conditions de convergence." }
        ),
        bullets([
          "les rewards sont bornés",
          "chaque facteur d'apprentissage reste entre 0 et 1",
          "chaque couple état-action est visité suffisamment souvent",
          "la somme des <code>α</code> diverge, mais la somme des <code>α²</code> converge",
          "en intuition : on continue d'apprendre, mais les corrections deviennent de plus en plus prudentes"
        ])
      )
    ].join(""),

    checklist: [
      "Je peux distinguer model-based et model-free.",
      "Je comprends le principe de Dyna.",
      "Je sais définir Q*(s,a), V*(s) et π*(s) à partir de Q.",
      "Je peux expliquer exploration, exploitation et ε-greedy.",
      "Je sais interpréter la mise à jour Q-Learning avec cible TD, erreur TD, α et γ.",
      "Je peux résumer les conditions de convergence."
    ],

    quiz: [
      {
        question: "Une méthode model-free apprend :",
        options: [
          "d'abord T et R puis seulement ensuite la stratégie",
          "directement une stratégie ou une fonction de valeur sans modèle explicite",
          "uniquement des embeddings de mots",
          "une matrice de convolution"
        ],
        answer: 1,
        explanation: "Q-Learning est model-free : il apprend Q sans construire explicitement T et R."
      },
      {
        question: "Dans ε-greedy, ε représente :",
        options: [
          "la probabilité de choisir une action aléatoire",
          "le facteur d'actualisation",
          "le nombre d'états",
          "le reward maximal"
        ],
        answer: 0,
        explanation: "Avec probabilité ε, l'agent explore en choisissant une action au hasard."
      },
      {
        question: "Dans la mise à jour Q-Learning, la cible TD vaut :",
        options: [
          "<code>Q(s,a)</code>",
          "<code>r + γ max_a' Q(s',a')</code>",
          "<code>π(s,a)</code>",
          "<code>T(s,a,s')</code>"
        ],
        answer: 1,
        explanation: "La cible combine récompense immédiate et meilleure valeur future estimée."
      },
      {
        question: "Pourquoi dit-on que Q-Learning est off-policy ?",
        options: [
          "Parce qu'il ne choisit jamais d'action",
          "Parce que la mise à jour utilise la meilleure action estimée au prochain état, pas forcément l'action réellement exécutée ensuite",
          "Parce qu'il interdit l'exploration",
          "Parce qu'il nécessite un modèle connu"
        ],
        answer: 1,
        explanation: "La cible utilise un max sur les actions futures, indépendamment de l'action réellement suivie par la politique d'exploration."
      }
    ],

    exercises: [
      {
        title: "Interpréter une mise à jour Q",
        difficulty: "Intermédiaire",
        time: "15 min",
        prompt: "On a Q(s,a)=2, r=1, γ=0.9, max_a' Q(s',a')=4 et α=0.5. Calcule la cible TD, l'erreur TD et la nouvelle valeur de Q(s,a).",
        deliverables: [
          "la cible TD",
          "l'erreur TD",
          "la nouvelle valeur Q(s,a)"
        ]
      },
      {
        title: "Explorer ou exploiter",
        difficulty: "Facile",
        time: "10 min",
        prompt: "Explique ce que fait une politique ε-greedy avec ε = 0.2. Sur 100 décisions, combien environ seront exploratoires ?",
        deliverables: [
          "une phrase sur l'exploitation",
          "une phrase sur l'exploration",
          "le nombre approximatif d'actions aléatoires"
        ]
      }
    ],

    keywords: [
      "model-based",
      "model-free",
      "dyna",
      "q-learning",
      "fonction Q",
      "epsilon-greedy",
      "exploration",
      "exploitation",
      "erreur TD",
      "learning rate"
    ]
  }
});
})(window);
