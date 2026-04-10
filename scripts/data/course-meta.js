(function registerCourseMeta(globalScope) {
const registry = globalScope.CourseDataRegistry;

if (!registry) {
  console.error("CourseDataRegistry est indisponible. Vérifie que scripts/data/course-runtime.js est chargé avant les données du cours.");
  return;
}

registry.setCourseMeta({
  title: "Cours C++ complet ING2",
  subtitle: "Un support de cours pensé comme un vrai projet web : progressif, concret et accessible même sans bagage préalable en C.",
  description:
    "Animation inspirée du C++ : source, symboles du langage et exécution en mouvement.",
  introVisual: `
    <div class="hero-cpp-journey" role="img" aria-label="Animation C++ : un fichier source, un noyau central du langage avec ses symboles, puis un programme qui s'exécute.">
      <svg viewBox="0 0 520 240" aria-hidden="true" focusable="false">
        <g class="hero-cpp__links" aria-hidden="true">
          <path class="hero-cpp__stream hero-cpp__stream--a" d="M 148 94 C 182 94 200 88 222 94"></path>
          <path class="hero-cpp__stream hero-cpp__stream--b" d="M 148 150 C 182 150 200 156 222 150"></path>
          <path class="hero-cpp__stream hero-cpp__stream--c" d="M 298 94 C 322 94 340 88 372 94"></path>
          <path class="hero-cpp__stream hero-cpp__stream--d" d="M 298 150 C 322 150 340 156 372 150"></path>
        </g>

        <g class="hero-cpp__particles" aria-hidden="true">
          <circle class="hero-cpp__particle hero-cpp__particle--a" r="4.5"></circle>
          <circle class="hero-cpp__particle hero-cpp__particle--b" r="4.5"></circle>
          <circle class="hero-cpp__particle hero-cpp__particle--c" r="4.5"></circle>
          <circle class="hero-cpp__particle hero-cpp__particle--d" r="4.5"></circle>
        </g>

        <g class="hero-cpp__card hero-cpp__card--source">
          <rect class="hero-cpp__card-panel hero-cpp__card-panel--source" x="24" y="46" width="124" height="148" rx="16"></rect>
          <text class="hero-cpp__card-title" x="42" y="70" text-anchor="start">main.cpp</text>
          <text class="hero-cpp__card-subtitle" x="42" y="88" text-anchor="start">source</text>
          <rect class="hero-cpp__code-line hero-cpp__code-line--long" x="42" y="106" width="78" height="8" rx="4"></rect>
          <rect class="hero-cpp__code-line hero-cpp__code-line--mid" x="42" y="126" width="62" height="8" rx="4"></rect>
          <rect class="hero-cpp__code-line hero-cpp__code-line--short" x="42" y="146" width="48" height="8" rx="4"></rect>
          <rect class="hero-cpp__code-line hero-cpp__code-line--long" x="42" y="166" width="86" height="8" rx="4"></rect>
        </g>

        <g class="hero-cpp__core">
          <circle class="hero-cpp__halo" cx="260" cy="122" r="68"></circle>
          <circle class="hero-cpp__orbit hero-cpp__orbit--outer" cx="260" cy="122" r="56"></circle>
          <circle class="hero-cpp__orbit hero-cpp__orbit--inner" cx="260" cy="122" r="42"></circle>

          <g class="hero-cpp__rotor hero-cpp__rotor--outer">
            <g transform="translate(260 122)">
              <g transform="translate(0 -70)">
                <rect class="hero-cpp__token-pill" x="-18" y="-10" width="36" height="20" rx="10"></rect>
                <text class="hero-cpp__token-label" x="0" y="1">&lt;&gt;</text>
              </g>
              <g transform="translate(62 22)">
                <rect class="hero-cpp__token-pill" x="-16" y="-10" width="32" height="20" rx="10"></rect>
                <text class="hero-cpp__token-label" x="0" y="1">::</text>
              </g>
              <g transform="translate(-56 36)">
                <rect class="hero-cpp__token-pill" x="-14" y="-10" width="28" height="20" rx="10"></rect>
                <text class="hero-cpp__token-label" x="0" y="1">&amp;</text>
              </g>
            </g>
          </g>

          <g class="hero-cpp__rotor hero-cpp__rotor--inner">
            <g transform="translate(260 122)">
              <g transform="translate(-48 -10)">
                <rect class="hero-cpp__token-pill hero-cpp__token-pill--small" x="-13" y="-9" width="26" height="18" rx="9"></rect>
                <text class="hero-cpp__token-label hero-cpp__token-label--small" x="0" y="1">*</text>
              </g>
              <g transform="translate(36 -28)">
                <rect class="hero-cpp__token-pill hero-cpp__token-pill--small" x="-17" y="-9" width="34" height="18" rx="9"></rect>
                <text class="hero-cpp__token-label hero-cpp__token-label--small" x="0" y="1">std</text>
              </g>
              <g transform="translate(12 44)">
                <rect class="hero-cpp__token-pill hero-cpp__token-pill--small" x="-16" y="-9" width="32" height="18" rx="9"></rect>
                <text class="hero-cpp__token-label hero-cpp__token-label--small" x="0" y="1">{}</text>
              </g>
            </g>
          </g>

          <circle class="hero-cpp__core-node" cx="260" cy="122" r="31"></circle>
          <text class="hero-cpp__core-text" x="260" y="118">C++</text>
          <text class="hero-cpp__core-subtext" x="260" y="138">langage</text>
        </g>

        <g class="hero-cpp__card hero-cpp__card--run">
          <rect class="hero-cpp__card-panel hero-cpp__card-panel--run" x="372" y="46" width="124" height="148" rx="16"></rect>
          <text class="hero-cpp__card-title" x="390" y="70" text-anchor="start">./app</text>
          <text class="hero-cpp__card-subtitle" x="390" y="88" text-anchor="start">execution</text>
          <rect class="hero-cpp__output-line hero-cpp__output-line--long" x="390" y="108" width="84" height="9" rx="4.5"></rect>
          <rect class="hero-cpp__output-line hero-cpp__output-line--mid" x="390" y="130" width="66" height="9" rx="4.5"></rect>
          <rect class="hero-cpp__output-line hero-cpp__output-line--short" x="390" y="152" width="50" height="9" rx="4.5"></rect>
          <rect class="hero-cpp__output-line hero-cpp__output-line--long" x="390" y="174" width="92" height="9" rx="4.5"></rect>
        </g>
      </svg>
    </div>
  `,
  stats: [
    { value: "17", label: "chapitres progressifs" },
    { value: "55+", label: "objectifs et checklists" },
    { value: "33", label: "exercices guidés" },
    { value: "C++20", label: "base de compilation recommandée" }
  ]
});
})(window);
