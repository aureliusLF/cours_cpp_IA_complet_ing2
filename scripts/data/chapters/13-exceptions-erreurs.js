(function registerChapterBundle13(globalScope) {
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
  order: 13,
  chapter: withChapterTheme("exceptions-erreurs", () => ({
    id: "exceptions-erreurs",
    shortTitle: "Exceptions",
    title: "Exceptions et gestion des erreurs en C++",
    level: "Avancé",
    duration: "1 h 30",
    track: "SE5/SE6",
    summary:
      "Un programme solide ne se contente pas de fonctionner sur le chemin nominal. Il distingue les bugs internes, les aléas d'exécution et les absences de valeur légitimes, choisit le mécanisme adapté à chaque cas, et transmet assez de contexte pour que l'appelant puisse décider quoi faire. Ce chapitre couvre le modèle complet des exceptions C++ : hiérarchie standard, conception d'exceptions personnalisées, garanties de sécurité et alternatives modernes.",
    goals: [
      "distinguer une erreur de programmation, un cas métier attendu et une vraie erreur système, et choisir entre assertion, exception, <code>std::optional</code> ou code de retour",
      "utiliser <code>try</code>/<code>catch</code> avec propagation explicite et captures correctement typées, sans masquer le chemin normal",
      "concevoir une exception personnalisée portant un contexte exploitable, et raisonner sur les trois garanties de sécurité des exceptions"
    ],
    highlights: ["try/catch", "throw", "noexcept", "std::exception", "runtime_error", "logic_error", "optional", "garantie forte"],
    body: [
      lesson(
        "try, throw, catch et propagation",
        paragraphs(
          "Les exceptions existent pour séparer le chemin normal du traitement d'erreur lorsqu'on ne peut pas continuer silencieusement. Une division par zéro, une ressource indispensable absente ou un format impossible à interpréter sont des exemples de ruptures du flot normal. Quand une exception n'est pas capturée localement, elle remonte la pile d'appels : c'est le <em>stack unwinding</em>.",
          "Pendant ce déroulement de pile, tous les destructeurs des objets locaux sont appelés normalement — c'est pourquoi RAII garantit que les ressources acquises avant l'exception sont libérées même si une exception est levée. Capturer par référence constante évite les copies inutiles et préserve le polymorphisme des hiérarchies d'exceptions."
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
    std::cerr << "Erreur : " << e.what() << '\\n';
}
          `,
          "Try / throw / catch"
        ),
        code(
          "cpp",
          `
// Relancer une exception après journalisation
catch (const std::exception& e) {
    journaliser(e.what());
    throw;                  // relance l'exception originale sans la copier
}
          `,
          "Propagation explicite vers un niveau supérieur"
        ),
        bullets([
          "L'ordre des blocs <code>catch</code> compte : le plus spécifique doit venir avant le plus général.",
          "<code>catch (...)</code> attrape tout — utile en dernier recours pour journaliser avant propagation.",
          "<code>throw;</code> sans argument relaie l'exception en cours sans la copier ni en changer le type.",
          "Ne jamais utiliser les exceptions comme substitut au contrôle de flux normal (<code>if/else</code>)."
        ]),
        callout("warn", "Ordre des catches", "Les blocs <code>catch</code> sont testés dans l'ordre. Le plus spécifique doit venir avant le plus général, et <code>catch(...)</code> en dernier. Un <code>catch(std::exception&)</code> placé avant <code>catch(std::runtime_error&)</code> absorbera tout sans jamais atteindre le second.")
      ),
      lesson(
        "Assertions, exceptions métier et <code>std::exception</code>",
        paragraphs(
          "Une assertion protège une hypothèse interne du développeur : quelque chose qui ne devrait jamais arriver si le code est correct. Une exception représente une erreur d'exécution que l'appelant doit pouvoir comprendre, propager ou traiter. Un simple message console, lui, ne suffit pas à structurer une API robuste.",
          "La bonne pratique consiste à lancer des objets d'exception dérivés de <code>std::exception</code>, afin de fournir un message via <code>what()</code>. Le mot-clé <code>noexcept</code> sert à signaler contractuellement qu'une fonction ne doit pas lever d'exception — les destructeurs, les fonctions de swap et les moves devraient presque toujours être <code>noexcept</code>."
        ),
        table(
          ["Mécanisme", "Usage principal", "Comportement si violation"],
          [
            ["<code>assert</code>", "Hypothèse interne, toujours vraie si le code est correct.", "Abort immédiat en debug, ignoré en release si NDEBUG."],
            ["Exception", "Erreur d'exécution récupérable ou propagable.", "Remonte la pile jusqu'à un catch ou std::terminate."],
            ["Message console", "Information utilisateur ou diagnostic ponctuel.", "Aucun — le programme continue."],
            ["<code>noexcept</code>", "Contrat : la fonction ne lève pas.", "std::terminate si une exception est levée malgré tout."]
          ]
        ),
        code(
          "cpp",
          `
class MonErreur : public std::exception {
public:
    explicit MonErreur(std::string message)
        : message_{std::move(message)} {}

    const char* what() const noexcept override {
        return message_.c_str();
    }

private:
    std::string message_;
};
          `,
          "Classe d'exception personnalisée minimale"
        ),
        callout("success", "Niveau de capture", "Attrape une exception au niveau où tu peux réellement décider quoi faire : corriger, relancer avec plus de contexte, journaliser ou arrêter proprement. Attraper trop tôt pour masquer une erreur est pire que de ne pas attraper du tout.")
      ),
      lesson(
        "Hiérarchie des exceptions standard C++",
        paragraphs(
          "La bibliothèque standard définit une hiérarchie d'exceptions enracinée à <code>std::exception</code>. Deux grandes familles en dérivent : <code>std::logic_error</code> pour les erreurs détectables à la conception (précondition violée, index hors bornes, argument invalide) et <code>std::runtime_error</code> pour les erreurs inévitables à l'exécution (fichier absent, dépassement arithmétique, erreur système).",
          "Cette distinction est architecturale : une <code>logic_error</code> signale généralement un bug dans le code appelant, qu'un test aurait pu attraper. Une <code>runtime_error</code> signale un aléa de l'environnement que le code ne peut pas éviter. Choisir la bonne classe de base rend immédiatement lisible la nature de l'erreur pour l'appelant."
        ),
        table(
          ["Classe", "Famille", "Cas typique"],
          [
            ["<code>std::invalid_argument</code>", "logic_error", "Argument hors du domaine valide."],
            ["<code>std::out_of_range</code>", "logic_error", "Index ou valeur hors des bornes attendues."],
            ["<code>std::length_error</code>", "logic_error", "Tentative de créer une structure trop grande."],
            ["<code>std::domain_error</code>", "logic_error", "Valeur mathématiquement invalide (ex: sqrt(-1))."],
            ["<code>std::runtime_error</code>", "runtime_error", "Erreur générale d'exécution."],
            ["<code>std::range_error</code>", "runtime_error", "Résultat hors de la plage représentable."],
            ["<code>std::overflow_error</code>", "runtime_error", "Dépassement arithmétique vers le haut."],
            ["<code>std::bad_alloc</code>", "exception", "Échec d'allocation mémoire (operator new)."],
            ["<code>std::bad_cast</code>", "exception", "Échec d'un dynamic_cast vers un type incompatible."]
          ]
        ),
        code(
          "cpp",
          `
try {
    traiterFichier("data.csv");
}
catch (const std::invalid_argument& e) {
    std::cerr << "Argument invalide : " << e.what() << '\\n';
}
catch (const std::runtime_error& e) {
    std::cerr << "Erreur d'exécution : " << e.what() << '\\n';
}
catch (const std::exception& e) {
    std::cerr << "Erreur inattendue : " << e.what() << '\\n';
}
catch (...) {
    std::cerr << "Exception inconnue\\n";
}
          `,
          "Catch en cascade, du plus spécifique au plus général"
        ),
        callout("info", "Hiérarchie et polymorphisme", "Capturer <code>const std::exception&</code> attrape n'importe quelle exception standard. C'est utile pour les points de journalisation centraux. Pour traiter différemment selon le type, place les catches spécifiques avant.")
      ),
      lesson(
        "Concevoir une exception personnalisée",
        paragraphs(
          "Une exception personnalisée vaut la peine d'être créée quand la classe de base standard ne porte pas assez de contexte pour aider le développeur ou l'appelant à comprendre ce qui s'est passé. Le contexte minimal utile est : <em>quoi</em> a échoué, <em>où</em> (fichier, ligne, opération), et <em>pourquoi</em> (la cause précise).",
          "La bonne pratique est de dériver de <code>std::runtime_error</code> ou <code>std::logic_error</code> — pas directement de <code>std::exception</code> — pour hériter automatiquement d'une implémentation de <code>what()</code> et s'intégrer dans les catch par famille. Des accesseurs supplémentaires exposent les champs de contexte de manière typée."
        ),
        code(
          "cpp",
          `
class ErreurFichierIntrouvable : public std::runtime_error {
public:
    explicit ErreurFichierIntrouvable(const std::string& nomFichier)
        : std::runtime_error("Fichier introuvable : " + nomFichier),
          nomFichier_{nomFichier} {}

    const std::string& nomFichier() const noexcept {
        return nomFichier_;
    }

private:
    std::string nomFichier_;
};
          `,
          "Exception personnalisée avec contexte accessible"
        ),
        code(
          "cpp",
          `
class ErreurFormatLigne : public std::runtime_error {
public:
    ErreurFormatLigne(int numeroLigne, const std::string& contenu)
        : std::runtime_error(
            "Ligne " + std::to_string(numeroLigne) + " invalide : " + contenu),
          numeroLigne_{numeroLigne},
          contenu_{contenu} {}

    int numeroLigne() const noexcept { return numeroLigne_; }
    const std::string& contenu() const noexcept { return contenu_; }

private:
    int numeroLigne_;
    std::string contenu_;
};
          `,
          "Exception portant le numéro de ligne et le contenu fautif"
        ),
        bullets([
          "Dériver de <code>std::runtime_error</code> ou <code>std::logic_error</code>, pas de <code>std::exception</code> directement.",
          "Appeler le constructeur de la base avec le message principal dans l'initializer list.",
          "Exposer des accesseurs <code>noexcept</code> pour les champs de contexte.",
          "Ne pas surcharger <code>what()</code> si le message construit dans le constructeur de la base suffit."
        ]),
        callout("success", "Trois informations minimales", "Une bonne exception porte trois informations : <strong>quoi</strong> a échoué, <strong>où</strong> dans le programme (fichier, opération, ligne), et <strong>pourquoi</strong> (la donnée fautive). Sans ces trois éléments, le message d'erreur oblige le développeur à relire le code pour comprendre.")
      ),
      lesson(
        "Sécurité des exceptions : garanties et RAII",
        paragraphs(
          "La <em>sécurité des exceptions</em> (exception safety) décrit ce qu'une fonction garantit sur l'état du programme si elle lève une exception. Il y a trois niveaux : la <strong>garantie de base</strong> (l'invariant de l'objet est préservé, pas de fuite de ressource), la <strong>garantie forte</strong> (si ça échoue, l'état est identique à celui d'avant l'appel — commit or rollback) et la <strong>garantie noexcept</strong> (aucune exception n'est levée).",
          "La garantie de base est quasi-automatique avec RAII : dès que chaque ressource est gérée par un objet dont le destructeur est <code>noexcept</code>, le déroulement de pile nettoie tout. La garantie forte demande plus d'effort — le pattern copy-and-swap en est la technique classique."
        ),
        table(
          ["Garantie", "Ce qu'elle promet", "Technique habituelle"],
          [
            ["Noexcept", "La fonction ne lève jamais.", "Destructeurs, swap, move (quasi-toujours)."],
            ["Forte", "En cas d'exception, l'état est identique à l'état d'avant.", "Copy-and-swap, opérations atomiques."],
            ["De base", "L'invariant est préservé, pas de fuite de ressource.", "RAII systématique sur toutes les ressources."]
          ]
        ),
        code(
          "cpp",
          `
// Garantie forte via copy-and-swap
Tournoi& operator=(Tournoi other) {   // copie dans le paramètre (peut échouer ici)
    swap(*this, other);               // swap ne lève jamais (noexcept)
    return *this;
}                                     // si la copie a échoué, *this est inchangé

friend void swap(Tournoi& a, Tournoi& b) noexcept {
    using std::swap;
    swap(a.equipes_, b.equipes_);
    swap(a.nom_, b.nom_);
}
          `,
          "Copy-and-swap pour la garantie forte"
        ),
        code(
          "cpp",
          `
// noexcept sur les opérations qui ne doivent jamais lever
std::string nom() const noexcept { return nom_; }

// std::vector utilise le move uniquement s'il est noexcept
std::vector<Joueur> joueurs_;  // move de Joueur doit être noexcept pour les réallocations optimales
          `,
          "noexcept et optimisation STL"
        ),
        callout("warn", "Move et noexcept", "Quand <code>std::vector</code> réalloue sa mémoire interne, il ne peut utiliser le move de ses éléments que si ce move est <code>noexcept</code>. Sinon, il se replie sur la copie pour garantir la sécurité forte. Déclarer les move constructors <code>noexcept</code> est donc souvent une optimisation critique.")
      ),
      lesson(
        "Alternatives aux exceptions : <code>std::optional</code> et codes de retour",
        paragraphs(
          "Les exceptions ne sont pas la seule façon de gérer les cas d'échec. Il existe un continuum d'outils dont le choix dépend de la distance sémantique entre l'erreur et son traitement, du coût acceptable, et de la nature de l'absence.",
          "<code>std::optional&lt;T&gt;</code> (C++17) représente une valeur qui peut légitimement être absente — une recherche qui ne trouve pas, un champ optionnel dans un protocole. Ce n'est pas une erreur : c'est un résultat valide. Les codes de retour restent pertinents pour les fonctions critiques en performance ou les interfaces avec du code C."
        ),
        table(
          ["Mécanisme", "Quand l'utiliser", "Quand l'éviter"],
          [
            ["Exception", "Erreur inattendue qui doit remonter loin dans la pile.", "Hot path critique, destructeurs, code C interop."],
            ["<code>std::optional</code>", "Absence de valeur légitime et fréquente (recherche, parse optionnel).", "Pour représenter une erreur avec message — utiliser une exception."],
            ["Code de retour", "Interface C, performance temps-réel, signaux simples.", "Quand l'appelant peut facilement ignorer le code — risque de propagation silencieuse."],
            ["<code>assert</code>", "Hypothèse de programmation interne.", "Toute erreur que l'utilisateur final peut déclencher."]
          ]
        ),
        code(
          "cpp",
          `
#include <optional>

// Retourne l'étudiant trouvé, ou rien si absent
std::optional<Etudiant> trouverParNom(const std::vector<Etudiant>& liste,
                                       const std::string& nom) {
    for (const auto& e : liste) {
        if (e.nom == nom) return e;   // valeur présente
    }
    return std::nullopt;              // absence légitime
}

// Utilisation
auto result = trouverParNom(etudiants, "Martin");
if (result) {
    std::cout << result->note << '\\n';  // accès via -> ou *
} else {
    std::cout << "Étudiant non trouvé\\n";
}

// Valeur par défaut avec value_or
double note = trouverNote(etudiants, "Martin").value_or(0.0);
          `,
          "std::optional pour une recherche qui peut ne rien trouver"
        ),
        code(
          "cpp",
          `
// std::expected<T, E> (C++23) — retourner un résultat OU une erreur typée
// Mention pour connaissance culturelle — non exigible dans ce cours
#include <expected>

std::expected<double, std::string> parseNote(const std::string& texte) {
    try {
        double val = std::stod(texte);
        if (val < 0.0 || val > 20.0) return std::unexpected("Note hors plage");
        return val;
    } catch (...) {
        return std::unexpected("Format invalide : " + texte);
    }
}
          `,
          "std::expected — perspective C++23"
        ),
        callout("info", "optional n'est pas un remplacement universel", "<code>std::optional</code> exprime l'absence d'une valeur, pas une erreur. Si l'absence est anormale et que l'appelant a besoin d'un message explicatif, une exception reste le bon outil. Si l'absence est normale et fréquente (ex: 30 % des requêtes ne trouvent pas de résultat), <code>optional</code> est plus idiomatique.")
      )
    ].join(""),
    checklist: [
      "Je distingue une erreur de programmation, un aléa système et une erreur métier.",
      "Je sais écrire un bloc <code>try</code>/<code>catch</code> avec capture par <code>const</code> référence.",
      "Je comprends le stack unwinding et je sais relancer une exception avec <code>throw;</code>.",
      "Je connais l'ordre des blocs <code>catch</code> (plus spécifique en premier, <code>catch(...)</code> en dernier).",
      "Je connais les grandes familles de la hiérarchie standard (<code>logic_error</code>, <code>runtime_error</code> et leurs dérivées).",
      "Je sais créer une exception personnalisée dérivée de <code>std::runtime_error</code> ou <code>std::logic_error</code>.",
      "J'ajoute un contexte utile dans mes exceptions (fichier, ligne, opération fautive).",
      "Je comprends la différence entre la garantie de base, la garantie forte et la garantie noexcept.",
      "Je sais pourquoi RAII assure quasi-automatiquement la garantie de base.",
      "Je décore une fonction avec <code>noexcept</code> quand elle ne peut réellement pas lever.",
      "Je comprends pourquoi le move d'un <code>std::vector</code> n'est optimisé que si les éléments sont <code>noexcept</code> movable.",
      "Je sais utiliser <code>std::optional</code> pour représenter une absence de valeur légitime.",
      "Je peux justifier le choix entre exception, <code>optional</code> et code de retour selon le contexte."
    ],
    quiz: [
      {
        question: "Quelle est la différence principale entre <code>std::logic_error</code> et <code>std::runtime_error</code> ?",
        options: [
          "<code>logic_error</code> est plus lente à lancer que <code>runtime_error</code>",
          "<code>logic_error</code> signale un bug détectable à la conception ; <code>runtime_error</code> signale un aléa d'exécution inévitable",
          "<code>runtime_error</code> ne peut pas être catchée par <code>catch(std::exception&)</code>"
        ],
        answer: 1,
        explanation: "logic_error documente une précondition violée — quelque chose que le code appelant aurait pu éviter. runtime_error documente un aléa de l'environnement (fichier absent, réseau indisponible) que le code ne pouvait pas prévoir."
      },
      {
        question: "Pourquoi capture-t-on les exceptions par <code>const</code> référence et non par valeur ?",
        options: [
          "Pour empêcher toute propagation future",
          "Pour éviter une copie inutile et conserver le polymorphisme de la hiérarchie d'exceptions",
          "Parce que <code>catch</code> interdit techniquement les objets par valeur"
        ],
        answer: 1,
        explanation: "La capture par valeur couperait le type dynamique (slicing) et copierait l'objet inutilement. La référence constante préserve le type réel et évite la copie."
      },
      {
        question: "Dans quel ordre place-t-on les blocs <code>catch</code> quand on en a plusieurs ?",
        options: [
          "Du plus général au plus spécifique",
          "Du plus spécifique au plus général",
          "L'ordre n'a aucune importance, le compilateur les trie"
        ],
        answer: 1,
        explanation: "Les blocs catch sont testés dans l'ordre déclaré. Un catch(std::exception&) placé en premier absorberait toutes les exceptions standard avant que les catch plus spécifiques ne soient atteints."
      },
      {
        question: "Qu'est-ce que la garantie forte d'exception ?",
        options: [
          "Le programme ne lève jamais d'exception",
          "En cas d'exception, l'objet est soit dans son nouvel état, soit dans son état original — jamais dans un état intermédiaire",
          "L'exception est toujours journalisée avant propagation"
        ],
        answer: 1,
        explanation: "La garantie forte est un commit or rollback : si l'opération échoue, l'état revient exactement à ce qu'il était avant. Le pattern copy-and-swap en est la technique classique."
      },
      {
        question: "Pourquoi <code>std::vector</code> utilise-t-il le move de ses éléments lors d'une réallocation uniquement si ce move est <code>noexcept</code> ?",
        options: [
          "Par convention du standard, sans raison de performance",
          "Parce que si le move levait une exception en milieu de transfert, l'état du vector serait irréparable — ni l'ancien ni le nouveau buffer ne seraient complets",
          "Pour des raisons de vitesse uniquement, sans lien avec la sécurité"
        ],
        answer: 1,
        explanation: "vector doit offrir la garantie forte pour push_back. Si le move peut lever, vector ne peut pas garantir le rollback en cas d'échec et se replie donc sur la copie, plus sûre mais plus lente."
      },
      {
        question: "Quelle classe est recommandée comme base d'une exception personnalisée ?",
        options: [
          "<code>std::bad_alloc</code>",
          "<code>std::runtime_error</code> ou <code>std::logic_error</code> selon la nature de l'erreur",
          "<code>std::exception</code> directement, toujours"
        ],
        answer: 1,
        explanation: "Dériver de runtime_error ou logic_error donne une implémentation gratuite de what() via le constructeur de la base et s'intègre dans les catch par famille. Dériver directement de std::exception nécessite de tout réimplémenter."
      },
      {
        question: "Qu'est-ce que <code>std::optional&lt;T&gt;</code> permet d'exprimer ?",
        options: [
          "Qu'une valeur est garantie non-nulle",
          "Qu'une valeur peut légitimement être absente, sans que ce soit une erreur",
          "Qu'une exception a été interceptée et supprimée"
        ],
        answer: 1,
        explanation: "optional exprime une absence normale et fréquente — une recherche sans résultat, un champ optionnel. Si l'absence est anormale et doit transmettre un message, une exception reste plus adaptée."
      },
      {
        question: "Dans quel contexte ne doit-on jamais lancer une exception ?",
        options: [
          "Dans une fonction membre <code>const</code>",
          "Dans un destructeur, car si une exception est déjà en cours de propagation, lancer une deuxième entraîne <code>std::terminate</code>",
          "Dans une fonction marquée <code>virtual</code>"
        ],
        answer: 1,
        explanation: "Si une exception est déjà en cours de déroulement de pile et qu'un destructeur en lance une nouvelle, le runtime C++ n'a aucun moyen de gérer les deux simultanément et appelle std::terminate."
      }
    ],
    exercises: [
      {
        title: "Hiérarchie de catch",
        difficulty: "Facile",
        time: "20 min",
        prompt: "Écris un programme qui lance trois types d'exceptions différentes (<code>std::out_of_range</code>, <code>std::runtime_error</code>, une exception personnalisée), et montre par les messages affichés que l'ordre des <code>catch</code> détermine quel bloc est exécuté. Inverse ensuite l'ordre et observe le comportement.",
        deliverables: [
          "au moins trois types d'exceptions lancées",
          "démonstration que l'ordre des catch compte",
          "un catch final <code>catch(...)</code> qui ne masque pas les précédents"
        ]
      },
      {
        title: "Exception contextuelle personnalisée",
        difficulty: "Intermédiaire",
        time: "25 min",
        prompt: "Conçois une classe <code>ErreurChargementFichier</code> dérivée de <code>std::runtime_error</code>, portant le nom du fichier et la raison de l'échec. Utilise-la dans une fonction de chargement qui vérifie l'ouverture et le format, puis attrape-la dans <code>main</code> en affichant un message exploitable incluant le nom du fichier.",
        deliverables: [
          "classe d'exception avec constructeur enrichi et accesseur <code>nomFichier()</code>",
          "message <code>what()</code> construit dans le constructeur de la base",
          "catch dans main qui utilise l'accesseur et pas seulement <code>what()</code>"
        ]
      },
      {
        title: "API qui sait échouer proprement",
        difficulty: "Intermédiaire",
        time: "25 min",
        prompt: "Conçois une petite API de gestion de notes dont certaines opérations lèvent des exceptions métier (note hors plage, étudiant inconnu, fichier absent). Décide à quel niveau attraper chaque type d'exception dans le programme principal et justifie ton choix.",
        deliverables: [
          "au moins deux types d'exceptions métier distinctes",
          "niveau de capture choisi pour chaque type",
          "justification architecturale : qui peut décider quoi faire ?"
        ]
      },
      {
        title: "Refonte avec <code>std::optional</code>",
        difficulty: "Avancé",
        time: "30 min",
        prompt: "Prends une fonction qui retourne <code>-1</code> pour signaler l'absence d'un étudiant dans une collection. Remplace cette valeur sentinelle par une signature retournant <code>std::optional&lt;Etudiant&gt;</code>. Adapte tous les sites d'appel. Justifie ensuite quand cette refonte a du sens et quand une exception serait préférable.",
        deliverables: [
          "nouvelle signature avec <code>std::optional</code>",
          "tous les sites d'appel adaptés avec <code>has_value()</code> ou <code>value_or()</code>",
          "justification comparative : optional vs exception pour ce cas"
        ]
      }
    ],
    keywords: ["exception", "try", "catch", "throw", "runtime_error", "logic_error", "noexcept", "std::exception", "assert", "optional", "nullopt", "what", "stack unwinding", "garantie de base", "garantie forte", "copy-and-swap", "bad_alloc", "out_of_range"]
  })),
  deepDives: [
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
      focus: "Assertions, exceptions métier et std::exception forment trois niveaux complémentaires de diagnostic. Le but n'est pas seulement d'attraper une erreur, mais de transmettre assez de contexte pour permettre à l'appelant de comprendre ce qui s'est réellement passé.",
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
      focus: "Choisir entre logic_error et runtime_error est une décision architecturale, pas cosmétique. Elle indique à l'appelant si l'erreur révèle un bug dans son code ou un aléa de l'environnement — ce qui détermine comment il devrait y réagir.",
      retenir: [
        "logic_error = bug détectable à la conception, précondition violée.",
        "runtime_error = aléa d'exécution que le code ne pouvait pas prévenir."
      ],
      pitfalls: [
        "Toujours utiliser std::runtime_error par habitude, sans réfléchir à la famille.",
        "Dériver directement de std::exception et perdre l'implémentation gratuite de what()."
      ],
      method: [
        "Demande : est-ce qu'un test unitaire aurait pu attraper cette erreur avant exécution ?",
        "Si oui → logic_error (c'est un bug). Si non → runtime_error (c'est un aléa).",
        "Choisis la sous-classe la plus spécifique qui correspond sémantiquement."
      ],
      check: "Une fonction reçoit un argument négatif alors qu'elle n'accepte que des positifs. De quelle famille d'exception s'agit-il ?"
    },
    {
      focus: "Le contexte dans une exception est sa première valeur ajoutée. Un message vague ('erreur de lecture') est moins utile qu'un message précis ('Ligne 42 du fichier notes.csv : champ note manquant'). Les accesseurs permettent à l'appelant de réagir programmatiquement, pas seulement de journaliser.",
      retenir: [
        "Construire le message dans le constructeur de la base (runtime_error/logic_error).",
        "Ajouter des accesseurs noexcept pour les champs de contexte typés."
      ],
      pitfalls: [
        "Message trop vague qui ne localise pas l'erreur.",
        "Mettre toute la logique dans what() au lieu d'utiliser des accesseurs séparés."
      ],
      method: [
        "Identifie les trois informations minimales : quoi, où, pourquoi.",
        "Construis le message lisible via le constructeur de la base.",
        "Expose les champs bruts via accesseurs pour les appelants qui veulent réagir programmatiquement."
      ],
      check: "Le message de ton exception aide-t-il vraiment à diagnostiquer l'erreur sans avoir à lire le code source ?"
    },
    {
      focus: "La garantie de base est quasi-automatique avec RAII : dès que chaque ressource est encapsulée dans un objet dont le destructeur est noexcept, le déroulement de pile nettoie tout sans fuite. C'est la connexion fondamentale entre RAII et la sécurité des exceptions.",
      retenir: [
        "Les destructeurs doivent toujours être noexcept — c'est implicite depuis C++11.",
        "RAII sur toutes les ressources = garantie de base quasi-automatique."
      ],
      pitfalls: [
        "Acquérir plusieurs ressources sans RAII et laisser une fuite si la deuxième acquisition échoue.",
        "Croire que la garantie de base est 'tout ou rien' — elle garantit l'invariant, pas la progression."
      ],
      method: [
        "Encapsule chaque ressource dans un objet RAII dédié.",
        "Vérifie que les destructeurs de tes classes ne lèvent jamais.",
        "Teste : si une exception survient à mi-chemin d'un constructeur, les ressources déjà acquises sont-elles libérées ?"
      ],
      check: "Si une exception survient après l'acquisition d'une ressource mais avant la fin du constructeur, que se passe-t-il pour les ressources déjà acquises ?"
    },
    {
      focus: "La garantie forte est un commit or rollback : soit l'opération réussit complètement, soit l'état est identique à avant. Le pattern copy-and-swap en est la technique classique, mais elle a un coût — la copie préalable. On ne vise pas la garantie forte partout, mais sur les opérations critiques.",
      retenir: [
        "copy-and-swap : copie dans le paramètre (peut échouer), swap noexcept (ne peut pas).",
        "La garantie forte ne s'applique pas gratuitement — il faut souvent une copie préalable."
      ],
      pitfalls: [
        "Croire que la garantie forte est toujours atteignable sans copie.",
        "Viser la garantie forte sur une opération fréquente sans mesurer le coût."
      ],
      method: [
        "Identifie les opérations où un état intermédiaire serait catastrophique.",
        "Applique copy-and-swap pour ces opérations.",
        "Pour les opérations fréquentes ou légères, la garantie de base suffit généralement."
      ],
      check: "Dans quel cas la garantie forte n'est-elle pas atteignable sans une copie complète de l'état ?"
    },
    {
      focus: "noexcept est un contrat visible dans la signature. Il dit à l'appelant : 'cette fonction ne lèvera jamais'. Ce contrat permet au compilateur et aux conteneurs STL de choisir le move au lieu de la copie lors des réallocations, ce qui peut changer radicalement les performances.",
      retenir: [
        "Move constructor et swap devraient presque toujours être noexcept.",
        "std::vector utilise le move lors des réallocations uniquement si celui-ci est noexcept."
      ],
      pitfalls: [
        "Marquer noexcept par habitude sans vérifier que les appels internes ne peuvent pas lever.",
        "Oublier noexcept sur le move constructor et perdre l'optimisation STL sans s'en rendre compte."
      ],
      method: [
        "Ajoute noexcept uniquement après avoir vérifié que tous les appels internes sont eux-mêmes noexcept ou ne lèvent pas.",
        "Commence par les destructeurs, swaps et moves — ce sont les candidats naturels.",
        "Utilise static_assert avec std::is_nothrow_move_constructible pour vérifier en compile time."
      ],
      check: "Pourquoi un swap bien conçu devrait-il presque toujours être noexcept ?"
    },
    {
      focus: "std::optional communique une intention : 'cette valeur peut légitimement ne pas exister'. C'est différent d'une erreur. Accéder à un optional sans vérification est un bug tout comme accéder à un pointeur nul — l'API est safe mais pas magique.",
      retenir: [
        "optional exprime une absence normale et fréquente, pas une erreur.",
        "Accéder à .value() sur un optional vide lève std::bad_optional_access — toujours vérifier."
      ],
      pitfalls: [
        "Utiliser optional comme remplacement universel des exceptions — perdre le message d'erreur.",
        "Accéder à *opt ou opt->champ sans vérifier has_value() — comportement indéfini ou exception."
      ],
      method: [
        "Demande : est-ce que l'absence de valeur est un scénario normal (30 % des cas) ou un scénario exceptionnel ?",
        "Si normal → optional. Si exceptionnel ou si l'appelant a besoin d'un message → exception.",
        "Utilise value_or() pour fournir un défaut sans branchement explicite."
      ],
      check: "Une fonction recherche un étudiant dans une liste. 30 % des requêtes ne trouvent rien. optional ou exception — et pourquoi ?"
    }
  ]
});
})(window);
