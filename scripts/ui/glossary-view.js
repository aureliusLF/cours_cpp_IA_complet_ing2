(function initialiseCourseAppGlossaryView(globalScope) {
const { escapeAttribute, escapeHtml, normalise } = globalScope.CourseAppStrings || {};

function renderCodeBlock(codeExample) {
  if (!codeExample || !codeExample.source) {
    return "";
  }

  const language = codeExample.language || "text";

  return `
    <div class="code-block code-block--${language}">
      <div class="code-block__head">
        <span>${escapeHtml(codeExample.label || "Exemple")}</span>
        <span>${escapeHtml(language)}</span>
      </div>
      <pre><code class="code-block__code language-${language}" data-language="${escapeAttribute(language)}">${escapeHtml(codeExample.source)}</code></pre>
    </div>
  `;
}

function renderStudyButtons(entryId, isKnown) {
  return `
    <div class="glossary-card__actions">
      <button
        class="ghost-button ghost-button--compact"
        type="button"
        data-action="glossary-mark-review"
        data-glossary-entry-id="${entryId}"
      >
        À revoir
      </button>
      <button
        class="action-button ${isKnown ? "action-button--outline" : "action-button--primary"}"
        type="button"
        data-action="glossary-mark-known"
        data-glossary-entry-id="${entryId}"
      >
        ${isKnown ? "Connu" : "Je connais"}
      </button>
    </div>
  `;
}

function renderListMode(entries, knownSet) {
  return `
    <div class="glossary-grid glossary-grid--study">
      ${entries.map((entry) => {
        const isKnown = knownSet.has(entry.id);
        return `
          <article class="glossary-card glossary-card--study ${isKnown ? "is-known" : ""}">
            <div class="glossary-card__head">
              <h3>${entry.term}</h3>
              <span class="meta-chip ${isKnown ? "meta-chip--success" : "meta-chip--gold"}">
                ${isKnown ? "Connu" : "À revoir"}
              </span>
            </div>
            <p class="glossary-card__text">${entry.text}</p>
            <p class="glossary-card__example"><strong>Exemple :</strong> ${entry.example}</p>
            ${renderCodeBlock(entry.codeExample)}
            <div class="glossary-card__tags">
              ${entry.tags.map((tag) => `<span class="glossary-tag">${tag}</span>`).join("")}
            </div>
            ${renderStudyButtons(entry.id, isKnown)}
          </article>
        `;
      }).join("")}
    </div>
  `;
}

function renderFlashcardsMode(entries, state, knownSet) {
  const current = entries[state.glossaryCardIndex] || null;
  if (!current) {
    return "";
  }

  const isKnown = knownSet.has(current.id);

  return `
    <div class="glossary-study">
      <div class="glossary-study__head">
        <span class="meta-chip">${state.glossaryCardIndex + 1}/${entries.length}</span>
        <span class="meta-chip ${isKnown ? "meta-chip--success" : "meta-chip--gold"}">
          ${isKnown ? "Connu" : "À revoir"}
        </span>
      </div>

      <article
        class="flashcard ${state.glossaryCardFace === "back" ? "is-flipped" : ""}"
        data-action="glossary-flip"
      >
        <div class="flashcard__face flashcard__face--front">
          <p class="eyebrow">Carte mémoire</p>
          <h3>${current.term}</h3>
          <p>Essaie d'expliquer ce terme avant de retourner la carte.</p>
          <div class="glossary-card__tags">
            ${current.tags.map((tag) => `<span class="glossary-tag">${tag}</span>`).join("")}
          </div>
        </div>

        <div class="flashcard__face flashcard__face--back">
          <p class="eyebrow">Réponse</p>
          <h3>${current.term}</h3>
          <p class="glossary-card__text">${current.text}</p>
          <p class="glossary-card__example"><strong>Exemple :</strong> ${current.example}</p>
          ${renderCodeBlock(current.codeExample)}
        </div>
      </article>

      <div class="glossary-study__actions">
        <button class="ghost-button" type="button" data-action="glossary-prev">Précédente</button>
        <button class="ghost-button" type="button" data-action="glossary-flip">
          ${state.glossaryCardFace === "front" ? "Retourner" : "Voir le terme"}
        </button>
        <button class="action-button action-button--primary" type="button" data-action="glossary-next">Suivante</button>
      </div>

      ${renderStudyButtons(current.id, isKnown)}
    </div>
  `;
}

function buildQuizQuestion(entries, index) {
  if (!entries.length) {
    return null;
  }

  const safeIndex = Math.min(index, entries.length - 1);
  const correct = entries[safeIndex];
  const distractors = [];

  for (let offset = 1; offset < entries.length && distractors.length < 3; offset += 1) {
    const candidate = entries[(safeIndex + offset) % entries.length];
    if (candidate.id !== correct.id) {
      distractors.push(candidate);
    }
  }

  const options = [correct, ...distractors].slice(0, Math.min(entries.length, 4));
  const rotation = safeIndex % options.length;
  const orderedOptions = options.slice(rotation).concat(options.slice(0, rotation));

  return {
    correct,
    options: orderedOptions
  };
}

function renderQuizMode(entries, state, knownSet) {
  const question = buildQuizQuestion(entries, state.glossaryQuizIndex);
  if (!question) {
    return "";
  }

  const selectedId = state.glossaryQuizSelectedId;
  const answered = Boolean(selectedId);
  const isCorrect = answered && selectedId === question.correct.id;
  const correctKnown = knownSet.has(question.correct.id);

  return `
    <div class="glossary-study glossary-study--quiz">
      <div class="glossary-study__head">
        <span class="meta-chip">${state.glossaryQuizIndex + 1}/${entries.length}</span>
        <span class="meta-chip meta-chip--accent">Quiz</span>
      </div>

      <article class="quiz-card quiz-card--glossary" data-glossary-quiz="${question.correct.id}">
        <h3>Quel terme correspond à cette définition ?</h3>
        <p>${question.correct.text}</p>

        <div class="quiz-option-list">
          ${question.options.map((entry) => {
            const optionState = !answered
              ? ""
              : entry.id === question.correct.id
                ? " is-correct"
                : entry.id === selectedId
                  ? " is-wrong"
                  : "";

            return `
              <button
                class="quiz-option${optionState}"
                type="button"
                data-action="glossary-quiz-answer"
                data-glossary-entry-id="${entry.id}"
                ${answered ? "disabled" : ""}
              >
                ${entry.term}
              </button>
            `;
          }).join("")}
        </div>

        ${answered ? `
          <div class="quiz-feedback glossary-quiz-feedback">
            <p><strong>${isCorrect ? "Bonne réponse." : "Réponse attendue :"}</strong> ${question.correct.term}</p>
            <p>${question.correct.example}</p>
            ${renderCodeBlock(question.correct.codeExample)}
            <div class="glossary-card__actions">
              <button
                class="ghost-button ghost-button--compact"
                type="button"
                data-action="glossary-mark-review"
                data-glossary-entry-id="${question.correct.id}"
              >
                À revoir
              </button>
              <button
                class="action-button ${correctKnown ? "action-button--outline" : "action-button--primary"}"
                type="button"
                data-action="glossary-mark-known"
                data-glossary-entry-id="${question.correct.id}"
              >
                ${correctKnown ? "Connu" : "Je connais"}
              </button>
              <button class="action-button action-button--primary" type="button" data-action="glossary-quiz-next">
                Question suivante
              </button>
            </div>
          </div>
        ` : ""}
      </article>
    </div>
  `;
}

function filterGlossaryEntries(entries, query) {
  const glossaryQuery = normalise(query);
  return entries.filter((entry) => !glossaryQuery || entry.searchText.includes(glossaryQuery));
}

function syncGlossaryState(state, visibleEntries) {
  if (visibleEntries.length === 0) {
    state.glossaryCardIndex = 0;
    state.glossaryCardFace = "front";
    state.glossaryQuizIndex = 0;
    state.glossaryQuizSelectedId = "";
    return;
  }

  state.glossaryCardIndex = Math.min(state.glossaryCardIndex, visibleEntries.length - 1);
  state.glossaryQuizIndex = Math.min(state.glossaryQuizIndex, visibleEntries.length - 1);

  const visibleIds = new Set(visibleEntries.map((entry) => entry.id));
  if (!visibleIds.has(state.glossaryQuizSelectedId)) {
    state.glossaryQuizSelectedId = "";
  }
}

function renderGlossary(container, { entries, state }) {
  const knownSet = new Set(state.glossaryKnownIds);
  const knownCount = entries.filter((entry) => knownSet.has(entry.id)).length;

  let content = "";

  if (entries.length === 0) {
    content = `
      <div class="empty-state">
        <h3>Aucun terme trouvé</h3>
        <p>Essaie un autre mot-clé ou efface la recherche pour réafficher tout le glossaire.</p>
        <button class="action-button action-button--primary" type="button" data-action="reset-glossary">
          Réafficher le glossaire
        </button>
      </div>
    `;
  } else if (state.glossaryMode === "flashcards") {
    content = renderFlashcardsMode(entries, state, knownSet);
  } else if (state.glossaryMode === "quiz") {
    content = renderQuizMode(entries, state, knownSet);
  } else {
    content = renderListMode(entries, knownSet);
  }

  container.innerHTML = `
    <div class="glossary-head">
      <div>
        <p class="eyebrow">Révision rapide</p>
        <h2>Glossaire interactif</h2>
        <p>Une même base de termes peut maintenant se réviser en liste enrichie, en cartes mémoire ou en quiz rapide.</p>
      </div>

      ${state.glossarySearch ? `
        <button class="ghost-button ghost-button--compact" type="button" data-action="reset-glossary">
          Effacer la recherche
        </button>
      ` : ""}
    </div>

    <div class="glossary-topbar">
      <input
        id="glossarySearch"
        class="glossary-search"
        type="search"
        placeholder="Rechercher un terme du glossaire"
        value="${escapeAttribute(state.glossarySearch)}"
      >
      <div class="glossary-topbar__meta">
        <span class="meta-chip">${entries.length} termes</span>
        <span class="meta-chip meta-chip--success">${knownCount} connus</span>
      </div>
    </div>

    <div class="glossary-mode-switch" role="tablist" aria-label="Modes du glossaire">
      ${[
        ["list", "Liste"],
        ["flashcards", "Cartes"],
        ["quiz", "Quiz"]
      ].map(([mode, label]) => `
        <button
          class="tab-button ${state.glossaryMode === mode ? "is-active" : ""}"
          type="button"
          data-action="set-glossary-mode"
          data-glossary-mode="${mode}"
          aria-pressed="${state.glossaryMode === mode ? "true" : "false"}"
        >
          ${label}
        </button>
      `).join("")}
    </div>

    ${content}
  `;
}

globalScope.CourseAppGlossaryView = {
  filterGlossaryEntries,
  renderGlossary,
  syncGlossaryState
};
})(window);
