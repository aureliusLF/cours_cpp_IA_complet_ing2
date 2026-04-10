(function registerIaFigures(globalScope) {
// Bibliothèque de schémas SVG inline réutilisables pour le cours IA.
// Chaque figure est une chaîne HTML/SVG, à inclure via le helper figure() des leçons,
// ou directement dans les cartes du glossaire (via le champ `visual`).
//
// Toutes les couleurs et animations sont définies dans main.css via les classes
// .svg-* et .anim-*. Ne pas mettre de styles inline — préférer les classes.

// ---------- Primitives réutilisables (marqueurs de flèches) ----------

const arrowHeadDefs = `
  <defs>
    <marker id="arrowHead" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--accent, #14b8a6)"></path>
    </marker>
  </defs>
`;

// ---------- 1. Hiérarchie des caractéristiques : pixels → motifs → objets ----------

const featureHierarchy = `
  <svg viewBox="0 0 560 160" role="img" aria-label="Hiérarchie d'abstraction d'un réseau profond">
    ${arrowHeadDefs}
    <!-- Niveau 1 : pixels bruts -->
    <g transform="translate(20, 30)">
      <rect class="svg-cell" x="0"  y="0"  width="16" height="16"/>
      <rect class="svg-cell" x="16" y="0"  width="16" height="16"/>
      <rect class="svg-cell" x="32" y="0"  width="16" height="16"/>
      <rect class="svg-cell" x="48" y="0"  width="16" height="16"/>
      <rect class="svg-cell" x="0"  y="16" width="16" height="16"/>
      <rect class="svg-cell" x="16" y="16" width="16" height="16" fill="rgba(20,184,166,0.5)"/>
      <rect class="svg-cell" x="32" y="16" width="16" height="16" fill="rgba(20,184,166,0.35)"/>
      <rect class="svg-cell" x="48" y="16" width="16" height="16"/>
      <rect class="svg-cell" x="0"  y="32" width="16" height="16"/>
      <rect class="svg-cell" x="16" y="32" width="16" height="16" fill="rgba(20,184,166,0.35)"/>
      <rect class="svg-cell" x="32" y="32" width="16" height="16" fill="rgba(20,184,166,0.5)"/>
      <rect class="svg-cell" x="48" y="32" width="16" height="16"/>
      <rect class="svg-cell" x="0"  y="48" width="16" height="16"/>
      <rect class="svg-cell" x="16" y="48" width="16" height="16"/>
      <rect class="svg-cell" x="32" y="48" width="16" height="16"/>
      <rect class="svg-cell" x="48" y="48" width="16" height="16"/>
      <text class="svg-label" x="32" y="90">Pixels</text>
      <text class="svg-label-small" x="32" y="104">Niveau bas</text>
    </g>

    <!-- Flèche 1 -->
    <line class="svg-arrow" x1="110" y1="62" x2="170" y2="62"/>

    <!-- Niveau 2 : bords / motifs -->
    <g transform="translate(180, 30)">
      <rect class="svg-cell" x="0" y="0" width="64" height="64" fill="rgba(20,184,166,0.08)"/>
      <line stroke="var(--accent)" stroke-width="3" x1="8"  y1="14" x2="28" y2="14"/>
      <line stroke="var(--accent)" stroke-width="3" x1="36" y1="14" x2="56" y2="14"/>
      <line stroke="var(--accent)" stroke-width="3" x1="14" y1="26" x2="50" y2="48"/>
      <line stroke="var(--accent)" stroke-width="3" x1="10" y1="52" x2="54" y2="52"/>
      <text class="svg-label" x="32" y="90">Bords & motifs</text>
      <text class="svg-label-small" x="32" y="104">Niveau intermédiaire</text>
    </g>

    <!-- Flèche 2 -->
    <line class="svg-arrow" x1="270" y1="62" x2="330" y2="62"/>

    <!-- Niveau 3 : parties d'objets (œil, nez) -->
    <g transform="translate(340, 30)">
      <rect class="svg-cell" x="0" y="0" width="64" height="64" fill="rgba(20,184,166,0.08)"/>
      <circle cx="20" cy="22" r="8" stroke="var(--accent)" stroke-width="2.5" fill="none"/>
      <circle cx="44" cy="22" r="8" stroke="var(--accent)" stroke-width="2.5" fill="none"/>
      <circle cx="20" cy="22" r="3" fill="var(--accent)"/>
      <circle cx="44" cy="22" r="3" fill="var(--accent)"/>
      <path d="M 18 44 Q 32 54 46 44" stroke="var(--accent)" stroke-width="2.5" fill="none"/>
      <text class="svg-label" x="32" y="90">Parties</text>
      <text class="svg-label-small" x="32" y="104">Niveau haut</text>
    </g>

    <!-- Flèche 3 -->
    <line class="svg-arrow" x1="430" y1="62" x2="490" y2="62"/>

    <!-- Niveau 4 : concept (« chat ») -->
    <g transform="translate(500, 30)">
      <rect class="svg-pipeline-block" x="0" y="14" width="50" height="36" rx="8"/>
      <text class="svg-pipeline-block-text" x="25" y="32">"chat"</text>
      <text class="svg-label" x="25" y="90">Concept</text>
      <text class="svg-label-small" x="25" y="104">Niveau sémantique</text>
    </g>
  </svg>
`;

// ---------- 2. Convolution animée : filtre qui glisse sur une grille ----------

const convolutionSlide = `
  <svg viewBox="0 0 520 180" role="img" aria-label="Un filtre 3x3 glisse sur une entrée 5x5 et produit une sortie 3x3">
    ${arrowHeadDefs}
    <!-- Entrée 5x5 -->
    <g transform="translate(20, 20)">
      <text class="svg-label" x="70" y="-6">Entrée 5 × 5</text>
      ${(() => {
        const values = [
          [1, 2, 0, 1, 2],
          [0, 1, 3, 2, 1],
          [2, 1, 0, 0, 3],
          [1, 0, 2, 1, 0],
          [0, 2, 1, 3, 2]
        ];
        let cells = "";
        for (let r = 0; r < 5; r++) {
          for (let c = 0; c < 5; c++) {
            const x = c * 20;
            const y = r * 20;
            cells += `<rect class="svg-cell" x="${x}" y="${y}" width="20" height="20"/>`;
            cells += `<text class="svg-cell-text" x="${x + 10}" y="${y + 10}">${values[r][c]}</text>`;
          }
        }
        return cells;
      })()}
      <!-- Fenêtre qui glisse -->
      <g class="anim-slide-window">
        <rect x="0" y="0" width="60" height="60" fill="rgba(20,184,166,0.22)" stroke="var(--accent)" stroke-width="2.5"/>
      </g>
    </g>

    <!-- Flèche -->
    <line class="svg-arrow" x1="150" y1="60" x2="220" y2="60"/>
    <text class="svg-label-small" x="185" y="54">convolve</text>

    <!-- Filtre 3x3 au centre -->
    <g transform="translate(240, 20)">
      <text class="svg-label" x="30" y="-6">Filtre 3 × 3</text>
      ${(() => {
        const values = [[1, 0, 1], [0, 1, 0], [1, 0, 1]];
        let cells = "";
        for (let r = 0; r < 3; r++) {
          for (let c = 0; c < 3; c++) {
            const x = c * 20;
            const y = r * 20;
            cells += `<rect class="svg-filter-cell" x="${x}" y="${y}" width="20" height="20"/>`;
            cells += `<text class="svg-cell-text" x="${x + 10}" y="${y + 10}">${values[r][c]}</text>`;
          }
        }
        return cells;
      })()}
    </g>

    <!-- Flèche -->
    <line class="svg-arrow" x1="320" y1="60" x2="390" y2="60"/>

    <!-- Sortie 3x3 -->
    <g transform="translate(410, 20)">
      <text class="svg-label" x="30" y="-6">Sortie 3 × 3</text>
      ${(() => {
        const values = [[4, 5, 4], [3, 7, 5], [4, 3, 6]];
        let cells = "";
        let idx = 0;
        for (let r = 0; r < 3; r++) {
          for (let c = 0; c < 3; c++) {
            const x = c * 20;
            const y = r * 20;
            cells += `<g class="anim-output-appear-${idx}">
              <rect class="svg-cell" x="${x}" y="${y}" width="20" height="20" fill="rgba(20,184,166,0.18)"/>
              <text class="svg-cell-text" x="${x + 10}" y="${y + 10}">${values[r][c]}</text>
            </g>`;
            idx += 1;
          }
        }
        return cells;
      })()}
    </g>
  </svg>
`;

// ---------- 3. Convolution : calcul détaillé d'une case ----------

const convolutionNumeric = `
  <svg viewBox="0 0 540 200" role="img" aria-label="Calcul détaillé d'une case de la sortie">
    ${arrowHeadDefs}

    <!-- Fenêtre 3x3 extraite de l'entrée -->
    <g transform="translate(20, 40)">
      <text class="svg-label" x="30" y="-10">Fenêtre de l'entrée</text>
      ${[[1,2,0],[0,1,3],[2,1,0]].map((row, r) => row.map((v, c) => `
        <rect class="svg-cell" x="${c*24}" y="${r*24}" width="24" height="24"/>
        <text class="svg-cell-text" x="${c*24+12}" y="${r*24+12}">${v}</text>
      `).join("")).join("")}
    </g>

    <!-- Opérateur ⊙ -->
    <text class="svg-label" x="115" y="88" font-size="22">⊙</text>

    <!-- Filtre 3x3 -->
    <g transform="translate(140, 40)">
      <text class="svg-label" x="30" y="-10">Filtre</text>
      ${[[1,0,1],[0,1,0],[1,0,1]].map((row, r) => row.map((v, c) => `
        <rect class="svg-filter-cell" x="${c*24}" y="${r*24}" width="24" height="24"/>
        <text class="svg-cell-text" x="${c*24+12}" y="${r*24+12}">${v}</text>
      `).join("")).join("")}
    </g>

    <!-- = -->
    <text class="svg-label" x="235" y="88" font-size="22">=</text>

    <!-- Produits 3x3 -->
    <g transform="translate(260, 40)">
      <text class="svg-label" x="36" y="-10">Produits</text>
      ${[[1,0,0],[0,1,0],[2,0,0]].map((row, r) => row.map((v, c) => `
        <rect class="svg-cell" x="${c*24}" y="${r*24}" width="24" height="24" fill="rgba(20,184,166,0.1)"/>
        <text class="svg-cell-text" x="${c*24+12}" y="${r*24+12}">${v}</text>
      `).join("")).join("")}
    </g>

    <!-- Somme -->
    <text class="svg-label" x="360" y="88" font-size="18">Σ =</text>

    <!-- Résultat encadré -->
    <g transform="translate(410, 64)">
      <rect class="svg-highlight" x="0" y="0" width="48" height="48" rx="6"/>
      <text class="svg-cell-text" x="24" y="24" font-size="20" font-weight="700">4</text>
      <text class="svg-label-small" x="24" y="68">une case de sortie</text>
    </g>
  </svg>
`;

// ---------- 4. Max-pooling 4x4 → 2x2 ----------

const maxPoolExample = `
  <svg viewBox="0 0 480 180" role="img" aria-label="Max-pooling 2x2 d'une carte 4x4">
    ${arrowHeadDefs}

    <!-- Entrée 4x4 avec quadrants colorés -->
    <g transform="translate(20, 30)">
      <text class="svg-label" x="60" y="-10">Carte 4 × 4</text>
      ${(() => {
        const values = [
          [1, 3, 2, 0],
          [4, 2, 1, 5],
          [0, 6, 3, 1],
          [2, 1, 4, 7]
        ];
        // Max par quadrant : 4 (haut-g), 5 (haut-d), 6 (bas-g), 7 (bas-d)
        const isMax = (r, c) => (r === 1 && c === 0) || (r === 1 && c === 3) || (r === 2 && c === 1) || (r === 3 && c === 3);
        let out = "";
        for (let r = 0; r < 4; r++) {
          for (let c = 0; c < 4; c++) {
            const x = c * 28;
            const y = r * 28;
            const cls = isMax(r, c) ? "svg-highlight" : "svg-cell";
            out += `<rect class="${cls}" x="${x}" y="${y}" width="28" height="28"/>`;
            out += `<text class="svg-cell-text" x="${x + 14}" y="${y + 14}">${values[r][c]}</text>`;
          }
        }
        // Séparateurs pour délimiter les 4 quadrants 2x2
        out += `<line stroke="var(--accent)" stroke-width="2" stroke-dasharray="3 3" x1="56" y1="0" x2="56" y2="112"/>`;
        out += `<line stroke="var(--accent)" stroke-width="2" stroke-dasharray="3 3" x1="0" y1="56" x2="112" y2="56"/>`;
        return out;
      })()}
    </g>

    <!-- Flèche -->
    <line class="svg-arrow" x1="155" y1="86" x2="255" y2="86"/>
    <text class="svg-label-small" x="205" y="80">max 2 × 2</text>

    <!-- Sortie 2x2 -->
    <g transform="translate(280, 56)">
      <text class="svg-label" x="48" y="-10">Sortie 2 × 2</text>
      ${[[4,5],[6,7]].map((row, r) => row.map((v, c) => `
        <rect class="svg-highlight" x="${c*48}" y="${r*48}" width="48" height="48"/>
        <text class="svg-cell-text" x="${c*48+24}" y="${r*48+24}" font-size="16" font-weight="700">${v}</text>
      `).join("")).join("")}
    </g>
  </svg>
`;

// ---------- 5. Courbe ReLU ----------

const reluCurve = `
  <svg viewBox="0 0 360 200" role="img" aria-label="Courbe de la fonction ReLU, f(x) = max(0, x)">
    <!-- Axes -->
    <line class="svg-arrow" x1="40" y1="160" x2="320" y2="160"/>
    <line class="svg-arrow" x1="180" y1="180" x2="180" y2="20"/>
    <text class="svg-label-small" x="310" y="175">x</text>
    <text class="svg-label-small" x="190" y="25">f(x)</text>

    <!-- Courbe : partie négative à zéro, puis rampe -->
    <path d="M 40 160 L 180 160 L 300 40" stroke="var(--accent)" stroke-width="3" fill="none"/>

    <!-- Point de coude -->
    <circle cx="180" cy="160" r="4" fill="var(--accent)"/>

    <!-- Annotations -->
    <text class="svg-label-small" x="105" y="175">f(x) = 0</text>
    <text class="svg-label-small" x="240" y="100">f(x) = x</text>

    <!-- Titre -->
    <text class="svg-label" x="180" y="195">ReLU : f(x) = max(0, x)</text>
  </svg>
`;

// ---------- 6. Comparaison sigmoïde / tanh / ReLU / Leaky ReLU ----------

const sigmoidTanhReluCompare = `
  <svg viewBox="0 0 720 180" role="img" aria-label="Comparaison de fonctions d'activation">
    ${(() => {
      const plots = [
        {
          title: "Sigmoïde",
          path: "M 20 140 Q 70 140 90 80 T 160 20",
          note: "σ(x) = 1 / (1 + e⁻ˣ)"
        },
        {
          title: "Tanh",
          path: "M 20 140 Q 70 140 90 80 T 160 20",
          note: "tanh(x) ∈ [-1, 1]"
        },
        {
          title: "ReLU",
          path: "M 20 140 L 90 140 L 160 30",
          note: "max(0, x)"
        },
        {
          title: "Leaky ReLU",
          path: "M 20 128 L 90 140 L 160 30",
          note: "0.01·x sinon x"
        }
      ];
      return plots.map((p, i) => `
        <g transform="translate(${i * 180}, 0)">
          <rect class="svg-cell" x="10" y="10" width="160" height="140" rx="6" fill="rgba(20,184,166,0.06)"/>
          <line class="svg-arrow" x1="20" y1="140" x2="160" y2="140"/>
          <line class="svg-arrow" x1="90" y1="150" x2="90" y2="20"/>
          <path d="${p.path}" stroke="var(--accent)" stroke-width="2.5" fill="none"/>
          <text class="svg-label" x="90" y="170">${p.title}</text>
          <text class="svg-label-small" x="90" y="10">${p.note}</text>
        </g>
      `).join("");
    })()}
  </svg>
`;

// ---------- 7. Dropout : neurones aléatoirement désactivés ----------

const dropoutExample = `
  <svg viewBox="0 0 480 220" role="img" aria-label="Dropout : deux passes d'entraînement avec neurones désactivés">
    ${arrowHeadDefs}

    <g transform="translate(20, 20)">
      <text class="svg-label" x="90" y="-4">Passe d'entraînement</text>

      <!-- Couche entrée (4 neurones) -->
      ${[30, 70, 110, 150].map((y, i) => `
        <circle class="svg-neuron" cx="20" cy="${y}" r="12"/>
      `).join("")}

      <!-- Couche cachée (5 neurones), certains avec dropout-flicker -->
      ${[20, 60, 100, 140, 180].map((y, i) => {
        const cls = i % 2 === 0 ? "svg-neuron anim-dropout-a" : "svg-neuron anim-dropout-b";
        return `<circle class="${cls}" cx="100" cy="${y}" r="12"/>`;
      }).join("")}

      <!-- Deuxième couche cachée (5 neurones), autre pattern -->
      ${[20, 60, 100, 140, 180].map((y, i) => {
        const cls = i % 2 === 1 ? "svg-neuron anim-dropout-c" : "svg-neuron anim-dropout-d";
        return `<circle class="${cls}" cx="180" cy="${y}" r="12"/>`;
      }).join("")}

      <!-- Couche sortie (3 neurones) -->
      ${[50, 100, 150].map((y, i) => `
        <circle class="svg-neuron" cx="260" cy="${y}" r="12"/>
      `).join("")}

      <!-- Connexions (simplifiées : de chaque neurone au suivant) -->
      ${[30, 70, 110, 150].flatMap(y1 => [20, 60, 100, 140, 180].map(y2 =>
        `<line class="svg-connection" x1="32" y1="${y1}" x2="88" y2="${y2}"/>`
      )).join("")}
      ${[20, 60, 100, 140, 180].flatMap(y1 => [20, 60, 100, 140, 180].map(y2 =>
        `<line class="svg-connection" x1="112" y1="${y1}" x2="168" y2="${y2}"/>`
      )).join("")}
      ${[20, 60, 100, 140, 180].flatMap(y1 => [50, 100, 150].map(y2 =>
        `<line class="svg-connection" x1="192" y1="${y1}" x2="248" y2="${y2}"/>`
      )).join("")}

      <!-- Labels -->
      <text class="svg-label-small" x="20" y="210">Entrée</text>
      <text class="svg-label-small" x="100" y="210">Cachée 1</text>
      <text class="svg-label-small" x="180" y="210">Cachée 2</text>
      <text class="svg-label-small" x="260" y="210">Sortie</text>
    </g>

    <g transform="translate(340, 100)">
      <text class="svg-label" x="50" y="-40">Dropout p = 0.5</text>
      <text class="svg-label-small" x="50" y="-22">Chaque neurone a une</text>
      <text class="svg-label-small" x="50" y="-8">chance sur deux d'être</text>
      <text class="svg-label-small" x="50" y="6">coupé à chaque passe.</text>
    </g>
  </svg>
`;

// ---------- 8. Partage de poids : un filtre, plusieurs positions ----------

const weightSharingVisualisation = `
  <svg viewBox="0 0 480 180" role="img" aria-label="Partage de poids : un même filtre est appliqué à toutes les positions">
    ${arrowHeadDefs}

    <!-- Image d'entrée -->
    <g transform="translate(20, 30)">
      <text class="svg-label" x="50" y="-10">Image</text>
      <rect class="svg-cell" x="0" y="0" width="120" height="120" fill="rgba(20,184,166,0.06)"/>
      <!-- 3 positions surlignées -->
      <rect class="svg-highlight" x="10"  y="10"  width="30" height="30"/>
      <rect class="svg-highlight" x="45"  y="50"  width="30" height="30"/>
      <rect class="svg-highlight" x="80"  y="85"  width="30" height="30"/>
    </g>

    <!-- Un seul filtre central, relié par 3 flèches aux 3 positions -->
    <g transform="translate(260, 60)">
      <text class="svg-label" x="30" y="-20">Un seul filtre</text>
      <rect class="svg-filter-cell" x="0"  y="0"  width="20" height="20"/>
      <rect class="svg-filter-cell" x="20" y="0"  width="20" height="20"/>
      <rect class="svg-filter-cell" x="40" y="0"  width="20" height="20"/>
      <rect class="svg-filter-cell" x="0"  y="20" width="20" height="20"/>
      <rect class="svg-filter-cell" x="20" y="20" width="20" height="20"/>
      <rect class="svg-filter-cell" x="40" y="20" width="20" height="20"/>
      <rect class="svg-filter-cell" x="0"  y="40" width="20" height="20"/>
      <rect class="svg-filter-cell" x="20" y="40" width="20" height="20"/>
      <rect class="svg-filter-cell" x="40" y="40" width="20" height="20"/>
    </g>

    <!-- Flèches du filtre vers les 3 positions -->
    <path class="svg-arrow" d="M 260 90 C 200 70 170 55 155 55" stroke-dasharray="4 3"/>
    <path class="svg-arrow" d="M 260 100 C 210 110 190 115 175 115"/>
    <path class="svg-arrow" d="M 260 110 C 220 150 200 150 180 150"/>

    <text class="svg-label-small" x="260" y="150">9 poids seulement</text>
    <text class="svg-label-small" x="260" y="165">réutilisés partout</text>
  </svg>
`;

// ---------- 9. Croissance du champ récepteur ----------

const receptiveFieldGrowth = `
  <svg viewBox="0 0 420 220" role="img" aria-label="Le champ récepteur grandit avec la profondeur">
    ${arrowHeadDefs}

    <!-- Trois couches empilées horizontalement (en perspective) -->
    ${[0, 1, 2].map((i) => {
      const x = 30 + i * 130;
      const y = 40;
      const size = 90;
      // Largeur du champ récepteur dans l'entrée
      const receptiveWidth = 18 + i * 22;
      const receptiveX = x + (size - receptiveWidth) / 2;
      return `
        <rect class="svg-cell" x="${x}" y="${y}" width="${size}" height="${size}" fill="rgba(20,184,166,0.08)"/>
        <rect class="svg-highlight" x="${receptiveX}" y="${y + (size - receptiveWidth) / 2}" width="${receptiveWidth}" height="${receptiveWidth}"/>
        <text class="svg-label" x="${x + size / 2}" y="${y - 10}">Couche ${i + 1}</text>
        <text class="svg-label-small" x="${x + size / 2}" y="${y + size + 16}">champ ≈ ${3 + i * 2}×${3 + i * 2}</text>
      `;
    }).join("")}

    <!-- Flèches entre couches -->
    <line class="svg-arrow" x1="125" y1="85" x2="155" y2="85"/>
    <line class="svg-arrow" x1="255" y1="85" x2="285" y2="85"/>

    <!-- Légende -->
    <text class="svg-label-small" x="210" y="200">Plus on est profond, plus chaque neurone voit une zone large de l'entrée.</text>
  </svg>
`;

// ---------- 10. Pipeline ConvNet complet ----------

const convnetPipeline = `
  <svg viewBox="0 0 760 140" role="img" aria-label="Pipeline d'un réseau convolutif : Image → Conv → ReLU → Pool → ... → FC → Softmax">
    ${arrowHeadDefs}

    ${(() => {
      const steps = [
        { label: "Image", sub: "entrée" },
        { label: "Conv", sub: "filtres" },
        { label: "ReLU", sub: "activation" },
        { label: "Pool", sub: "2 × 2" },
        { label: "Conv", sub: "filtres" },
        { label: "ReLU", sub: "activation" },
        { label: "Pool", sub: "2 × 2" },
        { label: "FC", sub: "dense" },
        { label: "Softmax", sub: "classe" }
      ];
      const blockW = 74;
      const gap = 10;
      const y = 40;
      let out = "";
      steps.forEach((step, i) => {
        const x = 10 + i * (blockW + gap);
        out += `
          <rect class="svg-pipeline-block" x="${x}" y="${y}" width="${blockW}" height="50" rx="8"/>
          <text class="svg-pipeline-block-text" x="${x + blockW / 2}" y="${y + 22}">${step.label}</text>
          <text class="svg-label-small" x="${x + blockW / 2}" y="${y + 40}">${step.sub}</text>
        `;
        if (i < steps.length - 1) {
          const arrowX1 = x + blockW;
          const arrowX2 = x + blockW + gap - 1;
          out += `<line class="svg-arrow anim-pipeline-arrow" x1="${arrowX1}" y1="${y + 25}" x2="${arrowX2}" y2="${y + 25}"/>`;
        }
      });
      return out;
    })()}

    <text class="svg-label-small" x="380" y="115">Chaque bloc reçoit la sortie du précédent — le tenseur rapetisse et s'épaissit.</text>
  </svg>
`;

// ---------- 11. Descente de gradient 2D avec bille qui descend ----------

const gradientDescent2D = `
  <svg viewBox="0 0 420 220" role="img" aria-label="Descente de gradient : une bille qui descend dans une vallée">
    <!-- Axes -->
    <line class="svg-arrow" x1="40" y1="180" x2="390" y2="180"/>
    <line class="svg-arrow" x1="60" y1="200" x2="60" y2="30"/>
    <text class="svg-label-small" x="380" y="196">paramètre</text>
    <text class="svg-label-small" x="70" y="36">perte</text>

    <!-- Courbe en U (cuvette) -->
    <path d="M 70 60 Q 120 200 220 180 Q 320 155 380 80"
          stroke="var(--accent)" stroke-width="3" fill="none"/>

    <!-- Bille animée qui descend la pente -->
    <g class="anim-ball">
      <circle cx="90" cy="95" r="8" fill="var(--accent)"/>
    </g>

    <!-- Minimum marqué -->
    <circle cx="195" cy="179" r="5" fill="none" stroke="var(--accent)" stroke-width="2"/>
    <text class="svg-label-small" x="195" y="200">minimum</text>
  </svg>
`;

// ---------- 12. Vanishing gradient : gradient qui s'évapore ----------

const vanishingGradientHeatmap = `
  <svg viewBox="0 0 420 200" role="img" aria-label="Vanishing gradient : le gradient devient de plus en plus faible dans les couches profondes">
    <text class="svg-label" x="210" y="18">Intensité du gradient par couche</text>

    ${(() => {
      const layers = 8;
      const barW = 36;
      const gap = 10;
      const xStart = 30;
      const yBase = 160;
      let out = "";
      for (let i = 0; i < layers; i++) {
        // Intensité décroissante exponentiellement depuis le haut vers la sortie
        const strength = Math.pow(0.65, layers - 1 - i);
        const height = Math.max(4, strength * 110);
        const x = xStart + i * (barW + gap);
        const y = yBase - height;
        const opacity = 0.25 + 0.75 * strength;
        out += `<rect x="${x}" y="${y}" width="${barW}" height="${height}" fill="var(--accent)" fill-opacity="${opacity.toFixed(2)}" rx="3"/>`;
        out += `<text class="svg-label-small" x="${x + barW / 2}" y="${yBase + 18}">L${i + 1}</text>`;
      }
      return out;
    })()}

    <text class="svg-label-small" x="40" y="190">couches proches de la sortie</text>
    <text class="svg-label-small" x="380" y="190" text-anchor="end">couches profondes (début)</text>
  </svg>
`;

// ---------- 13. Hyperparamètres : stride et padding (deux mini-schémas) ----------

const strideExample = `
  <svg viewBox="0 0 420 140" role="img" aria-label="Effet du stride sur la convolution">
    <!-- Stride = 1 -->
    <g transform="translate(20, 30)">
      <text class="svg-label" x="60" y="-10">stride = 1</text>
      ${Array.from({ length: 5 }).map((_, c) =>
        Array.from({ length: 5 }).map((_, r) =>
          `<rect class="svg-cell" x="${c*20}" y="${r*20}" width="20" height="20"/>`
        ).join("")
      ).join("")}
      <rect x="0"  y="0"  width="60" height="60" fill="none" stroke="var(--accent)" stroke-width="2"/>
      <rect x="20" y="0"  width="60" height="60" fill="none" stroke="var(--accent)" stroke-width="2" stroke-dasharray="4 3"/>
      <text class="svg-label-small" x="50" y="116">chaque pas = 1</text>
    </g>

    <!-- Stride = 2 -->
    <g transform="translate(240, 30)">
      <text class="svg-label" x="60" y="-10">stride = 2</text>
      ${Array.from({ length: 5 }).map((_, c) =>
        Array.from({ length: 5 }).map((_, r) =>
          `<rect class="svg-cell" x="${c*20}" y="${r*20}" width="20" height="20"/>`
        ).join("")
      ).join("")}
      <rect x="0"  y="0"  width="60" height="60" fill="none" stroke="var(--accent)" stroke-width="2"/>
      <rect x="40" y="0"  width="60" height="60" fill="none" stroke="var(--accent)" stroke-width="2" stroke-dasharray="4 3"/>
      <text class="svg-label-small" x="50" y="116">chaque pas = 2</text>
    </g>
  </svg>
`;

const paddingExample = `
  <svg viewBox="0 0 420 140" role="img" aria-label="Effet du padding : ajouter une bordure de zéros pour préserver la taille">
    <!-- Sans padding -->
    <g transform="translate(20, 30)">
      <text class="svg-label" x="50" y="-10">sans padding</text>
      ${Array.from({ length: 4 }).map((_, r) =>
        Array.from({ length: 4 }).map((_, c) =>
          `<rect class="svg-cell" x="${c*20}" y="${r*20}" width="20" height="20"/>`
        ).join("")
      ).join("")}
      <text class="svg-label-small" x="40" y="100">4 × 4</text>
    </g>

    <!-- Avec padding -->
    <g transform="translate(220, 10)">
      <text class="svg-label" x="70" y="10">avec padding = 1</text>
      ${Array.from({ length: 6 }).map((_, r) =>
        Array.from({ length: 6 }).map((_, c) => {
          const isBorder = r === 0 || r === 5 || c === 0 || c === 5;
          const fill = isBorder ? 'fill="rgba(148,163,184,0.2)"' : '';
          return `<rect class="svg-cell" x="${c*20}" y="${r*20 + 20}" width="20" height="20" ${fill}/>
                  ${isBorder ? `<text class="svg-cell-text" x="${c*20+10}" y="${r*20+30}" font-size="11">0</text>` : ''}`;
        }).join("")
      ).join("")}
      <text class="svg-label-small" x="60" y="155">6 × 6 (bordure de zéros)</text>
    </g>
  </svg>
`;

// ---------- Export global ----------

globalScope.IA_FIGURES = {
  featureHierarchy,
  convolutionSlide,
  convolutionNumeric,
  maxPoolExample,
  reluCurve,
  sigmoidTanhReluCompare,
  dropoutExample,
  weightSharingVisualisation,
  receptiveFieldGrowth,
  convnetPipeline,
  gradientDescent2D,
  vanishingGradientHeatmap,
  strideExample,
  paddingExample
};
})(window);
