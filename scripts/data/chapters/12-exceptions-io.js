(function registerChapterBundle12(globalScope) {
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
  order: 12,
  chapter: withChapterTheme("exceptions-io", () => ({
    id: "exceptions-io",
    shortTitle: "Exceptions et I/O",
    title: "Exceptions, assertions et gestion des entrées/sorties",
    level: "Avancé",
    duration: "1 h 35",
    track: "SE5/SE6",
    summary:
      "Un programme solide doit savoir lire des données imparfaites et réagir proprement quand quelque chose échoue. Le C++ fournit des flux, des exceptions et des assertions, mais il faut encore savoir quand utiliser chaque outil, comment parser robustement ligne par ligne et comment distinguer texte, binaire, erreur système et erreur métier.",
    goals: [
      "distinguer une erreur de programmation, un cas métier attendu et une vraie erreur système",
      "utiliser <code>try</code>/<code>catch</code> sans masquer le chemin normal ni brouiller la propagation",
      "lire et écrire des fichiers texte de manière robuste et vérifiable, puis parser localement une ligne avec <code>std::stringstream</code> ou raisonner sur un flux binaire simple"
    ],
    highlights: ["try/catch", "ifstream", "getline", "stringstream", "std::exception", "argv", "iomanip"],
    body: [
      lesson(
        "Architecture des flux en C++",
        paragraphs(
          "En C++, les entrées-sorties passent par des flux. Un flux est une abstraction d'un canal de communication : il peut représenter la console, un fichier, voire d'autres sources de données. Les mêmes opérateurs <code>&lt;&lt;</code> et <code>&gt;&gt;</code> servent alors à écrire ou lire sur plusieurs supports.",
          "Les trois flux standards sont <code>std::cout</code> pour la sortie normale, <code>std::cin</code> pour l'entrée et <code>std::cerr</code> pour les messages d'erreur immédiats. Cette hiérarchie commune explique pourquoi la syntaxe de base reste cohérente entre console et fichiers."
        ),
        table(
          ["Flux", "Rôle", "Remarque"],
          [
            ["<code>std::cout</code>", "Sortie standard", "Souvent bufferisée."],
            ["<code>std::cin</code>", "Entrée standard", "Lecture au clavier ou via redirection."],
            ["<code>std::cerr</code>", "Sortie d'erreur", "Affichage immédiat, utile pour le diagnostic."]
          ]
        ),
        code(
          "cpp",
          `
std::string nom{};
std::cout << "Nom : ";
std::cin >> nom;

if (nom.empty()) {
    std::cerr << "Nom invalide\\n";
}
          `,
          "Flux standards"
        ),
        callout("info", "Hiérarchie utile", "La bibliothèque <code>&lt;iostream&gt;</code> sert pour la console ; <code>&lt;fstream&gt;</code> prolonge cette logique pour les fichiers.")
      ),
      lesson(
        "Fichiers, ouverture et modes",
        paragraphs(
          "Un fichier physique est une suite d'octets sur disque ; le fichier logique est l'objet C++ qui permet de le manipuler. Les classes principales sont <code>std::ifstream</code> pour la lecture, <code>std::ofstream</code> pour l'écriture et <code>std::fstream</code> pour les deux.",
          "Les flux fichier sont déjà RAII : ils se ferment automatiquement à la sortie de portée. L'effort du développeur porte surtout sur l'ouverture correcte, le choix du mode, puis la validation du contenu lu."
        ),
        table(
          ["Mode", "Effet principal"],
          [
            ["<code>std::ios::in</code>", "Lecture."],
            ["<code>std::ios::out</code>", "Écriture."],
            ["<code>std::ios::app</code>", "Ajout en fin de fichier."],
            ["<code>std::ios::trunc</code>", "Vidage du fichier à l'ouverture."],
            ["<code>std::ios::binary</code>", "Mode binaire sans transformation de texte."]
          ]
        ),
        code(
          "cpp",
          `
std::ofstream journal{"journal.txt", std::ios::app};
journal << "Lancement du programme\\n";

std::ifstream input{"notes.txt"};
if (!input) {
    std::cerr << "Impossible d'ouvrir notes.txt\\n";
    return;
}

std::string ligne;
while (std::getline(input, ligne)) {
    std::cout << ligne << '\\n';
}
          `,
          "Écriture puis lecture texte"
        ),
        bullets([
          "Tester le flux juste après l'ouverture.",
          "Utiliser <code>std::getline</code> pour les lignes textuelles.",
          "Éviter <code>std::ios::trunc</code> involontaire quand on veut append.",
          "Séparer la logique de parsing de la logique métier."
        ])
      ),
      lesson(
        "État d'un flux, position et lecture robuste",
        paragraphs(
          "Un flux peut être valide, en fin de fichier, en erreur de format ou dans un état plus grave. Les méthodes <code>good()</code>, <code>fail()</code>, <code>bad()</code> et <code>eof()</code> servent à diagnostiquer l'état de la lecture.",
          "Pour les lectures formatées, l'idiome robuste est <code>while (flux &gt;&gt; valeur)</code>. Éviter <code>while (!flux.eof())</code>, qui lit souvent une itération de trop. Les fonctions <code>tellg</code>, <code>seekg</code>, <code>tellp</code> et <code>seekp</code> permettent en plus de repositionner le curseur dans un fichier."
        ),
        code(
          "cpp",
          `
std::ifstream input{"valeurs.txt"};
int valeur = 0;

while (input >> valeur) {
    std::cout << valeur << '\\n';
}

if (input.fail() && !input.eof()) {
    std::cerr << "Format invalide detecte\\n";
}
          `,
          "Lecture formatée robuste"
        ),
        code(
          "cpp",
          `
input.clear();
input.seekg(0, std::ios::beg);
auto position = input.tellg();
          `,
          "Repositionner le curseur"
        ),
        callout("warn", "Piège classique", "La condition <code>while (!flux.eof())</code> semble intuitive mais produit souvent un traitement supplémentaire après un échec de lecture.")
      ),
      lesson(
        "Parsing robuste ligne par ligne avec <code>std::stringstream</code>",
        paragraphs(
          "Dans beaucoup de projets, la bonne stratégie n'est pas de lire directement tout le fichier dans des variables métiers avec <code>operator&gt;&gt;</code>. Il est souvent plus robuste de lire d'abord une ligne complète avec <code>std::getline</code>, puis de la parser localement avec un <code>std::stringstream</code>. On isole ainsi les erreurs de format ligne par ligne sans casser tout le traitement global.",
          "Cette approche est particulièrement utile pour les formats semi-structurés du type <code>nom;note;groupe</code>. Elle permet aussi de distinguer clairement trois niveaux : lecture brute du fichier, parsing de la ligne, validation métier des champs obtenus."
        ),
        code(
          "cpp",
          `
std::ifstream input{"etudiants.txt"};
std::string ligne;

while (std::getline(input, ligne)) {
    std::stringstream ss{ligne};
    std::string nom;
    std::string noteTexte;
    std::string groupe;

    if (!std::getline(ss, nom, ';') ||
        !std::getline(ss, noteTexte, ';') ||
        !std::getline(ss, groupe, ';')) {
        std::cerr << "Ligne invalide : " << ligne << '\\n';
        continue;
    }

    double note = std::stod(noteTexte);
    // validation metier ensuite
}
          `,
          "Lire d'abord la ligne, parser ensuite localement"
        ),
        bullets([
          "Le parsing local d'une ligne évite de mettre tout le flux principal dans un état d'erreur au premier champ invalide.",
          "<code>std::stringstream</code> est un flux en mémoire : il réutilise les mêmes réflexes que <code>ifstream</code>.",
          "Séparer lecture, parsing et validation métier rend le diagnostic beaucoup plus clair."
        ]),
        callout("success", "Très bon réflexe projet", "Quand le format d'entrée n'est pas trivial, lis une ligne complète puis parse-la localement. Tu gagneras en robustesse et en clarté de diagnostic.")
      ),
      lesson(
        "try, throw, catch et propagation",
        paragraphs(
          "Les exceptions existent pour séparer le chemin normal du traitement d'erreur lorsqu'on ne veut pas continuer silencieusement. Une division par zéro, une ressource indispensable absente ou un format impossible à interpréter sont des exemples de ruptures du flot normal.",
          "Quand une exception n'est pas capturée localement, elle remonte la pile d'appels jusqu'à trouver un bloc <code>catch</code>. Capturer par référence constante évite les copies inutiles et préserve le polymorphisme des hiérarchies d'exceptions."
        ),
        code(
          "cpp",
          `
int division(int a, int b) {
    if (b == 0) {
        throw std::runtime_error("division par zero");
    }
    return a / b;
}

try {
    std::cout << division(10, 0) << '\\n';
}
catch (const std::runtime_error& e) {
    std::cerr << e.what() << '\\n';
}
          `,
          "Try / throw / catch"
        ),
        code(
          "cpp",
          `
catch (const std::exception& e) {
    journaliser(e.what());
    throw;
}
          `,
          "Propagation vers un niveau supérieur"
        ),
        callout("warn", "Ordre des catches", "Les blocs <code>catch</code> sont testés dans l'ordre. Le plus spécifique doit venir avant le plus général, et <code>catch(...)</code> en dernier.")
      ),
      lesson(
        "Assertions, exceptions métier et std::exception",
        paragraphs(
          "Une assertion protège surtout une hypothèse interne du développeur. Une exception représente une erreur d'exécution que l'appelant doit pouvoir comprendre, propager ou traduire. Un simple message console, lui, ne suffit pas à structurer une API robuste.",
          "La bonne pratique moderne consiste à lancer des objets d'exception, idéalement dérivés de <code>std::exception</code>, afin de fournir un message via <code>what()</code>. Le mot-clé <code>noexcept</code> sert, lui, à signaler qu'une fonction ne doit pas lever d'exception."
        ),
        table(
          ["Mécanisme", "Usage principal"],
          [
            ["<code>assert</code>", "Hypothèse interne censée toujours être vraie."],
            ["Exception", "Erreur d'exécution récupérable ou propagable."],
            ["Message console", "Information utilisateur ou diagnostic ponctuel."]
          ]
        ),
        code(
          "cpp",
          `
class MonErreur : public std::exception {
public:
    explicit MonErreur(std::string message) : message_{std::move(message)} {}

    const char* what() const noexcept override {
        return message_.c_str();
    }

private:
    std::string message_;
};
          `,
          "Classe d'exception personnalisée"
        ),
        callout("success", "Niveau de capture", "Attrape une exception au niveau où tu peux vraiment décider quoi faire : corriger, relancer avec plus de contexte, journaliser ou arrêter proprement.")
      ),
      lesson(
        "Texte, binaire et stratégie de lecture adaptée",
        paragraphs(
          "Les fichiers texte et les fichiers binaires ne se lisent pas avec les mêmes attentes. Un fichier texte est destiné à être interprété comme une suite de caractères et de séparateurs. Un fichier binaire transporte des octets dont le sens dépend d'un protocole précis. Ouvrir un flux avec <code>std::ios::binary</code> signifie que l'on veut préserver ces octets sans transformation liée au texte.",
          "Dans la majorité des projets du cours, le texte suffit largement et reste beaucoup plus facile à déboguer. Mais comprendre la différence évite des erreurs de conception, par exemple quand on croit pouvoir 'imprimer' un fichier binaire ou parser un texte libre comme s'il s'agissait d'octets structurés sans protocole clair."
        ),
        code(
          "cpp",
          `
std::ifstream texte{"notes.csv"}; // lecture texte

std::ifstream image{"logo.bin", std::ios::binary};
std::vector<char> buffer(1024);
image.read(buffer.data(), static_cast<std::streamsize>(buffer.size()));
auto lus = image.gcount();
          `,
          "Deux modes d'entree, deux contrats de lecture"
        ),
        table(
          ["Mode", "Usage naturel", "Point de vigilance"],
          [
            ["Texte", "Lignes, mots, nombres, séparateurs lisibles", "Le parsing dépend du format logique choisi."],
            ["Binaire", "Octets bruts, structures sérialisées, images, protocoles", "Il faut connaître précisément la structure attendue des octets."],
            ["<code>std::ios::binary</code>", "Désactive les transformations de texte", "N'ajoute pas de 'structure' par lui-même : il ne fait que préserver les octets."]
          ]
        ),
        callout("info", "Règle simple", "Choisis le texte quand la donnée doit être lisible, diffable et facile à diagnostiquer. Choisis le binaire quand un protocole d'octets précis le justifie réellement.")
      ),
      lesson(
        "Arguments de ligne de commande : argc et argv",
        paragraphs(
          "Tout programme C++ peut recevoir des arguments directement depuis le terminal. La signature étendue de <code>main</code> expose ces arguments via deux paramètres : <code>argc</code> (le nombre d'arguments, toujours au moins 1 car <code>argv[0]</code> est le nom du programme) et <code>argv</code> (le tableau de chaînes de caractères correspondant).",
          "C'est le mécanisme utilisé dans les TPs pour passer le nom d'un fichier en paramètre au lieu de le coder en dur dans le programme. Il suffit de vérifier <code>argc &gt;= 2</code> avant d'accéder à <code>argv[1]</code>."
        ),
        code(
          "cpp",
          `
// Lancement : ./mon_programme Tournoi.txt
int main(int argc, char* argv[]) {
    if (argc < 2) {
        std::cerr << "Usage : " << argv[0] << " <fichier>\\n";
        return 1;
    }

    std::string nomFichier{argv[1]};  // "Tournoi.txt"
    std::ifstream fichier{nomFichier};

    if (!fichier) {
        std::cerr << "Impossible d'ouvrir " << nomFichier << "\\n";
        return 1;
    }

    // lecture...
}
          `,
          "argc / argv : passer un fichier en argument"
        ),
        table(
          ["Variable", "Type", "Contenu"],
          [
            ["<code>argc</code>", "<code>int</code>", "Nombre d'arguments (≥ 1)."],
            ["<code>argv[0]</code>", "<code>char*</code>", "Nom ou chemin du programme."],
            ["<code>argv[1]</code>", "<code>char*</code>", "Premier argument fourni par l'utilisateur."],
            ["<code>argv[argc]</code>", "<code>nullptr</code>", "Sentinelle de fin du tableau."]
          ]
        ),
        callout("warn", "Toujours vérifier argc", "Accéder à <code>argv[1]</code> sans vérifier que <code>argc &gt;= 2</code> est un comportement indéfini si l'utilisateur n'a pas fourni d'argument.")
      ),
      lesson(
        "Formatage de la sortie avec <iomanip>",
        paragraphs(
          "Par défaut, <code>std::cout</code> affiche les données sans alignement particulier. Pour produire des tableaux alignés en colonnes, on utilise les manipulateurs de la bibliothèque <code>&lt;iomanip&gt;</code>. Ces manipulateurs modifient l'état du flux et restent actifs jusqu'au prochain changement.",
          "<code>std::setw(n)</code> réserve une largeur de <em>n</em> caractères pour le prochain champ. <code>std::left</code> et <code>std::right</code> contrôlent l'alignement. <code>std::setfill(c)</code> remplace les espaces vides par le caractère <em>c</em>. <code>std::setprecision(n)</code> limite le nombre de chiffres significatifs pour les réels."
        ),
        code(
          "cpp",
          `
#include <iomanip>

// En-tête aligné
std::cout << std::left
          << std::setw(15) << "Équipe"
          << std::setw(8)  << "Points"
          << std::setw(8)  << "Buts"
          << "\\n";
std::cout << std::string(31, '-') << "\\n";

// Ligne de données
std::cout << std::left
          << std::setw(15) << "France"
          << std::right
          << std::setw(8)  << 9
          << std::setw(8)  << 6
          << "\\n";

// Réels
double pi = 3.14159265;
std::cout << std::fixed << std::setprecision(2) << pi << "\\n"; // 3.14
          `,
          "Alignement en colonnes avec iomanip"
        ),
        table(
          ["Manipulateur", "Effet"],
          [
            ["<code>std::setw(n)</code>", "Largeur du prochain champ uniquement (non persistant)."],
            ["<code>std::left</code> / <code>std::right</code>", "Alignement du texte dans la largeur réservée (persistant)."],
            ["<code>std::setfill(c)</code>", "Caractère de remplissage (persistant, défaut : espace)."],
            ["<code>std::setprecision(n)</code>", "Nombre de chiffres significatifs ou décimaux (persistant)."],
            ["<code>std::fixed</code>", "Notation décimale fixe pour les réels (persistant)."]
          ]
        ),
        callout("warn", "setw n'est pas persistant", "<code>std::setw</code> s'applique uniquement au prochain champ affiché et se remet à zéro ensuite. Tous les autres manipulateurs de ce tableau persistent jusqu'à modification.")
      )
    ].join(""),
    checklist: [
      "Je distingue <code>std::cout</code>, <code>std::cin</code> et <code>std::cerr</code>.",
      "Je connais les rôles de <code>ifstream</code>, <code>ofstream</code> et <code>fstream</code>.",
      "Je vérifie l'ouverture d'un fichier et je choisis le bon mode.",
      "Je sais utiliser <code>std::getline</code> et l'idiome <code>while (flux >> valeur)</code>.",
      "Je peux justifier une stratégie de parsing ligne par ligne avec <code>std::stringstream</code>.",
      "Je distingue assertion et exception.",
      "Je ne traite pas les exceptions comme du contrôle de flux normal.",
      "Je capture une exception par référence constante.",
      "Je sépare parsing et logique métier.",
      "Je peux expliquer la différence entre lecture texte et lecture binaire.",
      "Je place mes <code>catch</code> au bon niveau de responsabilité.",
      "Je sais déclarer <code>main(int argc, char* argv[])</code> et accéder aux arguments en vérifiant <code>argc</code>.",
      "Je connais les manipulateurs de base de <code>&lt;iomanip&gt;</code> pour aligner des sorties en colonnes."
    ],
    quiz: [
      {
        question: "Quel cas correspond le mieux à une assertion ?",
        options: [
          "Un fichier utilisateur absent",
          "Une hypothèse interne supposée toujours vraie dans le code",
          "Une saisie invalide fréquente"
        ],
        answer: 1,
        explanation: "L'assertion documente une hypothèse de programmation, pas un aléa normal d'exécution."
      },
      {
        question: "Que faut-il faire juste après avoir construit un <code>std::ifstream</code> ?",
        options: [
          "Le convertir en pointeur",
          "Vérifier que l'ouverture a réussi",
          "Appeler explicitement son destructeur"
        ],
        answer: 1,
        explanation: "Un flux invalide n'indique pas toujours une exception ; il faut contrôler son état."
      },
      {
        question: "Pourquoi capture-t-on en général les exceptions par référence constante ?",
        options: [
          "Pour empêcher toute propagation future",
          "Pour éviter une copie inutile et conserver le polymorphisme",
          "Parce que catch interdit les objets par valeur"
        ],
        answer: 1,
        explanation: "La capture par référence constante évite les copies et préserve le type dynamique de l'exception."
      },
      {
        question: "Quel idiome est le plus sûr pour lire une suite de valeurs formatées ?",
        options: [
          "<code>while (!ifs.eof())</code>",
          "<code>while (ifs >> valeur)</code>",
          "<code>while (true)</code>"
        ],
        answer: 1,
        explanation: "La condition <code>while (ifs >> valeur)</code> s'arrête exactement quand la lecture échoue."
      },
      {
        question: "Pourquoi lire une ligne complète puis la parser avec <code>std::stringstream</code> est-il souvent plus robuste ?",
        options: [
          "Parce qu'on peut isoler les erreurs de format ligne par ligne sans casser tout le flux principal",
          "Parce que <code>stringstream</code> remplace toutes les exceptions",
          "Parce que <code>getline</code> est interdit sur les fichiers"
        ],
        answer: 0,
        explanation: "Cette séparation rend le diagnostic plus local et évite qu'un champ invalide mette immédiatement hors service toute la lecture globale du fichier."
      },
      {
        question: "Que contient <code>argv[0]</code> ?",
        options: [
          "Le premier argument passé par l'utilisateur",
          "Le nom ou chemin du programme lui-même",
          "Toujours la valeur <code>nullptr</code>"
        ],
        answer: 1,
        explanation: "argv[0] est le nom du programme ; les arguments utilisateur commencent à argv[1]."
      },
      {
        question: "Pourquoi ouvrir un flux avec <code>std::ios::binary</code> ?",
        options: [
          "Pour préserver les octets sans traitement lié au texte",
          "Pour convertir automatiquement un texte en JSON",
          "Pour désactiver toute vérification d'erreur"
        ],
        answer: 0,
        explanation: "Le mode binaire signifie qu'on veut lire ou écrire des octets bruts tels quels. Il ne définit pas de format logique à lui seul."
      },
      {
        question: "Lequel de ces manipulateurs <code>&lt;iomanip&gt;</code> n'est PAS persistant ?",
        options: [
          "<code>std::left</code>",
          "<code>std::setw(10)</code>",
          "<code>std::setprecision(3)</code>"
        ],
        answer: 1,
        explanation: "std::setw s'applique uniquement au prochain champ affiché, puis se réinitialise. Les autres manipulateurs persistent."
      }
    ],
    exercises: [
      {
        title: "Classement en colonnes",
        difficulty: "Facile",
        time: "20 min",
        prompt: "Reçois un nom de fichier via <code>argv[1]</code>, lis des lignes \"equipe;points;buts\" et affiche un tableau aligné avec <code>&lt;iomanip&gt;</code>.",
        deliverables: [
          "vérification de argc avant lecture",
          "ouverture robuste du fichier",
          "affichage formaté en colonnes alignées"
        ]
      },
      {
        title: "Chargeur de notes",
        difficulty: "Intermédiaire",
        time: "25 min",
        prompt: "Lis un fichier de notes, détecte les lignes invalides, distingue erreur d'ouverture et erreur de format, puis construis un résumé statistique clair.",
        deliverables: [
          "ouverture robuste du fichier",
          "gestion d'une ligne invalide",
          "résumé final"
        ]
      },
      {
        title: "Parsing local avec stringstream",
        difficulty: "Intermédiaire",
        time: "25 min",
        prompt: "Lis un fichier dont chaque ligne suit le format <code>nom;age;note</code>. Parse chaque ligne avec <code>std::stringstream</code>, rejette les lignes mal formées, puis sépare clairement lecture brute, parsing et validation métier.",
        deliverables: [
          "la lecture des lignes avec <code>std::getline</code>",
          "le parsing local avec <code>std::stringstream</code>",
          "un rapport distinguant lignes valides et lignes rejetées"
        ]
      },
      {
        title: "API qui sait échouer proprement",
        difficulty: "Avancé",
        time: "30 min",
        prompt: "Conçois une petite API dont certaines opérations lèvent une exception métier, puis décide à quel niveau l'attraper dans le programme principal.",
        deliverables: [
          "l'exception levée",
          "le niveau de capture choisi",
          "la justification architecturale"
        ]
      }
    ],
    keywords: ["exception", "assert", "ifstream", "ofstream", "runtime_error", "parsing", "getline", "stringstream", "cerr", "seekg", "tellg", "binary", "noexcept", "std::exception", "argc", "argv", "iomanip", "setw", "setfill", "setprecision"]
  })),
  deepDives: [
    {
      focus: "Les flux donnent une grammaire commune à l'entrée-sortie en C++. Comprendre cout, cin, cerr et la hiérarchie des streams aide à voir que la console et les fichiers ne sont pas deux mondes séparés, mais deux usages d'une même abstraction.",
      retenir: [
        "Les opérateurs << et >> expriment une circulation de données à travers un flux.",
        "cerr est destiné au diagnostic immédiat et se distingue de la sortie standard."
      ],
      pitfalls: [
        "Voir les flux comme une simple 'syntaxe à apprendre' sans comprendre le modèle sous-jacent.",
        "Mélanger affichage normal et messages d'erreur sans discipline."
      ],
      method: [
        "Associe chaque flux standard à son rôle concret.",
        "Observe le sens des opérateurs << et >> sur la console.",
        "Réutilise ensuite la même logique mentale pour les fichiers."
      ],
      check: "Peux-tu expliquer pourquoi la même écriture d'opérateurs fonctionne pour la console et pour les fichiers ?"
    },
    {
      focus: "Lire ou écrire un fichier proprement demande de séparer ressource, mode d'ouverture et traitement. Plus cette séquence est nette, plus il devient simple de savoir si l'échec vient du système, du format ou du métier.",
      retenir: [
        "ifstream, ofstream et fstream représentent le fichier logique côté programme.",
        "Le mode d'ouverture change réellement le comportement, notamment pour l'écriture et l'append."
      ],
      pitfalls: [
        "Ouvrir en sortie sans réaliser qu'ios::trunc peut vider le fichier existant.",
        "Enchaîner traitement et parsing sans valider l'ouverture d'abord."
      ],
      method: [
        "Ouvre la ressource avec le mode minimal nécessaire.",
        "Teste immédiatement l'état du flux.",
        "Sépare ensuite parsing brut et exploitation métier."
      ],
      check: "Si un fichier a été vidé sans le vouloir, irais-tu d'abord vérifier le mode d'ouverture utilisé ?"
    },
    {
      focus: "L'état d'un flux et sa position sont des outils de robustesse. Savoir lire fail(), eof() ou repositionner un curseur évite des diagnostics flous et rend le parsing plus fiable, surtout quand le format est imparfait ou qu'une reprise de lecture est nécessaire.",
      retenir: [
        "while (flux >> valeur) est l'idiome sûr pour la lecture formatée.",
        "tellg/seekg et tellp/seekp servent à raisonner explicitement sur la position dans le fichier."
      ],
      pitfalls: [
        "Utiliser while (!flux.eof()) et traiter une lecture ratée de trop.",
        "Ignorer si l'échec vient de la fin de fichier ou d'un mauvais format."
      ],
      method: [
        "Choisis un idiome de lecture qui repose sur l'état réel de l'opération.",
        "Après un échec, distingue fin de flux et erreur de format.",
        "Réinitialise et repositionne seulement si cela correspond à une vraie stratégie de reprise."
      ],
      check: "Quand une lecture s'arrête, sais-tu vérifier si le flux a atteint la fin ou s'il a rencontré une donnée invalide ?"
    },
    {
      focus: "Le parsing ligne par ligne avec stringstream est souvent la meilleure transition entre un fichier brut et les objets métier. Il permet de localiser une erreur à une ligne donnée, d'enregistrer un diagnostic utile et de continuer le traitement si le scénario l'autorise.",
      retenir: [
        "Lire la ligne complète puis parser localement isole les erreurs de format.",
        "Le parsing brut ne doit pas être confondu avec la validation métier des valeurs obtenues."
      ],
      pitfalls: [
        "Mélanger directement lecture fichier, parsing et règles métier dans une seule boucle illisible.",
        "Arrêter tout le traitement au premier champ invalide alors qu'un diagnostic ligne par ligne serait plus utile."
      ],
      method: [
        "Lis d'abord la ligne brute avec getline.",
        "Parse-la localement avec stringstream ou un séparateur contrôlé.",
        "Applique ensuite la validation métier et décide si la ligne doit être acceptée, rejetée ou journalisée."
      ],
      check: "Si une seule ligne d'un fichier est invalide, peux-tu expliquer comment traiter ce cas sans perdre tout le contexte du fichier ?"
    },
    {
      focus: "Les exceptions servent à signaler une rupture du flot normal lorsqu'un traitement local n'est pas raisonnable. Leur vraie valeur apparaît quand on les utilise avec parcimonie, capture précise et propagation explicite vers le niveau qui peut réellement décider quoi faire.",
      retenir: [
        "Une exception n'est pas un substitut général au contrôle de flux ordinaire.",
        "La propagation remonte la pile jusqu'au niveau de responsabilité pertinent."
      ],
      pitfalls: [
        "Attraper trop tôt et masquer la cause réelle.",
        "Lancer des exceptions vagues sans contexte ni message utile."
      ],
      method: [
        "Décide d'abord si l'appelant local peut traiter raisonnablement l'erreur.",
        "Si non, lance une exception claire et capture-la plus haut.",
        "Respecte l'ordre du plus spécifique au plus général dans les catch."
      ],
      check: "Si une fonction ne peut pas corriger localement une erreur, que gagne-t-on à laisser l'exception remonter ?"
    },
    {
      focus: "Assertions, exceptions métier et std::exception forment trois niveaux complémentaires de diagnostic. Le but n'est pas seulement d'attraper une erreur, mais de transmettre assez de contexte pour permettre à l'appelant ou au développeur de comprendre ce qui s'est réellement passé.",
      retenir: [
        "assert protège surtout des incohérences internes supposées impossibles.",
        "Dériver de std::exception offre un contrat standard via what()."
      ],
      pitfalls: [
        "Utiliser assert pour gérer une erreur utilisateur normale.",
        "Créer une exception personnalisée sans message exploitable ni contexte métier."
      ],
      method: [
        "Réserve assert aux hypothèses internes du programme.",
        "Choisis une exception standard ou personnalisée selon le besoin d'expressivité.",
        "Ajoute du contexte au bon niveau sans déformer la cause initiale."
      ],
      check: "Dans ton code, saurais-tu distinguer ce qui relève d'un bug interne, d'un aléa système et d'une erreur métier signalable ?"
    },
    {
      focus: "argc/argv est le pont entre le programme et son contexte d'exécution. C'est souvent la première interface avec l'utilisateur : bien vérifier argc avant d'accéder à argv[1] est une règle absolue.",
      retenir: [
        "argc vaut toujours au moins 1 (argv[0] = nom du programme).",
        "argv[1]...argv[argc-1] sont les arguments utilisateur ; argv[argc] vaut nullptr."
      ],
      pitfalls: [
        "Accéder à argv[1] sans vérifier argc >= 2 — comportement indéfini si l'argument est absent.",
        "Oublier que argv contient des char* et pas des std::string directement."
      ],
      method: [
        "Commence par tester argc avant tout accès à argv.",
        "Convertis argv[i] en std::string dès que tu en as besoin pour traitement.",
        "Affiche un usage clair vers std::cerr si les arguments sont invalides."
      ],
      check: "Que se passe-t-il si l'utilisateur oublie de passer le nom de fichier et que ton code accède à argv[1] sans vérification ?"
    },
    {
      focus: "Texte et binaire correspondent à deux contrats d'I/O différents. Le texte favorise la lisibilité humaine et le diagnostic. Le binaire préserve les octets exacts mais exige un protocole de lecture bien défini pour rester fiable et portable.",
      retenir: [
        "Le mode binaire ne crée pas de structure logique ; il préserve simplement les octets.",
        "Le texte est souvent préférable tant qu'on veut lire, déboguer et versionner facilement les données."
      ],
      pitfalls: [
        "Utiliser le binaire par réflexe alors que le texte aurait suffi et facilité le diagnostic.",
        "Croire qu'un flux binaire garantit à lui seul la portabilité d'une structure mémoire brute."
      ],
      method: [
        "Demande d'abord si la donnée doit être lisible et éditable par un humain.",
        "Si oui, pars sur un format texte explicite.",
        "Si non, définis très clairement le protocole binaire attendu avant d'écrire la première lecture."
      ],
      check: "Pour une donnée de TP simple, saurais-tu justifier pourquoi un format texte lisible est souvent préférable à une sérialisation binaire improvisée ?"
    },
    {
      focus: "iomanip transforme cout en moteur de rendu simple. Le piège à retenir : setw ne s'applique qu'au prochain champ, les autres manipulateurs sont persistants — oublier cette asymétrie produit des alignements décalés.",
      retenir: [
        "setw est à usage unique ; left/right/setprecision/setfill persistent.",
        "fixed + setprecision(2) est la combinaison standard pour afficher des réels formatés."
      ],
      pitfalls: [
        "Réutiliser setw sans le rappeler pour chaque champ.",
        "Oublier de revenir à right après avoir utilisé left sur une colonne de texte."
      ],
      method: [
        "Dessine la structure de ta sortie avant de coder (largeurs, alignements).",
        "Applique setw juste avant chaque valeur à aligner.",
        "Teste avec des valeurs de longueurs différentes pour détecter les débordements."
      ],
      check: "Si tu affiches 5 colonnes, combien de fois dois-tu appeler setw ?"
    }
  ]
});
})(window);
