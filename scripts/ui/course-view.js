(function initialiseCourseAppCourseView(globalScope) {
const { escapeHtml } = globalScope.CourseAppStrings || {};

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

  container.innerHTML = `
    <div class="hero__layout">
      <div class="hero__copy">
        <p class="eyebrow">Studio de révision</p>
        <h2 class="hero__title">${courseMeta.title}</h2>
        <p class="hero__lead">${courseMeta.description}</p>

        <div class="hero__spotlight">
          <span class="hero__spotlight-label">Chapitre courant</span>
          <strong>${currentChapter ? `${currentChapter.order}. ${currentChapter.title}` : "Parcours masqué par les filtres"}</strong>
          <p>${currentSummary}</p>
        </div>

        <div class="hero__meta">
          <span class="meta-chip meta-chip--teal">${filterLabel}</span>
          ${search
            ? `<span class="meta-chip">Recherche : ${escapeHtml(search)}</span>`
            : `<span class="meta-chip">${courseStat}</span>`}
        </div>

        <div class="hero-actions">
          <button class="action-button action-button--primary" type="button" data-action="resume">
            ${completedCount === chapters.length ? "Revoir un chapitre" : "Continuer le parcours"}
          </button>
          <button class="action-button action-button--outline" type="button" data-action="ask-more">
            ${assistantAvailable ? "Créer une série d'exercices" : "Préparer un prompt d'exercices"}
          </button>
        </div>
      </div>

      <aside class="hero-focus">
        <p class="eyebrow">Cap du moment</p>
        <div class="hero-focus__lead">
          <span class="hero-focus__label">Prochaine étape</span>
          <strong>${nextStepLabel}</strong>
          <p>${nextStepText}</p>
        </div>

        <div class="hero-facts">
          ${heroFacts
            .map(
              (fact) => `
                <article class="hero-fact">
                  <span>${fact.label}</span>
                  <strong>${fact.value}</strong>
                </article>
              `
            )
            .join("")}
        </div>

        <p class="hero-focus__note">
          ${assistantAvailable ? "Assistant connecté" : "Mode autonome"} · ${currentChapter ? currentChapter.duration : "Rythme libre"}
        </p>
      </aside>
    </div>
  `;
}

function renderOverview(container, {
  chapters,
  currentChapter,
  doneSet,
  filtersActive,
  level,
  nextChapter,
  search,
  visibleChapters
}) {
  const remainingVisible = visibleChapters.filter((chapter) => !doneSet.has(chapter.id));
  const suggestedChapter = remainingVisible[0] || currentChapter || visibleChapters[0] || nextChapter || null;
  const focusList = (remainingVisible.length ? remainingVisible : visibleChapters).slice(0, 3);
  const filterLabel = search
    ? `Recherche active : ${escapeHtml(search)}`
    : level === "all"
      ? "Tous les niveaux"
      : `Filtre : ${level}`;
  const levelDistribution = [
    "Fondations",
    "Intermédiaire",
    "Avancé",
    "Projet"
  ].map((levelName) => ({
    level: levelName,
    count: visibleChapters.filter((chapter) => chapter.level === levelName).length
  })).filter((entry) => entry.count > 0);

  container.innerHTML = `
    <div class="overview-panel__head">
      <div>
        <p class="eyebrow">Tableau de bord</p>
        <h2>Plan de révision immédiat</h2>
        <p class="chapter-head__summary">
          Ce panneau sert à décider quoi faire maintenant : reprendre le bon chapitre,
          repérer les zones encore fragiles et comprendre ce que tes filtres affichent vraiment.
        </p>
      </div>

      <div class="overview-panel__toolbar">
        <span class="meta-chip">${visibleChapters.length}/${chapters.length} chapitres affichés</span>
        <span class="meta-chip">${filterLabel}</span>
        ${filtersActive ? `
          <button class="ghost-button ghost-button--compact" type="button" data-action="reset-filters">
            Effacer les filtres
          </button>
        ` : ""}
      </div>
    </div>

    <div class="overview-dashboard">
      <article class="overview-card overview-card--primary">
        <span class="overview-card__eyebrow">Maintenant</span>
        <h3>${suggestedChapter ? `${suggestedChapter.order}. ${suggestedChapter.title}` : "Aucun chapitre visible"}</h3>
        <p>
          ${suggestedChapter
            ? (doneSet.has(suggestedChapter.id)
              ? "Le parcours visible est déjà bien avancé. Tu peux rouvrir ce chapitre pour consolider les détails ou repartir sur un autre angle de révision."
              : "C'est le chapitre le plus logique à ouvrir maintenant dans la vue courante : il reste visible, non validé et directement actionnable.")
            : "La recherche masque tout le contenu pour l'instant. Repars d'un filtre plus large pour retrouver un plan de travail clair."}
        </p>
        <div class="overview-card__actions">
          ${suggestedChapter ? `
            <button class="action-button action-button--primary" type="button" data-chapter-id="${suggestedChapter.id}">
              Ouvrir ce chapitre
            </button>
          ` : `
            <button class="action-button action-button--primary" type="button" data-action="reset-filters">
              Réafficher le parcours
            </button>
          `}
          ${currentChapter ? `
            <button class="ghost-button" type="button" data-chapter-id="${currentChapter.id}">
              Revenir au chapitre courant
            </button>
          ` : ""}
        </div>
      </article>

      <article class="overview-card">
        <span class="overview-card__eyebrow">À consolider</span>
        <h3>${remainingVisible.length ? `${remainingVisible.length} chapitre(s) encore à travailler` : "Vue actuelle validée"}</h3>
        ${focusList.length ? `
          <div class="overview-list">
            ${focusList.map((chapter) => `
              <button class="overview-link" type="button" data-chapter-id="${chapter.id}">
                <span class="overview-link__title">${chapter.order}. ${chapter.shortTitle}</span>
                <span class="overview-link__meta">${chapter.level} · ${chapter.duration}</span>
              </button>
            `).join("")}
          </div>
        ` : `
          <p class="overview-card__empty">
            Tous les chapitres visibles sont déjà validés. Tu peux élargir les filtres ou utiliser le glossaire en mode quiz pour changer de rythme.
          </p>
        `}
      </article>

      <article class="overview-card">
        <span class="overview-card__eyebrow">Lecture rapide</span>
        <h3>Répartition de la vue courante</h3>
        <div class="overview-levels">
          ${levelDistribution.length ? levelDistribution.map((entry) => `
            <div class="overview-level">
              <span>${entry.level}</span>
              <strong>${entry.count}</strong>
            </div>
          `).join("") : `
            <p class="overview-card__empty">Aucun niveau visible avec les filtres actuels.</p>
          `}
        </div>
        <p class="overview-card__hint">
          ${remainingVisible.length
            ? "Astuce : valide les chapitres au fil de l'eau pour transformer ce bloc en vrai radar de révision."
            : "Astuce : une vue entièrement validée est idéale pour relancer un sprint de quiz ou d'exercices."}
        </p>
      </article>
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

function renderChecklistTab(chapter) {
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
        <h3>Ce qu'un enseignant attend souvent</h3>
        <p>
          Être capable d'expliquer à voix haute le <em>pourquoi</em> derrière la syntaxe. En C++, réciter un mot-clé
          ne suffit pas ; il faut relier la forme au contrat, à la durée de vie ou au coût.
        </p>
        <p>
          Pour réviser efficacement, prends chaque point ci-dessus et cherche un mini-exemple concret où il te
          permettrait d'éviter un bug ou de clarifier une API.
        </p>
      </article>
    </div>
  `;
}

function renderQuizTab(chapter) {
  if (!chapter.quiz.length) {
    return `
      <div class="empty-state">
        <h3>Quiz indisponible</h3>
        <p>Ce chapitre n'a pas encore de quiz. Utilise la checklist ou les exercices pour réviser.</p>
      </div>
    `;
  }

  return `
    <div class="quiz-grid">
      ${chapter.quiz
        .map(
          (item, index) => `
            <article class="quiz-card" data-quiz-card="${index}">
              <h3>Question ${index + 1}</h3>
              <p>${item.question}</p>
              <div class="quiz-option-list">
                ${item.options
                  .map(
                    (option, optionIndex) => `
                      <button
                        class="quiz-option"
                        type="button"
                        data-quiz-index="${index}"
                        data-option-index="${optionIndex}"
                        data-is-correct="${optionIndex === item.answer ? "true" : "false"}"
                      >
                        ${option}
                      </button>
                    `
                  )
                  .join("")}
              </div>
              <div class="quiz-feedback" hidden>${item.explanation}</div>
            </article>
          `
        )
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

function renderActiveTab(chapter, activeTab, assistantAvailable) {
  if (activeTab === "checklist") {
    return renderChecklistTab(chapter);
  }

  if (activeTab === "quiz") {
    return renderQuizTab(chapter);
  }

  if (activeTab === "exercises") {
    return renderExercisesTab(chapter, assistantAvailable);
  }

  return `<div class="tab-panel">${chapter.body}</div>`;
}

function renderChapterPanel(container, {
  assistantAvailable,
  chapter,
  doneSet,
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

    <div class="course-tabbar">
      ${Object.entries(tabLabels)
        .map(
          ([tabId, label]) => `
            <button
              class="tab-button ${tab === tabId ? "is-active" : ""}"
              type="button"
              data-tab-id="${tabId}"
              aria-pressed="${tab === tabId ? "true" : "false"}"
            >
              ${label}
            </button>
          `
        )
        .join("")}
    </div>

    ${renderActiveTab(chapter, tab, assistantAvailable)}
  `;
}

globalScope.CourseAppCourseView = {
  levelChipClass,
  renderChapterPanel,
  renderFilters,
  renderHero,
  renderOverview,
  renderSidebar
};
})(window);
