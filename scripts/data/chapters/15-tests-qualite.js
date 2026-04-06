(function registerChapterBundle15(globalScope) {
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
  order: 15,
  chapter: withChapterTheme("tests-qualite", () => ({
    id: "tests-qualite",
    shortTitle: "Tests et qualité",
    title: "Tests unitaires, TDD et qualité du code C++",
    level: "Projet",
    duration: "1 h 20",
    track: "Extension",
    summary:
      "Un code non testé est un code dont on ne connaît pas vraiment le comportement. Ce chapitre introduit la vérification automatique, l'outillage pratique avec Catch2, la logique TDD, mais aussi la conception testable, les doubles de test et le lien entre tests, debug, coverage et qualité globale.",
    goals: [
      "distinguer tests unitaires, tests d'intégration et tests de système sans mélanger leurs rôles",
      "écrire des cas de test lisibles avec Catch2 et les macros <code>REQUIRE</code> / <code>CHECK</code>, en structurant correctement les scénarios",
      "comprendre et appliquer le cycle TDD rouge-vert-refactoring sur un petit exemple réel, puis relier les tests à une conception plus découplée et plus vérifiable"
    ],
    highlights: ["REQUIRE", "CHECK", "Catch2", "TDD", "fixtures", "test doubles"],
    body: [
      lesson(
        "Pourquoi tester et quelle stratégie adopter",
        paragraphs(
          "Un test est une affirmation exécutable : pour cette entrée, j'attends cette sortie. Quand il échoue, il localise un problème précis. Sans tests, chaque modification du code risque d'introduire silencieusement une régression.",
          "On distingue les tests unitaires, qui vérifient un module en isolation, les tests d'intégration, qui vérifient la coopération entre modules, et les tests de système, qui vérifient l'ensemble. En C++ pédagogique, les tests unitaires sont le point d'entrée le plus rentable."
        ),
        table(
          ["Type", "Cible", "Isolation"],
          [
            ["Test unitaire", "Une classe ou une fonction", "Maximale : dépendances minimales ou substituées."],
            ["Test d'intégration", "Plusieurs modules ensemble", "Partielle."],
            ["Test de système", "Comportement complet du programme", "Nulle."]
          ]
        ),
        callout("success", "Bonne règle de départ", "Un test unitaire doit être rapide, déterministe et ne tester qu'une seule chose à la fois.")
      ),
      lesson(
        "Écrire du code testable : découpage, dépendances et déterminisme",
        paragraphs(
          "Un bon chapitre sur les tests ne peut pas s'arrêter au framework. Beaucoup de difficultés de test viennent d'un design qui mélange trop de responsabilités : lecture de fichiers, horloge système, génération aléatoire, logique métier et affichage dans la même fonction. Un code difficile à tester est souvent aussi difficile à relire et à faire évoluer.",
          "Le bon réflexe consiste à isoler le cœur métier des entrées/sorties et des dépendances volatiles. Plus une fonction est pure ou au moins clairement paramétrée, plus elle devient simple à vérifier. Les tests révèlent donc souvent des besoins de découplage plutôt qu'un simple manque d'outillage."
        ),
        code(
          "cpp",
          `
// Moins testable : lit, calcule et affiche dans la meme fonction
void traiterFichierEtAfficher();

// Plus testable : logique pure separée de l'I/O
double calculerMoyenne(const std::vector<double>& notes);
          `,
          "La testabilite commence souvent dans le design"
        ),
        bullets([
          "Séparer logique métier et I/O réduit fortement le coût des tests.",
          "Une fonction déterministe est beaucoup plus facile à vérifier qu'un bloc qui dépend de l'heure, du hasard ou du disque.",
          "Rendre une dépendance injectable ou paramétrable aide souvent plus qu'ajouter un framework de mocking."
        ]),
        callout("info", "Fil directeur", "Si un morceau de code est pénible à tester, demande-toi d'abord s'il n'essaie pas de faire trop de choses à la fois.")
      ),
      lesson(
        "Premiers tests avec Catch2",
        paragraphs(
          "Catch2 est un framework de tests header-only très répandu en C++. Il permet d'écrire des cas de test lisibles avec des macros comme <code>TEST_CASE</code>, <code>REQUIRE</code> et <code>CHECK</code>.",
          "<code>REQUIRE</code> interrompt le test courant en cas d'échec ; <code>CHECK</code> continue et rapporte tous les échecs accumulés. L'enjeu est d'écrire des tests qui documentent le comportement attendu, pas seulement ceux qui 'semblent passer'."
        ),
        code(
          "cpp",
          `
#define CATCH_CONFIG_MAIN
#include <catch2/catch.hpp>

#include "fraction.h"

TEST_CASE("Fraction : valeur décimale correcte") {
    Fraction f{1, 4};
    REQUIRE(f.valeur() == Approx(0.25));
}

TEST_CASE("Fraction : dénominateur nul interdit") {
    REQUIRE_THROWS_AS(Fraction(1, 0), std::invalid_argument);
}

TEST_CASE("Fraction : addition de deux fractions") {
    Fraction a{1, 2};
    Fraction b{1, 3};
    Fraction c = a + b;
    REQUIRE(c.valeur() == Approx(5.0 / 6.0));
}
          `,
          "Tests Catch2 simples"
        ),
        bullets([
          "<code>Approx</code> gère les comparaisons à virgule flottante avec une tolérance configurable.",
          "Le nom du <code>TEST_CASE</code> décrit le comportement testé, pas l'implémentation.",
          "Couvre au minimum : cas normal, valeur limite, erreur attendue."
        ]),
        callout("info", "Intégration dans CMake", "Catch2 s'intègre facilement avec CMake via <code>FetchContent</code> ou un sous-module git, sans dépendance externe à installer manuellement.")
      ),
      lesson(
        "Sections, fixtures et doubles de test",
        paragraphs(
          "Quand plusieurs scénarios partagent le même contexte de départ, il devient utile de factoriser l'installation du test. Catch2 propose pour cela des <em>sections</em> et permet aussi de structurer des aides communes. L'idée n'est pas d'introduire de la magie, mais d'éviter la duplication tout en gardant chaque scénario lisible.",
          "Dans des cas plus avancés, on peut aussi introduire des doubles de test : stubs, fakes ou objets simulés. L'objectif n'est pas de tout moquer, mais d'isoler l'unité testée lorsqu'une vraie dépendance serait trop lourde, instable ou non déterministe."
        ),
        code(
          "cpp",
          `
TEST_CASE("Compte : retraits") {
    Compte compte{100.0};

    SECTION("retrait valide") {
        compte.retirer(20.0);
        REQUIRE(compte.solde() == Approx(80.0));
    }

    SECTION("retrait trop grand") {
        REQUIRE_THROWS(compte.retirer(200.0));
    }
}
          `,
          "Deux scenarios sur le meme contexte initial"
        ),
        table(
          ["Technique", "Usage"],
          [
            ["Section", "Varier plusieurs scénarios à partir d'un même contexte de départ."],
            ["Fixture légère", "Mutualiser une préparation répétée entre plusieurs tests."],
            ["Stub/Fake", "Remplacer une dépendance externe coûteuse ou instable."],
            ["Mock", "Vérifier certaines interactions quand cela a un vrai sens métier."]
          ]
        ),
        callout("warn", "À utiliser avec mesure", "Les doubles de test sont utiles, mais ils ne doivent pas devenir un écran de fumée qui remplace un vrai design simple et découplé.")
      ),
      lesson(
        "TDD : rouge, vert, refactoring",
        paragraphs(
          "Le Test-Driven Development propose d'écrire le test avant le code. Le cycle est : rouge (le test échoue car le code n'existe pas), vert (écrire le minimum pour faire passer le test), refactoring (améliorer sans casser les tests existants).",
          "Cette discipline force à penser l'API depuis l'usage avant de concevoir l'implémentation. Les interfaces qui émergent du TDD sont souvent plus simples et mieux délimitées."
        ),
        code(
          "cpp",
          `
// Étape 1 — Rouge : le test est écrit en premier
TEST_CASE("CompteBancaire : un dépôt augmente le solde") {
    CompteBancaire compte{100.0};
    compte.deposer(50.0);
    REQUIRE(compte.solde() == Approx(150.0));
}

// Étape 2 — Vert : implémentation minimale pour passer le test
class CompteBancaire {
public:
    explicit CompteBancaire(double solde) : solde_{solde} {}
    void deposer(double montant) { solde_ += montant; }
    double solde() const { return solde_; }
private:
    double solde_;
};

// Étape 3 — Refactoring : ajouter les contraintes et améliorer
          `,
          "Cycle TDD illustré sur CompteBancaire"
        ),
        callout("info", "TDD n'est pas obligatoire partout", "TDD est une pratique, pas une règle absolue. L'essentiel est d'avoir des tests utiles ; leur ordre d'écriture dépend du contexte et de la maturité du projet.")
      ),
      lesson(
        "Ce qu'un bon test vérifie — et ce qu'il évite",
        paragraphs(
          "Un bon test vérifie le comportement observable, pas les détails d'implémentation. Un test qui dépend des noms de méthodes privées ou du layout interne casse à chaque refactoring sain et décourage la maintenance.",
          "Les cas limites méritent une attention particulière : valeurs nulles, bords de tableau, fichier inexistant, entrée maximale. Ce sont souvent les oublis qui créent des bugs en production."
        ),
        table(
          ["À tester", "À éviter dans un test unitaire"],
          [
            ["Comportement observable par l'interface publique", "Détails d'implémentation internes."],
            ["Cas limites et comportements en erreur", "Logique triviale sans branche réelle."],
            ["Invariants importants de la classe", "Noms de membres ou méthodes privées."],
            ["Contrats des signatures publiques", "Ordre interne d'exécution."]
          ]
        ),
        callout("warn", "Fausse sécurité", "Un taux de couverture élevé ne signifie pas que les bons cas sont testés. Quelques tests précis sur les invariants valent mieux que beaucoup de tests superficiels.")
      ),
      lesson(
        "Coverage, CI et autres filets de qualité",
        paragraphs(
          "Les tests automatiques s'inscrivent dans un ensemble plus large de filets de qualité. La couverture de code peut aider à repérer des zones jamais exécutées, mais elle ne remplace pas la réflexion sur les scénarios utiles. Les warnings, sanitizers et l'exécution des tests en intégration continue rendent l'ensemble beaucoup plus fiable qu'un simple 'ça marche chez moi'.",
          "Le point important est de ne pas opposer ces outils. Les tests décrivent le comportement attendu. Les sanitizers révèlent certains comportements indéfinis. La CI garantit que la vérification tourne de manière répétable. Ensemble, ils rendent les régressions plus visibles et moins coûteuses."
        ),
        table(
          ["Outil", "Rôle principal"],
          [
            ["Tests unitaires", "Vérifier des comportements précis automatiquement."],
            ["Coverage", "Repérer des zones peu ou jamais exécutées."],
            ["Sanitizers", "Détecter tôt certains bugs mémoire ou UB."],
            ["CI", "Relancer compilation et tests de manière reproductible à chaque changement."]
          ]
        ),
        callout("success", "Vision d'ensemble", "La qualité n'est pas un seul outil miracle. C'est un empilement de retours rapides qui rendent les bugs visibles plus tôt.")
      )
    ].join(""),
    checklist: [
      "Je sais distinguer test unitaire, d'intégration et de système.",
      "Je peux écrire un test simple avec <code>REQUIRE</code> et <code>CHECK</code>.",
      "Je peux expliquer pourquoi un design découplé et déterministe facilite fortement les tests.",
      "Je sais à quoi servent les sections ou une fixture légère dans un framework de test.",
      "Je teste les cas normaux, les cas limites et les cas d'erreur.",
      "Je comprends le cycle TDD rouge-vert-refactoring.",
      "Je ne teste pas les détails d'implémentation internes.",
      "Je peux expliquer pourquoi couverture, sanitizers et CI complètent les tests au lieu de les remplacer.",
      "Je nomme mes tests par le comportement attendu, pas par le mécanisme."
    ],
    quiz: [
      {
        question: "Quel est le but premier d'un test unitaire ?",
        options: [
          "Prouver que le programme compile sans erreur ni warning",
          "Vérifier le comportement d'une unité en isolation et détecter les régressions",
          "Remplacer la relecture de code par un pair"
        ],
        answer: 1,
        explanation: "Un test unitaire documente le comportement attendu et alerte automatiquement en cas de régression lors d'une modification future."
      },
      {
        question: "Dans le cycle TDD, que désigne la phase 'rouge' ?",
        options: [
          "Le code produit une erreur mémoire à l'exécution",
          "Un test écrit avant le code échoue, comme prévu",
          "La compilation produit des warnings bloquants"
        ],
        answer: 1,
        explanation: "En TDD, le test est écrit en premier : il échoue d'abord (rouge) parce que le code n'existe pas encore, puis on implémente pour le faire passer (vert)."
      },
      {
        question: "Pourquoi un code très couplé à l'I/O ou au hasard est-il souvent plus difficile à tester ?",
        options: [
          "Parce qu'il est moins déterministe et mélange plusieurs responsabilités",
          "Parce que Catch2 interdit les fonctions longues",
          "Parce que le compilateur refuse alors les tests"
        ],
        answer: 0,
        explanation: "Ce n'est pas une limitation du framework : c'est un problème de conception. Plus le code dépend de l'extérieur, plus il devient coûteux à isoler et à vérifier proprement."
      },
      {
        question: "Quelle macro Catch2 interrompt immédiatement le test en cas d'échec ?",
        options: ["<code>CHECK</code>", "<code>REQUIRE</code>", "<code>WARN</code>"],
        answer: 1,
        explanation: "<code>REQUIRE</code> arrête le test courant à l'échec ; <code>CHECK</code> continue et rapporte tous les problèmes rencontrés dans le test."
      },
      {
        question: "Quel énoncé décrit le mieux la couverture de code ?",
        options: [
          "Un indicateur utile, mais qui ne garantit pas que les bons comportements soient testés",
          "Une preuve absolue qu'il n'y a plus aucun bug",
          "Un remplacement complet des tests d'intégration"
        ],
        answer: 0,
        explanation: "La couverture peut éclairer des zones oubliées, mais elle ne dit pas à elle seule si les scénarios importants ont été bien choisis."
      }
    ],
    exercises: [
      {
        title: "Suite de tests pour Fraction",
        difficulty: "Intermédiaire",
        time: "30 min",
        prompt: "Écris une suite de tests Catch2 pour une classe <code>Fraction</code> : cas normaux, cas limites et exceptions.",
        deliverables: [
          "au moins cinq tests couvrant des comportements distincts",
          "un test d'erreur avec <code>REQUIRE_THROWS_AS</code>",
          "un bref commentaire sur les cas qui restent non couverts"
        ]
      },
      {
        title: "Mini session TDD sur une Pile générique",
        difficulty: "Avancé",
        time: "40 min",
        prompt: "Développe une classe <code>Pile&lt;T&gt;</code> en TDD : rédige d'abord les tests, implémente ensuite le strict minimum pour les faire passer.",
        deliverables: [
          "les tests rédigés avant toute implémentation",
          "l'implémentation minimale qui fait passer les tests",
          "les cas limites couverts : pile vide, dépilement sur pile vide"
        ]
      },
      {
        title: "Rendre un module testable",
        difficulty: "Avancé",
        time: "35 min",
        prompt: "Choisis un module trop couplé à l'I/O, au temps ou au hasard, puis refactorise-le pour le rendre testable. L'objectif est de montrer que les tests améliorent aussi la conception, pas seulement la vérification finale.",
        deliverables: [
          "la version initiale avec les dépendances qui gênent les tests",
          "la version refactorisée plus découplée",
          "deux ou trois tests qui deviennent possibles grâce à cette refonte"
        ]
      }
    ],
    keywords: ["tests", "catch2", "tdd", "assert", "REQUIRE", "CHECK", "fixture", "test doubles", "unitaire", "integration", "regression", "qualite", "coverage", "ci", "test case", "rouge vert"]
  })),
  deepDives: [
    {
      focus: "Tester n'est pas une étape facultative pour 'être sûr' : c'est un outil de conception. Un test bien écrit force à clarifier ce que doit faire une fonction avant de l'implémenter, ce qui conduit souvent à une meilleure interface et à un code plus simple.",
      retenir: [
        "Un test unitaire vérifie le comportement observable, pas l'implémentation interne.",
        "La valeur d'un test se mesure à sa capacité à détecter une régression, pas à sa quantité."
      ],
      pitfalls: [
        "Écrire des tests qui vérifient l'implémentation plutôt que le comportement : ils cassent à chaque refactoring sain.",
        "Confondre couverture de code élevée et qualité des tests."
      ],
      method: [
        "Pour chaque unité, énumère les cas normaux, les cas limites et les cas d'erreur.",
        "Nomme chaque test par le comportement attendu, pas par le mécanisme testé.",
        "Commence par les tests des invariants les plus importants de la classe ou de la fonction."
      ],
      check: "Peux-tu écrire les tests d'une fonction avant d'en connaître l'implémentation exacte ?"
    },
    {
      focus: "Catch2 rend les tests lisibles parce que les macros expriment des assertions en langage presque naturel. Mais l'outil n'est pas l'essentiel : c'est la rigueur dans le choix des cas testés qui fait la différence entre des tests utiles et du bruit.",
      retenir: [
        "<code>REQUIRE</code> arrête le test à l'échec ; <code>CHECK</code> continue pour rapporter tous les problèmes du test.",
        "<code>Approx</code> permet de comparer des flottants sans dépendre de l'égalité exacte."
      ],
      pitfalls: [
        "Utiliser <code>CHECK</code> là où <code>REQUIRE</code> s'impose : continuer après un état incohérent masque la vraie cause.",
        "Oublier les cas d'erreur et les exceptions dans les tests."
      ],
      method: [
        "Écris un <code>TEST_CASE</code> par comportement à vérifier, pas par classe ou par méthode.",
        "Utilise <code>REQUIRE</code> pour les préconditions et les résultats critiques.",
        "Couvre au minimum : cas normal, valeur limite, erreur attendue."
      ],
      check: "Pourrais-tu donner le même nom à deux TEST_CASEs distincts ? Que t'apprendrait cette situation sur la clarté de tes tests ?"
    },
    {
      focus: "La testabilité est souvent un révélateur de design. Un code trop couplé à l'I/O, à l'heure système ou à des dépendances difficiles à contrôler devient laborieux à tester précisément. Les tests aident alors à voir où le découpage devrait être clarifié.",
      retenir: [
        "Un code plus déterministe est généralement plus simple à tester et à maintenir.",
        "Séparer logique métier et infrastructure rend les tests à la fois plus rapides et plus ciblés."
      ],
      pitfalls: [
        "Ajouter des frameworks de mocking pour compenser un design qui mélange trop de responsabilités.",
        "Prendre un test difficile comme une fatalité plutôt que comme un symptôme architectural."
      ],
      method: [
        "Repère les dépendances externes qui rendent le test instable ou coûteux.",
        "Isole la logique pure ou rends la dépendance paramétrable.",
        "Réécris ensuite les tests sur cette frontière plus claire."
      ],
      check: "Quand un module devient pénible à tester, penses-tu d'abord à l'outil de test ou au découpage du code ?"
    },
    {
      focus: "TDD change l'ordre d'écriture, pas seulement la séquence des actions. Son vrai bénéfice est de forcer à penser l'interface depuis l'usage avant l'implémentation. Quand on écrit le test en premier, on adopte naturellement le point de vue de l'appelant.",
      retenir: [
        "Rouge : test échoue (code inexistant). Vert : code minimal qui fait passer. Refactoring : améliorer sans casser.",
        "Le cycle TDD est court : on ne vise pas 'tout implémenter', mais 'faire passer ce test précis'."
      ],
      pitfalls: [
        "Écrire trop de code pendant la phase verte et contourner la discipline du cycle court.",
        "Refactorer avant que tous les tests soient verts."
      ],
      method: [
        "Commence par le test le plus simple qui peut échouer.",
        "Implémente juste assez pour le faire passer, pas plus.",
        "Refactorise seulement quand tous les tests existants sont verts."
      ],
      check: "Qu'est-ce que le compilateur te dirait si tu écrivais uniquement les tests d'une classe sans son implémentation ?"
    },
    {
      focus: "Un bon test vérifie le comportement, pas l'implémentation. Cette distinction est subtile mais décisive : un test dépendant des détails internes casse à chaque refactoring sain et finit par décourager les améliorations de code.",
      retenir: [
        "Teste par l'interface publique : ce qu'un appelant légitime peut observer.",
        "Les cas limites révèlent souvent plus de bugs que les cas normaux."
      ],
      pitfalls: [
        "Un taux de couverture élevé ne garantit pas des tests pertinents.",
        "Tester des méthodes privées directement fragilise les tests sans apporter de valeur supplémentaire."
      ],
      method: [
        "Pour chaque test, demande-toi : quel invariant ou quelle promesse de l'interface vérifie-t-il ?",
        "Ajoute un test à chaque bug corrigé pour éviter la régression.",
        "Garde les tests rapides et indépendants les uns des autres."
      ],
      check: "Si tu renommes un attribut privé d'une classe, combien de tes tests devraient casser idéalement ?"
    },
    {
      focus: "La qualité ne vient pas d'un seul outil. Tests, coverage, warnings, sanitizers et CI se renforcent mutuellement : les tests décrivent le comportement, les sanitizers révèlent certaines erreurs d'exécution, la CI répète le tout sans oublier et la couverture aide à repérer des zones aveugles.",
      retenir: [
        "La couverture est un indicateur d'exploration, pas une preuve de qualité.",
        "La CI transforme des vérifications ponctuelles en discipline continue."
      ],
      pitfalls: [
        "S'abriter derrière un pourcentage de coverage sans regarder les scénarios réellement critiques.",
        "Faire tourner les tests uniquement localement et oublier de les automatiser dans la boucle du projet."
      ],
      method: [
        "Définis d'abord les comportements critiques à protéger par des tests.",
        "Ajoute ensuite warnings, sanitizers et CI pour compléter ce filet.",
        "Lis la couverture comme une carte des zones peu vérifiées, pas comme une médaille en soi."
      ],
      check: "Si tous les tests passent mais qu'un sanitizer crie sur un comportement indéfini, considéreras-tu vraiment la qualité comme acquise ?"
    }
  ]
});
})(window);
