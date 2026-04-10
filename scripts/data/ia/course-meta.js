(function registerCourseMeta(globalScope) {
const registry = globalScope.CourseDataRegistry;

if (!registry) {
  console.error("CourseDataRegistry est indisponible. Vérifie que scripts/data/course-runtime.js est chargé avant les données du cours.");
  return;
}

registry.setCourseMeta({
  title: "Cours IA ING5 — Apprentissage profond",
  subtitle: "Un support interactif pour comprendre les idées du deep learning sans se perdre dans la littérature : intuitions, math utiles, visualisations et code concret.",
  description:
    "Animation d'un réseau de neurones : les activations progressent de l'entrée vers la sortie.",
  introVisual: `
    <div class="hero-neural-network" role="img" aria-label="Animation d'un réseau de neurones : les activations avancent de l'entrée vers les couches cachées puis la sortie.">
      <svg viewBox="0 0 460 230" aria-hidden="true" focusable="false">
        <g class="hero-nn__connections">
          <line class="hero-nn__connection hero-nn__connection--input" x1="46" y1="58" x2="165" y2="38"></line>
          <line class="hero-nn__connection hero-nn__connection--input" x1="46" y1="58" x2="165" y2="88"></line>
          <line class="hero-nn__connection hero-nn__connection--input" x1="46" y1="115" x2="165" y2="88"></line>
          <line class="hero-nn__connection hero-nn__connection--input" x1="46" y1="115" x2="165" y2="142"></line>
          <line class="hero-nn__connection hero-nn__connection--input" x1="46" y1="172" x2="165" y2="142"></line>
          <line class="hero-nn__connection hero-nn__connection--input" x1="46" y1="172" x2="165" y2="192"></line>

          <line class="hero-nn__connection hero-nn__connection--hidden" x1="165" y1="38" x2="292" y2="66"></line>
          <line class="hero-nn__connection hero-nn__connection--hidden" x1="165" y1="88" x2="292" y2="66"></line>
          <line class="hero-nn__connection hero-nn__connection--hidden" x1="165" y1="88" x2="292" y2="116"></line>
          <line class="hero-nn__connection hero-nn__connection--hidden" x1="165" y1="142" x2="292" y2="116"></line>
          <line class="hero-nn__connection hero-nn__connection--hidden" x1="165" y1="142" x2="292" y2="166"></line>
          <line class="hero-nn__connection hero-nn__connection--hidden" x1="165" y1="192" x2="292" y2="166"></line>

          <line class="hero-nn__connection hero-nn__connection--output" x1="292" y1="66" x2="410" y2="116"></line>
          <line class="hero-nn__connection hero-nn__connection--output" x1="292" y1="116" x2="410" y2="116"></line>
          <line class="hero-nn__connection hero-nn__connection--output" x1="292" y1="166" x2="410" y2="116"></line>
        </g>

        <g class="hero-nn__signals" aria-hidden="true">
          <circle class="hero-nn__signal hero-nn__signal--a" r="5"></circle>
          <circle class="hero-nn__signal hero-nn__signal--b" r="5"></circle>
          <circle class="hero-nn__signal hero-nn__signal--c" r="5"></circle>
          <circle class="hero-nn__signal hero-nn__signal--d" r="5"></circle>
          <circle class="hero-nn__signal hero-nn__signal--e" r="5"></circle>
          <circle class="hero-nn__signal hero-nn__signal--f" r="5"></circle>
        </g>

        <g class="hero-nn__nodes">
          <circle class="hero-nn__node hero-nn__node--input" cx="46" cy="58" r="15"></circle>
          <circle class="hero-nn__node hero-nn__node--input" cx="46" cy="115" r="15"></circle>
          <circle class="hero-nn__node hero-nn__node--input" cx="46" cy="172" r="15"></circle>

          <circle class="hero-nn__node hero-nn__node--hidden-one" cx="165" cy="38" r="15"></circle>
          <circle class="hero-nn__node hero-nn__node--hidden-one" cx="165" cy="88" r="15"></circle>
          <circle class="hero-nn__node hero-nn__node--hidden-one" cx="165" cy="142" r="15"></circle>
          <circle class="hero-nn__node hero-nn__node--hidden-one" cx="165" cy="192" r="15"></circle>

          <circle class="hero-nn__node hero-nn__node--hidden-two" cx="292" cy="66" r="15"></circle>
          <circle class="hero-nn__node hero-nn__node--hidden-two" cx="292" cy="116" r="15"></circle>
          <circle class="hero-nn__node hero-nn__node--hidden-two" cx="292" cy="166" r="15"></circle>

          <circle class="hero-nn__node hero-nn__node--output" cx="410" cy="116" r="18"></circle>
        </g>

        <g class="hero-nn__labels" aria-hidden="true">
          <text class="hero-nn__label" x="46" y="218">Entrée</text>
          <text class="hero-nn__label" x="165" y="218">Couches cachées</text>
          <text class="hero-nn__label" x="410" y="218">Sortie</text>
        </g>
      </svg>
    </div>
  `,
  stats: [
    { value: "14", label: "chapitres progressifs" },
    { value: "Python", label: "langage de référence" },
    { value: "ConvNet + RNN + RL", label: "familles étudiées" },
    { value: "ING5", label: "niveau" }
  ],
  glossaryCategories: [
    { id: "foundations", label: "Fondations du deep learning" },
    { id: "operations", label: "Opérations de base" },
    { id: "layers", label: "Couches & architectures" },
    { id: "sequences", label: "Récurrence & séquences" },
    { id: "reinforcement", label: "Apprentissage par renforcement" },
    { id: "training", label: "Apprentissage & optimisation" },
    { id: "regularisation", label: "Régularisation & généralisation" },
    { id: "diagnostics", label: "Évaluation & diagnostics" }
  ],
  glossaryTagToCategory: {
    fondations: "foundations",
    "deep learning": "foundations",
    neurone: "foundations",
    activation: "operations",
    convnet: "layers",
    convolution: "operations",
    operation: "operations",
    filtre: "operations",
    pooling: "operations",
    architecture: "layers",
    recurrence: "sequences",
    sequence: "sequences",
    rnn: "sequences",
    lstm: "sequences",
    memoire: "sequences",
    langage: "sequences",
    attention: "sequences",
    transformeur: "sequences",
    bptt: "sequences",
    feedforward: "sequences",
    renforcement: "reinforcement",
    ar: "reinforcement",
    rl: "reinforcement",
    agent: "reinforcement",
    environnement: "reinforcement",
    reward: "reinforcement",
    strategie: "reinforcement",
    policy: "reinforcement",
    markov: "reinforcement",
    mdp: "reinforcement",
    bellman: "reinforcement",
    qlearning: "reinforcement",
    q: "reinforcement",
    dyna: "reinforcement",
    exploration: "reinforcement",
    exploitation: "reinforcement",
    modele: "reinforcement",
    "model-based": "reinforcement",
    "model-free": "reinforcement",
    planning: "reinforcement",
    transition: "reinforcement",
    parametre: "foundations",
    apprentissage: "training",
    optimisation: "training",
    gradient: "training",
    regularisation: "regularisation",
    generalisation: "regularisation",
    evaluation: "diagnostics",
    metrique: "diagnostics",
    diagnostic: "diagnostics"
  },
  heroTerminal: ({ nextStepLabel, progress, completedCount, visibleCount, assistantAvailable }) =>
    `<span class="token-keyword">import</span> <span class="token-function">torch</span>
<span class="token-keyword">from</span> <span class="token-function">torch</span> <span class="token-keyword">import</span> nn

<span class="token-comment"># Prochain jalon</span>
target = <span class="token-string">"${nextStepLabel}"</span>

<span class="token-comment"># Progression</span>
course.<span class="token-function">log_status</span>(
    completion=<span class="token-number">${progress}</span>,
    validated=<span class="token-number">${completedCount}</span>,
    visible=<span class="token-number">${visibleCount}</span>,
    mode=<span class="token-string">"${assistantAvailable ? 'Assistant' : 'Autonome'}"</span>,
)

<span class="token-keyword">return</span> course.<span class="token-function">train</span>(epoch=<span class="token-number">${Math.max(1, completedCount + 1)}</span>)`
});
})(window);
