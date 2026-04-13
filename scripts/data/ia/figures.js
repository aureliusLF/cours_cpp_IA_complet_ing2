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

// ---------- 14. Feedforward vs récurrent ----------

const rnnFeedforwardVsRecurrent = `
  <svg viewBox="0 0 760 300" role="img" aria-label="Comparaison entre un réseau feedforward et un réseau récurrent">
    ${arrowHeadDefs}

    <g transform="translate(24, 34)">
      <rect class="svg-cell" x="0" y="0" width="322" height="210" rx="12" fill="rgba(20,184,166,0.04)"/>
      <text class="svg-label" x="161" y="28">Feedforward</text>

      <rect class="svg-pipeline-block" x="28" y="86" width="64" height="42" rx="8"/>
      <text class="svg-pipeline-block-text" x="60" y="111">X</text>

      <rect class="svg-pipeline-block" x="126" y="76" width="88" height="62" rx="8"/>
      <text class="svg-pipeline-block-text" x="170" y="102">réseau</text>
      <text class="svg-label-small" x="170" y="122">sans boucle</text>

      <rect class="svg-pipeline-block" x="252" y="86" width="42" height="42" rx="8"/>
      <text class="svg-pipeline-block-text" x="273" y="111">Y</text>

      <line class="svg-arrow anim-pipeline-arrow" x1="92" y1="107" x2="126" y2="107"/>
      <line class="svg-arrow anim-pipeline-arrow" x1="214" y1="107" x2="252" y2="107"/>

      <circle cx="108" cy="107" r="5" fill="var(--accent)">
        <animate attributeName="cx" values="96;122;96" dur="2.6s" repeatCount="indefinite"/>
      </circle>

      <text class="svg-label-small" x="161" y="170">L'information circule dans un seul sens.</text>
      <text class="svg-label-small" x="161" y="188">Pas d'état réinjecté au pas suivant.</text>
    </g>

    <g transform="translate(386, 34)">
      <rect class="svg-cell" x="0" y="0" width="350" height="210" rx="12" fill="rgba(20,184,166,0.04)"/>
      <text class="svg-label" x="175" y="28">Récurrent</text>

      <rect class="svg-pipeline-block" x="26" y="86" width="64" height="42" rx="8"/>
      <text class="svg-pipeline-block-text" x="58" y="111">X<tspan baseline-shift="sub">t</tspan></text>

      <circle class="svg-neuron anim-pulse" cx="162" cy="107" r="31"/>
      <text class="svg-label" x="162" y="111">RNN</text>

      <rect class="svg-pipeline-block" x="264" y="86" width="58" height="42" rx="8"/>
      <text class="svg-pipeline-block-text" x="293" y="111">Y<tspan baseline-shift="sub">t</tspan></text>

      <rect class="svg-pipeline-block" x="22" y="158" width="78" height="34" rx="8"/>
      <text class="svg-pipeline-block-text" x="61" y="178">h<tspan baseline-shift="sub">t−1</tspan></text>

      <rect class="svg-pipeline-block" x="126" y="158" width="72" height="34" rx="8"/>
      <text class="svg-pipeline-block-text" x="162" y="178">h<tspan baseline-shift="sub">t</tspan></text>

      <line class="svg-arrow" x1="90" y1="107" x2="131" y2="107"/>
      <line class="svg-arrow" x1="193" y1="107" x2="264" y2="107"/>
      <line class="svg-arrow" x1="61" y1="158" x2="134" y2="128"/>
      <line class="svg-arrow" x1="162" y1="138" x2="162" y2="158"/>
      <path class="svg-arrow" d="M 198 175 C 246 182 284 166 310 140" stroke-dasharray="5 4"/>

      <circle cx="110" cy="107" r="5" fill="var(--accent)">
        <animate attributeName="cx" values="94;128;94" dur="2.6s" repeatCount="indefinite"/>
      </circle>

      <text class="svg-label-small" x="249" y="185">mémoire transmise au pas t+1</text>
      <text class="svg-label-small" x="175" y="54">H<tspan baseline-shift="sub">t</tspan> dépend de X<tspan baseline-shift="sub">t</tspan> et de H<tspan baseline-shift="sub">t−1</tspan></text>
    </g>
  </svg>
`;

// ---------- 15. Jordan vs Elman ----------

const jordanElmanComparison = `
  <svg viewBox="0 0 760 280" role="img" aria-label="Comparaison entre le réseau de Jordan et le réseau d'Elman">
    ${arrowHeadDefs}

    <g transform="translate(24, 34)">
      <rect class="svg-cell" x="0" y="0" width="340" height="206" rx="12" fill="rgba(20,184,166,0.04)"/>
      <text class="svg-label" x="170" y="28">Jordan : la sortie revient</text>

      <rect class="svg-pipeline-block" x="26" y="74" width="58" height="38" rx="8"/>
      <text class="svg-pipeline-block-text" x="55" y="97">X<tspan baseline-shift="sub">t</tspan></text>

      <rect class="svg-pipeline-block" x="126" y="64" width="76" height="58" rx="8"/>
      <text class="svg-pipeline-block-text" x="164" y="92">H<tspan baseline-shift="sub">t</tspan></text>
      <text class="svg-label-small" x="164" y="110">caché</text>

      <rect class="svg-pipeline-block" x="258" y="74" width="58" height="38" rx="8"/>
      <text class="svg-pipeline-block-text" x="287" y="97">Y<tspan baseline-shift="sub">t</tspan></text>

      <rect class="svg-pipeline-block" x="88" y="146" width="152" height="34" rx="8"/>
      <text class="svg-pipeline-block-text" x="164" y="166">unités d'état : Y<tspan baseline-shift="sub">t−1</tspan></text>

      <line class="svg-arrow" x1="84" y1="93" x2="126" y2="93"/>
      <line class="svg-arrow" x1="202" y1="93" x2="258" y2="93"/>
      <line class="svg-arrow" x1="164" y1="146" x2="164" y2="122"/>
      <path class="svg-arrow" d="M 287 112 C 288 142 270 160 240 164" stroke-dasharray="5 4"/>

      <text class="svg-label-small" x="170" y="198">La boucle recopie la sortie précédente vers l'entrée.</text>
    </g>

    <g transform="translate(396, 34)">
      <rect class="svg-cell" x="0" y="0" width="340" height="206" rx="12" fill="rgba(20,184,166,0.04)"/>
      <text class="svg-label" x="170" y="28">Elman : le caché revient</text>

      <rect class="svg-pipeline-block" x="26" y="74" width="58" height="38" rx="8"/>
      <text class="svg-pipeline-block-text" x="55" y="97">X<tspan baseline-shift="sub">t</tspan></text>

      <rect class="svg-pipeline-block" x="126" y="64" width="76" height="58" rx="8"/>
      <text class="svg-pipeline-block-text" x="164" y="92">H<tspan baseline-shift="sub">t</tspan></text>
      <text class="svg-label-small" x="164" y="110">caché</text>

      <rect class="svg-pipeline-block" x="258" y="74" width="58" height="38" rx="8"/>
      <text class="svg-pipeline-block-text" x="287" y="97">Y<tspan baseline-shift="sub">t</tspan></text>

      <rect class="svg-pipeline-block" x="74" y="146" width="180" height="34" rx="8"/>
      <text class="svg-pipeline-block-text" x="164" y="166">unités contexte : H<tspan baseline-shift="sub">t−1</tspan></text>

      <line class="svg-arrow" x1="84" y1="93" x2="126" y2="93"/>
      <line class="svg-arrow" x1="202" y1="93" x2="258" y2="93"/>
      <line class="svg-arrow" x1="164" y1="146" x2="164" y2="122"/>
      <path class="svg-arrow" d="M 164 122 C 202 140 226 154 254 164" stroke-dasharray="5 4"/>

      <text class="svg-label-small" x="170" y="198">La boucle recopie l'état caché précédent.</text>
    </g>
  </svg>
`;

// ---------- 16. Cartographie des matrices U, V, W ----------

