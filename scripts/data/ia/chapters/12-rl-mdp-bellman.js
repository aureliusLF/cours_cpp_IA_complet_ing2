(function registerChapterBundle12(globalScope) {
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
  order: 12,
  chapter: {
    id: "rl-mdp-bellman",
    shortTitle: "MDP",
    title: "Processus de Markov, MDP et équation de Bellman",
    level: "Intermédiaire",
    duration: "1 h 45",
    track: "IA3",
    summary:
      "Ce chapitre formalise le cœur probabiliste de l'apprentissage par renforcement : processus stochastique, propriété de Markov, chaîne de Markov, matrice de transition, valeur d'un état et équation de Bellman. On ajoute ensuite les actions et les récompenses pour obtenir le processus de décision markovien.",
    goals: [
      "définir processus stochastique, propriété de Markov et chaîne de Markov",
      "lire une matrice de transition et vérifier que chaque ligne somme à 1",
      "exprimer la probabilité d'une trajectoire avec les transitions markoviennes",
      "définir la récompense moyenne d'un état et la fonction valeur",
      "écrire l'équation de Bellman pour une chaîne de Markov récompensée",
      "définir formellement un MDP avec S, A, T, R et γ"
    ],
    highlights: [
      "Markov",
      "matrice de transition",
      "MDP",
      "Bellman",
      "fonction valeur",
      "transition"
    ],
    body: [
      lesson(
        "Processus stochastique et propriété de Markov",
        paragraphs(
          "Un <strong>processus stochastique</strong> est une famille de variables aléatoires indexées par le temps. Dans notre contexte, on peut imaginer une suite d'états <code>S_0, S_1, S_2, ...</code> que l'agent traverse."
        ),
        paragraphs(
          "La <strong>propriété de Markov</strong> dit que la prédiction de l'avenir à partir du présent n'est pas rendue plus précise par la connaissance du passé. Formulé simplement : <strong>le futur dépend du présent, pas de tout l'historique</strong>."
        ),
        formula(
          `<span class="fn">P</span>(<var>X</var><sub>t+1</sub> = <var>y</var> | <var>X</var><sub>t</sub> = <var>x</var>, <var>X</var><sub>t−1</sub>, ..., <var>X</var><sub>0</sub>) <span class="op">=</span> <span class="fn">P</span>(<var>X</var><sub>t+1</sub> = <var>y</var> | <var>X</var><sub>t</sub> = <var>x</var>)`,
          { caption: "La connaissance de l'état présent suffit pour prédire la distribution du prochain état." }
        ),
        callout(
          "warn",
          "Sans mémoire ne veut pas dire sans état",
          "Une chaîne de Markov est dite sans mémoire parce qu'elle n'a pas besoin de tout l'historique. Mais l'état courant peut lui-même contenir beaucoup d'information utile."
        )
      ),

      lesson(
        "Chaîne de Markov et matrice de transition",
        paragraphs(
          "Une <strong>chaîne de Markov</strong> est une suite de variables aléatoires à valeurs dans un espace d'états fini ou dénombrable <code>S</code>, vérifiant la propriété de Markov. On note <code>P_ij</code> la probabilité de passer de l'état <code>s_i</code> à l'état <code>s_j</code>."
        ),
        table(
          ["Depuis / vers", "<code>s1</code>", "<code>s2</code>", "<code>s3</code>", "Somme ligne"],
          [
            ["<code>s1</code>", "0.1", "0.6", "0.3", "1.0"],
            ["<code>s2</code>", "0.0", "0.8", "0.2", "1.0"],
            ["<code>s3</code>", "0.4", "0.1", "0.5", "1.0"]
          ]
        ),
        bullets([
          "<code>P_ij = P(X_{n+1} = s_j | X_n = s_i)</code>",
          "chaque ligne correspond à une distribution de probabilité",
          "la somme des éléments de chaque ligne vaut 1"
        ]),
        code(
          "text",
          `
P(X_n = x_n, ..., X_0 = x_0)
= P(x_n | x_{n-1}) × P(x_{n-1} | x_{n-2}) × ... × P(x_1 | x_0) × P(x_0)
          `,
          "Probabilité d'une trajectoire markovienne"
        )
      ),

      lesson(
        "Ajouter les récompenses : valeur d'un état",
        paragraphs(
          "Tous les états n'ont pas la même valeur pour l'agent. Un état de victoire vaut plus qu'un état de défaite. On introduit donc une récompense moyenne d'état <code>R_s</code>, définie comme le reward moyen reçu juste après avoir été dans l'état <code>s</code>."
        ),
        formula(
          `<var>R</var><sub>s</sub> <span class="op">=</span> <span class="fn">E</span>(<var>R</var><sub>t+1</sub> | <var>S</var><sub>t</sub> = <var>s</var>)`,
          { caption: "Reward moyen immédiat associé à l'état s." }
        ),
        paragraphs(
          "La vraie valeur d'un état n'est pas seulement son reward immédiat. Elle inclut aussi les récompenses futures, actualisées par <code>γ</code>."
        ),
        formula(
          `<var>V</var>(<var>s</var>) <span class="op">=</span> <span class="fn">E</span>(<var>R</var><sub>t+1</sub> <span class="op">+</span> γ<var>R</var><sub>t+2</sub> <span class="op">+</span> γ<sup>2</sup><var>R</var><sub>t+3</sub> <span class="op">+</span> ... | <var>S</var><sub>t</sub> = <var>s</var>)`,
          { caption: "Valeur d'un état : récompenses futures attendues, avec actualisation." }
        )
      ),

      lesson(
        "Équation de Bellman",
        paragraphs(
          "L'équation de Bellman exprime une idée récursive : la valeur d'un état est son reward immédiat moyen, plus la valeur actualisée des états suivants possibles."
        ),
        fig("rlMdpBellman", "Bellman fait le lien entre valeur présente, reward immédiat et valeurs futures possibles."),
        formula(
          `<var>V</var>(<var>s</var>) <span class="op">=</span> <var>R</var><sub>s</sub> <span class="op">+</span> γ <span class="sum">∑</span><span class="sum-limits"><span class="top"><var>s'</var></span><span class="bot"></span></span> <var>P</var><sub>ss'</sub><var>V</var>(<var>s'</var>)`,
          { caption: "Équation de Bellman pour une chaîne de Markov récompensée." }
        ),
        paragraphs(
          "Avec peu d'états, on peut résoudre directement ce système d'équations. Avec davantage d'états, on utilise plutôt des méthodes indirectes comme la programmation dynamique."
        )
      ),

      lesson(
        "Définition formelle d'un MDP",
        paragraphs(
          "Une chaîne de Markov décrit des transitions entre états. En AR, l'agent agit : il faut donc ajouter les actions et les récompenses associées. On obtient un <strong>processus de décision markovien</strong>, ou MDP."
        ),
        table(
          ["Élément", "Notation", "Définition"],
          [
            ["États", "<code>S</code>", "ensemble des situations possibles"],
            ["Actions", "<code>A</code>", "ensemble des actions possibles"],
            ["Transition", "<code>T(s,a,s')</code>", "probabilité d'aller en <code>s'</code> depuis <code>s</code> avec l'action <code>a</code>"],
            ["Reward", "<code>R(s,a)</code>", "reward moyen après action <code>a</code> en <code>s</code>"],
            ["Actualisation", "<code>γ ∈ [0,1[</code>", "poids accordé au futur"]
          ]
        ),
        formula(
          `<var>T</var>(<var>s</var>, <var>a</var>, <var>s'</var>) <span class="op">=</span> <span class="fn">P</span>(<var>S</var><sub>t+1</sub> = <var>s'</var> | <var>S</var><sub>t</sub> = <var>s</var>, <var>A</var><sub>t</sub> = <var>a</var>)`,
          { caption: "La transition dépend de l'état présent et de l'action choisie." }
        ),
        formula(
          `<var>R</var>(<var>s</var>, <var>a</var>) <span class="op">=</span> <span class="fn">E</span>(<var>R</var><sub>t+1</sub> | <var>S</var><sub>t</sub> = <var>s</var>, <var>A</var><sub>t</sub> = <var>a</var>)`,
          { caption: "Le reward d'un couple état-action est une moyenne si l'environnement est stochastique." }
        )
      )
    ].join(""),

    checklist: [
      "Je peux définir la propriété de Markov en une phrase.",
      "Je sais lire une matrice de transition et vérifier ses lignes.",
      "Je peux expliquer la valeur d'un état comme reward immédiat + futur actualisé.",
      "Je sais écrire l'équation de Bellman de base.",
      "Je peux définir un MDP par S, A, T, R et γ."
    ],

    quiz: [
      {
        question: "La propriété de Markov affirme que :",
        options: [
          "le futur dépend directement du présent, pas de tout l'historique",
          "le futur dépend uniquement de la première observation",
          "toutes les transitions sont déterministes",
          "la somme des rewards vaut toujours 1"
        ],
        answer: 0,
        explanation: "L'état présent est supposé contenir toute l'information utile pour prédire la distribution du prochain état."
      },
      {
        question: "Dans une matrice de transition markovienne, chaque ligne doit :",
        options: [
          "contenir exactement un 1 et le reste en 0",
          "somme à 1",
          "somme à γ",
          "être symétrique"
        ],
        answer: 1,
        explanation: "Chaque ligne est une distribution de probabilité sur les prochains états."
      },
      {
        question: "Dans un MDP, <code>T(s,a,s')</code> représente :",
        options: [
          "la valeur optimale de s",
          "la probabilité de passer de s à s' en exécutant a",
          "le facteur d'apprentissage",
          "la stratégie de l'agent"
        ],
        answer: 1,
        explanation: "T est la fonction de transition du MDP."
      }
    ],

    exercises: [
      {
        title: "Vérifier une matrice de transition",
        difficulty: "Facile",
        time: "10 min",
        prompt: "Propose une matrice de transition 3 x 3 valide, puis vérifie que chaque ligne somme à 1.",
        deliverables: [
          "la matrice 3 x 3",
          "la somme de chaque ligne",
          "une phrase sur le sens de P_ij"
        ]
      },
      {
        title: "Identifier un MDP",
        difficulty: "Intermédiaire",
        time: "15 min",
        prompt: "Pour un robot dans une grille avec obstacles et nourriture, définis S, A, T, R et γ.",
        deliverables: [
          "un exemple d'état",
          "un exemple d'action",
          "une règle de transition",
          "une règle de reward",
          "un choix argumenté de γ"
        ]
      }
    ],

    keywords: [
      "processus de Markov",
      "chaîne de Markov",
      "matrice de transition",
      "MDP",
      "Bellman",
      "fonction valeur",
      "transition",
      "reward moyen"
    ]
  }
});
})(window);
