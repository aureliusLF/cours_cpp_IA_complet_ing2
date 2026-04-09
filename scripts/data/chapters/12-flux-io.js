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
  chapter: withChapterTheme("flux-io", () => ({
    id: "flux-io",
    shortTitle: "Flux et I/O",
    title: "Flux et entrées/sorties en C++",
    level: "Avancé",
    duration: "1 h 45",
    track: "SE5/SE6",
    summary:
      "Les flux sont une abstraction unifiée qui connecte la console, les fichiers et la mémoire sous la même grammaire d'opérateurs. Maîtriser les modes d'ouverture, l'état d'un flux, le parsing ligne par ligne, la construction de sorties avec ostringstream et les subtilités de synchronisation donne les outils pour lire des données imparfaites et produire des sorties professionnelles.",
    goals: [
      "distinguer les trois flux standards et choisir le bon mode d'ouverture pour chaque opération fichier",
      "lire et écrire des fichiers texte ou binaires de manière robuste, en vérifiant systématiquement l'état du flux",
      "parser proprement des lignes semi-structurées avec <code>std::stringstream</code>, construire des sorties composées avec <code>std::ostringstream</code> et formater des tableaux avec <code>&lt;iomanip&gt;</code>"
    ],
    highlights: ["cout", "cin", "ifstream", "ofstream", "getline", "stringstream", "ostringstream", "iomanip", "argc", "argv", "binary"],
    body: [
      lesson(
        "Architecture des flux en C++",
        paragraphs(
          "En C++, les entrées-sorties passent par des flux. Un flux est une abstraction d'un canal de communication : il peut représenter la console, un fichier, ou même de la mémoire vive. Les mêmes opérateurs <code>&lt;&lt;</code> et <code>&gt;&gt;</code> servent à écrire ou lire sur tous ces supports, ce qui rend la syntaxe cohérente quelle que soit la source.",
          "Les trois flux standards sont <code>std::cout</code> pour la sortie normale, <code>std::cin</code> pour l'entrée et <code>std::cerr</code> pour les messages d'erreur immédiats. Ils sont tous déclarés dans <code>&lt;iostream&gt;</code> et partagent la même hiérarchie de classes héritant de <code>std::ios_base</code>."
        ),
        table(
          ["Flux", "Rôle", "Remarque"],
          [
            ["<code>std::cout</code>", "Sortie standard", "Souvent bufferisée ; peut être redirigée."],
            ["<code>std::cin</code>", "Entrée standard", "Lecture au clavier ou via redirection de fichier."],
            ["<code>std::cerr</code>", "Sortie d'erreur", "Non bufferisée, affichage immédiat, utile pour le diagnostic."]
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
        callout("info", "Hiérarchie utile", "La bibliothèque <code>&lt;iostream&gt;</code> sert pour la console ; <code>&lt;fstream&gt;</code> prolonge cette logique pour les fichiers. Les opérateurs restent identiques car ils sont définis sur la classe de base commune.")
      ),
      lesson(
        "Fichiers, ouverture et modes",
        paragraphs(
          "Un fichier physique est une suite d'octets sur disque ; le fichier logique est l'objet C++ qui permet de le manipuler. Les classes principales sont <code>std::ifstream</code> pour la lecture, <code>std::ofstream</code> pour l'écriture et <code>std::fstream</code> pour les deux sens.",
          "Les flux fichier sont RAII : ils se ferment automatiquement à la sortie de portée. L'effort du développeur porte sur le choix du mode d'ouverture correct et la validation immédiate de l'état du flux après construction."
        ),
        table(
          ["Mode", "Effet principal"],
          [
            ["<code>std::ios::in</code>", "Ouverture en lecture."],
            ["<code>std::ios::out</code>", "Ouverture en écriture (crée ou tronque)."],
            ["<code>std::ios::app</code>", "Ajout en fin de fichier sans troncature."],
            ["<code>std::ios::trunc</code>", "Vide le fichier à l'ouverture (implicite avec <code>out</code>)."],
            ["<code>std::ios::binary</code>", "Mode binaire : pas de transformation des octets."],
            ["<code>std::ios::ate</code>", "Positionne le curseur en fin de fichier à l'ouverture."]
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
    return 1;
}

std::string ligne;
while (std::getline(input, ligne)) {
    std::cout << ligne << '\\n';
}
          `,
          "Écriture en append puis lecture texte"
        ),
        bullets([
          "Tester le flux immédiatement après construction.",
          "Utiliser <code>std::ios::app</code> pour ne jamais tronquer involontairement.",
          "Séparer la logique d'ouverture de la logique de parsing.",
          "Les flux se ferment seuls à la fin du bloc — pas besoin d'appeler <code>close()</code> explicitement."
        ])
      ),
      lesson(
        "État d'un flux, position et lecture robuste",
        paragraphs(
          "Un flux peut être dans quatre états : valide (<code>good()</code>), en fin de fichier (<code>eof()</code>), en erreur de format (<code>fail()</code>) ou dans un état grave (<code>bad()</code>). Diagnostiquer correctement l'état permet de savoir si l'arrêt de lecture est normal ou signe d'un problème.",
          "L'idiome robuste pour la lecture formatée est <code>while (flux &gt;&gt; valeur)</code>. La condition évalue l'état du flux après chaque tentative de lecture et s'arrête exactement quand celle-ci échoue. Éviter <code>while (!flux.eof())</code>, qui produit souvent une itération de trop après la dernière valeur valide."
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
// Repositionner le curseur pour une deuxième passe
input.clear();                          // réinitialise les bits d'état
input.seekg(0, std::ios::beg);          // retourne au début

// Mémoriser et restaurer une position
auto pos = input.tellg();               // sauvegarde la position actuelle
// ... lecture ...
input.seekg(pos);                       // revient à la position sauvegardée
          `,
          "Repositionner et mémoriser un curseur"
        ),
        table(
          ["Méthode", "Ce qu'elle indique"],
          [
            ["<code>good()</code>", "Le flux est dans un état sain, aucun bit d'erreur levé."],
            ["<code>eof()</code>", "La fin du fichier a été atteinte."],
            ["<code>fail()</code>", "Une opération de lecture ou d'écriture a échoué (format invalide)."],
            ["<code>bad()</code>", "Erreur grave au niveau de la ressource sous-jacente."],
            ["<code>clear()</code>", "Réinitialise tous les bits d'erreur pour permettre de nouvelles opérations."]
          ]
        ),
        callout("warn", "Piège classique", "<code>while (!flux.eof())</code> semble intuitive mais produit souvent un traitement supplémentaire après un échec de lecture. Toujours préférer <code>while (flux >> valeur)</code>.")
      ),
      lesson(
        "Parsing robuste ligne par ligne avec <code>std::stringstream</code>",
        paragraphs(
          "Dans beaucoup de projets, la bonne stratégie n'est pas de lire directement tout le fichier dans des variables métier avec <code>operator&gt;&gt;</code>. Il est plus robuste de lire d'abord une ligne complète avec <code>std::getline</code>, puis de la parser localement avec un <code>std::stringstream</code>. On isole ainsi les erreurs de format ligne par ligne sans mettre tout le flux principal dans un état d'erreur.",
          "Cette approche est particulièrement utile pour les formats semi-structurés du type <code>nom;note;groupe</code>. Elle permet de distinguer clairement trois niveaux : lecture brute du fichier, parsing de la ligne, validation métier des champs obtenus."
        ),
        code(
          "cpp",
          `
std::ifstream input{"etudiants.txt"};
std::string ligne;
int numeroLigne = 0;

while (std::getline(input, ligne)) {
    ++numeroLigne;
    std::stringstream ss{ligne};
    std::string nom, noteTexte, groupe;

    if (!std::getline(ss, nom, ';') ||
        !std::getline(ss, noteTexte, ';') ||
        !std::getline(ss, groupe, ';')) {
        std::cerr << "Ligne " << numeroLigne << " invalide : " << ligne << '\\n';
        continue;
    }

    double note = std::stod(noteTexte); // validation metier ensuite
    // ...
}
          `,
          "Lire la ligne, puis parser localement"
        ),
        bullets([
          "Le parsing local d'une ligne évite de mettre tout le flux principal dans un état d'erreur au premier champ invalide.",
          "<code>std::stringstream</code> est un flux en mémoire : il réutilise les mêmes réflexes que <code>ifstream</code>.",
          "Incrémenter un compteur de ligne permet de donner un diagnostic précis à l'utilisateur.",
          "Séparer lecture, parsing et validation métier rend le diagnostic beaucoup plus clair."
        ]),
        callout("success", "Très bon réflexe projet", "Quand le format d'entrée n'est pas trivial, lis une ligne complète puis parse-la localement. Tu gagneras en robustesse et en clarté de diagnostic.")
      ),
      lesson(
        "Construire des chaînes avec <code>ostringstream</code>",
        paragraphs(
          "Les flux en mémoire (<code>&lt;sstream&gt;</code>) existent en trois variantes selon la direction des données : <code>std::istringstream</code> pour lire depuis une chaîne, <code>std::ostringstream</code> pour écrire et construire une chaîne, et <code>std::stringstream</code> pour les deux. Choisir la bonne variante rend l'intention du code immédiatement lisible.",
          "<code>std::ostringstream</code> est particulièrement utile pour construire des messages d'erreur composés, des en-têtes de rapport ou des lignes CSV avant de les écrire dans un fichier. On accumule les données avec <code>&lt;&lt;</code> puis on extrait le résultat final avec <code>.str()</code>. Pour réinitialiser un <code>ostringstream</code>, il faut appeler <code>.str(\"\")</code> puis <code>.clear()</code>."
        ),
        table(
          ["Classe", "Direction", "Usage typique"],
          [
            ["<code>std::istringstream</code>", "Lecture", "Parser un champ ou une ligne déjà en mémoire."],
            ["<code>std::ostringstream</code>", "Écriture", "Construire un message ou un rapport avant de le persister."],
            ["<code>std::stringstream</code>", "Lecture + écriture", "Conversion de types, traitement bidirectionnel."
            ]
          ]
        ),
        code(
          "cpp",
          `
#include <sstream>

// Construire un rapport ligne par ligne
std::ostringstream rapport;
rapport << "=== Résultats du tournoi ===\\n";

for (const auto& equipe : classement) {
    rapport << std::left << std::setw(20) << equipe.nom
            << std::right << std::setw(5) << equipe.points << " pts\\n";
}

rapport << "Total équipes : " << classement.size() << '\\n';

// Extraire et écrire d'un seul coup
std::ofstream sortie{"rapport.txt"};
sortie << rapport.str();
          `,
          "Construire un rapport avec ostringstream"
        ),
        code(
          "cpp",
          `
// Réutiliser un ostringstream dans une boucle
std::ostringstream oss;
for (int i = 0; i < 3; ++i) {
    oss.str("");   // vide le contenu
    oss.clear();   // réinitialise les bits d'état
    oss << "Item " << i;
    traiter(oss.str());
}
          `,
          "Réinitialiser un ostringstream"
        ),
        callout("info", "Avantage sur la concaténation", "Construire une chaîne avec <code>ostringstream</code> évite les copies intermédiaires de <code>std::string</code> lors de concatenations successives avec <code>+</code>. C'est aussi plus lisible pour les sorties formatées.")
      ),
      lesson(
        "Texte, binaire et stratégie de lecture adaptée",
        paragraphs(
          "Les fichiers texte et les fichiers binaires ne se lisent pas avec les mêmes attentes. Un fichier texte est interprété comme une suite de caractères et de séparateurs ; les fins de ligne peuvent être transformées selon la plateforme. Un fichier binaire transporte des octets dont le sens dépend d'un protocole précis. Ouvrir un flux avec <code>std::ios::binary</code> préserve les octets tels quels sans aucune transformation.",
          "Dans la majorité des projets du cours, le texte suffit et reste beaucoup plus facile à déboguer et à versionner. Comprendre la différence évite des erreurs de conception lorsqu'on lit des images, des structures sérialisées ou des protocoles réseau."
        ),
        code(
          "cpp",
          `
// Lecture texte : format CSV
std::ifstream texte{"notes.csv"};

// Lecture binaire : octets bruts
std::ifstream image{"logo.bin", std::ios::binary};
std::vector<char> buffer(1024);
image.read(buffer.data(), static_cast<std::streamsize>(buffer.size()));
auto lus = image.gcount(); // nombre d'octets effectivement lus
          `,
          "Deux modes, deux contrats de lecture"
        ),
        table(
          ["Mode", "Usage naturel", "Point de vigilance"],
          [
            ["Texte", "Lignes, mots, nombres, séparateurs lisibles", "Les fins de ligne (\\r\\n vs \\n) sont normalisées automatiquement."],
            ["Binaire", "Octets bruts, structures sérialisées, images, protocoles", "Il faut connaître précisément la structure attendue des octets."],
            ["<code>std::ios::binary</code>", "Désactive les transformations de texte", "N'ajoute pas de structure logique : il ne fait que préserver les octets."]
          ]
        ),
        callout("info", "Règle simple", "Choisis le texte quand la donnée doit être lisible, diffable et facile à diagnostiquer. Choisis le binaire quand un protocole d'octets précis le justifie réellement.")
      ),
      lesson(
        "Arguments de ligne de commande : argc et argv",
        paragraphs(
          "Tout programme C++ peut recevoir des arguments directement depuis le terminal. La signature étendue de <code>main</code> expose ces arguments via deux paramètres : <code>argc</code> (le nombre d'arguments, toujours au moins 1 car <code>argv[0]</code> est le nom du programme) et <code>argv</code> (le tableau de chaînes de caractères correspondant).",
          "C'est le mécanisme utilisé dans les TPs pour passer le nom d'un fichier en paramètre au lieu de le coder en dur. Il suffit de vérifier <code>argc &gt;= 2</code> avant d'accéder à <code>argv[1]</code>, puis de convertir <code>argv[1]</code> en <code>std::string</code> pour le manipuler facilement."
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
        "Formatage de la sortie avec <code>&lt;iomanip&gt;</code>",
        paragraphs(
          "Par défaut, <code>std::cout</code> affiche les données sans alignement particulier. Pour produire des tableaux alignés en colonnes, on utilise les manipulateurs de la bibliothèque <code>&lt;iomanip&gt;</code>. Ces manipulateurs modifient l'état du flux : certains sont persistants (restent actifs jusqu'au prochain changement), d'autres s'appliquent une seule fois.",
          "<code>std::setw(n)</code> réserve une largeur de <em>n</em> caractères pour le prochain champ uniquement (non persistant). <code>std::left</code> et <code>std::right</code> contrôlent l'alignement. <code>std::setfill(c)</code> remplace les espaces vides par le caractère <em>c</em>. <code>std::setprecision(n)</code> combiné avec <code>std::fixed</code> formate les réels avec un nombre précis de décimales."
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
          ["Manipulateur", "Persistant ?", "Effet"],
          [
            ["<code>std::setw(n)</code>", "Non", "Largeur du prochain champ uniquement."],
            ["<code>std::left</code> / <code>std::right</code>", "Oui", "Alignement du texte dans la largeur réservée."],
            ["<code>std::setfill(c)</code>", "Oui", "Caractère de remplissage (défaut : espace)."],
            ["<code>std::setprecision(n)</code>", "Oui", "Nombre de chiffres significatifs ou décimaux."],
            ["<code>std::fixed</code>", "Oui", "Notation décimale fixe pour les réels."]
          ]
        ),
        callout("warn", "setw n'est pas persistant", "<code>std::setw</code> s'applique uniquement au prochain champ affiché et se remet à zéro ensuite. Il faut le répéter avant chaque valeur à aligner.")
      ),
      lesson(
        "Synchronisation et performance des flux",
        paragraphs(
          "Par défaut, les flux C++ (<code>cout</code>, <code>cin</code>) sont synchronisés avec les fonctions C (<code>printf</code>, <code>scanf</code>). Cette synchronisation garantit un affichage cohérent si on mélange les deux, mais elle a un coût. Dans les programmes traitant de gros volumes de données, quelques options permettent de gagner un facteur de vitesse significatif.",
          "L'autre point de vigilance est la différence entre <code>std::endl</code> et <code>'\\n'</code>. Ces deux instructions terminent une ligne, mais <code>std::endl</code> vide aussi le tampon (<em>flush</em>) à chaque appel. Dans une boucle qui affiche des milliers de lignes, utiliser <code>std::endl</code> peut multiplier le temps d'exécution par un facteur important."
        ),
        code(
          "cpp",
          `
// Au début de main, avant tout I/O — irréversible dans la session
std::ios::sync_with_stdio(false);  // découple cout/cin de printf/scanf
std::cin.tie(nullptr);             // évite un flush automatique de cout à chaque cin

// Préférer '\n' à std::endl dans une boucle
for (int i = 0; i < 100'000; ++i) {
    std::cout << i << '\\n';       // rapide : pas de flush
}

// Vider manuellement quand c'est nécessaire
std::cout << "Appuie sur Entrée..." << std::flush; // flush explicite
std::cin.get();
          `,
          "Optimisations de flux et flush explicite"
        ),
        table(
          ["Option", "Effet", "Quand l'utiliser"],
          [
            ["<code>sync_with_stdio(false)</code>", "Découple C++ I/O de stdio C", "Quand on n'utilise que cout/cin, jamais printf/scanf."],
            ["<code>cin.tie(nullptr)</code>", "Supprime le flush auto de cout avant chaque cin", "Lecture intensive en boucle."],
            ["<code>std::flush</code>", "Vide le tampon explicitement", "Avant une pause interactive, avant de quitter sur erreur."],
            ["<code>'\\n'</code> vs <code>std::endl</code>", "Sauter une ligne sans flush", "Toujours préférer <code>'\\n'</code> en boucle."]
          ]
        ),
        callout("info", "Dans un TP normal, inutile", "Ces optimisations n'apportent rien sur des fichiers de quelques centaines de lignes. Elles deviennent pertinentes pour des parsers de fichiers volumineux ou les problèmes algorithmiques compétitifs où le débit I/O est le goulot d'étranglement.")
      )
    ].join(""),
    checklist: [
      "Je distingue <code>std::cout</code>, <code>std::cin</code> et <code>std::cerr</code> et je sais quand utiliser chacun.",
      "Je connais les rôles de <code>ifstream</code>, <code>ofstream</code> et <code>fstream</code>.",
      "Je vérifie l'ouverture d'un fichier immédiatement après construction.",
      "Je choisis le mode d'ouverture minimal nécessaire et je comprends l'effet de <code>trunc</code> vs <code>app</code>.",
      "Je sais utiliser <code>std::getline</code> et l'idiome <code>while (flux >> valeur)</code>.",
      "Je comprends la différence entre <code>fail()</code>, <code>eof()</code> et <code>bad()</code>.",
      "Je sais utiliser <code>clear()</code>, <code>seekg()</code> et <code>tellg()</code> pour repositionner un curseur.",
      "Je peux justifier une stratégie de parsing ligne par ligne avec <code>std::stringstream</code>.",
      "Je distingue <code>istringstream</code>, <code>ostringstream</code> et <code>stringstream</code> selon la direction des données.",
      "Je sais construire un message ou rapport avec <code>ostringstream</code> et extraire le résultat avec <code>.str()</code>.",
      "Je peux expliquer la différence entre lecture texte et lecture binaire.",
      "Je déclare <code>main(int argc, char* argv[])</code> et vérifie <code>argc</code> avant d'accéder à <code>argv[1]</code>.",
      "Je connais les manipulateurs de base de <code>&lt;iomanip&gt;</code> et je sais lesquels sont persistants.",
      "Je comprends pourquoi <code>'\\n'</code> est préférable à <code>std::endl</code> dans une boucle d'écriture.",
      "Je sais à quelle condition <code>sync_with_stdio(false)</code> est utile et quand il est dangereux.",
      "Je sépare lecture brute, parsing local et validation métier dans mon code de lecture."
    ],
    quiz: [
      {
        question: "Que faut-il faire juste après avoir construit un <code>std::ifstream</code> ?",
        options: [
          "Le convertir en pointeur",
          "Vérifier que l'ouverture a réussi",
          "Appeler explicitement son destructeur"
        ],
        answer: 1,
        explanation: "Un flux invalide n'indique pas toujours une exception ; il faut contrôler son état avec <code>if (!flux)</code> immédiatement après construction."
      },
      {
        question: "Quel idiome est le plus sûr pour lire une suite de valeurs formatées ?",
        options: [
          "<code>while (!ifs.eof())</code>",
          "<code>while (ifs >> valeur)</code>",
          "<code>while (true)</code>"
        ],
        answer: 1,
        explanation: "La condition <code>while (ifs >> valeur)</code> s'arrête exactement quand la lecture échoue, sans itération supplémentaire."
      },
      {
        question: "Pourquoi lire une ligne complète puis la parser avec <code>std::stringstream</code> est-il souvent plus robuste ?",
        options: [
          "Parce qu'on peut isoler les erreurs de format ligne par ligne sans casser tout le flux principal",
          "Parce que <code>stringstream</code> remplace toutes les exceptions",
          "Parce que <code>getline</code> est interdit sur les fichiers"
        ],
        answer: 0,
        explanation: "Cette séparation rend le diagnostic local et évite qu'un champ invalide mette immédiatement hors service toute la lecture globale du fichier."
      },
      {
        question: "Quelle méthode appelle-t-on sur un <code>std::ostringstream</code> pour en extraire le contenu sous forme de <code>std::string</code> ?",
        options: [
          "<code>.get()</code>",
          "<code>.str()</code>",
          "<code>.data()</code>"
        ],
        answer: 1,
        explanation: "<code>.str()</code> retourne le contenu accumulé sous forme de <code>std::string</code>. <code>.get()</code> lit un seul caractère ; <code>.data()</code> n'est pas directement disponible sur <code>ostringstream</code>."
      },
      {
        question: "Que contient <code>argv[0]</code> ?",
        options: [
          "Le premier argument passé par l'utilisateur",
          "Le nom ou chemin du programme lui-même",
          "Toujours la valeur <code>nullptr</code>"
        ],
        answer: 1,
        explanation: "<code>argv[0]</code> est le nom du programme ; les arguments utilisateur commencent à <code>argv[1]</code>."
      },
      {
        question: "Pourquoi ouvrir un flux avec <code>std::ios::binary</code> ?",
        options: [
          "Pour préserver les octets sans traitement lié au texte",
          "Pour convertir automatiquement un texte en JSON",
          "Pour désactiver toute vérification d'erreur"
        ],
        answer: 0,
        explanation: "Le mode binaire signifie qu'on lit ou écrit des octets bruts tels quels, sans transformation des fins de ligne ni autre interprétation."
      },
      {
        question: "Lequel de ces manipulateurs <code>&lt;iomanip&gt;</code> n'est PAS persistant ?",
        options: [
          "<code>std::left</code>",
          "<code>std::setw(10)</code>",
          "<code>std::setprecision(3)</code>"
        ],
        answer: 1,
        explanation: "<code>std::setw</code> s'applique uniquement au prochain champ affiché, puis se réinitialise. <code>std::left</code> et <code>std::setprecision</code> persistent jusqu'au prochain changement."
      },
      {
        question: "Quelle différence concrète y a-t-il entre <code>std::endl</code> et <code>'\\n'</code> ?",
        options: [
          "Aucune, les deux sont interchangeables",
          "<code>std::endl</code> saute une ligne ET vide le tampon, ce qui coûte cher dans une boucle",
          "<code>'\\n'</code> n'est pas reconnu par tous les systèmes d'exploitation"
        ],
        answer: 1,
        explanation: "<code>std::endl</code> appelle <code>flush()</code> après le saut de ligne. Dans une boucle qui affiche des milliers de lignes, cela peut rendre le programme des dizaines de fois plus lent."
      },
      {
        question: "À quelle condition <code>std::ios::sync_with_stdio(false)</code> est-il sûr à utiliser ?",
        options: [
          "Quand on mélange <code>cout</code> et <code>printf</code> dans le même programme",
          "Quand on n'utilise que les flux C++ (<code>cout</code>, <code>cin</code>) et jamais <code>printf</code> / <code>scanf</code>",
          "Uniquement sur Linux"
        ],
        answer: 1,
        explanation: "Désactiver la synchronisation est sûr seulement si on n'utilise pas les fonctions C d'I/O dans le même programme. Mélanger les deux après ce point donne un affichage indéfini."
      }
    ],
    exercises: [
      {
        title: "Classement en colonnes",
        difficulty: "Facile",
        time: "20 min",
        prompt: "Reçois un nom de fichier via <code>argv[1]</code>, lis des lignes \"equipe;points;buts\" et affiche un tableau aligné avec <code>&lt;iomanip&gt;</code>.",
        deliverables: [
          "vérification de <code>argc</code> avant lecture",
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
          "gestion d'une ligne invalide sans arrêter tout le traitement",
          "résumé final avec nombre de lignes valides et rejetées"
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
        title: "Rapport de synthèse avec ostringstream",
        difficulty: "Intermédiaire",
        time: "20 min",
        prompt: "Lis un fichier de résultats ligne par ligne, construis un rapport formaté complet dans un <code>std::ostringstream</code> avec en-tête, tableau de données et ligne de synthèse, puis écris ce rapport dans un fichier de sortie.",
        deliverables: [
          "construction intégrale du rapport dans l'<code>ostringstream</code> avant toute écriture",
          "extraction du contenu via <code>.str()</code>",
          "écriture finale dans le fichier de sortie en une seule opération"
        ]
      },
      {
        title: "Lecture pipeline binaire simple",
        difficulty: "Avancé",
        time: "30 min",
        prompt: "Lis un fichier d'entiers 16 bits en mode binaire avec <code>read()</code> et <code>gcount()</code>, convertis-les en <code>double</code>, calcule min, max et moyenne, puis affiche le rapport formaté avec <code>&lt;iomanip&gt;</code>.",
        deliverables: [
          "ouverture en mode <code>std::ios::binary</code>",
          "utilisation correcte de <code>read()</code> et <code>gcount()</code>",
          "affichage formaté avec alignement et précision des réels"
        ]
      }
    ],
    keywords: ["ifstream", "ofstream", "fstream", "getline", "stringstream", "istringstream", "ostringstream", "cerr", "seekg", "tellg", "binary", "argc", "argv", "iomanip", "setw", "setfill", "setprecision", "sync_with_stdio", "flush", "endl"]
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
      focus: "ostringstream et istringstream sont les outils de choix pour travailler avec des chaînes comme des flux. Comprendre la direction des données — lire depuis une chaîne ou construire une chaîne — guide directement le choix entre les trois variantes de sstream.",
      retenir: [
        "ostringstream accumule du contenu ; .str() en extrait le résultat sous forme de std::string.",
        "Pour réutiliser un ostringstream dans une boucle, appeler .str(\"\") puis .clear()."
      ],
      pitfalls: [
        "Oublier .clear() après .str(\"\") laisse les bits d'erreur actifs.",
        "Utiliser stringstream bidirectionnel quand une seule direction suffit — cela brouille l'intention."
      ],
      method: [
        "Demande d'abord : est-ce que je lis depuis une chaîne ou est-ce que j'en construis une ?",
        "Choisis istringstream (lecture) ou ostringstream (écriture) en conséquence.",
        "Utilise .str() pour extraire le résultat final, jamais en milieu de construction."
      ],
      check: "Pour générer un en-tête CSV dynamique avec des colonnes variables, lequel de istringstream, ostringstream ou stringstream utiliserais-tu ?"
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
    },
    {
      focus: "La synchronisation des flux est invisible dans les TPs normaux mais devient un levier de performance réel dès que les volumes augmentent. Comprendre pourquoi endl coûte cher et quand sync_with_stdio(false) est sûr évite des erreurs de mesure et des ralentissements inutiles.",
      retenir: [
        "endl = '\\n' + flush : deux opérations au lieu d'une.",
        "sync_with_stdio(false) est irréversible et incompatible avec printf/scanf après ce point."
      ],
      pitfalls: [
        "Utiliser endl dans une boucle de 100 000 itérations sans réaliser le coût des flushes successifs.",
        "Appeler sync_with_stdio(false) dans un programme qui utilise aussi printf."
      ],
      method: [
        "Utilise '\\n' par défaut dans toutes les boucles.",
        "Reserve std::flush aux sorties interactives ou aux diagnostics d'urgence.",
        "N'active sync_with_stdio(false) qu'en haut de main, avant tout I/O, si tu es certain de ne pas utiliser stdio C."
      ],
      check: "Pourquoi un programme qui affiche 100 000 lignes avec endl est-il plus lent qu'un programme équivalent qui utilise '\\n' ?"
    }
  ]
});
})(window);