const rnnMatrixMap = `
  <svg viewBox="0 0 620 220" role="img" aria-label="Dimensions des matrices d'un RNN conventionnel">
    ${arrowHeadDefs}

    <g transform="translate(22, 26)">
      <rect class="svg-pipeline-block" x="0" y="54" width="76" height="44" rx="8"/>
      <text class="svg-pipeline-block-text" x="38" y="78">X<tspan baseline-shift="sub">t</tspan></text>
      <text class="svg-label-small" x="38" y="114">dimension n</text>

      <rect class="svg-pipeline-block" x="248" y="54" width="88" height="44" rx="8"/>
      <text class="svg-pipeline-block-text" x="292" y="78">H<tspan baseline-shift="sub">t</tspan></text>
      <text class="svg-label-small" x="292" y="114">dimension m</text>

      <rect class="svg-pipeline-block" x="514" y="54" width="76" height="44" rx="8"/>
      <text class="svg-pipeline-block-text" x="552" y="78">Y<tspan baseline-shift="sub">t</tspan></text>
      <text class="svg-label-small" x="552" y="114">dimension p</text>

      <rect class="svg-pipeline-block" x="226" y="142" width="132" height="30" rx="8"/>
      <text class="svg-pipeline-block-text" x="292" y="160">H<tspan baseline-shift="sub">t−1</tspan></text>

      <line class="svg-arrow" x1="76" y1="76" x2="248" y2="76"/>
      <text class="svg-label-small" x="162" y="64">U : (m, n)</text>

      <line class="svg-arrow" x1="336" y1="76" x2="514" y2="76"/>
      <text class="svg-label-small" x="425" y="64">W : (p, m)</text>

      <line class="svg-arrow" x1="292" y1="142" x2="292" y2="98"/>
      <text class="svg-label-small" x="352" y="126">V : (m, m)</text>

      <circle class="svg-neuron anim-pulse" cx="292" cy="76" r="10"/>
      <circle cx="162" cy="76" r="4" fill="var(--accent)">
        <animate attributeName="cx" values="92;236;92" dur="3s" repeatCount="indefinite"/>
      </circle>
      <circle cx="425" cy="76" r="4" fill="var(--accent)">
        <animate attributeName="cx" values="350;500;350" dur="3s" repeatCount="indefinite"/>
      </circle>

      <text class="svg-label" x="292" y="18">Les objets du RNN conventionnel</text>
      <text class="svg-label-small" x="292" y="196">U relie l'entrée au caché, V porte la récurrence, W relie le caché à la sortie.</text>
    </g>
  </svg>
`;

// ---------- 17. RNN déroulé dans le temps ----------

const rnnUnrolledTime = `
  <svg viewBox="0 0 760 280" role="img" aria-label="Un RNN replié puis déroulé dans le temps">
    ${arrowHeadDefs}

    <g transform="translate(22, 36)">
      <rect class="svg-cell" x="0" y="0" width="150" height="178" rx="12" fill="rgba(20,184,166,0.04)"/>
      <text class="svg-label" x="75" y="26">Forme repliée</text>
      <rect class="svg-pipeline-block" x="38" y="76" width="74" height="48" rx="8"/>
      <text class="svg-pipeline-block-text" x="75" y="101">RNN</text>
      <text class="svg-label-small" x="22" y="70">X<tspan baseline-shift="sub">t</tspan></text>
      <text class="svg-label-small" x="130" y="70">Y<tspan baseline-shift="sub">t</tspan></text>
      <line class="svg-arrow" x1="20" y1="100" x2="38" y2="100"/>
      <line class="svg-arrow" x1="112" y1="100" x2="132" y2="100"/>
      <path class="svg-arrow" d="M 75 124 C 128 154 136 54 82 76" stroke-dasharray="5 4"/>
      <text class="svg-label-small" x="75" y="154">boucle sur l'état</text>
    </g>

    <g transform="translate(214, 36)">
      <text class="svg-label" x="262" y="26">Forme déroulée dans le temps</text>

      ${[
        { x: 0, label: "t−1" },
        { x: 188, label: "t" },
        { x: 376, label: "t+1" }
      ].map((step) => `
        <g transform="translate(${step.x}, 0)">
          <rect class="svg-cell" x="0" y="48" width="148" height="126" rx="12" fill="rgba(20,184,166,0.04)"/>
          <text class="svg-label-small" x="74" y="70">temps ${step.label}</text>
          <rect class="svg-pipeline-block" x="12" y="98" width="42" height="30" rx="8"/>
          <text class="svg-pipeline-block-text" x="33" y="116">X</text>
          <circle class="svg-neuron" cx="78" cy="113" r="20"/>
          <text class="svg-label-small" x="78" y="113">H</text>
          <rect class="svg-pipeline-block" x="106" y="98" width="32" height="30" rx="8"/>
          <text class="svg-pipeline-block-text" x="122" y="116">Y</text>
          <line class="svg-arrow" x1="54" y1="113" x2="58" y2="113"/>
          <line class="svg-arrow" x1="98" y1="113" x2="106" y2="113"/>
        </g>
      `).join("")}

      <path class="svg-arrow" d="M 78 134 C 126 186 218 186 266 134"/>
      <path class="svg-arrow" d="M 266 134 C 314 186 406 186 454 134"/>
      <text class="svg-label-small" x="172" y="182">H<tspan baseline-shift="sub">t−1</tspan></text>
      <text class="svg-label-small" x="360" y="182">H<tspan baseline-shift="sub">t</tspan></text>

      <rect class="svg-cell" x="126" y="208" width="270" height="34" rx="8" fill="rgba(20,184,166,0.08)"/>
      <text class="svg-label-small" x="261" y="228">mêmes poids U, V, W à chaque copie</text>
    </g>
  </svg>
`;

// ---------- 18. Typologie many-to-many / many-to-one / one-to-many ----------

const seq2seqTypes = `
  <svg viewBox="0 0 720 240" role="img" aria-label="Les trois grands types de problèmes séquentiels">
    ${arrowHeadDefs}

    ${[
      { x: 16, title: "Many-to-many", out: ["y1", "y2", "y3"], in: ["x1", "x2", "x3"] },
      { x: 248, title: "Many-to-one", out: ["classe"], in: ["x1", "x2", "x3"] },
      { x: 480, title: "One-to-many", out: ["y1", "y2", "y3"], in: ["x"] }
    ].map((panel) => `
      <g transform="translate(${panel.x}, 18)">
        <rect class="svg-cell" x="0" y="0" width="224" height="184" rx="12" fill="rgba(20,184,166,0.04)"/>
        <text class="svg-label" x="112" y="24">${panel.title}</text>

        ${panel.in.map((token, index) => `
          <rect class="svg-pipeline-block" x="${24 + index * 54}" y="56" width="42" height="26" rx="8"/>
          <text class="svg-pipeline-block-text" x="${45 + index * 54}" y="72">${token}</text>
        `).join("")}

        <circle class="svg-neuron anim-pulse" cx="112" cy="112" r="20"/>
        <text class="svg-label-small" x="112" y="112">RNN</text>

        ${panel.in.length === 1 ? "" : `<line class="svg-arrow" x1="112" y1="82" x2="112" y2="92"/>`}
        ${panel.in.length > 1 ? panel.in.map((_, index) => `
          <line class="svg-arrow" x1="${45 + index * 54}" y1="82" x2="112" y2="96"/>
        `).join("") : `<line class="svg-arrow" x1="45" y1="82" x2="112" y2="96"/>`}

        ${panel.out.map((token, index) => `
          <rect class="svg-pipeline-block" x="${24 + index * 54}" y="144" width="${token === "classe" ? 60 : 42}" height="26" rx="8"/>
          <text class="svg-pipeline-block-text" x="${token === "classe" ? 54 : 45 + index * 54}" y="160">${token}</text>
        `).join("")}

        ${panel.out.length === 1
          ? `<line class="svg-arrow" x1="112" y1="132" x2="112" y2="144"/>`
          : panel.out.map((_, index) => `
              <line class="svg-arrow" x1="112" y1="128" x2="${45 + index * 54}" y2="144"/>
            `).join("")}
      </g>
    `).join("")}
  </svg>
`;

// ---------- 19. One-hot vs embedding ----------

