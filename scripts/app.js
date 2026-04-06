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
  const searchDebounceMs = 150;
  const courseTabIds = ["cours", "checklist", "quiz", "exercises"];
  const glossaryModeIds = ["list", "flashcards", "quiz"];
  const reducedMotionQuery = typeof globalScope.matchMedia === "function"
    ? globalScope.matchMedia("(prefers-reduced-motion: reduce)")
    : null;

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
  let courseSearchTimer = 0;
  let glossarySearchTimer = 0;
  let glossaryReturnTarget = null;
  let glossaryFocusedEntryId = "";

  syncHash(state.currentChapterId);
  syncCurrentChapterSelection();
  syncGlossaryState(state, getVisibleGlossaryEntries());

  function getHashChapterId(validIds) {
    const hash = globalScope.location.hash.replace(/^#/, "");
    return validIds.has(hash) ? hash : null;
  }

  function syncHash(chapterId) {
    if (!chapterId) {
      return;
    }

    const nextHash = `#${chapterId}`;
    if (globalScope.location.hash === nextHash) {
      return;
    }

    try {
      if (globalScope.history && typeof globalScope.history.replaceState === "function") {
        globalScope.history.replaceState(null, "", nextHash);
      } else {
        globalScope.location.hash = chapterId;
      }
    } catch {
      globalScope.location.hash = chapterId;
    }
  }

  function prefersReducedMotion() {
    return Boolean(reducedMotionQuery && reducedMotionQuery.matches);
  }

  function scrollBehavior() {
    return prefersReducedMotion() ? "auto" : "smooth";
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

  function syncCurrentChapterSelection() {
    const visibleChapters = getVisibleChapters();

    if (visibleChapters.length === 0) {
      return false;
    }

    if (visibleChapters.some((chapter) => chapter.id === state.currentChapterId)) {
      return false;
    }

    state.currentChapterId = visibleChapters[0].id;
    syncHash(state.currentChapterId);
    return true;
  }

  function getCourseViewState() {
    const visibleChapters = getVisibleChapters();
    const currentChapter = visibleChapters.find((chapter) => chapter.id === state.currentChapterId) || null;
    const doneSet = completedSet();

    return {
      currentChapter,
      doneSet,
      nextChapter: firstIncompleteChapter(doneSet),
      progress: getCompletionRatio(doneSet),
      visibleChapters
    };
  }

  function getCompletionRatio(doneSet = completedSet()) {
    if (chapters.length === 0) {
      return 0;
    }

    return Math.round((doneSet.size / chapters.length) * 100);
  }

  function firstIncompleteChapter(doneSet = completedSet()) {
    return chapters.find((chapter) => !doneSet.has(chapter.id)) || null;
  }

  function getAdjacentVisibleChapter(offset) {
    const visibleChapters = getVisibleChapters();
    const currentIndex = visibleChapters.findIndex((chapter) => chapter.id === state.currentChapterId);

    if (currentIndex === -1) {
      return null;
    }

    return visibleChapters[currentIndex + offset] || null;
  }

  function getVisibleGlossaryEntries() {
    return filterGlossaryEntries(glossary, state.glossarySearch);
  }

  function scrollToChapterPanel() {
    elements.chapterPanel.scrollIntoView({ behavior: scrollBehavior(), block: "start" });
  }

  function focusGlossaryEntryCard(entryId) {
    if (!entryId) {
      return;
    }

    const safeEntryId = typeof CSS !== "undefined" && typeof CSS.escape === "function"
      ? CSS.escape(entryId)
      : entryId;
    const targetCard = elements.glossaryPanel.querySelector(`#glossary-entry-${safeEntryId}`);

    if (!targetCard) {
      return;
    }

    targetCard.scrollIntoView({ behavior: scrollBehavior(), block: "center" });

    if (typeof targetCard.focus === "function") {
      try {
        targetCard.focus({ preventScroll: true });
      } catch {
        targetCard.focus();
      }
    }
  }

  function focusTab(tabGroup, tabValue) {
    const selector = `[role="tab"][data-tab-group="${tabGroup}"][data-tab-value="${tabValue}"]`;
    const tab = document.querySelector(selector);

    if (tab) {
      tab.focus();
    }
  }

  function updateProgressBar(progress) {
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

  function showAssistantPrompt(prompt, context) {
    assistantPrompt = prompt;
    assistantContext = context || "";
    renderAssistantPanel();

    if (elements.assistantPanel) {
      elements.assistantPanel.scrollIntoView({ behavior: scrollBehavior(), block: "start" });
    }
  }

  function hideAssistantPrompt() {
    assistantPrompt = "";
    assistantContext = "";
    assistantFeedback = "";
    renderAssistantPanel();
  }

  function renderChrome(courseViewState) {
    if (elements.searchInput.value !== state.search) {
      elements.searchInput.value = state.search;
    }

    renderFilters(elements.levelFilters, levelOptions, state.level);
    renderSidebar(elements.chapterNav, elements.visibleCount, {
      chapters,
      visibleChapters: courseViewState.visibleChapters,
      currentChapterId: courseViewState.currentChapter ? courseViewState.currentChapter.id : "",
      doneSet: courseViewState.doneSet
    });
    updateProgressBar(courseViewState.progress);
  }

  function renderHeroSection(courseViewState) {
    renderHero(elements.hero, {
      assistantAvailable: typeof globalScope.sendPrompt === "function",
      chapters,
      completedCount: courseViewState.doneSet.size,
      courseMeta,
      currentChapter: courseViewState.currentChapter,
      search: state.search,
      level: state.level,
      progress: courseViewState.progress,
      nextChapter: courseViewState.nextChapter,
      visibleCount: courseViewState.visibleChapters.length
    });
  }

  function renderChapterSection(courseViewState) {
    renderChapterPanel(elements.chapterPanel, {
      assistantAvailable: typeof globalScope.sendPrompt === "function",
      chapter: courseViewState.currentChapter,
      doneSet: courseViewState.doneSet,
      tab: state.tab,
      tabLabels,
      visibleChapters: courseViewState.visibleChapters
    });
    highlightCodeBlocks(elements.chapterPanel);
  }

  function renderCourseSections(options = {}) {
    const settings = Object.assign({
      chapter: true,
      chrome: true,
      hero: true
    }, options);
    const courseViewState = getCourseViewState();

    if (settings.chrome) {
      renderChrome(courseViewState);
    }

    if (settings.hero) {
      renderHeroSection(courseViewState);
    }

    if (settings.chapter) {
      renderChapterSection(courseViewState);
    }
  }

  function renderGlossarySection(options = {}) {
    const settings = Object.assign({ preserveFocus: true }, options);
    const glossarySearchWasFocused = settings.preserveFocus && document.activeElement
      ? document.activeElement.id === "glossarySearch"
      : false;
    const glossarySearchCursor = glossarySearchWasFocused ? document.activeElement.selectionStart : null;
    const visibleGlossaryEntries = getVisibleGlossaryEntries();

    syncGlossaryState(state, visibleGlossaryEntries);
    renderGlossary(elements.glossaryPanel, {
      entries: visibleGlossaryEntries,
      state,
      context: {
        showReturnButton: Boolean(glossaryReturnTarget),
        targetEntryId: glossaryFocusedEntryId
      }
    });
    highlightCodeBlocks(elements.glossaryPanel);

    if (glossarySearchWasFocused) {
      const restored = elements.glossaryPanel.querySelector("#glossarySearch");

      if (restored) {
        restored.focus();
        if (glossarySearchCursor !== null) {
          restored.setSelectionRange(glossarySearchCursor, glossarySearchCursor);
        }
      }
    }

    if (state.glossaryMode === "list" && glossaryFocusedEntryId) {
      focusGlossaryEntryCard(glossaryFocusedEntryId);
    }
  }

  function renderInitialState() {
    renderCourseSections();
    renderGlossarySection({ preserveFocus: false });
    renderAssistantPanel();
  }

  function cancelCourseSearchRender() {
    if (!courseSearchTimer) {
      return;
    }

    globalScope.clearTimeout(courseSearchTimer);
    courseSearchTimer = 0;
  }

  function cancelGlossarySearchRender() {
    if (!glossarySearchTimer) {
      return;
    }

    globalScope.clearTimeout(glossarySearchTimer);
    glossarySearchTimer = 0;
  }

  function scheduleCourseSearchRender() {
    cancelCourseSearchRender();
    courseSearchTimer = globalScope.setTimeout(() => {
      courseSearchTimer = 0;
      syncCurrentChapterSelection();
      saveState(state);
      renderCourseSections();
    }, searchDebounceMs);
  }

  function scheduleGlossarySearchRender() {
    cancelGlossarySearchRender();
    glossarySearchTimer = globalScope.setTimeout(() => {
      glossarySearchTimer = 0;
      syncGlossaryState(state, getVisibleGlossaryEntries());
      saveState(state);
      renderGlossarySection();
    }, searchDebounceMs);
  }

  function askForMoreExercises(scope) {
    const courseViewState = getCourseViewState();
    const chapter = courseViewState.currentChapter;
    const chapterTitle = scope || (chapter ? chapter.title : "C++ ING2");
    const prompt =
      `Je révise le chapitre "${chapterTitle}". ` +
      "Génère-moi une série d'exercices progressifs en français avec corrigés indicatifs, " +
      "en couvrant les pièges classiques, une version challenge et les points de vigilance à vérifier.";

    if (typeof globalScope.sendPrompt === "function") {
      globalScope.sendPrompt(prompt);
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

    cancelCourseSearchRender();
    state.currentChapterId = chapterId;
    state.tab = "cours";
    syncHash(chapterId);
    saveState(state);
    renderCourseSections();

    if (shouldScroll) {
      scrollToChapterPanel();
    }
  }

  function activateCourseTab(tabId, options = {}) {
    const settings = Object.assign({ focusTab: false }, options);

    if (!validTabIds.has(tabId)) {
      return;
    }

    if (state.tab === tabId) {
      if (settings.focusTab) {
        focusTab("course", tabId);
      }
      return;
    }

    cancelCourseSearchRender();
    state.tab = tabId;
    saveState(state);
    renderCourseSections({ chrome: false, hero: false });

    if (settings.focusTab) {
      focusTab("course", tabId);
    }
  }

  function goToAdjacentChapter(offset) {
    const target = getAdjacentVisibleChapter(offset);

    if (target) {
      goToChapter(target.id);
    }
  }

  function toggleCurrentChapterCompletion() {
    const courseViewState = getCourseViewState();
    const chapter = courseViewState.currentChapter;

    if (!chapter) {
      return;
    }

    if (courseViewState.doneSet.has(chapter.id)) {
      state.completedIds = state.completedIds.filter((id) => id !== chapter.id);
    } else {
      state.completedIds = state.completedIds.concat(chapter.id);
    }

    saveState(state);
    renderCourseSections();
  }

  function resumeProgress() {
    const visibleChapters = getVisibleChapters();
    const source = visibleChapters.length > 0 ? visibleChapters : chapters;
    const doneSet = completedSet();
    const target = source.find((chapter) => !doneSet.has(chapter.id)) || source[0];

    if (target) {
      goToChapter(target.id);
    }
  }

  function resetFilters() {
    cancelCourseSearchRender();
    state.search = "";
    state.level = "all";
    syncCurrentChapterSelection();
    saveState(state);
    renderCourseSections();
  }

  function resetGlossaryView() {
    cancelGlossarySearchRender();
    glossaryReturnTarget = null;
    glossaryFocusedEntryId = "";
    state.glossarySearch = "";
    state.glossaryCardIndex = 0;
    state.glossaryCardFace = "front";
    state.glossaryCardSeed = createSeed();
    state.glossaryQuizIndex = 0;
    state.glossaryQuizSelectedId = "";
    state.glossaryQuizSeed = createSeed();
    saveState(state);
    renderGlossarySection();
  }

  function setGlossaryMode(mode, options = {}) {
    const settings = Object.assign({ focusTab: false }, options);

    if (!glossaryModeIds.includes(mode)) {
      return;
    }

    if (state.glossaryMode === mode) {
      if (settings.focusTab) {
        focusTab("glossary-mode", mode);
      }
      return;
    }

    cancelGlossarySearchRender();
    if (!settings.keepReturnTarget) {
      glossaryReturnTarget = null;
      glossaryFocusedEntryId = "";
    }
    state.glossaryMode = mode;
    state.glossaryCardFace = "front";
    state.glossaryCardSeed = createSeed();
    state.glossaryCardIndex = 0;
    state.glossaryQuizSelectedId = "";
    state.glossaryQuizSeed = createSeed();
    state.glossaryQuizIndex = 0;
    saveState(state);
    renderGlossarySection();

    if (settings.focusTab) {
      focusTab("glossary-mode", mode);
    }
  }

  function moveGlossaryCard(offset) {
    const entries = getVisibleGlossaryEntries();

    if (!entries.length) {
      return;
    }

    const nextIndex = state.glossaryCardIndex + offset;
    state.glossaryCardIndex = (nextIndex + entries.length) % entries.length;
    state.glossaryCardFace = "front";
    glossaryReturnTarget = null;
    glossaryFocusedEntryId = "";
    saveState(state);
    renderGlossarySection();
  }

  function flipGlossaryCard() {
    state.glossaryCardFace = state.glossaryCardFace === "front" ? "back" : "front";
    glossaryReturnTarget = null;
    glossaryFocusedEntryId = "";
    saveState(state);
    renderGlossarySection();
  }

  function shuffleGlossaryCards() {
    state.glossaryCardSeed = createSeed();
    state.glossaryCardIndex = 0;
    state.glossaryCardFace = "front";
    glossaryReturnTarget = null;
    glossaryFocusedEntryId = "";
    saveState(state);
    renderGlossarySection();
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
    renderGlossarySection();
  }

  function selectGlossaryQuizAnswer(optionId) {
    if (typeof optionId !== "string" || optionId.length === 0) {
      return;
    }

    state.glossaryQuizSelectedId = optionId;
    saveState(state);
    renderGlossarySection();
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
    glossaryReturnTarget = null;
    glossaryFocusedEntryId = "";
    saveState(state);
    renderGlossarySection();
  }

  function openGlossaryEntry(entryId, originElement = null) {
    if (!validGlossaryIds.has(entryId)) {
      return;
    }

    cancelGlossarySearchRender();
    glossaryReturnTarget = originElement;
    glossaryFocusedEntryId = entryId;
    state.glossaryMode = "list";
    state.glossarySearch = "";
    state.glossaryCardIndex = 0;
    state.glossaryCardFace = "front";
    state.glossaryCardSeed = createSeed();
    state.glossaryQuizIndex = 0;
    state.glossaryQuizSelectedId = "";
    state.glossaryQuizSeed = createSeed();
    saveState(state);
    renderGlossarySection({ preserveFocus: false });
  }

  function returnFromGlossary() {
    const target = glossaryReturnTarget;
    glossaryReturnTarget = null;
    glossaryFocusedEntryId = "";
    renderGlossarySection({ preserveFocus: false });

    if (target && document.contains(target)) {
      target.scrollIntoView({ behavior: scrollBehavior(), block: "center" });
      target.focus();
      return;
    }

    scrollToChapterPanel();
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

  function handleTabKeydown(event) {
    const target = event.target.closest("[role=\"tab\"][data-tab-group][data-tab-value]");

    if (!target) {
      return false;
    }

    const tabGroup = target.dataset.tabGroup;
    const tabValue = target.dataset.tabValue;
    const values = tabGroup === "course" ? courseTabIds : glossaryModeIds;
    const currentIndex = values.indexOf(tabValue);

    if (currentIndex === -1) {
      return false;
    }

    let nextValue = "";

    if (event.key === "ArrowLeft") {
      nextValue = values[(currentIndex - 1 + values.length) % values.length];
    } else if (event.key === "ArrowRight") {
      nextValue = values[(currentIndex + 1) % values.length];
    } else if (event.key === "Home") {
      nextValue = values[0];
    } else if (event.key === "End") {
      nextValue = values[values.length - 1];
    } else {
      return false;
    }

    event.preventDefault();

    if (tabGroup === "course") {
      activateCourseTab(nextValue, { focusTab: true });
    } else {
      setGlossaryMode(nextValue, { focusTab: true });
    }

    return true;
  }

  document.addEventListener("input", (event) => {
    if (event.target === elements.searchInput) {
      state.search = event.target.value;
      scheduleCourseSearchRender();
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
      scheduleGlossarySearchRender();
    }
  });

  if (elements.resetFiltersButton) {
    elements.resetFiltersButton.addEventListener("click", () => {
      resetFilters();
    });
  }

  document.addEventListener("click", (event) => {
    const glossaryLink = event.target.closest("[data-glossary-link]");
    if (glossaryLink) {
      event.preventDefault();
      openGlossaryEntry(glossaryLink.dataset.glossaryLink, glossaryLink);
      return;
    }

    const levelFilter = event.target.closest("[data-level-filter]");
    if (levelFilter) {
      cancelCourseSearchRender();
      state.level = levelFilter.dataset.levelFilter;
      syncCurrentChapterSelection();
      saveState(state);
      renderCourseSections();
      return;
    }

    const chapterTrigger = event.target.closest("[data-chapter-id]");
    if (chapterTrigger) {
      goToChapter(chapterTrigger.dataset.chapterId);
      return;
    }

    const tabTrigger = event.target.closest("[data-tab-id]");
    if (tabTrigger) {
      activateCourseTab(tabTrigger.dataset.tabId);
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

      if (action === "return-from-glossary") {
        returnFromGlossary();
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
        return;
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
    if (handleTabKeydown(event)) {
      return;
    }

    if (event.key === "/" && !isTypingTarget(event.target)) {
      event.preventDefault();
      elements.searchInput.focus();
      elements.searchInput.select();
      return;
    }

    if (event.key === "Escape") {
      if (document.activeElement === elements.searchInput || document.activeElement?.id === "glossarySearch") {
        document.activeElement.blur();
      }

      if (assistantPrompt) {
        hideAssistantPrompt();
      }
    }
  });

  globalScope.addEventListener("hashchange", () => {
    const chapterId = getHashChapterId(validChapterIds);

    if (chapterId && chapterId !== state.currentChapterId) {
      cancelCourseSearchRender();
      state.currentChapterId = chapterId;
      state.tab = "cours";
      syncCurrentChapterSelection();
      saveState(state);
      renderCourseSections();
    }
  });

  renderInitialState();
}

if (globalScope.COURSE_DATA) {
  init();
} else {
  globalScope.addEventListener("DOMContentLoaded", init, { once: true });
}
})(window);
