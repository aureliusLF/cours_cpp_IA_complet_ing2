(function registerChapterBundle13(globalScope) {
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
  order: 13,
  chapter: {
    id: "rl-strategies-iteration",
    shortTitle: "Stratégies",
    title: "Stratégie optimale, Value Iteration et Policy Iteration",
    level: "Intermédiaire",
    duration: "1 h 45",
    track: "IA3",
    summary:
      "On passe du MDP à la décision : qu'est-ce qu'une stratégie, comment mesurer la valeur d'un état sous une stratégie, comment définir la valeur optimale, puis comment la calculer lorsque le modèle T et R est connu. Le chapitre couvre Bellman d'optimalité, Value Iteration et Policy Iteration.",
    goals: [
      "définir une stratégie déterministe ou stochastique",
      "écrire Vπ(s) et V*(s)",
      "comprendre l'équation de Bellman d'optimalité",
      "extraire une stratégie optimale à partir de V*",
      "appliquer le principe de Value Iteration",
      "comparer Value Iteration et Policy Iteration"
    ],
    highlights: [
      "policy",
      "Vπ",
      "V*",
      "Bellman optimalité",
      "Value Iteration",
      "Policy Iteration"
    ],
    body: [
      lesson(
        "Stratégie : comportement de l'agent",
        paragraphs(
          "Une <strong>stratégie</strong>, ou <em>policy</em>, définit le comportement de l'agent. Dans le cas général, elle donne une distribution de probabilités sur les actions possibles dans chaque état."
        ),
        formula(
          `π(<var>s</var>, <var>a</var>) <span class="op">=</span> <span class="fn">P</span>(<var>A</var><sub>t</sub> = <var>a</var> | <var>S</var><sub>t</sub> = <var>s</var>)`,
          { caption: "Stratégie stochastique : une probabilité pour chaque action possible." }
        ),
        paragraphs(
          "Dans le cas déterministe, la stratégie est une fonction simple <code>π : S → A</code>. Elle dit directement quelle action exécuter dans chaque état."
        ),
        table(
          ["Type de stratégie", "Notation", "Exemple"],
          [
            ["Déterministe", "<code>π(s) = a</code>", "toujours aller à droite depuis s"],
            ["Stochastique", "<code>π(s,a)</code>", "70 % droite, 30 % haut"]
          ]
        )
      ),

      lesson(
        "Valeur d'un état sous une stratégie",
        paragraphs(
          "Pour comparer les comportements, on définit la valeur d'un état <code>s</code> lorsque l'agent suit une stratégie donnée <code>π</code>. Cette valeur est la récompense actualisée moyenne que l'agent obtiendra en partant de <code>s</code> et en suivant <code>π</code>."
        ),
        formula(
          `<var>V</var><sup>π</sup>(<var>s</var>) <span class="op">=</span> <span class="fn">E</span><sub>π</sub>(<span class="sum">∑</span><span class="sum-limits"><span class="top">∞</span><span class="bot"><var>t</var>=0</span></span> γ<sup>t</sup><var>r</var><sub>t</sub>)`,
          { caption: "La moyenne est calculée en supposant que l'agent suit la stratégie π." }
        ),
        paragraphs(
          "La valeur optimale d'un état est la meilleure valeur possible parmi toutes les stratégies. Elle est unique et notée <code>V*(s)</code>."
        ),
        formula(
          `<var>V</var><sup>*</sup>(<var>s</var>) <span class="op">=</span> <span class="max">max</span><sub>π</sub> <span class="fn">E</span>(<span class="sum">∑</span><span class="sum-limits"><span class="top">∞</span><span class="bot"><var>t</var>=0</span></span> γ<sup>t</sup><var>r</var><sub>t</sub>)`,
          { caption: "V* est la valeur que l'on obtient en suivant la meilleure stratégie possible." }
        )
      ),

      lesson(
        "Bellman d'optimalité",
        paragraphs(
          "L'équation de Bellman d'optimalité dit que la meilleure valeur d'un état s'obtient en choisissant l'action qui maximise la somme du reward immédiat et de la valeur future attendue."
        ),
        fig("rlMdpBellman", "Le backup optimal choisit l'action qui donne le meilleur compromis récompense immédiate + futur actualisé."),
        formula(
          `<var>V</var><sup>*</sup>(<var>s</var>) <span class="op">=</span> <span class="max">max</span><sub><var>a</var></sub>(<var>R</var>(<var>s</var>, <var>a</var>) <span class="op">+</span> γ <span class="sum">∑</span><span class="sum-limits"><span class="top"><var>s'</var></span><span class="bot"></span></span> <var>T</var>(<var>s</var>, <var>a</var>, <var>s'</var>) <var>V</var><sup>*</sup>(<var>s'</var>))`,
          { caption: "Équation de Bellman d'optimalité." }
        ),
        formula(
          `π<sup>*</sup>(<var>s</var>) <span class="op">=</span> <span class="argmax">argmax</span><sub><var>a</var></sub>(<var>R</var>(<var>s</var>, <var>a</var>) <span class="op">+</span> γ <span class="sum">∑</span><span class="sum-limits"><span class="top"><var>s'</var></span><span class="bot"></span></span> <var>T</var>(<var>s</var>, <var>a</var>, <var>s'</var>) <var>V</var><sup>*</sup>(<var>s'</var>))`,
          { caption: "Une fois V* connue, on extrait une stratégie optimale par argmax." }
        )
      ),

      lesson(
        "Value Iteration",
        paragraphs(
          "Quand le modèle est connu, c'est-à-dire quand on connaît <code>T(s,a,s')</code> et <code>R(s,a)</code>, on peut calculer progressivement <code>V*</code> avec <strong>Value Iteration</strong>."
        ),
        fig("rlPlanningIterations", "Value Iteration répète des backups max sur V jusqu'à stabilisation."),
        code(
          "text",
          `
1. Initialiser V(s) arbitrairement pour chaque état s

2. Répéter jusqu'au critère d'arrêt :
   Pour chaque état s :
      Pour chaque action a :
         Q(s,a) = R(s,a) + γ Σ_s' T(s,a,s') V(s')
      V(s) = max_a Q(s,a)

3. Extraire une stratégie :
   π(s) = argmax_a Q(s,a)
          `,
          "Value Iteration"
        ),
        callout(
          "success",
          "Convergence",
          "L'algorithme converge vers la fonction valeur optimale <code>V*</code>. Un critère d'arrêt courant est <code>max_s |V_new(s) - V_old(s)| &lt; ε</code>."
        ),
        paragraphs(
          "Le cours mentionne aussi la complexité : au pire, chaque itération est quadratique en <code>|S|</code> et linéaire en <code>|A|</code>. En pratique, beaucoup de transitions sont nulles, donc les structures creuses rendent souvent les itérations plus proches du linéaire en <code>|S|</code>."
        )
      ),

      lesson(
        "Policy Iteration",
        paragraphs(
          "<strong>Policy Iteration</strong> manipule directement une stratégie. Il alterne deux phases : évaluer la stratégie courante, puis l'améliorer en choisissant les actions qui deviennent meilleures selon cette évaluation."
        ),
        code(
          "text",
          `
1. Choisir une stratégie initiale π'

2. Répéter :
   a) π = π'

   b) Évaluation :
      résoudre Vπ(s) = R(s,π(s)) + γ Σ_s' T(s,π(s),s') Vπ(s')

   c) Amélioration :
      π'(s) = argmax_a [R(s,a) + γ Σ_s' T(s,a,s') Vπ(s')]

3. Arrêter quand π' = π
          `,
          "Policy Iteration"
        ),
        table(
          ["Algorithme", "Objet principal", "Idée"],
          [
            ["Value Iteration", "<code>V</code>", "mettre à jour la valeur optimale par max"],
            ["Policy Iteration", "<code>π</code>", "évaluer une stratégie puis l'améliorer"]
          ]
        ),
        callout(
          "warn",
          "Ce que ces deux méthodes supposent",
          "Value Iteration et Policy Iteration sont des méthodes de programmation dynamique. Elles supposent que le modèle du problème est connu : on connaît <code>T</code> et <code>R</code>. Ce n'est pas toujours le cas en apprentissage par renforcement réel."
        )
      ),

      lesson(
        "Mini-code : Value Iteration lisible",
        paragraphs(
          "Voici une version volontairement compacte pour garder le geste algorithmique. Les transitions sont représentées par une liste de couples <code>(probabilité, état suivant)</code>."
        ),
        code(
          "python",
          `
def value_iteration(states, actions, transitions, rewards, gamma=0.95, epsilon=1e-6):
    # Valeurs initiales arbitraires
    V = {s: 0.0 for s in states}

    while True:
        delta = 0.0
        new_V = {}

        for s in states:
            q_values = []

            for a in actions:
                # Reward immédiat moyen
                q = rewards[(s, a)]

                # Futur actualisé
                for prob, s_next in transitions[(s, a)]:
                    q += gamma * prob * V[s_next]

                q_values.append(q)

            # Backup optimal
            new_V[s] = max(q_values)
            delta = max(delta, abs(new_V[s] - V[s]))

        V = new_V

        if delta < epsilon:
            break

    return V
          `,
          "Value Iteration minimal en Python"
        )
      )
    ].join(""),

    checklist: [
      "Je peux définir une stratégie déterministe et une stratégie stochastique.",
      "Je sais écrire Vπ(s) et V*(s).",
      "Je comprends l'équation de Bellman d'optimalité.",
      "Je peux expliquer Value Iteration étape par étape.",
      "Je peux comparer Value Iteration et Policy Iteration.",
      "Je sais que ces méthodes supposent T et R connus."
    ],

    quiz: [
      {
        question: "Une stratégie stochastique π(s,a) représente :",
        options: [
          "la probabilité de choisir a dans l'état s",
          "la probabilité de transition vers s'",
          "le reward immédiat",
          "l'erreur TD"
        ],
        answer: 0,
        explanation: "π(s,a) est une distribution sur les actions possibles dans l'état s."
      },
      {
        question: "Dans Bellman d'optimalité, le <code>max_a</code> signifie que l'on :",
        options: [
          "prend l'action qui maximise reward immédiat + futur actualisé",
          "choisit toujours une action au hasard",
          "ignore le futur",
          "remplace la matrice de transition par l'identité"
        ],
        answer: 0,
        explanation: "L'action optimale est celle qui maximise le compromis entre reward immédiat et valeur future attendue."
      },
      {
        question: "Value Iteration et Policy Iteration supposent toutes les deux que :",
        options: [
          "le modèle T et R est connu",
          "les rewards sont tous nuls",
          "l'agent n'agit jamais",
          "la stratégie est forcément stochastique"
        ],
        answer: 0,
        explanation: "Ce sont des méthodes de planning sur un MDP connu."
      }
    ],

    exercises: [
      {
        title: "Lire Bellman d'optimalité",
        difficulty: "Intermédiaire",
        time: "15 min",
        prompt: "Explique chaque terme de <code>V*(s) = max_a(R(s,a) + γ Σ_s' T(s,a,s') V*(s'))</code> en une phrase.",
        deliverables: [
          "le rôle de R(s,a)",
          "le rôle de γ",
          "le rôle de T(s,a,s')",
          "le rôle du max"
        ]
      },
      {
        title: "Comparer Value et Policy Iteration",
        difficulty: "Intermédiaire",
        time: "15 min",
        prompt: "Rédige un court tableau comparant Value Iteration et Policy Iteration : objet manipulé, étape principale, critère d'arrêt.",
        deliverables: [
          "une ligne pour Value Iteration",
          "une ligne pour Policy Iteration",
          "une phrase sur l'hypothèse de modèle connu"
        ]
      }
    ],

    keywords: [
      "stratégie",
      "policy",
      "V pi",
      "V star",
      "Bellman optimalité",
      "value iteration",
      "policy iteration",
      "programmation dynamique"
    ]
  }
});
})(window);