const tokenEncodingCompare = `
  <svg viewBox="0 0 620 180" role="img" aria-label="Comparaison entre encodage one-hot et embedding">
    ${arrowHeadDefs}

    <g transform="translate(20, 24)">
      <text class="svg-label" x="120" y="16">One-hot</text>
      ${[0, 1, 2, 3, 4, 5, 6, 7].map((index) => `
        <rect class="${index === 5 ? "svg-highlight" : "svg-cell"}" x="${index * 30}" y="44" width="24" height="56" rx="4"/>
        <text class="svg-cell-text" x="${index * 30 + 12}" y="72">${index === 5 ? 1 : 0}</text>
      `).join("")}
      <text class="svg-label-small" x="120" y="126">grand vecteur creux</text>
      <text class="svg-label-small" x="120" y="142">un seul 1, le reste à 0</text>
    </g>

    <line class="svg-arrow" x1="272" y1="78" x2="350" y2="78"/>

    <g transform="translate(380, 24)">
      <text class="svg-label" x="100" y="16">Embedding</text>
      ${[
        { x: 0, h: 52, value: "0.72" },
        { x: 42, h: 24, value: "-0.11" },
        { x: 84, h: 40, value: "0.33" },
        { x: 126, h: 58, value: "0.91" }
      ].map((bar) => `
        <rect class="svg-highlight" x="${bar.x}" y="${100 - bar.h}" width="26" height="${bar.h}" rx="4"/>
        <text class="svg-label-small" x="${bar.x + 13}" y="122">${bar.value}</text>
      `).join("")}
      <line class="svg-arrow" x1="-6" y1="100" x2="176" y2="100"/>
      <text class="svg-label-small" x="100" y="142">petit vecteur dense appris</text>
    </g>
  </svg>
`;

// ---------- 20. Modélisation du langage avec softmax ----------

const languageModelSoftmax = `
  <svg viewBox="0 0 700 220" role="img" aria-label="Prédiction du mot suivant avec un RNN et une sortie softmax">
    ${arrowHeadDefs}

    <g transform="translate(18, 26)">
      ${[
        { x: 0, label: "je" },
        { x: 56, label: "vois" },
        { x: 126, label: "un" }
      ].map((token) => `
        <rect class="svg-pipeline-block" x="${token.x}" y="60" width="${token.label === "vois" ? 56 : 42}" height="26" rx="8"/>
        <text class="svg-pipeline-block-text" x="${token.x + (token.label === "vois" ? 28 : 21)}" y="76">${token.label}</text>
      `).join("")}
      <text class="svg-label" x="82" y="24">Contexte déjà lu</text>
      <line class="svg-arrow" x1="168" y1="73" x2="238" y2="73"/>
    </g>

    <g transform="translate(256, 26)">
      <circle class="svg-neuron anim-pulse" cx="56" cy="73" r="24"/>
      <text class="svg-label-small" x="56" y="73">H<tspan baseline-shift="sub">t</tspan></text>
      <text class="svg-label-small" x="56" y="118">état caché</text>
    </g>

    <line class="svg-arrow" x1="336" y1="99" x2="424" y2="99"/>

    <g transform="translate(436, 26)">
      <text class="svg-label" x="110" y="18">Softmax sur le vocabulaire</text>
      ${[
        { label: "chat", p: "0.61", w: 108, active: true },
        { label: "chien", p: "0.18", w: 60, active: false },
        { label: "mur", p: "0.09", w: 34, active: false },
        { label: "train", p: "0.05", w: 22, active: false }
      ].map((bar, index) => `
        <text class="svg-label-small" x="20" y="${56 + index * 28}">${bar.label}</text>
        <rect class="${bar.active ? "svg-highlight" : "svg-cell"}" x="70" y="${42 + index * 28}" width="${bar.w}" height="16" rx="4"/>
        <text class="svg-label-small" x="${bar.w + 88}" y="${56 + index * 28}">${bar.p}</text>
      `).join("")}
      <text class="svg-label-small" x="110" y="170">Le mot prédit est celui avec la probabilité la plus haute.</text>
    </g>
  </svg>
`;

// ---------- 21. BPTT ----------

const bpttFlow = `
  <svg viewBox="0 0 700 240" role="img" aria-label="Rétropropagation à travers le temps sur un RNN déroulé">
    ${arrowHeadDefs}

    <g transform="translate(28, 28)">
      ${[
        { x: 0, label: "t−1" },
        { x: 188, label: "t" },
        { x: 376, label: "t+1" }
      ].map((step) => `
        <g transform="translate(${step.x}, 0)">
          <text class="svg-label-small" x="56" y="12">${step.label}</text>
          <rect class="svg-pipeline-block" x="0" y="46" width="38" height="24" rx="8"/>
          <text class="svg-pipeline-block-text" x="19" y="61">X</text>
          <circle class="svg-neuron" cx="78" cy="58" r="18"/>
          <text class="svg-label-small" x="78" y="58">H</text>
          <rect class="svg-pipeline-block" x="122" y="46" width="32" height="24" rx="8"/>
          <text class="svg-pipeline-block-text" x="138" y="61">Y</text>
          <rect class="svg-cell" x="116" y="100" width="44" height="24" rx="6" fill="rgba(20,184,166,0.08)"/>
          <text class="svg-label-small" x="138" y="115">L</text>
          <line class="svg-arrow" x1="38" y1="58" x2="60" y2="58"/>
          <line class="svg-arrow" x1="96" y1="58" x2="122" y2="58"/>
          <line class="svg-arrow" x1="138" y1="70" x2="138" y2="100"/>
        </g>
      `).join("")}

      <line class="svg-arrow" x1="78" y1="154" x2="266" y2="154"/>
      <line class="svg-arrow" x1="266" y1="154" x2="454" y2="154"/>
      <text class="svg-label-small" x="172" y="176">forward dans le temps</text>
      <text class="svg-label-small" x="360" y="176">mêmes poids U, V, W</text>

      <path class="svg-arrow" d="M 498 126 C 458 196 342 206 266 188" stroke-dasharray="5 4"/>
      <path class="svg-arrow" d="M 310 126 C 270 196 156 206 78 188" stroke-dasharray="5 4"/>
      <text class="svg-label-small" x="490" y="206">gradient vers le passé</text>
      <text class="svg-label-small" x="226" y="224">grad(U) = Σ<tspan baseline-shift="sub">t</tspan> grad<tspan baseline-shift="sub">t</tspan>(U)</text>
    </g>
  </svg>
`;

// ---------- 22. Instabilité du gradient ----------

const rnnGradientInstability = `
  <svg viewBox="0 0 620 220" role="img" aria-label="Comparaison entre disparition du gradient et explosion du gradient">
    ${arrowHeadDefs}

    <g transform="translate(22, 28)">
      <rect class="svg-cell" x="0" y="0" width="270" height="160" rx="12" fill="rgba(20,184,166,0.04)"/>
      <text class="svg-label" x="135" y="22">Vanishing gradient</text>
      ${[
        { x: 34, r: 14, text: "1" },
        { x: 94, r: 10, text: "0.3" },
        { x: 154, r: 7, text: "0.09" },
        { x: 214, r: 5, text: "0.03" }
      ].map((step, index) => `
        <circle class="svg-highlight" cx="${step.x}" cy="88" r="${step.r}"/>
        <text class="svg-label-small" x="${step.x}" y="122">${step.text}</text>
        ${index < 3 ? `<line class="svg-arrow" x1="${step.x + step.r}" y1="88" x2="${step.x + 42}" y2="88"/>` : ""}
      `).join("")}
      <text class="svg-label-small" x="135" y="146">le signal s'atténue quand on remonte le temps</text>
    </g>

    <g transform="translate(328, 28)">
      <rect class="svg-cell" x="0" y="0" width="270" height="160" rx="12" fill="rgba(20,184,166,0.04)"/>
      <text class="svg-label" x="135" y="22">Exploding gradient</text>
      ${[
        { x: 34, r: 14, text: "1" },
        { x: 94, r: 18, text: "3" },
        { x: 154, r: 24, text: "9" },
        { x: 214, r: 30, text: "27" }
      ].map((step, index) => `
        <circle class="svg-highlight" cx="${step.x}" cy="88" r="${step.r}" fill="rgba(20,184,166,0.18)"/>
        <text class="svg-label-small" x="${step.x}" y="132">${step.text}</text>
        ${index < 3 ? `<line class="svg-arrow" x1="${step.x + step.r}" y1="88" x2="${step.x + 40}" y2="88"/>` : ""}
      `).join("")}
      <text class="svg-label-small" x="135" y="146">le signal devient trop grand et déstabilise l'apprentissage</text>
    </g>
  </svg>
`;

// ---------- 23. LSTM ----------

