(function initialiseCourseAppStorage(globalScope) {
  const STORAGE_KEY = "cours_cpp_complet_ing2_state_v4";

  function loadState() {
    try {
      const value = globalScope.localStorage.getItem(STORAGE_KEY);
      return value ? JSON.parse(value) : {};
    } catch {
      return {};
    }
  }

  function saveState(state) {
    try {
      globalScope.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          currentChapterId: state.currentChapterId,
          completedIds: state.completedIds.slice(),
          search: state.search,
          glossarySearch: state.glossarySearch,
          glossaryMode: state.glossaryMode,
          glossaryKnownIds: state.glossaryKnownIds.slice(),
          glossaryCardIndex: state.glossaryCardIndex,
          glossaryCardFace: state.glossaryCardFace,
          glossaryQuizIndex: state.glossaryQuizIndex,
          glossaryQuizSelectedId: state.glossaryQuizSelectedId,
          level: state.level,
          tab: state.tab
        })
      );
    } catch {
      // localStorage peut être indisponible ; le support reste utilisable.
    }
  }

  function createDefaultState(initialChapterId) {
    return {
      currentChapterId: initialChapterId,
      completedIds: [],
      search: "",
      glossarySearch: "",
      glossaryMode: "list",
      glossaryKnownIds: [],
      glossaryCardIndex: 0,
      glossaryCardFace: "front",
      glossaryQuizIndex: 0,
      glossaryQuizSelectedId: "",
      level: "all",
      tab: "cours"
    };
  }

  function sanitiseState(rawState, {
    defaultState,
    validChapterIds,
    validGlossaryIds,
    validLevelIds,
    validTabIds
  }) {
    const completedIds = Array.isArray(rawState.completedIds)
      ? Array.from(new Set(rawState.completedIds.filter((id) => validChapterIds.has(id))))
      : [];

    const glossaryKnownIds = Array.isArray(rawState.glossaryKnownIds)
      ? Array.from(new Set(rawState.glossaryKnownIds.filter((id) => validGlossaryIds.has(id))))
      : [];

    return {
      currentChapterId: validChapterIds.has(rawState.currentChapterId)
        ? rawState.currentChapterId
        : defaultState.currentChapterId,
      completedIds,
      search: typeof rawState.search === "string" ? rawState.search : "",
      glossarySearch: typeof rawState.glossarySearch === "string" ? rawState.glossarySearch : "",
      glossaryMode: ["list", "flashcards", "quiz"].includes(rawState.glossaryMode)
        ? rawState.glossaryMode
        : defaultState.glossaryMode,
      glossaryKnownIds,
      glossaryCardIndex: Number.isInteger(rawState.glossaryCardIndex) && rawState.glossaryCardIndex >= 0
        ? rawState.glossaryCardIndex
        : defaultState.glossaryCardIndex,
      glossaryCardFace: rawState.glossaryCardFace === "back" ? "back" : "front",
      glossaryQuizIndex: Number.isInteger(rawState.glossaryQuizIndex) && rawState.glossaryQuizIndex >= 0
        ? rawState.glossaryQuizIndex
        : defaultState.glossaryQuizIndex,
      glossaryQuizSelectedId: validGlossaryIds.has(rawState.glossaryQuizSelectedId)
        ? rawState.glossaryQuizSelectedId
        : defaultState.glossaryQuizSelectedId,
      level: validLevelIds.has(rawState.level) ? rawState.level : defaultState.level,
      tab: validTabIds.has(rawState.tab) ? rawState.tab : defaultState.tab
    };
  }

  globalScope.CourseAppStorage = {
    createDefaultState,
    loadState,
    sanitiseState,
    saveState
  };
})(window);
