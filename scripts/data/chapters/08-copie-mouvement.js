(function registerChapterBundle8(globalScope) {
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
  order: 8,
  chapter: withChapterTheme("copie-mouvement", () => ({
    id: "copie-mouvement",
    shortTitle: "Copie et mouvement",
    title: "Copie, affectation, mouvement et règle de 0/3/5",
    level: "Avancé",
    duration: "1 h 20",
    track: "SE3",
    summary:
      "Quand une classe garde une ressource, copier l'objet n'est plus un détail. Il faut savoir si l'on duplique la ressource, si l'on la transfère, si l'on interdit certaines opérations, ou si l'on laisse le compilateur gérer. Ce chapitre développe les opérations spéciales, la copie profonde, le mouvement, l'état déplacé et la règle de 0/3/5.",
    goals: [
      "distinguer clairement construction par copie et affectation sur un objet déjà existant",
      "repérer pourquoi une copie superficielle casse une classe qui possède vraiment une ressource, et quand il faut au contraire interdire la copie ou le mouvement",
      "savoir quand viser la règle de 0 plutôt que réécrire toutes les opérations spéciales, et comprendre le rôle de <code>noexcept</code> sur le move"
    ],
    highlights: ["copy ctor", "copy assignment", "move ctor", "move assignment", "deep copy", "rule of 0"],
    body: [
      lesson(
        "Carte du terrain : quelles sont les opérations spéciales d'un type ?",
        paragraphs(
          "Avant de corriger une copie superficielle, il faut savoir de quoi on parle. Le cycle de vie spécial d'un type C++ repose autour de quelques opérations clés : constructeur, destructeur, constructeur de copie, opérateur d'affectation par copie, constructeur de déplacement et opérateur d'affectation par déplacement. Elles ne se déclenchent pas au même moment et ne servent pas aux mêmes besoins.",
          "Le point le plus important est de distinguer création d'un nouvel objet et réutilisation d'un objet déjà existant. Construire par copie crée un nouvel objet à partir d'une source. Affecter par copie remplace l'état d'un objet déjà vivant. Déplacer répond à une autre logique : transférer une ressource plutôt que la dupliquer."
        ),
        table(
          ["Opération", "Moment typique", "Question de conception"],
          [
            ["Constructeur de copie", "Création d'un nouvel objet depuis un autre", "Que signifie vraiment dupliquer ce type ?"],
            ["Affectation par copie", "Un objet existant reçoit l'état d'un autre", "Comment remplacer proprement l'état actuel ?"],
            ["Constructeur de déplacement", "Création depuis un temporaire ou un objet déplacé", "Comment transférer la ressource sans copie coûteuse ?"],
            ["Affectation par déplacement", "Un objet existant récupère une ressource transférée", "Comment libérer proprement l'ancien état avant le transfert ?"],
            ["Destructeur", "Fin de vie de l'objet", "Quelles ressources possédées faut-il relâcher ?"]
          ]
        ),
        callout("info", "Réflexe de lecture", "Quand un bug touche la copie ou le move, commence par demander quel moment précis du cycle de vie est en jeu. Le bon correctif dépend de cette réponse.")
      ),
      lesson(
        "Copie superficielle : pourquoi elle peut être toxique",
        paragraphs(
          "Si une classe possède un pointeur vers une ressource allouée, la copie membre à membre du compilateur duplique l'adresse, pas la ressource. Deux objets se retrouvent alors à croire qu'ils possèdent la même zone mémoire.",
          "La conséquence typique est le <em>double delete</em>, mais le vrai problème est conceptuel : le modèle de propriété n'était pas explicite."
        ),
        code(
          "cpp",
          `
class Buffer {
public:
    explicit Buffer(std::size_t taille)
        : taille_{taille}, data_{new int[taille]{}} {}

    ~Buffer() {
        delete[] data_;
    }

private:
    std::size_t taille_;
    int* data_;
};
          `,
          "Classe propriétaire fragile"
        ),
        callout("danger", "Signal d'alerte", "Si une classe possède un pointeur brut, pose immédiatement la question de la copie, de l'affectation et du mouvement.")
      ),
      lesson(
        "La copie profonde et l'affectation",
        paragraphs(
          "Le constructeur de copie crée un nouvel objet à partir d'un autre. L'opérateur d'affectation copie l'état dans un objet déjà existant. Ce sont deux moments distincts du cycle de vie.",
          "Dans beaucoup de cours, cette différence est apprise comme une règle de syntaxe ; en pratique, c'est surtout une différence de responsabilité."
        ),
        code(
          "cpp",
          `
Buffer(const Buffer& other)
    : taille_{other.taille_}, data_{new int[other.taille_]} {
    std::copy(other.data_, other.data_ + other.taille_, data_);
}

Buffer& operator=(const Buffer& other) {
    if (this == &other) {
        return *this;
    }

    Buffer copie{other};
    echanger(copie);
    return *this;
}
          `,
          "Copie et affectation robustes"
        ),
        callout("success", "Bonne stratégie", "La technique copy-and-swap simplifie l'affectation et aide à gérer l'auto-affectation proprement.")
      ),
      lesson(
        "Supprimer, autoriser ou laisser générer : <code>= delete</code>, <code>= default</code> et règle de 3/5",
        paragraphs(
          "Toutes les classes ne doivent pas être copiables. Si un type représente une ressource exclusive, il peut être plus juste d'interdire explicitement la copie. C++ permet alors d'annoncer cette décision avec <code>= delete</code>. À l'inverse, quand le comportement par défaut du compilateur correspond exactement au contrat voulu, <code>= default</code> évite de réécrire du code inutile.",
          "La règle de 3/5 sert alors surtout de signal d'alarme : si tu dois gérer toi-même destruction, copie ou move, il y a de fortes chances que plusieurs opérations spéciales soient concernées ensemble. Ce n'est pas une obligation d'écrire 'cinq fonctions' par réflexe, mais une invitation à réfléchir à la cohérence du type."
        ),
        code(
          "cpp",
          `
class RessourceExclusive {
public:
    RessourceExclusive() = default;
    RessourceExclusive(const RessourceExclusive&) = delete;
    RessourceExclusive& operator=(const RessourceExclusive&) = delete;
    RessourceExclusive(RessourceExclusive&&) noexcept = default;
    RessourceExclusive& operator=(RessourceExclusive&&) noexcept = default;
};
          `,
          "Exprimer explicitement ce que le type autorise ou interdit"
        ),
        bullets([
          "<code>= delete</code> documente une impossibilité voulue, pas une incapacité technique honteuse.",
          "<code>= default</code> garde le compilateur comme allié quand le contrat est déjà correct.",
          "La règle de 3/5 signale surtout qu'un type propriétaire demande une réflexion globale, pas un bricolage local."
        ]),
        callout("warn", "Bon réflexe", "Interdire la copie est souvent meilleur qu'implémenter une mauvaise copie. La bonne question reste toujours : quelle sémantique veut-on pour ce type ?")
      ),
      lesson(
        "Move semantics et règle de 0",
        paragraphs(
          "Le mouvement permet de transférer la ressource d'un objet temporaire au lieu de la recopier. Mais ce transfert doit laisser la source dans un état valide, même s'il est minimal. Un objet déplacé peut être vide, mais il ne doit pas devenir dangereux à détruire ou à réutiliser dans des opérations de base.",
          "La règle de 0 dit : si tes membres savent déjà gérer leur propre copie, destruction et mouvement, ne réécris rien. C'est souvent la vraie victoire de design, bien plus que la démonstration technique d'un move constructor artisanal."
        ),
        code(
          "cpp",
          `
class Image {
public:
    Image(Image&& other) noexcept
        : largeur_{other.largeur_}, pixels_{std::move(other.pixels_)} {
        other.largeur_ = 0;
    }

    Image& operator=(Image&& other) noexcept {
        if (this == &other) {
            return *this;
        }

        largeur_ = other.largeur_;
        pixels_ = std::move(other.pixels_);
        other.largeur_ = 0;
        return *this;
    }

private:
    int largeur_{0};
    std::vector<std::uint8_t> pixels_;
};
          `,
          "Déplacement"
        ),
        bullets([
          "La règle de 0 est souvent meilleure que la règle de 5.",
          "Le mot-clé <code>noexcept</code> aide les conteneurs à préférer le mouvement.",
          "Un objet déplacé doit rester valide même si son contenu a été transféré.",
          "Si ta classe ne possède rien directement, laisse le compilateur générer les opérations spéciales."
        ])
      ),
      videoLesson(
        "Pour ce chapitre, les deux vidéos les plus rentables sont celles qui distinguent copie coûteuse et transfert de ressource.",
        [
          playlistVideo("copyConstructors", "bonne explication du besoin de copie profonde et du coût réel de la copie"),
          playlistVideo("moveSemantics", "excellent complément pour comprendre le transfert de ressource et la règle de 0")
        ]
      )
    ].join(""),
    checklist: [
      "Je sais distinguer construction par copie et affectation.",
      "Je peux nommer et distinguer les principales opérations spéciales du cycle de vie.",
      "Je comprends pourquoi une copie superficielle peut être dangereuse.",
      "Je sais quand il vaut mieux interdire explicitement la copie ou le déplacement avec <code>= delete</code>.",
      "Je connais la règle de 0/3/5.",
      "Je sais quand le move est utile.",
      "Je peux expliquer ce qu'est un état déplacé valide et pourquoi <code>noexcept</code> aide les conteneurs.",
      "Je n'écris pas de code spécial si les membres standards suffisent."
    ],
    quiz: [
      {
        question: "Quelle opération intervient quand on crée un nouvel objet à partir d'un autre objet du même type ?",
        options: [
          "L'opérateur d'affectation par copie",
          "Le constructeur de copie",
          "Le destructeur"
        ],
        answer: 1,
        explanation: "L'objet n'existe pas encore : on le construit. Ce n'est donc pas une affectation sur objet vivant, mais une construction par copie."
      },
      {
        question: "Quelle phrase décrit le mieux la règle de 0 ?",
        options: [
          "Toujours écrire cinq opérations spéciales",
          "Éviter d'écrire les opérations spéciales quand les membres gèrent déjà la ressource",
          "Interdire toute copie dans le projet"
        ],
        answer: 1,
        explanation: "La règle de 0 pousse à déléguer la gestion mémoire aux types standards pour ne pas réimplémenter inutilement le cycle de vie."
      },
      {
        question: "Pourquoi <code>= delete</code> peut-il être un bon choix sur une opération de copie ?",
        options: [
          "Parce qu'il exprime explicitement que cette sémantique n'a pas de sens pour le type",
          "Parce qu'il rend automatiquement la classe plus rapide",
          "Parce qu'il force toujours l'utilisation de <code>shared_ptr</code>"
        ],
        answer: 0,
        explanation: "Interdire une opération incohérente est souvent plus sain que fournir une implémentation trompeuse. Le code documente alors clairement la sémantique autorisée."
      },
      {
        question: "Pourquoi un move constructor marqué <code>noexcept</code> est-il utile ?",
        options: [
          "Parce qu'il évite toute allocation",
          "Parce qu'il permet à certains conteneurs de privilégier le déplacement en sécurité",
          "Parce qu'il interdit les destructeurs"
        ],
        answer: 1,
        explanation: "Les conteneurs standard peuvent choisir le déplacement seulement s'ils ont la garantie qu'il ne lancera pas d'exception."
      },
      {
        question: "Quel énoncé décrit correctement un objet après un déplacement ?",
        options: [
          "Il peut être vide ou minimal, mais doit rester valide à détruire et à réaffecter",
          "Il devient automatiquement inutilisable et interdit par la norme",
          "Il conserve toujours exactement la même valeur qu'avant"
        ],
        answer: 0,
        explanation: "Le standard exige surtout un état valide, pas un état identique. L'objet déplacé doit encore supporter une destruction correcte et des usages de base raisonnables."
      }
    ],
    exercises: [
      {
        title: "Autopsie d'une double libération",
        difficulty: "Avancé",
        time: "30 min",
        prompt: "Crée une classe propriétaire minimale, provoque volontairement une copie superficielle puis corrige-la avec copie profonde ou règle de 0.",
        deliverables: [
          "le scénario de bug",
          "l'explication de la double possession",
          "la version corrigée"
        ]
      },
      {
        title: "Passer de la règle de 5 à la règle de 0",
        difficulty: "Avancé",
        time: "30 min",
        prompt: "Refactorise une classe qui gère un buffer brut pour qu'elle s'appuie sur <code>std::vector</code> ou <code>std::string</code> et supprime les opérations spéciales maison.",
        deliverables: [
          "la classe initiale",
          "la classe simplifiée",
          "les fonctions spéciales supprimées"
        ]
      },
      {
        title: "Décider ce qui est copiable ou non",
        difficulty: "Avancé",
        time: "25 min",
        prompt: "Pour quatre types différents de ton choix, décide si la copie doit être autorisée, interdite, profonde ou remplacée par un simple déplacement. Pour chacun, écris la justification métier avant de choisir entre <code>= default</code>, <code>= delete</code> ou implémentation personnalisée.",
        deliverables: [
          "les quatre types avec leur sémantique de copie/move",
          "les déclarations d'opérations spéciales correspondantes",
          "une justification qui relie chaque choix à l'ownership du type"
        ]
      }
    ],
    keywords: ["copy", "move", "copy constructor", "move constructor", "copy assignment", "move assignment", "rule of 0", "rule of 5", "rule of 3", "assignment", "deep copy", "delete", "default", "noexcept"]
  })),
  deepDives: [
    {
      focus: "Les opérations spéciales n'appartiennent pas toutes au même moment du cycle de vie. Les distinguer clairement évite la confusion la plus fréquente du chapitre : croire qu'une affectation et une construction par copie seraient le même mécanisme écrit autrement.",
      retenir: [
        "Construire un objet et remplacer l'état d'un objet existant sont deux situations différentes.",
        "Le destructeur, la copie et le move forment un petit système cohérent autour de la ressource possédée."
      ],
      pitfalls: [
        "Corriger un bug de copie dans l'opérateur d'affectation alors que le vrai problème vient du constructeur de copie.",
        "Parler de 'copie' de façon vague sans préciser le moment du cycle de vie."
      ],
      method: [
        "Repère si l'objet cible existe déjà ou non.",
        "Choisis ensuite l'opération spéciale réellement concernée.",
        "Vérifie enfin si la ressource possédée exige une sémantique cohérente sur les autres opérations."
      ],
      check: "Quand un objet n'existe pas encore, peux-tu expliquer pourquoi l'opérateur d'affectation n'est pas l'outil en jeu ?"
    },
    {
      focus: "La copie superficielle devient dangereuse dès qu'un objet gère une ressource exclusive. Deux objets qui pensent posséder la même ressource finissent presque toujours par produire des doubles libérations ou des alias inattendus.",
      retenir: [
        "Une copie correcte doit préserver la validité et la sémantique du type.",
        "Les ressources possédées rendent la copie implicite suspecte tant qu'elle n'est pas examinée."
      ],
      pitfalls: [
        "Laisser le compilateur générer une copie par défaut pour un type propriétaire.",
        "Confondre égalité logique et duplication indépendante des ressources."
      ],
      method: [
        "Repère si le type possède une ressource non copiée automatiquement de façon sûre.",
        "Décris ce que doit signifier une copie du point de vue métier.",
        "Implémente ou interdits les opérations spéciales selon cette sémantique."
      ],
      check: "Si deux objets issus d'une copie se détruisent indépendamment, est-ce forcément sûr pour ta ressource ?"
    },
    {
      focus: "Copie profonde et affectation doivent garantir un état cohérent même en cas d'auto-affectation ou d'exception. Le sujet n'est pas seulement de 'copier toutes les données', mais de conserver un contrat robuste.",
      retenir: [
        "L'affectation remplace l'état d'un objet existant ; elle n'est pas identique à la construction.",
        "Une bonne implémentation pense aussi au cas où l'opération échoue au milieu."
      ],
      pitfalls: [
        "Réécrire l'affectation comme une suite de lignes sans stratégie de sécurité.",
        "Oublier l'auto-affectation ou laisser l'objet dans un état partiel."
      ],
      method: [
        "Définis d'abord ce que l'objet doit garantir après l'opération.",
        "Choisis ensuite une stratégie sûre : copie temporaire, swap, ou interdiction explicite.",
        "Teste mentalement le cas this == &other et le cas d'échec intermédiaire."
      ],
      check: "Peux-tu expliquer en quoi l'opérateur d'affectation a des contraintes différentes du constructeur de copie ?"
    },
    {
      focus: "Le duo <code>= default</code> / <code>= delete</code> permet d'exprimer clairement la sémantique d'un type sans réécrire du code inutile. C'est une partie importante du chapitre, car tous les types n'ont pas vocation à être librement copiables ou déplaçables.",
      retenir: [
        "Supprimer explicitement une opération peut être un choix de design sain.",
        "Laisser le compilateur générer ce qui convient déjà est souvent préférable à une implémentation maison."
      ],
      pitfalls: [
        "Implémenter une copie médiocre alors qu'il aurait fallu l'interdire.",
        "Écrire des opérations spéciales juste pour 'faire complet', sans besoin réel."
      ],
      method: [
        "Décide d'abord si la copie a un sens métier.",
        "Si oui, choisis entre comportement par défaut et implémentation personnalisée.",
        "Si non, annonce l'interdiction explicitement avec <code>= delete</code>."
      ],
      check: "Pour un type propriétaire exclusif, sais-tu justifier pourquoi <code>= delete</code> peut mieux documenter l'intention qu'une copie imparfaite ?"
    },
    {
      focus: "Les move semantics permettent de transférer proprement une ressource au lieu de la copier. Mais la vraie maturité consiste souvent à concevoir des types qui n'ont même plus besoin de gérer explicitement la copie ou le mouvement : c'est l'esprit de la règle de 0.",
      retenir: [
        "Le move rend les transferts efficaces lorsque le type possède une ressource transférable.",
        "La règle de 0 reste l'objectif quand les membres standards savent déjà porter le comportement."
      ],
      pitfalls: [
        "Écrire les cinq opérations spéciales alors qu'un vector ou un string aurait suffi.",
        "Laisser après move un objet dans un état ambigu ou difficile à documenter."
      ],
      method: [
        "Commence par voir si tu peux déléguer la ressource à des types standards.",
        "Si un move explicite reste nécessaire, définis l'état valide de l'objet déplacé.",
        "Mesure ensuite si cette complexité apporte vraiment quelque chose."
      ],
      check: "Pour ton type, vaut-il mieux écrire une règle de 5 complète ou repenser la représentation pour revenir à la règle de 0 ?"
    }
  ]
});
})(window);
