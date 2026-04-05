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
  videoLesson,
  playlistVideo
} = registry.helpers;

registry.registerChapterBundle({
  order: 15,
  chapter: {
    id: "tests-qualite",
    shortTitle: "Tests et qualité",
    title: "Tests unitaires, TDD et qualité du code C++",
    level: "Projet",
    duration: "45 min",
    track: "Extension",
    summary:
      "Un code non testé est un code dont on ignore le comportement réel. Ce chapitre introduit les principes de vérification automatique, l'outillage pratique avec Catch2 et la discipline TDD pour écrire du C++ fiable.",
    goals: [
      "distinguer tests unitaires, tests d'intégration et tests de système",
      "écrire des cas de test lisibles avec Catch2 et les macros <code>REQUIRE</code> / <code>CHECK</code>",
      "comprendre et appliquer le cycle TDD rouge-vert-refactoring"
    ],
    highlights: ["REQUIRE", "Catch2", "TDD"],
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
      )
    ].join(""),
    checklist: [
      "Je sais distinguer test unitaire, d'intégration et de système.",
      "Je peux écrire un test simple avec <code>REQUIRE</code> et <code>CHECK</code>.",
      "Je teste les cas normaux, les cas limites et les cas d'erreur.",
      "Je comprends le cycle TDD rouge-vert-refactoring.",
      "Je ne teste pas les détails d'implémentation internes.",
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
        question: "Quelle macro Catch2 interrompt immédiatement le test en cas d'échec ?",
        options: ["<code>CHECK</code>", "<code>REQUIRE</code>", "<code>WARN</code>"],
        answer: 1,
        explanation: "<code>REQUIRE</code> arrête le test courant à l'échec ; <code>CHECK</code> continue et rapporte tous les problèmes rencontrés dans le test."
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
      }
    ],
    keywords: ["tests", "catch2", "tdd", "assert", "REQUIRE", "unitaire", "integration", "regression", "qualite", "test case", "rouge vert"]
  },
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
    }
  ]
});
})(window);
