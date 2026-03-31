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
      example: "On réserve ici une zone mémoire dont la durée de vie dépasse le scope courant.",
      codeExample: snippet("cpp", `
int* notes = new int[3]{12, 15, 18};
delete[] notes;
      `, "Allocation manuelle")
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
      example: "Le constructeur initialise l'objet au moment même où il est créé.",
      codeExample: snippet("cpp", `
class Point {
public:
    Point(int x, int y) : x_{x}, y_{y} {}
private:
    int x_;
    int y_;
};
      `, "Initialisation d'objet")
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
      example: "Le destructeur nettoie les ressources quand l'objet sort de vie.",
      codeExample: snippet("cpp", `
class Journal {
public:
    ~Journal() {
        std::cout << "Fermeture du journal\\n";
    }
};
      `, "Nettoyage automatique")
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
      example: "La ressource est acquise dans l'objet puis libérée automatiquement à la sortie du scope.",
      codeExample: snippet("cpp", `
std::ifstream input{"notes.txt"};
// Le fichier sera fermé automatiquement en sortie de portée.
      `, "Resource Acquisition Is Initialization")
    },
    "Référence (&)": {
      example: "La référence est ici un alias lisible vers une variable existante.",
      codeExample: snippet("cpp", `
int note = 12;
int& alias = note;
alias = 15;
      `, "Alias de variable")
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
        id: slugify(entry.term),
        example,
        codeExample,
        searchText: normalise([
          entry.term,
          entry.text,
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
