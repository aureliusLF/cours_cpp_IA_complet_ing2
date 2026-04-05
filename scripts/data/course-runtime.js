(function initialiseCourseDataRuntime(globalScope) {
const sharedStrings = window.CourseAppStrings || {};

const escapeHtml = sharedStrings.escapeHtml || ((value) => String(value)
  .replace(/&/g, "&amp;")
  .replace(/</g, "&lt;")
  .replace(/>/g, "&gt;"));

const stripHtml = (value) => value.replace(/<[^>]+>/g, " ");

const normaliseForSearch = sharedStrings.normalise || ((value) => String(value)
  .normalize("NFD")
  .replace(/[\u0300-\u036f]/g, "")
  .toLowerCase());

const lesson = (title, ...parts) => {
  return `
  <article class="lesson-section">
    <h3>${title}</h3>
    ${parts.join("")}
  </article>
`;
};

const paragraphs = (...items) => {
  return items.map((item) => `<p>${item}</p>`).join("");
};

const bullets = (items) => `
  <ul class="bullet-list">
    ${items.map((item) => `<li>${item}</li>`).join("")}
  </ul>
`;

const checklist = (items) => `
  <ul class="check-list">
    ${items.map((item) => `<li>${item}</li>`).join("")}
  </ul>
`;

const callout = (tone, title, text) => `
  <div class="callout callout--${tone}">
    <span class="callout__label">${tone}</span>
    <h4 class="callout__title">${title}</h4>
    <p>${text}</p>
  </div>
`;

const code = (language, source, label = "Exemple") => {
  const rawLanguage = normaliseForSearch(language);
  const languageId = {
    "c++": "cpp",
    shell: "bash",
    sh: "bash",
    plaintext: "text"
  }[rawLanguage] || rawLanguage;

  return `
    <div class="code-block code-block--${languageId}">
      <div class="code-block__head">
        <span>${label}</span>
        <span>${language}</span>
      </div>
      <pre><code class="code-block__code language-${languageId}" data-language="${languageId}">${escapeHtml(source.trim())}</code></pre>
    </div>
  `;
};

const table = (headers, rows) => `
  <table class="data-table">
    <thead>
      <tr>${headers.map((item) => `<th>${item}</th>`).join("")}</tr>
    </thead>
    <tbody>
      ${rows.map((row) => `<tr>${row.map((cell) => `<td>${cell}</td>`).join("")}</tr>`).join("")}
    </tbody>
  </table>
`;

const chernoPlaylistUrl = "https://www.youtube.com/playlist?list=PLlrATfBNZ98dudnM48yfGUldqGD0S4FFb";
const revaninioPlaylistUrl = "https://www.youtube.com/playlist?list=PL0ibd6OZI4XKMwaPS1xHU9N_smy3AkcUr";

const externalLink = (href, label) => `
  <a href="${escapeHtml(href)}" target="_blank" rel="noopener noreferrer">${escapeHtml(label)}</a>
`;

const getYoutubeVideoId = (url) => {
  const value = String(url);
  const match = value.match(/(?:v=|\/live\/|\/embed\/|youtu\.be\/)([A-Za-z0-9_-]{11})/);
  return match ? match[1] : "";
};

const getYoutubeThumbnailUrl = (url) => {
  const videoId = getYoutubeVideoId(url);
  return videoId ? `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg` : "";
};

const playlistVideos = {
  howCppWorks: { title: "How C++ Works", url: "https://www.youtube.com/watch?v=SfGuIVzE_Os" },
  headerFiles: { title: "C++ Header Files", url: "https://www.youtube.com/watch?v=9RJTQmK0YPI" },
  variables: { title: "Variables in C++", url: "https://www.youtube.com/watch?v=zB9RI8_wExo" },
  functions: { title: "Functions in C++", url: "https://www.youtube.com/watch?v=V9zuox47zr0" },
  conditions: { title: "CONDITIONS and BRANCHES in C++", url: "https://www.youtube.com/watch?v=qEgCT87KOfc" },
  loops: { title: "Loops in C++", url: "https://www.youtube.com/watch?v=_1AwR-un4Hk" },
  enums: { title: "ENUMS in C++", url: "https://www.youtube.com/watch?v=x55jfOd5PEE" },
  constKeyword: { title: "CONST in C++", url: "https://www.youtube.com/watch?v=4fJBrditnJU" },
  pointers: { title: "POINTERS in C++", url: "https://www.youtube.com/watch?v=DTxHyVn0ODg" },
  references: { title: "REFERENCES in C++", url: "https://www.youtube.com/watch?v=IzoFn3dfsPA" },
  namespaces: { title: "Namespaces in C++", url: "https://www.youtube.com/watch?v=ts1Eek5w7ZA" },
  classes: { title: "CLASSES in C++", url: "https://www.youtube.com/watch?v=2BP8NhxjrO0" },
  classesVsStructs: { title: "CLASSES vs STRUCTS in C++", url: "https://www.youtube.com/watch?v=fLgTtaqqJp0" },
  writeClass: { title: "How to Write a C++ Class", url: "https://www.youtube.com/watch?v=3dHBFBw13E0" },
  constructors: { title: "Constructors in C++", url: "https://www.youtube.com/watch?v=FXhALMsHwEY" },
  destructors: { title: "Destructors in C++", url: "https://www.youtube.com/watch?v=D8cWquReFqw" },
  initializerLists: { title: "Member Initializer Lists in C++", url: "https://www.youtube.com/watch?v=1nfuYMXjZsA" },
  newKeyword: { title: "The NEW Keyword in C++", url: "https://www.youtube.com/watch?v=NUZdUSqsCs4" },
  objectLifetime: { title: "Object Lifetime in C++", url: "https://www.youtube.com/watch?v=iNuTwvD6ciI" },
  smartPointers: { title: "SMART POINTERS in C++", url: "https://www.youtube.com/watch?v=UOB7-B2MfwA" },
  arrowOperator: { title: "The Arrow Operator in C++", url: "https://www.youtube.com/watch?v=4p3grlSpWYA" },
  copyConstructors: { title: "Copying and Copy Constructors in C++", url: "https://www.youtube.com/watch?v=BvR1Pgzzr38" },
  moveSemantics: { title: "Move Semantics in C++", url: "https://www.youtube.com/watch?v=ehMg6zvXuMY" },
  inheritance: { title: "Inheritance in C++", url: "https://www.youtube.com/watch?v=X8nYM8wdNRE" },
  virtualFunctions: { title: "Virtual Functions in C++", url: "https://www.youtube.com/watch?v=oIV2KchSyGQ" },
  virtualDestructors: { title: "Virtual Destructors in C++", url: "https://www.youtube.com/watch?v=jELbKhGkEi0" },
  templates: { title: "Templates in C++", url: "https://www.youtube.com/watch?v=I-hZkUa9mIs" },
  vectorUsage: { title: "Optimizing the usage of std::vector in C++", url: "https://www.youtube.com/watch?v=HcESuwmlHEY" },
  autoKeyword: { title: "The \"auto\" keyword in C++", url: "https://www.youtube.com/watch?v=2vOPEuiGXVo" },
  lambdas: { title: "Lambdas in C++", url: "https://www.youtube.com/watch?v=mWgmBBz0y8c" },
  structuredBindings: { title: "STRUCTURED BINDINGS in C++", url: "https://www.youtube.com/watch?v=eUsTO5BO3WI" }
  ,
  revaninioVariables: { title: "Cours/Tuto C++ #3 : Les Variables", url: "https://www.youtube.com/watch?v=bERTWQrc75Q" },
  revaninioPointers: { title: "Cours/Tuto C++ #14 : Les Pointeurs", url: "https://www.youtube.com/watch?v=lmDfhGZ-dnk" },
  revaninioClasses: { title: "Cours/Tuto C++ #25 : Les Classes", url: "https://www.youtube.com/watch?v=y3w0r-ucIic" },
  revaninioConstructors: { title: "Cours/Tuto C++ #26 : Les Constructeurs", url: "https://www.youtube.com/watch?v=M1yCt4uXG0s" }
};

const playlistVideo = (key, note) => ({
  ...playlistVideos[key],
  note,
  thumbnailUrl: getYoutubeThumbnailUrl(playlistVideos[key].url)
});

const videoCards = (items) => `
  <div class="video-grid">
    ${items.map((item) => `
      <a class="video-card" href="${escapeHtml(item.url)}" target="_blank" rel="noopener noreferrer">
        <span class="video-card__media">
          <img
            class="video-card__thumb"
            src="${escapeHtml(item.thumbnailUrl)}"
            alt="${escapeHtml(`Miniature de la video ${item.title}`)}"
            loading="lazy"
            decoding="async"
          />
          <span class="video-card__badge">Video</span>
          <span class="video-card__play" aria-hidden="true"></span>
        </span>
        <span class="video-card__body">
          <span class="video-card__title">${escapeHtml(item.title)}</span>
          ${item.note ? `<span class="video-card__note">${item.note}</span>` : ""}
          <span class="video-card__cta">Ouvrir sur YouTube</span>
        </span>
      </a>
    `).join("")}
  </div>
`;

const videoLesson = (intro, items) => lesson(
  "Vidéos associées",
  paragraphs(
    `${intro} Tu peux aussi parcourir ${externalLink(chernoPlaylistUrl, "la playlist complète de The Cherno")} ou ${externalLink(revaninioPlaylistUrl, "la playlist francophone de RevaninioComputing")} si tu veux varier le style d'explication.`,
    "Le plus rentable est souvent de lire d'abord le chapitre, puis de regarder une ou deux vidéos ciblées pour fixer le modèle mental, le vocabulaire et les pièges."
  ),
  videoCards(items)
);

const lessonDeepDive = ({ focus, retenir = [], pitfalls = [], method = [], check = "" }) => `
  <div class="lesson-deep-dive">
    <p class="lesson-deep-dive__intro">${focus}</p>
    <div class="lesson-deep-dive__grid">
      ${retenir.length ? `
        <section class="lesson-deep-dive__panel">
          <h4>À retenir</h4>
          <ul>
            ${retenir.map((item) => `<li>${item}</li>`).join("")}
          </ul>
        </section>
      ` : ""}
      ${pitfalls.length ? `
        <section class="lesson-deep-dive__panel">
          <h4>Pièges fréquents</h4>
          <ul>
            ${pitfalls.map((item) => `<li>${item}</li>`).join("")}
          </ul>
        </section>
      ` : ""}
      ${method.length ? `
        <section class="lesson-deep-dive__panel lesson-deep-dive__panel--wide">
          <h4>Méthode de travail</h4>
          <ol>
            ${method.map((item) => `<li>${item}</li>`).join("")}
          </ol>
        </section>
      ` : ""}
    </div>
    ${check ? `<p class="lesson-deep-dive__check"><strong>Question de vérification :</strong> ${check}</p>` : ""}
  </div>
`;

const injectLessonDeepDives = (body, expansions) => {
  let index = 0;

  return body.replace(/<\/article>/g, (closingTag) => {
    const expansion = expansions[index];
    index += 1;
    return expansion ? `${lessonDeepDive(expansion)}${closingTag}` : closingTag;
  });
};

const registryState = {
  courseMeta: null,
  roadmap: [],
  glossary: [],
  chapterBundles: []
};

function cloneArray(value) {
  return Array.isArray(value) ? value.slice() : [];
}

function setCourseMeta(value) {
  registryState.courseMeta = value || null;
}

function setRoadmap(value) {
  registryState.roadmap = cloneArray(value);
}

function setGlossary(value) {
  registryState.glossary = cloneArray(value);
}

function registerChapterBundle(bundle) {
  if (!bundle || !bundle.chapter || !bundle.chapter.id) {
    throw new Error("registerChapterBundle attend un bundle avec chapter.id");
  }

  registryState.chapterBundles.push({
    order: Number(bundle.order) || 0,
    chapter: bundle.chapter,
    deepDives: cloneArray(bundle.deepDives)
  });
}

function getCourseMeta() {
  return registryState.courseMeta;
}

function getRoadmap() {
  return registryState.roadmap.slice();
}

function getGlossary() {
  return registryState.glossary.slice();
}

function getChapterBundles() {
  return registryState.chapterBundles.slice();
}

globalScope.CourseDataRegistry = {
  helpers: {
    escapeHtml,
    stripHtml,
    normaliseForSearch,
    lesson,
    paragraphs,
    bullets,
    checklist,
    callout,
    code,
    table,
    externalLink,
    videoLesson,
    playlistVideo
  },
  injectLessonDeepDives,
  setCourseMeta,
  setRoadmap,
  setGlossary,
  registerChapterBundle,
  getCourseMeta,
  getRoadmap,
  getGlossary,
  getChapterBundles
};
})(window);
