(function initialiseCourseDataRuntime(globalScope) {
const sharedStrings = window.CourseAppStrings || {};
const documentRef = globalScope.document || null;

const escapeHtml = sharedStrings.escapeHtml || ((value) => String(value)
  .replace(/&/g, "&amp;")
  .replace(/</g, "&lt;")
  .replace(/>/g, "&gt;")
  .replace(/"/g, "&quot;")
  .replace(/'/g, "&#39;"));

const escapeAttribute = sharedStrings.escapeAttribute || escapeHtml;

const stripHtml = (value) => value.replace(/<[^>]+>/g, " ");

const normaliseForSearch = sharedStrings.normalise || ((value) => String(value)
  .normalize("NFD")
  .replace(/[\u0300-\u036f]/g, "")
  .toLowerCase());

const slugify = sharedStrings.slugify || ((value) => normaliseForSearch(value)
  .replace(/[^a-z0-9]+/g, "-")
  .replace(/^-+|-+$/g, ""));

const proseLinkSelectors = "p, li, td, th, blockquote, dd, dt";
const skippedGlossaryTags = new Set(["A", "BUTTON", "CODE", "PRE", "SCRIPT", "STYLE", "H1", "H2", "H3", "H4", "H5", "H6", "SVG", "FIGURE", "FIGCAPTION"]);
const blockLikeTags = new Set(["P", "LI", "TD", "TH", "BLOCKQUOTE", "DD", "DT"]);

const chapterLore = {
  "vision-outillage": {
    scene: "A Poudlard, on prépare la malle avant de lancer le moindre sort.",
    focus: "Repère les outils, le point d'entrée et le trajet global du programme."
  },
  "fondamentaux-syntaxe": {
    scene: "Un sorcier lit une consigne simple, choisit une maison et affiche un message clair.",
    focus: "Lis le code du haut vers le bas : on déclare, on décide, puis on affiche."
  },
  "pointeurs-memoire": {
    scene: "Un grimoire et son étagère servent à distinguer la valeur et l'adresse.",
    focus: "Observe toujours qui possède la valeur et qui ne fait que la viser."
  },
  "fonctions-references": {
    scene: "Une chouette transporte un message sans recopier tout le parchemin.",
    focus: "Regarde ce que la fonction reçoit, ce qu'elle promet et ce qu'elle modifie."
  },
  "classes-encapsulation": {
    scene: "Chaque sorcier garde son grimoire derrière des règles d'accès précises.",
    focus: "La classe protège son invariant avant d'exposer des opérations utiles."
  },
  "constructeurs-raii": {
    scene: "Un grimoire magique doit être ouvert correctement puis refermé automatiquement.",
    focus: "La construction prépare la ressource ; la destruction la nettoie sans oubli."
  },
  "memoire-smart-pointers": {
    scene: "Un patronus surveille la ressource pour éviter les oublis et les doubles gardiens.",
    focus: "Demande-toi toujours qui possède réellement l'objet et combien de propriétaires existent."
  },
  "copie-mouvement": {
    scene: "Transférer un coffre magique coûte moins cher que le recopier page par page.",
    focus: "Compare la copie complète avec le simple transfert de possession."
  },
  "surcharge-operateurs": {
    scene: "Une potion bien conçue réagit comme un objet naturel, sans surprise pour le lecteur.",
    focus: "La surcharge doit rendre le code plus lisible, pas plus mystérieux."
  },
  "heritage-polymorphisme": {
    scene: "Plusieurs sorciers partagent un même rôle, mais chacun lance son propre sort.",
    focus: "Lis la base comme un contrat commun et la dérivée comme une spécialisation concrète."
  },
  "templates-stl": {
    scene: "Le même sort s'applique à plusieurs créatures tant que le contrat reste le même.",
    focus: "Repère le modèle générique, puis imagine ses instanciations concrètes."
  },
  "flux-io": {
    scene: "La bibliothèque de Poudlard possède une salle des parchemins : qu'on lise sur une ardoise, dans un grimoire ou sur un miroir enchanté, on utilise toujours le même sort de lecture.",
    focus: "Identifie d'abord la source du flux, puis sépare ouverture, lecture brute et validation métier."
  },
  "exceptions-erreurs": {
    scene: "Un sorcier expérimenté ne panique pas quand un sort tourne mal — il a prévu un filet de sécurité, sait où l'activer et n'encombre pas chaque corridor d'attrape-tout.",
    focus: "Sépare les erreurs de conception (logic_error), les aléas d'exécution (runtime_error) et les alternatives légitimes à l'exception (optional, code de retour)."
  },
  "modern-cpp": {
    scene: "Le cours de magie moderne cherche moins de bruit et plus d'intention.",
    focus: "Observe les outils qui réduisent le code répétitif tout en gardant le contrat lisible."
  },
  "concurrence-threads": {
    scene: "Plusieurs chouettes travaillent en même temps sur la même salle des hiboux.",
    focus: "Repère ce qui s'exécute en parallèle et ce qui doit être protégé."
  },
  "tests-qualite": {
    scene: "Avant le duel, chaque sort est testé dans une salle d'entraînement contrôlée.",
    focus: "Le test décrit le comportement attendu avant de parler d'implémentation."
  },
  "architecture-projet": {
    scene: "Le château reste lisible parce que chaque aile a un rôle net et peu de passages cachés.",
    focus: "Lis l'organisation comme une carte : responsabilité, dépendances et points d'entrée."
  }
};

const autoCommentRules = [
  {
    id: "include",
    pattern: /^\s*#include\s+/,
    comment: "ajoute un en-tete utilise plus bas dans l'exemple"
  },
  {
    id: "main",
    pattern: /^\s*int\s+main\s*\(/,
    comment: "point d'entree : l'execution du programme commence ici"
  },
  {
    id: "brace-init",
    pattern: /^\s*(?:const\s+)?(?:bool|int|double|float|char|auto|std::string|std::vector<[^>]+>|std::unique_ptr<[^>]+>|std::shared_ptr<[^>]+>|std::weak_ptr<[^>]+>|[A-Za-z_][\w:<>]*)\s+[A-Za-z_]\w*\s*\{.*\};\s*$/,
    comment: "initialisation avec accolades : la variable recoit sa premiere valeur ici"
  },
  {
    id: "cin",
    pattern: /^\s*std::cin\s*>>/,
    comment: "lit une valeur et la range dans la variable cible"
  },
  {
    id: "cout",
    pattern: /^\s*std::cout\s*<</,
    comment: "affiche un message ou une valeur dans la console"
  },
  {
    id: "if",
    pattern: /^\s*if\s*\(/,
    comment: "ce bloc s'execute seulement si la condition vaut true"
  },
  {
    id: "else",
    pattern: /^\s*else\b/,
    comment: "chemin alternatif quand la condition precedente est fausse"
  },
  {
    id: "for",
    pattern: /^\s*for\s*\(/,
    comment: "syntaxe du for : initialisation ; condition ; mise a jour"
  },
  {
    id: "while",
    pattern: /^\s*while\s*\(/,
    comment: "la boucle recommence tant que la condition reste vraie"
  },
  {
    id: "class",
    pattern: /^\s*class\s+\w+/,
    comment: "declare un nouveau type et son contrat"
  },
  {
    id: "public",
    pattern: /^\s*public:\s*$/,
    comment: "interface accessible depuis l'exterieur"
  },
  {
    id: "private",
    pattern: /^\s*private:\s*$/,
    comment: "etat interne reserve a l'implementation"
  },
  {
    id: "move",
    pattern: /std::move\s*\(/,
    comment: "autorise un transfert de ressource au lieu d'une copie"
  },
  {
    id: "smart-pointer",
    pattern: /std::unique_ptr|std::shared_ptr|std::weak_ptr/,
    comment: "le type choisi exprime qui possede la ressource"
  },
  {
    id: "mutex",
    pattern: /std::mutex|std::lock_guard/,
    comment: "sert a proteger une zone critique partagee"
  },
  {
    id: "virtual",
    pattern: /\bvirtual\b|\boverride\b/,
    comment: "sert au polymorphisme et fait verifier la redéfinition par le compilateur"
  },
  {
    id: "try",
    pattern: /^\s*try\s*\{/,
    comment: "le code surveille ici une operation qui peut echouer"
  },
  {
    id: "catch",
    pattern: /^\s*catch\s*\(/,
    comment: "on traite ici l'exception qui s'est propagee"
  },
  {
    id: "return",
    pattern: /^\s*return\b/,
    comment: "termine la fonction et renvoie la valeur attendue"
  }
];

const chapterThemeState = {
  currentChapterId: ""
};

function withChapterTheme(chapterId, build) {
  const previousChapterId = chapterThemeState.currentChapterId;
  chapterThemeState.currentChapterId = chapterId;

  try {
    return build();
  } finally {
    chapterThemeState.currentChapterId = previousChapterId;
  }
}

function getActiveChapterTheme() {
  return chapterLore[chapterThemeState.currentChapterId] || null;
}

function detectCommentPrefix(languageId) {
  if (languageId === "bash" || languageId === "shell") {
    return "#";
  }

  return "//";
}

function addAutoComments(source, languageId, label) {
  const trimmedSource = String(source || "").trim();

  if (!trimmedSource) {
    return trimmedSource;
  }

  const commentPrefix = detectCommentPrefix(languageId);
  const lines = trimmedSource.split("\n");
  const usedRules = new Set();

  return lines.map((line) => {
    const trimmedLine = line.trim();

    if (!trimmedLine) {
      return line;
    }

    if (languageId === "bash" || languageId === "shell" || languageId === "python" || languageId === "text") {
      return line;
    }

    if (trimmedLine.startsWith("//")) {
      return line;
    }

    if (trimmedLine.includes("//")) {
      return line;
    }

    const matchingRule = autoCommentRules.find((rule) => !usedRules.has(rule.id) && rule.pattern.test(line));

    if (!matchingRule) {
      return line;
    }

    usedRules.add(matchingRule.id);
    return `${line} ${commentPrefix} ${matchingRule.comment}`;
  }).join("\n");
}

function deriveAliases(term) {
  const baseTerm = String(term || "").trim();
  const aliases = [];

  if (baseTerm.includes(" / ")) {
    aliases.push(...baseTerm.split(" / ").map((item) => item.trim()));
  }

  return aliases.filter(Boolean);
}

function uniqueValues(items) {
  return Array.from(new Set(items.filter(Boolean)));
}

function prepareGlossaryEntry(entry) {
  if (!entry || !entry.term) {
    return null;
  }

  const aliases = uniqueValues([...(Array.isArray(entry.aliases) ? entry.aliases : []), ...deriveAliases(entry.term)]);
  return Object.assign({}, entry, {
    id: entry.id || slugify(entry.term),
    aliases
  });
}

function prepareGlossaryEntries(entries) {
  return (Array.isArray(entries) ? entries : [])
    .map((entry) => prepareGlossaryEntry(entry))
    .filter(Boolean);
}

function getGlossaryLinkTerms(entry) {
  if (!entry || entry.autoLink === false) {
    return [];
  }

  if (Array.isArray(entry.linkTerms) && entry.linkTerms.length) {
    return uniqueValues(entry.linkTerms);
  }

  return uniqueValues([entry.term, ...(entry.aliases || [])]);
}

function createGlossaryLinkIndex(glossaryEntries) {
  return glossaryEntries
    .flatMap((entry) => getGlossaryLinkTerms(entry).map((phrase) => ({
      entryId: entry.id,
      phrase,
      normalisedPhrase: normaliseForSearch(phrase)
    })))
    .filter((candidate) => candidate.normalisedPhrase.length > 1)
    .sort((left, right) => {
      if (right.normalisedPhrase.length !== left.normalisedPhrase.length) {
        return right.normalisedPhrase.length - left.normalisedPhrase.length;
      }

      return left.phrase.localeCompare(right.phrase, "fr", { sensitivity: "base" });
    });
}

function isWordBoundaryCharacter(character) {
  return !/[a-z0-9_]/i.test(character || "");
}

function buildNormalisedTextMap(text) {
  const sourceText = String(text || "");
  let normalisedText = "";
  const normalisedBoundaries = [0];
  let originalIndex = 0;

  for (const character of sourceText) {
    const characterLength = character.length;
    const normalisedCharacter = normaliseForSearch(character);

    normalisedText += normalisedCharacter;
    originalIndex += characterLength;

    const repeatCount = Math.max(normalisedCharacter.length, 1);
    for (let index = 0; index < repeatCount; index += 1) {
      normalisedBoundaries.push(originalIndex);
    }
  }

  return {
    sourceText,
    normalisedText,
    normalisedBoundaries
  };
}

function findFirstGlossaryMatch(textMap, candidates, seenEntryIds) {
  const { normalisedText, normalisedBoundaries } = textMap;
  let bestMatch = null;

  candidates.forEach((candidate) => {
    if (seenEntryIds.has(candidate.entryId)) {
      return;
    }

    let position = normalisedText.indexOf(candidate.normalisedPhrase);

    while (position !== -1) {
      const before = normalisedText[position - 1] || "";
      const after = normalisedText[position + candidate.normalisedPhrase.length] || "";

      if (isWordBoundaryCharacter(before) && isWordBoundaryCharacter(after)) {
        if (
          !bestMatch ||
          position < bestMatch.position ||
          (position === bestMatch.position && candidate.normalisedPhrase.length > bestMatch.candidate.normalisedPhrase.length)
        ) {
          bestMatch = {
            candidate,
            position,
            originalStart: normalisedBoundaries[position] ?? position,
            originalEnd: normalisedBoundaries[position + candidate.normalisedPhrase.length] ?? (position + candidate.normalisedPhrase.length)
          };
        }
        return;
      }

      position = normalisedText.indexOf(candidate.normalisedPhrase, position + 1);
    }
  });

  return bestMatch;
}

function createGlossaryLinkNode(entryId, text) {
  const link = documentRef.createElement("button");
  link.type = "button";
  link.className = "glossary-link";
  link.setAttribute("data-glossary-link", entryId);
  link.setAttribute("aria-label", `Voir la définition de ${text} dans le glossaire`);
  link.textContent = text;
  return link;
}

function linkTextNode(node, glossaryIndex, seenEntryIds) {
  const sourceText = node.textContent || "";

  if (!sourceText.trim()) {
    return false;
  }

  let remainder = sourceText;
  const fragment = documentRef.createDocumentFragment();
  let didReplace = false;

  while (remainder) {
    const remainderMap = buildNormalisedTextMap(remainder);
    const match = findFirstGlossaryMatch(remainderMap, glossaryIndex, seenEntryIds);

    if (!match) {
      fragment.appendChild(documentRef.createTextNode(remainder));
      break;
    }

    const { candidate, originalStart, originalEnd } = match;
    const matchedText = remainder.slice(originalStart, originalEnd);
    const before = remainder.slice(0, originalStart);
    const after = remainder.slice(originalEnd);

    if (before) {
      fragment.appendChild(documentRef.createTextNode(before));
    }

    fragment.appendChild(createGlossaryLinkNode(candidate.entryId, matchedText));
    seenEntryIds.add(candidate.entryId);
    remainder = after;
    didReplace = true;
  }

  if (!didReplace) {
    return false;
  }

  node.replaceWith(fragment);
  return true;
}

function annotateGlossaryLinks(root, glossaryEntries, sharedSeenEntryIds = null) {
  if (!documentRef || !root || !glossaryEntries.length) {
    return root;
  }

  const glossaryIndex = createGlossaryLinkIndex(glossaryEntries);
  const seenEntryIds = sharedSeenEntryIds || new Set();
  const collectedBlocks = [];

  if (typeof root.matches === "function" && root.matches(proseLinkSelectors)) {
    collectedBlocks.push(root);
  }

  if (typeof root.querySelectorAll === "function") {
    collectedBlocks.push(...root.querySelectorAll(proseLinkSelectors));
  }

  if (!collectedBlocks.length && root.firstElementChild && !skippedGlossaryTags.has(root.firstElementChild.tagName)) {
    collectedBlocks.push(root.firstElementChild);
  }

  const blockNodes = Array.from(new Set(collectedBlocks.filter((node) => !node.closest("a, button, code, pre, .formula, .figure, figure, svg"))));

  blockNodes.forEach((block) => {
    const walker = documentRef.createTreeWalker(block, NodeFilter.SHOW_TEXT);
    const textNodes = [];

    while (walker.nextNode()) {
      const currentNode = walker.currentNode;
      const parentElement = currentNode.parentElement;

      if (!parentElement) {
        continue;
      }

      if (parentElement.closest("a, button, code, pre, .formula, .figure, figure, svg")) {
        continue;
      }

      if (skippedGlossaryTags.has(parentElement.tagName)) {
        continue;
      }

      textNodes.push(currentNode);
    }

    textNodes.forEach((textNode) => {
      linkTextNode(textNode, glossaryIndex, seenEntryIds);
    });
  });

  return root;
}

function linkGlossaryInHtml(html, glossaryEntries, sharedSeenEntryIds = null) {
  if (!documentRef || !html) {
    return html;
  }

  const template = documentRef.createElement("template");
  template.innerHTML = html;
  annotateGlossaryLinks(template.content, glossaryEntries, sharedSeenEntryIds);
  return template.innerHTML;
}

function linkGlossaryInSnippet(html, glossaryEntries, sharedSeenEntryIds = null) {
  if (!documentRef || !html) {
    return html;
  }

  const wrapper = documentRef.createElement("div");
  wrapper.innerHTML = `<span>${html}</span>`;
  annotateGlossaryLinks(wrapper, glossaryEntries, sharedSeenEntryIds);
  return wrapper.firstElementChild ? wrapper.firstElementChild.innerHTML : html;
}

function themeExercisePrompt(chapterId, prompt) {
  return prompt;
}

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
  const enrichedSource = addAutoComments(source, languageId, label);

  return `
    <div class="code-block code-block--${languageId}">
      <div class="code-block__head">
        <span>${label}</span>
        <span>${language}</span>
      </div>
      <pre><code class="code-block__code language-${languageId}" data-language="${languageId}">${escapeHtml(enrichedSource)}</code></pre>
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

const formula = (body, { caption = "", inline = false } = {}) => {
  if (inline) {
    return `<span class="formula formula--inline">${body}</span>`;
  }
  return `
    <div class="formula formula--block" role="math">
      <div class="formula__body">${body}</div>
      ${caption ? `<div class="formula__caption">${caption}</div>` : ""}
    </div>
  `;
};

const figure = (body, { caption = "", label = "", variant = "" } = {}) => {
  const variantClass = variant ? ` figure--${variant}` : "";
  const labelAttr = label ? ` aria-label="${escapeAttribute(label)}"` : "";
  return `
    <figure class="figure${variantClass}"${labelAttr}>
      <div class="figure__body">${body}</div>
      ${caption ? `<figcaption class="figure__caption">${caption}</figcaption>` : ""}
    </figure>
  `;
};

const chernoPlaylistUrl = "https://www.youtube.com/playlist?list=PLlrATfBNZ98dudnM48yfGUldqGD0S4FFb";
const revaninioPlaylistUrl = "https://www.youtube.com/playlist?list=PL0ibd6OZI4XKMwaPS1xHU9N_smy3AkcUr";
const broCodePlaylistUrl = "https://www.youtube.com/playlist?list=PLZPZq0r_RZOMHoXIcxze_lP97j2Ase2on";

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
  broCodeIntro: { title: "C++ tutorial for beginners", url: "https://www.youtube.com/watch?v=hDaKit2IM0E" },
  broCodeVariables: { title: "C++ variables & data types (#3)", url: "https://www.youtube.com/watch?v=QANQHxx9I8Y" },
  broCodeUserInput: { title: "C++ how to accept user input (#4)", url: "https://www.youtube.com/watch?v=zmrJnHKZQC0" },
  broCodeIfStatements: { title: "C++ if statements (#6)", url: "https://www.youtube.com/watch?v=ljEZlKU5XT4" },
  broCodeForLoops: { title: "C++ for loops (#12)", url: "https://www.youtube.com/watch?v=TK7fjq28ma8" },
  broCodeFunctions: { title: "C++ user defined functions (#15)", url: "https://www.youtube.com/watch?v=vKTYM-DJDiw" },
  broCodePointers: { title: "C++ pointers (#18)", url: "https://www.youtube.com/watch?v=Nq_1BMS2iOw" },
  broCodeOop: { title: "C++ object oriented programming (#21)", url: "https://www.youtube.com/watch?v=VHOH6CQJ-2g" },
  broCodeConstructors: { title: "C++ constructors (#22)", url: "https://www.youtube.com/watch?v=i96FsK-00ro" },
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
    `${intro} Tu peux aussi parcourir ${externalLink(chernoPlaylistUrl, "la playlist complète de The Cherno")}, ${externalLink(revaninioPlaylistUrl, "la playlist francophone de RevaninioComputing")} ou ${externalLink(broCodePlaylistUrl, "la playlist C++ de Bro Code")} si tu veux varier le style d'explication.`,
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
    escapeAttribute,
    escapeHtml,
    stripHtml,
    normaliseForSearch,
    slugify,
    lesson,
    paragraphs,
    bullets,
    checklist,
    callout,
    code,
    table,
    formula,
    figure,
    externalLink,
    withChapterTheme,
    videoLesson,
    playlistVideo
  },
  injectLessonDeepDives,
  linkGlossaryInHtml,
  linkGlossaryInSnippet,
  prepareGlossaryEntries,
  themeExercisePrompt,
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
