(function registerChapterBundle6(globalScope) {
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
  order: 6,
  chapter: withChapterTheme("constructeurs-raii", () => ({
    id: "constructeurs-raii",
    shortTitle: "Cycle de vie et RAII",
    title: "Constructeurs, destructeurs et pensée RAII",
    level: "Intermédiaire",
    duration: "1 h 05",
    track: "SE2",
    summary:
      "Le vrai pouvoir du C++ apparaît quand on cesse de voir un objet comme un simple paquet de valeurs. Un objet peut aussi posséder une ressource et la libérer automatiquement quand sa durée de vie se termine : c'est tout l'esprit de RAII. Ce chapitre développe aussi l'ordre réel de construction, les membres <code>const</code>, les références et les pièges des initialisations fragiles.",
    goals: [
      "expliquer ce qu'un constructeur garantit et ce qu'un destructeur nettoie réellement",
      "utiliser la liste d'initialisation quand elle correspond au vrai moment de construction des membres et connaître l'ordre réel d'initialisation",
      "raisonner sur une ressource à partir de la durée de vie de l'objet qui la possède, y compris en cas d'échec ou de sortie anticipée"
    ],
    highlights: ["constructeur", "destructeur", "liste d'initialisation", "ordre des membres", "RAII", "scope"],
    body: [
      lesson(
        "Modèle mental : un objet doit être valide dès sa construction",
        paragraphs(
          "Un constructeur ne sert pas seulement à remplir des champs. Il doit créer un objet déjà valide, prêt à être utilisé sans étape cachée supplémentaire. De la même façon, un destructeur ne sert pas à 'faire propre' au hasard : il libère ce que l'objet possède réellement.",
          "Le bon réflexe est donc temporel : qui acquiert la ressource, à quel moment, et quand cette responsabilité s'arrête-t-elle ? Dès que tu raisonnes comme cela, RAII devient une conséquence naturelle du design."
        ),
        table(
          ["Élément", "Rôle"],
          [
            ["Constructeur", "Créer immédiatement un objet valide."],
            ["Liste d'initialisation", "Construire les membres au bon moment, sans phase artificielle."],
            ["Destructeur", "Libérer les ressources possédées quand l'objet meurt."]
          ]
        ),
        callout("info", "Réflexe RAII", "Quand une ressource existe, cherche quel objet doit en être le gardien. Si la durée de vie du gardien est claire, la libération devient beaucoup plus fiable.")
      ),
      lesson(
        "Ordre réel de construction et de destruction : ce que le compilateur fait vraiment",
        paragraphs(
          "Les membres ne sont pas initialisés dans l'ordre où tu les écris dans la liste d'initialisation, mais dans l'ordre de leur déclaration dans la classe. Cette règle surprend beaucoup de débutants, pourtant elle est essentielle pour éviter des dépendances cachées ou des lectures d'états non encore prêts.",
          "De la même manière, à la destruction, l'ordre s'inverse. Comprendre ce déroulé réel aide à concevoir des classes stables et à éviter les faux raisonnements du type 'je l'ai mis en premier dans la liste, donc il sera construit en premier'."
        ),
        code(
          "cpp",
          `
class Exemple {
public:
    Exemple() : second_{premier_ + 1}, premier_{41} {}

private:
    int premier_;
    int second_;
};
          `,
          "L'ordre suit la declaration des membres, pas l'ordre visuel de la liste"
        ),
        bullets([
          "Le compilateur construit d'abord <code>premier_</code>, puis <code>second_</code> car ils sont déclarés dans cet ordre.",
          "Relire la déclaration des membres est indispensable quand une initialisation dépend d'une autre.",
          "À la destruction, <code>second_</code> disparaît avant <code>premier_</code>."
        ]),
        callout("warn", "Règle discrète mais cruciale", "Si deux membres dépendent l'un de l'autre, l'ordre de déclaration dans la classe devient une vraie décision de conception.")
      ),
      lesson(
        "Exemple minimal : la liste d'initialisation raconte le vrai cycle de construction",
        paragraphs(
          "Les membres d'un objet sont construits avant l'exécution du corps du constructeur. La liste d'initialisation colle donc au vrai déroulé de la construction. Elle évite de faire croire qu'un membre est 'd'abord vide puis rempli' alors qu'il a déjà été construit.",
          "Cette forme devient indispensable pour les références, les membres <code>const</code> et plusieurs types non assignables. Mais même quand elle n'est pas strictement obligatoire, elle raconte souvent mieux l'intention."
        ),
        code(
          "cpp",
          `
class Session {
public:
    Session(std::string utilisateur, int id)
        : utilisateur_{std::move(utilisateur)}, id_{id} {}

private:
    std::string utilisateur_;
    const int id_;
};
          `,
          "Liste d'initialisation"
        ),
        callout("success", "Exemple minimal avant les variantes", "Ici, l'objet est complet dès la fin de la construction. Il n'a pas besoin d'une méthode <code>init()</code> séparée pour devenir 'vraiment prêt'.")
      ),
      lesson(
        "Constructeur qui échoue, destructeur sobre et faux amis comme <code>init()</code>",
        paragraphs(
          "Un constructeur a le droit de refuser de créer un objet invalide. S'il échoue, il vaut souvent mieux lancer une exception ou empêcher la construction plutôt que produire un objet 'à moitié prêt' qu'il faudrait ensuite terminer à la main avec une méthode <code>init()</code> fragile.",
          "Le destructeur, lui, doit rester sobre. Son rôle est de libérer ce que l'objet possède réellement. Il ne devrait pas contenir une logique métier compliquée, ni dépendre d'un appel manuel préalable. Le cas sûr doit être le cas par défaut."
        ),
        code(
          "cpp",
          `
class Configuration {
public:
    explicit Configuration(const std::string& chemin)
        : flux_{chemin} {
        if (!flux_) {
            throw std::runtime_error("configuration introuvable");
        }
    }

private:
    std::ifstream flux_;
};
          `,
          "Mieux vaut refuser la construction qu'accepter un objet invalide"
        ),
        callout("info", "Règle saine", "Si ton objet a besoin d'une étape obligatoire après le constructeur pour devenir vraiment utilisable, c'est souvent que le design mérite d'être revu.")
      ),
      lesson(
        "Piège classique : gestion manuelle fragile dès qu'un chemin de sortie change",
        paragraphs(
          "Le bug typique de ce chapitre apparaît quand on acquiert une ressource manuellement puis qu'on oublie de la libérer sur un des chemins de sortie. Un <code>return</code> anticipé, une erreur ou une exception suffisent alors à transformer un code apparemment correct en fuite ou en état incohérent.",
          "RAII existe précisément pour éviter d'avoir à mémoriser tous ces chemins. La ressource doit être attachée à un objet dont la destruction automatique fera le nettoyage, même si l'exécution quitte le bloc plus tôt que prévu."
        ),
        code(
          "cpp",
          `
FILE* fichier = std::fopen("notes.txt", "r");
if (!fichier) {
    return;
}

if (!verifierEntete(fichier)) {
    return; // fuite si on oublie std::fclose(fichier)
}

std::fclose(fichier);
          `,
          "La logique métier semble correcte, la gestion de ressource non"
        ),
        callout("warn", "Piège classique", "Plus une ressource est gérée manuellement, plus le code dépend d'une discipline fragile. Le moindre nouveau chemin de sortie peut créer un oubli de nettoyage.")
      ),
      lesson(
        "Vérification active : ce qu'il faut savoir expliquer à l'oral",
        paragraphs(
          "Pour vérifier que l'idée est comprise, essaie d'expliquer RAII sans utiliser l'acronyme. Si tu peux dire 'une ressource est confiée à un objet qui la nettoie automatiquement quand il meurt', alors tu tiens l'essentiel.",
          "Tu dois aussi pouvoir justifier quand la liste d'initialisation est naturelle, et pourquoi un destructeur ne doit nettoyer que ce que l'objet possède réellement."
        ),
        table(
          ["Question", "Réponse attendue"],
          [
            ["Pourquoi la liste d'initialisation ?", "Parce que les membres sont construits avant le corps du constructeur."],
            ["Quel ordre suit réellement la construction ?", "L'ordre de déclaration des membres dans la classe."],
            ["Que garantit un constructeur réussi ?", "Un objet directement valide et utilisable."],
            ["Pourquoi se méfier d'un <code>init()</code> obligatoire ?", "Parce qu'il signale souvent un objet qui n'est pas valide dès sa création."],
            ["Pourquoi RAII aide en cas de <code>return</code> anticipé ou d'exception ?", "Parce que la destruction à la sortie du scope reste automatique."],
            ["Que doit nettoyer un destructeur ?", "Uniquement les ressources réellement possédées par l'objet."]
          ]
        ),
        callout("info", "Ce qu'il faut savoir expliquer à l'oral", "Je peux raconter le cycle complet : construction, période de validité, sortie de portée et nettoyage automatique de la ressource.")
      ),
      lesson(
        "Pont vers la suite : RAII conduit naturellement à l'ownership explicite",
        paragraphs(
          "RAII fonctionne aussi pour la mémoire dynamique, mais écrire soi-même des couples <code>new</code> / <code>delete</code> reste fragile. Le pas suivant consiste donc à confier cette possession à des types standards qui encapsulent déjà ce cycle de vie.",
          "Autrement dit, une fois RAII compris, la question suivante devient : comment exprimer proprement la possession exclusive, la copropriété ou la simple observation d'une ressource ?"
        ),
        code(
          "cpp",
          `
class FichierLecture {
public:
    explicit FichierLecture(const std::string& chemin)
        : flux_{chemin} {
        if (!flux_) {
            throw std::runtime_error("impossible d'ouvrir le fichier");
        }
    }

    std::ifstream& flux() { return flux_; }

private:
    std::ifstream flux_;
};
          `,
          "Une ressource acquise à la construction, libérée à la destruction"
        ),
        callout("success", "Pont vers le chapitre suivant", "Le chapitre suivant prolonge exactement cette logique avec <code>std::vector</code>, <code>std::unique_ptr</code>, <code>std::shared_ptr</code> et <code>std::weak_ptr</code>.")
      ),
      videoLesson(
        "Pour fixer RAII et le cycle de vie d'un objet, ces vidéos sont les plus pertinentes de la playlist.",
        [
          playlistVideo("constructors", "repose bien ce qu'un constructeur garantit vraiment"),
          playlistVideo("broCodeConstructors", "bonne variante plus pas à pas si tu veux revoir la création d'objet tranquillement"),
          playlistVideo("revaninioConstructors", "alternative francophone centrée sur l'instanciation pas à pas"),
          playlistVideo("destructors", "utile pour comprendre le nettoyage et la fin de vie"),
          playlistVideo("initializerLists", "complète directement la partie liste d'initialisation")
        ]
      )
    ].join(""),
    checklist: [
      "Je peux expliquer ce qu'un constructeur réussi garantit sur l'état de l'objet.",
      "Je peux dire pourquoi la liste d'initialisation correspond au vrai moment de construction des membres.",
      "Je peux expliquer que l'ordre de construction suit la déclaration des membres dans la classe.",
      "Je peux justifier pourquoi un objet devrait être utilisable dès la fin du constructeur, sans <code>init()</code> obligatoire.",
      "Je peux repérer une ressource gérée manuellement de façon fragile dans un code avec plusieurs sorties possibles.",
      "Je peux expliquer RAII sans me limiter à l'acronyme.",
      "Je peux justifier ce qu'un destructeur doit nettoyer et ce qu'il ne doit pas faire.",
      "Je peux relier RAII à la notion plus large d'ownership."
    ],
    quiz: [
      {
        question: "Pourquoi la liste d'initialisation est-elle souvent préférable ?",
        options: [
          "Parce qu'elle est plus courte uniquement",
          "Parce qu'elle correspond au vrai moment d'initialisation des membres",
          "Parce qu'elle évite d'avoir un destructeur"
        ],
        answer: 1,
        explanation: "Le gain n'est pas cosmétique. La liste d'initialisation suit le vrai cycle de construction des membres au lieu de simuler une seconde phase d'affectation dans le corps du constructeur."
      },
      {
        question: "Quel énoncé décrit le mieux RAII ?",
        options: [
          "Une ressource est associée à un objet qui la gère sur toute sa durée de vie",
          "Toute ressource doit être globale",
          "Le destructeur doit afficher des logs à chaque fois"
        ],
        answer: 0,
        explanation: "RAII ne parle pas de style ou de logs. Il parle d'un lien fort entre ressource et objet gardien, afin que le nettoyage soit automatique à la fin de la portée."
      },
      {
        question: "Quel ordre détermine réellement la construction des membres d'une classe ?",
        options: [
          "L'ordre des membres dans la déclaration de la classe",
          "L'ordre visuel dans la liste d'initialisation",
          "L'ordre alphabétique des noms de membres"
        ],
        answer: 0,
        explanation: "La liste d'initialisation ne change pas l'ordre réel de construction. Le compilateur suit l'ordre de déclaration des membres, puis détruit en sens inverse."
      },
      {
        question: "Quel bug se cache dans ce pseudo-code ?<br><code>FILE* f = fopen(...); if (!verifier()) return;</code>",
        options: [
          "Aucun : le système fermera toujours immédiatement le fichier",
          "Un chemin de sortie oublie la libération de la ressource",
          "Le problème vient uniquement de l'extension du fichier"
        ],
        answer: 1,
        explanation: "La logique métier peut sembler correcte, mais la ressource n'est pas protégée par une durée de vie d'objet. Le <code>return</code> anticipé ouvre un chemin de fuite."
      },
      {
        question: "Dans quel cas la liste d'initialisation devient-elle indispensable ?",
        options: [
          "Pour un membre <code>const</code> ou une référence",
          "Uniquement pour les types primitifs",
          "Jamais, car on peut toujours affecter dans le corps"
        ],
        answer: 0,
        explanation: "Certains membres ne peuvent pas être assignés correctement après coup. La liste d'initialisation n'est alors pas un style, mais une nécessité."
      },
      {
        question: "Pourquoi une méthode <code>init()</code> obligatoire après construction est-elle souvent un mauvais signal ?",
        options: [
          "Parce qu'elle révèle souvent un objet qui n'est pas valide dès sa création",
          "Parce que les méthodes nommées <code>init</code> sont interdites en C++",
          "Parce qu'elle empêche toute gestion d'erreur"
        ],
        answer: 0,
        explanation: "Le vrai problème n'est pas le nom de la méthode, mais l'idée d'un objet qui existerait avant d'être réellement prêt. RAII pousse au contraire vers un objet directement valide."
      }
    ],
    exercises: [
      {
        title: "Chronomètre de scope",
        difficulty: "Intermédiaire",
        time: "25 min",
        prompt: "Écris une petite classe RAII qui mesure le temps passé dans une portée et affiche la durée à la destruction. Le but n'est pas seulement d'obtenir un chrono, mais de montrer que le nettoyage ou l'action finale se produisent automatiquement à la sortie du bloc.",
        deliverables: [
          "une classe construite avec une liste d'initialisation claire",
          "un exemple d'usage sur au moins deux blocs de portée différents",
          "une explication de ce que RAII garantit ici même en cas de sortie anticipée"
        ]
      },
      {
        title: "Gestionnaire de fichier propre",
        difficulty: "Intermédiaire",
        time: "30 min",
        prompt: "Encapsule l'ouverture d'un fichier texte dans une classe qui garantit que l'objet n'existe que si le fichier est vraiment disponible. L'idée est de supprimer les <code>open()</code> / <code>close()</code> dispersés du code appelant.",
        deliverables: [
          "une construction qui valide immédiatement la disponibilité du fichier",
          "une petite API utile en lecture ou écriture",
          "une démonstration qui montre que le code appelant n'a pas besoin d'un <code>close()</code> manuel"
        ]
      },
      {
        title: "Ordre d'initialisation visible",
        difficulty: "Intermédiaire",
        time: "25 min",
        prompt: "Crée une petite classe avec plusieurs membres dépendants les uns des autres et montre par des traces ou des commentaires pourquoi l'ordre réel d'initialisation suit la déclaration des membres. Corrige ensuite une version où cet ordre rendait le code trompeur.",
        deliverables: [
          "une première version où l'ordre visuel prête à confusion",
          "une version corrigée avec ordre de déclaration et liste d'initialisation cohérents",
          "une explication de ce que le compilateur fait réellement"
        ]
      }
    ],
    keywords: ["constructeur", "destructeur", "raii", "lifetime", "init list", "ordre des membres", "resource", "scope", "ownership", "init"]
  })),
  deepDives: [
    {
      focus: "Le cycle de vie n'est pas un détail technique ajouté après coup : il fait partie du design de la classe. Si la création et la destruction ne sont pas pensées correctement, les invariants deviennent fragiles.",
      retenir: [
        "Un objet bien conçu doit être valide dès la fin de son constructeur.",
        "Toute ressource acquise doit avoir un propriétaire clairement identifié."
      ],
      pitfalls: [
        "Construire des objets partiellement valides qu'il faudrait 'finir' plus tard.",
        "Oublier que destruction et gestion d'erreur sont liées."
      ],
      method: [
        "Définis ce qui rend l'objet valide immédiatement après construction.",
        "Liste les ressources détenues et leur durée de vie.",
        "Vérifie que la destruction relâche exactement ce qui a été acquis."
      ],
      check: "Saurais-tu expliquer pourquoi une classe mal conçue du point de vue du cycle de vie devient vite difficile à tester ?"
    },
    {
      focus: "L'ordre réel de construction est l'un des détails les plus importants et les moins intuitifs du chapitre. Le compilateur suit l'ordre de déclaration des membres, puis détruit en sens inverse. Toute dépendance entre membres doit donc être pensée à cet endroit précis.",
      retenir: [
        "L'ordre visuel de la liste d'initialisation ne change pas l'ordre réel des constructions.",
        "Les dépendances entre membres doivent être cohérentes avec leur ordre de déclaration."
      ],
      pitfalls: [
        "Croire qu'inverser la liste d'initialisation inverse aussi la construction réelle.",
        "Utiliser un membre pour en initialiser un autre alors que l'ordre de déclaration ne le garantit pas."
      ],
      method: [
        "Relis d'abord la liste des membres dans la classe.",
        "Vérifie ensuite si l'un d'eux dépend déjà d'un autre pendant l'initialisation.",
        "Réorganise la déclaration si nécessaire pour rendre cette dépendance sûre et lisible."
      ],
      check: "Pourrais-tu justifier l'ordre des membres d'une classe si deux d'entre eux dépendent l'un de l'autre ?"
    },
    {
      focus: "La liste d'initialisation n'est pas seulement une écriture élégante : elle construit directement les membres avec leur bonne valeur. Elle évite des créations temporaires inutiles et clarifie l'ordre réel d'initialisation.",
      retenir: [
        "Un membre doit idéalement être construit une seule fois, avec son état final.",
        "L'ordre d'initialisation suit l'ordre des membres dans la classe, pas l'ordre visuel de la liste."
      ],
      pitfalls: [
        "Croire qu'affecter dans le corps du constructeur est toujours équivalent à initialiser.",
        "Oublier l'ordre réel des membres, notamment avec des dépendances entre eux."
      ],
      method: [
        "Repère les membres qui doivent être construits immédiatement.",
        "Place leur valeur dans la liste d'initialisation plutôt que dans le corps.",
        "Relis l'ordre de déclaration des membres pour éviter les surprises."
      ],
      check: "Peux-tu donner un exemple où initialiser dans le corps du constructeur est moins correct qu'utiliser la liste d'initialisation ?"
    },
    {
      focus: "Les objets 'à moitié prêts' sont une source de bugs sournois. Quand une classe exige ensuite un <code>init()</code>, un <code>open()</code> ou une étape obligatoire supplémentaire pour devenir utilisable, elle reporte sur l'appelant une responsabilité que le constructeur devrait souvent assumer lui-même.",
      retenir: [
        "Un constructeur réussi doit laisser derrière lui un objet immédiatement utilisable.",
        "Si la construction échoue, il vaut mieux refuser l'objet que fabriquer un état bancal."
      ],
      pitfalls: [
        "Créer des séquences d'appels obligatoires faciles à oublier.",
        "Accumuler des booléens du style <code>isReady</code> pour compenser un mauvais cycle de vie."
      ],
      method: [
        "Définis ce que signifie 'objet valide' pour la classe.",
        "Place dans le constructeur tout ce qui est nécessaire pour atteindre cet état.",
        "Si cet état n'est pas atteignable, empêche la construction ou signale l'échec clairement."
      ],
      check: "Si un utilisateur oublie d'appeler <code>init()</code>, ton objet reste-t-il correct ou devient-il dangereux à utiliser ?"
    },
    {
      focus: "RAII devient vraiment clair lorsqu'on le voit comme un contrat automatique : la ressource entre dans l'objet à la construction, puis elle est libérée à la destruction, même en cas d'exception ou de retour anticipé.",
      retenir: [
        "RAII réduit la charge mentale en liant explicitement ressource et durée de vie.",
        "Le bon design fait du cas sûr le cas par défaut."
      ],
      pitfalls: [
        "Gérer la libération manuellement dans plusieurs branches du programme.",
        "Oublier qu'une erreur peut interrompre le flot avant le nettoyage explicite."
      ],
      method: [
        "Identifie la ressource à protéger : fichier, mutex, mémoire, socket.",
        "Encapsule-la dans un type qui sait l'acquérir et la relâcher.",
        "Teste mentalement les sorties prématurées pour vérifier que le nettoyage reste automatique."
      ],
      check: "Si une fonction quitte plus tôt que prévu, ton design RAII garantit-il encore la libération correcte de la ressource ?"
    }
  ]
});
})(window);
