(function initialiseCourseAppGlossaryStudy(globalScope) {
  const { normalise, slugify } = globalScope.CourseAppStrings || {};

  function snippet(language, source, label = "Exemple simple") {
    return {
      language,
      label,
      source: source.trim()
    };
  }

  const termOverrides = {
    "Algorithme (STL)": {
      example: "Ici, l'intention est de compter les éléments pairs sans réécrire une boucle complète à chaque fois.",
      codeExample: snippet("cpp", `
std::vector<int> valeurs{1, 2, 3, 4};
auto nbPairs = std::count_if(valeurs.begin(), valeurs.end(), [](int v) {
    return v % 2 == 0;
});
      `, "Compter avec la STL")
    },
    "Allocation dynamique": {
      example: "On réserve ici une zone mémoire sur le tas, mais le chapitre insiste justement sur le fait qu'un std::vector exprimerait souvent mieux l'intention.",
      codeExample: snippet("cpp", `
int* notes = new int[3]{12, 15, 18};
delete[] notes;
      `, "Allocation manuelle explicite")
    },
    "Bibliothèque dynamique": {
      example: "Le programme est lié à une bibliothèque partagée qui doit être présente au lancement.",
      codeExample: snippet("bash", `
g++ -shared -o libmaths.so addition.o fraction.o
export LD_LIBRARY_PATH=.:$LD_LIBRARY_PATH
      `, "Bibliothèque partagée")
    },
    "Bibliothèque statique": {
      example: "Le code de la bibliothèque est embarqué dans l'exécutable au moment du linkage.",
      codeExample: snippet("bash", `
ar -rv libmaths.a addition.o fraction.o
g++ main.cpp -L. -lmaths -o app
      `, "Bibliothèque statique")
    },
    "Bloc catch": {
      example: "Le bloc catch traite l'erreur après la rupture du flot normal dans le bloc try.",
      codeExample: snippet("cpp", `
try {
    lancerTraitement();
} catch (const std::exception& e) {
    std::cerr << e.what() << '\\n';
}
      `, "Attraper une exception")
    },
    "Bloc try": {
      example: "Le bloc try contient le code qui peut lever une exception.",
      codeExample: snippet("cpp", `
try {
    lireFichier("notes.txt");
} catch (...) {
    std::cerr << "Erreur de lecture\\n";
}
      `, "Zone sous surveillance")
    },
    "Classe abstraite": {
      example: "Une classe abstraite décrit un rôle commun sans fournir toutes les implémentations concrètes.",
      codeExample: snippet("cpp", `
class Shape {
public:
    virtual void draw() const = 0;
    virtual ~Shape() = default;
};
      `, "Interface abstraite")
    },
    "Constructeur": {
      example: "Le constructeur doit produire un objet immédiatement valide, pas un objet 'à finir plus tard'.",
      codeExample: snippet("cpp", `
class Session {
public:
    Session(std::string utilisateur, int id)
        : utilisateur_{std::move(utilisateur)}, id_{id} {}
private:
    std::string utilisateur_;
    const int id_;
};
      `, "Construction d'un objet déjà valide")
    },
    "Copy constructor": {
      example: "Le constructeur de copie fabrique un nouvel objet à partir d'un objet existant du même type.",
      codeExample: snippet("cpp", `
class Buffer {
public:
    Buffer(const Buffer& other) : data_{other.data_} {}
private:
    std::string data_;
};
      `, "Copier un objet")
    },
    "Destructeur": {
      example: "Le destructeur intervient automatiquement en fin de vie pour nettoyer ce que l'objet possède réellement.",
      codeExample: snippet("cpp", `
class Connexion {
public:
    ~Connexion() {
        fermer();  // nettoyage de la ressource possédée
    }
};
      `, "Nettoyage en fin de vie")
    },
    Encapsulation: {
      example: "L'objet protège ici son état interne et n'autorise la modification qu'à travers une opération métier.",
      codeExample: snippet("cpp", `
class Compte {
public:
    void crediter(double montant) {
        if (montant > 0.0) {
            solde_ += montant;
        }
    }

    double solde() const { return solde_; }

private:
    double solde_{0.0};
};
      `, "État privé, API publique")
    },
    "Espace de noms (namespace)": {
      example: "Le namespace évite les collisions entre noms identiques venant de bibliothèques différentes.",
      codeExample: snippet("cpp", `
namespace maths {
    int addition(int a, int b) { return a + b; }
}

int somme = maths::addition(2, 3);
      `, "Éviter un conflit de noms")
    },
    Exception: {
      example: "Une exception coupe le flot courant lorsqu'on ne veut pas continuer silencieusement.",
      codeExample: snippet("cpp", `
if (denominateur == 0) {
    throw std::runtime_error("division par zero");
}
      `, "Lever une exception")
    },
    "Fichier logique": {
      example: "L'objet ifstream est le fichier logique utilisé dans le programme pour manipuler le fichier physique.",
      codeExample: snippet("cpp", `
std::ifstream input{"notes.txt"};
if (!input) {
    std::cerr << "Ouverture impossible\\n";
}
      `, "Fichier logique")
    },
    "Flot / Flux": {
      example: "Le flux décrit ici la circulation des données entre le programme et la console.",
      codeExample: snippet("cpp", `
std::cout << "Nom : ";
std::string nom{};
std::cin >> nom;
      `, "Entrée / sortie console")
    },
    "Foncteur (Function object)": {
      example: "Le foncteur se comporte comme une fonction mais peut embarquer un type et éventuellement un état.",
      codeExample: snippet("cpp", `
struct Addition {
    int operator()(int a, int b) const { return a + b; }
};
      `, "Objet appelable")
    },
    "Fonction virtuelle": {
      example: "La méthode virtuelle permet à une base d'appeler la bonne version selon le type réel.",
      codeExample: snippet("cpp", `
class Base {
public:
    virtual void afficher() const {}
    virtual ~Base() = default;
};
      `, "Méthode virtuelle")
    },
    "Fonction virtuelle pure": {
      example: "La méthode virtuelle pure force chaque classe dérivée concrète à fournir sa version.",
      codeExample: snippet("cpp", `
class Shape {
public:
    virtual double aire() const = 0;
    virtual ~Shape() = default;
};
      `, "Contrat obligatoire")
    },
    Héritage: {
      example: "Etudiant hérite ici de Personne car il reste une sorte de Personne avec des données supplémentaires.",
      codeExample: snippet("cpp", `
class Personne {};

class Etudiant : public Personne {
};
      `, "Relation est-un")
    },
    "Héritage multiple": {
      example: "Une classe peut hériter de plusieurs bases, mais cela complexifie fortement les contrats.",
      codeExample: snippet("cpp", `
class A {};
class B {};

class C : public A, public B {
};
      `, "Plusieurs bases")
    },
    Iterator: {
      example: "L'itérateur parcourt le conteneur sans exposer sa représentation interne.",
      codeExample: snippet("cpp", `
std::vector<int> v{1, 2, 3};
for (auto it = v.begin(); it != v.end(); ++it) {
    std::cout << *it << '\\n';
}
      `, "Parcours par itérateur")
    },
    Linker: {
      example: "Le linker assemble ici plusieurs fichiers objets pour fabriquer le binaire final.",
      codeExample: snippet("bash", `
g++ -c main.cpp -o main.o
g++ -c utils.cpp -o utils.o
g++ main.o utils.o -o app
      `, "Édition de liens")
    },
    "Modes d'ouverture": {
      example: "Le mode choisi change le comportement du fichier dès l'ouverture.",
      codeExample: snippet("cpp", `
std::ofstream journal{"app.log", std::ios::app};
journal << "Nouvelle ligne\\n";
      `, "Append sur fichier")
    },
    "Move semantics": {
      example: "Le déplacement transfère la ressource au lieu de la recopier intégralement.",
      codeExample: snippet("cpp", `
std::vector<int> source{1, 2, 3};
std::vector<int> destination = std::move(source);
      `, "Déplacement")
    },
    Optional: {
      example: "optional exprime qu'une valeur peut être absente sans bricoler de valeur sentinelle.",
      codeExample: snippet("cpp", `
std::optional<int> note{};
if (!note) {
    std::cout << "Pas encore de note\\n";
}
      `, "Valeur présente ou absente")
    },
    "Propagation d'une exception": {
      example: "L'exception remonte ici jusqu'au niveau qui sait réellement quoi faire.",
      codeExample: snippet("cpp", `
void charger() {
    throw std::runtime_error("format invalide");
}

void lancer() {
    try {
        charger();
    } catch (...) {
        throw;
    }
}
      `, "Relancer plus haut")
    },
    RAII: {
      example: "La ressource est confiée à un objet local ; quand le scope se termine, le nettoyage se fait sans appel manuel supplémentaire.",
      codeExample: snippet("cpp", `
std::ifstream input{"notes.txt"};
// Le fichier sera fermé automatiquement en sortie de portée.
      `, "Resource Acquisition Is Initialization")
    },
    "Référence (&)": {
      example: "La référence exprime ici un lien obligatoire avec une variable existante, sans passer par un pointeur optionnel.",
      codeExample: snippet("cpp", `
void incrementer(int& note) {
    ++note;
}

int note = 12;
incrementer(note); // note vaut maintenant 13
      `, "Modifier via une référence")
    },
    Ownership: {
      example: "Ici, le type choisi répond explicitement à la question 'qui est responsable de détruire la ressource ?'.",
      codeExample: snippet("cpp", `
auto rapport = std::make_unique<std::string>("valide");
// rapport est l'unique propriétaire de la ressource
      `, "Possession explicite")
    },
    Slicing: {
      example: "La copie par valeur dans le type de base perd la partie dérivée et donc son comportement dynamique.",
      codeExample: snippet("cpp", `
Base b = Derived{};
// La partie spécifique de Derived est perdue ici.
      `, "Perte de la partie dérivée")
    },
    STL: {
      example: "La STL fournit déjà conteneurs, itérateurs et algorithmes prêts à l'emploi.",
      codeExample: snippet("cpp", `
std::vector<int> v{3, 1, 4};
std::sort(v.begin(), v.end());
      `, "Standard Template Library")
    },
    Template: {
      example: "Le template décrit ici une famille de fonctions qui fonctionne sur plusieurs types.",
      codeExample: snippet("cpp", `
template <typename T>
T minimum(const T& a, const T& b) {
    return a < b ? a : b;
}
      `, "Fonction template")
    },
    "Template instantiation": {
      example: "L'instanciation correspond à la version concrète générée pour un type donné.",
      codeExample: snippet("cpp", `
int a = minimum(3, 7);
double b = minimum(2.5, 4.0);
      `, "Version générée par type")
    },
    "Translation unit": {
      example: "Une translation unit correspond au source après préprocesseur, juste avant compilation réelle.",
      codeExample: snippet("cpp", `
#include "outil.h"
int main() {
    return addition(1, 2);
}
      `, "Unité de traduction")
    },
    "Undefined behavior": {
      example: "Le programme a l'air simple ici, mais le langage ne garantit rien sur le résultat.",
      codeExample: snippet("cpp", `
int* ptr = nullptr;
std::cout << *ptr << '\\n';
      `, "Comportement indéfini")
    },
    "Lambda": {
      example: "On passe une lambda comme critère de tri : l'intention est lisible sans avoir besoin de nommer une fonction séparée.",
      codeExample: snippet("cpp", `
std::vector<int> v{5, 2, 8, 1};
std::sort(v.begin(), v.end(), [](int a, int b) {
    return a < b;
});

int seuil = 4;
auto it = std::find_if(v.begin(), v.end(), [seuil](int x) {
    return x > seuil;  // capture par valeur
});
      `, "Lambda avec capture")
    },
    "unique_ptr": {
      example: "Un unique_ptr dit clairement qu'il n'y a qu'un seul propriétaire à la fois ; le transfert rend cette décision visible.",
      codeExample: snippet("cpp", `
auto p1 = std::make_unique<std::string>("hello");
// auto p2 = p1;            // ❌ copie interdite
auto p2 = std::move(p1);   // ✅ transfert — p1 == nullptr
p2.reset();                 // libère la ressource
      `, "unique_ptr : création et transfert")
    },
    "shared_ptr": {
      example: "Plusieurs objets copropriètent ici la même ressource ; elle ne sera détruite qu'au départ du dernier propriétaire.",
      codeExample: snippet("cpp", `
auto p1 = std::make_shared<int>(42);
auto p2 = p1;   // compteur passe à 2
std::cout << p1.use_count() << '\\n'; // 2
p2.reset();     // compteur redescend à 1
// p1 sort de portée → compteur 0 → objet détruit
      `, "shared_ptr et compteur de références")
    },
    "weak_ptr": {
      example: "Ici, on observe une ressource partagée sans la copropriéter, ce qui évite de la garder en vie artificiellement.",
      codeExample: snippet("cpp", `
auto propriétaire = std::make_shared<int>(100);
std::weak_ptr<int> obs = propriétaire;

if (auto v = obs.lock()) {
    std::cout << *v << '\\n'; // 100
}
// propriétaire détruit ici
std::cout << obs.expired() << '\\n'; // 1 (true)
      `, "weak_ptr : observer sans posséder")
    },
    "nullptr": {
      example: "nullptr indique clairement qu'un pointeur ne vise rien pour l'instant, sans ambiguïté de type.",
      codeExample: snippet("cpp", `
int* p = nullptr;        // pointeur nul explicitement typé

void f(int*);
void f(int);
// f(NULL)    → ambigu
// f(nullptr) → appelle f(int*) sans ambiguïté
      `, "nullptr vs NULL")
    },
    "override": {
      example: "Le compilateur vérifie que la méthode redéfinit bien une virtuelle de la base — un typo dans la signature devient une erreur.",
      codeExample: snippet("cpp", `
class Base {
    virtual void afficher() const;
};

class Dérivée : public Base {
    void afficher() const override; // ✅ vérifié
    // void aficher() const override; // ❌ erreur de compilation
};
      `, "override comme garde-fou")
    },
    "auto": {
      example: "auto est utile quand le type est évident à droite ou franchement verbeux à gauche.",
      codeExample: snippet("cpp", `
auto compteur = 0;                          // int
auto it = tableDeSymboles.begin();          // iterator verbeux
auto p = std::make_unique<std::string>();   // type déjà visible

// À éviter : le type est sémantiquement important
// auto résultat = calculerScore();  // quel type retourne-t-il ?
      `, "auto : quand l'utiliser")
    },
    "noexcept": {
      example: "Marquer un move constructor noexcept permet à std::vector de choisir le déplacement plutôt que la copie lors d'un resize.",
      codeExample: snippet("cpp", `
class Buffer {
public:
    Buffer(Buffer&& other) noexcept
        : data_{other.data_}, taille_{other.taille_} {
        other.data_ = nullptr;
        other.taille_ = 0;
    }
};
      `, "noexcept sur le move constructor")
    },
    "Mutex": {
      example: "Un mutex protège l'incrémentation partagée : sans lui, deux threads simultanés produiraient un résultat aléatoire.",
      codeExample: snippet("cpp", `
std::mutex verrou;
int compteur = 0;

void incrementer() {
    std::lock_guard<std::mutex> garde{verrou};
    ++compteur;   // section critique protégée
}
      `, "Mutex et lock_guard")
    },
    "Thread": {
      example: "Deux traitements indépendants sont lancés en parallèle ; join() attend leur fin avant de continuer.",
      codeExample: snippet("cpp", `
void traitement(int id) {
    std::cout << "Thread " << id << "\\n";
}

std::thread t1{traitement, 1};
std::thread t2{traitement, 2};
t1.join();
t2.join();
      `, "Créer et rejoindre des threads")
    },
    "Data race": {
      example: "Sans synchronisation, deux threads incrémentant le même compteur produisent un résultat imprévisible.",
      codeExample: snippet("cpp", `
int compteur = 0;

// Thread 1                 // Thread 2
// compteur++;              // compteur++;
// Résultat final : 1 ou 2 — comportement indéfini

// Correction : protéger avec std::mutex
      `, "Data race : exemple et correction")
    },
    "std::future": {
      example: "Un future permet de lancer un calcul en arrière-plan et d'en récupérer le résultat plus tard.",
      codeExample: snippet("cpp", `
auto f = std::async(std::launch::async, []() {
    return 6 * 7;
});

// ... autres traitements ...

int résultat = f.get(); // bloque si nécessaire → 42
      `, "Récupérer un résultat asynchrone")
    },
    "TDD (Test-Driven Development)": {
      example: "On écrit d'abord le test qui échoue (rouge), puis le minimum de code pour le faire passer (vert), puis on améliore.",
      codeExample: snippet("cpp", `
// 1. Écrire le test (rouge)
TEST_CASE("deposer augmente le solde") {
    Compte c{100.0};
    c.deposer(50.0);
    REQUIRE(c.solde() == Approx(150.0));
}

// 2. Implémenter le minimum (vert)
void Compte::deposer(double montant) { solde_ += montant; }
      `, "Cycle TDD rouge-vert")
    },
    "Test unitaire": {
      example: "Chaque test vérifie un comportement précis : cas normal, cas limite, erreur attendue.",
      codeExample: snippet("cpp", `
TEST_CASE("Fraction : valeur décimale") {
    Fraction f{1, 4};
    REQUIRE(f.valeur() == Approx(0.25));
}
TEST_CASE("Fraction : dénominateur nul interdit") {
    REQUIRE_THROWS_AS(Fraction(1, 0), std::invalid_argument);
}
      `, "Tests Catch2")
    },
    "Dangling pointer": {
      example: "Le pointeur garde ici une adresse, mais la variable visée a déjà disparu : l'adresse existe encore, la cible non.",
      codeExample: snippet("cpp", `
int* p = nullptr;
{
    int x = 42;
    p = &x;
}  // x est détruit ici — p est désormais suspendu
// *p = 99;  // ❌ comportement indéfini
      `, "Pointeur suspendu")
    },
    "Fuite mémoire": {
      example: "La ressource est allouée mais jamais libérée ; le programme consomme de la mémoire indéfiniment.",
      codeExample: snippet("cpp", `
void mauvaise() {
    int* p = new int[100]; // alloué
    // delete[] p;  ← oublié
}  // fuite : 100 int perdus à chaque appel

// Correction : utiliser std::vector ou unique_ptr
      `, "Fuite mémoire et correction")
    },
    "lvalue / rvalue": {
      example: "Une lvalue a une adresse stable ; une rvalue est temporaire. std::move transforme une lvalue en rvalue.",
      codeExample: snippet("cpp", `
int x = 5;          // x est une lvalue
int y = x + 1;      // (x + 1) est une rvalue temporaire

std::string s = "hello";
std::string t = std::move(s); // s traité comme rvalue — transfert
// s est vide après le move
      `, "lvalue, rvalue et std::move")
    },
    "Structured bindings": {
      example: "On décompose une paire map en variables nommées, évitant .first et .second.",
      codeExample: snippet("cpp", `
std::map<std::string, int> notes{{"Alice", 17}, {"Bob", 14}};

for (const auto& [nom, note] : notes) {
    std::cout << nom << " : " << note << "\\n";
}

auto [min, max] = std::minmax(3, 9);
      `, "Structured bindings C++17")
    },
    "Copy-and-swap": {
      example: "L'affectation copie l'argument, l'échange avec *this, puis laisse le destructeur nettoyer l'ancien état.",
      codeExample: snippet("cpp", `
Buffer& operator=(Buffer other) { // copie par valeur
    swap(*this, other);           // échange les ressources
    return *this;
}   // l'ancien état est détruit avec 'other'
      `, "Copy-and-swap idiom")
    },
    "vtable": {
      example: "Le compilateur génère une table par classe virtuelle ; chaque appel virtuel passe par ce tableau de pointeurs.",
      codeExample: snippet("cpp", `
class Forme {
public:
    virtual double aire() const = 0; // entrée dans la vtable
    virtual ~Forme() = default;
};

// À l'exécution :
// Forme* f = new Cercle(5.0);
// f->aire();  → vtable de Cercle → Cercle::aire()
      `, "vtable et dispatch dynamique")
    },
    "lock_guard": {
      example: "Le verrou se libère automatiquement à la sortie du bloc, même en cas d'exception.",
      codeExample: snippet("cpp", `
std::mutex m;

void ecriture(int valeur) {
    std::lock_guard<std::mutex> garde{m}; // verrouille ici
    données.push_back(valeur);
}  // déverrouille ici — RAII garanti
      `, "lock_guard RAII")
    },
    "std::move": {
      example: "std::move ne déplace rien par lui-même : il signale que la ressource peut être transférée.",
      codeExample: snippet("cpp", `
std::string a = "hello";
std::string b = std::move(a); // transfert des données internes
// a est vide maintenant, b vaut "hello"

std::vector<std::string> v;
v.push_back(std::move(b));    // évite une copie de la chaîne
      `, "std::move : sémantique de déplacement")
    },
    "Sanitizer": {
      example: "Les sanitizers détectent les bugs mémoire et comportements indéfinis à l'exécution, avant qu'ils ne deviennent des crashes silencieux.",
      codeExample: snippet("bash", `
g++ -std=c++20 -Wall -Wextra \\
    -fsanitize=address,undefined \\
    -g src/*.cpp -o app

# AddressSanitizer : détecte buffer overflow, use-after-free
# UndefinedBehaviorSanitizer : overflow entier, nullptr deref, ...
      `, "Compiler avec les sanitizers")
    },
    "Portée (scope)": {
      example: "La variable n'existe que dans le bloc qui la déclare ; en sortir déclenche son destructeur.",
      codeExample: snippet("cpp", `
{
    int local = 10;
    // local visible ici
}
// local détruit ici — inaccessible au-delà

for (int i = 0; i < 5; ++i) {
    // i n'existe que dans cette boucle
}
      `, "Portée des variables")
    },
    "explicit": {
      example: "Sans explicit, le compilateur convertit silencieusement un entier en objet, ce qui peut masquer des erreurs.",
      codeExample: snippet("cpp", `
class Taille {
public:
    explicit Taille(int valeur) : valeur_{valeur} {}
private:
    int valeur_;
};

// Taille t = 5;     // ❌ interdit sans explicit
Taille t{5};         // ✅ construction explicite requise
      `, "explicit : interdire la conversion implicite")
    },
    "Règle de 3 / 5": {
      example: "Une classe avec un destructeur custom possède probablement une ressource ; la copie et l'affectation doivent être pensées.",
      codeExample: snippet("cpp", `
class Buffer {
public:
    ~Buffer();                            // destructeur custom
    Buffer(const Buffer&);               // constructeur copie
    Buffer& operator=(const Buffer&);    // affectation copie
    Buffer(Buffer&&) noexcept;           // + move (règle de 5)
    Buffer& operator=(Buffer&&) noexcept;
};
      `, "Règle de 5 complète")
    },
    "argc / argv": {
      example: "On passe le nom d'un fichier en argument au lieu de le coder en dur : ./programme Tournoi.txt — argv[1] vaut alors \"Tournoi.txt\".",
      codeExample: snippet("cpp", `
int main(int argc, char* argv[]) {
    if (argc < 2) {
        std::cerr << "Usage : " << argv[0] << " <fichier>\\n";
        return 1;
    }
    std::ifstream f{argv[1]};
    // ...
}
      `, "Lire un fichier passé en argument")
    },
    "iomanip / setw": {
      example: "On affiche un classement avec des colonnes parfaitement alignées grâce aux manipulateurs de <iomanip>.",
      codeExample: snippet("cpp", `
#include <iomanip>
std::cout << std::left  << std::setw(12) << "France"
          << std::right << std::setw(6)  << 9
          << std::right << std::setw(6)  << 6 << "\\n";
// France           9     6
      `, "Colonnes alignées avec setw")
    },
    "std::stack": {
      example: "On modélise une pile d'appels ou d'opérations à annuler (undo) avec std::stack.",
      codeExample: snippet("cpp", `
std::stack<int> pile;
pile.push(1); pile.push(2); pile.push(3);
while (!pile.empty()) {
    std::cout << pile.top() << "\\n"; // 3, 2, 1
    pile.pop();
}
      `, "Pile LIFO avec std::stack")
    },
    "std::queue": {
      example: "On traite des requêtes dans l'ordre d'arrivée avec std::queue.",
      codeExample: snippet("cpp", `
std::queue<std::string> file;
file.push("Alice"); file.push("Bob"); file.push("Charlie");
while (!file.empty()) {
    std::cout << file.front() << "\\n"; // Alice, Bob, Charlie
    file.pop();
}
      `, "File FIFO avec std::queue")
    },
    "std::copy": {
      example: "On recopie les éléments d'un vecteur vers un autre sans boucle explicite.",
      codeExample: snippet("cpp", `
std::vector<int> source{1, 2, 3, 4, 5};
std::vector<int> dest(source.size());
std::copy(source.begin(), source.end(), dest.begin());
// dest = {1, 2, 3, 4, 5}
      `, "Copier un vecteur avec std::copy")
    },
    "std::transform": {
      example: "On convertit un vecteur de chaînes en minuscules vers des majuscules sans écrire de boucle.",
      codeExample: snippet("cpp", `
#include <cctype>
std::vector<char> src{'a', 'b', 'c'};
std::vector<char> dst(src.size());
std::transform(src.begin(), src.end(), dst.begin(), [](char c) {
    return static_cast<char>(std::toupper(c));
});
// dst = {'A', 'B', 'C'}
      `, "Transformer avec std::transform")
    },
    "LIFO / FIFO": {
      example: "Une pile d'assiettes (LIFO : on reprend la dernière posée) vs une file d'attente en caisse (FIFO : le premier arrivé est servi en premier).",
      codeExample: snippet("cpp", `
std::stack<int> lifo;  // Last In First Out
lifo.push(1); lifo.push(2);
std::cout << lifo.top(); // 2 (le dernier entré)

std::queue<int> fifo;  // First In First Out
fifo.push(1); fifo.push(2);
std::cout << fifo.front(); // 1 (le premier entré)
      `, "LIFO vs FIFO")
    },
    "Constructeur par recopie": {
      example: "Quand on passe un objet par valeur à une fonction, le constructeur par recopie est appelé pour créer une copie locale indépendante.",
      codeExample: snippet("cpp", `
class Point {
public:
    Point(int x, int y) : x_{x}, y_{y} {}
    // constructeur par recopie
    Point(const Point& other) : x_{other.x_}, y_{other.y_} {}
private:
    int x_, y_;
};

Point a{1, 2};
Point b{a};        // appel du constructeur par recopie
Point c = a;       // idem
      `, "Constructeur par recopie")
    },
    "Opérateur d'affectation": {
      example: "L'opérateur = sur un objet existant doit copier l'état source sans provoquer de fuite ni de double-delete.",
      codeExample: snippet("cpp", `
class Polynome {
public:
    Polynome& operator=(const Polynome& other) {
        if (this != &other) {       // garde anti-autoaffectation
            delete[] coeffs_;
            degree_ = other.degree_;
            coeffs_ = new double[degree_ + 1];
            std::copy(other.coeffs_, other.coeffs_ + degree_ + 1, coeffs_);
        }
        return *this;
    }
private:
    int degree_;
    double* coeffs_;
};
      `, "Opérateur d'affectation")
    },
    "Opérateur d'extraction (>>)": {
      example: "On lit les champs d'un objet depuis un fichier texte avec le même << que pour cin.",
      codeExample: snippet("cpp", `
class Date {
    short j_, m_; int a_;
public:
    friend std::istream& operator>>(std::istream& in, Date& d) {
        in >> d.j_ >> d.m_ >> d.a_;
        return in;
    }
};

Date d;
std::cin >> d;          // depuis la console
fichier >> d;           // depuis un fichier
      `, "operator>> pour lire un objet")
    },
    "Nombre rationnel": {
      example: "Une fraction comme 3/4 se représente par un numérateur et un dénominateur avec les opérateurs arithmétiques surchargés.",
      codeExample: snippet("cpp", `
class Fraction {
    int num_, den_;
public:
    Fraction(int n, int d) : num_{n}, den_{d != 0 ? d : throw std::invalid_argument{"den=0"}} {}

    Fraction operator+(const Fraction& o) const {
        return {num_ * o.den_ + o.num_ * den_, den_ * o.den_};
    }
    bool operator==(const Fraction& o) const {
        return num_ * o.den_ == o.num_ * den_;
    }
};
      `, "Classe Fraction")
    },
    "std::list": {
      example: "On préfère std::list quand on insère et supprime fréquemment au milieu d'une séquence, car les itérateurs existants restent valides.",
      codeExample: snippet("cpp", `
std::list<int> l{1, 2, 3, 4, 5};
auto it = std::find(l.begin(), l.end(), 3);
l.insert(it, 99);   // insère 99 avant 3 en O(1)
l.erase(it);        // supprime 3 en O(1)
// l = {1, 2, 99, 4, 5}
      `, "std::list : insertion O(1)")
    },
    "std::string_view": {
      example: "On passe une vue sur une chaîne sans copier : la fonction lit sans posséder.",
      codeExample: snippet("cpp", `
void afficher(std::string_view sv) {
    std::cout << sv << "\\n"; // lecture seule, pas de copie
}

std::string s = "hello";
afficher(s);          // depuis un string
afficher("world");    // depuis un littéral
afficher(s.substr(0, 3)); // ⚠️ substr retourne un string temp — ok ici
      `, "string_view : vue légère")
    }
  };

  const tagFallbacks = [
    {
      test: (tags) => tags.includes("exceptions"),
      example: "Le mot-clé apparaît dans une chaîne try/throw/catch où le programme doit signaler une erreur au lieu de continuer silencieusement.",
      codeExample: snippet("cpp", `
try {
    verifier();
} catch (const std::exception& e) {
    std::cerr << e.what() << '\\n';
}
      `, "Gestion d'erreur")
    },
    {
      test: (tags) => tags.includes("stl") || tags.includes("algorithmes") || tags.includes("iterateurs"),
      example: "Le concept s'emploie souvent avec un conteneur standard comme std::vector et un algorithme prêt à l'emploi.",
      codeExample: snippet("cpp", `
std::vector<int> v{1, 2, 3};
for (const auto& valeur : v) {
    std::cout << valeur << '\\n';
}
      `, "Usage STL")
    },
    {
      test: (tags) => tags.includes("io") || tags.includes("fichiers") || tags.includes("flux"),
      example: "Le concept intervient dès qu'on lit, écrit ou contrôle un flux console ou fichier.",
      codeExample: snippet("cpp", `
std::ifstream input{"donnees.txt"};
std::string ligne{};
std::getline(input, ligne);
      `, "Lecture simple")
    },
    {
      test: (tags) => tags.includes("build") || tags.includes("compilation"),
      example: "Le terme sert à comprendre comment le code source devient un binaire exécutable ou une API disponible.",
      codeExample: snippet("bash", `
g++ -std=c++20 -Wall -Wextra -pedantic main.cpp -o app
      `, "Compilation")
    },
    {
      test: (tags) => tags.includes("memoire") || tags.includes("heap") || tags.includes("stack") || tags.includes("ressources"),
      example: "Le concept aide à raisonner sur la durée de vie, l'allocation et la responsabilité sur les ressources.",
      codeExample: snippet("cpp", `
std::vector<int> notes{12, 15, 18};
std::cout << notes.size() << '\\n';
      `, "Mémoire gérée simplement")
    },
    {
      test: (tags) => tags.includes("poo") || tags.includes("objet") || tags.includes("cycle de vie"),
      example: "Le concept se voit naturellement dans une petite classe avec état privé et interface publique.",
      codeExample: snippet("cpp", `
class Compte {
public:
    void depot(double montant) { solde_ += montant; }
private:
    double solde_ = 0.0;
};
      `, "Objet simple")
    },
    {
      test: (tags) => tags.includes("template") || tags.includes("genericite"),
      example: "Le concept apparaît dans du code générique qui s'instancie pour plusieurs types concrets.",
      codeExample: snippet("cpp", `
template <typename T>
T carre(const T& valeur) {
    return valeur * valeur;
}
      `, "Généricité")
    },
    {
      test: () => true,
      example: "On retrouve ce terme dans un mini-exemple lisible où le code illustre l'idée sans détour.",
      codeExample: snippet("cpp", `
int valeur = 42;
std::cout << valeur << '\\n';
      `, "Exemple minimal")
    }
  ];

  function getFallback(tags) {
    return tagFallbacks.find((entry) => entry.test(tags));
  }

  function buildGlossaryEntries(rawGlossary) {
    return rawGlossary.map((entry) => {
      const override = termOverrides[entry.term];
      const fallback = getFallback(entry.tags);
      const example = override?.example || fallback.example;
      const codeExample = override?.codeExample || fallback.codeExample;

      return Object.assign({}, entry, {
        id: entry.id || slugify(entry.term),
        example,
        codeExample,
        searchText: normalise([
          entry.term,
          entry.text,
          Array.isArray(entry.aliases) ? entry.aliases.join(" ") : "",
          entry.tags.join(" "),
          example,
          codeExample?.source || ""
        ].join(" "))
      });
    });
  }

  globalScope.CourseAppGlossaryStudy = {
    buildGlossaryEntries
  };
})(window);