const lstmGatesCell = `
  <svg viewBox="0 0 720 260" role="img" aria-label="Cellule LSTM avec portes d'oubli, d'entrée et de sortie">
    ${arrowHeadDefs}

    <g transform="translate(24, 30)">
      <text class="svg-label" x="320" y="18">Cellule LSTM</text>

      <line class="svg-arrow" x1="40" y1="58" x2="658" y2="58"/>
      <text class="svg-label-small" x="22" y="58">C<tspan baseline-shift="sub">t−1</tspan></text>
      <text class="svg-label-small" x="680" y="58">C<tspan baseline-shift="sub">t</tspan></text>

      <rect class="svg-cell" x="110" y="34" width="70" height="34" rx="8" fill="rgba(20,184,166,0.08)"/>
      <text class="svg-label-small" x="145" y="54">f<tspan baseline-shift="sub">t</tspan></text>

      <rect class="svg-cell" x="246" y="34" width="70" height="34" rx="8" fill="rgba(20,184,166,0.08)"/>
      <text class="svg-label-small" x="281" y="54">i<tspan baseline-shift="sub">t</tspan></text>

      <rect class="svg-cell" x="348" y="34" width="84" height="34" rx="8" fill="rgba(20,184,166,0.08)"/>
      <text class="svg-label-small" x="390" y="54">c̃<tspan baseline-shift="sub">t</tspan></text>

      <circle class="svg-neuron" cx="476" cy="52" r="13"/>
      <text class="svg-label-small" x="476" y="52">+</text>

      <rect class="svg-cell" x="540" y="34" width="70" height="34" rx="8" fill="rgba(20,184,166,0.08)"/>
      <text class="svg-label-small" x="575" y="54">o<tspan baseline-shift="sub">t</tspan></text>

      <line class="svg-arrow" x1="476" y1="65" x2="476" y2="112"/>
      <circle class="svg-neuron anim-pulse" cx="476" cy="138" r="18"/>
      <text class="svg-label-small" x="476" y="138">tanh</text>
      <line class="svg-arrow" x1="476" y1="156" x2="476" y2="196"/>
      <text class="svg-label-small" x="494" y="198">H<tspan baseline-shift="sub">t</tspan></text>

      <rect class="svg-pipeline-block" x="56" y="178" width="58" height="28" rx="8"/>
      <text class="svg-pipeline-block-text" x="85" y="196">X<tspan baseline-shift="sub">t</tspan></text>
      <rect class="svg-pipeline-block" x="130" y="178" width="66" height="28" rx="8"/>
      <text class="svg-pipeline-block-text" x="163" y="196">H<tspan baseline-shift="sub">t−1</tspan></text>

      ${[145, 281, 390, 575].map((x) => `
        <line class="svg-arrow" x1="85" y1="178" x2="${x}" y2="88"/>
        <line class="svg-arrow" x1="163" y1="178" x2="${x}" y2="88"/>
      `).join("")}

      <text class="svg-label-small" x="145" y="90">oublier</text>
      <text class="svg-label-small" x="281" y="90">écrire</text>
      <text class="svg-label-small" x="390" y="90">état candidat</text>
      <text class="svg-label-small" x="575" y="90">montrer</text>
    </g>
  </svg>
`;

// ---------- 24. Encodeur-décodeur avec attention ----------

const encoderDecoderAttention = `
  <svg viewBox="0 0 720 250" role="img" aria-label="Architecture encodeur-décodeur avec mécanisme d'attention">
    ${arrowHeadDefs}

    <g transform="translate(20, 30)">
      <text class="svg-label" x="120" y="18">Encodeur</text>
      ${[
        { x: 0, token: "je" },
        { x: 58, token: "vois" },
        { x: 126, token: "chat" }
      ].map((item, index) => `
        <rect class="svg-pipeline-block" x="${item.x}" y="44" width="${item.token === "vois" ? 56 : 44}" height="26" rx="8"/>
        <text class="svg-pipeline-block-text" x="${item.x + (item.token === "vois" ? 28 : 22)}" y="60">${item.token}</text>
        <circle class="svg-neuron" cx="${22 + item.x}" cy="122" r="16"/>
        <text class="svg-label-small" x="${22 + item.x}" y="122">h<tspan baseline-shift="sub">${index + 1}</tspan></text>
        <line class="svg-arrow" x1="${22 + item.x}" y1="70" x2="${22 + item.x}" y2="106"/>
      `).join("")}
    </g>

    <g transform="translate(296, 30)">
      <text class="svg-label" x="78" y="18">Attention</text>
      <circle class="svg-neuron anim-pulse" cx="78" cy="122" r="22"/>
      <text class="svg-label-small" x="78" y="122">s<tspan baseline-shift="sub">t</tspan></text>
      <text class="svg-label-small" x="78" y="164">état du décodeur</text>
    </g>

    <g transform="translate(454, 30)">
      <text class="svg-label" x="118" y="18">Décodeur</text>
      <rect class="svg-pipeline-block" x="42" y="108" width="68" height="28" rx="8"/>
      <text class="svg-pipeline-block-text" x="76" y="126">contexte</text>
      <rect class="svg-pipeline-block" x="140" y="108" width="54" height="28" rx="8"/>
      <text class="svg-pipeline-block-text" x="167" y="126">chat</text>
      <line class="svg-arrow" x1="110" y1="122" x2="140" y2="122"/>
    </g>

    <path class="svg-arrow" d="M 42 152 C 158 196 258 204 374 152" stroke-dasharray="4 3"/>
    <path class="svg-arrow" d="M 100 152 C 188 124 282 118 374 132" stroke-width="3"/>
    <path class="svg-arrow" d="M 170 152 C 250 168 306 174 374 142" stroke-dasharray="4 3"/>

    <text class="svg-label-small" x="356" y="204">poids élevés sur les positions utiles</text>
  </svg>
`;

// ---------- 25. Traitement séquentiel vs transformeur ----------

const transformerParallelAttention = `
  <svg viewBox="0 0 720 240" role="img" aria-label="Comparaison entre traitement séquentiel d'un RNN et traitement parallèle d'un transformeur">
    ${arrowHeadDefs}

    <g transform="translate(18, 28)">
      <rect class="svg-cell" x="0" y="0" width="300" height="176" rx="12" fill="rgba(20,184,166,0.04)"/>
      <text class="svg-label" x="150" y="24">RNN : lecture séquentielle</text>
      ${[
        { x: 26, token: "t1" },
        { x: 92, token: "t2" },
        { x: 158, token: "t3" },
        { x: 224, token: "t4" }
      ].map((token, index) => `
        <rect class="svg-pipeline-block" x="${token.x}" y="78" width="38" height="26" rx="8"/>
        <text class="svg-pipeline-block-text" x="${token.x + 19}" y="94">${token.token}</text>
        ${index < 3 ? `<line class="svg-arrow anim-pipeline-arrow" x1="${token.x + 38}" y1="91" x2="${token.x + 66}" y2="91"/>` : ""}
      `).join("")}
      <text class="svg-label-small" x="150" y="136">t1 puis t2 puis t3 puis t4</text>
    </g>

    <g transform="translate(398, 28)">
      <rect class="svg-cell" x="0" y="0" width="300" height="176" rx="12" fill="rgba(20,184,166,0.04)"/>
      <text class="svg-label" x="150" y="24">Transformeur : parallèle</text>
      ${[
        { x: 48, y: 62, token: "t1" },
        { x: 196, y: 62, token: "t2" },
        { x: 48, y: 118, token: "t3" },
        { x: 196, y: 118, token: "t4" }
      ].map((token) => `
        <rect class="svg-pipeline-block" x="${token.x}" y="${token.y}" width="42" height="26" rx="8"/>
        <text class="svg-pipeline-block-text" x="${token.x + 21}" y="${token.y + 16}">${token.token}</text>
      `).join("")}

      <line class="svg-arrow" x1="90" y1="75" x2="196" y2="75"/>
      <line class="svg-arrow" x1="90" y1="131" x2="196" y2="131"/>
      <line class="svg-arrow" x1="69" y1="88" x2="69" y2="118"/>
      <line class="svg-arrow" x1="217" y1="88" x2="217" y2="118"/>
      <line class="svg-arrow" x1="90" y1="75" x2="196" y2="131"/>
      <line class="svg-arrow" x1="196" y1="75" x2="90" y2="131"/>

      <text class="svg-label-small" x="150" y="156">chaque position peut regarder les autres</text>
    </g>
  </svg>
`;

// ---------- 26. Boucle agent-environnement ----------

