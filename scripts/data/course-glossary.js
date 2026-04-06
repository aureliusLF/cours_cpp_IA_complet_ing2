(function registerCourseGlossary(globalScope) {
const registry = globalScope.CourseDataRegistry;

if (!registry) {
  console.error("CourseDataRegistry est indisponible. Vérifie que scripts/data/course-runtime.js est chargé avant les données du cours.");
  return;
}

registry.setGlossary([
  {
    term: "Algorithme (STL)",
    text: "Fonction template capable de s'appliquer à une collection d'éléments en naviguant via des itérateurs.",
    aliases: ["algorithmes STL", "algorithme STL"],
    autoLink: false,
    tags: ["stl", "algorithmes"]
  },
  {
    term: "Allocation dynamique",
    text: "Réservation d'une zone mémoire sur le tas, généralement avec <code>new</code> ou <code>new[]</code>. En C++ moderne, on préfère souvent laisser <code>std::vector</code> ou un smart pointer exprimer cette allocation.",
    tags: ["memoire", "heap"]
  },
  {
    term: "Bibliothèque dynamique",
    text: "Bibliothèque dont l'emplacement est indiqué au programme pour être chargée en mémoire après son lancement.",
    tags: ["build", "linkage"]
  },
  {
    term: "Bibliothèque statique",
    text: "Bibliothèque dont les définitions de fonctions sont incluses directement dans l'exécutable pendant l'édition de liens.",
    tags: ["build", "linkage"]
  },
  {
    term: "Bloc catch",
    text: "Gestionnaire d'exception qui traite l'erreur une fois que le programme a été dérouté par l'instruction throw.",
    tags: ["exceptions", "erreurs"]
  },
  {
    term: "Bloc try",
    text: "Morceau de programme mis sous surveillance pour détecter une exception qui pourrait s'y produire.",
    tags: ["exceptions", "erreurs"]
  },
  {
    term: "Classe",
    text: "Type qui regroupe un état et des opérations, mais surtout un contrat : ce qu'un objet valide peut faire et ce qu'il doit toujours garantir.",
    tags: ["poo", "objet"]
  },
  {
    term: "Classe abstraite",
    text: "Classe contenant au moins une fonction virtuelle pure, ce qui empêche son instanciation.",
    aliases: ["classes abstraites"],
    tags: ["poo", "polymorphisme"]
  },
  {
    term: "Const-correctness",
    text: "Discipline qui consiste à dire explicitement ce qui peut être modifié ou non dans une API, afin que le contrat soit visible dès la signature.",
    tags: ["api", "const"]
  },
  {
    term: "Constructeur",
    text: "Fonction membre spéciale appelée à la création de l'objet. Son rôle n'est pas seulement de remplir des champs, mais de produire un objet immédiatement valide.",
    aliases: ["constructeurs"],
    linkTerms: ["constructeur", "constructeurs"],
    tags: ["poo", "cycle de vie"]
  },
  {
    term: "Conteneurs associatifs",
    text: "Classes de la STL où les éléments sont ordonnés et identifiés par une clé, comme map ou set.",
    tags: ["stl", "conteneurs"]
  },
  {
    term: "Conteneurs séquentiels",
    text: "Classes de la STL où les éléments sont ordonnés et où l'on peut insérer ou supprimer explicitement à un endroit, comme vector, list ou deque.",
    tags: ["stl", "conteneurs"]
  },
  {
    term: "Copy constructor",
    text: "Constructeur qui crée un nouvel objet à partir d'un objet du même type.",
    tags: ["copie", "poo"]
  },
  {
    term: "Destructeur",
    text: "Fonction membre spéciale appelée automatiquement en fin de vie d'un objet pour libérer les ressources qu'il possède réellement.",
    aliases: ["destructeurs"],
    linkTerms: ["destructeur", "destructeurs"],
    tags: ["poo", "cycle de vie", "raii"]
  },
  {
    term: "Encapsulation",
    text: "Principe qui consiste à protéger l'état interne d'un objet derrière une interface, afin de défendre son invariant au lieu d'exposer librement ses données.",
    tags: ["poo", "design"]
  },
  {
    term: "Espace de noms (namespace)",
    text: "Mécanisme de regroupement logique qui évite les collisions de noms et signale qu'un type ou une fonction appartient à un domaine précis.",
    aliases: ["namespace", "espaces de noms"],
    linkTerms: ["namespace", "espace de noms", "espaces de noms"],
    tags: ["compilation", "organisation"]
  },
  {
    term: "Exception",
    text: "Événement indiquant une erreur pendant l'exécution, entraînant une suspension du flux normal et le déroutement vers un gestionnaire dédié.",
    tags: ["exceptions", "erreurs"]
  },
  {
    term: "Fichier logique",
    text: "Variable de flux comme ifstream, ofstream ou fstream liée au fichier physique pour l'utiliser dans le programme.",
    tags: ["fichiers", "io"]
  },
  {
    term: "Flot / Flux",
    text: "Canal intermédiaire standard pour les entrées et sorties en C++, comme cin, cout ou cerr.",
    tags: ["io", "flux"]
  },
  {
    term: "Fonction virtuelle",
    text: "Fonction permettant l'héritage d'interface et d'implémentation par défaut, avec choix dynamique de la méthode selon le type de l'objet.",
    aliases: ["fonctions virtuelles"],
    tags: ["poo", "polymorphisme"]
  },
  {
    term: "Fonction virtuelle pure",
    text: "Méthode déclarée avec = 0 qui impose aux classes dérivées concrètes de fournir son implémentation.",
    aliases: ["fonctions virtuelles pures"],
    tags: ["poo", "polymorphisme"]
  },
  {
    term: "Foncteur (Function object)",
    text: "Objet se comportant comme une fonction grâce à la surcharge de l'opérateur().",
    tags: ["stl", "operateurs"]
  },
  {
    term: "Friend function",
    text: "Fonction non membre autorisée à accéder aux membres privés d'une classe si cela sert le contrat de l'API.",
    tags: ["operateurs", "poo"]
  },
  {
    term: "Héritage",
    text: "Déclaration d'une classe dérivée à partir d'une classe de base pour hériter de ses membres, réutiliser le code et ajouter des fonctionnalités.",
    aliases: ["heritage public"],
    tags: ["poo", "polymorphisme"]
  },
  {
    term: "Héritage multiple",
    text: "Fait pour une classe de dériver de plusieurs classes simultanément et d'hériter ainsi des données et fonctions de toutes ces classes mères.",
    tags: ["poo", "polymorphisme"]
  },
  {
    term: "Implémentation de classe",
    text: "Code définissant les fonctions déclarées dans l'interface, généralement placé dans un fichier .cpp.",
    tags: ["poo", "organisation"]
  },
  {
    term: "Instanciation",
    text: "Action de créer un objet d'un type donné, analogue à la déclaration d'une variable.",
    tags: ["poo", "objet"]
  },
  {
    term: "Interface de classe",
    text: "Description de la structure incluant les données membres et le prototype des fonctions membres, souvent contenue dans un fichier .h.",
    tags: ["poo", "organisation"]
  },
  {
    term: "Invariant",
    text: "Propriété qui doit rester vraie pour qu'un objet soit considéré comme cohérent et utilisable. Une bonne classe organise son API autour de cette règle.",
    tags: ["design", "classe"]
  },
  {
    term: "Iterator",
    text: "Abstraction de parcours utilisée par les conteneurs et les algorithmes de la STL.",
    aliases: ["itérateur", "itérateurs", "iterateur", "iterateurs"],
    tags: ["stl", "iterateurs"]
  },
  {
    term: "Linker",
    text: "Outil qui assemble les fichiers objets et résout les symboles entre modules.",
    tags: ["build", "edition de liens"]
  },
  {
    term: "Modes d'ouverture",
    text: "Paramètres déterminant l'action sur un fichier, comme ios::in pour la lecture, ios::out pour l'écriture, ios::app pour l'ajout et ios::trunc pour le vidage à l'ouverture.",
    tags: ["fichiers", "io"]
  },
  {
    term: "Move semantics",
    text: "Mécanisme permettant de transférer une ressource au lieu de la recopier.",
    aliases: ["move", "deplacement", "déplacement", "move semantics"],
    linkTerms: ["move semantics"],
    tags: ["performance", "ownership"]
  },
  {
    term: "Optional",
    text: "Type standard exprimant qu'une valeur peut être présente ou absente.",
    aliases: ["optional", "std::optional"],
    tags: ["modern cpp", "std"]
  },
  {
    term: "Ownership",
    text: "Relation qui désigne qui est responsable de la durée de vie d'une ressource et donc de sa libération. C'est l'idée centrale derrière RAII, <code>unique_ptr</code> et <code>shared_ptr</code>.",
    aliases: ["proprietaire", "propriétaire", "propriete", "propriété"],
    linkTerms: ["ownership"],
    tags: ["memoire", "ressources"]
  },
  {
    term: "Pile d'exécution (stack)",
    text: "Zone mémoire où vivent notamment les variables locales automatiques et les cadres d'appels de fonctions. Les objets qui y sont créés sont détruits automatiquement à la sortie du scope.",
    tags: ["memoire", "stack"]
  },
  {
    term: "Pointeur this",
    text: "Pointeur implicite vers l'objet courant à l'intérieur d'une méthode. Il sert surtout à lever une ambiguïté de nom ou à retourner <code>*this</code> dans une API chaînable.",
    tags: ["poo", "objet"]
  },
  {
    term: "Polymorphisme",
    text: "Capacité à manipuler des objets de types différents via une interface commune.",
    aliases: ["polymorphisme dynamique"],
    tags: ["objet", "poo"]
  },
  {
    term: "Prédicat",
    text: "Type de foncteur prenant un seul argument et renvoyant un booléen pour tester une propriété particulière d'un objet.",
    tags: ["stl", "algorithmes"]
  },
  {
    term: "Propagation d'une exception",
    text: "Retransmission d'une exception vers la fonction appelante ou vers le niveau try/catch immédiatement supérieur si elle n'est pas gérée localement.",
    tags: ["exceptions", "erreurs"]
  },
  {
    term: "RAII",
    text: "Principe qui confie une ressource à un objet dès sa construction et la libère automatiquement à sa destruction. Cela évite d'éparpiller des <code>open()</code>, <code>close()</code>, <code>new</code> et <code>delete</code> dans le code appelant.",
    aliases: ["resource acquisition is initialization"],
    linkTerms: ["RAII"],
    tags: ["lifetime", "resource", "raii"]
  },
  {
    term: "Redéfinition",
    text: "Modification du comportement d'une méthode existante héritée d'une classe de base.",
    tags: ["poo", "heritage"]
  },
  {
    term: "Référence (&)",
    text: "Alias sur un objet existant. Une référence exprime un lien obligatoire avec une cible valide, ce qui la rend souvent plus lisible qu'un pointeur pour les paramètres non optionnels.",
    aliases: ["référence", "références", "reference", "references", "reference (&)"],
    linkTerms: ["référence", "références", "reference", "references"],
    tags: ["syntaxe", "parametres"]
  },
  {
    term: "Rule of 0",
    text: "Principe qui recommande de laisser le compilateur gérer les opérations spéciales quand les membres standard savent déjà le faire.",
    tags: ["design", "copie"]
  },
  {
    term: "Slicing",
    text: "Perte de la partie dérivée lorsqu'un objet polymorphique est copié par valeur dans un objet base.",
    tags: ["polymorphisme", "copie"]
  },
  {
    term: "STL",
    text: "Bibliothèque standard regroupant des algorithmes et des structures de données fondamentales testées et optimisées.",
    aliases: ["standard template library"],
    tags: ["stl", "standard library"]
  },
  {
    term: "Surcharge des opérateurs",
    text: "Possibilité de redéfinir le comportement des opérateurs standards pour des objets personnalisés, comme les opérateurs arithmétiques, de comparaison ou de flux.",
    tags: ["operateurs", "poo"]
  },
  {
    term: "Tas (heap)",
    text: "Zone de mémoire de taille variable utilisée pour le stockage des données allouées dynamiquement.",
    tags: ["memoire", "heap"]
  },
  {
    term: "Template",
    text: "Mécanisme de programmation générique permettant à une fonction ou une classe d'utiliser différents types tout en conservant un typage strict.",
    aliases: ["templates"],
    tags: ["template", "genericite"]
  },
  {
    term: "Template instantiation",
    text: "Génération par le compilateur d'une version concrète d'un template pour un type donné.",
    tags: ["template", "compilation"]
  },
  {
    term: "Translation unit",
    text: "Résultat d'un fichier source après passage du préprocesseur, avant linkage.",
    tags: ["compilation", "build"]
  },
  {
    term: "Undefined behavior",
    text: "Comportement pour lequel la norme ne garantit rien ; le programme peut sembler marcher puis casser ailleurs.",
    tags: ["safety", "debug"]
  },
  {
    term: "Lambda",
    text: "Fonction anonyme définie en ligne, capturant éventuellement des variables du contexte via sa liste de capture. Syntaxe : <code>[capture](params) { corps }</code>.",
    tags: ["syntaxe", "modern cpp", "stl"]
  },
  {
    term: "unique_ptr",
    text: "Smart pointer à possession exclusive. Il dit clairement : 'un seul propriétaire gère cette ressource'. Il n'est pas copiable, mais sa possession peut être transférée avec <code>std::move</code>.",
    aliases: ["std::unique_ptr"],
    tags: ["memoire", "ownership", "modern cpp"]
  },
  {
    term: "shared_ptr",
    text: "Smart pointer à possession partagée. Plusieurs objets peuvent copropriéter la même ressource, détruite quand le dernier propriétaire disparaît. À utiliser seulement quand cette copropriété est réelle et justifiée.",
    aliases: ["std::shared_ptr"],
    tags: ["memoire", "ownership", "modern cpp"]
  },
  {
    term: "weak_ptr",
    text: "Observateur non propriétaire d'une ressource gérée par <code>shared_ptr</code>. Il ne prolonge pas la durée de vie de l'objet et sert notamment à casser les cycles de références.",
    aliases: ["std::weak_ptr"],
    tags: ["memoire", "ownership", "modern cpp"]
  },
  {
    term: "nullptr",
    text: "Littéral représentant l'absence de cible pour un pointeur. Il remplace utilement <code>NULL</code> et <code>0</code> car il est typé et évite des ambiguïtés.",
    tags: ["syntaxe", "pointeur", "modern cpp"]
  },
  {
    term: "override",
    text: "Mot-clé placé après la signature d'une méthode dérivée pour demander au compilateur de vérifier qu'elle redéfinit bien une méthode virtuelle de la base.",
    aliases: ["override()"],
    tags: ["poo", "heritage", "polymorphisme"]
  },
  {
    term: "auto",
    text: "Mot-clé demandant au compilateur de déduire le type d'une variable ou d'un retour de fonction. Améliore la lisibilité quand le type est évident ou très verbeux.",
    tags: ["syntaxe", "modern cpp"]
  },
  {
    term: "noexcept",
    text: "Spécificateur indiquant qu'une fonction ne lancera pas d'exception. Permet aux conteneurs standard de préférer le déplacement à la copie en toute sécurité.",
    tags: ["exceptions", "modern cpp", "performance"]
  },
  {
    term: "Mutex",
    text: "Primitive de synchronisation qui garantit qu'un seul thread à la fois accède à une section critique. En C++, <code>std::mutex</code> se verrouille avec <code>lock()</code> et se déverrouille avec <code>unlock()</code>.",
    tags: ["concurrence", "thread", "safety"]
  },
  {
    term: "Thread",
    text: "Fil d'exécution indépendant partageant la mémoire du processus. En C++, représenté par <code>std::thread</code> ; doit être rejoint (<code>join()</code>) ou détaché (<code>detach()</code>) avant sa destruction.",
    tags: ["concurrence", "thread"]
  },
  {
    term: "Data race",
    text: "Accès concurrent non synchronisé à une même donnée par au moins deux threads, dont l'un au moins est en écriture. Constitue un comportement indéfini en C++.",
    tags: ["concurrence", "safety", "debug"]
  },
  {
    term: "std::future",
    text: "Objet permettant de récupérer le résultat d'une tâche asynchrone lancée avec <code>std::async</code>. L'appel à <code>.get()</code> bloque jusqu'à disponibilité du résultat.",
    tags: ["concurrence", "modern cpp"]
  },
  {
    term: "TDD (Test-Driven Development)",
    text: "Pratique de développement consistant à écrire le test avant le code. Cycle : rouge (test échoue) → vert (implémentation minimale) → refactoring.",
    tags: ["qualite", "design"]
  },
  {
    term: "Test unitaire",
    text: "Test automatisé qui vérifie le comportement d'une unité de code (fonction, classe) en isolation, indépendamment des autres modules.",
    tags: ["qualite", "debug"]
  },
  {
    term: "Dangling pointer",
    text: "Pointeur dont la cible n'existe plus, par exemple après un <code>delete</code> ou après la sortie de portée d'une variable locale. Le déréférencer produit un comportement indéfini.",
    tags: ["pointeur", "memoire", "safety", "debug"]
  },
  {
    term: "Fuite mémoire",
    text: "Ressource allouée dynamiquement qui n'est jamais libérée. En C++, résulte typiquement d'un <code>new</code> sans <code>delete</code> correspondant.",
    tags: ["memoire", "safety", "debug"]
  },
  {
    term: "lvalue / rvalue",
    text: "<em>lvalue</em> : expression désignant un objet persistant, addressable. <em>rvalue</em> : valeur temporaire sans adresse stable. La distinction guide les règles de move semantics.",
    tags: ["syntaxe", "modern cpp", "copie"]
  },
  {
    term: "Structured bindings",
    text: "Syntaxe C++17 permettant de décomposer une paire, un tuple ou une struct en variables nommées : <code>auto [clé, valeur] = ...</code>.",
    tags: ["syntaxe", "modern cpp"]
  },
  {
    term: "Copy-and-swap",
    text: "Idiome d'implémentation de l'opérateur d'affectation : créer une copie locale, l'échanger avec <code>*this</code> via <code>swap</code>, laisser le destructeur nettoyer l'ancienne valeur. Garantit la sécurité aux exceptions.",
    tags: ["copie", "design", "poo"]
  },
  {
    term: "vtable",
    text: "Table de pointeurs de fonctions virtuelles générée par le compilateur pour chaque classe polymorphique. Permet la résolution dynamique des appels de méthodes virtuelles à l'exécution.",
    tags: ["poo", "polymorphisme", "performance"]
  },
  {
    term: "lock_guard",
    text: "Wrapper RAII autour d'un mutex : verrouille à la construction, déverrouille automatiquement à la destruction, même en cas d'exception.",
    tags: ["concurrence", "raii", "memoire"]
  },
  {
    term: "std::move",
    text: "Fonction utilitaire qui convertit une expression en rvalue, autorisant le transfert de ressources plutôt que leur copie. N'effectue aucun déplacement par elle-même.",
    aliases: ["move", "deplacer", "déplacer"],
    linkTerms: ["std::move"],
    tags: ["copie", "modern cpp", "performance"]
  },
  {
    term: "Sanitizer",
    text: "Outil de détection dynamique d'erreurs activé à la compilation (<code>-fsanitize=address,undefined</code>). Détecte les débordements, accès invalides et comportements indéfinis à l'exécution.",
    tags: ["debug", "safety"]
  },
  {
    term: "Portée (scope)",
    text: "Région du code où un identifiant est visible et utilisable. En C++, délimitée par des accolades <code>{ }</code>. Les objets locaux sont détruits à la sortie de leur portée.",
    tags: ["syntaxe", "memoire"]
  },
  {
    term: "explicit",
    text: "Mot-clé appliqué à un constructeur pour interdire les conversions implicites. Force l'appelant à construire explicitement l'objet.",
    tags: ["poo", "syntaxe"]
  },
  {
    term: "Règle de 3 / 5",
    text: "Si une classe définit l'un des éléments suivants (destructeur, constructeur de copie, opérateur d'affectation), elle doit définir les trois (règle de 3) ou les cinq avec move (règle de 5).",
    tags: ["poo", "copie", "memoire"]
  },
  {
    term: "std::string_view",
    text: "Vue légère non propriétaire sur une chaîne de caractères existante. Évite la copie lors de la lecture d'une chaîne sans en modifier le contenu.",
    tags: ["modern cpp", "performance", "std"]
  },
  {
    term: "argc / argv",
    text: "Paramètres de <code>main(int argc, char* argv[])</code> permettant de récupérer les arguments passés en ligne de commande. <code>argc</code> est leur nombre (≥ 1) ; <code>argv[0]</code> est le nom du programme, <code>argv[1]</code> le premier argument utilisateur.",
    tags: ["syntaxe", "io", "compilation"]
  },
  {
    term: "iomanip / setw",
    text: "Bibliothèque <code>&lt;iomanip&gt;</code> fournissant des manipulateurs de flux : <code>std::setw(n)</code> réserve une largeur, <code>std::left</code>/<code>std::right</code> aligne, <code>std::setprecision(n)</code> contrôle les décimales. <code>setw</code> n'est pas persistant ; les autres le sont.",
    tags: ["io", "flux", "formatage"]
  },
  {
    term: "std::stack",
    text: "Adaptateur de conteneur STL implémentant une pile LIFO (Last In First Out). Interface : <code>push</code>, <code>top</code>, <code>pop</code>, <code>empty</code>, <code>size</code>. Construit sur <code>std::deque</code> par défaut.",
    tags: ["stl", "conteneurs"]
  },
  {
    term: "std::queue",
    text: "Adaptateur de conteneur STL implémentant une file FIFO (First In First Out). Interface : <code>push</code>, <code>front</code>, <code>back</code>, <code>pop</code>, <code>empty</code>. Construit sur <code>std::deque</code> par défaut.",
    tags: ["stl", "conteneurs"]
  },
  {
    term: "std::copy",
    text: "Algorithme STL qui recopie les éléments d'une plage source vers une destination. Nécessite que l'espace de destination soit déjà alloué.",
    tags: ["stl", "algorithmes"]
  },
  {
    term: "std::transform",
    text: "Algorithme STL qui applique une fonction à chaque élément d'une plage source et écrit le résultat dans une destination. Remplace avantageusement une boucle de transformation manuelle.",
    tags: ["stl", "algorithmes"]
  },
  {
    term: "LIFO / FIFO",
    text: "<em>LIFO</em> (Last In First Out) : le dernier élément inséré est le premier retiré — modèle de la pile (<code>std::stack</code>). <em>FIFO</em> (First In First Out) : le premier inséré est le premier retiré — modèle de la file (<code>std::queue</code>).",
    tags: ["stl", "algorithmes", "conteneurs"]
  },
  {
    term: "Constructeur par recopie",
    text: "Constructeur qui crée un nouvel objet comme copie d'un objet existant du même type. Signature : <code>MaClasse(const MaClasse&amp; other)</code>. Appelé automatiquement lors d'un passage par valeur ou d'une initialisation par copie.",
    tags: ["poo", "copie", "cycle de vie"]
  },
  {
    term: "Opérateur d'affectation",
    text: "Opérateur <code>operator=</code> qui copie l'état d'un objet dans un objet existant du même type. Distinct du constructeur par recopie : l'objet cible existe déjà. Doit gérer l'auto-affectation et respecter la règle de 3/5.",
    tags: ["operateurs", "poo", "copie"]
  },
  {
    term: "Opérateur d'extraction (>>)",
    text: "Surcharge de <code>operator&gt;&gt;</code> pour lire un objet depuis un flux. Retourne <code>std::istream&amp;</code> pour permettre le chaînage. Généralement déclaré <code>friend</code> pour accéder aux membres privés.",
    tags: ["operateurs", "io", "flux"]
  },
  {
    term: "Nombre rationnel",
    text: "Nombre de la forme p/q (numérateur entier, dénominateur entier non nul). En C++, souvent modélisé par une classe <code>Fraction</code> surchargeant les opérateurs arithmétiques et de comparaison.",
    tags: ["poo", "operateurs", "maths"]
  },
  {
    term: "std::list",
    text: "Conteneur séquentiel STL implémentant une liste doublement chaînée. Insertions et suppressions en O(1) à n'importe quel endroit, mais accès indexé en O(n). À préférer à <code>std::vector</code> uniquement si les insertions au milieu sont l'opération dominante.",
    tags: ["stl", "conteneurs"]
  }
].sort((left, right) => left.term.localeCompare(right.term, "fr", { sensitivity: "base" })));
})(window);
