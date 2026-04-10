(function initialiseCourseAppCourseView(globalScope) {
const { escapeHtml } = globalScope.CourseAppStrings || {};
const COURSE_TAB_GROUP = "course";

function courseTabId(tabId) {
  return `course-tab-${tabId}`;
}

function courseTabPanelId(tabId) {
  return `course-tabpanel-${tabId}`;
}

function levelChipClass(level) {
  if (level === "Fondations") {
    return "meta-chip meta-chip--teal";
  }

  if (level === "Projet") {
    return "meta-chip meta-chip--accent";
  }

  return "meta-chip meta-chip--gold";
}

function renderFilters(container, levelOptions, activeLevel) {
  container.innerHTML = levelOptions
    .map(
      (option) => `
        <button
          class="filter-chip ${activeLevel === option.id ? "is-active" : ""}"
          type="button"
          data-level-filter="${option.id}"
          aria-pressed="${activeLevel === option.id ? "true" : "false"}"
        >
          ${option.label}
        </button>
      `
    )
    .join("");
}

function renderSidebar(container, visibleCountElement, {
  chapters,
  visibleChapters,
  currentChapterId,
  doneSet
}) {
  visibleCountElement.textContent = `${visibleChapters.length}/${chapters.length}`;

  container.innerHTML = visibleChapters.length === 0
    ? `
      <div class="empty-state">
        <h3>Aucun chapitre trouvé</h3>
        <p>Essaie une autre recherche ou retire un filtre pour retrouver le plan complet.</p>
        <button class="action-button action-button--primary" type="button" data-action="reset-filters">
          Afficher tous les chapitres
        </button>
      </div>
    `
    : visibleChapters
        .map(
          (chapter) => `
            <button
              class="chapter-nav__item ${currentChapterId === chapter.id ? "is-active" : ""} ${doneSet.has(chapter.id) ? "is-complete" : ""}"
              type="button"
              data-chapter-id="${chapter.id}"
              aria-current="${currentChapterId === chapter.id ? "true" : "false"}"
            >
              <div class="chapter-nav__topline">
                <span class="chapter-card__number">Chap. ${chapter.order}</span>
                <span class="chapter-nav__time">${chapter.duration}</span>
              </div>
              <p class="chapter-nav__title">${chapter.shortTitle}</p>
              <div class="chapter-nav__footer">
                <span class="${levelChipClass(chapter.level)}">${chapter.level}</span>
                <span class="meta-chip">${chapter.track}</span>
                ${doneSet.has(chapter.id) ? '<span class="meta-chip meta-chip--success">Validé</span>' : ""}
              </div>
            </button>
          `
        )
        .join("");
}

function renderHero(container, {
  assistantAvailable,
  chapters,
  completedCount,
  courseMeta,
  currentChapter,
  search,
  level,
  progress,
  nextChapter,
  visibleCount
}) {
  const filterLabel = level === "all" ? "Tous les niveaux" : level;
  const courseStat = Array.isArray(courseMeta.stats) && courseMeta.stats[0]
    ? `${courseMeta.stats[0].value} ${courseMeta.stats[0].label}`
    : `${chapters.length} chapitres`;

  const heroFacts = [
    { label: "Progression", value: `${progress}%` },
    { label: "Validés", value: `${completedCount}/${chapters.length}` },
    { label: "Visibles", value: `${visibleCount}/${chapters.length}` }
  ];

  const currentSummary = currentChapter
    ? currentChapter.summary
    : "Aucun chapitre ne correspond aux filtres actuels. Efface la recherche pour retrouver le parcours complet.";

  const nextStepLabel = nextChapter ? `Chapitre ${nextChapter.order}` : "Révision ciblée";
  const nextStepText = nextChapter
    ? nextChapter.title
    : "Tous les chapitres sont validés. Tu peux maintenant revenir sur les parties les plus fragiles ou générer une série d'exercices.";

  const terminalContext = {
    nextStepLabel,
    nextStepText,
    progress,
    completedCount,
    visibleCount,
    assistantAvailable,
    chaptersTotal: chapters.length
  };

  const defaultTerminalCode = `<span class="token-keyword">#include</span> <span class="token-string">&lt;ingenieur&gt;</span>
<span class="token-keyword">#include</span> <span class="token-string">&lt;cplusplus&gt;</span>

<span class="token-keyword">int</span> <span class="token-function">main</span>() {
  <span class="token-comment">// Etape :</span>
  target.<span class="token-function">set</span>(<span class="token-string">"${nextStepLabel}"</span>);

  <span class="token-comment">// Progression</span>
  course.<span class="token-function">logStatus</span>({
    completion: <span class="token-number">${progress}</span>,
    validated:  <span class="token-number">${completedCount}</span>,
    visible:    <span class="token-number">${visibleCount}</span>,
    mode:       <span class="token-string">"${assistantAvailable ? 'Assistant' : 'Autonome'}"</span>
  });

  <span class="token-keyword">return</span> course.<span class="token-function">execute</span>();
}`;

  const terminalCode = typeof courseMeta.heroTerminal === "function"
    ? courseMeta.heroTerminal(terminalContext)
    : (typeof courseMeta.heroTerminal === "string" ? courseMeta.heroTerminal : defaultTerminalCode);
  const introVisual = typeof courseMeta.introVisual === "function"
    ? courseMeta.introVisual(terminalContext)
    : courseMeta.introVisual;
  const introMarkup = introVisual
    ? `<div class="hero__intro-visual">${introVisual}</div>`
    : `<p class="hero__lead">${courseMeta.description}</p>`;

  container.innerHTML = `
    <div class="hero__layout">
      <div class="hero__copy">
        <h2 class="hero__title">${courseMeta.title}</h2>
        ${introMarkup}
      </div>

      <aside class="hero-focus hero-focus--terminal">
        <div class="terminal-header">
          <span class="term-dot term-dot--red"></span>
          <span class="term-dot term-dot--yellow"></span>
          <span class="term-dot term-dot--green"></span>
        </div>
        <div class="terminal-body">
<pre><code>${terminalCode}</code></pre>

          <div class="terminal-actions">
            <div class="term-command">
              <span class="token-prompt">~/course $</span>
              <button class="terminal-btn terminal-btn--primary" type="button" data-action="resume">
                ./run --mode=${completedCount === chapters.length ? 'review' : 'continue'}
              </button>
            </div>
            <div class="term-command">
              <span class="token-prompt">~/course $</span>
              <button class="terminal-btn terminal-btn--secondary" type="button" data-action="ask-more">
                ./generate --type=${assistantAvailable ? 'exercises' : 'prompt'}
              </button>
            </div>
          </div>
        </div>
      </aside>
    </div>
  `;
}

function checklistMarkup(items) {
  return `
    <ul class="check-list">
      ${items.map((item) => `<li>${item}</li>`).join("")}
    </ul>
  `;
}

function buildChapterReview(chapter) {
  const review = chapter.review || {};

  return {
    expectations: Array.isArray(review.expectations) && review.expectations.length
      ? review.expectations
      : (Array.isArray(chapter.goals) ? chapter.goals : []),
    commonMistakes: Array.isArray(review.commonMistakes) && review.commonMistakes.length
      ? review.commonMistakes
      : [
        "Réciter la syntaxe sans la relier au contrat, à la durée de vie ou au coût.",
        "Répondre avec un exemple appris par cœur sans vérifier s'il correspond vraiment au cas demandé.",
        "Confondre ce que le compilateur accepte avec ce que la conception justifie réellement."
      ],
    oralCheck: review.oralCheck
      || "Prends un mini-exemple du chapitre et explique à voix haute ce que tu choisis, pourquoi tu le choisis et quel bug ce choix évite."
  };
}

function renderChecklistTab(chapter) {
  const review = buildChapterReview(chapter);

  return `
    <div class="tab-panel">
      <article class="lesson-section">
        <h3>Checklist de maîtrise</h3>
        ${checklistMarkup(chapter.checklist)}
        ${chapter.highlights && chapter.highlights.length ? `
          <div class="exercise-card__chips">
            ${chapter.highlights.map((item) => `<span class="exercise-chip">${item}</span>`).join("")}
          </div>
        ` : ""}
      </article>

      <article class="lesson-section">
        <h3>Ce qu'un enseignant attend sur ce chapitre</h3>
        <p>Les attendus ne sont pas génériques : ils suivent la promesse exacte de ce chapitre.</p>
        ${checklistMarkup(review.expectations)}
      </article>

      <article class="lesson-section">
        <h3>Pièges classiques sur ce chapitre</h3>
        <p>Ce sont les erreurs qui font souvent perdre des points même quand l'idée générale est comprise.</p>
        ${checklistMarkup(review.commonMistakes)}
      </article>

      <article class="lesson-section">
        <h3>Test oral express</h3>
        <p class="review-question">${review.oralCheck}</p>
      </article>
    </div>
  `;
}

function renderQuizTab(chapter, quizAnswers) {
  if (!chapter.quiz.length) {
    return `
      <div class="empty-state">
        <h3>Quiz indisponible</h3>
        <p>Ce chapitre n'a pas encore de quiz. Utilise la checklist ou les exercices pour réviser.</p>
      </div>
    `;
  }

  const answeredCount = chapter.quiz.filter((item, index) => Number.isInteger(quizAnswers[index])).length;

  return `
    <div class="quiz-summary">
      <span class="meta-chip">${answeredCount}/${chapter.quiz.length} répondues</span>
      ${answeredCount > 0 ? `
        <button class="ghost-button ghost-button--compact" type="button" data-action="reset-quiz">
          Réinitialiser le quiz
        </button>
      ` : ""}
    </div>

    <div class="quiz-grid">
      ${chapter.quiz
        .map((item, index) => {
          const selectedOptionIndex = quizAnswers[index];
          const isAnswered = Number.isInteger(selectedOptionIndex);

          return `
            <article class="quiz-card" data-quiz-card="${index}">
              <h3>Question ${index + 1}</h3>
              <p>${item.question}</p>
              <div class="quiz-option-list">
                ${item.options
                  .map((option, optionIndex) => {
                    const isCorrect = optionIndex === item.answer;
                    const isSelected = optionIndex === selectedOptionIndex;
                    const classes = [
                      "quiz-option",
                      isAnswered && isCorrect ? "is-correct" : "",
                      isAnswered && isSelected && !isCorrect ? "is-wrong" : ""
                    ].filter(Boolean).join(" ");

                    return `
                      <button
                        class="${classes}"
                        type="button"
                        data-quiz-index="${index}"
                        data-option-index="${optionIndex}"
                        data-is-correct="${isCorrect ? "true" : "false"}"
                        ${isAnswered ? "disabled" : ""}
                      >
                        ${option}
                      </button>
                    `
                  })
                  .join("")}
              </div>
              <div class="quiz-feedback" ${isAnswered ? "" : "hidden"}>${item.explanation}</div>
            </article>
          `
        })
        .join("")}
    </div>
  `;
}

function renderExercisesTab(chapter, assistantAvailable) {
  const assistantLabel = assistantAvailable
    ? "Générer l'énoncé détaillé"
    : "Obtenir un prompt détaillé";

  if (!chapter.exercises.length) {
    return `
      <div class="empty-state">
        <h3>Aucun exercice pour l'instant</h3>
        <p>Le cours est bien disponible, mais cette partie ne contient pas encore d'exercices dédiés.</p>
      </div>
    `;
  }

  return `
    <div class="exercise-grid">
      ${chapter.exercises
        .map(
          (exercise, index) => `
            <article class="exercise-card">
              <h3>${index + 1}. ${exercise.title}</h3>
              <p class="exercise-card__prompt">${exercise.prompt}</p>
              <ul class="exercise-list">
                ${exercise.deliverables.map((item) => `<li>${item}</li>`).join("")}
              </ul>
              <div class="exercise-card__chips">
                <span class="exercise-chip">${exercise.difficulty}</span>
                <span class="exercise-chip">${exercise.time}</span>
                <button
                  class="exercise-chip exercise-chip--primary"
                  type="button"
                  data-exercise-title="${exercise.title}"
                >
                  ${assistantLabel}
                </button>
              </div>
            </article>
          `
        )
        .join("")}
    </div>
  `;
}

function renderActiveTabPanel(chapter, activeTab, assistantAvailable, quizAnswers) {
  let content = `<div class="tab-panel">${chapter.body}</div>`;

  if (activeTab === "checklist") {
    content = renderChecklistTab(chapter);
  }

  if (activeTab === "quiz") {
    content = renderQuizTab(chapter, quizAnswers);
  }

  if (activeTab === "exercises") {
    content = renderExercisesTab(chapter, assistantAvailable);
  }

  return `
    <section
      id="${courseTabPanelId(activeTab)}"
      class="course-tabpanel"
      role="tabpanel"
      aria-labelledby="${courseTabId(activeTab)}"
      tabindex="0"
    >
      ${content}
    </section>
  `;
}

function renderChapterPanel(container, {
  assistantAvailable,
  chapter,
  doneSet,
  quizAnswers,
  tab,
  tabLabels,
  visibleChapters
}) {
  if (!chapter) {
    container.innerHTML = `
      <div class="empty-state">
        <h3>Rien à afficher pour l'instant</h3>
        <p>La recherche ou le filtre courant masque tous les chapitres. Retire un filtre pour retrouver le contenu.</p>
        <button class="action-button action-button--primary" type="button" data-action="reset-filters">
          Réinitialiser les filtres
        </button>
      </div>
    `;
    return;
  }

  const currentIndex = visibleChapters.findIndex((item) => item.id === chapter.id);
  const previousChapter = currentIndex > 0 ? visibleChapters[currentIndex - 1] : null;
  const nextChapter = currentIndex >= 0 ? visibleChapters[currentIndex + 1] : null;

  container.innerHTML = `
    <div class="chapter-head">
      <div>
        <p class="eyebrow">Chapitre ${chapter.order}</p>
        <h2>${chapter.title}</h2>
        <p class="chapter-head__summary">${chapter.summary}</p>
      </div>

      <div class="chapter-head__aside">
        <div class="chapter-head__badges">
          <span class="${levelChipClass(chapter.level)}">${chapter.level}</span>
          <span class="meta-chip meta-chip--accent">${chapter.track}</span>
          <span class="meta-chip">${chapter.duration}</span>
        </div>
        <div class="chapter-head__status">
          <strong>${doneSet.has(chapter.id) ? "Chapitre validé" : "Chapitre à travailler"}</strong>
          <span>Étape ${currentIndex + 1}/${visibleChapters.length} dans la vue actuelle</span>
        </div>
      </div>
    </div>

    <div class="chapter-head__toolbar">
      <div class="chapter-head__progress">
        <span>Objectif : comprendre le cours, vérifier les acquis puis appliquer.</span>
      </div>

      <div class="chapter-head__actions">
        <button
          class="ghost-button"
          type="button"
          data-action="previous-chapter"
          ${previousChapter ? "" : "disabled"}
        >
          Chapitre précédent
        </button>
        <button class="ghost-button" type="button" data-action="toggle-complete">
          ${doneSet.has(chapter.id) ? "Marquer à revoir" : "Valider le chapitre"}
        </button>
        <button
          class="action-button action-button--primary"
          type="button"
          data-action="next-chapter"
          ${nextChapter ? "" : "disabled"}
        >
          ${nextChapter ? "Chapitre suivant" : "Fin du parcours"}
        </button>
      </div>
    </div>

    <div class="goal-grid">
      ${chapter.goals
        .map(
          (goal, index) => `
            <article class="goal-card">
              <strong>Objectif ${index + 1}</strong>
              <span>${goal}</span>
            </article>
          `
        )
        .join("")}
    </div>

    <div class="course-tabbar" role="tablist" aria-label="Sections du chapitre">
      ${Object.entries(tabLabels)
        .map(
          ([tabId, label]) => `
            <button
              class="tab-button ${tab === tabId ? "is-active" : ""}"
              type="button"
              id="${courseTabId(tabId)}"
              data-tab-id="${tabId}"
              data-tab-group="${COURSE_TAB_GROUP}"
              data-tab-value="${tabId}"
              role="tab"
              aria-selected="${tab === tabId ? "true" : "false"}"
              aria-controls="${courseTabPanelId(tabId)}"
              tabindex="${tab === tabId ? "0" : "-1"}"
            >
              ${label}
            </button>
          `
        )
        .join("")}
    </div>

    ${renderActiveTabPanel(chapter, tab, assistantAvailable, quizAnswers)}
  `;
}

globalScope.CourseAppCourseView = {
  levelChipClass,
  renderChapterPanel,
  renderFilters,
  renderHero,
  renderSidebar
};
})(window);
