(function registerChapterBundle5(globalScope) {
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
  order: 5,
  chapter:   {
    id: "classes-encapsulation",
    shortTitle: "Classes et encapsulation",
    title: "Classes, encapsulation et conception d'interface",
    level: "Intermédiaire",
    duration: "40 min",
    track: "SE2",
    summary:
      "Une classe utile ne sert pas à ranger des variables sous le même toit. Elle protège un invariant métier et expose seulement ce qu'il faut pour travailler avec l'objet sans pouvoir le casser.",
    goals: [
      "concevoir une classe à partir d'un invariant métier plutôt qu'à partir d'une liste de champs",
      "séparer l'interface publique, l'état privé et les choix d'implémentation",
      "utiliser <code>const</code>, les accesseurs et <code>this</code> uniquement quand ils clarifient réellement le contrat"
    ],
    highlights: ["private", "invariant", "const", "this", "API"],
    body: [
      lesson(
        "Modèle mental : une classe défend une règle de cohérence",
        paragraphs(
          "L'encapsulation sert à protéger ce qui doit toujours rester vrai. Cette propriété s'appelle un invariant. Une <code>Fraction</code> ne devrait jamais avoir un dénominateur nul, un <code>Compte</code> peut interdire certains découverts, un <code>Rectangle</code> doit garder des dimensions cohérentes.",
          "Si tous les champs sont publics, n'importe quel appelant peut briser cette cohérence sans passer par les règles de la classe. Une bonne classe agit donc comme une frontière : elle accepte certaines opérations, en refuse d'autres et garantit un état valide."
        ),
        table(
          ["Question de conception", "Ce qu'une bonne classe doit répondre"],
          [
            ["Qu'est-ce qui doit toujours rester vrai ?", "L'invariant de l'objet."],
            ["Qui peut modifier cet état ?", "Seulement les opérations autorisées par la classe."],
            ["Que doit connaître l'utilisateur ?", "L'interface publique, pas les détails internes."]
          ]
        ),
        callout("info", "Point de départ sain", "Commence par écrire la phrase 'un objet valide doit toujours respecter...' avant d'écrire ses champs. Tu obtiens souvent une meilleure API.")
      ),
      lesson(
        "Exemple minimal : une classe simple qui raconte un invariant",
        paragraphs(
          "Voici un exemple volontairement court. La classe n'expose pas ses champs et concentre les opérations utiles. Même si le code réel peut être plus riche, ce squelette montre déjà la bonne direction : état privé, contrat explicite, méthodes en lecture marquées <code>const</code>.",
          "Le but n'est pas de multiplier les getters et setters, mais d'offrir des verbes métier qui gardent l'objet valide."
        ),
        code(
          "cpp",
          `
class Fraction {
public:
    Fraction(int numerateur, int denominateur);
    double valeur() const;
    void multiplierPar(int facteur);

private:
    int numerateur_;
    int denominateur_;
};
          `,
          "Un minimum d'API, un maximum d'intention"
        ),
        bullets([
          "Le dénominateur ne devrait jamais devenir nul après construction.",
          "<code>valeur()</code> ne modifie pas l'objet : le <code>const</code> le rend visible.",
          "Un verbe métier comme <code>multiplierPar</code> raconte mieux l'intention qu'un simple setter générique."
        ]),
        callout("success", "Exemple minimal avant les variantes", "Même une petite classe gagne à séparer ce qu'elle promet publiquement de la manière dont elle stocke réellement ses données.")
      ),
      lesson(
        "Piège classique : une API trop bavarde casse l'invariant au lieu de le défendre",
        paragraphs(
          "Le faux bon réflexe consiste à rendre les champs publics ou à générer mécaniquement des getters et setters pour tout. On croit alors 'faire de l'objet', mais on retire justement à la classe sa capacité à protéger l'état.",
          "Si n'importe qui peut écrire n'importe quelle valeur à tout moment, la classe n'est plus un contrat : c'est juste une structure de données déguisée."
        ),
        code(
          "cpp",
          `
struct FractionPublique {
    int numerateur;
    int denominateur;
};

FractionPublique f{1, 2};
f.denominateur = 0; // invariant cassé hors du contrôle de la classe
          `,
          "Le bug n'est pas dans une méthode, mais dans l'absence de frontière"
        ),
        callout("warn", "Piège classique", "Une classe avec des setters partout semble flexible, mais elle disperse les règles métier chez les appelants. Plus l'invariant est important, moins tu dois laisser l'état être modifié librement.")
      ),
      lesson(
        "Vérification active : ce qu'il faut savoir expliquer à l'oral",
        paragraphs(
          "À l'oral, tu dois pouvoir expliquer pourquoi un attribut est privé, pourquoi une méthode est marquée <code>const</code> et pourquoi telle opération mérite un nom métier plutôt qu'un simple accesseur automatique.",
          "Le pointeur implicite <code>this</code> sert à désigner l'objet courant. Il est surtout utile quand tu veux lever une ambiguïté de nom ou retourner l'objet lui-même pour chaîner des appels."
        ),
        table(
          ["Question", "Réponse attendue"],
          [
            ["Pourquoi mettre les données en <code>private</code> ?", "Pour empêcher des modifications qui casseraient l'invariant."],
            ["Pourquoi une méthode <code>const</code> ?", "Pour promettre une lecture sans modification de l'état logique."],
            ["Pourquoi éviter des getters/setters automatiques ?", "Parce qu'ils exposent souvent l'état sans vraie valeur métier."],
            ["Quand utiliser <code>this</code> ?", "Quand cela clarifie le code, par exemple pour retourner <code>*this</code>."]
          ]
        ),
        code(
          "cpp",
          `
class Compteur {
public:
    Compteur& incrementer() {
        ++valeur_;
        return *this;
    }

private:
    int valeur_{0};
};
          `,
          "Retourner *this"
        ),
        callout("info", "Ce qu'il faut savoir expliquer à l'oral", "Je peux dire quel invariant la classe protège, quelles méthodes lisent, quelles méthodes modifient, et pourquoi l'interface publique est plus petite que l'état interne.")
      ),
      lesson(
        "Pont vers la suite : quand une classe possède une ressource, sa durée de vie devient centrale",
        paragraphs(
          "Dès qu'une classe possède autre chose que de simples valeurs triviales, son cycle de vie devient un sujet de conception. Fichier, socket, buffer, mutex ou mémoire dynamique ne se gèrent pas comme un <code>int</code> : il faut réfléchir à l'acquisition et à la libération de la ressource.",
          "C'est ce qui mène naturellement au chapitre suivant. Une classe n'est pas seulement une frontière de données ; elle peut aussi devenir la gardienne d'une ressource grâce aux constructeurs, destructeurs et au principe RAII."
        ),
        code(
          "cpp",
          `
class Journal {
public:
    explicit Journal(const std::string& chemin);
    void ecrire(const std::string& message);

private:
    std::ofstream flux_;
};
          `,
          "Une classe peut protéger un invariant et posséder une ressource"
        ),
        callout("success", "Pont vers le chapitre suivant", "Après l'encapsulation, la question n'est plus seulement 'quelles données protéger ?', mais aussi 'comment garantir qu'une ressource est acquise et libérée au bon moment ?'")
      ),
      videoLesson(
        "Cette courte sélection aide bien à passer de l'idée de structure de données à celle de vraie classe métier.",
        [
          playlistVideo("classes", "pose les bases de la syntaxe et de la frontière publique / privée"),
          playlistVideo("revaninioClasses", "version francophone si tu préfères une introduction POO plus progressive"),
          playlistVideo("classesVsStructs", "utile pour clarifier ce que l'encapsulation change vraiment"),
          playlistVideo("writeClass", "fait le lien entre invariant, méthodes et interface")
        ]
      )
    ].join(""),
    checklist: [
      "Je peux formuler l'invariant principal d'une classe avant d'écrire ses méthodes.",
      "Je peux expliquer pourquoi des attributs privés protègent mieux l'objet que des champs publics.",
      "Je peux justifier l'usage d'une méthode <code>const</code> sur une API de lecture.",
      "Je peux distinguer une vraie opération métier d'un getter ou setter mécanique.",
      "Je peux expliquer le rôle de <code>this</code> sans le présenter comme une fin en soi.",
      "Je peux relire une classe et dire si son interface publique est plus grosse qu'elle ne devrait l'être."
    ],
    quiz: [
      {
        question: "Quel est le principal intérêt de rendre les attributs privés ?",
        options: [
          "Réduire la taille mémoire de l'objet",
          "Protéger l'invariant et contrôler les modifications",
          "Accélérer automatiquement les appels"
        ],
        answer: 1,
        explanation: "Le vrai gain n'est pas une optimisation technique, mais une garantie de cohérence. La classe peut filtrer les opérations autorisées au lieu de subir des écritures arbitraires."
      },
      {
        question: "Que signifie une méthode marquée <code>const</code> ?",
        options: [
          "Elle est compilée une seule fois",
          "Elle ne modifie pas l'état logique de l'objet",
          "Elle doit être appelée depuis <code>main</code>"
        ],
        answer: 1,
        explanation: "Le <code>const</code> fait partie du contrat public de la méthode. Il aide à distinguer lecture et écriture, ce qui améliore à la fois la sûreté et la lisibilité."
      },
      {
        question: "Quel problème révèle ce design ?<br><code>struct Fraction { int numerateur; int denominateur; };</code>",
        options: [
          "Aucun, car une structure publique est toujours préférable à une classe",
          "L'invariant peut être cassé librement depuis l'extérieur",
          "Le type ne pourra jamais être instancié"
        ],
        answer: 1,
        explanation: "Le risque n'est pas dans la syntaxe <code>struct</code> elle-même, mais dans l'absence de frontière. Un appelant peut rendre la fraction invalide sans passer par une règle métier."
      },
      {
        question: "Pourquoi une méthode peut-elle retourner <code>*this</code> ?",
        options: [
          "Pour retourner l'objet courant et permettre un chaînage d'appels",
          "Pour forcer la copie complète de l'objet",
          "Parce que <code>this</code> désigne toujours un objet global"
        ],
        answer: 0,
        explanation: "Retourner <code>*this</code> renvoie une référence sur l'objet courant. C'est utile pour chaîner des opérations tout en gardant une API lisible."
      }
    ],
    exercises: [
      {
        title: "Fraction robuste",
        difficulty: "Intermédiaire",
        time: "30 min",
        prompt: "Conçois une classe <code>Fraction</code> qui interdit un dénominateur nul, expose une API courte et lisible, et permet au moins l'affichage, la conversion en valeur réelle et une opération métier simple. Le but est d'écrire une classe qu'on peut utiliser sans avoir besoin de connaître ses champs internes.",
        deliverables: [
          "l'invariant formulé explicitement en une phrase",
          "un header et un source avec au moins une méthode <code>const</code>",
          "un petit programme de démonstration qui montre qu'on ne peut pas casser l'objet par l'extérieur"
        ]
      },
      {
        title: "Réviser une classe bavarde",
        difficulty: "Intermédiaire",
        time: "25 min",
        prompt: "Prends une classe volontairement bavarde, pleine de getters et setters, puis redessine une API plus métier. Supprime ce qui n'apporte pas de valeur, renomme les opérations restantes avec de vrais verbes, et explique ce que l'invariant gagne au passage.",
        deliverables: [
          "la version initiale annotée avec les points d'exposition inutiles",
          "la version révisée avec une interface publique plus petite",
          "une explication de ce que la simplification protège ou clarifie"
        ]
      }
    ],
    keywords: ["classe", "encapsulation", "const", "this", "invariant", "interface", "private", "api", "design"]
  },
  deepDives: [
    {
      focus: "Une classe utile protège un état valide et propose des opérations qui ont du sens. Si elle ne fait que regrouper des champs publics, elle ne joue pas encore vraiment son rôle d'abstraction.",
      retenir: [
        "L'encapsulation sert à préserver des invariants, pas à cacher arbitrairement des données.",
        "Une classe doit être pensée depuis son contrat d'utilisation avant son stockage interne."
      ],
      pitfalls: [
        "Exposer trop vite les données au lieu de construire de vraies opérations métier.",
        "Ajouter des méthodes parce qu'elles sont faciles à coder, non parce qu'elles appartiennent à l'abstraction."
      ],
      method: [
        "Écris d'abord ce qu'un utilisateur légitime de la classe doit pouvoir faire.",
        "Déduis ensuite les invariants qui doivent toujours rester vrais.",
        "Enfin, choisis les données internes qui permettent de tenir ce contrat."
      ],
      check: "Peux-tu décrire l'invariant principal d'une classe sans citer sa représentation mémoire détaillée ?"
    },
    {
      focus: "Le découpage header/source et les méthodes const rendent l'interface plus fiable. Ils forcent à distinguer ce qui appartient au contrat public et ce qui relève du détail d'implémentation.",
      retenir: [
        "Une méthode const promet de ne pas modifier l'état observable de l'objet.",
        "Le lecteur doit comprendre l'API d'une classe sans ouvrir tout son .cpp."
      ],
      pitfalls: [
        "Retirer const pour 'faire marcher' le code au lieu d'interroger la conception.",
        "Mélanger dans le header des détails internes qui devraient rester en source."
      ],
      method: [
        "Passe en revue l'API en séparant clairement lecture et modification.",
        "Ajoute const partout où la promesse tient réellement.",
        "Déplace en source tout ce qui n'a pas besoin d'être visible publiquement."
      ],
      check: "Quand une méthode devrait-elle être const, et qu'est-ce que ce choix dit sur le contrat de la classe ?"
    },
    {
      focus: "Le pointeur this et la cohérence des noms aident à écrire des méthodes compréhensibles, surtout lorsque les paramètres ressemblent aux attributs. L'enjeu n'est pas d'utiliser this partout, mais de garder une intention limpide.",
      retenir: [
        "this rappelle qu'une méthode travaille toujours dans le contexte d'une instance précise.",
        "Des conventions de nommage stables limitent les ambiguïtés et les erreurs de lecture."
      ],
      pitfalls: [
        "Multiplier les noms flous comme value, data ou tmp alors que le domaine mérite mieux.",
        "Employer this de façon décorative au lieu de clarifier un conflit réel."
      ],
      method: [
        "Choisis une convention de nommage constante pour attributs et paramètres.",
        "Utilise this uniquement lorsque cela améliore vraiment la lisibilité.",
        "Relis les méthodes en supprimant toute ambiguïté entre entrée, état interne et résultat."
      ],
      check: "Peux-tu montrer comment une convention de noms cohérente évite un bug ou une confusion dans une méthode ?"
    }
  ]
});
})(window);
