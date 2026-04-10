(function initialiseCourseAppGlossaryView(globalScope) {
const { escapeAttribute, escapeHtml, normalise } = globalScope.CourseAppStrings || {};
const GLOSSARY_TAB_GROUP = "glossary-mode";

function glossaryModeTabId(mode) {
  return `glossary-mode-tab-${mode}`;
}

function glossaryModePanelId(mode) {
  return `glossary-mode-panel-${mode}`;
}

const DEFAULT_QUIZ_CATEGORIES = [
  { id: "build", label: "Compilation & linkage" },
  { id: "poo", label: "POO & polymorphisme" },
  { id: "memory", label: "Mémoire & ressources" },
  { id: "io", label: "Flux & fichiers" },
  { id: "stl", label: "STL & conteneurs" },
  { id: "template", label: "Templates & généricité" },
  { id: "syntax", label: "Syntaxe & opérateurs" },
  { id: "modern", label: "C++ moderne" },
  { id: "design", label: "Design & architecture" },
  { id: "debug", label: "Sécurité & debug" },
  { id: "general", label: "Concepts C++" }
];

const DEFAULT_CATEGORY_BY_TAG = {
  algorithmes: "stl",
  api: "design",
  build: "build",
  classe: "poo",
  compilation: "build",
  const: "syntax",
  conteneurs: "stl",
  copie: "modern",
  "cycle de vie": "memory",
  cycle_de_vie: "memory",
  design: "design",
  "edition de liens": "build",
  erreurs: "debug",
  exceptions: "debug",
  fichiers: "io",
  flux: "io",
  genericite: "template",
  heap: "memory",
  heritage: "poo",
  io: "io",
  iterateurs: "stl",
  lifetime: "memory",
  memoire: "memory",
  "modern cpp": "modern",
  objet: "poo",
  operateurs: "syntax",
  organization: "design",
  organisation: "design",
  ownership: "memory",
  parametres: "syntax",
  performance: "modern",
  polymorphisme: "poo",
  poo: "poo",
  raii: "memory",
  resource: "memory",
  ressources: "memory",
  safety: "debug",
  stack: "memory",
  "standard library": "stl",
  std: "modern",
  syntaxe: "syntax",
  template: "template"
};

function getCourseQuizCategories() {
  const meta = globalScope.COURSE_DATA?.meta;
  if (meta && Array.isArray(meta.glossaryCategories) && meta.glossaryCategories.length) {
    return meta.glossaryCategories;
  }
  return DEFAULT_QUIZ_CATEGORIES;
}

function getCourseCategoryByTag() {
  const meta = globalScope.COURSE_DATA?.meta;
  if (meta && meta.glossaryTagToCategory && typeof meta.glossaryTagToCategory === "object") {
    return meta.glossaryTagToCategory;
  }
  return DEFAULT_CATEGORY_BY_TAG;
}

function getCategoryById(id) {
  const categories = getCourseQuizCategories();
  return categories.find((category) => category.id === id) || categories[categories.length - 1] || { id: "general", label: "Concepts" };
}

function renderVisual(entry) {
  if (!entry || !entry.visual) {
    return "";
  }
  return `<div class="glossary-card__visual">${entry.visual}</div>`;
}

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
  `;
}

function hashString(value) {
  let hash = 2166136261;

  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }

  return hash >>> 0;
}

function sortBySeed(items, seed, keyBuilder) {
  return items.slice().sort((left, right) => {
    const leftKey = keyBuilder(left);
    const rightKey = keyBuilder(right);
    const delta = hashString(`${seed}:${leftKey}`) - hashString(`${seed}:${rightKey}`);

    if (delta !== 0) {
      return delta;
    }

    return String(leftKey).localeCompare(String(rightKey), "fr", { sensitivity: "base" });
  });
}

function getCategory(entry) {
  const tagMap = getCourseCategoryByTag();
  const categories = getCourseQuizCategories();
  const fallbackId = categories[categories.length - 1]?.id || "general";
  const categoryId = (entry.tags || []).map((tag) => tagMap[tag]).find(Boolean) || fallbackId;
  return getCategoryById(categoryId);
}

function buildOrderedEntries(entries, seed) {
  return sortBySeed(entries, seed, (entry) => entry.id);
}

function buildOptionOrder(options, seed, salt) {
  return sortBySeed(options, seed, (option) => `${salt}:${option.id}:${option.label}`);
}

function pickDistractors(entries, correctEntry, count, seed, salt) {
  const pool = entries.filter((entry) => entry.id !== correctEntry.id);
  const related = pool.filter((entry) => entry.tags.some((tag) => correctEntry.tags.includes(tag)));
  const unrelated = pool.filter((entry) => !related.some((candidate) => candidate.id === entry.id));

  const chosen = sortBySeed(related, seed, (entry) => `${salt}:related:${entry.id}`).slice(0, count);

  if (chosen.length >= count) {
    return chosen;
  }

  return chosen.concat(
    sortBySeed(unrelated, seed, (entry) => `${salt}:fallback:${entry.id}`).slice(0, count - chosen.length)
  );
}

function buildTermChoiceQuestion(correctEntry, entries, seed, promptHtml, title, eyebrow) {
  const distractors = pickDistractors(entries, correctEntry, 3, seed, `term:${correctEntry.id}`);
  const options = buildOptionOrder(
    [
      { id: `term:${correctEntry.id}`, label: correctEntry.term },
      ...distractors.map((entry) => ({ id: `term:${entry.id}`, label: entry.term }))
    ],
    seed,
    `term-options:${correctEntry.id}`
  );

  return {
    eyebrow,
    title,
    promptHtml,
    correctEntry,
    correctOptionId: `term:${correctEntry.id}`,
    optionClassName: "",
    options,
    typeLabel: "Reconnaissance de concept"
  };
}

function buildDefinitionChoiceQuestion(correctEntry, entries, seed) {
  const distractors = pickDistractors(entries, correctEntry, 3, seed, `definition:${correctEntry.id}`);
  const options = buildOptionOrder(
    [
      { id: `definition:${correctEntry.id}`, label: correctEntry.text },
      ...distractors.map((entry) => ({ id: `definition:${entry.id}`, label: entry.text }))
    ],
    seed,
    `definition-options:${correctEntry.id}`
  );

  return {
    eyebrow: "Définition ciblée",
    title: `Quelle définition décrit le mieux "${correctEntry.term}" ?`,
    promptHtml: `
      <p class="glossary-quiz__lead">
        Choisis la formulation la plus précise, pas juste celle qui "ressemble" au terme.
      </p>
      <p class="glossary-quiz__term">${correctEntry.term}</p>
    `,
    correctEntry,
    correctOptionId: `definition:${correctEntry.id}`,
    optionClassName: " quiz-option--long",
    options,
    typeLabel: "Précision de définition"
  };
}

function buildCategoryQuestion(correctEntry, entries, seed) {
  const correctCategory = getCategory(correctEntry);
  const visibleCategories = Array.from(
    new Map(entries.map((entry) => {
      const category = getCategory(entry);
      return [category.id, category];
    })).values()
  );

  const allCategories = getCourseQuizCategories();
  const fallbackCategoryId = allCategories[allCategories.length - 1]?.id;
  const categoryPool = visibleCategories.length >= 4
    ? visibleCategories
    : allCategories.filter((category) => category.id !== fallbackCategoryId);

  const distractors = sortBySeed(
    categoryPool.filter((category) => category.id !== correctCategory.id),
    seed,
    (category) => `category:${category.id}`
  ).slice(0, 3);

  const options = buildOptionOrder(
    [
      { id: `family:${correctCategory.id}`, label: correctCategory.label },
      ...distractors.map((category) => ({ id: `family:${category.id}`, label: category.label }))
    ],
    seed,
    `family-options:${correctEntry.id}`
  );

  return {
    eyebrow: "Classement",
    title: `Dans quelle famille rangerais-tu "${correctEntry.term}" ?`,
    promptHtml: `
      <p class="glossary-quiz__lead">${correctEntry.example}</p>
      <p class="glossary-quiz__hint">Ici, on teste ta capacité à relier le terme à sa grande famille conceptuelle.</p>
    `,
    correctEntry,
    correctOptionId: `family:${correctCategory.id}`,
    optionClassName: "",
    options,
    typeLabel: "Famille conceptuelle"
  };
}

function buildQuizQuestion(entries, state) {
  if (!entries.length) {
    return null;
  }

  const orderedEntries = buildOrderedEntries(entries, state.glossaryQuizSeed);
  const safeIndex = Math.min(state.glossaryQuizIndex, orderedEntries.length - 1);
  const correctEntry = orderedEntries[safeIndex];
  const variantSeed = hashString(`${state.glossaryQuizSeed}:${state.glossaryQuizIndex}:${correctEntry.id}`);
  const variant = variantSeed % 5;

  if (variant === 0) {
    return buildTermChoiceQuestion(
      correctEntry,
      entries,
      variantSeed,
      `<p>${correctEntry.text}</p>`,
      "Quel terme correspond à cette définition ?",
      "Définition"
    );
  }

  if (variant === 1) {
    return buildDefinitionChoiceQuestion(correctEntry, entries, variantSeed);
  }

  if (variant === 2) {
    if (correctEntry.visual) {
      return buildTermChoiceQuestion(
        correctEntry,
        entries,
        variantSeed,
        `${renderVisual(correctEntry)}<p class="glossary-quiz__hint">Observe le schéma : c'est le mécanisme central qui est illustré.</p>`,
        "Quel concept est illustré par ce schéma ?",
        "Lecture de schéma"
      );
    }
    if (correctEntry.codeExample && correctEntry.codeExample.source) {
      return buildTermChoiceQuestion(
        correctEntry,
        entries,
        variantSeed,
        `${renderCodeBlock(correctEntry.codeExample)}<p class="glossary-quiz__hint">Repère l'idée centrale illustrée par le code, pas juste un mot-clé visible.</p>`,
        "Quel concept est illustré par ce code ?",
        "Lecture de code"
      );
    }
    return buildDefinitionChoiceQuestion(correctEntry, entries, variantSeed);
  }

  if (variant === 3) {
    return buildCategoryQuestion(correctEntry, entries, variantSeed);
  }

  return buildTermChoiceQuestion(
    correctEntry,
    entries,
    variantSeed,
    `<p>${correctEntry.example}</p>`,
    "Quel terme est le mieux illustré par cette situation ?",
    "Mise en situation"
  );
}

