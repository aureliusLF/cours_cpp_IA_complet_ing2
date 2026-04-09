(function registerCourseStudyProfiles(globalScope) {
globalScope.COURSE_STUDY_PROFILES = {
  "vision-outillage": {
    review: {
      expectations: [
        "Expliquer clairement la différence entre préprocesseur, compilation, fichiers objets, linkage et exécution sur un mini-projet à plusieurs fichiers.",
        "Justifier une séparation sobre entre headers, sources et dossier <code>build/</code> au lieu de présenter cela comme une simple convention de rangement.",
        "Décrire une boucle de travail crédible avec standard C++ explicite, warnings stricts et distinction debug / release."
      ],
      commonMistakes: [
        "Confondre une déclaration visible dans un header avec une définition réellement fournie au linker.",
        "Croire qu'un projet 'propre' signifie seulement avoir plusieurs fichiers, sans vraies frontières d'interface.",
        "Traiter les warnings comme du bruit alors qu'ils révèlent souvent des bugs ou des ambiguïtés de conception."
      ],
      oralCheck: "Si je retire un <code>.cpp</code> utile de la build, à quelle étape le problème apparaît-il et comment le diagnostiquerais-tu ?"
    },
    assistant: {
      focus: "Faire manipuler la chaîne de build, l'interprétation des messages d'erreur et la structure minimale d'un vrai projet multi-fichiers.",
      mustInclude: [
        "Au moins un exercice d'autopsie de message de compilation ou de linkage.",
        "Au moins un exercice de remise en ordre d'arborescence ou de configuration CMake."
      ],
      avoid: [
        "Éviter les exercices purement théoriques qui n'obligent pas à raisonner sur des fichiers, des cibles et des commandes de build."
      ]
    }
  },
  "fondamentaux-syntaxe": {
    review: {
      expectations: [
        "Lire un programme élémentaire ligne par ligne et expliquer le rôle de <code>#include</code>, <code>main</code>, des blocs, des commentaires et des instructions.",
        "Choisir des types simples cohérents, distinguer déclaration, initialisation, affectation et défendre l'usage de <code>{}</code>, <code>const</code> ou <code>enum class</code>.",
        "Expliquer la différence entre <code>std::cin</code> et <code>std::getline</code>, puis choisir la bonne structure de contrôle selon le problème posé."
      ],
      commonMistakes: [
        "Confondre déclaration, initialisation et affectation comme si ces trois gestes racontaient la même chose.",
        "Mélanger <code>std::cin</code> et <code>std::getline</code> sans gérer le retour à la ligne restant dans le flux.",
        "Élargir inutilement la portée des variables ou utiliser des entiers magiques là où un état nommé serait plus lisible."
      ],
      oralCheck: "Prends un mini-programme console de 8 lignes et justifie à voix haute chaque choix de type, d'entrée/sortie et de structure de contrôle."
    },
    assistant: {
      focus: "Faire verbaliser les choix de syntaxe de base, la lecture de flux console et les pièges silencieux comme <code>=</code> vs <code>==</code>.",
      mustInclude: [
        "Au moins un exercice de saisie console avec <code>std::cin</code>, <code>std::getline</code> et nettoyage du flux.",
        "Au moins un exercice d'audit de bug silencieux ou de conversion problématique."
      ],
      avoid: [
        "Ne pas introduire prématurément pointeurs, classes ou abstractions avancées qui sortent du périmètre des bases."
      ]
    }
  },
  "pointeurs-memoire": {
    review: {
      expectations: [
        "Expliquer sans hésiter la différence entre valeur, adresse, pointeur et déréférencement sur un exemple concret.",
        "Raisonner sur la durée de vie réelle d'une donnée et distinguer proprement pile, tas et invalidation d'adresse.",
        "Lire les formes <code>const T*</code>, <code>T* const</code> et reconnaître les pièges mémoire les plus coûteux."
      ],
      commonMistakes: [
        "Parler du pointeur comme d'une 'deuxième variable' sans préciser s'il contient une adresse ou accède à une valeur.",
        "Retourner l'adresse d'une variable locale ou conserver un pointeur vers une zone déjà détruite.",
        "Mélanger <code>delete</code> et <code>delete[]</code>, ou oublier complètement la libération manuelle."
      ],
      oralCheck: "Sur un exemple simple, que vaut <code>p</code>, que vaut <code>*p</code> et à partir de quand ce pointeur devient-il invalide ?"
    },
    assistant: {
      focus: "Faire manipuler des schémas mémoire, des parcours de tableaux et des autopsies de bugs de durée de vie.",
      mustInclude: [
        "Au moins un exercice de tracé mémoire ou de lecture pas à pas d'adresses et de valeurs.",
        "Au moins un exercice d'autopsie de pointeur pendant, double libération ou mauvaise allocation dynamique."
      ],
      avoid: [
        "Éviter de basculer trop tôt vers les smart pointers alors que l'objectif ici est d'assimiler le modèle mémoire brut."
      ]
    }
  },
  "fonctions-references": {
    review: {
      expectations: [
        "Choisir une signature lisible entre passage par valeur, <code>const&</code>, référence modifiante et valeur de retour.",
        "Relier prototype, fichier d'en-tête, implémentation et espace de noms dans une petite API propre.",
        "Justifier une surcharge ou une fonction utilitaire sans brouiller le contrat de l'interface."
      ],
      commonMistakes: [
        "Passer presque tout par référence non const sans se demander si la fonction doit vraiment modifier l'argument.",
        "Retourner une référence ou un pointeur vers une variable locale déjà détruite.",
        "Accumuler les surcharges sans critère clair jusqu'à rendre l'API ambiguë."
      ],
      oralCheck: "Si une fonction lit une chaîne sans la modifier, pourquoi choisirais-tu <code>const std::string&</code> plutôt qu'une autre signature ?"
    },
    assistant: {
      focus: "Faire travailler la propreté des signatures, la const-correctness et le découpage header/source d'une petite bibliothèque.",
      mustInclude: [
        "Au moins un exercice de refonte de signature ou d'API mal conçue.",
        "Au moins un exercice multi-fichiers avec prototypes, namespace et implémentations séparées."
      ],
      avoid: [
        "Éviter de faire dériver l'exercice vers la conception objet lourde avant que le chapitre sur les classes soit consolidé."
      ]
    }
  },
  "classes-encapsulation": {
    review: {
      expectations: [
        "Identifier l'invariant d'une classe et montrer comment l'API publique le protège.",
        "Décider quand une méthode doit être <code>const</code> et quand une donnée doit rester privée.",
        "Justifier le choix entre <code>struct</code> et <code>class</code> selon l'intention du type."
      ],
      commonMistakes: [
        "Exposer l'état interne en <code>public</code> puis tenter de réparer la cohérence après coup.",
        "Créer des getters et setters mécaniques sans se demander quelle opération métier mérite vraiment d'exister.",
        "Laisser l'objet passer par des états invalides au lieu de défendre l'invariant dès l'API."
      ],
      oralCheck: "Quel invariant ta classe garantit-elle exactement, et quelles méthodes sont autorisées à le faire évoluer ?"
    },
    assistant: {
      focus: "Faire concevoir des classes à partir de règles métier explicites plutôt qu'à partir d'un simple regroupement de données.",
      mustInclude: [
        "Au moins un exercice centré sur l'invariant et les opérations métier autorisées.",
        "Au moins un exercice de critique ou de refonte d'une classe trop bavarde ou trop exposée."
      ],
      avoid: [
        "Ne pas ajouter artificiellement de complexité mémoire ou d'héritage quand l'enjeu principal est l'encapsulation."
      ]
    }
  },
  "constructeurs-raii": {
    review: {
      expectations: [
        "Produire un objet valide dès le constructeur et savoir expliquer pourquoi la liste d'initialisation compte réellement.",
        "Connaître l'ordre réel d'initialisation des membres et les conséquences d'une mauvaise hypothèse.",
        "Relier RAII au nettoyage automatique d'une ressource, y compris quand une exception interrompt le flot."
      ],
      commonMistakes: [
        "Reporter une initialisation critique dans le corps du constructeur alors qu'elle devait vivre dans la liste d'initialisation.",
        "Croire que l'ordre d'initialisation suit l'ordre visuel de la liste plutôt que l'ordre de déclaration des membres.",
        "Ouvrir et fermer une ressource à la main autour du code appelant au lieu de confier cette responsabilité à un objet."
      ],
      oralCheck: "Si une ressource est acquise puis qu'une exception survient ensuite, comment RAII évite-t-il les oublis de nettoyage ?"
    },
    assistant: {
      focus: "Faire raisonner sur le cycle de vie, les scopes, l'ordre d'initialisation et la capture d'une ressource par un objet.",
      mustInclude: [
        "Au moins un exercice de wrapper RAII sur une ressource simple.",
        "Au moins un exercice où l'ordre d'initialisation ou de destruction doit être expliqué pas à pas."
      ],
      avoid: [
        "Éviter les exemples qui reposent surtout sur du <code>new/delete</code> alors que le sujet central est le cycle de vie d'objet."
      ]
    }
  },
  "memoire-smart-pointers": {
    review: {
      expectations: [
        "Choisir lucidement entre valeur simple, <code>std::vector</code>, <code>unique_ptr</code>, <code>shared_ptr</code> et <code>weak_ptr</code>.",
        "Nommer explicitement le propriétaire d'une ressource et distinguer possession, observation et partage.",
        "Expliquer les opérations sensibles comme <code>get()</code>, <code>reset()</code>, <code>release()</code> et <code>lock()</code>."
      ],
      commonMistakes: [
        "Prendre <code>shared_ptr</code> par réflexe pour éviter de décider qui possède réellement la ressource.",
        "Confondre un pointeur observateur avec une relation d'ownership.",
        "Créer des cycles de <code>shared_ptr</code> ou utiliser <code>release()</code> sans plan clair de destruction."
      ],
      oralCheck: "Pour cette ressource, qui possède quoi, qui peut la libérer et qui ne fait que l'observer temporairement ?"
    },
    assistant: {
      focus: "Faire travailler les décisions d'ownership et la justification du type standard le plus simple possible.",
      mustInclude: [
        "Au moins un exercice de cartographie d'ownership entre plusieurs objets.",
        "Au moins un exercice sur les cycles de <code>shared_ptr</code> ou le rôle de <code>weak_ptr</code>."
      ],
      avoid: [
        "Éviter les exercices où les pointeurs bruts sont présentés comme la solution recommandée alors qu'ils ne servent ici qu'à comprendre le contraste."
      ]
    }
  },
  "copie-mouvement": {
    review: {
      expectations: [
        "Distinguer construction par copie, affectation, construction par mouvement et affectation par mouvement.",
        "Choisir entre règle de 0, règle de 3 ou règle de 5 en fonction de la possession réelle de ressources.",
        "Justifier pourquoi une classe doit être copiable, déplaçable, ou explicitement non copiable."
      ],
      commonMistakes: [
        "Faire une copie superficielle d'une ressource possédée, puis découvrir la double libération trop tard.",
        "Implémenter des opérations spéciales par automatisme sans les relier à une sémantique claire du type.",
        "Utiliser <code>std::move</code> comme amulette de performance au lieu de raisonner sur le transfert réel de ressource."
      ],
      oralCheck: "Pourquoi cette classe ne devrait-elle pas être copiable, ou au contraire pourquoi mérite-t-elle une vraie deep copy ?"
    },
    assistant: {
      focus: "Faire prendre des décisions de sémantique de copie à partir de l'ownership et de l'invariant, pas à partir de recettes apprises.",
      mustInclude: [
        "Au moins un exercice d'autopsie de double libération ou de copie superficielle.",
        "Au moins un exercice où l'étudiant doit choisir entre règle de 0, =delete, copie profonde ou mouvement."
      ],
      avoid: [
        "Éviter les micro-optimisations déconnectées du vrai sujet, qui est la cohérence des opérations spéciales."
      ]
    }
  },
  "surcharge-operateurs": {
    review: {
      expectations: [
        "Choisir uniquement des opérateurs qui rendent le type plus lisible et respectent une sémantique naturelle.",
        "Concevoir <code>operator&lt;&lt;</code>, les comparaisons ou les opérateurs arithmétiques sans surprendre le lecteur.",
        "Préserver la cohérence entre <code>==</code>, <code>&lt;</code>, <code>+=</code> et les autres opérations associées."
      ],
      commonMistakes: [
        "Surcharger un opérateur par style ou effet 'cool' alors qu'il brouille la lecture.",
        "Faire muter l'objet courant dans <code>operator+</code> ou casser l'intuition habituelle du lecteur.",
        "Introduire des comparaisons incompatibles entre elles et rendre l'ordre ou l'égalité trompeurs."
      ],
      oralCheck: "Si j'écris <code>a + b</code> ou <code>a == b</code>, qu'est-ce qu'un lecteur raisonnable doit pouvoir supposer du comportement ?"
    },
    assistant: {
      focus: "Faire défendre la lisibilité, la symétrie et la sémantique métier avant toute implémentation d'opérateurs.",
      mustInclude: [
        "Au moins un exercice de critique d'une surcharge trompeuse ou incohérente.",
        "Au moins un exercice où l'étudiant doit choisir entre méthode membre, fonction libre ou absence de surcharge."
      ],
      avoid: [
        "Éviter les opérateurs exotiques ou peu utilisés qui détourneraient l'attention du contrat principal."
      ]
    }
  },
  "heritage-polymorphisme": {
    review: {
      expectations: [
        "Justifier une relation d'héritage comme un vrai 'est-un' et non comme un simple mécanisme de réutilisation.",
        "Concevoir une base abstraite avec destructeur virtuel, méthodes virtuelles pertinentes et overrides sûrs.",
        "Reconnaître les risques de slicing, de copie par valeur et de hiérarchie mal pensée."
      ],
      commonMistakes: [
        "Utiliser l'héritage pour partager du code alors que la composition raconterait mieux la relation métier.",
        "Oublier le destructeur virtuel dans une base polymorphique manipulée via pointeur ou référence.",
        "Passer des objets polymorphiques par valeur et perdre silencieusement la partie dérivée."
      ],
      oralCheck: "Pourquoi cette relation mérite-t-elle un héritage public, et quel contrat commun la base expose-t-elle réellement ?"
    },
    assistant: {
      focus: "Faire raisonner sur le contrat de la base, le dispatch dynamique et le choix entre héritage et composition.",
      mustInclude: [
        "Au moins un exercice d'autopsie de mauvais polymorphisme ou de slicing.",
        "Au moins un exercice où il faut arbitrer explicitement entre composition et héritage."
      ],
      avoid: [
        "Éviter l'héritage multiple ou les hiérarchies gadget si elles n'apportent rien au contrat étudié."
      ]
    }
  },
  "templates-stl": {
    review: {
      expectations: [
        "Lire une signature template simple et reformuler le contrat implicite qu'elle impose au type paramètre.",
        "Choisir un conteneur, un parcours et un algorithme standard cohérents avec le besoin métier.",
        "Anticiper l'invalidation d'itérateurs et les conséquences de certaines modifications de conteneur."
      ],
      commonMistakes: [
        "Réécrire des boucles manuelles alors que la STL exprime déjà clairement l'intention.",
        "Voir les erreurs template comme du bruit ésotérique au lieu de chercher quel contrat est violé.",
        "Conserver un itérateur, une référence ou un pointeur après une opération qui peut les invalider."
      ],
      oralCheck: "Si ton algorithme est générique, quel contrat minimal ton type doit-il respecter pour que le code compile et reste sensé ?"
    },
    assistant: {
      focus: "Faire choisir les bons couples conteneur/algorithme et faire expliquer les contrats implicites de la généricité.",
      mustInclude: [
        "Au moins un exercice sur l'invalidation d'itérateurs ou de références.",
        "Au moins un exercice où il faut remplacer une boucle manuelle par une combinaison STL plus expressive."
      ],
      avoid: [
        "Éviter les détours vers la métaprogrammation avancée qui dépassent le contrat pédagogique du chapitre."
      ]
    }
  },
  "flux-io": {
    review: {
      expectations: [
        "Ouvrir un fichier, vérifier son état et choisir le mode minimal nécessaire sans avoir besoin d'aide-mémoire.",
        "Expliquer la différence entre les trois niveaux : lecture brute du fichier, parsing local d'une ligne et validation métier des champs.",
        "Distinguer <code>istringstream</code>, <code>ostringstream</code> et <code>stringstream</code> et choisir le bon selon la direction du flux de données."
      ],
      commonMistakes: [
        "Utiliser <code>while (!flux.eof())</code> au lieu de l'idiome sûr <code>while (flux >> valeur)</code>.",
        "Mélanger le parsing et la logique métier dans une même boucle, rendant impossible le diagnostic précis d'une erreur.",
        "Confondre <code>std::endl</code> et <code>'\\n'</code> et ignorer leur différence de coût dans une boucle d'écriture intensive."
      ],
      oralCheck: "Si une seule ligne d'un fichier de 10 000 lignes est mal formée, comment ton code la rejette-t-il sans perdre les 9 999 autres ?"
    },
    assistant: {
      focus: "Faire travailler la séparation lecture/parsing/validation et la manipulation rigoureuse de l'état des flux.",
      mustInclude: [
        "Au moins un exercice de parsing ligne par ligne avec <code>getline</code> + <code>stringstream</code> et gestion des lignes invalides.",
        "Au moins un exercice de construction de sortie avec <code>ostringstream</code> avant écriture dans un fichier."
      ],
      avoid: [
        "Éviter de mélanger exceptions et I/O dans le même exercice tant que les deux chapitres n'ont pas été couverts séparément."
      ]
    }
  },
  "exceptions-erreurs": {
    review: {
      expectations: [
        "Justifier le choix entre exception, <code>std::optional</code> et code de retour selon la nature et la portée de l'erreur.",
        "Concevoir une exception personnalisée portant un contexte exploitable (fichier, ligne, opération) et dérivant de la bonne classe de base.",
        "Expliquer les trois garanties d'exception et identifier laquelle s'applique naturellement quand le code utilise RAII."
      ],
      commonMistakes: [
        "Attraper par <code>catch (...)</code> trop tôt et masquer la cause réelle de l'erreur.",
        "Lancer une exception dans un destructeur et risquer <code>std::terminate</code>.",
        "Utiliser <code>std::optional</code> comme remplacement universel des exceptions au lieu de le réserver aux absences de valeur légitimes."
      ],
      oralCheck: "Cette erreur doit-elle être une exception, un <code>std::optional</code>, ou une assertion — et pourquoi ?"
    },
    assistant: {
      focus: "Faire raisonner sur la distance sémantique entre l'erreur et son traitement, la richesse du contexte dans les exceptions, et les garanties offertes par RAII.",
      mustInclude: [
        "Au moins un exercice de conception d'exception personnalisée avec contexte exploitable.",
        "Au moins un exercice de refonte qui remplace une valeur sentinelle par <code>std::optional</code> avec justification."
      ],
      avoid: [
        "Éviter les <code>catch</code> trop larges ou les exceptions utilisées comme mécanisme de contrôle de flux normal."
      ]
    }
  },
  "modern-cpp": {
    review: {
      expectations: [
        "Utiliser <code>auto</code>, range-for et structured bindings pour clarifier le code, pas pour le rendre opaque.",
        "Choisir correctement <code>optional</code>, <code>variant</code>, <code>string_view</code> ou d'autres outils modernes selon le contrat visé.",
        "Moderniser un code localement avec un bénéfice explicite de lisibilité, de sûreté ou d'intention."
      ],
      commonMistakes: [
        "Mettre <code>auto</code> partout alors que le type porte une information métier utile au lecteur.",
        "Conserver un <code>string_view</code> plus longtemps que la chaîne qu'il observe.",
        "Ajouter des traits 'modernes' sans gain réel, juste pour faire plus récent."
      ],
      oralCheck: "Sur ce refactoring, quelle amélioration concrète apporte le C++ moderne : moins de bruit, meilleur contrat, ou plus de sûreté ?"
    },
    assistant: {
      focus: "Faire travailler des modernisations ciblées, argumentées, et liées à des besoins réels de lisibilité ou de modélisation.",
      mustInclude: [
        "Au moins un exercice sur l'absence explicite avec <code>optional</code> ou la variation de type avec <code>variant</code>.",
        "Au moins un exercice qui met en évidence les conditions de validité d'une vue non propriétaire comme <code>string_view</code>."
      ],
      avoid: [
        "Éviter les refactorings 'à la mode' sans bénéfice concret ni justification pédagogique."
      ]
    }
  },
  "concurrence-threads": {
    review: {
      expectations: [
        "Identifier clairement l'état partagé, la zone critique et la stratégie de synchronisation adaptée.",
        "Expliquer le rôle précis de <code>mutex</code>, <code>lock_guard</code>, <code>atomic</code>, <code>condition_variable</code>, <code>future</code> ou <code>async</code>.",
        "Raisonner sur la durée de vie des threads, les risques de deadlock et la correction avant la performance."
      ],
      commonMistakes: [
        "Lancer des threads sans plan clair de <code>join</code>, de <code>detach</code> ou de responsabilité de fin de vie.",
        "Croire qu'un type atomique suffit automatiquement pour protéger un état complexe composé de plusieurs données.",
        "Acquérir plusieurs mutex dans des ordres incompatibles et créer un deadlock difficile à diagnostiquer."
      ],
      oralCheck: "Dans ce code concurrent, qu'est-ce qui est partagé, qu'est-ce qui ne l'est pas, et quel mécanisme protège précisément quoi ?"
    },
    assistant: {
      focus: "Faire travailler la correction concurrente, l'analyse de data races et la prévention des blocages mutuels avant toute recherche de vitesse.",
      mustInclude: [
        "Au moins un exercice d'analyse ou de prévention de deadlock.",
        "Au moins un exercice de conception thread-safe qui explicite le mécanisme de synchronisation choisi."
      ],
      avoid: [
        "Éviter les pseudo-exercices de benchmark ou de performance qui escamotent les vrais enjeux de sûreté."
      ]
    }
  },
  "tests-qualite": {
    review: {
      expectations: [
        "Écrire des tests qui parlent du comportement attendu, des invariants et des cas limites plutôt que des détails d'implémentation.",
        "Distinguer clairement <code>REQUIRE</code>, <code>CHECK</code>, fixtures, doubles de test et critères de qualité utiles.",
        "Repérer ce qui rend un module difficile à tester et proposer un refactoring de testabilité réaliste."
      ],
      commonMistakes: [
        "Tester des détails privés ou la structure interne au lieu de tester un comportement observable.",
        "Écrire un unique test géant qui mélange plusieurs règles métier et devient fragile.",
        "Laisser les dépendances au temps, à l'I/O ou au hasard rendre les tests lents, flous ou non déterministes."
      ],
      oralCheck: "Quel comportement exact ce test protège-t-il, et que cesserait-il de détecter s'il disparaissait ?"
    },
    assistant: {
      focus: "Faire produire des tests lisibles, ciblés et reliés à des comportements métier, tout en rendant le code plus testable.",
      mustInclude: [
        "Au moins un exercice de conception ou de critique de suite de tests.",
        "Au moins un exercice de refonte d'un module trop couplé pour devenir testable."
      ],
      avoid: [
        "Éviter les discours vagues sur la couverture si les assertions et les scénarios n'ont pas de valeur réelle."
      ]
    }
  },
  "architecture-projet": {
    review: {
      expectations: [
        "Découper un projet en modules cohérents avec des responsabilités stables et des dépendances lisibles.",
        "Utiliser une méthode de debug structurée avant de modifier le code au hasard.",
        "Transformer un mini-projet en feuille de route réaliste avec MVP, backlog, critères de vérification et définition de fini."
      ],
      commonMistakes: [
        "Organiser le projet par taille de fichiers ou par intuition de rangement, sans réfléchir à la direction des dépendances.",
        "Déboguer en ajoutant des changements partout sans hypothèse claire ni plan de vérification.",
        "Se lancer dans un mini-projet sans définir le périmètre minimal, les risques et les critères de finition."
      ],
      oralCheck: "Si cette fonctionnalité change demain, quels modules doivent bouger, lesquels devraient rester stables, et pourquoi ?"
    },
    assistant: {
      focus: "Faire prendre des décisions d'architecture proportionnées, relier structure, debug et pilotage concret du mini-projet final.",
      mustInclude: [
        "Au moins un exercice de critique ou de refonte d'architecture trop couplée.",
        "Au moins un exercice de plan de vérification ou de backlog priorisé pour un mini-projet."
      ],
      avoid: [
        "Éviter les patrons d'architecture trop lourds ou décoratifs qui ne correspondent pas à l'échelle d'un projet pédagogique."
      ]
    }
  }
};
})(window);
