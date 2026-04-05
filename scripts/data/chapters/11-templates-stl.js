(function registerChapterBundle11(globalScope) {
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
  videoLesson,
  playlistVideo
} = registry.helpers;

registry.registerChapterBundle({
  order: 11,
  chapter:   {
    id: "templates-stl",
    shortTitle: "Templates et STL",
    title: "Templates, conteneurs STL, itérateurs et algorithmes",
    level: "Avancé",
    duration: "75 min",
    track: "SE7",
    summary:
      "Les templates changent l'échelle du code C++ : on écrit des abstractions génériques sans sacrifier la performance. La STL rend ensuite ces abstractions immédiatement utiles.",
    goals: [
      "comprendre l'idée d'instanciation de template et son impact sur l'organisation du code",
      "choisir un conteneur STL adapté au besoin",
      "combiner algorithmes, itérateurs, foncteurs et lambdas"
    ],
    highlights: ["template", "vector", "iterator", "algorithm"],
    body: [
      lesson(
        "Fonctions template et instanciation",
        paragraphs(
          "Un template est un moule de code générique. Il ne devient une fonction ou une classe concrète que lorsque le compilateur l'instancie pour un type donné. Cela permet d'écrire une fois une logique commune et de la réutiliser pour plusieurs types sans perdre le typage statique.",
          "En pratique, cela signifie aussi que la définition complète d'un template doit généralement se trouver dans un header. Si le compilateur ne voit que la déclaration sans le corps, il ne peut pas générer l'instanciation nécessaire."
        ),
        code(
          "cpp",
          `
template <typename T>
T minimum(const T& a, const T& b) {
    return (a < b) ? a : b;
}

double d = minimum(3.14, 2.71);
int n = minimum(5, 3);
          `,
          "Fonction template"
        ),
        code(
          "cpp",
          `
template <typename T1, typename T2>
T2 calculerMoyenne(const T1 tableau[], int taille) {
    T2 somme = 0;
    for (int i = 0; i < taille; ++i) {
        somme += tableau[i];
    }
    return somme / taille;
}
          `,
          "Template avec plusieurs paramètres"
        ),
        callout("info", "Question clé", "Si ton template dépend de beaucoup d'opérations implicites sur <code>T</code>, explicite mentalement ces contraintes avant d'aller plus loin.")
      ),
      lesson(
        "Classes template et contraintes implicites",
        paragraphs(
          "On peut paramétrer une classe entière avec un type. C'est utile pour écrire une structure générique, mais cela impose aussi de raisonner sur ce qu'on attend réellement du type paramètre : est-il copiable, comparable, default-constructible, additionnable ?",
          "En production, cela ne signifie pas qu'il faut réécrire la STL. Une classe template maison est souvent un exercice pédagogique ; dans un vrai projet, <code>std::vector</code>, <code>std::map</code> ou <code>std::optional</code> couvrent déjà énormément de besoins."
        ),
        code(
          "cpp",
          `
template <typename T>
class Vector {
public:
    explicit Vector(unsigned int size) : elem_{new T[size]}, size_{size} {}
    ~Vector() { delete[] elem_; }

    T& operator[](unsigned int index) {
        if (index >= size_) {
            throw std::out_of_range{"Vector::operator[]"};
        }
        return elem_[index];
    }

    unsigned int size() const { return size_; }

private:
    T* elem_;
    unsigned int size_;
};
          `,
          "Classe template"
        ),
        bullets([
          "Un template n'efface pas les contraintes ; il les déplace dans le contrat implicite du type paramètre.",
          "Une structure pédagogique maison n'a de sens que si elle t'aide à comprendre ce que la STL fait déjà très bien."
        ]),
        callout("success", "Réflexe simple", "Si ton besoin ressemble à une séquence dynamique, commence par <code>std::vector</code> avant de songer à écrire ton propre conteneur.")
      ),
      lesson(
        "Choisir le bon conteneur STL",
        paragraphs(
          "La Standard Template Library réunit conteneurs, itérateurs, algorithmes et foncteurs. Le point essentiel n'est pas d'en mémoriser une liste exhaustive, mais de relier un besoin métier à la structure adaptée.",
          "Le bon conteneur n'est pas 'le plus avancé' mais celui qui rend les opérations dominantes simples, sûres et performantes."
        ),
        table(
          ["Conteneur", "Accès dominant", "Cas typique"],
          [
            ["<code>std::vector</code>", "Indexation rapide, ajout en fin", "Choix par défaut pour une séquence dynamique."],
            ["<code>std::list</code>", "Parcours séquentiel, insertions/suppressions ciblées", "Cas rares où la liste chaînée a un vrai intérêt."],
            ["<code>std::deque</code>", "Accès indexé et insertions aux extrémités", "File double-bout."],
            ["<code>std::map</code>", "Recherche par clé triée", "Dictionnaire ordonné."],
            ["<code>std::unordered_map</code>", "Recherche rapide par clé", "Dictionnaire sans besoin d'ordre."],
            ["<code>std::set</code>", "Unicité + ordre", "Ensemble trié sans doublons."],
            ["<code>std::stack</code> / <code>std::queue</code>", "Accès contrôlé au sommet ou à la tête", "Pile LIFO ou file FIFO."]
          ]
        ),
        callout("warn", "Choix par défaut", "Dans la majorité des exercices et de nombreux projets réels, <code>std::vector</code> reste le premier choix raisonnable grâce à sa localité mémoire et à sa simplicité.")
      ),
      lesson(
        "Itérateurs et parcours",
        paragraphs(
          "Un itérateur est l'abstraction qui permet de parcourir un conteneur sans connaître sa représentation interne. Les algorithmes STL travaillent sur des plages d'itérateurs, pas directement sur des <code>vector</code> ou des <code>map</code> en dur.",
          "La paire <code>begin()</code> / <code>end()</code> délimite une séquence. <code>end()</code> ne désigne pas le dernier élément : c'est une sentinelle située juste après le dernier."
        ),
        code(
          "cpp",
          `
std::vector<int> valeurs{4, 1, 9, 2, 7};

for (std::vector<int>::iterator it = valeurs.begin(); it != valeurs.end(); ++it) {
    std::cout << *it << '\\n';
}

for (const auto& valeur : valeurs) {
    std::cout << valeur << '\\n';
}
          `,
          "Itérateur explicite puis boucle range-for"
        ),
        table(
          ["Catégorie", "Exemple", "Capacité clé"],
          [
            ["Input iterator", "<code>istream_iterator</code>", "Lecture en avant."],
            ["Forward iterator", "<code>forward_list</code>", "Parcours avant réutilisable."],
            ["Bidirectional iterator", "<code>list</code>, <code>map</code>", "Parcours avant et arrière."],
            ["Random access iterator", "<code>vector</code>, <code>deque</code>", "Sauts directs en O(1)."]
          ]
        ),
        callout("info", "Repère important", "Le type d'itérateur disponible conditionne certains algorithmes. Par exemple, <code>std::sort</code> attend des itérateurs à accès aléatoire.")
      ),
      lesson(
        "Algorithmes, foncteurs et lambdas",
        paragraphs(
          "Les algorithmes STL sont des fonctions template qui opèrent sur des plages d'itérateurs. Ils rendent le code plus déclaratif : au lieu de décrire toute la mécanique de la boucle, on exprime une intention comme trier, chercher, compter, transformer ou accumuler.",
          "Les foncteurs sont des objets appelables grâce à <code>operator()</code>. Aujourd'hui, les lambdas remplacent beaucoup de foncteurs simples, mais les deux idées restent utiles pour comprendre la STL."
        ),
        code(
          "cpp",
          `
std::vector<int> v{3, 1, 4, 1, 5, 9, 2, 6};

int nbUns = std::count(v.begin(), v.end(), 1);
auto pos = std::find(v.begin(), v.end(), 9);
std::sort(v.begin(), v.end(), std::greater<int>());
int somme = std::accumulate(v.begin(), v.end(), 0);

std::transform(v.begin(), v.end(), v.begin(), [](int x) {
    return x * 2;
});

auto last = std::unique(v.begin(), v.end());
v.erase(last, v.end());
          `,
          "Algorithmes STL"
        ),
        bullets([
          "Un prédicat est un foncteur ou une lambda qui renvoie un booléen.",
          "Une lambda courte améliore souvent la lecture ; si elle grossit, donne un nom à l'opération.",
          "Les algorithmes standards évitent de réécrire des boucles répétitives pour des tâches déjà nommées."
        ])
      ),
      lesson(
        "Pile, file et algorithmes copy/transform",
        paragraphs(
          "<code>std::stack</code> et <code>std::queue</code> sont des adaptateurs de conteneur qui imposent une discipline d'accès. Une pile (LIFO) ne donne accès qu'au sommet ; une file (FIFO) ne donne accès qu'à la tête. Ils se construisent sur <code>std::deque</code> par défaut et exposent une interface volontairement restreinte.",
          "<code>std::copy</code> et <code>std::transform</code> sont deux algorithmes fondamentaux souvent combinés. <code>copy</code> recopie une plage vers une destination ; <code>transform</code> applique une opération élément par élément. Ces deux algorithmes illustrent le style déclaratif : on décrit ce qu'on fait, pas comment itérer."
        ),
        code(
          "cpp",
          `
#include <stack>
#include <queue>

std::stack<int> pile;
pile.push(1); pile.push(2); pile.push(3);
while (!pile.empty()) {
    std::cout << pile.top() << '\\n';   // affiche 3, 2, 1
    pile.pop();
}

std::queue<std::string> file;
file.push("A"); file.push("B"); file.push("C");
while (!file.empty()) {
    std::cout << file.front() << '\\n'; // affiche A, B, C
    file.pop();
}
          `,
          "Pile LIFO et file FIFO"
        ),
        code(
          "cpp",
          `
#include <algorithm>
#include <cctype>

std::vector<char> source{'a', 'b', 'c', 'd'};
std::vector<char> dest(source.size());

// copy : recopie vers dest
std::copy(source.begin(), source.end(), dest.begin());

// transform : convertit en majuscules dans dest
std::transform(source.begin(), source.end(), dest.begin(), [](char c) {
    return static_cast<char>(std::toupper(c));
});
// dest = {'A', 'B', 'C', 'D'}

// tri classique
std::sort(dest.begin(), dest.end());
          `,
          "copy, transform et sort"
        ),
        table(
          ["Conteneur / Algorithme", "Rôle", "Méthodes clés"],
          [
            ["<code>std::stack&lt;T&gt;</code>", "Pile LIFO", "<code>push</code>, <code>top</code>, <code>pop</code>, <code>empty</code>"],
            ["<code>std::queue&lt;T&gt;</code>", "File FIFO", "<code>push</code>, <code>front</code>, <code>back</code>, <code>pop</code>, <code>empty</code>"],
            ["<code>std::copy</code>", "Recopie une plage", "Itérateurs source + itérateur destination"],
            ["<code>std::transform</code>", "Applique une fonction sur chaque élément", "Plage source + destination + foncteur/lambda"]
          ]
        ),
        callout("info", "Quand choisir stack/queue ?", "Préfère <code>std::stack</code> ou <code>std::queue</code> quand la sémantique d'accès restreint (LIFO/FIFO) est un invariant métier réel. Si tu as besoin d'un accès libre à n'importe quel élément, reste sur <code>std::vector</code>.")
      ),
      videoLesson(
        "Pour ancrer les réflexes génériques les plus rentables, cette sélection est la plus proche du contenu de ce chapitre dans la playlist.",
        [
          playlistVideo("templates", "pose clairement l'idée d'instanciation et de code générique"),
          playlistVideo("vectorUsage", "bon complément sur le conteneur par défaut du quotidien"),
          playlistVideo("lambdas", "prolonge directement la partie algorithmes STL et opérations locales")
        ]
      )
    ].join(""),
    checklist: [
      "Je comprends l'idée générale d'un template et de son instanciation.",
      "Je sais pourquoi les définitions de templates vivent généralement dans des headers.",
      "Je comprends qu'une classe template impose des contraintes implicites à son type paramètre.",
      "Je sais choisir un conteneur par défaut raisonnable.",
      "Je sais ce que représentent <code>begin()</code> et <code>end()</code>.",
      "Je reconnais l'intérêt des algorithmes STL.",
      "Je peux lire une lambda simple ou un prédicat.",
      "Je n'écris pas une boucle maison quand un algorithme standard raconte mieux l'intention.",
      "Je connais la différence entre LIFO (<code>std::stack</code>) et FIFO (<code>std::queue</code>).",
      "Je sais utiliser <code>std::copy</code> et <code>std::transform</code> avec des itérateurs."
    ],
    quiz: [
      {
        question: "Quel conteneur est le plus souvent le bon premier choix pour une séquence dynamique ?",
        options: ["<code>std::vector</code>", "<code>std::stack</code>", "<code>std::set</code>"],
        answer: 0,
        explanation: "<code>std::vector</code> offre un très bon compromis général et reste le conteneur de séquence par défaut."
      },
      {
        question: "Pourquoi utiliser <code>std::sort</code> plutôt qu'une boucle de tri réécrite à la main ?",
        options: [
          "Parce que les boucles sont interdites en C++",
          "Parce que l'algorithme standard exprime mieux l'intention et évite du code inutile",
          "Parce qu'il impose l'usage de pointeurs"
        ],
        answer: 1,
        explanation: "Les algorithmes standards augmentent la lisibilité et s'appuient sur des implémentations éprouvées."
      },
      {
        question: "Pourquoi la définition d'un template se trouve-t-elle souvent dans un fichier d'en-tête ?",
        options: [
          "Parce qu'un template doit être visible au compilateur au moment de l'instanciation",
          "Parce que les templates ne peuvent jamais contenir de code",
          "Parce que les headers s'exécutent plus vite que les sources"
        ],
        answer: 0,
        explanation: "Le compilateur doit voir la définition complète du template pour générer la version concrète utilisée."
      },
      {
        question: "Que représente <code>end()</code> sur un conteneur STL ?",
        options: [
          "Le dernier élément du conteneur",
          "Un élément nul ajouté automatiquement",
          "Une position sentinelle située juste après le dernier élément"
        ],
        answer: 2,
        explanation: "<code>end()</code> marque la fin de la plage ; on ne le déréférence pas."
      },
      {
        question: "Quelle est la différence fondamentale entre <code>std::stack</code> et <code>std::queue</code> ?",
        options: [
          "stack est trié, queue ne l'est pas",
          "stack donne accès au dernier élément entré (LIFO), queue au premier entré (FIFO)",
          "stack n'accepte que des entiers, queue accepte tous les types"
        ],
        answer: 1,
        explanation: "stack = Last In First Out (le sommet est le dernier entré) ; queue = First In First Out (on sort dans l'ordre d'arrivée)."
      }
    ],
    exercises: [
      {
        title: "Mini bibliothèque générique",
        difficulty: "Avancé",
        time: "30 min",
        prompt: "Écris une ou deux fonctions templates simples mais utiles, puis démontre-les sur plusieurs types en expliquant les contraintes imposées au type paramètre.",
        deliverables: [
          "les fonctions génériques",
          "des exemples sur au moins deux types",
          "les contraintes implicites sur le type paramètre"
        ]
      },
      {
        title: "Refonte STL",
        difficulty: "Intermédiaire",
        time: "25 min",
        prompt: "Prends un exercice avec tableaux et boucles répétitives puis réécris-le avec conteneurs STL, itérateurs et algorithmes standards.",
        deliverables: [
          "le conteneur choisi",
          "les algorithmes utilisés",
          "le gain de lisibilité obtenu"
        ]
      },
      {
        title: "Pile et file de Pokémons",
        difficulty: "Intermédiaire",
        time: "25 min",
        prompt: "Lis une liste de noms depuis un fichier, stocke-les dans une <code>std::queue</code>, puis utilise <code>std::transform</code> pour les convertir en majuscules dans un <code>std::vector</code>.",
        deliverables: [
          "la lecture et le remplissage de la queue",
          "la transformation avec std::transform",
          "l'affichage du résultat final"
        ]
      }
    ],
    keywords: ["template", "stl", "vector", "map", "unordered_map", "algorithm", "lambda", "iterateur", "foncteur", "predicat", "stack", "queue", "copy", "transform", "lifo", "fifo"]
  },
  deepDives: [
    {
      focus: "Un template n'est pas du code directement exécutable mais un modèle que le compilateur instancie pour des types concrets. Comprendre cette idée explique à la fois la puissance du mécanisme et l'obligation fréquente de placer les définitions dans les headers.",
      retenir: [
        "Le template capture une famille de comportements, pas un cas isolé.",
        "L'instanciation a lieu au moment où le compilateur voit réellement le type utilisé."
      ],
      pitfalls: [
        "Écrire un template juste pour éviter une petite duplication prématurée.",
        "Oublier que le compilateur doit voir la définition complète au moment de l'instanciation."
      ],
      method: [
        "Repère ce qui est vraiment indépendant du type concret.",
        "Liste les opérations minimales exigées sur ce type.",
        "Teste ensuite l'idée sur plusieurs cas réellement différents."
      ],
      check: "Peux-tu expliquer pourquoi un template placé uniquement dans un .cpp pose souvent problème ?"
    },
    {
      focus: "Les classes template rendent la généricité structurelle, mais elles déplacent aussi beaucoup de contraintes dans le contrat implicite du type paramètre. Le vrai enjeu pédagogique est de reconnaître ces exigences au lieu de les laisser cachées.",
      retenir: [
        "Le type paramètre doit supporter les opérations utilisées dans la classe.",
        "Une classe template maison sert surtout à comprendre le mécanisme ; la STL reste la référence en pratique."
      ],
      pitfalls: [
        "Réinventer un conteneur standard sans raison métier sérieuse.",
        "Écrire une abstraction générique sans savoir quelles opérations elle attend du type."
      ],
      method: [
        "Écris d'abord le besoin concret sur un type simple.",
        "Factorise ensuite seulement ce qui ne dépend vraiment pas du type.",
        "Documente mentalement ou explicitement les prérequis sur le type paramètre."
      ],
      check: "Quand ton template échoue à compiler, sais-tu relier l'erreur à une opération manquante sur le type générique ?"
    },
    {
      focus: "Choisir un conteneur STL, c'est choisir un compromis entre accès, insertion, suppression, ordre et stabilité des références. Le bon choix part des usages dominants du problème, pas d'une préférence abstraite pour un conteneur 'plus avancé'.",
      retenir: [
        "vector est souvent le meilleur point de départ pour une séquence dynamique.",
        "Les complexités intéressantes sont celles des opérations vraiment fréquentes dans le scénario réel."
      ],
      pitfalls: [
        "Choisir list, map ou set par prestige plutôt que par besoin.",
        "Parler performances sans regarder la localité mémoire et les usages réels."
      ],
      method: [
        "Liste les opérations dominantes du problème.",
        "Choisis le conteneur le plus simple qui répond correctement à ces besoins.",
        "Réévalue si les usages changent, pas parce qu'un autre conteneur semble plus sophistiqué."
      ],
      check: "Peux-tu défendre un choix de conteneur en parlant d'opérations dominantes plutôt que de réputation générale ?"
    },
    {
      focus: "Les itérateurs unifient le parcours des conteneurs. Leur intérêt n'est pas seulement syntaxique : ils rendent possible un langage algorithmique commun à des structures de données différentes, à condition de respecter la catégorie d'itérateur attendue.",
      retenir: [
        "begin() et end() délimitent une plage ; end() est une sentinelle, pas un élément.",
        "Tous les conteneurs ne fournissent pas les mêmes capacités de déplacement."
      ],
      pitfalls: [
        "Déréférencer end() comme s'il s'agissait du dernier élément.",
        "Supposer qu'un algorithme exigeant du random access fonctionne sur n'importe quel conteneur."
      ],
      method: [
        "Identifie la plage de travail begin/end.",
        "Vérifie la catégorie d'itérateur offerte par le conteneur.",
        "Choisis ensuite l'algorithme compatible le plus expressif."
      ],
      check: "Saurais-tu expliquer pourquoi std::sort marche sur vector mais pas directement sur list ?"
    },
    {
      focus: "Les algorithmes STL, foncteurs et lambdas poussent vers un style plus déclaratif. L'enjeu n'est pas d'interdire les boucles, mais de choisir l'expression la plus lisible pour décrire une intention comme filtrer, transformer, compter ou accumuler.",
      retenir: [
        "Un algorithme standard met en avant l'opération conceptuelle plutôt que sa mécanique.",
        "Une lambda brève ou un prédicat bien choisi clarifie souvent le traitement."
      ],
      pitfalls: [
        "Écrire des lambdas trop longues qui cachent la logique au lieu de l'éclairer.",
        "Forcer un algorithme STL dans un cas où une boucle simple serait plus lisible."
      ],
      method: [
        "Nomine d'abord l'intention globale du traitement.",
        "Cherche l'algorithme standard qui raconte le mieux cette intention.",
        "Garde la règle injectée courte ; sinon, factorise-la clairement."
      ],
      check: "Quand préfères-tu une boucle explicite à un algorithme STL, et pour quelle raison de lisibilité ?"
    },
    {
      focus: "stack, queue, copy et transform sont la jonction entre la généricité des templates et le côté pratique de la STL. Ils illustrent que la discipline d'accès (LIFO/FIFO) peut être un choix de design autant qu'un détail d'implémentation.",
      retenir: [
        "stack et queue imposent un protocole d'accès, ce qui peut être une contrainte ou une garantie selon le contexte.",
        "copy et transform évitent les boucles de remplissage répétitives et expriment clairement l'intention."
      ],
      pitfalls: [
        "Utiliser stack ou queue alors qu'on a besoin d'accéder à un élément arbitraire — vector ou deque sont alors plus adaptés.",
        "Passer un itérateur d'insertion `back_inserter` à copy sans allouer préalablement l'espace dans dest."
      ],
      method: [
        "Identifie la discipline d'accès réelle du problème : LIFO, FIFO ou accès libre ?",
        "Choisis le conteneur adapté, puis exprime la transformation avec copy ou transform.",
        "Vérifie que la destination a la bonne taille avant d'appeler copy."
      ],
      check: "Pour le problème de Josephus, pourquoi queue est-il plus expressif qu'un vecteur avec un index manuel ?"
    }
  ]
});
})(window);
