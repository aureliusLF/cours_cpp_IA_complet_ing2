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
    duration: "1 h 45",
    track: "SE1",
    summary:
      "Ce chapitre repart de zéro et ne suppose aucun bagage en C. Il prend le temps d'expliquer la vraie syntaxe de base du C++ : structure d'un fichier, déclarations, types simples, initialisation, expressions, saisie console, conditions, boucles, portée des variables et premiers réflexes de lisibilité.",
    goals: [
      "lire ligne par ligne un programme minimal et expliquer le rôle de <code>#include</code>, <code>main</code>, des blocs, des commentaires et du point-virgule",
      "choisir un type simple adapté, déclarer et initialiser proprement avec <code>{}</code>, puis distinguer déclaration, initialisation, affectation, <code>const</code>, <code>constexpr</code> et <code>enum class</code>",
      "écrire une interaction console propre avec <code>std::cin</code>, <code>std::getline</code>, <code>std::cout</code>, des conditions, des boucles et une portée de variables cohérente"
    ],
    highlights: ["main()", "#include", "std::string", "{}", "if/else", "switch", "for/while", "std::getline", "enum class"],
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
        "Anatomie détaillée d'un premier fichier source",
        paragraphs(
          "Le débutant voit souvent une suite de symboles ; le lecteur expérimenté voit au contraire des rôles très stables. Les <code>#include</code> annoncent les bibliothèques nécessaires, la signature <code>int main()</code> marque le point d'entrée, les accolades créent les blocs, les commentaires expliquent l'intention et les instructions simples se terminent par un point-virgule.",
          "Il faut aussi prendre l'habitude de distinguer trois niveaux de lecture. Niveau 1 : la structure du fichier. Niveau 2 : les déclarations et les types. Niveau 3 : les expressions réellement exécutées. Quand tu maîtrises ces trois étages, la syntaxe cesse d'être une liste de règles arbitraires."
        ),
        code(
          "cpp",
          `
#include <iostream>   // outils d'entree/sortie
#include <string>     // type std::string

int main() {          // point d'entree du programme
    // declaration et initialisation
    std::string prenom{"Lina"};

    // instruction d'affichage
    std::cout << "Bonjour " << prenom << '\n';

    return 0;         // fin normale du programme
}
          `,
          "Chaque symbole occupe un rôle précis"
        ),
        table(
          ["Élément visible", "Ce qu'il faut comprendre"],
          [
            ["Commentaire <code>// ...</code>", "Il n'est pas exécuté ; il sert uniquement au lecteur humain."],
            ["Chaîne <code>\"Bonjour\"</code>", "Valeur textuelle littérale utilisée dans l'expression."],
            ["<code>&lt;&lt;</code>", "Opérateur d'insertion dans le flux de sortie."],
            ["<code>'\\n'</code>", "Retour à la ligne sans forcer un flush comme <code>std::endl</code>."],
            ["Indentation", "Aide à lire les blocs ; ce n'est pas la même chose que les accolades, mais elles doivent raconter la même structure."]
          ]
        ),
        callout("success", "Réflexe utile", "Avant de vouloir écrire du code, entraîne-toi à annoter un mini-programme ligne par ligne. La syntaxe devient beaucoup plus simple quand chaque ligne a un rôle identifiable.")
      ),
      lesson(
        "Déclarations, initialisations, types simples et expressions",
        paragraphs(
          "Une grande partie de la syntaxe de base consiste à manipuler correctement des variables. Déclarer, c'est créer un nom avec un type. Initialiser, c'est donner une première valeur. Affecter, c'est remplacer plus tard la valeur d'une variable déjà existante. Ces trois gestes se ressemblent visuellement, mais ils ne racontent pas la même chose.",
          "Les types simples les plus utiles au départ sont <code>int</code>, <code>double</code>, <code>char</code>, <code>bool</code> et <code>std::string</code>. Tu dois aussi reconnaître les grandes familles d'expressions : arithmétiques, relationnelles et logiques. C'est ce mélange qui nourrit ensuite les conditions et les boucles."
        ),
        code(
          "cpp",
          `
int age{19};                 // declaration + initialisation
double moyenne{13.75};
char groupe{'B'};
bool boursier{false};
std::string nom{"Amina"};

age = age + 1;               // affectation
double bonus{moyenne * 0.5}; // expression arithmetique
bool admis{moyenne >= 10.0}; // expression relationnelle
bool prioritaire{admis && boursier}; // expression logique
          `,
          "Les types portent des natures de donnees differentes"
        ),
        table(
          ["Écriture", "Comment la lire"],
          [
            ["<code>int age{19};</code>", "Je crée une variable entière nommée <code>age</code> et je lui donne 19."],
            ["<code>age = age + 1;</code>", "Je remplace la valeur actuelle de <code>age</code> par une nouvelle valeur."],
            ["<code>moyenne &gt;= 10.0</code>", "Je produis un booléen qui vaut vrai ou faux."],
            ["<code>a &amp;&amp; b</code>", "Les deux conditions doivent être vraies."],
            ["<code>a || b</code>", "Au moins une des deux conditions doit être vraie."]
          ]
        ),
        bullets([
          "Un nom de variable doit raconter la donnée, pas seulement permettre de compiler.",
          "Un <code>bool</code> est souvent le résultat d'une question métier claire.",
          "Les accolades <code>{}</code> aident à rendre les initialisations plus uniformes et plus sûres.",
          "Une expression produit une valeur ; une instruction effectue une action complète dans le programme."
        ]),
        callout("info", "Point de vocabulaire", "Quand tu lis une ligne, demande-toi toujours : est-ce une déclaration ? une initialisation ? une affectation ? une expression utilisée dans une autre instruction ?")
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
        "Entrées et sorties console : <code>cin</code>, <code>getline</code>, formatage et pièges de lecture",
        paragraphs(
          "La console est une excellente zone d'entraînement parce qu'elle te force à relier syntaxe et comportement visible. Mais il faut connaître la différence entre <code>std::cin &gt;&gt;</code> et <code>std::getline</code>. L'opérateur <code>&gt;&gt;</code> lit jusqu'au prochain séparateur blanc, alors que <code>getline</code> lit toute la ligne, espaces compris.",
          "Le piège classique apparaît quand on mélange les deux sans tenir compte du retour à la ligne restant dans le flux. Si tu lis un nombre avec <code>std::cin</code> puis une ligne complète avec <code>std::getline</code>, il faut souvent consommer le <code>'\\n'</code> restant avec <code>std::cin.ignore()</code>."
        ),
        code(
          "cpp",
          `
std::string nomComplet{};
int age{};

std::cout << "Age : ";
std::cin >> age;
std::cin.ignore();

std::cout << "Nom complet : ";
std::getline(std::cin, nomComplet);

std::cout << "Resume : " << nomComplet << ", " << age << " ans\n";
          `,
          "Melanger lecture de nombres et lecture de ligne complete"
        ),
        table(
          ["Outil", "Usage le plus naturel"],
          [
            ["<code>std::cout &lt;&lt;</code>", "Construire un affichage pas à pas vers la console."],
            ["<code>std::cin &gt;&gt;</code>", "Lire un mot, un entier, un réel ou un booléen simple."],
            ["<code>std::getline</code>", "Lire une ligne complète, par exemple un nom composé ou une phrase."],
            ["<code>'\\n'</code>", "Aller à la ligne sans forcer de flush coûteux inutile."],
            ["<code>std::cin.ignore()</code>", "Écarter le retour à la ligne résiduel avant un <code>getline</code>."]
          ]
        ),
        callout("warn", "Piège fréquent", "Si un <code>getline</code> semble sauter sans rien lire après un <code>cin &gt;&gt;</code>, le problème vient souvent du retour à la ligne encore présent dans le flux.")
      ),
      lesson(
        "Conditions, <code>switch</code>, boucles et portée locale",
        paragraphs(
          "La syntaxe de base ne s'arrête pas à <code>if</code>. Il faut savoir choisir la bonne structure de contrôle selon la forme du problème. <code>if / else if / else</code> convient aux conditions métier générales, <code>switch</code> est pratique quand on choisit entre plusieurs cas discrets, <code>for</code> exprime bien un parcours borné, <code>while</code> une répétition tant qu'une condition reste vraie, et <code>do while</code> garantit au moins un passage.",
          "Le détail fondamental, souvent sous-expliqué, est la portée des variables. Une variable déclarée dans un bloc n'existe que dans ce bloc. Déclarer au plus près de l'usage réduit les erreurs, limite les dépendances cachées et rend les boucles beaucoup plus faciles à relire."
        ),
        code(
          "cpp",
          `
enum class Menu {
    Ajouter = 1,
    Afficher = 2,
    Quitter = 3
};

Menu choix{Menu::Afficher};

switch (choix) {
    case Menu::Ajouter:
        std::cout << "Ajout\n";
        break;
    case Menu::Afficher:
        std::cout << "Affichage\n";
        break;
    case Menu::Quitter:
        std::cout << "Fin\n";
        break;
}

for (int tentative{1}; tentative <= 3; ++tentative) {
    std::cout << "Tentative " << tentative << '\n';
}
          `,
          "Choisir la structure qui raconte le mieux l'intention"
        ),
        bullets([
          "<code>else if</code> sert à enchaîner des cas exclusifs de manière lisible.",
          "<code>switch</code> gagne en clarté quand les cas portent sur des valeurs discrètes bien nommées.",
          "<code>break</code> interrompt une boucle ou un <code>switch</code> ; <code>continue</code> saute au tour suivant.",
          "La variable <code>tentative</code> n'a de sens que dans la boucle : sa portée locale est donc un bon choix."
        ]),
        callout("success", "Question à se poser", "Avant d'écrire une boucle, sois capable de dire ce qui change à chaque tour, quand on s'arrête et quelles variables appartiennent vraiment à cette répétition.")
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
            ["Quand choisir <code>std::getline</code> plutôt que <code>std::cin &gt;&gt;</code> ?", "Quand on veut lire une ligne complète, espaces compris."],
            ["Quand choisir <code>if</code>, <code>for</code> ou <code>while</code> ?", "<code>if</code> pour décider, <code>for</code> pour un parcours borné, <code>while</code> pour répéter jusqu'à une condition d'arrêt."],
            ["Quand <code>switch</code> devient-il utile ?", "Quand on choisit entre des cas discrets bien identifiés, par exemple un menu ou un état."],
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
      "Je peux lire un fichier source très simple et dire le rôle de <code>#include</code>, des commentaires, des accolades, de l'indentation et du point-virgule.",
      "Je peux choisir entre <code>int</code>, <code>double</code>, <code>bool</code> et <code>std::string</code> sur un exemple concret.",
      "Je peux distinguer clairement déclaration, initialisation, affectation et expression.",
      "Je peux justifier l'usage de l'initialisation avec accolades et repérer une conversion réductrice.",
      "Je peux écrire une saisie console simple avec <code>std::cin</code> puis afficher un résultat lisible avec <code>std::cout</code>.",
      "Je peux expliquer quand utiliser <code>std::getline</code> plutôt que <code>std::cin &gt;&gt;</code>.",
      "Je peux repérer le bug <code>=</code> vs <code>==</code> dans une condition.",
      "Je peux relire une condition contenant <code>&amp;&amp;</code>, <code>||</code> ou <code>!</code> et l'exprimer en français.",
      "Je peux choisir entre <code>if</code>, <code>for</code> et <code>while</code> selon la forme du problème.",
      "Je peux expliquer à quoi servent <code>switch</code>, <code>break</code> et <code>continue</code>.",
      "Je peux défendre une variable locale courte plutôt qu'une variable déclarée trop tôt et réutilisée partout.",
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
        question: "Quelle différence importante existe entre <code>std::cin &gt;&gt; nom</code> et <code>std::getline(std::cin, nom)</code> ?",
        options: [
          "<code>getline</code> lit toute la ligne alors que <code>&gt;&gt;</code> s'arrête au prochain séparateur blanc",
          "<code>&gt;&gt;</code> fonctionne seulement avec les nombres",
          "<code>getline</code> est réservé aux tableaux de <code>char</code>"
        ],
        answer: 0,
        explanation: "Cette différence explique pourquoi un prénom composé ou une phrase ne doivent pas être lus avec le simple opérateur <code>&gt;&gt;</code>. Il faut choisir l'outil selon la forme de l'entrée attendue."
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
        question: "Dans quel cas <code>switch</code> devient-il souvent plus lisible qu'une longue chaîne de <code>if / else if</code> ?",
        options: [
          "Quand on choisit entre plusieurs cas discrets bien identifiés",
          "Quand la condition dépend d'un calcul flottant complexe",
          "Quand on veut éviter d'écrire des accolades"
        ],
        answer: 0,
        explanation: "<code>switch</code> raconte très bien une sélection parmi des cas nommés ou numérotés. Il ne remplace pas toutes les conditions, mais il clarifie certains menus, états ou commandes."
      },
      {
        question: "Pourquoi déclarer <code>int i{0};</code> directement dans l'en-tête d'un <code>for</code> est-il souvent un bon choix ?",
        options: [
          "Parce que la variable reste visible dans tout le fichier",
          "Parce que sa portée est limitée à la boucle où elle a du sens",
          "Parce que le compilateur interdit toute autre forme"
        ],
        answer: 1,
        explanation: "Réduire la portée rend le code plus lisible et évite qu'une variable de contrôle soit réutilisée trop loin de son contexte. La syntaxe aide ici directement la conception."
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
        title: "Menu console complet",
        difficulty: "Intermédiaire",
        time: "30 min",
        prompt: "Écris un petit programme menu qui propose au moins trois actions via un <code>switch</code> ou une chaîne de <code>if / else if</code>. Il doit lire un choix utilisateur, exécuter le cas correspondant, répéter la demande tant que l'utilisateur ne quitte pas, et utiliser des variables à la portée la plus courte possible.",
        deliverables: [
          "une boucle de répétition correctement arrêtée",
          "un choix d'outil justifié entre <code>switch</code> et <code>if / else if</code>",
          "au moins un cas qui lit une ligne complète avec <code>std::getline</code>"
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
    keywords: ["syntaxe", "main", "include", "cout", "cin", "getline", "types", "string", "initialisation", "affectation", "expressions", "const", "constexpr", "enum class", "conditions", "switch", "boucles", "if", "for", "while", "scope", "break", "continue"]
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
      focus: "Comprendre la syntaxe de base, c'est aussi savoir découper une ligne de code en rôles distincts : type, nom, opérateur, littéral, fonction appelée, bloc visé. Tant que tout est vu comme une masse opaque de symboles, la progression reste lente et anxieuse.",
      retenir: [
        "Un programme se lit plus facilement quand on sait identifier déclarations, expressions et instructions.",
        "Les commentaires et l'indentation n'ont pas le même statut que les symboles du langage, mais ils participent fortement à la lisibilité."
      ],
      pitfalls: [
        "Chercher à mémoriser des lignes entières au lieu de comprendre la fonction de chaque morceau.",
        "Négliger la mise en forme alors qu'elle aide à relier visuellement les blocs et les intentions."
      ],
      method: [
        "Prends un mini-programme de 8 à 10 lignes.",
        "Annote chaque ligne avec son rôle principal : inclure, déclarer, lire, calculer, décider, afficher, terminer.",
        "Réécris ensuite le même programme avec d'autres noms de variables pour vérifier que tu maîtrises la structure et non juste la copie visuelle."
      ],
      check: "Si je masque les noms métiers d'un programme, peux-tu quand même reconnaître quelles lignes déclarent, quelles lignes calculent et quelles lignes affichent ?"
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
      focus: "La saisie console paraît simple jusqu'au moment où l'on mélange mots, lignes complètes et nombres. C'est souvent ici que les débutants concluent à tort que le langage est 'capricieux', alors que le vrai sujet est le comportement du flux d'entrée.",
      retenir: [
        "<code>std::cin &gt;&gt;</code> lit un token ; <code>std::getline</code> lit une ligne entière.",
        "Un retour à la ligne laissé dans le flux peut perturber la lecture suivante."
      ],
      pitfalls: [
        "Lire un entier avec <code>cin</code> puis croire que <code>getline</code> est cassé parce qu'il lit une ligne vide.",
        "Utiliser <code>std::endl</code> partout alors qu'un simple <code>'\\n'</code> suffit généralement."
      ],
      method: [
        "Décide d'abord si l'entrée attendue est un mot, un nombre ou une ligne complète.",
        "Si tu passes de <code>cin</code> à <code>getline</code>, pense à nettoyer le flux.",
        "Teste plusieurs saisies réelles avec espaces et retours à la ligne pour valider ton programme."
      ],
      check: "Peux-tu expliquer pourquoi un nom complet comme 'Lea Martin' ne se lit pas correctement avec un simple <code>std::cin &gt;&gt; nom</code> ?"
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
