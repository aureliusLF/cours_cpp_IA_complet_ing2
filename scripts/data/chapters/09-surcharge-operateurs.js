(function registerChapterBundle9(globalScope) {
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
  order: 9,
  chapter: withChapterTheme("surcharge-operateurs", () => ({
    id: "surcharge-operateurs",
    shortTitle: "Surcharge d'opérateurs",
    title: "Surcharge d'opérateurs avec une vraie sémantique",
    level: "Avancé",
    duration: "1 h 15",
    track: "SE3",
    summary:
      "On surcharge un opérateur seulement si cela rend l'objet plus simple à lire et à utiliser. Le but n'est pas de montrer une astuce de syntaxe, mais de respecter l'intuition du lecteur, de choisir la bonne forme membre ou non-membre, et d'éviter les opérateurs qui surprennent plus qu'ils n'aident.",
    goals: [
      "choisir entre opérateur membre et fonction libre selon le contrat visé",
      "respecter les attentes naturelles derrière +, ==, <<, >>, ++, [] ou les conversions éventuelles",
      "gérer proprement les flux et les comparaisons sans comportement surprenant, puis savoir quand renoncer à une surcharge"
    ],
    highlights: ["friend", "operator<<", "operator>>", "comparaisons", "++", "cohérence"],
    body: [
      lesson(
        "Quand surcharger et quand s'abstenir",
        paragraphs(
          "Un opérateur est justifié si l'objet porte naturellement la sémantique associée. Une <code>Fraction</code> mérite <code>+</code> et <code>*</code> ; une classe <code>BaseDeDonnees</code> mérite rarement <code>operator+</code>.",
          "Le bon critère est la surprise : si l'opérateur fait autre chose que ce qu'un lecteur attend, mieux vaut une méthode nommée."
        ),
        callout("warn", "Mauvaise odeur", "Si tu dois expliquer longuement ce que fait un opérateur, c'est probablement qu'il ne fallait pas le surcharger.")
      ),
      lesson(
        "Panorama utile : tous les opérateurs ne racontent pas la même chose",
        paragraphs(
          "Surcharger <code>+</code>, <code>==</code> ou <code>&lt;&lt;</code> est fréquent car leur sémantique est assez naturelle sur certains types. En revanche, d'autres opérateurs demandent beaucoup plus de prudence : <code>++</code> implique une notion d'incrément claire, <code>[]</code> une idée d'accès indexé, et un opérateur de conversion peut devenir très dangereux s'il déclenche des conversions implicites inattendues.",
          "Le bon réflexe n'est donc pas 'est-ce techniquement possible ?' mais 'quelle intuition le lecteur transporte-t-il déjà avec cet opérateur ?'. Si ton type ne correspond pas à cette intuition, le gain de syntaxe ne compense pas la perte de clarté."
        ),
        table(
          ["Opérateur", "Question à se poser avant surcharge"],
          [
            ["<code>+</code>", "Le type possède-t-il vraiment une addition naturelle et non surprenante ?"],
            ["<code>==</code>", "Sais-tu définir clairement l'égalité logique ?"],
            ["<code>&lt;&lt;</code> / <code>&gt;&gt;</code>", "L'objet a-t-il une représentation textuelle lisible et réversible ?"],
            ["<code>++</code>", "L'idée d'élément suivant ou d'incrément a-t-elle un sens métier stable ?"],
            ["<code>[]</code>", "Le type se comporte-t-il comme une collection ou un accès indexé crédible ?"],
            ["Conversion", "Une conversion implicite risque-t-elle de brouiller le code ?"]
          ]
        ),
        callout("info", "Filtre simple", "Plus l'opérateur transporte d'intuition forte chez le lecteur, plus tu dois être strict sur sa sémantique réelle.")
      ),
      lesson(
        "Membre ou non-membre ?",
        paragraphs(
          "Les opérateurs qui modifient l'objet de gauche sont souvent des méthodes membres comme <code>operator+=</code>. Les opérateurs binaires symétriques comme <code>operator+</code> sont souvent mieux exprimés en fonction libre pour conserver la symétrie des conversions.",
          "<code>operator&lt;&lt;</code> est un cas classique : son premier argument est le flux, donc ce n'est pas une méthode naturelle de votre classe."
        ),
        code(
          "cpp",
          `
class Fraction {
public:
    Fraction& operator+=(const Fraction& other);
    friend std::ostream& operator<<(std::ostream& out, const Fraction& value);
};

Fraction operator+(Fraction left, const Fraction& right) {
    left += right;
    return left;
}
          `,
          "Symétrie et réutilisation"
        ),
        bullets([
          "<code>+=</code> modifie l'objet courant : méthode membre.",
          "<code>+</code> réutilise <code>+=</code> : fonction libre.",
          "<code>&lt;&lt;</code> retourne le flux pour permettre le chaînage."
        ])
      ),
      lesson(
        "Comparaisons et contrats implicites",
        paragraphs(
          "Une comparaison doit être stable et intuitive. Si tu définis <code>==</code>, demande-toi immédiatement ce que signifie l'égalité pour ton type : identité mémoire, même valeur logique, même représentation simplifiée ?",
          "En C++20, le <code>spaceship operator</code> simplifie la génération des comparaisons, mais il ne remplace pas la réflexion sur le contrat métier."
        ),
        code(
          "cpp",
          `
bool operator==(const Fraction& left, const Fraction& right) {
    return left.numerateur() * right.denominateur() ==
           right.numerateur() * left.denominateur();
}
          `,
          "Égalité logique"
        ),
        callout("info", "Point de méthode", "Documente ce que signifie l'égalité d'un type. C'est souvent plus important que la syntaxe de l'opérateur lui-même.")
      ),
      lesson(
        "Préfixe, postfixe, conversion explicite et <code>operator[]</code>",
        paragraphs(
          "Certaines surcharges sont plus piégeuses parce qu'elles possèdent plusieurs formes. C'est le cas de <code>++</code> en préfixe et en postfixe, qui ne racontent pas exactement la même chose. C'est aussi le cas des opérateurs de conversion, qui peuvent rendre le code trop implicite si on oublie <code>explicit</code> là où il le faut.",
          "L'opérateur <code>[]</code>, lui, doit préserver l'intuition d'un accès indexé. Si ton type ne représente pas une vue ou une collection cohérente, mieux vaut proposer une méthode nommée. L'objectif reste toujours le même : réduire la friction de lecture, pas montrer qu'on maîtrise la syntaxe."
        ),
        code(
          "cpp",
          `
class Compteur {
public:
    Compteur& operator++() {      // prefixe
        ++valeur_;
        return *this;
    }

    Compteur operator++(int) {    // postfixe
        Compteur copie{*this};
        ++(*this);
        return copie;
    }

private:
    int valeur_{0};
};
          `,
          "Prefixe et postfixe racontent deux contrats differents"
        ),
        bullets([
          "Le préfixe renvoie généralement l'objet modifié ; le postfixe garde l'ancienne valeur en mémoire.",
          "Une conversion implicite doit rester exceptionnelle ; <code>explicit</code> protège souvent mieux la lisibilité.",
          "<code>operator[]</code> suppose un accès indexé cohérent et stable."
        ]),
        callout("warn", "Surcharges sensibles", "Les opérateurs de conversion et certaines formes comme le postfixe créent très vite des surprises. N'y touche que si la sémantique reste vraiment évidente.")
      ),
      lesson(
        "Opérateur d'extraction >> et les six comparaisons",
        paragraphs(
          "L'opérateur <code>operator&gt;&gt;</code> est le symétrique de <code>operator&lt;&lt;</code> : il lit depuis un flux vers un objet. Sa signature prend un <code>std::istream&amp;</code> en premier argument et retourne cette même référence, comme son pendant de sortie retourne un <code>std::ostream&amp;</code>.",
          "Les six opérateurs de comparaison (<code>==</code>, <code>!=</code>, <code>&lt;</code>, <code>&gt;</code>, <code>&lt;=</code>, <code>&gt;=</code>) forment un groupe cohérent. En C++ classique, si tu définis l'un d'eux, les autres doivent être en accord. La règle pratique : implémenter <code>==</code> et <code>&lt;</code> en logique, puis dériver les quatre restants."
        ),
        code(
          "cpp",
          `
class Date {
    short jour_, mois_;
    int annee_;
public:
    Date(short j, short m, int a) : jour_{j}, mois_{m}, annee_{a} {}

    // lecture depuis un flux : "12 3 2025"
    friend std::istream& operator>>(std::istream& in, Date& d) {
        in >> d.jour_ >> d.mois_ >> d.annee_;
        return in;
    }

    bool operator==(const Date& other) const {
        return annee_ == other.annee_ && mois_ == other.mois_ && jour_ == other.jour_;
    }
    bool operator!=(const Date& other) const { return !(*this == other); }
    bool operator< (const Date& other) const {
        if (annee_ != other.annee_) return annee_ < other.annee_;
        if (mois_  != other.mois_)  return mois_  < other.mois_;
        return jour_ < other.jour_;
    }
    bool operator> (const Date& other) const { return other < *this; }
    bool operator<=(const Date& other) const { return !(other < *this); }
    bool operator>=(const Date& other) const { return !(*this < other); }
};
          `,
          "operator>> et les 6 comparaisons"
        ),
        bullets([
          "<code>operator&gt;&gt;</code> retourne <code>istream&amp;</code> (non-const) pour permettre le chaînage.",
          "Déclarer en <code>friend</code> permet d'accéder aux membres privés depuis la fonction libre.",
          "Dériver <code>!=</code>, <code>&gt;</code>, <code>&lt;=</code>, <code>&gt;=</code> depuis <code>==</code> et <code>&lt;</code> évite la duplication de la logique de comparaison.",
          "En C++20, le <code>spaceship operator &lt;=&gt;</code> génère les six automatiquement."
        ]),
        callout("warn", "Opérateur hors de la classe", "Surcharger <code>&lt;</code> comme fonction libre plutôt que comme méthode membre permet d'éviter des problèmes d'accès en cas de type primitif à gauche, mais nécessite alors <code>friend</code> si l'implémentation lit des membres privés.")
      )
    ].join(""),
    checklist: [
      "Je surcharge seulement quand la sémantique est naturelle.",
      "Je sais distinguer opérateur membre et non-membre.",
      "Je peux expliquer pourquoi certains opérateurs comme <code>++</code>, <code>[]</code> ou les conversions sont plus sensibles que <code>+</code> ou <code>==</code>.",
      "Je fais retourner le flux dans <code>operator&lt;&lt;</code>.",
      "Je retourne <code>istream&amp;</code> dans <code>operator&gt;&gt;</code>.",
      "Je définis l'égalité selon un vrai contrat métier.",
      "Je réutilise les opérateurs composés pour limiter la duplication.",
      "Je sais dériver les 6 opérateurs de comparaison depuis <code>==</code> et <code>&lt;</code>.",
      "Je comprends pourquoi <code>friend</code> est nécessaire pour un opérateur non-membre accédant aux membres privés."
    ],
    quiz: [
      {
        question: "Pourquoi <code>operator&lt;&lt;</code> est-il souvent une fonction libre amie ?",
        options: [
          "Parce qu'une méthode ne peut pas retourner de référence",
          "Parce que le premier opérande est un flux et non l'objet affiché",
          "Parce qu'il est toujours plus rapide"
        ],
        answer: 1,
        explanation: "Le flux est à gauche de l'opérateur ; le design naturel est donc une fonction libre."
      },
      {
        question: "Quel opérateur a le plus de chances d'être une méthode membre ?",
        options: ["<code>operator+=</code>", "<code>operator+</code>", "<code>operator&lt;&lt;</code>"],
        answer: 0,
        explanation: "Il modifie l'objet courant et s'exprime naturellement comme comportement interne."
      },
      {
        question: "Pourquoi le postfixe <code>operator++(int)</code> est-il souvent plus coûteux que le préfixe <code>operator++()</code> ?",
        options: [
          "Parce qu'il doit généralement conserver et renvoyer l'ancienne valeur",
          "Parce qu'il ne peut pas compiler en C++",
          "Parce qu'il interdit l'usage de <code>return</code>"
        ],
        answer: 0,
        explanation: "Le postfixe a une sémantique différente : il doit représenter l'état avant incrément, ce qui implique souvent une copie temporaire."
      },
      {
        question: "Quelle est la signature correcte de <code>operator&gt;&gt;</code> pour lire un objet <code>Foo</code> depuis un flux ?",
        options: [
          "<code>std::ostream&amp; operator&gt;&gt;(std::ostream&amp; in, Foo&amp; f)</code>",
          "<code>std::istream&amp; operator&gt;&gt;(std::istream&amp; in, Foo&amp; f)</code>",
          "<code>void operator&gt;&gt;(std::istream&amp; in, const Foo&amp; f)</code>"
        ],
        answer: 1,
        explanation: "operator>> prend un istream& (non-const) et l'objet destination par référence non-const, puis retourne le flux pour permettre le chaînage."
      },
      {
        question: "Pourquoi faut-il être particulièrement prudent avec un opérateur de conversion implicite ?",
        options: [
          "Parce qu'il peut déclencher des conversions silencieuses qui brouillent la lecture du code",
          "Parce qu'il rend toute comparaison illégale",
          "Parce qu'il remplace automatiquement <code>operator==</code>"
        ],
        answer: 0,
        explanation: "Une conversion implicite peut rendre des expressions valides mais trompeuses. L'usage de <code>explicit</code> protège souvent mieux l'intention."
      }
    ],
    exercises: [
      {
        title: "Complexe lisible",
        difficulty: "Avancé",
        time: "30 min",
        prompt: "Ajoute à une classe <code>Complexe</code> les opérateurs <code>+=</code>, <code>+</code>, <code>==</code>, <code>&lt;&lt;</code> et <code>&gt;&gt;</code> avec une sémantique cohérente.",
        deliverables: [
          "une justification du choix membre / non-membre",
          "les opérateurs compilables",
          "une démonstration lecture/écriture sur flux"
        ]
      },
      {
        title: "Date comparable",
        difficulty: "Intermédiaire",
        time: "25 min",
        prompt: "Implémente les 6 opérateurs de comparaison sur une classe <code>Date</code> en les dérivant de <code>==</code> et <code>&lt;</code>.",
        deliverables: [
          "les 6 opérateurs",
          "un jeu de tests couvrant les cas limites (même mois, même jour...)",
          "une phrase expliquant le choix membre ou non-membre"
        ]
      },
      {
        title: "Égalité métier",
        difficulty: "Intermédiaire",
        time: "20 min",
        prompt: "Choisis un type de ton projet et rédige en une phrase ce que signifie l'égalité logique avant d'écrire l'opérateur.",
        deliverables: [
          "la définition métier",
          "l'implémentation",
          "un test contre un cas limite"
        ]
      },
      {
        title: "Préfixe ou postfixe ?",
        difficulty: "Avancé",
        time: "25 min",
        prompt: "Sur un type qui possède un vrai sens d'incrément, implémente <code>operator++()</code> et <code>operator++(int)</code>, puis explique la différence de sémantique, de retour et de coût. Ajoute aussi une courte justification si tu décides finalement que ce type ne devrait pas surcharger <code>++</code>.",
        deliverables: [
          "les deux surcharges ou la justification argumentée de leur absence",
          "un exemple montrant la différence prefixe/postfixe",
          "une note sur la lisibilité du choix retenu"
        ]
      }
    ],
    keywords: ["operator overloading", "friend", "ostream", "istream", "comparaison", "plus égale", "operator>>", "operator<<", "prefixe", "postfixe", "conversion", "operator[]", "extraction"]
  })),
  deepDives: [
    {
      focus: "Une surcharge d'opérateur n'est bonne que si elle reste naturelle pour le lecteur. L'objectif n'est pas d'être 'malin', mais de rendre l'objet plus facile à manipuler lorsqu'il ressemble vraiment à la notion mathématique ou métier visée.",
      retenir: [
        "Un opérateur surchargé doit préserver l'intuition attachée à cet opérateur.",
        "La lisibilité prime sur la démonstration technique."
      ],
      pitfalls: [
        "Surcharger un opérateur pour un effet de bord surprenant ou non intuitif.",
        "Imiter la syntaxe des types standards sans en respecter la sémantique."
      ],
      method: [
        "Décris en français le comportement attendu avant d'écrire l'opérateur.",
        "Vérifie qu'un lecteur pourrait deviner ce comportement sans commentaire.",
        "Abandonne la surcharge si le sens métier reste trop artificiel."
      ],
      check: "Si tu lis `a + b` sur ton type, le résultat attendu est-il évident sans documentation externe ?"
    },
    {
      focus: "Tous les opérateurs ne se valent pas. Certains, comme <code>+</code> ou <code>==</code>, sont souvent lisibles. D'autres, comme les conversions implicites, <code>++</code> postfixe ou <code>[]</code>, transportent des attentes plus fortes et peuvent rendre l'API trompeuse en un instant.",
      retenir: [
        "Plus l'opérateur est chargé d'intuition, plus sa surcharge doit être défendable.",
        "Le mot-clé <code>explicit</code> protège souvent mieux la lisibilité que des conversions automatiques."
      ],
      pitfalls: [
        "Ajouter un opérateur parce qu'il 'serait pratique' sans vérifier sa sémantique exacte.",
        "Rendre implicite une conversion qui change silencieusement la lecture d'une expression."
      ],
      method: [
        "Liste les opérateurs envisageables pour le type.",
        "Écarte d'abord ceux dont la sémantique serait ambiguë ou surprenante.",
        "Pour les conversions, pars du principe qu'elles doivent être explicites jusqu'à preuve du contraire."
      ],
      check: "Si ton type propose <code>++</code> ou une conversion implicite, peux-tu défendre ce choix sans invoquer seulement le confort d'écriture ?"
    },
    {
      focus: "Le choix entre membre et non-membre dépend du contrat recherché. Une opération symétrique ou nécessitant des conversions des deux côtés gagne souvent à être écrite hors de la classe, parfois en friend si nécessaire.",
      retenir: [
        "Une opération binaire n'appartient pas toujours naturellement au membre de gauche.",
        "Le non-membre évite parfois des asymétries inutiles dans l'API."
      ],
      pitfalls: [
        "Mettre tous les opérateurs en membres par réflexe.",
        "Oublier l'impact des conversions implicites sur l'appel résolu."
      ],
      method: [
        "Demande-toi si l'opération privilégie réellement l'objet de gauche.",
        "Teste mentalement les cas `objet + scalaire` et `scalaire + objet`.",
        "Choisis la forme qui garde le contrat le plus régulier."
      ],
      check: "Peux-tu justifier pourquoi un opérateur donné doit être membre, non-membre ou friend ?"
    },
    {
      focus: "Les comparaisons sont sensibles parce qu'elles transportent des hypothèses implicites : cohérence, transitivité, égalité logique. Une comparaison mal définie contamine ensuite tri, recherche, conteneurs associatifs et tests.",
      retenir: [
        "Comparer, c'est définir ce qui compte réellement dans l'identité ou l'ordre du type.",
        "Les opérateurs doivent former un ensemble cohérent, pas une collection de fonctions indépendantes."
      ],
      pitfalls: [
        "Comparer des détails de représentation au lieu de la signification métier.",
        "Définir `==` et `<` avec des critères incompatibles."
      ],
      method: [
        "Clarifie d'abord ce qui rend deux objets égaux du point de vue métier.",
        "Détermine ensuite si un ordre total ou partiel a un sens.",
        "Relis tous les opérateurs ensemble pour vérifier leur cohérence globale."
      ],
      check: "Ton opérateur d'égalité compare-t-il l'essentiel du métier ou seulement une représentation pratique ?"
    },
    {
      focus: "Les flux et les opérateurs d'incrément rappellent qu'une surcharge n'est pas qu'une signature ; c'est aussi une convention de retour. <code>&lt;&lt;</code> et <code>&gt;&gt;</code> doivent permettre le chaînage. Le postfixe <code>++</code> doit distinguer clairement l'avant et l'après.",
      retenir: [
        "Le type de retour fait partie de la convention de l'opérateur, pas d'un détail libre.",
        "Préfixe et postfixe ne doivent pas être implémentés au hasard comme deux variantes quasi identiques."
      ],
      pitfalls: [
        "Oublier de retourner le flux dans un opérateur de flux.",
        "Implémenter le postfixe sans préserver la sémantique de l'ancienne valeur."
      ],
      method: [
        "Identifie d'abord la convention attendue pour l'opérateur standard visé.",
        "Respecte ensuite son type de retour et sa sémantique habituelle.",
        "Teste l'opérateur dans une expression enchaînée pour vérifier qu'il reste naturel."
      ],
      check: "Ton <code>operator++(int)</code> et ton <code>operator&gt;&gt;</code> se comportent-ils comme un lecteur C++ s'y attendrait sans surprise ?"
    },
    {
      focus: "L'opérateur >> et les six comparaisons forment un groupe symétrique. La règle d'or : implémenter l'essentiel (== et <), puis dériver tout le reste mécaniquement pour garantir la cohérence.",
      retenir: [
        "operator>> retourne istream& non-const pour permettre le chaînage et modifier l'objet destination.",
        "Les 4 opérateurs >, !=, <=, >= se dérivent naturellement de == et < : pas de logique dupliquée."
      ],
      pitfalls: [
        "Oublier de retourner le flux dans operator>> — l'enchaînement `in >> a >> b` échoue silencieusement.",
        "Implémenter les 6 comparaisons de manière indépendante au lieu de les dériver : incohérence garantie à terme."
      ],
      method: [
        "Écris == et < avec la vraie logique métier.",
        "Dérive != comme `!(*this == other)`, > comme `other < *this`, etc.",
        "Teste un cas limite : objets égaux, ordre inverse, champs identiques sauf un."
      ],
      check: "Si tu modifies la logique de <, est-ce que >, >=, <= se mettent à jour automatiquement ?"
    }
  ]
});
})(window);