const rlAgentEnvironmentLoop = `
  <svg viewBox="0 0 720 260" role="img" aria-label="Boucle de l'apprentissage par renforcement entre agent et environnement">
    ${arrowHeadDefs}

    <g transform="translate(40, 34)">
      <rect class="svg-pipeline-block" x="40" y="76" width="160" height="76" rx="8"/>
      <text class="svg-pipeline-block-text" x="120" y="108">Agent</text>
      <text class="svg-label-small" x="120" y="132">choisit a<tspan baseline-shift="sub">t</tspan></text>

      <rect class="svg-pipeline-block" x="460" y="76" width="180" height="76" rx="8"/>
      <text class="svg-pipeline-block-text" x="550" y="108">Environnement</text>
      <text class="svg-label-small" x="550" y="132">répond et évolue</text>

      <line class="svg-arrow anim-pipeline-arrow" x1="200" y1="98" x2="460" y2="98"/>
      <text class="svg-label" x="330" y="84">action a<tspan baseline-shift="sub">t</tspan></text>

      <path class="svg-arrow" d="M 460 136 C 360 210 240 210 200 136"/>
      <text class="svg-label" x="330" y="214">état s<tspan baseline-shift="sub">t+1</tspan> + récompense r<tspan baseline-shift="sub">t+1</tspan></text>

      <rect class="svg-cell" x="246" y="20" width="170" height="40" rx="8" fill="rgba(20,184,166,0.08)"/>
      <text class="svg-label" x="331" y="43">essai → erreur → ajustement</text>

      <circle class="svg-neuron anim-pulse" cx="120" cy="114" r="10"/>
      <circle class="svg-neuron anim-pulse" cx="550" cy="114" r="10"/>
    </g>
  </svg>
`;

// ---------- 27. Modèles d'optimalité ----------

const rlOptimalityHorizons = `
  <svg viewBox="0 0 760 260" role="img" aria-label="Trois modèles d'optimalité en apprentissage par renforcement">
    ${arrowHeadDefs}

    ${[
      { x: 20, title: "Horizon fini", note: "h prochaines étapes", bars: [52, 52, 52, 52, 0, 0] },
      { x: 270, title: "Actualisé", note: "γ^t diminue", bars: [62, 48, 36, 26, 18, 12] },
      { x: 520, title: "Reward moyen", note: "moyenne long terme", bars: [36, 42, 30, 46, 38, 40] }
    ].map((panel) => `
      <g transform="translate(${panel.x}, 28)">
        <rect class="svg-cell" x="0" y="0" width="220" height="174" rx="12" fill="rgba(20,184,166,0.04)"/>
        <text class="svg-label" x="110" y="24">${panel.title}</text>
        ${panel.bars.map((height, index) => `
          <rect class="${height === 0 ? "svg-cell" : "svg-highlight"}" x="${32 + index * 28}" y="${120 - height}" width="18" height="${Math.max(height, 4)}" rx="4" fill-opacity="${height === 0 ? "0.2" : "0.85"}"/>
          <text class="svg-label-small" x="${41 + index * 28}" y="144">r${index}</text>
        `).join("")}
        <line class="svg-arrow" x1="28" y1="124" x2="196" y2="124"/>
        <text class="svg-label-small" x="110" y="164">${panel.note}</text>
      </g>
    `).join("")}

    <text class="svg-label-small" x="380" y="238">Dans ce cours, on retient surtout l'horizon infini actualisé avec γ ∈ [0, 1[.</text>
  </svg>
`;

// ---------- 28. MDP et Bellman ----------

const rlMdpBellman = `
  <svg viewBox="0 0 760 300" role="img" aria-label="Processus de décision markovien et équation de Bellman">
    ${arrowHeadDefs}

    <g transform="translate(28, 34)">
      <text class="svg-label" x="170" y="18">MDP : S, A, T, R, γ</text>
      <circle class="svg-neuron" cx="68" cy="92" r="28"/>
      <text class="svg-label" x="68" y="92">s</text>
      <circle class="svg-neuron" cx="238" cy="52" r="24"/>
      <text class="svg-label" x="238" y="52">s'</text>
      <circle class="svg-neuron" cx="238" cy="134" r="24"/>
      <text class="svg-label" x="238" y="134">s''</text>
      <line class="svg-arrow" x1="92" y1="82" x2="214" y2="58"/>
      <line class="svg-arrow" x1="92" y1="102" x2="214" y2="128"/>
      <text class="svg-label-small" x="156" y="58">a, T=0.7, r</text>
      <text class="svg-label-small" x="156" y="136">a, T=0.3, r</text>

      <rect class="svg-cell" x="20" y="190" width="288" height="46" rx="8" fill="rgba(20,184,166,0.08)"/>
      <text class="svg-label" x="164" y="218">le futur dépend du présent et de l'action</text>
    </g>

    <g transform="translate(410, 40)">
      <text class="svg-label" x="150" y="12">Bellman</text>
      <rect class="svg-pipeline-block" x="10" y="48" width="280" height="52" rx="8"/>
      <text class="svg-pipeline-block-text" x="150" y="76">V(s) = R(s) + γ Σ P(s,s') V(s')</text>

      <rect class="svg-pipeline-block" x="10" y="128" width="280" height="64" rx="8"/>
      <text class="svg-pipeline-block-text" x="150" y="154">V*(s) = max<tspan baseline-shift="sub">a</tspan>[R(s,a)</text>
      <text class="svg-pipeline-block-text" x="150" y="174">+ γ Σ T(s,a,s') V*(s')]</text>

      <line class="svg-arrow" x1="150" y1="100" x2="150" y2="128"/>
      <text class="svg-label-small" x="150" y="222">Bellman relie la valeur présente aux valeurs futures.</text>
    </g>
  </svg>
`;

// ---------- 29. Value Iteration et Policy Iteration ----------

const rlPlanningIterations = `
  <svg viewBox="0 0 760 270" role="img" aria-label="Comparaison entre Value Iteration et Policy Iteration">
    ${arrowHeadDefs}

    <g transform="translate(26, 30)">
      <rect class="svg-cell" x="0" y="0" width="330" height="184" rx="12" fill="rgba(20,184,166,0.04)"/>
      <text class="svg-label" x="165" y="24">Value Iteration</text>

      <rect class="svg-pipeline-block" x="34" y="58" width="96" height="40" rx="8"/>
      <text class="svg-pipeline-block-text" x="82" y="82">V arbitraire</text>

      <rect class="svg-pipeline-block" x="190" y="58" width="104" height="40" rx="8"/>
      <text class="svg-pipeline-block-text" x="242" y="82">backup max</text>

      <path class="svg-arrow" d="M 130 78 C 154 54 174 54 190 78"/>
      <path class="svg-arrow" d="M 242 98 C 220 130 100 130 82 98"/>
      <text class="svg-label-small" x="165" y="144">répéter jusqu'à ΔV &lt; ε</text>
      <text class="svg-label-small" x="165" y="164">puis extraire π(s)=argmax</text>
    </g>

    <g transform="translate(404, 30)">
      <rect class="svg-cell" x="0" y="0" width="330" height="184" rx="12" fill="rgba(20,184,166,0.04)"/>
      <text class="svg-label" x="165" y="24">Policy Iteration</text>

      <rect class="svg-pipeline-block" x="28" y="58" width="82" height="40" rx="8"/>
      <text class="svg-pipeline-block-text" x="69" y="82">π</text>

      <rect class="svg-pipeline-block" x="132" y="58" width="82" height="40" rx="8"/>
      <text class="svg-pipeline-block-text" x="173" y="82">évaluer Vπ</text>

      <rect class="svg-pipeline-block" x="236" y="58" width="72" height="40" rx="8"/>
      <text class="svg-pipeline-block-text" x="272" y="82">améliorer</text>

      <line class="svg-arrow" x1="110" y1="78" x2="132" y2="78"/>
      <line class="svg-arrow" x1="214" y1="78" x2="236" y2="78"/>
      <path class="svg-arrow" d="M 272 98 C 238 146 112 146 69 98"/>
      <text class="svg-label-small" x="165" y="164">arrêt quand π' = π</text>
    </g>

    <text class="svg-label-small" x="380" y="240">Ces deux méthodes supposent un modèle connu : T(s,a,s') et R(s,a).</text>
  </svg>
`;

// ---------- 30. Model-based, model-free et Dyna ----------