function renderListMode(entries, knownSet, context = {}) {
  return `
    <div class="glossary-grid glossary-grid--study">
      ${entries.map((entry) => {
        const isKnown = knownSet.has(entry.id);
        const isTargeted = context.targetEntryId === entry.id;
        return `
          <article
            id="glossary-entry-${escapeAttribute(entry.id)}"
            class="glossary-card glossary-card--study ${isKnown ? "is-known" : ""} ${isTargeted ? "is-targeted" : ""}"
            data-glossary-entry-id="${escapeAttribute(entry.id)}"
            tabindex="-1"
          >
            <div class="glossary-card__head">
              <h3>${entry.term}</h3>
              <span class="meta-chip ${isKnown ? "meta-chip--success" : "meta-chip--gold"}">
                ${isKnown ? "Connu" : "À revoir"}
              </span>
            </div>
            <p class="glossary-card__text">${entry.text}</p>
            <p class="glossary-card__example"><strong>Exemple :</strong> ${entry.example}</p>
            ${renderVisual(entry)}
            ${renderCodeBlock(entry.codeExample)}
            <div class="glossary-card__tags">
              ${entry.tags.map((tag) => `<span class="glossary-tag">${tag}</span>`).join("")}
            </div>
            <div class="glossary-card__actions">
              ${isTargeted && context.showReturnButton ? `
                <button
                  class="ghost-button ghost-button--compact"
                  type="button"
                  data-action="return-from-glossary"
                >
                  Retour au cours
                </button>
              ` : ""}
              ${renderStudyButtons(entry.id, isKnown)}
            </div>
          </article>
        `;
      }).join("")}
    </div>
  `;
}

