(function registerChapterBundle14(globalScope) {
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
  order: 14,
  chapter: withChapterTheme("concurrence-threads", () => ({
    id: "concurrence-threads",
    shortTitle: "Concurrence",
    title: "Threads, synchronisation et programmation concurrente",
    level: "Avancé",
    duration: "55 min",
    track: "Extension",
    summary:
      "Le C++ standard permet de lancer plusieurs fils d'exécution sans dépendre d'une bibliothèque externe. Ce chapitre pose les bases: lancer un thread, protéger une donnée partagée et récupérer proprement le résultat d'une tâche asynchrone.",
    goals: [
      "créer et synchroniser des <code>std::thread</code> sans oublier leur fin de vie",
      "protéger une ressource partagée avec <code>std::mutex</code> et <code>std::lock_guard</code>",
      "déléguer une tâche asynchrone avec <code>std::async</code> puis récupérer son résultat via <code>std::future</code>"
    ],
    highlights: ["thread", "mutex", "async", "future"],
    body: [
      lesson(
        "Le modèle de concurrence du C++",
        paragraphs(
          "Depuis C++11, la norme inclut un modèle de mémoire multithreads et une bibliothèque de concurrence portable. Un <em>thread</em> est un fil d'exécution indépendant qui partage la mémoire du processus avec les autres threads.",
          "La difficulté fondamentale est que plusieurs threads accédant à la même donnée sans synchronisation créent un <em>data race</em> : comportement indéfini garanti. Comprendre ce risque avant d'écrire du code concurrent est la première étape indispensable."
        ),
        table(
          ["Abstraction", "Rôle"],
          [
            ["<code>std::thread</code>", "Créer et gérer un fil d'exécution."],
            ["<code>std::mutex</code>", "Protéger une section critique."],
            ["<code>std::lock_guard</code>", "Verrouillage RAII d'un mutex."],
            ["<code>std::async</code>", "Lancer une tâche asynchrone avec retour de valeur."],
            ["<code>std::future</code>", "Récupérer le résultat d'une tâche asynchrone."]
          ]
        ),
        callout("warn", "Data race : comportement indéfini", "Lire et écrire la même variable depuis plusieurs threads sans synchronisation est un comportement indéfini. Le programme peut sembler fonctionner, puis se comporter de façon erratique sous charge.")
      ),
      lesson(
        "std::thread : création, join et detach",
        paragraphs(
          "Un <code>std::thread</code> démarre à sa construction et exécute la fonction passée en argument. Avant la destruction de l'objet thread, il faut impérativement appeler <code>join()</code> ou <code>detach()</code>, sous peine de termination du programme.",
          "<code>join()</code> bloque le thread appelant jusqu'à la fin du thread cible. <code>detach()</code> laisse le thread vivre indépendamment, sans possibilité de récupérer son résultat ni de détecter sa fin. Dans la majorité des cas pédagogiques, <code>join()</code> est le bon choix."
        ),
        code(
          "cpp",
          `
#include <thread>
#include <iostream>

void traitement(int id) {
    std::cout << "Thread " << id << " en cours\\n";
}

int main() {
    std::thread t1{traitement, 1};
    std::thread t2{traitement, 2};

    t1.join();
    t2.join();

    std::cout << "Tous les threads ont terminé\\n";
}
          `,
          "Création et synchronisation de threads"
        ),
        code(
          "cpp",
          `
std::thread t{[](int n) {
    for (int i = 0; i < n; ++i) {
        std::cout << i << '\\n';
    }
}, 5};

t.join();
          `,
          "Thread avec lambda"
        ),
        callout("danger", "Piège majeur", "Si un objet <code>std::thread</code> est détruit sans join ni detach, le programme appelle <code>std::terminate()</code>. Utilise un garde RAII ou vérifie toujours l'état avant la destruction de l'objet.")
      ),
      lesson(
        "Mutex, lock_guard et protection des données partagées",
        paragraphs(
          "Le mutex est la primitive de synchronisation de base. Il garantit qu'un seul thread à la fois accède à une section critique. <code>std::lock_guard</code> verrouille le mutex à la construction et le déverrouille automatiquement à la destruction, suivant le principe RAII.",
          "Il faut protéger tous les accès à une donnée partagée, en lecture comme en écriture. Un mutex appliqué seulement aux écritures laisse passer les data races sur les lectures concurrentes."
        ),
        code(
          "cpp",
          `
#include <mutex>
#include <thread>
#include <iostream>

std::mutex verrou;
int compteur{0};

void incrementer(int n) {
    for (int i = 0; i < n; ++i) {
        std::lock_guard<std::mutex> garde{verrou};
        ++compteur;
    }
}

int main() {
    std::thread t1{incrementer, 1000};
    std::thread t2{incrementer, 1000};
    t1.join();
    t2.join();
    std::cout << compteur << '\\n'; // garantit 2000
}
          `,
          "Compteur partagé protégé"
        ),
        bullets([
          "<code>std::lock_guard</code> est libéré automatiquement même en cas d'exception.",
          "Minimise la taille de la section critique pour ne pas bloquer les autres threads inutilement.",
          "<code>std::unique_lock</code> est plus flexible que <code>lock_guard</code> mais implique un coût supplémentaire.",
          "Acquérir plusieurs mutex dans des ordres différents selon les threads est la recette classique du deadlock."
        ])
      ),
      lesson(
        "std::async et std::future : tâches asynchrones de haut niveau",
        paragraphs(
          "<code>std::async</code> lance une tâche dans un thread séparé et renvoie un <code>std::future</code>. Ce future permet de récupérer le résultat plus tard, de façon synchronisée, sans gérer soi-même les threads ni les mutex.",
          "C'est souvent l'abstraction la plus pratique pour un calcul parallèle ponctuel : on démarre les tâches, on continue d'autres traitements si possible, puis on récupère les résultats quand on en a besoin."
        ),
        code(
          "cpp",
          `
#include <future>
#include <iostream>

int calculerSomme(int debut, int fin) {
    int total = 0;
    for (int i = debut; i <= fin; ++i) {
        total += i;
    }
    return total;
}

int main() {
    auto f1 = std::async(std::launch::async, calculerSomme, 1, 5000);
    auto f2 = std::async(std::launch::async, calculerSomme, 5001, 10000);

    int resultat = f1.get() + f2.get();
    std::cout << "Somme : " << resultat << '\\n';
}
          `,
          "Calcul parallèle avec async"
        ),
        table(
          ["Méthode", "Comportement"],
          [
            ["<code>.get()</code>", "Bloque jusqu'au résultat et le retourne (ou relance l'exception levée dans la tâche)."],
            ["<code>.wait()</code>", "Bloque sans récupérer la valeur."],
            ["<code>.valid()</code>", "Vérifie si le future est associé à une valeur en attente."]
          ]
        ),
        callout("info", "std::launch::async", "Sans la politique <code>std::launch::async</code> explicite, l'exécution peut être différée (lazy). Spécifie-la pour garantir un vrai parallélisme.")
      )
    ].join(""),
    checklist: [
      "Je comprends ce qu'est un data race et pourquoi c'est un comportement indéfini.",
      "Je sais créer un thread, lui passer des arguments et appeler <code>join()</code>.",
      "Je protège les données partagées avec un mutex et <code>std::lock_guard</code>.",
      "Je connais la différence de sémantique entre <code>join()</code> et <code>detach()</code>.",
      "Je sais utiliser <code>std::async</code> pour déléguer un calcul dans un thread.",
      "Je récupère un résultat asynchrone via <code>std::future::get()</code>.",
      "Je minimise les sections critiques pour éviter les contentions inutiles."
    ],
    quiz: [
      {
        question: "Que se passe-t-il si un <code>std::thread</code> est détruit sans avoir été rejoint ni détaché ?",
        options: [
          "Le thread continue silencieusement en arrière-plan",
          "Le programme appelle <code>std::terminate()</code>",
          "Le thread est automatiquement rejoint par le runtime"
        ],
        answer: 1,
        explanation: "Détruire un thread joignable sans join ni detach déclenche <code>std::terminate()</code> : c'est une erreur de conception, pas un simple warning."
      },
      {
        question: "Quel outil garantit le déverrouillage d'un mutex même en cas d'exception ?",
        options: [
          "<code>std::thread</code>",
          "<code>std::lock_guard</code>",
          "<code>std::future</code>"
        ],
        answer: 1,
        explanation: "<code>lock_guard</code> suit le principe RAII : il déverrouille le mutex dans son destructeur, quelle que soit la cause de sortie de la portée."
      },
      {
        question: "Comment récupérer le résultat d'une tâche lancée avec <code>std::async</code> ?",
        options: [
          "En appelant <code>.result()</code> sur le thread",
          "En appelant <code>.get()</code> sur le <code>std::future</code> retourné",
          "En lisant directement la variable globale modifiée par la tâche"
        ],
        answer: 1,
        explanation: "<code>std::async</code> renvoie un <code>std::future</code> ; <code>.get()</code> bloque jusqu'à disponibilité du résultat et le retourne, ou relance l'exception."
      }
    ],
    exercises: [
      {
        title: "Calcul parallèle de statistiques",
        difficulty: "Avancé",
        time: "35 min",
        prompt: "Calcule la somme et la valeur maximale d'un grand vecteur en divisant le travail entre deux tâches <code>std::async</code>, puis agrège les résultats.",
        deliverables: [
          "les deux tâches asynchrones avec leur plage respective",
          "la récupération et l'agrégation correcte des résultats",
          "une vérification que le résultat est identique à la version séquentielle"
        ]
      },
      {
        title: "Compteur thread-safe encapsulé",
        difficulty: "Intermédiaire",
        time: "25 min",
        prompt: "Crée une classe <code>CompteurSur</code> qui encapsule un entier et un mutex pour garantir des incréments et lectures cohérents depuis plusieurs threads simultanés.",
        deliverables: [
          "la classe avec son mutex interne",
          "une démonstration avec deux threads qui incrémentent simultanément",
          "la vérification que le résultat final est toujours correct quel que soit l'entrelacement"
        ]
      }
    ],
    keywords: ["thread", "mutex", "lock_guard", "async", "future", "concurrence", "parallelisme", "synchronisation", "data race", "join", "detach"]
  })),
  deepDives: [
    {
      focus: "La concurrence n'est pas juste une question de performance ; c'est d'abord une question de correction. Un programme concurrent mal synchronisé peut sembler fonctionner pendant des heures, puis se comporter de façon imprévisible sous charge. Comprendre le data race avant d'écrire du code concurrent est le vrai point de départ.",
      retenir: [
        "Tout accès non synchronisé à une donnée partagée depuis plusieurs threads est un comportement indéfini.",
        "Le modèle de mémoire C++11 définit ce que le compilateur peut ou ne peut pas réordonner."
      ],
      pitfalls: [
        "Supposer que le code 'semble marcher' en test suffit à prouver l'absence de data race.",
        "Ignorer que le compilateur ou le processeur peut réordonner les instructions sans barrière mémoire."
      ],
      method: [
        "Identifie toutes les données accédées par plusieurs threads.",
        "Détermine qui lit et qui écrit chaque donnée partagée.",
        "Protège systématiquement ces accès avant de tester quoi que ce soit."
      ],
      check: "Pourrais-tu identifier dans un programme simple tous les endroits où une synchronisation est nécessaire ?"
    },
    {
      focus: "join() et detach() ne sont pas des détails techniques : ils expriment deux intentions radicalement différentes. Le premier dit 'j'attends ce thread', le second dit 'je n'en suis plus responsable'. Choisir entre les deux est une décision de conception, pas une formalité syntaxique.",
      retenir: [
        "Un thread détruit sans join ni detach termine le programme avec <code>std::terminate()</code>.",
        "detach() transfère la responsabilité au runtime ; join() maintient le contrôle dans le code appelant."
      ],
      pitfalls: [
        "Appeler join() sur un thread déjà rejoint provoque une exception.",
        "Utiliser detach() sans s'assurer que les données référencées restent valides pendant toute la durée du thread."
      ],
      method: [
        "Par défaut, préfère join() pour garder le contrôle sur la durée de vie des threads.",
        "Utilise detach() seulement pour des tâches réellement autonomes sans communication retour.",
        "Envisage un RAII wrapper pour garantir le join à la sortie de portée."
      ],
      check: "Dans quel scénario detach() est-il réellement justifié plutôt que simplement commode ?"
    },
    {
      focus: "Un mutex protège une section critique. L'enjeu n'est pas la taille du mutex mais celle de la section protégée : plus elle est grande, plus les threads attendent. L'optimisation d'un code concurrent commence souvent par la réduction des sections critiques.",
      retenir: [
        "<code>lock_guard</code> libère le mutex à la sortie de portée, même en cas d'exception.",
        "Protéger en lecture comme en écriture est indispensable ; une lecture non protégée d'une donnée écrite par un autre thread est aussi un data race."
      ],
      pitfalls: [
        "Acquérir deux mutex dans des ordres différents selon les chemins d'exécution : deadlock certain.",
        "Oublier de protéger les lectures qui semblent 'inoffensives'."
      ],
      method: [
        "Identifie la donnée partagée, puis toutes ses portes d'accès.",
        "Minimise la région protégée par le mutex.",
        "Documente clairement quel mutex protège quelle donnée."
      ],
      check: "Comment détecterais-tu qu'un deadlock est possible dans un code qui acquiert deux mutex ?"
    },
    {
      focus: "std::async et std::future sont l'abstraction de haut niveau pour les tâches parallèles ponctuelles. Plutôt que de gérer des threads et de la synchronisation manuellement, on exprime une tâche et on récupère son résultat quand on en a besoin — le runtime se charge du reste.",
      retenir: [
        "<code>std::async</code> avec <code>launch::async</code> garantit l'exécution dans un thread séparé.",
        "<code>future::get()</code> bloque jusqu'au résultat et propage les exceptions levées dans la tâche."
      ],
      pitfalls: [
        "Ne pas spécifier <code>launch::async</code> peut mener à une exécution différée non parallèle.",
        "Appeler <code>get()</code> deux fois sur le même future lève une exception."
      ],
      method: [
        "Utilise async pour des calculs indépendants que tu veux paralléliser sans gérer de threads.",
        "Lance plusieurs futures, puis collecte les résultats dans l'ordre qui fait sens.",
        "Gère les exceptions via try/catch autour de <code>get()</code>."
      ],
      check: "Réécrirais-tu ce calcul séquentiel en deux tâches async ? Si oui, quelles données chaque tâche ne doit-elle pas partager ?"
    }
  ]
});
})(window);