const rlModelBasedFreeDyna = `
  <svg viewBox="0 0 760 260" role="img" aria-label="Différence entre méthodes model-based, model-free et Dyna">
    ${arrowHeadDefs}

    <g transform="translate(22, 32)">
      <rect class="svg-cell" x="0" y="0" width="224" height="170" rx="12" fill="rgba(20,184,166,0.04)"/>
      <text class="svg-label" x="112" y="24">Model-based</text>
      <rect class="svg-pipeline-block" x="34" y="56" width="156" height="34" rx="8"/>
      <text class="svg-pipeline-block-text" x="112" y="77">estimer T̂, R̂</text>
      <rect class="svg-pipeline-block" x="34" y="112" width="156" height="34" rx="8"/>
      <text class="svg-pipeline-block-text" x="112" y="133">planifier π</text>
      <line class="svg-arrow" x1="112" y1="90" x2="112" y2="112"/>
    </g>

    <g transform="translate(268, 32)">
      <rect class="svg-cell" x="0" y="0" width="224" height="170" rx="12" fill="rgba(20,184,166,0.04)"/>
      <text class="svg-label" x="112" y="24">Model-free</text>
      <rect class="svg-pipeline-block" x="34" y="72" width="156" height="34" rx="8"/>
      <text class="svg-pipeline-block-text" x="112" y="93">apprendre Q directement</text>
      <text class="svg-label-small" x="112" y="134">pas de T̂ ni R̂ explicites</text>
    </g>

    <g transform="translate(514, 32)">
      <rect class="svg-cell" x="0" y="0" width="224" height="170" rx="12" fill="rgba(20,184,166,0.04)"/>
      <text class="svg-label" x="112" y="24">Dyna</text>
      <circle class="svg-neuron anim-pulse" cx="112" cy="84" r="30"/>
      <text class="svg-label-small" x="112" y="78">vrai pas</text>
      <text class="svg-label-small" x="112" y="96">+ k backups</text>
      <path class="svg-arrow" d="M 112 114 C 168 142 174 56 112 54" stroke-dasharray="4 3"/>
      <text class="svg-label-small" x="112" y="148">le modèle sert à simuler</text>
    </g>
  </svg>
`;

// ---------- 31. Q-Learning ----------

const rlQLearningUpdate = `
  <svg viewBox="0 0 780 300" role="img" aria-label="Mise à jour Q-Learning avec epsilon-greedy et erreur TD">
    ${arrowHeadDefs}

    <g transform="translate(26, 28)">
      <text class="svg-label" x="144" y="20">ε-greedy</text>
      <rect class="svg-cell" x="0" y="44" width="288" height="110" rx="12" fill="rgba(20,184,166,0.04)"/>
      <rect class="svg-pipeline-block" x="28" y="82" width="82" height="34" rx="8"/>
      <text class="svg-pipeline-block-text" x="69" y="103">état s</text>
      <line class="svg-arrow" x1="110" y1="99" x2="152" y2="99"/>
      <rect class="svg-pipeline-block" x="152" y="60" width="106" height="30" rx="8"/>
      <text class="svg-pipeline-block-text" x="205" y="80">max Q</text>
      <rect class="svg-pipeline-block" x="152" y="108" width="106" height="30" rx="8"/>
      <text class="svg-pipeline-block-text" x="205" y="128">hasard</text>
      <text class="svg-label-small" x="205" y="52">1−ε</text>
      <text class="svg-label-small" x="205" y="154">ε</text>
    </g>

    <g transform="translate(360, 28)">
      <text class="svg-label" x="186" y="20">Mise à jour</text>
      <rect class="svg-cell" x="0" y="44" width="374" height="178" rx="12" fill="rgba(20,184,166,0.04)"/>

      <rect class="svg-pipeline-block" x="28" y="72" width="314" height="42" rx="8"/>
      <text class="svg-pipeline-block-text" x="185" y="96">cible = r + γ max<tspan baseline-shift="sub">a'</tspan> Q(s',a')</text>

      <rect class="svg-pipeline-block" x="28" y="136" width="314" height="42" rx="8"/>
      <text class="svg-pipeline-block-text" x="185" y="160">Q ← Q + α(cible − Q)</text>

      <line class="svg-arrow" x1="185" y1="114" x2="185" y2="136"/>
      <text class="svg-label-small" x="185" y="204">δ = cible − Q(s,a) : erreur TD</text>
    </g>

    <text class="svg-label-small" x="390" y="270">Q-Learning apprend la qualité des couples état-action sans connaître T ni R.</text>
  </svg>
`;

// ---------- 32. Workflow ML : split train/validation/test ----------

const mlTrainValidationTestSplit = `
  <svg viewBox="0 0 760 230" role="img" aria-label="Découpage d'un dataset en train, validation et test">
    ${arrowHeadDefs}

    <g transform="translate(24, 34)">
      <text class="svg-label" x="356" y="18">Workflow ML propre</text>

      <rect class="svg-pipeline-block" x="0" y="68" width="110" height="46" rx="8"/>
      <text class="svg-pipeline-block-text" x="55" y="94">Dataset</text>

      <line class="svg-arrow" x1="110" y1="91" x2="174" y2="91"/>

      <g transform="translate(190, 42)">
        <rect class="svg-highlight" x="0" y="18" width="130" height="34" rx="8"/>
        <text class="svg-pipeline-block-text" x="65" y="39">Train</text>
        <rect class="svg-cell" x="0" y="60" width="130" height="34" rx="8" fill="rgba(20,184,166,0.08)"/>
        <text class="svg-pipeline-block-text" x="65" y="81">Validation</text>
        <rect class="svg-cell" x="0" y="102" width="130" height="34" rx="8" fill="rgba(20,184,166,0.08)"/>
        <text class="svg-pipeline-block-text" x="65" y="123">Test</text>
      </g>

      <line class="svg-arrow" x1="330" y1="77" x2="430" y2="77"/>
      <line class="svg-arrow" x1="330" y1="119" x2="430" y2="119"/>
      <line class="svg-arrow" x1="330" y1="161" x2="430" y2="161"/>

      <rect class="svg-pipeline-block" x="450" y="54" width="128" height="46" rx="8"/>
      <text class="svg-pipeline-block-text" x="514" y="80">entraîner</text>

      <rect class="svg-pipeline-block" x="450" y="104" width="128" height="46" rx="8"/>
      <text class="svg-pipeline-block-text" x="514" y="130">choisir modèle</text>

      <rect class="svg-pipeline-block" x="450" y="154" width="128" height="46" rx="8"/>
      <text class="svg-pipeline-block-text" x="514" y="180">évaluer final</text>

      <text class="svg-label-small" x="356" y="212">Le test reste intouchable jusqu'à l'évaluation finale.</text>
    </g>
  </svg>
`;

// ---------- 33. Sous-apprentissage / bon fit / sur-apprentissage ----------

const mlOverfittingBiasVariance = `
  <svg viewBox="0 0 760 260" role="img" aria-label="Comparaison entre sous-apprentissage, bon ajustement et sur-apprentissage">
    ${arrowHeadDefs}

    ${[
      { x: 24, title: "Sous-apprentissage", path: "M 24 132 Q 88 88 176 72", note: "modèle trop simple" },
      { x: 270, title: "Bon compromis", path: "M 24 132 C 62 74 108 144 176 72", note: "généralise bien" },
      { x: 516, title: "Sur-apprentissage", path: "M 24 132 C 42 40 66 164 88 74 C 112 10 132 176 176 72", note: "apprend le bruit" }
    ].map((panel) => `
      <g transform="translate(${panel.x}, 28)">
        <rect class="svg-cell" x="0" y="0" width="220" height="178" rx="12" fill="rgba(20,184,166,0.04)"/>
        <text class="svg-label" x="110" y="24">${panel.title}</text>
        <line class="svg-arrow" x1="24" y1="150" x2="190" y2="150"/>
        <line class="svg-arrow" x1="32" y1="160" x2="32" y2="42"/>
        ${[38, 70, 102, 134, 166].map((cx, index) => `
          <circle class="svg-highlight" cx="${cx}" cy="${[124, 72, 132, 84, 72][index]}" r="4"/>
        `).join("")}
        <path d="${panel.path}" stroke="var(--accent)" stroke-width="3" fill="none"/>
        <text class="svg-label-small" x="110" y="170">${panel.note}</text>
      </g>
    `).join("")}

    <text class="svg-label-small" x="380" y="238">L'objectif n'est pas d'être parfait sur train : c'est de bien généraliser sur des données nouvelles.</text>
  </svg>
`;

// ---------- 34. Cross-validation k-fold ----------