function renderFlashcardsMode(entries, state, knownSet) {
  const orderedEntries = buildOrderedEntries(entries, state.glossaryCardSeed);
  const current = orderedEntries[state.glossaryCardIndex] || null;

  if (!current) {
    return "";
  }

  const isKnown = knownSet.has(current.id);

  return `
    <div class="glossary-study">
      <div class="glossary-study__head">
        <span class="meta-chip">${state.glossaryCardIndex + 1}/${entries.length}</span>
        <span class="meta-chip meta-chip--accent">Ordre mélangé</span>
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
          <p>Essaie d'expliquer ce terme à voix haute avant de retourner la carte.</p>
          <div class="glossary-card__tags">
            ${current.tags.map((tag) => `<span class="glossary-tag">${tag}</span>`).join("")}
          </div>
        </div>

        <div class="flashcard__face flashcard__face--back">
          <p class="eyebrow">Réponse</p>
          <h3>${current.term}</h3>
          <p class="glossary-card__text">${current.text}</p>
          <p class="glossary-card__example"><strong>Exemple :</strong> ${current.example}</p>
          ${renderVisual(current)}
          ${renderCodeBlock(current.codeExample)}
        </div>
      </article>

      <div class="glossary-study__actions">
        <button class="ghost-button" type="button" data-action="glossary-prev">Précédente</button>
        <button class="ghost-button" type="button" data-action="glossary-flip">
          ${state.glossaryCardFace === "front" ? "Retourner" : "Voir le terme"}
        </button>
        <button class="ghost-button" type="button" data-action="glossary-shuffle">Mélanger</button>
        <button class="action-button action-button--primary" type="button" data-action="glossary-next">Nouvelle carte</button>
      </div>

      <div class="glossary-card__actions">
        ${renderStudyButtons(current.id, isKnown)}
      </div>
    </div>
  `;
}

