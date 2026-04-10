(function registerChapterBundle11(globalScope) {
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
  order: 11,
  chapter: {
    id: "rl-fondations-objectifs",
    shortTitle: "Intro RL",
    title: "Apprentissage par renforcement : agent, environnement, objectif",
    level: "Fondations",
    duration: "1 h 25",
    track: "IA3",
    summary:
      "On introduit l'apprentissage par renforcement comme apprentissage par interaction : un agent agit, observe une conséquence, reçoit une récompense ou une punition, puis ajuste son comportement. Le chapitre formalise S, A, reward, observabilité totale, stationnarité, et compare les modèles d'optimalité avant de fixer l'horizon infini actualisé.",
    goals: [
      "définir l'apprentissage par renforcement par la boucle agent-environnement",
      "identifier états, actions, récompenses, punitions et stratégie",
      "comprendre l'hypothèse d'observabilité totale avec I = identité",
      "distinguer environnement déterministe, non déterministe et stationnaire",
      "comparer horizon fini, horizon infini actualisé et reward moyen",
      "situer l'AR par rapport au supervisé et au non supervisé"
    ],
    highlights: [
      "agent",
      "environnement",
      "reward",
      "policy",
      "gamma",
      "essai-erreur"
    ],
    body: [
      lesson(
        "Définition : apprendre par essai-erreur",
        paragraphs(
          "L'<strong>apprentissage par renforcement</strong> est le problème auquel est confronté un agent qui apprend à se comporter à partir de ses interactions avec un environnement. Il n'a pas un dataset tout prêt avec les bonnes réponses. Il agit, observe les conséquences, reçoit une <strong>récompense</strong> ou une <strong>punition</strong>, puis affine ses prochains choix."
        ),
        fig("rlAgentEnvironmentLoop", "Le cycle de base : perception de l'état, choix d'une action, récompense et nouvel état."),
        bullets([
          "un robot reçoit une récompense s'il atteint de la nourriture, une punition s'il heurte un obstacle",
          "dans un jeu comme le Go ou le backgammon, gagner correspond à une récompense et perdre à une punition",
          "dans une tâche de contrôle, une bonne trajectoire produit beaucoup de retours positifs sur la durée"
        ]),
        callout(
          "info",
          "Le point central",
          "En AR, le signal d'apprentissage est retardé et indirect. L'agent ne reçoit pas forcément la bonne action à faire ; il reçoit surtout un retour sur ce qui vient de se passer."
        )
      ),

      lesson(
        "Formalisation minimale d'un problème AR",
        paragraphs(
          "Le cours formalise un problème d'AR avec un ensemble d'états <code>S</code>, un ensemble d'actions <code>A</code>, un ensemble de signaux de renforcement scalaires, une fonction d'entrée <code>I</code>, et une fonction <code>reward</code> qui donne le retour obtenu après une action."
        ),
        table(
          ["Objet", "Notation", "Rôle"],
          [
            ["États", "<code>S</code>", "situations possibles de l'environnement"],
            ["Actions", "<code>A</code>", "choix que l'agent peut exécuter"],
            ["Signal de renforcement", "<code>r</code>", "récompense ou punition scalaire"],
            ["Fonction d'entrée", "<code>I(s)</code>", "ce que l'agent perçoit de l'état"],
            ["Reward", "<code>reward</code>", "règle qui produit le retour après action"]
          ]
        ),
        callout(
          "success",
          "Observabilité totale",
          "Dans ce cours, on prend souvent <code>I</code> égale à l'identité sur <code>S</code>. Cela signifie que l'agent observe directement l'état réel de l'environnement : c'est l'hypothèse d'observabilité totale."
        )
      ),

      lesson(
        "Une étape d'apprentissage",
        paragraphs(
          "Chaque étape de l'apprentissage suit le même triptyque : perception, décision/action, conséquence. Ce découpage semble simple, mais il contient toute la difficulté de l'AR : l'action immédiate modifie aussi les situations futures."
        ),
        code(
          "text",
          `
1. Perception
   l'agent reçoit l'état s

2. Décision / action
   l'agent choisit et exécute une action a

3. Conséquence
   l'environnement renvoie une récompense r
   et passe dans un nouvel état s'
          `,
          "Une transition d'apprentissage par renforcement"
        ),
        paragraphs(
          "L'agent cherche donc à apprendre une <strong>stratégie</strong>, notée <code>π</code>, qui associe une action à un état. Dans le cas déterministe, on peut écrire <code>π : S → A</code>. L'objectif n'est pas simplement d'obtenir le meilleur reward immédiat, mais de maximiser la somme des récompenses sur le long terme."
        ),
        callout(
          "warn",
          "Non déterministe mais stationnaire",
          "Un même couple <code>(s, a)</code> peut mener à des issues différentes <code>(r, s')</code>. On suppose toutefois que l'environnement est stationnaire : les probabilités de ces issues ne changent pas au cours du temps."
        )
      ),

      lesson(
        "Retour et modèles d'optimalité",
        paragraphs(
          "Le cours pose ensuite une question décisive : comment prendre le futur en compte ? En pratique, on formalise l'objectif avec un <strong>retour</strong> ou gain à long terme. Une notation très utilisée est <code>G_t</code>, le cumul des récompenses à partir du temps <code>t</code>."
        ),
        fig("rlOptimalityHorizons", "Trois façons de compter le futur : regarder h pas, actualiser tout le futur, ou prendre la moyenne long terme."),
        table(
          ["Modèle", "Objectif", "Intuition"],
          [
            ["Horizon fini", "<code>E(Σ_{t=0}^{h-1} r_t)</code>", "ne regarder que les h prochaines étapes"],
            ["Horizon infini actualisé", "<code>Σ_{t=0}^{∞} γ^t r_t</code>", "prendre tout le futur, mais moins fortement quand il s'éloigne"],
            ["Récompense moyenne", "<code>lim_{h→∞} E((1/h) Σ r_t)</code>", "maximiser la moyenne long terme"]
          ]
        ),
        formula(
          `<var>G</var><sub>t</sub> <span class="op">=</span> <var>R</var><sub>t+1</sub> <span class="op">+</span> γ<var>R</var><sub>t+2</sub> <span class="op">+</span> γ<sup>2</sup><var>R</var><sub>t+3</sub> <span class="op">+</span> ...`,
          { caption: "Retour actualisé : le futur compte, mais avec un poids γ^k." }
        ),
        bullets([
          "<strong>γ proche de 0</strong> : agent myope, il privilégie le reward immédiat",
          "<strong>γ proche de 1</strong> : agent prévoyant, il tient fortement compte du futur",
          "<strong>dans ce cours</strong> : on adopte le modèle à horizon infini avec facteur d'actualisation"
        ])
      ),

      lesson(
        "AR vs supervisé et non supervisé",
        paragraphs(
          "Un programme apprend si sa performance s'améliore avec l'expérience. L'AR vérifie cette définition : l'expérience est la suite des interactions avec l'environnement ; la performance est mesurée par les retours obtenus ; l'amélioration vient du fait que l'agent apprend progressivement les actions qui rapportent le plus sur la durée."
        ),
        table(
          ["Type d'apprentissage", "Signal reçu", "Ce qu'on apprend"],
          [
            ["Supervisé", "exemples avec bonnes réponses", "une fonction qui généralise ces réponses"],
            ["Non supervisé", "données sans labels", "des structures ou regroupements"],
            ["Renforcement", "récompenses/punitions après actions", "une stratégie d'action dans le temps"]
          ]
        ),
        paragraphs(
          "La différence la plus importante est l'introduction de l'<strong>action</strong> et du <strong>temps</strong>. L'agent ne se contente pas de reconnaître ou de regrouper : il intervient sur le monde, subit les conséquences, puis doit raisonner à long terme."
        )
      ),

      lesson(
        "Épisodes et états terminaux",
        paragraphs(
          "Le texte du cours n'insiste pas beaucoup sur cette notion, mais elle est très utile en pratique. Beaucoup de tâches d'AR sont découpées en <strong>épisodes</strong> : une partie de jeu, une tentative de robot, un trajet jusqu'à un but. Un épisode se termine souvent dans un <strong>état terminal</strong> : victoire, défaite, collision, fin de trajectoire."
        ),
        callout(
          "info",
          "Pourquoi c'est important",
          "Dans un épisode fini, le retour s'arrête à l'état terminal. Cela rend les algorithmes plus simples à tester et explique pourquoi les cours d'AR utilisent souvent des grilles, des jeux ou des mini-mondes."
        )
      )
    ].join(""),

    checklist: [
      "Je peux définir l'apprentissage par renforcement par la boucle agent-environnement.",
      "Je sais identifier états, actions, reward, stratégie et retour.",
      "Je comprends l'observabilité totale et la stationnarité.",
      "Je peux comparer horizon fini, horizon infini actualisé et récompense moyenne.",
      "Je sais expliquer la différence entre AR, supervisé et non supervisé."
    ],

    quiz: [
      {
        question: "En apprentissage par renforcement, quel est le rôle du reward ?",
        options: [
          "Donner directement la bonne action à faire",
          "Mesurer le retour obtenu après une action pour guider l'apprentissage",
          "Remplacer l'état de l'environnement",
          "Normaliser les entrées comme dans un ConvNet"
        ],
        answer: 1,
        explanation: "Le reward est le signal de renforcement : il indique si l'action a été favorable ou défavorable, sans forcément donner la bonne action."
      },
      {
        question: "Que signifie l'hypothèse d'observabilité totale utilisée ici ?",
        options: [
          "L'agent ne voit jamais l'état réel",
          "La fonction I est prise comme identité : l'agent perçoit l'état tel qu'il est",
          "L'environnement est toujours déterministe",
          "Le reward est toujours positif"
        ],
        answer: 1,
        explanation: "Prendre I = identité signifie que l'entrée de l'agent est directement l'état s."
      },
      {
        question: "Si γ est proche de 0, l'agent est plutôt :",
        options: [
          "myope",
          "prévoyant",
          "non stationnaire",
          "supervisé"
        ],
        answer: 0,
        explanation: "Avec γ proche de 0, les récompenses futures sont très peu prises en compte."
      },
      {
        question: "Ce qui distingue fortement l'AR du supervisé et du non supervisé est :",
        options: [
          "l'absence totale de fonction objectif",
          "la présence d'actions, d'essais-erreurs et de récompenses dans le temps",
          "l'interdiction d'utiliser des probabilités",
          "l'obligation d'utiliser des ConvNet"
        ],
        answer: 1,
        explanation: "L'AR ajoute le choix d'actions et leurs conséquences temporelles."
      }
    ],

    exercises: [
      {
        title: "Décrire un problème AR",
        difficulty: "Facile",
        time: "12 min",
        prompt: "Prends un jeu simple ou une tâche de robot. Identifie les états, les actions, les rewards, les punitions et une stratégie possible.",
        deliverables: [
          "un ensemble d'états",
          "un ensemble d'actions",
          "au moins deux rewards ou punitions",
          "une stratégie naïve"
        ]
      },
      {
        title: "Choisir γ",
        difficulty: "Intermédiaire",
        time: "15 min",
        prompt: "Compare deux valeurs de γ, par exemple 0.1 et 0.95, dans une tâche où un agent doit éviter un piège court terme pour atteindre une grande récompense plus tard.",
        deliverables: [
          "une interprétation de γ = 0.1",
          "une interprétation de γ = 0.95",
          "une conclusion sur le comportement attendu"
        ]
      }
    ],

    keywords: [
      "apprentissage par renforcement",
      "agent",
      "environnement",
      "reward",
      "stratégie",
      "gamma",
      "retour",
      "observabilité totale",
      "stationnarité"
    ]
  }
});
})(window);
