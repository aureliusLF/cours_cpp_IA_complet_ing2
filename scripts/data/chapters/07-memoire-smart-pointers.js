(function registerChapterBundle7(globalScope) {
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
  order: 7,
  chapter: withChapterTheme("memoire-smart-pointers", () => ({
    id: "memoire-smart-pointers",
    shortTitle: "Mémoire et ownership",
    title: "Mémoire dynamique, ownership et smart pointers",
    level: "Intermédiaire",
    duration: "1 h 15",
    track: "SE2",
    summary:
      "Ce chapitre ne te demande pas d'aimer <code>new</code> et <code>delete</code>. Il t'apprend surtout à poser la bonne question : qui possède cette ressource, qui la libère et quel type standard exprime le mieux cette responsabilité ? Il développe aussi les opérations pratiques des smart pointers et les critères pour préférer la valeur simple, <code>vector</code>, <code>unique_ptr</code>, <code>shared_ptr</code> ou <code>weak_ptr</code>.",
    goals: [
      "distinguer pile, tas et durée de vie, mais surtout relier ces notions à un choix d'ownership",
      "préférer une abstraction standard comme <code>std::vector</code> ou <code>std::unique_ptr</code> quand elle exprime déjà correctement la possession",
      "expliquer la différence entre possession exclusive, copropriété, observation et cycle de références, puis utiliser correctement <code>get()</code>, <code>release()</code>, <code>reset()</code> et <code>lock()</code>"
    ],
    highlights: ["ownership", "std::vector", "unique_ptr", "shared_ptr", "weak_ptr", "get/reset/release"],
    body: [
      lesson(
        "Modèle mental : le vrai sujet n'est pas le tas, c'est la responsabilité",
        paragraphs(
          "La pile convient très bien à la majorité des objets locaux. Le tas devient utile quand la durée de vie dépasse le scope courant, quand la taille est dynamique ou quand la structure impose une indirection. Mais cette distinction n'est qu'un décor.",
          "La vraie question de conception est : qui possède la ressource et qui doit la libérer ? Dès que cette réponse est floue, les bugs apparaissent. Dès qu'elle est explicite, le code devient plus robuste et souvent plus simple."
        ),
        table(
          ["Situation", "Choix naturel"],
          [
            ["Objet local borné au scope", "Valeur locale sur la pile."],
            ["Collection dynamique", "<code>std::vector</code> plutôt qu'un tableau géré à la main."],
            ["Possession exclusive", "<code>std::unique_ptr</code>."],
            ["Copropriété justifiée", "<code>std::shared_ptr</code>."],
            ["Observation sans propriété", "Référence, pointeur brut ou <code>std::weak_ptr</code> selon le contexte."]
          ]
        ),
        callout("info", "Question centrale", "Ne demande pas d'abord 'est-ce que c'est sur le heap ?'. Demande d'abord 'qui est responsable de la destruction ?'")
      ),
      lesson(
        "Valeur locale d'abord, allocation ensuite seulement si le besoin est réel",
        paragraphs(
          "Beaucoup de problèmes de mémoire disparaissent avant même de commencer si l'on garde un réflexe simple : préfère la valeur locale ou le conteneur standard tant que cela suffit. Tous les objets n'ont pas besoin d'être alloués dynamiquement. Une allocation doit répondre à un besoin réel de durée de vie flexible, de taille dynamique ou de polymorphisme par indirection.",
          "Ce réflexe est capital, car il évite d'introduire de l'ownership là où il n'y en a pas besoin. Un <code>std::string</code>, un <code>std::vector</code> ou un objet métier local sont déjà capables de gérer proprement leurs ressources sans t'obliger à penser à <code>delete</code>."
        ),
        code(
          "cpp",
          `
Rapport rapport{"semestre 4"};                 // valeur simple
std::vector<int> notes{12, 15, 9};            // collection dynamique auto-geree
auto cache = std::make_unique<CacheMemoire>(); // ownership exclusif justifie
          `,
          "Ne pas allouer dynamiquement sans raison precise"
        ),
        bullets([
          "La valeur locale est souvent le choix le plus simple et le plus sûr.",
          "<code>std::vector</code> exprime déjà une allocation dynamique propriétaire.",
          "<code>unique_ptr</code> intervient quand la ressource doit rester indirecte et clairement possédée."
        ]),
        callout("success", "Bon ordre de réflexion", "Commence par te demander si un objet local ou un conteneur standard suffit. Choisis un smart pointer seulement si la relation de propriété l'exige vraiment.")
      ),
      lesson(
        "Exemple minimal : éviter <code>new</code> dès que la bibliothèque sait déjà mieux faire",
        paragraphs(
          "Avant de multiplier les smart pointers, commence par le plus simple. Si tu as besoin d'un tableau dynamique, <code>std::vector</code> exprime déjà la bonne idée. Si tu as besoin d'un propriétaire unique sur une ressource allouée, <code>std::unique_ptr</code> rend cette propriété visible.",
          "Autrement dit, beaucoup de code mémoire 'bas niveau' disparaît quand on choisit le bon type au lieu de gérer soi-même des couples <code>new</code> / <code>delete</code>."
        ),
        code(
          "cpp",
          `
std::vector<int> notes{12, 15, 9};
notes.push_back(18);

auto rapport = std::make_unique<std::string>("semestre valide");
std::cout << *rapport << '\n';
          `,
          "Deux ressources, deux propriétaires explicites"
        ),
        bullets([
          "<code>std::vector</code> possède déjà sa mémoire dynamique.",
          "<code>std::make_unique</code> crée une ressource avec possession exclusive explicite.",
          "Aucun <code>delete</code> manuel n'apparaît dans le code appelant."
        ]),
        callout("success", "Exemple minimal avant les variantes", "Quand un type standard exprime déjà la bonne propriété, choisis-le avant d'inventer une gestion mémoire manuelle.")
      ),
      lesson(
        "API pratique des smart pointers : <code>get()</code>, <code>release()</code>, <code>reset()</code> et <code>lock()</code>",
        paragraphs(
          "Les smart pointers ne sont pas seulement des noms de types ; ils viennent avec un petit vocabulaire d'opérations qu'il faut comprendre précisément. <code>get()</code> observe le pointeur brut sans céder la propriété. <code>release()</code> abandonne la propriété d'un <code>unique_ptr</code>. <code>reset()</code> remplace ou libère la ressource gérée. <code>lock()</code>, côté <code>weak_ptr</code>, tente d'obtenir temporairement un <code>shared_ptr</code> valide.",
          "Ces opérations sont puissantes, mais elles ne sont pas interchangeables. Les confondre revient à brouiller le contrat d'ownership. La bonne pratique est de rester dans le monde RAII tant qu'aucune interopération avec une API bas niveau ne t'oblige à sortir temporairement de ce cadre."
        ),
        code(
          "cpp",
          `
auto fichier = std::make_unique<Fichier>();
Fichier* observateur = fichier.get(); // observation temporaire

fichier.reset(); // detruit la ressource geree

std::weak_ptr<Session> vue = sessionPartagee;
if (auto session = vue.lock()) {
    session->rafraichir();
}
          `,
          "Chaque operation modifie ou non le contrat de possession"
        ),
        table(
          ["Opération", "Effet principal", "Risque à surveiller"],
          [
            ["<code>get()</code>", "Expose une observation brute sans céder la propriété", "Conserver trop longtemps le pointeur brut après la destruction du smart pointer"],
            ["<code>release()</code>", "Abandonne la propriété sans détruire", "Fuite mémoire si personne ne reprend clairement la destruction"],
            ["<code>reset()</code>", "Libère ou remplace la ressource gérée", "Perdre une ressource si l'on oublie ce qui était encore utilisé ailleurs"],
            ["<code>lock()</code>", "Tente d'obtenir une possession temporaire depuis un <code>weak_ptr</code>", "Supposer que la cible existe toujours sans vérifier le résultat"]
          ]
        ),
        callout("info", "Règle pratique", "Si tu n'as pas une bonne raison d'utiliser <code>release()</code>, c'est probablement que tu n'en as pas besoin. La plupart du temps, <code>get()</code> pour observer ou rien du tout suffisent.")
      ),
      lesson(
        "Piège classique : on peut fuir ou sur-partager une ressource en croyant simplifier",
        paragraphs(
          "Le premier piège est la fuite évidente : un pointeur brut propriétaire qu'on oublie de libérer. Le second, plus subtil, consiste à utiliser <code>shared_ptr</code> 'pour être tranquille' alors que la copropriété n'est pas justifiée. On paie alors un coût conceptuel et parfois technique sans résoudre le vrai problème de design.",
          "Autre piège pédagogique fréquent : appeler <code>release()</code> sur un <code>unique_ptr</code> sans organiser explicitement la suite. La ressource n'est plus gérée automatiquement, mais rien ne la détruit pour autant."
        ),
        code(
          "cpp",
          `
auto texte = std::make_unique<std::string>("temporaire");
std::string* brut = texte.release(); // la possession est abandonnée
// oubli de delete brut; -> fuite mémoire
          `,
          "Sortir de RAII sans plan de reprise recrée un bug manuel"
        ),
        code(
          "cpp",
          `
struct Noeud {
    std::shared_ptr<Noeud> suivant;
    std::shared_ptr<Noeud> precedent;
};
          `,
          "Deux <code>shared_ptr</code> peuvent aussi fabriquer un cycle"
        ),
        callout("warn", "Piège classique", "Un type plus 'intelligent' ne remplace pas une réflexion sur la propriété. <code>shared_ptr</code> partout n'est pas une stratégie, c'est souvent un symptôme.")
      ),
      lesson(
        "Vérification active : ce qu'il faut savoir expliquer à l'oral",
        paragraphs(
          "À ce stade, tu dois pouvoir comparer plusieurs outils sans les réciter mécaniquement. L'important est de relier chaque type à une phrase claire : qui possède, qui observe, quand la ressource disparaît, et quel risque principal il faut surveiller.",
          "C'est aussi ici qu'on clarifie le rôle restant du pointeur brut. Il n'est pas interdit ; il sert encore très bien à observer une ressource non possédée, à interagir avec une API C ou à représenter une donnée optionnelle dans certains designs."
        ),
        table(
          ["Outil", "Sémantique", "Risque principal"],
          [
            ["<code>std::vector</code>", "Possession d'une collection dynamique", "Croire qu'il faut quand même un <code>new[]</code> manuel."],
            ["<code>unique_ptr</code>", "Possession exclusive", "Sortir de RAII avec <code>release()</code> sans reprise explicite."],
            ["<code>shared_ptr</code>", "Copropriété", "Créer des cycles ou sur-utiliser le partage."],
            ["<code>weak_ptr</code>", "Observation sans prolonger la durée de vie", "Oublier de vérifier avec <code>lock()</code>."],
            ["<code>T*</code> brut", "Observation ou interopération bas niveau", "L'utiliser comme propriétaire sans contrat clair."],
            ["<code>get()/reset()/release()</code>", "Opérations fines sur l'ownership d'un smart pointer", "Brouiller le contrat si l'on confond observation, destruction et abandon de propriété."]
          ]
        ),
        code(
          "cpp",
          `
class Scene {
public:
    void definirCamera(Camera* camera) {
        cameraCourante_ = camera; // observation, pas possession
    }

private:
    Camera* cameraCourante_{nullptr};
};
          `,
          "Le pointeur brut reste utile comme observateur honnête"
        ),
        callout("info", "Ce qu'il faut savoir expliquer à l'oral", "Je peux dire pourquoi <code>unique_ptr</code> n'est pas copiable, ce que <code>shared_ptr</code> partage réellement, pourquoi <code>weak_ptr</code> existe et dans quel cas un pointeur brut reste le bon outil.")
      ),
      lesson(
        "Pont vers la suite : ownership et mouvement racontent la même histoire",
        paragraphs(
          "Dès que la possession devient explicite, la question de la copie change complètement. Un objet qui possède une ressource ne se copie pas à la légère : il faut penser duplication réelle, transfert de propriété ou interdiction de copie.",
          "C'est exactement ce qui prépare le chapitre suivant sur la copie, l'affectation, le mouvement et la règle de 0/3/5. L'ownership n'est donc pas un chapitre isolé ; c'est la base des choix de copie et de move."
        ),
        code(
          "cpp",
          `
auto source = std::make_unique<std::string>("rapport");
auto destination = std::move(source); // transfert de possession
          `,
          "Un transfert de ressource annonce déjà le chapitre sur le mouvement"
        ),
        callout("success", "Pont vers le chapitre suivant", "Ownership et move semantics se répondent directement : si je sais qui possède, je peux alors décider ce que signifie copier ou déplacer.")
      ),
      videoLesson(
        "Ces vidéos prolongent très bien la bascule entre mémoire manuelle, durée de vie et ownership explicite.",
        [
          playlistVideo("smartPointers", "la vidéo la plus directement reliée à ce chapitre"),
          playlistVideo("objectLifetime", "utile pour relier ownership et sortie de portée"),
          playlistVideo("newKeyword", "rappelle pourquoi le réflexe <code>new</code> manuel devient vite fragile")
        ]
      )
    ].join(""),
    checklist: [
      "Je peux expliquer ce que signifie posséder une ressource et pourquoi cette notion est plus importante que le simple mot 'heap'.",
      "Je peux expliquer pourquoi la valeur locale ou <code>std::vector</code> doivent être envisagés avant une allocation dynamique explicite.",
      "Je peux justifier l'usage de <code>std::vector</code> pour une collection dynamique au lieu d'un tableau géré à la main.",
      "Je peux créer un <code>unique_ptr</code> avec <code>make_unique</code> et expliquer pourquoi il n'est pas copiable.",
      "Je peux décrire ce que <code>std::move</code> change dans un transfert de possession.",
      "Je peux distinguer précisément <code>get()</code>, <code>release()</code>, <code>reset()</code> et <code>lock()</code>.",
      "Je peux expliquer les risques de <code>release()</code>, <code>get()</code> et <code>shared_ptr</code> utilisé par confort.",
      "Je peux expliquer pourquoi un cycle de <code>shared_ptr</code> fuit et comment <code>weak_ptr</code> le casse.",
      "Je peux distinguer un pointeur brut observateur d'un propriétaire réel."
    ],
    quiz: [
      {
        question: "Quel outil standard remplace le plus souvent un tableau dynamique alloué manuellement ?",
        options: ["<code>std::vector</code>", "<code>std::pair</code>", "<code>std::exception</code>"],
        answer: 0,
        explanation: "<code>std::vector</code> porte déjà la bonne idée métier : une séquence dynamique propriétaire de sa mémoire. Le remplacer par <code>new[]</code> manuel ajoute souvent des risques sans gain réel."
      },
      {
        question: "Que devient un <code>unique_ptr</code> après un <code>std::move</code> ?",
        options: [
          "Il garde une copie de la ressource",
          "Il devient <code>nullptr</code> — la possession est transférée",
          "Il est détruit immédiatement"
        ],
        answer: 1,
        explanation: "Le point important n'est pas la syntaxe de <code>std::move</code>, mais le contrat qui change : la source n'est plus propriétaire. Le transfert est donc explicite et visible."
      },
      {
        question: "Quel réflexe de conception est le plus sain avant d'introduire un smart pointer ?",
        options: [
          "Vérifier d'abord si une valeur locale ou un conteneur standard suffit",
          "Allouer dynamiquement tout objet pour être plus flexible",
          "Choisir automatiquement <code>shared_ptr</code> pour éviter les questions"
        ],
        answer: 0,
        explanation: "Le but n'est pas de remplacer systématiquement les valeurs par des pointeurs intelligents. Le meilleur code est souvent celui qui n'a pas besoin d'ownership complexe."
      },
      {
        question: "Pourquoi un cycle de <code>shared_ptr</code> crée-t-il une fuite mémoire ?",
        options: [
          "Parce que <code>shared_ptr</code> ne gère pas les destructions",
          "Parce que le compteur de références reste supérieur à zéro indéfiniment, empêchant toute libération",
          "Parce que les cycles sont interdits par la norme"
        ],
        answer: 1,
        explanation: "Le problème n'est pas un 'bug d'implémentation' de <code>shared_ptr</code>. C'est un problème de design : deux objets se gardent mutuellement en vie sans propriétaire final capable de les libérer."
      },
      {
        question: "Quelle est la différence entre <code>p.get()</code> et <code>p.release()</code> sur un <code>unique_ptr</code> ?",
        options: [
          "<code>get()</code> et <code>release()</code> font la même chose",
          "<code>get()</code> observe sans céder la possession ; <code>release()</code> abandonne la possession sans détruire",
          "<code>get()</code> libère la mémoire ; <code>release()</code> ne fait rien"
        ],
        answer: 1,
        explanation: "<code>get()</code> laisse RAII intact. <code>release()</code>, au contraire, sort volontairement du cadre automatique : tu récupères le pointeur brut et la responsabilité de penser à sa destruction."
      },
      {
        question: "À quoi sert principalement <code>lock()</code> sur un <code>weak_ptr</code> ?",
        options: [
          "À reprendre définitivement la propriété exclusive de la ressource",
          "À obtenir temporairement un <code>shared_ptr</code> valide si la ressource existe encore",
          "À libérer immédiatement la ressource observée"
        ],
        answer: 1,
        explanation: "<code>weak_ptr</code> n'est pas propriétaire. <code>lock()</code> permet donc de vérifier si la ressource existe encore avant d'en obtenir une possession partagée temporaire."
      }
    ],
    exercises: [
      {
        title: "Remplacer du <code>new[]</code> par <code>vector</code>",
        difficulty: "Intermédiaire",
        time: "20 min",
        prompt: "Reprends un code qui utilise <code>new[]</code> / <code>delete[]</code> pour gérer une collection dynamique et remplace toute la gestion manuelle par <code>std::vector</code>. Le but est d'obtenir exactement le même comportement visible avec moins de responsabilité mémoire dans le code applicatif.",
        deliverables: [
          "la version initiale avec les points de fragilité mémoire annotés",
          "la version équivalente avec <code>std::vector</code>",
          "une liste des risques éliminés, expliqués en langage simple"
        ]
      },
      {
        title: "Graphe d'ownership avec unique_ptr et shared_ptr",
        difficulty: "Avancé",
        time: "35 min",
        prompt: "Modélise un arbre de nœuds où chaque nœud possède ses enfants avec <code>unique_ptr</code> et observe éventuellement son parent sans en être propriétaire. La structure doit permettre de détruire la racine et de libérer naturellement tout l'arbre.",
        deliverables: [
          "une structure <code>Noeud</code> qui distingue clairement possession et observation",
          "une démonstration que la destruction de la racine suffit à tout libérer",
          "une justification écrite du choix entre pointeur brut observateur et <code>weak_ptr</code>"
        ]
      },
      {
        title: "Briser un cycle avec weak_ptr",
        difficulty: "Avancé",
        time: "30 min",
        prompt: "Crée deux classes qui se référencent mutuellement. Implémente d'abord une version naïve où elles se possèdent toutes les deux via <code>shared_ptr</code>, puis corrige le design pour qu'une des deux relations devienne non propriétaire avec <code>weak_ptr</code>.",
        deliverables: [
          "une première version qui montre le cycle par l'absence de destruction attendue",
          "une seconde version corrigée avec <code>weak_ptr</code>",
          "une explication de ce que signifie ici 'observer sans posséder'"
        ]
      },
      {
        title: "Choisir le bon ownership",
        difficulty: "Intermédiaire",
        time: "25 min",
        prompt: "Pour six situations concrètes de ton choix, décide si la bonne réponse est valeur locale, <code>std::vector</code>, <code>unique_ptr</code>, <code>shared_ptr</code>, <code>weak_ptr</code> ou pointeur brut observateur. L'objectif est d'apprendre à justifier le choix, pas juste à réciter les types.",
        deliverables: [
          "les six situations décrites en une phrase chacune",
          "le type choisi avec une justification d'ownership",
          "au moins un cas où tu expliques pourquoi <code>shared_ptr</code> serait une mauvaise idée"
        ]
      }
    ],
    keywords: ["memory", "ownership", "vector", "unique_ptr", "shared_ptr", "weak_ptr", "heap", "make_unique", "make_shared", "reference counting", "cycle", "observer", "get", "release", "reset", "lock"]
  })),
  deepDives: [
    {
      focus: "La vraie question n'est pas 'pile ou tas ?' mais 'qui possède quoi, et combien de temps ?'. Le modèle mémoire devient bien plus simple dès qu'on raisonne en ownership plutôt qu'en adresses isolées.",
      retenir: [
        "La pile favorise la simplicité, le tas répond aux besoins de durée de vie ou de taille dynamiques.",
        "Le choix mémoire doit suivre le besoin métier, pas une préférence de syntaxe."
      ],
      pitfalls: [
        "Allouer dynamiquement des objets qui pourraient vivre localement.",
        "Parler de mémoire sans parler du propriétaire réel de la ressource."
      ],
      method: [
        "Demande d'abord si l'objet peut vivre automatiquement dans une portée simple.",
        "Si non, identifie la raison précise qui impose une durée de vie plus souple.",
        "Associe ensuite chaque allocation à un propriétaire clair et unique ou partagé."
      ],
      check: "Quand choisis-tu le tas pour une bonne raison, et quand n'est-ce qu'une complication inutile ?"
    },
    {
      focus: "Le meilleur smart pointer reste souvent... l'absence de smart pointer. Une valeur locale, un vector ou un string bien placés évitent d'introduire une couche d'indirection, de propriété et de complexité qui n'apporte rien au problème métier.",
      retenir: [
        "Un objet local ou un conteneur standard suffit dans une énorme partie des cas.",
        "Introduire un pointeur sans besoin réel complique la lecture du code et la gestion de durée de vie."
      ],
      pitfalls: [
        "Allouer dynamiquement par réflexe dès qu'un objet existe.",
        "Confondre 'objet non trivial' et 'objet qui doit vivre sur le heap'."
      ],
      method: [
        "Commence par essayer une valeur locale.",
        "Si une séquence dynamique est nécessaire, essaie ensuite un conteneur standard.",
        "N'introduis un smart pointer que lorsqu'une relation de propriété l'exige clairement."
      ],
      check: "Pour un objet donné, peux-tu justifier pourquoi une simple valeur locale ne suffirait pas ?"
    },
    {
      focus: "Éviter new/delete en première intention, c'est éviter une grande partie des bugs de durée de vie. Les conteneurs et smart pointers standard rendent les responsabilités plus explicites et beaucoup moins fragiles.",
      retenir: [
        "vector, string et les smart pointers couvrent déjà la majorité des besoins.",
        "Le standard library code mieux la gestion mémoire qu'un bricolage manuel répété partout."
      ],
      pitfalls: [
        "Utiliser new comme réflexe parce qu'on veut 'créer un objet'.",
        "Disperser les delete dans le code au lieu de centraliser la responsabilité."
      ],
      method: [
        "Cherche d'abord si un conteneur standard peut porter la ressource.",
        "Sinon, choisis un smart pointer qui exprime le bon ownership.",
        "Réserve les pointeurs bruts aux usages non propriétaires et documentés."
      ],
      check: "Peux-tu remplacer mentalement un new/delete manuel par un type standard plus sûr ?"
    },
    {
      focus: "Le pointeur brut n'est pas interdit, mais il doit être utilisé avec précision. Il reste utile pour observer, traverser ou interfacer une API, tant qu'il n'exprime pas une responsabilité de destruction cachée.",
      retenir: [
        "Un pointeur brut peut représenter une vue, pas forcément une propriété.",
        "Le danger vient surtout quand son rôle n'est pas explicite dans l'API."
      ],
      pitfalls: [
        "Confier à un pointeur brut une responsabilité de destruction implicite.",
        "Retourner une adresse sans préciser la durée de vie de l'objet pointé."
      ],
      method: [
        "Décide si le pointeur observe, possède ou transfère une ressource.",
        "Si le pointeur n'est pas propriétaire, fais-le comprendre dans le contrat.",
        "Vérifie toujours que la durée de vie de la cible dépasse celle de l'usage."
      ],
      check: "Dans une signature, saurais-tu distinguer immédiatement un pointeur d'observation d'un mécanisme de propriété ?"
    },
    {
      focus: "Les opérations des smart pointers sont de petits changements de contrat. <code>get()</code> expose une vue, <code>reset()</code> modifie la ressource possédée, <code>release()</code> abandonne la possession, et <code>lock()</code> tente de reprendre temporairement une vue propriétaire depuis un <code>weak_ptr</code>.",
      retenir: [
        "Chaque appel modifie ou non la responsabilité de destruction.",
        "Rester dans RAII est la stratégie normale ; en sortir doit être rare et conscient."
      ],
      pitfalls: [
        "Conserver un pointeur issu de <code>get()</code> plus longtemps que le smart pointer source.",
        "Utiliser <code>release()</code> comme raccourci quotidien au lieu d'une interopération ponctuelle et contrôlée."
      ],
      method: [
        "Demande-toi si tu observes la ressource, si tu la remplaces, ou si tu abandonnes volontairement sa destruction.",
        "Choisis l'opération qui correspond exactement à ce besoin et à aucun autre.",
        "Si le besoin reste flou, n'utilise aucune de ces opérations avancées et reste dans le flux RAII normal."
      ],
      check: "Peux-tu expliquer, pour un exemple concret, pourquoi <code>get()</code> n'est pas équivalent à <code>release()</code> ?"
    },
    {
      focus: "unique_ptr est l'outil de propriété par défaut. Il exprime sans ambiguïté 'une seule entité est responsable de cette ressource'. Comprendre ses opérations — move, release, reset, custom deleter — permet de couvrir l'immense majorité des besoins de gestion manuelle tout en restant sûr.",
      retenir: [
        "unique_ptr est non copiable : la possession ne peut être que transférée, jamais dupliquée.",
        "release() cède la responsabilité sans détruire ; c'est une porte de sortie vers du code C, pas un raccourci habituel."
      ],
      pitfalls: [
        "Appeler get() puis stocker le pointeur brut plus longtemps que le unique_ptr : dangling pointer garanti.",
        "Utiliser release() sans assurer ensuite la libération : c'est retrouver une fuite mémoire manuelle."
      ],
      method: [
        "Pour chaque ressource à durée de vie contrôlée, commence par unique_ptr.",
        "Si la ressource a un mode de libération non standard, encapsule-le dans un custom deleter.",
        "N'expose get() qu'aux fonctions qui observent ; n'expose jamais release() sauf interface C héritée."
      ],
      check: "Peux-tu distinguer quand utiliser get(), reset() et release() sur un unique_ptr, et les risques propres à chacun ?"
    },
    {
      focus: "shared_ptr résout un vrai problème : quand plusieurs entités ont besoin de prolonger la durée de vie d'une ressource. Mais son coût — atomique, bloc de contrôle, cycles possibles — est réel. Ne l'utilise pas par défaut ; utilise-le quand le besoin de copropriété est prouvé.",
      retenir: [
        "Le compteur de références de shared_ptr est géré de façon atomique : c'est plus cher qu'un simple entier.",
        "Un cycle de shared_ptr est une fuite mémoire silencieuse que le compilateur ne détecte pas."
      ],
      pitfalls: [
        "Choisir shared_ptr pour 'éviter de réfléchir à l'ownership' : cela déplace le problème sans le résoudre.",
        "Créer un shared_ptr à partir d'un pointeur brut déjà géré par un autre smart pointer : double deletion."
      ],
      method: [
        "Commence par unique_ptr. Passe à shared_ptr seulement si plusieurs propriétaires sont nécessaires.",
        "Dès qu'un cycle devient possible, introduis weak_ptr sur le côté 'observateur' de la relation.",
        "Utilise make_shared (pas new dans un shared_ptr) pour une seule allocation et une meilleure sécurité."
      ],
      check: "Comment reconnaîtrais-tu dans une architecture que deux classes forment un cycle de shared_ptr, avant même que la fuite ne soit visible ?"
    }
  ]
});
})(window);