const mlCrossValidationFolds = `
  <svg viewBox="0 0 760 250" role="img" aria-label="Validation croisée k-fold">
    ${arrowHeadDefs}

    <g transform="translate(40, 34)">
      <text class="svg-label" x="340" y="18">Validation croisée k-fold</text>
      ${[0, 1, 2, 3, 4].map((fold) => `
        <g transform="translate(0, ${44 + fold * 32})">
          <text class="svg-label-small" x="0" y="18">tour ${fold + 1}</text>
          ${[0, 1, 2, 3, 4].map((cell) => `
            <rect class="${cell === fold ? "svg-highlight" : "svg-cell"}" x="${80 + cell * 104}" y="0" width="88" height="24" rx="6" fill="${cell === fold ? "" : "rgba(20,184,166,0.08)"}"/>
            <text class="svg-label-small" x="${124 + cell * 104}" y="16">${cell === fold ? "val" : "train"}</text>
          `).join("")}
        </g>
      `).join("")}
      <text class="svg-label-small" x="340" y="220">Chaque bloc sert une fois de validation ; les scores sont ensuite moyennés.</text>
    </g>
  </svg>
`;

// ---------- 35. Matrice de confusion et métriques ----------

const mlConfusionMetrics = `
  <svg viewBox="0 0 760 270" role="img" aria-label="Matrice de confusion et métriques classification">
    ${arrowHeadDefs}

    <g transform="translate(34, 28)">
      <text class="svg-label" x="160" y="18">Matrice de confusion binaire</text>
      <text class="svg-label-small" x="176" y="54">Prédit +</text>
      <text class="svg-label-small" x="286" y="54">Prédit −</text>
      <text class="svg-label-small" x="48" y="104">Réel +</text>
      <text class="svg-label-small" x="48" y="172">Réel −</text>

      <rect class="svg-highlight" x="130" y="74" width="92" height="58" rx="8"/>
      <text class="svg-label" x="176" y="106">TP</text>
      <rect class="svg-cell" x="240" y="74" width="92" height="58" rx="8" fill="rgba(20,184,166,0.08)"/>
      <text class="svg-label" x="286" y="106">FN</text>
      <rect class="svg-cell" x="130" y="146" width="92" height="58" rx="8" fill="rgba(20,184,166,0.08)"/>
      <text class="svg-label" x="176" y="178">FP</text>
      <rect class="svg-highlight" x="240" y="146" width="92" height="58" rx="8"/>
      <text class="svg-label" x="286" y="178">TN</text>
    </g>

    <g transform="translate(430, 48)">
      <text class="svg-label" x="132" y="0">Métriques</text>
      <rect class="svg-pipeline-block" x="0" y="30" width="264" height="38" rx="8"/>
      <text class="svg-pipeline-block-text" x="132" y="54">Precision = TP / (TP + FP)</text>

      <rect class="svg-pipeline-block" x="0" y="82" width="264" height="38" rx="8"/>
      <text class="svg-pipeline-block-text" x="132" y="106">Recall = TP / (TP + FN)</text>

      <rect class="svg-pipeline-block" x="0" y="134" width="264" height="38" rx="8"/>
      <text class="svg-pipeline-block-text" x="132" y="158">F1 = 2PR / (P + R)</text>

      <rect class="svg-pipeline-block" x="0" y="186" width="264" height="38" rx="8"/>
      <text class="svg-pipeline-block-text" x="132" y="210">Accuracy = (TP+TN)/total</text>
    </g>
  </svg>
`;

// ---------- 36. Fiche paramètres / hyperparamètres ----------

const mlParamHyperparamMap = `
  <svg viewBox="0 0 760 280" role="img" aria-label="Carte paramètres appris et hyperparamètres choisis">
    ${arrowHeadDefs}

    <g transform="translate(32, 28)">
      <text class="svg-label" x="348" y="18">Paramètres vs hyperparamètres</text>

      <g transform="translate(0, 56)">
        <rect class="svg-highlight" x="0" y="0" width="310" height="170" rx="12"/>
        <text class="svg-label" x="155" y="28">Appris pendant l'entraînement</text>
        <text class="svg-label-small" x="155" y="62">poids, biais, filtres, matrices</text>
        <text class="svg-label-small" x="155" y="88">embeddings, table Q, valeur V</text>
        <text class="svg-label-small" x="155" y="114">modèle appris T̂/R̂ en Dyna</text>
        <line class="svg-arrow" x1="155" y1="136" x2="155" y2="156"/>
        <text class="svg-label-small" x="155" y="168">source : train / interactions</text>
      </g>

      <g transform="translate(386, 56)">
        <rect class="svg-cell" x="0" y="0" width="310" height="170" rx="12" fill="rgba(20,184,166,0.08)"/>
        <text class="svg-label" x="155" y="28">Choisis avant ou par validation</text>
        <text class="svg-label-small" x="155" y="62">taille filtre, couches, hidden size</text>
        <text class="svg-label-small" x="155" y="88">γ, α, ε, nombre d'épisodes</text>
        <text class="svg-label-small" x="155" y="114">vocabulaire, contexte, dropout</text>
        <line class="svg-arrow" x1="155" y1="136" x2="155" y2="156"/>
        <text class="svg-label-small" x="155" y="168">source : validation / design</text>
      </g>

      <text class="svg-label-small" x="348" y="254">Le test ne choisit rien : il mesure seulement la performance finale.</text>
    </g>
  </svg>
`;

// ---------- 37. Pipeline NLP : texte brut → analyses ----------

const nlpAnalysisPipeline = `
  <svg viewBox="0 0 760 240" role="img" aria-label="Pipeline NLP du texte brut vers les analyses lexicales, syntaxiques et sémantiques">
    ${arrowHeadDefs}

    <g transform="translate(34, 46)">
      <rect class="svg-pipeline-block" x="0" y="42" width="132" height="70" rx="8"/>
      <text class="svg-pipeline-block-text" x="66" y="72">Texte brut</text>
      <text class="svg-label-small" x="66" y="94">mots, ponctuation</text>
    </g>

    <line class="svg-arrow" x1="176" y1="123" x2="238" y2="123"/>

    <g transform="translate(254, 30)">
      <rect class="svg-highlight" x="0" y="0" width="142" height="64" rx="8"/>
      <text class="svg-label" x="71" y="25">Lexical</text>
      <text class="svg-label-small" x="71" y="46">tokens, POS, lemmes</text>

      <rect class="svg-cell" x="0" y="88" width="142" height="64" rx="8" fill="rgba(20,184,166,0.08)"/>
      <text class="svg-label" x="71" y="113">Syntaxique</text>
      <text class="svg-label-small" x="71" y="134">grammaire, arbre</text>
    </g>

    <line class="svg-arrow" x1="416" y1="94" x2="484" y2="94"/>
    <line class="svg-arrow" x1="416" y1="152" x2="484" y2="152"/>

    <g transform="translate(504, 58)">
      <rect class="svg-pipeline-block" x="0" y="0" width="168" height="128" rx="8"/>
      <text class="svg-pipeline-block-text" x="84" y="32">Sémantique</text>
      <text class="svg-label-small" x="84" y="62">sens, ambiguïté</text>
      <text class="svg-label-small" x="84" y="88">relations lexicales</text>
      <text class="svg-label-small" x="84" y="112">analyse de sentiments</text>
    </g>
  </svg>
`;

// ---------- 38. Tokenisation, POS tagging et lemmatisation ----------

const nlpLexicalPipeline = `
  <svg viewBox="0 0 760 250" role="img" aria-label="Analyse lexicale avec tokenisation, POS tagging et lemmatisation">
    ${arrowHeadDefs}

    <g transform="translate(30, 50)">
      <rect class="svg-pipeline-block" x="0" y="0" width="176" height="74" rx="8"/>
      <text class="svg-pipeline-block-text" x="88" y="30">The dogs are running</text>
      <text class="svg-label-small" x="88" y="54">texte</text>
    </g>

    <line class="svg-arrow" x1="226" y1="87" x2="282" y2="87"/>

    <g transform="translate(302, 28)">
      <text class="svg-label" x="72" y="18">Tokens</text>
      <rect class="svg-highlight" x="0" y="40" width="64" height="42" rx="8"/>
      <rect class="svg-highlight" x="78" y="40" width="64" height="42" rx="8"/>
      <rect class="svg-highlight" x="156" y="40" width="64" height="42" rx="8"/>
      <rect class="svg-highlight" x="234" y="40" width="86" height="42" rx="8"/>
      <text class="svg-label-small" x="32" y="66">The</text>
      <text class="svg-label-small" x="110" y="66">dogs</text>
      <text class="svg-label-small" x="188" y="66">are</text>
      <text class="svg-label-small" x="277" y="66">running</text>

      <text class="svg-label" x="72" y="128">POS</text>
      <rect class="svg-cell" x="0" y="148" width="64" height="42" rx="8" fill="rgba(20,184,166,0.08)"/>
      <rect class="svg-cell" x="78" y="148" width="64" height="42" rx="8" fill="rgba(20,184,166,0.08)"/>
      <rect class="svg-cell" x="156" y="148" width="64" height="42" rx="8" fill="rgba(20,184,166,0.08)"/>
      <rect class="svg-cell" x="234" y="148" width="86" height="42" rx="8" fill="rgba(20,184,166,0.08)"/>
      <text class="svg-label-small" x="32" y="174">DET</text>
      <text class="svg-label-small" x="110" y="174">NOUN</text>
      <text class="svg-label-small" x="188" y="174">VERB</text>
      <text class="svg-label-small" x="277" y="174">VERB</text>
    </g>

    <line class="svg-arrow" x1="636" y1="87" x2="680" y2="87"/>

    <g transform="translate(690, 58)">
      <rect class="svg-pipeline-block" x="0" y="0" width="56" height="58" rx="8"/>
      <text class="svg-pipeline-block-text" x="28" y="24">run</text>
      <text class="svg-label-small" x="28" y="44">lemme</text>
    </g>
  </svg>
`;

