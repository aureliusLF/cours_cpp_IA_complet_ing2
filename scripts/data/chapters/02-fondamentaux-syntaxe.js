(function registerChapterBundle2(globalScope) {
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
  order: 2,
  chapter: withChapterTheme("fondamentaux-syntaxe", () => ({
    id: "fondamentaux-syntaxe",
    shortTitle: "Syntaxe de base",
    title: "Fondamentaux du langage : syntaxe, types, entrées/sorties et contrôle",
    level: "Fondations",
    duration: "55 min",
    track: "SE1",
    summary:
      "Ce chapitre repart de zéro et ne suppose aucun bagage en C. L'objectif n'est pas de mémoriser une syntaxe isolée, mais de comprendre comment un programme C++ lit des données, prend des décisions et produit un résultat de façon lisible et sûre.",
    goals: [
      "expliquer le rôle de <code>#include</code>, <code>main</code>, des blocs et du point-virgule dans un programme minimal",
      "choisir un type simple adapté, initialiser proprement avec <code>{}</code> et distinguer <code>const</code>, <code>constexpr</code> et <code>enum class</code>",
      "écrire une interaction console simple avec <code>std::cin</code>, <code>std::cout</code>, une condition et une boucle lisible"
    ],
    highlights: ["main()", "std::string", "{}", "if/for/while", "enum class"],
    body: [
      lesson(
        "Modèle mental : un programme lit, décide puis agit",
        paragraphs(
          "Lis d'abord un programme C++ comme une petite chaîne d'actions. On rend disponibles quelques outils avec <code>#include</code>, on entre dans <code>main</code>, puis les instructions s'exécutent dans l'ordre. Chaque bloc entre accolades délimite une zone de travail, et chaque point-virgule ferme une instruction simple.",
          "Tu n'as pas besoin de connaître les habitudes du C pour démarrer. En C++ moderne, on manipule très tôt <code>std::string</code>, l'initialisation avec accolades et des structures de contrôle lisibles. Le bon réflexe n'est pas 'faire comme en C', mais 'écrire une intention claire et sûre'."
        ),
        table(
          ["Élément", "Question à se poser"],
          [
            ["<code>#include</code>", "De quels outils ai-je besoin dans ce fichier ?"],
            ["<code>int main()</code>", "Que fait mon programme quand il démarre ?"],
            ["<code>{ ... }</code>", "Quel est le bloc de code concerné ?"],
            ["<code>;</code>", "Où se termine cette instruction ?"],
            ["<code>std::cout</code>", "Quelle information veux-je afficher ?"]
          ]
        ),
        callout("info", "Modèle de lecture", "Quand tu te sens perdu, relis le programme avec cette phrase simple : je déclare des données, je lis des entrées, je décide, puis j'affiche un résultat.")
      ),
      lesson(
        "Exemple minimal : lire une donnée, calculer un état, afficher un résultat",
        paragraphs(
          "Commence par un exemple très court avant d'apprendre les variantes. Ici, le programme lit un prénom et une moyenne, calcule si le semestre est validé, puis affiche un message. Cet exemple contient déjà l'essentiel : types, initialisation, saisie, comparaison et affichage.",
          "Observe surtout le choix des types. <code>std::string</code> représente du texte, <code>double</code> une moyenne réelle, <code>bool</code> une décision oui/non. Le type doit raconter la nature de la donnée, pas seulement permettre au code de compiler."
        ),
        code(
          "cpp",
          `
#include <iostream>
#include <string>

int main() {
    std::string prenom{};
    double moyenne{};

    std::cout << "Prenom : ";
    std::cin >> prenom;
    std::cout << "Moyenne : ";
    std::cin >> moyenne;

    bool semestreValide{moyenne >= 10.0};

    if (semestreValide) {
        std::cout << prenom << " valide le semestre.\n";
    } else {
        std::cout << prenom << " doit retravailler.\n";
    }

    return 0;
}
          `,
          "Premier programme complet utile"
        ),
        table(
          ["Type", "Quand l'utiliser ici"],
          [
            ["<code>std::string</code>", "Pour un nom, un message, un texte saisi."],
            ["<code>double</code>", "Pour une moyenne ou une mesure réelle."],
            ["<code>bool</code>", "Pour stocker le résultat d'une condition."],
            ["<code>int</code>", "Pour un compteur, un âge, une quantité entière."]
          ]
        ),
        callout("success", "Réflexe à garder", "Commence toujours par l'exemple le plus simple qui marche. Ensuite seulement, ajoute des variantes comme des boucles, des états supplémentaires ou des fonctions.")
      ),
      lesson(
        "Piège classique : confusion de syntaxe et bugs silencieux",
        paragraphs(
          "Les débutants se trompent souvent non pas sur l'idée métier, mais sur un détail de syntaxe qui change complètement le sens du programme. Les trois pièges les plus fréquents ici sont : confondre <code>=</code> et <code>==</code>, laisser une variable vivre trop longtemps, et accepter une conversion qui fait perdre de l'information.",
          "L'initialisation avec accolades aide justement à éviter certaines conversions dangereuses. Elle force le compilateur à refuser des cas ambigus comme le passage silencieux d'un <code>double</code> vers un <code>int</code>."
        ),
        code(
          "cpp",
          `
double note{9.5};

if (note = 10.0) {          // bug : on modifie note au lieu de comparer
    std::cout << "valide\n";
}

// int nbEtudiants{32.8};   // refusé : conversion réductrice

for (int tentative{0}; tentative < 3; ++tentative) {
    std::cout << "Essai " << tentative + 1 << '\n';
}
          `,
          "Trois détails de syntaxe, trois conséquences très différentes"
        ),
        bullets([
          "Utilise <code>==</code> pour comparer, <code>=</code> pour affecter.",
          "Déclare une variable dans la plus petite portée possible.",
          "Préfère <code>{}</code> si tu veux que le compilateur t'aide contre les conversions risquées."
        ]),
        callout("warn", "Piège classique", "Le bug <code>if (note = 10.0)</code> ne casse pas la compilation, mais il casse la logique du programme. Ce type d'erreur est typique d'un code lu trop vite.")
      ),
      lesson(
        "Vérification active : ce qu'il faut savoir expliquer à l'oral",
        paragraphs(
          "À ce stade, tu dois pouvoir raconter le chapitre à voix haute sans réciter du code. L'enjeu n'est pas de lister des mots-clés, mais d'expliquer ce que tu choisis et pourquoi tu le choisis.",
          "Un bon test oral consiste à prendre un mini-problème et à justifier chaque décision : type choisi, structure de contrôle, usage ou non d'une constante, et manière de représenter un état."
        ),
        table(
          ["Question", "Réponse attendue"],
          [
            ["Déclaration vs initialisation vs affectation ?", "Déclarer crée la variable, initialiser lui donne une première valeur, affecter remplace une valeur existante."],
            ["Pourquoi <code>std::string</code> plutôt qu'un tableau de <code>char</code> ?", "Parce que c'est l'outil standard, sûr et lisible pour le texte courant."],
            ["Quand choisir <code>if</code>, <code>for</code> ou <code>while</code> ?", "<code>if</code> pour décider, <code>for</code> pour un parcours borné, <code>while</code> pour répéter jusqu'à une condition d'arrêt."],
            ["Pourquoi <code>enum class</code> ?", "Pour nommer explicitement des états métier sans collision de noms."]
          ]
        ),
        code(
          "cpp",
          `
enum class EtatSemestre {
    Valide,
    ARattraper
};

EtatSemestre etat{EtatSemestre::Valide};
          `,
          "Nommer un état métier plutôt que bricoler un entier magique"
        ),
        callout("info", "Ce qu'il faut savoir expliquer à l'oral", "Je sais dire pourquoi j'ai choisi tel type, telle condition ou telle boucle, et je peux reformuler le rôle de <code>const</code> ou <code>enum class</code> sans me cacher derrière la syntaxe.")
      ),
      lesson(
        "Pont vers la suite : derrière chaque variable, il y a une adresse",
        paragraphs(
          "Jusqu'ici, tu as manipulé des valeurs par leur nom. Mais ces valeurs vivent quelque part en mémoire. Le prochain cap consiste à comprendre qu'une variable a aussi une adresse, et qu'un pointeur sert précisément à manipuler cette adresse.",
          "Cette idée semble technique, mais elle deviendra vite concrète : passage d'arguments, tableaux, allocation dynamique, structures de données et ownership reposent tous sur cette question de localisation mémoire."
        ),
        code(
          "cpp",
          `
int note{12};
int* adresseNote{&note};

        std::cout << note << '\n';         // 12
std::cout << *adresseNote << '\n'; // 12 : même donnée, autre chemin d'accès
          `,
          "Même valeur, mais lue à travers son adresse"
        ),
        callout("success", "Pont vers le chapitre suivant", "Si une variable a une adresse, on peut la transmettre autrement que par une simple copie. C'est précisément l'entrée vers les pointeurs, puis vers les références et la conception de signatures propres.")
      ),
      videoLesson(
        "Pour revoir les bases sous un angle plus visuel, ces vidéos de la playlist reprennent presque exactement les briques de ce chapitre.",
        [
          playlistVideo("broCodeVariables", "version très directe pour revoir variables, types et premières déclarations"),
          playlistVideo("variables", "reprend le rôle des types simples et de l'initialisation"),
          playlistVideo("revaninioVariables", "version francophone, plus lente et très accessible pour revoir les bases"),
          playlistVideo("broCodeUserInput", "utile si tu veux revoir <code>cin</code>, <code>getline</code> et la saisie pas à pas"),
          playlistVideo("broCodeIfStatements", "renforce la logique de <code>if / else</code> avec un exemple très lisible"),
          playlistVideo("broCodeForLoops", "très bon complément pour relire la syntaxe complète du <code>for</code>"),
          playlistVideo("constKeyword", "utile pour consolider le sens de <code>const</code> très tôt")
        ]
      )
    ].join(""),
    checklist: [
      "Je peux expliquer à quoi sert <code>main</code> et dans quel ordre les instructions d'un programme simple s'exécutent.",
      "Je peux choisir entre <code>int</code>, <code>double</code>, <code>bool</code> et <code>std::string</code> sur un exemple concret.",
      "Je peux justifier l'usage de l'initialisation avec accolades et repérer une conversion réductrice.",
      "Je peux écrire une saisie console simple puis afficher un résultat lisible avec <code>std::cout</code>.",
      "Je peux expliquer la différence entre déclaration, initialisation et affectation.",
      "Je peux repérer le bug <code>=</code> vs <code>==</code> dans une condition.",
      "Je peux choisir entre <code>if</code>, <code>for</code> et <code>while</code> selon la forme du problème.",
      "Je peux défendre l'usage de <code>const</code> ou d'<code>enum class</code> pour clarifier l'intention métier."
    ],
    quiz: [
      {
        question: "Dans ce programme, quel est le rôle principal de <code>int main()</code> ?",
        options: [
          "Décrire le type de toutes les variables du fichier",
          "Définir le point d'entrée exécuté au démarrage du programme",
          "Activer automatiquement les bibliothèques standard utilisées"
        ],
        answer: 1,
        explanation: "Un programme peut contenir beaucoup de fonctions, mais l'exécution commence par <code>main</code>. C'est donc là que tu dois chercher le fil d'action principal."
      },
      {
        question: "Que t'apporte surtout l'initialisation avec accolades dans <code>int nb{3.7};</code> ?",
        options: [
          "Elle transforme automatiquement le <code>double</code> en <code>std::string</code>",
          "Elle signale une conversion qui ferait perdre de l'information",
          "Elle empêche toute réaffectation future de la variable"
        ],
        answer: 1,
        explanation: "Les accolades servent ici de garde-fou pédagogique. Elles t'évitent de faire rentrer silencieusement une valeur réelle dans un entier tronqué."
      },
      {
        question: "Quel bug logique se cache dans ce code ? <code>if (note = 10.0)</code>",
        options: [
          "Aucun : on compare bien <code>note</code> à <code>10.0</code>",
          "On affecte <code>10.0</code> à <code>note</code> au lieu de tester une égalité",
          "Le problème est seulement stylistique, pas sémantique"
        ],
        answer: 1,
        explanation: "C'est un bug classique parce que le code ressemble visuellement à une comparaison. Ici, l'opérateur d'affectation modifie la variable et fausse complètement la condition."
      },
      {
        question: "Tu dois afficher trois tentatives numérotées de 1 à 3. Quelle structure est la plus naturelle ?",
        options: [
          "<code>if</code>, car il s'agit d'une décision",
          "<code>for</code>, car le nombre de répétitions est connu dès le départ",
          "<code>while</code>, car toute répétition doit être écrite en <code>while</code>"
        ],
        answer: 1,
        explanation: "Quand le nombre d'itérations est borné et connu, <code>for</code> exprime l'intention plus directement. Le choix de la structure doit suivre la forme du problème."
      },
      {
        question: "Pourquoi <code>enum class</code> est-il souvent préférable à un entier magique pour représenter un état ?",
        options: [
          "Parce qu'il consomme toujours moins de mémoire qu'un <code>int</code>",
          "Parce qu'il nomme explicitement les états autorisés et évite les collisions de noms",
          "Parce qu'il remplace automatiquement toutes les conditions du programme"
        ],
        answer: 1,
        explanation: "Un entier comme <code>2</code> ne raconte rien. Un <code>enum class</code> explicite les états métier et aide à relire le code sans deviner ce que signifie une valeur brute."
      }
    ],
    exercises: [
      {
        title: "Fiche identité console",
        difficulty: "Facile",
        time: "15 min",
        prompt: "Écris un programme console qui lit un prénom, un âge, un groupe et une moyenne, puis affiche un résumé sur plusieurs lignes avec un message différent selon que le semestre est validé ou non. Challenge utile : représenter l'état final avec un <code>enum class</code> plutôt qu'un entier.",
        deliverables: [
          "des variables correctement typées et initialisées avec <code>{}</code>",
          "un affichage final lisible qui reprend toutes les données saisies et le verdict métier",
          "une condition <code>if / else</code> sans confusion entre <code>=</code> et <code>==</code>"
        ]
      },
      {
        title: "Audit des conversions",
        difficulty: "Intermédiaire",
        time: "20 min",
        prompt: "Pars d'un petit programme volontairement bancal contenant des <code>int</code>, <code>double</code>, booléens et texte. Repère les conversions implicites, décide lesquelles doivent être refusées, lesquelles peuvent rester, et réécris le code en justifiant chaque correction.",
        deliverables: [
          "une liste des conversions observées avec le risque associé",
          "une version corrigée qui utilise les accolades quand elles apportent une sécurité utile",
          "une justification courte de chaque correction, centrée sur le bug évité"
        ]
      }
    ],
    keywords: ["syntaxe", "main", "cout", "cin", "types", "string", "initialisation", "const", "constexpr", "enum class", "conditions", "boucles", "if", "for", "while", "scope"]
  })),
  deepDives: [
    {
      focus: "Cette première leçon doit être lue comme un vrai point de départ. Avant de penser objets, templates ou STL, il faut savoir reconnaître la forme d'un programme C++ : ce qui importe au compilateur, ce qui sera exécuté par la machine et ce qui relève simplement de l'organisation du fichier.",
      retenir: [
        "Le programme démarre dans la fonction main.",
        "Les includes rendent accessibles des bibliothèques ; ils ne sont pas de simples décorations."
      ],
      pitfalls: [
        "Voir les accolades, les points-virgules ou les includes comme une pure contrainte de syntaxe sans comprendre leur rôle.",
        "Penser qu'il faut connaître le C historique avant de pouvoir lire un programme C++ moderne."
      ],
      method: [
        "Relis chaque ligne d'un programme minimal en expliquant son rôle à voix haute.",
        "Distingue ce qui déclare, ce qui exécute et ce qui structure le code.",
        "Teste ensuite une petite variation du programme pour vérifier que tu maîtrises la structure."
      ],
      check: "Peux-tu expliquer le rôle exact de #include, de main, des accolades et d'une instruction terminée par un point-virgule ?"
    },
    {
      focus: "Les variables sont les premières briques concrètes du langage. Le vrai enjeu n'est pas seulement de savoir les déclarer, mais de comprendre qu'un type restreint volontairement les valeurs possibles et rend certaines erreurs visibles plus tôt.",
      retenir: [
        "Le type d'une variable exprime la nature de la donnée manipulée.",
        "Une affectation modifie une valeur existante, mais ne change jamais le type déclaré."
      ],
      pitfalls: [
        "Choisir un type parce qu'il 'compile' au lieu de choisir celui qui décrit bien la donnée.",
        "Utiliser des noms vagues qui empêchent de comprendre le rôle de la variable."
      ],
      method: [
        "Décris en français ce que contient chaque variable avant de coder.",
        "Associe ensuite cette donnée à un type clair et à un nom explicite.",
        "Vérifie enfin ce qui change au cours du programme et ce qui devrait rester stable."
      ],
      check: "Saurais-tu expliquer pourquoi age, moyenne et admis ne devraient pas tous utiliser le même type ?"
    },
    {
      focus: "L'entrée et la sortie console permettent de relier immédiatement syntaxe et comportement. C'est une excellente zone d'entraînement, car le programme dialogue tout de suite avec l'utilisateur et montre très vite si l'on manipule correctement texte et valeurs.",
      retenir: [
        "std::cout écrit vers la console ; std::cin lit depuis la console.",
        "std::string doit être ton outil de base pour le texte applicatif."
      ],
      pitfalls: [
        "Croire que le texte en C++ doit être manipulé avec des tableaux de char dès le départ.",
        "Mélanger lecture utilisateur, logique métier et formatage d'affichage sans structure."
      ],
      method: [
        "Commence par faire afficher une valeur simple.",
        "Ajoute ensuite une lecture utilisateur sur un type facile comme string ou int.",
        "Observe comment les opérateurs << et >> racontent le sens du flux."
      ],
      check: "Peux-tu expliquer la différence de rôle entre std::cout, std::cin et std::string dans un petit programme interactif ?"
    },
    {
      focus: "Initialiser correctement une valeur dès sa création est une habitude décisive. Cela réduit les états flous, rend les invariants plus lisibles et prépare très tôt à des classes saines lorsqu'on passera à la programmation objet.",
      retenir: [
        "Les accolades homogénéisent l'écriture et aident à bloquer certaines conversions réductrices.",
        "const et constexpr servent à exprimer des degrés différents de stabilité."
      ],
      pitfalls: [
        "Reporter l'initialisation à plus tard alors que la bonne valeur est déjà connue.",
        "Confondre une simple convention de style avec une vraie garantie de sécurité."
      ],
      method: [
        "Cherche la valeur correcte au moment de la création de la variable.",
        "Décide si cette valeur doit rester stable à l'exécution ou même dès la compilation.",
        "Utilise enum class quand tu veux modéliser des états métiers nommés."
      ],
      check: "Sais-tu repérer quand une variable devrait être const, constexpr ou carrément remplacée par un enum class ?"
    },
    {
      focus: "Les conditions sont la première forme de prise de décision dans le programme. Leur difficulté n'est pas syntaxique, mais sémantique : une bonne condition doit exprimer un critère métier clair et éviter toute ambiguïté de lecture.",
      retenir: [
        "== compare ; = affecte.",
        "Les opérateurs logiques combinent des règles, ils ne doivent pas les obscurcir."
      ],
      pitfalls: [
        "Écrire une condition correcte techniquement mais illisible humainement.",
        "Accumuler plusieurs négations ou comparaisons sans clarifier l'intention."
      ],
      method: [
        "Formule d'abord la règle métier en français.",
        "Traduis-la ensuite en comparaison simple puis en combinaison logique si nécessaire.",
        "Relis la condition comme une phrase pour vérifier qu'elle raconte bien ce que tu veux."
      ],
      check: "Peux-tu justifier chaque symbole d'une condition sans dire seulement 'c'est la syntaxe' ?"
    },
    {
      focus: "Les boucles doivent être pensées comme des parcours contrôlés, pas comme des répétitions automatiques. Une bonne boucle sait ce qu'elle parcourt, quand elle s'arrête et quelles variables lui appartiennent vraiment.",
      retenir: [
        "for est souvent idéal quand la forme du parcours est connue.",
        "La portée la plus petite possible réduit les erreurs et aide à comprendre le code."
      ],
      pitfalls: [
        "Laisser traîner des variables de boucle en dehors de la zone où elles sont utiles.",
        "Écrire une condition d'arrêt approximative qui masque un off-by-one ou une boucle infinie."
      ],
      method: [
        "Identifie l'élément répété et le critère d'arrêt.",
        "Place les variables de contrôle dans la boucle ou juste à côté si leur rôle l'exige.",
        "Teste à la main les premières et dernières itérations pour vérifier le comportement."
      ],
      check: "Quand tu lis une boucle, peux-tu énoncer ce qui est parcouru, ce qui change à chaque tour et ce qui provoque la sortie ?"
    }
  ]
});
})(window);
