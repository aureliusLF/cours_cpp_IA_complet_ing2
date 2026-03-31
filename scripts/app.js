(function initialiseCourseApp(globalScope) {
const { buildGlossaryEntries } = globalScope.CourseAppGlossaryStudy || {};
const { highlightCodeBlocks } = globalScope.CourseAppHighlight || {};
const { escapeHtml, normalise } = globalScope.CourseAppStrings || {};
const {
  createSeed,
  createDefaultState,
  loadState,
  saveState,
  sanitiseState
} = globalScope.CourseAppStorage || {};
const {
  renderChapterPanel,
  renderFilters,
  renderHero,
  renderOverview,
  renderSidebar
} = globalScope.CourseAppCourseView || {};
const {
  filterGlossaryEntries,
  renderGlossary,
  syncGlossaryState
} = globalScope.CourseAppGlossaryView || {};

function init() {
  if (
    !buildGlossaryEntries ||
    !highlightCodeBlocks ||
    !escapeHtml ||
    !normalise ||
    !createSeed ||
    !createDefaultState ||
    !loadState ||
    !saveState ||
    !sanitiseState ||
    !renderChapterPanel ||
    !renderFilters ||
    !renderHero ||
    !renderOverview ||
    !renderSidebar ||
    !filterGlossaryEntries ||
    !renderGlossary ||
    !syncGlossaryState
  ) {
    console.error("Les scripts applicatifs ne sont pas tous chargés. Vérifie l'ordre des balises <script> dans index.html.");
    return;
  }

  const data = globalScope.COURSE_DATA;

  if (!data || !Array.isArray(data.chapters)) {
    console.error("COURSE_DATA est indisponible. Vérifie que scripts/course-data.js est bien chargé avant scripts/app.js.");
    return;
  }

  const { courseMeta, chapters } = data;
  const glossary = buildGlossaryEntries(data.glossary || []);

  const tabLabels = {
    cours: "Cours",
    checklist: "Checklist",
    quiz: "Quiz",
    exercises: "Exercices"
  };

  const levelOptions = [
    { id: "all", label: "Tous" },
    { id: "Fondations", label: "Fondations" },
    { id: "Intermédiaire", label: "Intermédiaire" },
    { id: "Avancé", label: "Avancé" },
    { id: "Projet", label: "Projet" }
  ];

  const requiredElementIds = {
    chapterNav: "chapterNav",
    chapterPanel: "chapterPanel",
    glossaryPanel: "glossaryPanel",
    hero: "hero",
    levelFilters: "levelFilters",
    overview: "overview",
    progressFill: "progressFill",
    progressLabel: "progressLabel",
    searchInput: "searchInput",
    visibleCount: "visibleCount"
  };

  const elements = Object.fromEntries(
    Object.entries(requiredElementIds).map(([key, id]) => [key, document.getElementById(id)])
  );

  elements.assistantPanel = document.getElementById("assistantPanel");
  elements.resetFiltersButton = document.getElementById("resetFiltersButton");

  const missingElements = Object.entries(requiredElementIds)
    .filter(([key]) => !elements[key])
    .map(([, id]) => id);

  if (missingElements.length > 0) {
    console.error(
      `Impossible d'initialiser l'interface. Éléments manquants dans le HTML : ${missingElements.join(", ")}`
    );
    return;
  }

  const validChapterIds = new Set(chapters.map((chapter) => chapter.id));
  const validGlossaryIds = new Set(glossary.map((entry) => entry.id));
  const validLevelIds = new Set(levelOptions.map((option) => option.id));
  const validTabIds = new Set(Object.keys(tabLabels));

  const defaultState = createDefaultState(
    getHashChapterId(validChapterIds) || (chapters.length > 0 ? chapters[0].id : null)
  );

  const storedState = loadState();
  const hashChapterId = getHashChapterId(validChapterIds);

  const state = sanitiseState(
    Object.assign({}, defaultState, storedState, {
      currentChapterId: hashChapterId || storedState.currentChapterId || defaultState.currentChapterId
    }),
    {
      defaultState,
      validChapterIds,
      validGlossaryIds,
      validLevelIds,
      validTabIds
    }
  );

  let assistantPrompt = "";
  let assistantContext = "";
  let assistantFeedback = "";

  syncHash(state.currentChapterId);

  function getHashChapterId(validIds) {
    const hash = window.location.hash.replace(/^#/, "");
    return validIds.has(hash) ? hash : null;
  }

  function syncHash(chapterId) {
    if (!chapterId) {
      return;
    }

    const nextHash = `#${chapterId}`;
    if (window.location.hash === nextHash) {
      return;
    }

    try {
      if (window.history && typeof window.history.replaceState === "function") {
        window.history.replaceState(null, "", nextHash);
      } else {
        window.location.hash = chapterId;
      }
    } catch {
      window.location.hash = chapterId;
    }
  }

  function completedSet() {
    return new Set(state.completedIds);
  }

  function getVisibleChapters() {
    const query = normalise(state.search);

    return chapters.filter((chapter) => {
      const levelMatch = state.level === "all" || chapter.level === state.level;
      const searchMatch = !query || chapter.searchText.includes(query);
      return levelMatch && searchMatch;
    });
  }

  function ensureCurrentChapterIsVisible() {
    const visible = getVisibleChapters();
    if (visible.length === 0) {
      return null;
    }

    const currentChapter = visible.find((chapter) => chapter.id === state.currentChapterId);
    if (currentChapter) {
      return currentChapter;
    }

    state.currentChapterId = visible[0].id;
    syncHash(state.currentChapterId);
    return visible[0];
  }

  function getCurrentChapter() {
    return ensureCurrentChapterIsVisible();
  }

  function getCompletionRatio() {
    if (chapters.length === 0) {
      return 0;
    }

    return Math.round((completedSet().size / chapters.length) * 100);
  }

  function firstIncompleteChapter() {
    const done = completedSet();
    return chapters.find((chapter) => !done.has(chapter.id)) || null;
  }

  function getAdjacentVisibleChapter(offset) {
    const visible = getVisibleChapters();
    const currentIndex = visible.findIndex((chapter) => chapter.id === state.currentChapterId);
    if (currentIndex === -1) {
      return null;
    }

    return visible[currentIndex + offset] || null;
  }

  function getVisibleGlossaryEntries() {
    return filterGlossaryEntries(glossary, state.glossarySearch);
  }

  function scrollToChapterPanel() {
    elements.chapterPanel.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function updateProgressBar() {
    const progress = getCompletionRatio();
    elements.progressFill.style.width = `${progress}%`;
    elements.progressLabel.textContent = `${progress}%`;

    const progressTrack = elements.progressFill.parentElement;
    if (progressTrack) {
      progressTrack.setAttribute("aria-valuenow", String(progress));
    }
  }

  async function copyText(text) {
    if (navigator.clipboard && typeof navigator.clipboard.writeText === "function") {
      try {
        await navigator.clipboard.writeText(text);
        return true;
      } catch {
        // Fallback DOM juste après.
      }
    }

    try {
      const textarea = document.createElement("textarea");
      textarea.value = text;
      textarea.setAttribute("readonly", "");
      textarea.style.position = "absolute";
      textarea.style.left = "-9999px";
      document.body.appendChild(textarea);
      textarea.select();
      const didCopy = document.execCommand("copy");
      textarea.remove();
      return didCopy;
    } catch {
      return false;
    }
  }

  function showAssistantPrompt(prompt, context) {
    assistantPrompt = prompt;
    assistantContext = context || "";
    renderAssistantPanel();

    if (elements.assistantPanel) {
      elements.assistantPanel.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  function hideAssistantPrompt() {
    assistantPrompt = "";
    assistantContext = "";
    assistantFeedback = "";
    renderAssistantPanel();
  }

  function renderAssistantPanel() {
    if (!elements.assistantPanel) {
      return;
    }

    if (!assistantPrompt) {
      elements.assistantPanel.hidden = true;
      elements.assistantPanel.classList.add("is-hidden");
      elements.assistantPanel.innerHTML = "";
      return;
    }

    elements.assistantPanel.hidden = false;
    elements.assistantPanel.classList.remove("is-hidden");
    elements.assistantPanel.innerHTML = `
      <div class="assistant-panel__head">
        <div>
          <p class="eyebrow">Aide à la pratique</p>
          <h2>Prompt prêt à utiliser</h2>
          <p>
            ${assistantContext ? `Basé sur "${escapeHtml(assistantContext)}".` : "Le support n'est pas relié à un assistant externe dans ce navigateur."}
          </p>
        </div>
        <button class="ghost-button ghost-button--compact" type="button" data-action="dismiss-assistant">
          Fermer
        </button>
      </div>

      <p class="assistant-panel__hint">
        ${escapeHtml(
          assistantFeedback ||
            "Copie ce prompt et colle-le dans l'assistant de ton choix pour obtenir une série d'exercices détaillée."
        )}
      </p>

      <pre class="assistant-panel__prompt"><code>${escapeHtml(assistantPrompt)}</code></pre>

      <div class="assistant-panel__actions">
        <button class="action-button action-button--primary" type="button" data-action="copy-assistant-prompt">
          Copier le prompt
        </button>
        <a class="action-button action-button--outline" href="#chapterPanel">Retour au chapitre</a>
      </div>
    `;
  }

  function askForMoreExercises(scope) {
    const chapter = getCurrentChapter();
    const chapterTitle = scope || (chapter ? chapter.title : "C++ ING2");
    const prompt =
      `Je révise le chapitre "${chapterTitle}". ` +
      "Génère-moi une série d'exercices progressifs en français avec corrigés indicatifs, " +
      "en couvrant les pièges classiques, une version challenge et les points de vigilance à vérifier.";

    if (typeof window.sendPrompt === "function") {
      window.sendPrompt(prompt);
      hideAssistantPrompt();
      return;
    }

    copyText(prompt).then((copied) => {
      assistantFeedback = copied
        ? "Le prompt a été copié dans le presse-papiers et reste affiché ici si tu veux le relire."
        : "Le prompt est affiché ci-dessous. Si la copie automatique a échoué, tu peux le copier manuellement.";
      showAssistantPrompt(prompt, chapterTitle);
    });
  }

  function goToChapter(chapterId, shouldScroll = true) {
    if (!validChapterIds.has(chapterId)) {
      return;
    }

    state.currentChapterId = chapterId;
    state.tab = "cours";
    syncHash(chapterId);
    saveState(state);
    render();

    if (shouldScroll) {
      scrollToChapterPanel();
    }
  }

  function goToAdjacentChapter(offset) {
    const target = getAdjacentVisibleChapter(offset);
    if (target) {
      goToChapter(target.id);
    }
  }

  function toggleCurrentChapterCompletion() {
    const chapter = getCurrentChapter();
    if (!chapter) {
      return;
    }

    if (completedSet().has(chapter.id)) {
      state.completedIds = state.completedIds.filter((id) => id !== chapter.id);
    } else {
      state.completedIds = state.completedIds.concat(chapter.id);
    }

    saveState(state);
    render();
  }

  function resumeProgress() {
    const visible = getVisibleChapters();
    const source = visible.length > 0 ? visible : chapters;
    const done = completedSet();
    const target = source.find((chapter) => !done.has(chapter.id)) || source[0];

    if (target) {
      goToChapter(target.id);
    }
  }

  function resetFilters() {
    state.search = "";
    state.level = "all";
    render();
  }

  function resetGlossaryView() {
    state.glossarySearch = "";
    state.glossaryCardIndex = 0;
    state.glossaryCardFace = "front";
    state.glossaryCardSeed = createSeed();
    state.glossaryQuizIndex = 0;
    state.glossaryQuizSelectedId = "";
    state.glossaryQuizSeed = createSeed();
    saveState(state);
    render();
  }

  function setGlossaryMode(mode) {
    if (!["list", "flashcards", "quiz"].includes(mode)) {
      return;
    }

    state.glossaryMode = mode;
    state.glossaryCardFace = "front";
    state.glossaryCardSeed = createSeed();
    state.glossaryCardIndex = 0;
    state.glossaryQuizSelectedId = "";
    state.glossaryQuizSeed = createSeed();
    state.glossaryQuizIndex = 0;
    saveState(state);
    render();
  }

  function moveGlossaryCard(offset) {
    const entries = getVisibleGlossaryEntries();
    if (!entries.length) {
      return;
    }

    const nextIndex = state.glossaryCardIndex + offset;
    state.glossaryCardIndex = (nextIndex + entries.length) % entries.length;
    state.glossaryCardFace = "front";
    saveState(state);
    render();
  }

  function flipGlossaryCard() {
    state.glossaryCardFace = state.glossaryCardFace === "front" ? "back" : "front";
    saveState(state);
    render();
  }

  function shuffleGlossaryCards() {
    state.glossaryCardSeed = createSeed();
    state.glossaryCardIndex = 0;
    state.glossaryCardFace = "front";
    saveState(state);
    render();
  }

  function markGlossaryEntry(entryId, known) {
    if (!validGlossaryIds.has(entryId)) {
      return;
    }

    const knownSet = new Set(state.glossaryKnownIds);
    if (known) {
      knownSet.add(entryId);
    } else {
      knownSet.delete(entryId);
    }

    state.glossaryKnownIds = Array.from(knownSet);
    saveState(state);
    render();
  }

  function selectGlossaryQuizAnswer(optionId) {
    if (typeof optionId !== "string" || optionId.length === 0) {
      return;
    }

    state.glossaryQuizSelectedId = optionId;
    saveState(state);
    render();
  }

  function nextGlossaryQuizQuestion() {
    const entries = getVisibleGlossaryEntries();
    if (!entries.length) {
      return;
    }

    if (state.glossaryQuizIndex >= entries.length - 1) {
      state.glossaryQuizIndex = 0;
      state.glossaryQuizSeed = createSeed();
    } else {
      state.glossaryQuizIndex += 1;
    }

    state.glossaryQuizSelectedId = "";
    saveState(state);
    render();
  }

  function isTypingTarget(target) {
    return Boolean(
      target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.tagName === "SELECT" ||
          target.isContentEditable)
    );
  }

  function render() {
    const visibleChapters = getVisibleChapters();
    const currentChapter = getCurrentChapter();
    const doneSet = completedSet();
    const visibleGlossaryEntries = getVisibleGlossaryEntries();

    syncGlossaryState(state, visibleGlossaryEntries);

    elements.searchInput.value = state.search;

    renderFilters(elements.levelFilters, levelOptions, state.level);
    renderSidebar(elements.chapterNav, elements.visibleCount, {
      chapters,
      visibleChapters,
      currentChapterId: currentChapter ? currentChapter.id : "",
      doneSet
    });
    renderHero(elements.hero, {
      assistantAvailable: typeof window.sendPrompt === "function",
      chapters,
      completedCount: doneSet.size,
      courseMeta,
      currentChapter,
      search: state.search,
      level: state.level,
      progress: getCompletionRatio(),
      nextChapter: firstIncompleteChapter(),
      visibleCount: visibleChapters.length
    });
    renderOverview(elements.overview, {
      chapters,
      currentChapter,
      doneSet,
      filtersActive: state.level !== "all" || state.search.trim() !== "",
      level: state.level,
      nextChapter: firstIncompleteChapter(),
      search: state.search,
      visibleChapters
    });
    renderChapterPanel(elements.chapterPanel, {
      assistantAvailable: typeof window.sendPrompt === "function",
      chapter: currentChapter,
      doneSet,
      tab: state.tab,
      tabLabels,
      visibleChapters
    });
    highlightCodeBlocks(elements.chapterPanel);

    renderGlossary(elements.glossaryPanel, {
      entries: visibleGlossaryEntries,
      state
    });
    highlightCodeBlocks(elements.glossaryPanel);

    renderAssistantPanel();
    updateProgressBar();
    saveState(state);
  }

  elements.searchInput.value = state.search;

  document.addEventListener("input", (event) => {
    if (event.target === elements.searchInput) {
      state.search = event.target.value;
      render();
      return;
    }

    if (event.target.id === "glossarySearch") {
      state.glossarySearch = event.target.value;
      state.glossaryCardIndex = 0;
      state.glossaryCardFace = "front";
      state.glossaryCardSeed = createSeed();
      state.glossaryQuizIndex = 0;
      state.glossaryQuizSelectedId = "";
      state.glossaryQuizSeed = createSeed();
      render();
    }
  });

  if (elements.resetFiltersButton) {
    elements.resetFiltersButton.addEventListener("click", () => {
      resetFilters();
    });
  }

  document.addEventListener("click", (event) => {
    const levelFilter = event.target.closest("[data-level-filter]");
    if (levelFilter) {
      state.level = levelFilter.dataset.levelFilter;
      render();
      return;
    }

    const chapterTrigger = event.target.closest("[data-chapter-id]");
    if (chapterTrigger) {
      goToChapter(chapterTrigger.dataset.chapterId);
      return;
    }

    const tabTrigger = event.target.closest("[data-tab-id]");
    if (tabTrigger) {
      state.tab = tabTrigger.dataset.tabId;
      render();
      return;
    }

    const actionTrigger = event.target.closest("[data-action]");
    if (actionTrigger) {
      const action = actionTrigger.dataset.action;

      if (action === "resume") {
        resumeProgress();
        return;
      }

      if (action === "toggle-complete") {
        toggleCurrentChapterCompletion();
        return;
      }

      if (action === "ask-more") {
        askForMoreExercises();
        return;
      }

      if (action === "reset-filters") {
        resetFilters();
        return;
      }

      if (action === "previous-chapter") {
        goToAdjacentChapter(-1);
        return;
      }

      if (action === "next-chapter") {
        goToAdjacentChapter(1);
        return;
      }

      if (action === "reset-glossary") {
        resetGlossaryView();
        return;
      }

      if (action === "set-glossary-mode") {
        setGlossaryMode(actionTrigger.dataset.glossaryMode);
        return;
      }

      if (action === "glossary-prev") {
        moveGlossaryCard(-1);
        return;
      }

      if (action === "glossary-next") {
        moveGlossaryCard(1);
        return;
      }

      if (action === "glossary-flip") {
        flipGlossaryCard();
        return;
      }

      if (action === "glossary-shuffle") {
        shuffleGlossaryCards();
        return;
      }

      if (action === "glossary-mark-known") {
        markGlossaryEntry(actionTrigger.dataset.glossaryEntryId, true);
        return;
      }

      if (action === "glossary-mark-review") {
        markGlossaryEntry(actionTrigger.dataset.glossaryEntryId, false);
        return;
      }

      if (action === "glossary-quiz-answer") {
        if (!state.glossaryQuizSelectedId) {
          selectGlossaryQuizAnswer(actionTrigger.dataset.glossaryOptionId);
        }
        return;
      }

      if (action === "glossary-quiz-next") {
        nextGlossaryQuizQuestion();
        return;
      }

      if (action === "dismiss-assistant") {
        hideAssistantPrompt();
        return;
      }

      if (action === "copy-assistant-prompt" && assistantPrompt) {
        copyText(assistantPrompt).then((copied) => {
          assistantFeedback = copied
            ? "Le prompt a bien été copié dans le presse-papiers."
            : "La copie automatique a échoué. Tu peux sélectionner le texte affiché ci-dessus.";
          renderAssistantPanel();
        });
      }
    }

    const exerciseTrigger = event.target.closest("[data-exercise-title]");
    if (exerciseTrigger) {
      askForMoreExercises(exerciseTrigger.dataset.exerciseTitle);
      return;
    }

    const quizButton = event.target.closest(".quiz-option");
    if (quizButton && !quizButton.hasAttribute("data-action")) {
      const card = quizButton.closest(".quiz-card");
      if (!card || card.dataset.answered === "true") {
        return;
      }

      card.dataset.answered = "true";
      const allOptions = card.querySelectorAll(".quiz-option");
      allOptions.forEach((option) => {
        option.disabled = true;
        if (option.dataset.isCorrect === "true") {
          option.classList.add("is-correct");
        }
      });

      if (quizButton.dataset.isCorrect !== "true") {
        quizButton.classList.add("is-wrong");
      }

      const feedback = card.querySelector(".quiz-feedback");
      if (feedback) {
        feedback.hidden = false;
      }
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "/" && !isTypingTarget(event.target)) {
      event.preventDefault();
      elements.searchInput.focus();
      elements.searchInput.select();
      return;
    }

    if (event.key === "Escape") {
      if (document.activeElement === elements.searchInput) {
        elements.searchInput.blur();
      }

      if (assistantPrompt) {
        hideAssistantPrompt();
      }
    }
  });

  window.addEventListener("hashchange", () => {
    const chapterId = getHashChapterId(validChapterIds);
    if (chapterId && chapterId !== state.currentChapterId) {
      state.currentChapterId = chapterId;
      state.tab = "cours";
      render();
    }
  });

  render();
}

if (globalScope.COURSE_DATA) {
  init();
} else {
  globalScope.addEventListener("DOMContentLoaded", init, { once: true });
}
})(window);