// ---------- 39. CFG et arbre d'analyse ----------

const nlpCfgParseTree = `
  <svg viewBox="0 0 760 280" role="img" aria-label="Arbre syntaxique simplifié pour une grammaire hors contexte">
    ${arrowHeadDefs}

    <g transform="translate(60, 28)">
      <text class="svg-label" x="140" y="18">Règles</text>
      <rect class="svg-pipeline-block" x="0" y="42" width="280" height="156" rx="8"/>
      <text class="svg-label-small" x="140" y="74">S → NP VP</text>
      <text class="svg-label-small" x="140" y="104">NP → Det N</text>
      <text class="svg-label-small" x="140" y="134">VP → V PP</text>
      <text class="svg-label-small" x="140" y="164">PP → Prep NP</text>
    </g>

    <line class="svg-arrow" x1="370" y1="132" x2="430" y2="132"/>

    <g transform="translate(448, 24)">
      <text class="svg-label" x="126" y="18">Arbre</text>
      <circle class="svg-neuron" cx="126" cy="50" r="18"/>
      <text class="svg-cell-text" x="126" y="55">S</text>

      <circle class="svg-neuron" cx="72" cy="112" r="18"/>
      <text class="svg-cell-text" x="72" y="117">NP</text>
      <circle class="svg-neuron" cx="180" cy="112" r="18"/>
      <text class="svg-cell-text" x="180" y="117">VP</text>

      <circle class="svg-neuron" cx="36" cy="178" r="18"/>
      <text class="svg-cell-text" x="36" y="183">Det</text>
      <circle class="svg-neuron" cx="108" cy="178" r="18"/>
      <text class="svg-cell-text" x="108" y="183">N</text>
      <circle class="svg-neuron" cx="162" cy="178" r="18"/>
      <text class="svg-cell-text" x="162" y="183">V</text>
      <circle class="svg-neuron" cx="228" cy="178" r="18"/>
      <text class="svg-cell-text" x="228" y="183">PP</text>

      <line class="svg-connection" x1="114" y1="64" x2="84" y2="96"/>
      <line class="svg-connection" x1="138" y1="64" x2="168" y2="96"/>
      <line class="svg-connection" x1="62" y1="128" x2="44" y2="162"/>
      <line class="svg-connection" x1="82" y1="128" x2="100" y2="162"/>
      <line class="svg-connection" x1="174" y1="128" x2="164" y2="162"/>
      <line class="svg-connection" x1="188" y1="128" x2="220" y2="162"/>

      <text class="svg-label-small" x="36" y="232">la</text>
      <text class="svg-label-small" x="108" y="232">fille</text>
      <text class="svg-label-small" x="162" y="232">va</text>
      <text class="svg-label-small" x="228" y="232">au restaurant</text>
    </g>
  </svg>
`;

// ---------- 40. Ambiguïtés et sens ----------

const nlpAmbiguityMap = `
  <svg viewBox="0 0 760 260" role="img" aria-label="Carte des ambiguïtés en langage naturel">
    ${arrowHeadDefs}

    <g transform="translate(48, 38)">
      <rect class="svg-pipeline-block" x="0" y="0" width="252" height="70" rx="8"/>
      <text class="svg-pipeline-block-text" x="126" y="31">Time flies like an arrow</text>
      <text class="svg-label-small" x="126" y="54">une phrase, plusieurs lectures</text>
    </g>

    <line class="svg-arrow" x1="322" y1="73" x2="386" y2="73"/>
    <line class="svg-arrow" x1="322" y1="73" x2="386" y2="130"/>
    <line class="svg-arrow" x1="322" y1="73" x2="386" y2="187"/>

    <g transform="translate(410, 32)">
      <rect class="svg-highlight" x="0" y="0" width="260" height="44" rx="8"/>
      <text class="svg-label" x="130" y="28">Lexicale : mot à plusieurs sens</text>

      <rect class="svg-cell" x="0" y="70" width="260" height="44" rx="8" fill="rgba(20,184,166,0.08)"/>
      <text class="svg-label" x="130" y="98">Syntaxique : plusieurs arbres</text>

      <rect class="svg-cell" x="0" y="140" width="260" height="44" rx="8" fill="rgba(20,184,166,0.08)"/>
      <text class="svg-label" x="130" y="168">Référentielle : qui désigne quoi ?</text>
    </g>
  </svg>
`;

// ---------- 41. Pipeline d'analyse de sentiments ----------

const nlpSentimentPipeline = `
  <svg viewBox="0 0 760 240" role="img" aria-label="Pipeline analyse de sentiments avec classifieur bayésien">
    ${arrowHeadDefs}

    <g transform="translate(30, 70)">
      <rect class="svg-pipeline-block" x="0" y="0" width="120" height="70" rx="8"/>
      <text class="svg-pipeline-block-text" x="60" y="30">Tweets</text>
      <text class="svg-label-small" x="60" y="52">positifs / négatifs</text>
    </g>

    <line class="svg-arrow" x1="170" y1="105" x2="228" y2="105"/>

    <g transform="translate(248, 54)">
      <rect class="svg-highlight" x="0" y="0" width="138" height="102" rx="8"/>
      <text class="svg-label" x="69" y="28">Nettoyer</text>
      <text class="svg-label-small" x="69" y="56">tokeniser</text>
      <text class="svg-label-small" x="69" y="80">lemmatiser</text>
    </g>

    <line class="svg-arrow" x1="410" y1="105" x2="468" y2="105"/>

    <g transform="translate(488, 54)">
      <rect class="svg-cell" x="0" y="0" width="134" height="102" rx="8" fill="rgba(20,184,166,0.08)"/>
      <text class="svg-label" x="67" y="28">Features</text>
      <text class="svg-label-small" x="67" y="56">mots présents</text>
      <text class="svg-label-small" x="67" y="80">fréquences</text>
    </g>

    <line class="svg-arrow" x1="640" y1="105" x2="688" y2="105"/>

    <g transform="translate(694, 58)">
      <rect class="svg-pipeline-block" x="0" y="0" width="56" height="94" rx="8"/>
      <text class="svg-pipeline-block-text" x="28" y="30">NB</text>
      <text class="svg-label-small" x="28" y="58">pos</text>
      <text class="svg-label-small" x="28" y="78">neg</text>
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
  paddingExample,
  rnnFeedforwardVsRecurrent,
  jordanElmanComparison,
  rnnMatrixMap,
  rnnUnrolledTime,
  seq2seqTypes,
  tokenEncodingCompare,
  languageModelSoftmax,
  bpttFlow,
  rnnGradientInstability,
  lstmGatesCell,
  encoderDecoderAttention,
  transformerParallelAttention,
  rlAgentEnvironmentLoop,
  rlOptimalityHorizons,
  rlMdpBellman,
  rlPlanningIterations,
  rlModelBasedFreeDyna,
  rlQLearningUpdate,
  mlTrainValidationTestSplit,
  mlOverfittingBiasVariance,
  mlCrossValidationFolds,
  mlConfusionMetrics,
  mlParamHyperparamMap,
  nlpAnalysisPipeline,
  nlpLexicalPipeline,
  nlpCfgParseTree,
  nlpAmbiguityMap,
  nlpSentimentPipeline
};
})(window);