function renderQuizMode(entries, state, knownSet) {
  const question = buildQuizQuestion(entries, state);
  if (!question) {
    return "";
  }

  const selectedId = state.glossaryQuizSelectedId;
  const answered = Boolean(selectedId);
  const isCorrect = answered && selectedId === question.correctOptionId;
  const correctKnown = knownSet.has(question.correctEntry.id);
  const correctCategory = getCategory(question.correctEntry);

  return `
    <div class="glossary-study glossary-study--quiz">
      <div class="glossary-study__head">
        <span class="meta-chip">${state.glossaryQuizIndex + 1}/${entries.length}</span>
        <span class="meta-chip meta-chip--accent">${question.typeLabel}</span>
        <span class="meta-chip">${correctCategory.label}</span>
      </div>

      <article class="quiz-card quiz-card--glossary" data-glossary-quiz="${question.correctEntry.id}">
        <p class="eyebrow">${question.eyebrow}</p>
        <h3>${question.title}</h3>
        <div class="glossary-quiz__prompt">
          ${question.promptHtml}
        </div>

        <div class="quiz-option-list quiz-option-list--glossary">
          ${question.options.map((option) => {
            const optionState = !answered
              ? ""
              : option.id === question.correctOptionId
                ? " is-correct"
                : option.id === selectedId
                  ? " is-wrong"
                  : "";

            return `
              <button
                class="quiz-option${question.optionClassName}${optionState}"
                type="button"
                data-action="glossary-quiz-answer"
                data-glossary-option-id="${option.id}"
                ${answered ? "disabled" : ""}
              >
                ${option.label}
              </button>
            `;
          }).join("")}
        </div>

        ${answered ? `
          <div class="quiz-feedback glossary-quiz-feedback">
            <div class="glossary-quiz-feedback__meta">
              <span class="meta-chip ${isCorrect ? "meta-chip--success" : "meta-chip--gold"}">
                ${isCorrect ? "Bonne réponse" : "À revoir"}
              </span>
              <span class="meta-chip">${question.correctEntry.term}</span>
              <span class="meta-chip">${correctCategory.label}</span>
            </div>

            <p><strong>${isCorrect ? "Bien vu." : "Réponse attendue :"}</strong> ${question.correctEntry.term}</p>
            <p>${question.correctEntry.text}</p>
            <p>${question.correctEntry.example}</p>
            ${renderCodeBlock(question.correctEntry.codeExample)}
            <div class="glossary-card__actions">
              <button
                class="ghost-button ghost-button--compact"
                type="button"
                data-action="glossary-mark-review"
                data-glossary-entry-id="${question.correctEntry.id}"
              >
                À revoir
              </button>
              <button
                class="action-button ${correctKnown ? "action-button--outline" : "action-button--primary"}"
                type="button"
                data-action="glossary-mark-known"
                data-glossary-entry-id="${question.correctEntry.id}"
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
}

function renderGlossary(container, { entries, state, context = {} }) {
  const knownSet = new Set(state.glossaryKnownIds);
  const knownCount = entries.filter((entry) => knownSet.has(entry.id)).length;
  const glossarySearchId = "glossarySearch";

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
    content = renderListMode(entries, knownSet, context);
  }

  content = `
    <section
      id="${glossaryModePanelId(state.glossaryMode)}"
      class="glossary-mode-panel"
      role="tabpanel"
      aria-labelledby="${glossaryModeTabId(state.glossaryMode)}"
      tabindex="0"
    >
      ${content}
    </section>
  `;

  container.innerHTML = `
    <div class="glossary-head">
      <div>
        <p class="eyebrow">Révision rapide</p>
        <h2>Glossaire interactif</h2>
        <p>Tu peux maintenant réviser les termes en lecture détaillée, en cartes mélangées ou via un quiz multi-formats plus exigeant.</p>
      </div>

      ${state.glossarySearch ? `
        <button class="ghost-button ghost-button--compact" type="button" data-action="reset-glossary">
          Effacer la recherche
        </button>
      ` : ""}
    </div>

    <div class="glossary-topbar">
      <label class="field-label field-label--inline" for="${glossarySearchId}">
        Recherche dans le glossaire
      </label>
      <input
        id="${glossarySearchId}"
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
          id="${glossaryModeTabId(mode)}"
          data-action="set-glossary-mode"
          data-glossary-mode="${mode}"
          data-tab-group="${GLOSSARY_TAB_GROUP}"
          data-tab-value="${mode}"
          role="tab"
          aria-selected="${state.glossaryMode === mode ? "true" : "false"}"
          aria-controls="${glossaryModePanelId(mode)}"
          tabindex="${state.glossaryMode === mode ? "0" : "-1"}"
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
