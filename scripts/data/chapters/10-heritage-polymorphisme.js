(function registerChapterBundle1(globalScope) {
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
  order: 10,
  chapter:   {
    id: "heritage-polymorphisme",
    shortTitle: "Héritage et polymorphisme",
    title: "Héritage, polymorphisme et interfaces abstraites",
    level: "Avancé",
    duration: "60 min",
    track: "SE4",
    summary:
      "Le polymorphisme n'est pas seulement un mécanisme de dispatch ; c'est une façon de concevoir des contrats extensibles. Ce chapitre montre aussi où se cachent les pièges classiques.",
    goals: [
      "utiliser l'héritage pour modéliser une relation est-un",
      "comprendre le dispatch dynamique via <code>virtual</code> et <code>override</code>",
      "choisir entre composition, classe abstraite et hiérarchie réelle"
    ],
    highlights: ["virtual", "override", "abstract class", "protected"],
    body: [
      lesson(
        "Relation est-un, classe de base et redéfinition",
        paragraphs(
          "L'héritage permet de spécialiser une classe existante pour en créer une plus précise. La question décisive reste toujours la même : la classe dérivée est-elle vraiment une sorte de la classe de base ? Si la réponse sonne faux en français, la modélisation est souvent mauvaise.",
          "On distingue alors la classe de base, qui porte le contrat commun, et la classe dérivée, qui ajoute ou adapte un comportement. Cela permet la réutilisation de code, l'ajout de nouvelles fonctionnalités et la redéfinition d'un comportement existant."
        ),
        code(
          "cpp",
          `
class Personne {
public:
    explicit Personne(std::string nom) : nom_{std::move(nom)} {}

    const std::string& nom() const { return nom_; }

    virtual void afficher() const {
        std::cout << nom_ << '\\n';
    }

    virtual ~Personne() = default;

private:
    std::string nom_;
};

class Etudiant : public Personne {
public:
    Etudiant(std::string nom, std::string id)
        : Personne(std::move(nom)), id_{std::move(id)} {}

    void afficher() const override {
        Personne::afficher();
        std::cout << id_ << '\\n';
    }

private:
    std::string id_;
};
          `,
          "Base et classe dérivée"
        ),
        bullets([
          "La redéfinition garde la même signature dans la dérivée ; la surcharge change la liste des paramètres dans une même portée logique.",
          "Une classe dérivée n'hérite pas de l'accès aux membres <code>private</code> de la base ; elle passe par l'interface publique ou protégée."
        ]),
        callout("info", "Vocabulaire utile", "Redéfinition et surcharge sont deux mécanismes différents. En C++, on peut redéfinir une méthode héritée et surcharger un nom de fonction, mais ce n'est pas la même idée.")
      ),
      lesson(
        "Constructeurs, destructeurs et ordre d'appel",
        paragraphs(
          "Quand on construit un objet dérivé, le constructeur de la base est toujours appelé en premier. À la destruction, l'ordre s'inverse : le destructeur de la dérivée s'exécute avant celui de la base.",
          "Si la classe de base ne possède pas de constructeur par défaut, la classe dérivée doit appeler explicitement un constructeur valide de la base dans sa liste d'initialisation. C'est une règle de compilation, pas un simple style."
        ),
        code(
          "cpp",
          `
class Personne {
public:
    explicit Personne(std::string nom) : nom_{std::move(nom)} {}
    virtual ~Personne() = default;

private:
    std::string nom_;
};

class Etudiant : public Personne {
public:
    Etudiant(std::string nom, std::string id)
        : Personne(std::move(nom)), id_{std::move(id)} {}

    ~Etudiant() override = default;

private:
    std::string id_;
};
          `,
          "Initialisation de la base"
        ),
        bullets([
          "Le constructeur de la base passe avant celui de la dérivée.",
          "Les destructeurs sont appelés dans l'ordre inverse.",
          "Appeler explicitement le constructeur parent rend l'intention plus lisible, même lorsqu'un constructeur par défaut existe."
        ]),
        callout("warn", "Règle importante", "Si la base n'a pas de constructeur par défaut, oublier de l'appeler dans la liste d'initialisation de la dérivée provoque une erreur de compilation.")
      ),
      lesson(
        "Modes d'héritage, protected et composition",
        paragraphs(
          "Le mot-clé placé après les deux-points contrôle la visibilité de ce que la dérivée reçoit de la base. En pratique, l'héritage <code>public</code> est celui qui exprime vraiment la relation <em>est-un</em> et c'est de loin le plus courant.",
          "Le niveau <code>protected</code> est intermédiaire : invisible depuis l'extérieur comme <code>private</code>, mais encore accessible dans les classes dérivées. Il faut l'utiliser avec sobriété, car il élargit quand même la surface de contrat."
        ),
        table(
          ["Mode", "Effet sur les membres publics de la base", "Cas typique"],
          [
            ["<code>public</code>", "Ils restent publics dans la dérivée.", "Vrai contrat est-un."],
            ["<code>protected</code>", "Ils deviennent protégés dans la dérivée.", "Conception rare, orientée famille de classes."],
            ["<code>private</code>", "Ils deviennent privés dans la dérivée.", "Détail d'implémentation ; la composition est souvent meilleure."]
          ]
        ),
        bullets([
          "L'héritage multiple existe, mais il complexifie fortement les contrats et peut mener au problème du diamant.",
          "Quand le besoin réel est 'contient un' ou 'utilise un', la composition reste plus souple que l'héritage."
        ]),
        callout("warn", "Réflexe de conception", "Commence par la composition. Garde l'héritage pour les cas où la substitution de la dérivée à la base est réellement défendable.")
      ),
      lesson(
        "Polymorphisme dynamique, virtual et override",
        paragraphs(
          "Le polymorphisme permet de choisir à l'exécution la bonne implémentation selon le type réel de l'objet, même si on le manipule via une référence ou un pointeur vers la base. Sans <code>virtual</code>, l'appel est résolu statiquement à la compilation.",
          "Le mot-clé <code>override</code> est une sécurité précieuse : il demande au compilateur de vérifier qu'on redéfinit bien une méthode virtuelle existante, ce qui évite des bugs silencieux."
        ),
        code(
          "cpp",
          `
class Polygon {
public:
    virtual ~Polygon() = default;
    virtual int getArea() const { return 0; }
};

class Rectangle : public Polygon {
public:
    Rectangle(int width, int height) : width_{width}, height_{height} {}

    int getArea() const override {
        return width_ * height_;
    }

private:
    int width_;
    int height_;
};

class Triangle : public Polygon {
public:
    Triangle(int width, int height) : width_{width}, height_{height} {}

    int getArea() const override {
        return width_ * height_ / 2;
    }

private:
    int width_;
    int height_;
};
          `,
          "Polymorphisme par classe de base"
        ),
        code(
          "cpp",
          `
std::vector<std::unique_ptr<Polygon>> formes;
formes.push_back(std::make_unique<Rectangle>(4, 5));
formes.push_back(std::make_unique<Triangle>(4, 5));

for (const auto& forme : formes) {
    std::cout << forme->getArea() << '\\n';
}
          `,
          "Collection polymorphique sûre"
        ),
        bullets([
          "Le mécanisme interne repose sur une vtable ; son coût existe mais reste généralement faible.",
          "Le polymorphisme dynamique a besoin de références ou de pointeurs sur la base."
        ])
      ),
      lesson(
        "Fonctions virtuelles pures, classes abstraites et slicing",
        paragraphs(
          "Une fonction virtuelle pure s'écrit avec <code>= 0</code> et transforme la classe en classe abstraite. Une telle classe ne peut pas être instanciée directement, mais elle constitue une excellente interface de rôle pour les classes dérivées concrètes.",
          "Les principaux pièges sont le slicing, qui détruit l'information dérivée lors d'une copie par valeur vers la base, et l'oubli d'un destructeur virtuel dans une base destinée à être détruite polymorphiquement."
        ),
        table(
          ["Type de méthode", "Syntaxe", "Effet"],
          [
            ["Non virtuelle", "<code>int f();</code>", "Résolution statique ; le comportement ne varie pas polymorphiquement."],
            ["Virtuelle", "<code>virtual int f();</code>", "Résolution dynamique avec implémentation par défaut possible."],
            ["Virtuelle pure", "<code>virtual int f() = 0;</code>", "Oblige les dérivées concrètes à fournir l'implémentation."]
          ]
        ),
        code(
          "cpp",
          `
class Shape {
public:
    virtual void draw() const = 0;
    virtual ~Shape() = default;
};

void afficher(const Shape& shape) {
    shape.draw();
}
          `,
          "Classe abstraite et référence polymorphique"
        ),
        callout("success", "Règle de survie", "Dès qu'une base est destinée à être utilisée polymorphiquement, donne-lui un destructeur virtuel et évite les copies par valeur vers ce type de base.")
      ),
      videoLesson(
        "Ces vidéos sont celles de la playlist qui épousent le mieux la progression héritage -> dispatch dynamique -> destruction correcte.",
        [
          playlistVideo("inheritance", "bonne introduction à la relation base / dérivée"),
          playlistVideo("virtualFunctions", "très utile pour visualiser le dispatch dynamique"),
          playlistVideo("virtualDestructors", "complète précisément le piège des bases polymorphiques")
        ]
      )
    ].join(""),
    checklist: [
      "Je justifie une relation d'héritage en termes de substitution réelle.",
      "Je distingue redéfinition et surcharge.",
      "Je sais que le constructeur de base s'exécute avant celui de la dérivée.",
      "Je sais appeler explicitement le constructeur parent dans la liste d'initialisation.",
      "Je connais le rôle de <code>protected</code> et les effets de <code>public</code>, <code>protected</code> et <code>private</code> à l'héritage.",
      "J'emploie <code>override</code> systématiquement.",
      "Je connais le problème du slicing.",
      "Je mets un destructeur virtuel dans une base polymorphique.",
      "Je sais quand préférer la composition à l'héritage."
    ],
    quiz: [
      {
        question: "Pourquoi un destructeur virtuel est-il crucial dans une base polymorphique ?",
        options: [
          "Parce qu'il accélère l'appel des méthodes",
          "Parce qu'il garantit la destruction complète de l'objet dérivé via un pointeur base",
          "Parce qu'il remplace tous les constructeurs"
        ],
        answer: 1,
        explanation: "Sans destructeur virtuel, la destruction via la base peut ignorer une partie du nettoyage propre au dérivé."
      },
      {
        question: "Qu'est-ce que le slicing ?",
        options: [
          "Une optimisation du compilateur",
          "La perte de la partie dérivée lors d'une copie par valeur vers le type base",
          "Une exception levée au runtime"
        ],
        answer: 1,
        explanation: "Le type statique base par valeur ne conserve pas le comportement dynamique du dérivé."
      },
      {
        question: "Que doit faire le constructeur d'une classe dérivée si la base n'a pas de constructeur par défaut ?",
        options: [
          "Rien, le compilateur en invente un automatiquement",
          "Appeler explicitement un constructeur de la base dans la liste d'initialisation",
          "Déplacer l'appel après le corps du constructeur"
        ],
        answer: 1,
        explanation: "La base doit être construite avant le corps de la dérivée ; l'appel se fait donc dans la liste d'initialisation."
      },
      {
        question: "Quel énoncé décrit le mieux <code>protected</code> ?",
        options: [
          "Visible partout comme public",
          "Invisible pour tout le monde comme private",
          "Invisible depuis l'extérieur mais accessible dans les classes dérivées"
        ],
        answer: 2,
        explanation: "<code>protected</code> ouvre l'accès aux dérivées tout en le fermant aux utilisateurs externes de la classe."
      }
    ],
    exercises: [
      {
        title: "Hiérarchie de formes",
        difficulty: "Intermédiaire",
        time: "30 min",
        prompt: "Construis une base abstraite <code>Forme</code> et au moins deux dérivés, puis stocke-les dans une collection polymorphique sans fuite mémoire ni slicing.",
        deliverables: [
          "la classe abstraite",
          "deux implémentations",
          "une démonstration sans fuite mémoire"
        ]
      },
      {
        title: "Composition ou héritage ?",
        difficulty: "Avancé",
        time: "20 min",
        prompt: "Pour trois cas métiers de ton choix, décide s'il faut composition ou héritage et justifie ton choix en une phrase chacun.",
        deliverables: [
          "les trois cas",
          "la solution retenue",
          "le critère utilisé"
        ]
      }
    ],
    keywords: ["heritage", "polymorphisme", "virtual", "override", "slicing", "abstract class", "protected", "destructeur virtuel", "heritage multiple", "composition"]
  },
  deepDives: [
    {
      focus: "L'héritage n'est justifié que s'il porte une vraie relation de substitution. Le critère le plus simple reste linguistique et métier : la dérivée doit être une sorte crédible de la base, pas seulement une classe 'qui lui ressemble'.",
      retenir: [
        "La base porte un contrat commun, pas seulement du code à réutiliser.",
        "Redéfinition et surcharge sont deux mécanismes distincts."
      ],
      pitfalls: [
        "Hériter uniquement pour éviter de recopier quelques lignes.",
        "Confondre relation métier et proximité de structure interne."
      ],
      method: [
        "Formule la relation en français : 'un X est-il vraiment un Y ?'.",
        "Vérifie ensuite ce que la base promet réellement à ses utilisateurs.",
        "Ne garde l'héritage que si la dérivée peut tenir cette promesse."
      ],
      check: "Si tu remplaces partout la base par la dérivée, le contrat reste-t-il crédible sans surprise métier ?"
    },
    {
      focus: "Les constructeurs et destructeurs rappellent que l'héritage est aussi une affaire de cycle de vie. La base est construite en premier et détruite en dernier, ce qui impose une liste d'initialisation correcte dès qu'un état de base doit être satisfait.",
      retenir: [
        "La base est toujours construite avant la dérivée.",
        "L'appel explicite au constructeur parent rend l'intention claire et sûre."
      ],
      pitfalls: [
        "Oublier qu'une base sans constructeur par défaut doit être initialisée explicitement.",
        "Croire que le corps du constructeur peut réparer une base mal construite."
      ],
      method: [
        "Identifie les invariants de la base avant d'écrire la dérivée.",
        "Initialise chaque sous-objet dans la liste d'initialisation.",
        "Relis l'ordre de construction et de destruction quand une ressource est en jeu."
      ],
      check: "Peux-tu expliquer pourquoi l'appel au constructeur de base ne se place pas dans le corps du constructeur dérivé ?"
    },
    {
      focus: "Les modes d'héritage et le mot-clé protected servent à contrôler la visibilité du contrat transmis. En pratique, l'héritage public couvre l'immense majorité des cas utiles ; les autres modes doivent être justifiés par une intention très claire.",
      retenir: [
        "public conserve l'idée est-un auprès des utilisateurs de la classe.",
        "protected ouvre l'accès aux dérivées tout en restant caché à l'extérieur."
      ],
      pitfalls: [
        "Employer private inheritance alors qu'une composition ferait mieux le travail.",
        "Utiliser protected comme un raccourci de commodité au lieu d'un vrai choix d'API."
      ],
      method: [
        "Détermine qui doit voir ou manipuler l'information héritée.",
        "Choisis ensuite le mode d'héritage le plus simple qui respecte cette intention.",
        "Réévalue le design si l'héritage multiple ou le diamant apparaissent trop vite."
      ],
      check: "Peux-tu justifier un usage de protected autrement que par 'c'est plus pratique' ?"
    },
    {
      focus: "Le polymorphisme dynamique est puissant parce qu'il retarde le choix concret d'implémentation jusqu'à l'exécution. Il rend possible un code ouvert à l'extension, mais seulement si la base reste centrée sur un rôle stable et lisible.",
      retenir: [
        "virtual active une résolution dynamique via la base.",
        "override sécurise la redéfinition au moment de la compilation."
      ],
      pitfalls: [
        "Déclarer trop de méthodes virtuelles sans véritable besoin de variation concrète.",
        "Créer une base trop bavarde qui mélange contrat commun et détails d'implémentation."
      ],
      method: [
        "Isole ce qui doit vraiment varier selon le type concret.",
        "Fais porter ce rôle par une interface courte et stable.",
        "Teste le comportement via des références ou pointeurs vers la base."
      ],
      check: "Que t'apporte concrètement le polymorphisme par rapport à un simple appel direct sur les types concrets ?"
    },
    {
      focus: "Les classes abstraites et les fonctions virtuelles pures servent à exprimer une interface de rôle. Les plus gros pièges restent le slicing et l'oubli du destructeur virtuel, parce qu'ils cassent silencieusement le contrat polymorphique au moment du stockage ou de la destruction.",
      retenir: [
        "Une classe abstraite n'est pas instanciable mais peut servir de type de référence ou de pointeur.",
        "Le destructeur virtuel et l'absence de slicing sont deux conditions de survie d'une hiérarchie polymorphique."
      ],
      pitfalls: [
        "Stocker des objets dérivés par valeur dans un conteneur de base.",
        "Détruire via un pointeur base sans destructeur virtuel."
      ],
      method: [
        "Passe en revue les signatures et conteneurs pour traquer les copies par valeur vers la base.",
        "Vérifie que la destruction se fera bien via un destructeur virtuel.",
        "Garde la hiérarchie petite, motivée et explicitement polymorphique."
      ],
      check: "Si une hiérarchie polymorphique fuit ou perd son comportement, regarderais-tu d'abord le stockage, la destruction ou le contrat de base ?"
    }
  ]
});
})(window);
