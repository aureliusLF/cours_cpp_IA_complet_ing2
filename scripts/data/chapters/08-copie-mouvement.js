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
    duration: "50 min",
    track: "SE3",
    summary:
      "Quand une classe garde une ressource, copier l'objet n'est plus un détail. Il faut savoir si l'on duplique la ressource, si l'on la transfère, ou si l'on laisse le compilateur gérer. C'est là que copie, affectation et move deviennent concrets.",
    goals: [
      "distinguer clairement construction par copie et affectation sur un objet déjà existant",
      "repérer pourquoi une copie superficielle casse une classe qui possède vraiment une ressource",
      "savoir quand il vaut mieux viser la règle de 0 plutôt que réécrire toutes les opérations spéciales"
    ],
    highlights: ["deep copy", "move", "rule of 0"],
    body: [
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
        "Move semantics et règle de 0",
        paragraphs(
          "Le mouvement permet de transférer la ressource d'un objet temporaire au lieu de la recopier. Mais la meilleure stratégie reste souvent d'éviter de gérer soi-même la ressource en utilisant des types standards.",
          "La règle de 0 dit : si tes membres savent déjà gérer leur propre copie, destruction et mouvement, ne réécris rien."
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
      "Je comprends pourquoi une copie superficielle peut être dangereuse.",
      "Je connais la règle de 0/3/5.",
      "Je sais quand le move est utile.",
      "Je n'écris pas de code spécial si les membres standards suffisent."
    ],
    quiz: [
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
        question: "Pourquoi un move constructor marqué <code>noexcept</code> est-il utile ?",
        options: [
          "Parce qu'il évite toute allocation",
          "Parce qu'il permet à certains conteneurs de privilégier le déplacement en sécurité",
          "Parce qu'il interdit les destructeurs"
        ],
        answer: 1,
        explanation: "Les conteneurs standard peuvent choisir le déplacement seulement s'ils ont la garantie qu'il ne lancera pas d'exception."
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
      }
    ],
    keywords: ["copy", "move", "rule of 0", "rule of 5", "assignment", "deep copy"]
  })),
  deepDives: [
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
