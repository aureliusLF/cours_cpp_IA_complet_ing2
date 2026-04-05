(function registerChapterBundle3(globalScope) {
const registry = globalScope.CourseDataRegistry;

if (!registry) {
  console.error("CourseDataRegistry est indisponible. Vérifie que scripts/data/course-runtime.js est chargé avant les chapitres.");
  return;
}

const {
  lesson,
  paragraphs,
  bullets,
  checklist,
  callout,
  code,
  table,
  withChapterTheme,
  videoLesson,
  playlistVideo
} = registry.helpers;

registry.registerChapterBundle({
  order: 3,
  chapter: withChapterTheme("pointeurs-memoire", () => ({
    id: "pointeurs-memoire",
    shortTitle: "Pointeurs et mémoire",
    title: "Pointeurs, adresses mémoire et allocation dynamique",
    level: "Fondations",
    duration: "50 min",
    track: "SE1",
    summary:
      "Ce chapitre transforme une idée abstraite en image concrète : une variable vit à une adresse, et un pointeur est simplement une variable qui stocke cette adresse. Une fois ce modèle compris, les bugs mémoire deviennent plus lisibles et les limites des pointeurs bruts aussi.",
    goals: [
      "expliquer le rôle de <code>&amp;</code>, <code>*</code> et <code>nullptr</code> sans confondre adresse et valeur",
      "lire un parcours simple avec arithmétique de pointeurs et relier un tableau à son premier élément",
      "distinguer les formes <code>const T*</code>, <code>T* const</code> et reconnaître les pièges mémoire les plus coûteux"
    ],
    highlights: ["&", "*", "nullptr", "delete[]", "dangling pointer"],
    body: [
      lesson(
        "Modèle mental : une variable a une valeur, mais aussi une adresse",
        paragraphs(
          "Imagine la mémoire comme une grande rangée de cases numérotées. Une variable occupe une ou plusieurs cases, et son adresse est l'endroit où elle commence. Un pointeur n'est donc pas 'une magie du C++' : c'est juste une variable dont le contenu est une adresse.",
          "Deux opérateurs se partagent le travail. <code>&amp;</code> donne l'adresse d'une variable existante. <code>*</code>, lui, sert soit à déclarer un pointeur, soit à suivre l'adresse pour retrouver la valeur pointée. Le vrai enjeu du chapitre est de savoir à quel moment tu manipules une adresse, et à quel moment tu manipules la donnée située derrière."
        ),
        code(
          "cpp",
          `
int note{12};
int* p{&note};   // p contient l'adresse de note

std::cout << p << '\\n';   // affiche une adresse
std::cout << *p << '\\n';  // affiche 12

*p = 15;                   // modifie note à travers le pointeur
std::cout << note << '\\n'; // affiche 15
          `,
          "Adresse, pointeur et déréférencement"
        ),
        table(
          ["Opérateur", "Contexte", "Signification"],
          [
            ["<code>&amp;x</code>", "Expression", "Adresse de la variable <code>x</code>."],
            ["<code>int* p</code>", "Déclaration", "<code>p</code> est un pointeur vers un <code>int</code>."],
            ["<code>*p</code>", "Expression", "Valeur stockée à l'adresse contenue dans <code>p</code>."]
          ]
        ),
        callout("info", "Image utile", "Une variable classique te donne directement la valeur. Un pointeur te donne d'abord une adresse, puis il faut la suivre avec <code>*</code> pour retrouver la valeur.")
      ),
      lesson(
        "Exemple minimal avant les variantes : tableau, parcours et <code>nullptr</code>",
        paragraphs(
          "Avant de parler des cas avancés, retiens un exemple canonique : un tableau est une zone contiguë, et son nom se comporte comme un pointeur vers le premier élément. L'arithmétique des pointeurs ne compte donc pas en octets visibles pour toi, mais en éléments du type pointé.",
          "C'est pour cela que <code>p + 1</code> veut dire 'élément suivant du même type'. Cette idée rend la notation <code>arr[i]</code> équivalente à <code>*(arr + i)</code>. En parallèle, un pointeur peut aussi ne viser aucune donnée valide : on le note alors <code>nullptr</code>."
        ),
        code(
          "cpp",
          `
int notes[]{10, 12, 15};
int* courant{notes};           // pointe vers notes[0]

std::cout << *courant << '\\n';   // 10
std::cout << *(courant + 2) << '\\n'; // 15

int* rien{nullptr};
if (rien == nullptr) {
    std::cout << "aucune cible\n";
}
          `,
          "Arithmétique sur pointeur"
        ),
        bullets([
          "Incrémenter un <code>int*</code> avance d'un <code>int</code>, pas d'un octet isolé.",
          "<code>arr[i]</code> et <code>*(arr + i)</code> désignent le même élément.",
          "<code>nullptr</code> représente explicitement l'absence de cible valide.",
          "L'arithmétique n'est correcte qu'à l'intérieur du même tableau."
        ]),
        callout("success", "Ce qu'il faut retenir d'abord", "Tant que tu sais lire <code>&amp;</code>, <code>*</code>, <code>nullptr</code> et <code>*(p + i)</code>, tu possèdes déjà le noyau du chapitre.")
      ),
      lesson(
        "Piège classique : un pointeur peut survivre à sa cible",
        paragraphs(
          "Le bug le plus dangereux n'est pas d'écrire une mauvaise déclaration, mais de garder une adresse alors que la donnée pointée n'existe plus. On obtient alors un <em>dangling pointer</em> : le programme compile, mais l'adresse ne désigne plus une ressource vivante.",
          "Ce problème apparaît typiquement quand on retourne l'adresse d'une variable locale, quand on utilise un pointeur après <code>delete</code>, ou quand on mélange <code>new[]</code> et <code>delete</code>. Le point commun est toujours le même : l'adresse existe encore, la cible non."
        ),
        code(
          "cpp",
          `
int* fabriquerMauvaisPointeur() {
    int local{42};
    return &local;  // bug : local disparaît à la fin de la fonction
}

int* notes = new int[3]{10, 12, 15};
delete[] notes;
// std::cout << notes[0] << '\n'; // bug : pointeur suspendu
          `,
          "Deux manières courantes de fabriquer un pointeur suspendu"
        ),
        callout("warn", "Piège classique", "Un pointeur 'a l'air non nul' même quand sa cible a déjà disparu. Ce n'est donc pas sa forme qui compte, mais l'état réel de la ressource qu'il prétend viser.")
      ),
      lesson(
        "Vérification active : ce qu'il faut savoir expliquer à l'oral",
        paragraphs(
          "Tu dois maintenant pouvoir expliquer à l'oral la différence entre une valeur et son adresse, mais aussi lire une déclaration sans te tromper de niveau. Le bon test consiste à commenter une ligne de code mot à mot.",
          "C'est aussi le moment de clarifier les différentes places de <code>const</code>. Lire de droite à gauche aide beaucoup : ce qui est à gauche de <code>*</code> protège la valeur pointée ; ce qui est à droite protège l'adresse elle-même."
        ),
        table(
          ["Déclaration", "Comment la lire"],
          [
            ["<code>const int* p</code>", "Pointeur vers <code>int</code> en lecture seule."],
            ["<code>int* const p</code>", "Pointeur fixe vers un <code>int</code> modifiable."],
            ["<code>const int* const p</code>", "Ni la cible ni l'adresse ne doivent changer."],
            ["<code>Point* pt</code>", "Adresse d'un objet <code>Point</code>, accessible ensuite via <code>pt-&gt;x</code>."]
          ]
        ),
        code(
          "cpp",
          `
struct Point { double x; double y; };

Point pt{3.0, 4.0};
Point* ptr{&pt};
std::cout << ptr->x << '\n'; // équivalent à (*ptr).x
          `,
          "L'opérateur flèche combine déréférencement et accès membre"
        ),
        callout("info", "Ce qu'il faut savoir expliquer à l'oral", "Je peux dire ce que contient un pointeur, ce que fait un déréférencement, pourquoi <code>nullptr</code> est utile, et pourquoi un pointeur suspendu est dangereux même si le programme compile.")
      ),
      lesson(
        "Pont vers la suite : toutes les adresses ne se manipulent pas de la même façon",
        paragraphs(
          "Le prochain cap est de comprendre qu'on ne transmet pas toujours une donnée de la même manière à une fonction. Parfois on copie, parfois on modifie un objet existant, parfois on accepte l'absence avec un pointeur, parfois on préfère une référence.",
          "Autrement dit, les pointeurs ne servent pas seulement à 'faire de la mémoire'. Ils servent aussi à exprimer une relation entre deux morceaux de code. C'est exactement ce que le chapitre suivant formalise avec les signatures de fonctions."
        ),
        code(
          "cpp",
          `
void afficherNote(const int* note) {
    if (note != nullptr) {
        std::cout << *note << '\n';
    }
}
          `,
          "Un pointeur peut aussi exprimer qu'une donnée est optionnelle"
        ),
        callout("success", "Pont vers le chapitre suivant", "Une fois les adresses comprises, la vraie question devient : que veut exprimer ma signature ? Lecture seule, modification, copie ou absence possible ?")
      ),
      videoLesson(
        "Ces vidéos sont les plus directement alignées avec la partie mémoire bas niveau de ce chapitre.",
        [
          playlistVideo("pointers", "très bonne explication du modèle adresse -> pointeur -> déréférencement"),
          playlistVideo("broCodePointers", "explication très simple si tu veux revoir le geste mental valeur / adresse / pointeur"),
          playlistVideo("revaninioPointers", "alternative francophone très orientée intuition mémoire"),
          playlistVideo("newKeyword", "utile pour la transition vers l'allocation dynamique et ses responsabilités"),
          playlistVideo("objectLifetime", "renforce l'intuition sur la durée de vie et les pointeurs suspendus")
        ]
      )
    ].join(""),
    checklist: [
      "Je peux expliquer la différence entre la valeur d'une variable et son adresse mémoire.",
      "Je peux lire correctement <code>&amp;x</code>, <code>int* p</code> et <code>*p</code> dans leur contexte respectif.",
      "Je peux justifier l'usage de <code>nullptr</code> pour représenter une absence de cible.",
      "Je peux expliquer pourquoi <code>*(p + i)</code> et <code>arr[i]</code> parlent du même élément d'un tableau.",
      "Je peux diagnostiquer un pointeur suspendu causé par une variable locale détruite ou par un <code>delete</code> déjà effectué.",
      "Je peux lire les combinaisons essentielles de <code>const</code> avec un pointeur.",
      "Je peux expliquer pourquoi les pointeurs bruts propriétaires sont fragiles en C++ moderne."
    ],
    quiz: [
      {
        question: "Dans ce code, que vaut <code>note</code> après l'instruction <code>*p = 15;</code> ?<br><code>int note{12}; int* p{&note};</code>",
        options: [
          "<code>note</code> vaut toujours 12, car seul le pointeur change",
          "<code>note</code> vaut 15, car le déréférencement écrit dans la variable ciblée",
          "Le programme ne compile pas, car on ne peut pas écrire via un pointeur"
        ],
        answer: 1,
        explanation: "Le pointeur contient l'adresse de <code>note</code>. Écrire dans <code>*p</code>, c'est donc écrire directement dans <code>note</code> à travers cette adresse."
      },
      {
        question: "Quel est le vrai problème dans cette fonction ?<br><code>int* fabrique() { int local{42}; return &local; }</code>",
        options: [
          "Elle retourne un pointeur vers une variable qui n'existe plus après la fin de la fonction",
          "Elle devrait retourner un <code>double*</code>",
          "Le mot-clé <code>return</code> est interdit avec les pointeurs"
        ],
        answer: 0,
        explanation: "Le compilateur peut accepter la syntaxe, mais la logique est fausse. Dès que la fonction se termine, <code>local</code> disparaît et l'adresse retournée devient invalide."
      },
      {
        question: "Si <code>p</code> pointe sur le premier élément de <code>int notes[]{10, 12, 15};</code>, que vaut <code>*(p + 2)</code> ?",
        options: ["12", "15", "L'adresse de <code>notes[2]</code>"],
        answer: 1,
        explanation: "<code>p + 2</code> atteint le troisième élément du tableau. Le déréférencement lit ensuite la valeur qui s'y trouve, ici 15."
      },
      {
        question: "Quelle déclaration exprime un pointeur dont <strong>l'adresse</strong> ne peut pas être modifiée mais dont la <strong>valeur pointée</strong> peut l'être ?",
        options: [
          "<code>const int* p</code>",
          "<code>int* const p</code>",
          "<code>const int* const p</code>"
        ],
        answer: 1,
        explanation: "La lecture de droite à gauche aide ici beaucoup. Le <code>const</code> attaché au pointeur fige l'adresse, mais la valeur pointée reste modifiable."
      },
      {
        question: "Pourquoi <code>delete[]</code> est-il requis après <code>new int[5]</code> ?",
        options: [
          "Parce qu'il s'agit d'une convention purement visuelle",
          "Parce qu'il faut libérer un bloc de tableau, pas un objet simple isolé",
          "Parce que <code>delete[]</code> est obligatoire uniquement sur les tableaux de <code>std::string</code>"
        ],
        answer: 1,
        explanation: "La syntaxe de libération doit correspondre à la syntaxe d'allocation. Mélanger les deux formes introduit un comportement indéfini, donc un bug potentiellement silencieux."
      }
    ],
    exercises: [
      {
        title: "Exploration d'adresses",
        difficulty: "Facile",
        time: "15 min",
        prompt: "Déclare trois variables de types différents, affiche leur valeur puis leur adresse avec <code>&amp;</code>, crée pour chacune un pointeur adapté et modifie les valeurs via déréférencement. Termine par une phrase d'analyse sur ce que tu observes.",
        deliverables: [
          "un affichage des valeurs avant et après modification via pointeurs",
          "les adresses des variables avec une courte interprétation de ce qu'elles représentent",
          "une conclusion expliquant la différence entre valeur, adresse et déréférencement"
        ]
      },
      {
        title: "Parcours de tableau par arithmétique de pointeurs",
        difficulty: "Intermédiaire",
        time: "20 min",
        prompt: "Écris une fonction qui reçoit un pointeur vers le début d'un tableau et un pointeur vers la fin, puis calcule la somme et le maximum sans utiliser la notation <code>[]</code>. Vérifie le résultat sur un petit tableau de test dont tu connais déjà la réponse.",
        deliverables: [
          "une fonction correcte sur le cas de test fourni dans ton <code>main</code>",
          "une démonstration qui montre explicitement le début, la fin et l'arrêt de la boucle",
          "une courte comparaison avec une solution équivalente en <code>std::vector</code>"
        ]
      },
      {
        title: "Gestion manuelle avec new/delete puis refactoring",
        difficulty: "Intermédiaire",
        time: "25 min",
        prompt: "Implémente une petite pile d'entiers avec allocation dynamique manuelle (<code>new[]</code> / <code>delete[]</code>) puis réécris exactement le même comportement avec <code>std::vector</code>. Le but n'est pas d'aimer ou non les pointeurs, mais de voir quels risques disparaissent quand la bibliothèque gère la mémoire à ta place.",
        deliverables: [
          "une première version fonctionnelle qui n'oublie ni l'allocation ni la libération",
          "une seconde version en <code>std::vector</code> avec le même comportement observable",
          "une liste argumentée des bugs potentiels éliminés par la refactorisation"
        ]
      }
    ],
    keywords: ["pointeur", "adresse", "dereferencement", "nullptr", "new", "delete", "delete[]", "arithmetique pointeur", "tableau", "const pointeur", "fleche", "dangling pointer", "fuite memoire"]
  })),
  deepDives: [
    {
      focus: "Un pointeur n'est pas un concept mystérieux réservé aux experts : c'est une variable ordinaire dont la valeur est une adresse. Tout le reste — arithmétique, tableaux, allocation dynamique — découle de cette idée simple. Bien la comprendre déverrouille une grande partie de la mécanique interne du C++.",
      retenir: [
        "<code>&amp;</code> donne l'adresse d'une variable ; <code>*</code> en déclaration annonce un pointeur ; <code>*</code> en expression déréférence.",
        "Un pointeur non initialisé contient une adresse quelconque : le déréférencer est un comportement indéfini."
      ],
      pitfalls: [
        "Confondre <code>&amp;</code> (adresse) et <code>*</code> (déréférencement) selon le contexte déclaration vs expression.",
        "Oublier d'initialiser un pointeur et supposer qu'il vaut automatiquement <code>nullptr</code>."
      ],
      method: [
        "Lis une déclaration de pointeur de droite à gauche.",
        "Pour tout pointeur déclaré, demande-toi immédiatement : vers quoi pointe-t-il, et qui est responsable de la ressource ?",
        "Teste mentalement chaque opération : que contient le pointeur ? que vaut le déréférencement ?"
      ],
      check: "Peux-tu expliquer à voix haute la différence entre <code>int* p = &amp;x</code> et <code>*p = 99</code> ?"
    },
    {
      focus: "L'arithmétique des pointeurs est cohérente parce qu'elle raisonne en éléments, pas en octets. Cette propriété explique pourquoi les tableaux C se comportent comme des pointeurs, et pourquoi <code>arr[i]</code> et <code>*(arr + i)</code> sont identiques.",
      retenir: [
        "Incrémenter un pointeur avance d'une unité du type pointé, pas d'un octet.",
        "<code>arr[i]</code> est du sucre syntaxique pour <code>*(arr + i)</code> : les deux génèrent le même code."
      ],
      pitfalls: [
        "Croire qu'un tableau passé à une fonction conserve sa taille : il se transforme en pointeur nu.",
        "Sortir des bornes du tableau avec l'arithmétique : le compilateur ne le détecte pas toujours."
      ],
      method: [
        "Pour chaque accès par pointeur, vérifie que l'adresse reste dans les bornes du tableau source.",
        "Quand tu passes un tableau à une fonction, transmets aussi sa taille ou utilise un conteneur standard.",
        "Préfère <code>std::span</code> (C++20) ou <code>std::vector</code> pour les fonctions recevant des séquences."
      ],
      check: "Si <code>p</code> pointe vers <code>arr[1]</code>, que vaut <code>*(p + 2)</code> pour un tableau <code>{10, 20, 30, 40}</code> ?"
    },
    {
      focus: "Lire les qualificatifs <code>const</code> sur un pointeur de droite à gauche résout immédiatement toute ambiguïté. C'est une règle mécanique que le compilateur applique et que tout lecteur peut reproduire sans apprentissage supplémentaire.",
      retenir: [
        "<code>const</code> à gauche de <code>*</code> protège la valeur pointée.",
        "<code>const</code> à droite de <code>*</code> protège l'adresse stockée dans le pointeur."
      ],
      pitfalls: [
        "Retirer <code>const</code> pour 'faire marcher' le code : c'est souvent le signe d'un problème de conception plus profond.",
        "Confondre un pointeur vers <code>const</code> et un pointeur constant : deux contraintes distinctes."
      ],
      method: [
        "Lis la déclaration de droite à gauche.",
        "Pour chaque paramètre de fonction, demande-toi si tu lis, modifies ou possèdes la valeur pointée.",
        "Choisis la combinaison <code>const</code> la plus restrictive qui satisfait l'usage."
      ],
      check: "Quelle déclaration représente un pointeur qu'on ne peut pas rediriger mais dont la valeur cible reste modifiable ?"
    },
    {
      focus: "L'allocation dynamique est nécessaire quand la durée de vie doit dépasser le scope courant ou quand la taille n'est connue qu'à l'exécution. Mais la gestion manuelle est fragile : <code>new</code> / <code>delete</code> à la main n'est quasiment plus justifiable en C++ moderne.",
      retenir: [
        "Chaque <code>new</code> doit avoir exactement un <code>delete</code> ; chaque <code>new[]</code> exactement un <code>delete[]</code>.",
        "En C++ moderne, <code>std::vector</code> et <code>std::unique_ptr</code> rendent la gestion manuelle presque toujours inutile."
      ],
      pitfalls: [
        "Oublier <code>delete</code> après une sortie anticipée ou une exception : fuite mémoire garantie.",
        "Mélanger <code>delete</code> et <code>delete[]</code> : comportement indéfini."
      ],
      method: [
        "Chaque fois que tu écris <code>new</code>, demande-toi : quel objet appellera <code>delete</code> et dans quelle portée ?",
        "Si la réponse est complexe, utilise directement <code>std::unique_ptr</code>.",
        "Réserve <code>new</code> / <code>delete</code> manuels aux interfaces C héritées ou aux cas très spécifiques."
      ],
      check: "Qu'est-ce qui garantit qu'une fuite mémoire n'est pas possible avec <code>std::vector</code>, et comment retrouver cette garantie avec un pointeur brut ?"
    },
    {
      focus: "L'opérateur <code>-&gt;</code> est un raccourci de lecture essentiel. Comprendre qu'il combine déréférencement et accès membre aide à lire n'importe quel code orienté objet manipulant des pointeurs — y compris tout le polymorphisme dynamique du chapitre suivant.",
      retenir: [
        "<code>ptr-&gt;membre</code> est identique à <code>(*ptr).membre</code> : même sémantique, écriture plus claire.",
        "Les pointeurs sur fonctions existent mais sont supplantés par <code>std::function</code> et les lambdas pour la lisibilité."
      ],
      pitfalls: [
        "Utiliser <code>.</code> au lieu de <code>-&gt;</code> sur un pointeur : erreur de compilation.",
        "Retourner l'adresse d'une variable locale depuis une fonction : pointeur suspendu à l'appel suivant."
      ],
      method: [
        "Chaque fois que tu vois <code>-&gt;</code>, rappelle-toi que c'est un déréférencement : le pointeur doit être valide.",
        "Avant tout accès via pointeur, vérifie qu'il n'est pas <code>nullptr</code>.",
        "Pour les callbacks, préfère une lambda ou <code>std::function</code> à un pointeur sur fonction nu."
      ],
      check: "Si <code>p</code> est un <code>Point*</code>, que se passe-t-il si tu appelles <code>p-&gt;x</code> alors que <code>p == nullptr</code> ?"
    }
  ]
});
})(window);
