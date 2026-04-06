(function registerChapterBundle4(globalScope) {
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
  order: 4,
  chapter: withChapterTheme("fonctions-references", () => ({
    id: "fonctions-references",
    shortTitle: "Fonctions et références",
    title: "Fonctions, surcharge, références et espaces de noms",
    level: "Fondations",
    duration: "1 h 10",
    track: "SE1",
    summary:
      "Une grande partie de la qualité d'un code C++ se joue dans ses signatures. Ce chapitre apprend à exprimer clairement copie, lecture, modification et absence possible, mais aussi à lire la forme complète d'une fonction, ses paramètres, sa valeur de retour, ses déclarations et son découpage entre header et source.",
    goals: [
      "choisir entre passage par valeur, <code>const T&amp;</code>, <code>T&amp;</code> et <code>T*</code> en fonction de l'intention",
      "lire une déclaration de fonction complète, distinguer prototype, définition, retour par valeur ou par référence, et éviter les erreurs de durée de vie",
      "utiliser surcharge et paramètres par défaut sans fabriquer d'ambiguïté inutile, puis organiser une petite API avec namespace, header propre et signatures lisibles"
    ],
    highlights: ["const&", "T&", "prototype", "return", "namespace", "header", "API"],
    body: [
      lesson(
        "Modèle mental : une signature est un contrat",
        paragraphs(
          "Une signature de fonction doit répondre à trois questions : est-ce que je copie la donnée, est-ce que je la lis sans la copier, est-ce que je peux la modifier ? Tant que ces trois questions restent floues, l'API reste coûteuse à relire et facile à mal utiliser.",
          "Si tu n'as jamais fait de C, retiens ce réflexe : en C++ moderne, la référence est souvent la meilleure porte d'entrée pour exprimer un lien avec un objet existant. Le pointeur n'est pas interdit, mais il doit raconter quelque chose de plus, comme une absence possible ou une relation non obligatoire."
        ),
        table(
          ["Signature", "Intention"],
          [
            ["<code>void f(int x)</code>", "Copie locale : bon choix pour les petits types simples."],
            ["<code>void f(const std::string& s)</code>", "Lecture seule sans copie coûteuse."],
            ["<code>void f(Point& p)</code>", "Modification explicite de l'objet reçu."],
            ["<code>void f(Node* n)</code>", "Adresse éventuellement absente ou API bas niveau."]
          ]
        ),
        callout("info", "Question directrice", "Quand tu écris une signature, ne commence pas par la syntaxe. Commence par la phrase métier : je lis, je modifie, je copie ou j'accepte qu'il n'y ait rien.")
      ),
      lesson(
        "Anatomie complète d'une fonction : nom, paramètres, retour et prototype",
        paragraphs(
          "Avant même de parler de références, il faut savoir lire la forme complète d'une fonction. Le type placé avant le nom décrit ce qui est renvoyé. La liste entre parenthèses décrit ce que l'appelant doit fournir. Le prototype annonce l'existence et le contrat d'une fonction ; la définition apporte ensuite son corps.",
          "Cette distinction devient très importante dès qu'un projet comporte plusieurs fichiers. Le header expose les prototypes utiles à d'autres fichiers. Le source contient les définitions. Comprendre cela tôt évite beaucoup de confusion sur ce qu'une fonction 'est' et ce qu'un fichier a besoin de connaître."
        ),
        code(
          "cpp",
          `
double moyenne(const std::vector<double>& notes); // prototype

double moyenne(const std::vector<double>& notes) { // definition
    double total{0.0};

    for (double note : notes) {
        total += note;
    }

    return notes.empty() ? 0.0 : total / notes.size();
}
          `,
          "Meme contrat, puis implementation concrete"
        ),
        table(
          ["Élément", "Rôle"],
          [
            ["Type de retour", "Décrit la valeur renvoyée au code appelant."],
            ["Nom de fonction", "Porte l'intention métier de l'opération."],
            ["Paramètres", "Décrivent les données d'entrée et leur contrat d'usage."],
            ["Prototype", "Annonce la fonction sans exposer son implémentation."],
            ["Définition", "Donne le corps réellement exécuté."]
          ]
        ),
        callout("success", "Réflexe de lecture", "Quand tu rencontres une fonction, lis-la dans cet ordre : qu'est-ce qu'elle renvoie, comment s'appelle-t-elle, qu'attend-elle en entrée, puis seulement comment elle s'implémente.")
      ),
      lesson(
        "Exemple minimal : même donnée, contrats différents",
        paragraphs(
          "Observe maintenant un petit ensemble de fonctions qui racontent des intentions différentes sans changer de domaine. Le but n'est pas de collectionner des syntaxes, mais de voir qu'un choix de paramètre change ce que l'appelant a le droit d'attendre.",
          "Sur des objets lourds comme <code>std::string</code> ou <code>std::vector</code>, ce choix a aussi un effet sur les performances : copier inutilement un gros objet juste pour le lire est souvent un mauvais signal de conception."
        ),
        code(
          "cpp",
          `
double moyenne(const std::vector<double>& notes);
void normaliser(std::vector<double>& notes);
void afficherTitre(std::string titre);
void afficherNoteOptionnelle(const int* note);
          `,
          "Quatre signatures, quatre contrats"
        ),
        bullets([
          "<code>const T&amp;</code> évite une copie tout en promettant la lecture seule.",
          "<code>T&amp;</code> signale une modification voulue sur l'objet existant.",
          "<code>T</code> copie : utile si l'on veut une donnée locale indépendante.",
          "<code>T*</code> peut exprimer qu'il n'y a peut-être pas d'objet à traiter."
        ]),
        callout("success", "Exemple minimal avant les variantes", "Si tu hésites, choisis d'abord entre <code>T</code>, <code>const T&amp;</code> et <code>T&amp;</code>. Le pointeur vient ensuite quand l'absence ou l'adresse doivent être explicites.")
      ),
      lesson(
        "Valeur de retour, références de retour et durée de vie",
        paragraphs(
          "Le contrat d'une fonction ne s'arrête pas à ses paramètres. Il faut aussi réfléchir à ce qu'elle renvoie. Retourner par valeur est souvent le choix le plus simple et le plus sûr. Retourner une référence ou un pointeur n'est juste que si la cible renvoyée reste valide après la fin de la fonction.",
          "C'est ici qu'apparaissent certains bugs très subtils. Une référence vers un objet local détruit n'est pas seulement 'mal stylée' : elle casse complètement le contrat de durée de vie. À l'inverse, retourner une référence vers un objet appartenant déjà à l'appelant ou à un objet durable peut être parfaitement légitime."
        ),
        code(
          "cpp",
          `
std::string construireNom() {
    std::string nom{"Lina"};
    return nom; // retour par valeur : sain
}

const std::string& meilleurEtudiant(const Classement& classement) {
    return classement.premierNom(); // reference valide si l'objet classement reste vivant
}
          `,
          "Le choix du retour raconte une duree de vie"
        ),
        bullets([
          "Un retour par valeur crée une donnée indépendante pour l'appelant.",
          "Un retour par référence suppose qu'une cible existante et durable continue à vivre.",
          "Un retour par pointeur peut exprimer une absence possible, mais il impose aussi un contrat de validité."
        ]),
        callout("info", "Question décisive", "Quand tu vois une référence en retour, pose immédiatement la question : vers quel objet pointe-t-elle, et jusqu'à quand cet objet existe-t-il ?")
      ),
      lesson(
        "Piège classique : une bonne idée métier peut cacher un mauvais contrat",
        paragraphs(
          "Le bug pédagogique classique ici consiste à promettre plus que ce qu'on peut réellement garantir. Par exemple, retourner une référence vers une variable locale semble élégant, mais la référence visera un objet déjà détruit à la sortie de la fonction.",
          "Un autre piège fréquent est de rendre l'API inutilement opaque avec trop de surcharges ou avec des choix globaux imposés dans un header. Un header doit rester discret, sinon chaque fichier qui l'inclut subit ses décisions."
        ),
        code(
          "cpp",
          `
const std::string& fabriquerNom() {
    std::string nom{"Ines"};
    return nom;  // bug : la référence vise un objet déjà détruit
}
          `,
          "Référence vers un objet local : le bug compile, mais le contrat est faux"
        ),
        code(
          "cpp",
          `
// Mauvaise idée dans un header
using namespace std;
          `,
          "Un header ne doit pas polluer tous les fichiers qui l'incluent"
        )
      ),
      lesson(
        "Vérification active : ce qu'il faut savoir expliquer à l'oral",
        paragraphs(
          "À l'oral, tu dois être capable de justifier une signature sans lire le compilateur dans ta tête. La bonne stratégie consiste à partir de l'intention métier puis à expliquer la forme choisie.",
          "C'est aussi le bon moment pour clarifier la surcharge et les paramètres par défaut. Les deux outils sont utiles s'ils raccourcissent le code appelant sans brouiller la lecture. S'ils créent un doute sur la fonction réellement appelée, ils ont raté leur but."
        ),
        table(
          ["Question", "Réponse attendue"],
          [
            ["Pourquoi <code>const T&amp;</code> ?", "Pour lire un objet potentiellement coûteux sans le copier ni le modifier."],
            ["Quand choisir <code>T&amp;</code> ?", "Quand la fonction doit modifier l'objet reçu."],
            ["À quoi sert un prototype ?", "À annoncer le contrat d'une fonction sans exposer encore son implémentation."],
            ["Quand préférer un retour par valeur ?", "Quand on veut fournir un résultat indépendant sans dépendre d'une durée de vie externe fragile."],
            ["Quand un pointeur est-il plus juste qu'une référence ?", "Quand l'absence de cible ou la manipulation explicite d'adresse fait partie du contrat."],
            ["Quand éviter une surcharge ?", "Quand il devient difficile de savoir quelle variante sera appelée ou ce que l'API veut vraiment dire."]
          ]
        ),
        code(
          "cpp",
          `
void tracer(const Point& p);
void tracer(const Segment& s);
void exporter(const Rapport& rapport, bool verbose = false);
          `,
          "Deux usages utiles, tant qu'ils restent lisibles"
        ),
        callout("info", "Ce qu'il faut savoir expliquer à l'oral", "Je peux dire pourquoi une fonction prend une valeur, une référence ou un pointeur, et je peux justifier si une surcharge ou un paramètre par défaut rend réellement l'API plus claire.")
      ),
      lesson(
        "Pont vers la suite : une bonne signature prépare une bonne classe",
        paragraphs(
          "Les <code>namespace</code> servent à regrouper des fonctions et types d'un même domaine sans collision de noms. Dans un petit projet, ils remplacent avantageusement les préfixes bricolés et rendent les headers plus propres.",
          "Cette discipline prépare directement le chapitre suivant. Dès qu'un ensemble de fonctions tourne autour du même invariant métier, il devient souvent plus juste de regrouper état et comportements dans une classe bien encapsulée."
        ),
        code(
          "cpp",
          `
#pragma once
#include <string>

namespace finance {

class Compte {
public:
    explicit Compte(std::string titulaire);
    void crediter(double montant);

private:
    std::string titulaire_;
    double solde_{0.0};
};

} // namespace finance
          `,
          "Header propre"
        ),
        callout("success", "Pont vers le chapitre suivant", "Quand les signatures commencent à défendre un état métier et non plus seulement des valeurs isolées, tu es prêt à passer aux classes, à l'encapsulation et aux invariants.")
      ),
      videoLesson(
        "Si tu veux entendre plusieurs fois la logique des signatures, de la référence et des fichiers d'interface, cette sélection complète bien la lecture du chapitre.",
        [
          playlistVideo("functions", "repose les bases du contrat d'appel et des paramètres"),
          playlistVideo("broCodeFunctions", "bon complément pour revoir la structure d'une fonction et son appel"),
          playlistVideo("references", "vidéo très utile pour distinguer clairement référence, copie et adresse"),
          playlistVideo("namespaces", "prolonge naturellement la partie organisation d'API"),
          playlistVideo("headerFiles", "renforce la partie header propre et séparation interface / implémentation")
        ]
      )
    ].join(""),
    checklist: [
      "Je peux justifier quand passer un paramètre par valeur plutôt que par référence.",
      "Je peux expliquer la différence de contrat entre <code>const T&amp;</code>, <code>T&amp;</code> et <code>T*</code>.",
      "Je peux lire la forme complète d'un prototype de fonction et expliquer le rôle du type de retour, du nom et des paramètres.",
      "Je peux distinguer déclaration de fonction et définition de fonction.",
      "Je peux justifier quand un retour par valeur est plus sain qu'un retour par référence.",
      "Je peux repérer une référence dangereuse vers un objet local détruit.",
      "Je peux expliquer pourquoi <code>using namespace std;</code> n'a pas sa place dans un header.",
      "Je peux dire quand une surcharge améliore l'API et quand elle la rend ambiguë.",
      "Je peux décrire le rôle d'un namespace et la différence entre header et source."
    ],
    quiz: [
      {
        question: "Quel paramètre exprime le mieux une lecture sans copie d'un objet potentiellement coûteux ?",
        options: ["<code>T</code>", "<code>const T&</code>", "<code>T*</code>"],
        answer: 1,
        explanation: "La référence constante est un excellent compromis pour les gros objets lus seulement. Elle évite la copie et raconte clairement l'intention de lecture."
      },
      {
        question: "Quel est le bug principal dans cette fonction ?<br><code>const std::string& f() { std::string nom{\"Ines\"}; return nom; }</code>",
        options: [
          "La chaîne devrait être un <code>char*</code>",
          "La fonction retourne une référence vers un objet local détruit en fin de fonction",
          "Une référence constante ne peut jamais être retournée"
        ],
        answer: 1,
        explanation: "Le problème n'est pas la syntaxe, mais la durée de vie. La référence paraît pratique, mais elle pointe ici vers un objet qui n'existe plus après le retour."
      },
      {
        question: "Que représente principalement un prototype comme <code>double moyenne(const std::vector&lt;double&gt;&amp; notes);</code> ?",
        options: [
          "La déclaration du contrat de la fonction sans son implémentation",
          "Une variable globale spéciale",
          "Une surcharge déjà exécutée à la compilation"
        ],
        answer: 0,
        explanation: "Le prototype annonce qu'une fonction existe et précise comment elle s'utilise. Il n'a pas encore besoin de montrer le corps de l'algorithme."
      },
      {
        question: "Pourquoi éviter <code>using namespace std;</code> dans un header ?",
        options: [
          "Parce que c'est interdit par la norme",
          "Parce que le header polluerait tous les fichiers qui l'incluent",
          "Parce que <code>std</code> ne fonctionne qu'en C"
        ],
        answer: 1,
        explanation: "Un header est réutilisé partout. S'il injecte des noms globaux, il impose ses choix à tout le projet et augmente les risques de collisions."
      },
      {
        question: "Quand un pointeur en paramètre est-il plus juste qu'une référence ?",
        options: [
          "Quand on veut exprimer qu'il peut ne pas y avoir d'objet à traiter",
          "Quand on veut simplement éviter d'écrire le symbole <code>&amp;</code>",
          "Toujours, car les pointeurs sont plus 'bas niveau' donc meilleurs"
        ],
        answer: 0,
        explanation: "La référence suppose une cible existante. Le pointeur devient intéressant quand l'absence fait partie du contrat ou quand l'adresse elle-même doit être manipulée."
      },
      {
        question: "Dans quel cas un retour par valeur est-il souvent le choix le plus simple et le plus sûr ?",
        options: [
          "Quand la fonction doit fournir un résultat indépendant de son état interne",
          "Jamais, car toute copie est interdite",
          "Uniquement pour les fonctions <code>void</code>"
        ],
        answer: 0,
        explanation: "Retourner par valeur clarifie souvent le contrat : l'appelant reçoit son propre résultat, sans dépendre de la durée de vie interne de la fonction."
      },
      {
        question: "Quel usage de la surcharge reste sain ?",
        options: [
          "Garder le même nom pour deux opérations proches dont l'intention reste évidente à la lecture",
          "Créer le plus de variantes possible pour éviter de nommer précisément les fonctions",
          "Utiliser une surcharge pour masquer un contrat flou"
        ],
        answer: 0,
        explanation: "Une surcharge est utile quand elle simplifie le code appelant sans créer de doute. Si le lecteur doit deviner quelle variante sera choisie, il vaut mieux renommer."
      }
    ],
    exercises: [
      {
        title: "Nettoyer une API",
        difficulty: "Intermédiaire",
        time: "25 min",
        prompt: "Prends une petite API existante et relis chaque signature avec trois questions : est-ce que ça copie, est-ce que ça lit, est-ce que ça modifie ? Réécris ensuite les fonctions pour que ce contrat soit visible dans les types utilisés.",
        deliverables: [
          "les signatures initiales annotées avec le contrat implicite qu'elles exprimaient mal",
          "une version réécrite avec des choix justifiés entre valeur, <code>const T&amp;</code>, <code>T&amp;</code> et <code>T*</code>",
          "une justification courte ligne par ligne, centrée sur l'intention métier"
        ]
      },
      {
        title: "Prototype, source et durée de vie",
        difficulty: "Intermédiaire",
        time: "30 min",
        prompt: "Écris un petit module avec un header et un source contenant au moins trois fonctions : une qui retourne une valeur simple, une qui modifie un objet existant, et une qui renvoie une référence légitime. Ajoute aussi un exemple volontairement faux de référence de retour et explique précisément pourquoi il est dangereux.",
        deliverables: [
          "un header contenant uniquement les déclarations nécessaires",
          "un source avec les définitions correspondantes",
          "une note expliquant le contrat de durée de vie pour chaque retour"
        ]
      },
      {
        title: "Mini bibliothèque de géométrie",
        difficulty: "Intermédiaire",
        time: "30 min",
        prompt: "Crée un namespace <code>geometrie</code> avec deux types simples, un header, un source et au moins trois fonctions libres bien signées. L'une doit lire sans copier, l'une doit modifier un objet existant et l'une peut utiliser un paramètre optionnel.",
        deliverables: [
          "un header propre sans <code>using namespace std;</code>",
          "un <code>main.cpp</code> qui démontre les trois contrats différents",
          "une justification écrite de chaque signature importante"
        ]
      }
    ],
    keywords: ["fonctions", "prototype", "definition", "surcharge", "reference", "const ref", "namespace", "header", "signature", "contrat", "api", "return", "duree de vie"]
  })),
  deepDives: [
    {
      focus: "Une fonction propre commence par une sémantique d'appel claire. Avant d'écrire le corps, il faut savoir si l'argument est lu, modifié, consommé ou simplement observé.",
      retenir: [
        "Le passage par valeur, par référence ou par référence constante raconte une intention différente.",
        "Une bonne signature réduit le besoin de commentaires explicatifs."
      ],
      pitfalls: [
        "Passer par référence non const 'par habitude' alors qu'aucune modification n'est prévue.",
        "Choisir la performance apparente au détriment de la lisibilité du contrat."
      ],
      method: [
        "Détermine d'abord le rôle exact de chaque paramètre.",
        "Choisis ensuite la forme de passage qui matérialise ce rôle.",
        "Vérifie enfin que le nom de la fonction et sa signature racontent la même histoire."
      ],
      check: "Pourrais-tu justifier, paramètre par paramètre, pourquoi une fonction doit recevoir une valeur, une référence ou une référence constante ?"
    },
    {
      focus: "La forme d'une fonction se lit comme une petite phrase technique complète : type de retour, nom, liste de paramètres, éventuellement qualification <code>const</code> pour une méthode. Maîtriser cette lecture rend beaucoup plus autonome face à une API inconnue.",
      retenir: [
        "Le prototype et la définition décrivent la même fonction à deux niveaux différents.",
        "Le type de retour fait partie du contrat public, pas d'un simple détail d'implémentation."
      ],
      pitfalls: [
        "Lire d'abord le corps sans avoir compris ce que la signature promet.",
        "Confondre déclaration, définition et appel de fonction."
      ],
      method: [
        "Lis d'abord le type de retour.",
        "Identifie ensuite le nom et les paramètres.",
        "Demande-toi enfin ce qui appartient à l'interface publique et ce qui relève du .cpp."
      ],
      check: "Face à un prototype isolé, peux-tu déjà expliquer ce que l'appelant doit fournir et ce qu'il recevra en retour ?"
    },
    {
      focus: "La surcharge est puissante lorsqu'elle exprime plusieurs usages cohérents d'une même opération. Elle devient dangereuse dès qu'elle force le lecteur à deviner quelle version sera réellement appelée.",
      retenir: [
        "Des surcharges valables partagent un sens commun, pas seulement un nom commun.",
        "Les paramètres par défaut doivent simplifier l'appel sans rendre la résolution ambiguë."
      ],
      pitfalls: [
        "Multiplier les surcharges qui se distinguent par des détails trop subtils.",
        "Cacher des comportements très différents derrière le même verbe."
      ],
      method: [
        "Liste les usages réels de l'opération à modéliser.",
        "Garde uniquement les surcharges dont la sémantique reste stable.",
        "Teste mentalement plusieurs appels pour vérifier qu'aucune ambiguïté ne subsiste."
      ],
      check: "Si deux surcharges portent le même nom, peux-tu expliquer en quoi leur contrat reste tout de même cohérent ?"
    },
    {
      focus: "Les valeurs de retour racontent aussi une durée de vie. Retourner par valeur, par référence ou par pointeur ne dit pas seulement 'comment transmettre', mais aussi 'quelle relation durable l'appelant entretient avec le résultat'.",
      retenir: [
        "Un retour par valeur est souvent le plus simple à raisonner.",
        "Une référence de retour n'est saine que si la cible existe encore après le retour."
      ],
      pitfalls: [
        "Retourner une référence vers une variable locale détruite.",
        "Choisir une référence de retour uniquement pour éviter une copie supposée coûteuse, sans vérifier si le contrat reste sain."
      ],
      method: [
        "Identifie d'abord la source réelle de la donnée renvoyée.",
        "Demande-toi ensuite si cette source survit à la fin de la fonction.",
        "Si la réponse n'est pas clairement oui, préfère un retour par valeur."
      ],
      check: "Quand une fonction renvoie une référence, sais-tu nommer l'objet exact auquel cette référence se rattache ?"
    },
    {
      focus: "Les namespaces et la discipline de header servent à éviter l'entropie. Plus un projet grandit, plus les collisions de noms, les dépendances croisées et les inclusions inutiles deviennent coûteuses.",
      retenir: [
        "Un header doit exposer le minimum nécessaire pour rester stable et facile à inclure.",
        "Le namespace est un outil de structuration, pas un simple détail de syntaxe."
      ],
      pitfalls: [
        "Utiliser using namespace dans des headers ou dans des zones très larges.",
        "Inclure massivement sans distinguer dépendances d'interface et d'implémentation."
      ],
      method: [
        "Réduis chaque header à ce qu'il doit vraiment promettre.",
        "Place les noms dans un espace cohérent avec le domaine du projet.",
        "Relis les inclusions pour supprimer celles qui n'apportent rien à l'interface publique."
      ],
      check: "Saurais-tu expliquer pourquoi un header mal tenu finit par ralentir autant la compilation que la compréhension du code ?"
    }
  ]
});
})(window);
