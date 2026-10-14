export const projects = [
    {
        id: 'jdr-companion',
        title: 'JdR Companion',
        subtitle: 'Des fiches papier à une expérience de jeu connectée',
        category: 'Projet personnel',
        description: 'Né d’un besoin de conserver les ressources des personnages entre les parties et de projeter facilement des médias sur un second écran, JdR Companion a évolué avec les retours des joueurs vers une application de gestion de sessions et de fiches numériques.',
        technologies: ['Angular', 'TypeScript', 'Symfony', 'PostgreSQL', 'Docker'],
        image: '/projects/jdr-companion.png',
        imageAlt: 'Tableau de bord de gestion des personnages dans JdR Companion',
        features: [
            'Fiches de personnages consultables sur mobile, avec points de vie et ressources',
            'Consultation des capacités et de leurs descriptions',
            'Tableau de bord de contrôle pour le maître du jeu',
            'Projection de médias, quêtes et informations de session sur un second écran',
            'Conservation des informations d’une session à l’autre'
        ],
        gallery: [
            { src: '/projects/jdr-player-display.png', width: 1920, height: 1032, alt: 'Affichage destiné aux joueurs : illustration d’un dragon, quêtes et informations de session', caption: 'Écran joueurs — projection des médias, des quêtes et de l’ambiance.', layout: 'wide' },
            { src: '/projects/jdr-character-resources.png', width: 331, height: 716, alt: 'Fiche mobile : points de vie, dés de vie et ressources', caption: 'Fiche numérique — suivi des points de vie et des ressources.', layout: 'portrait' },
            { src: '/projects/jdr-character-abilities.png', width: 331, height: 717, alt: 'Fiche mobile : liste des capacités et description détaillée', caption: 'Fiche numérique — consultation des capacités et de leurs descriptions.', layout: 'portrait' }
        ],
        story: [
            { title: 'Un problème concret autour de la table', text: 'Les fiches papier devenaient difficiles à lire à force de gommer et de réécrire les ressources. Certaines notes se perdaient entre les sessions et les annotations sur tableau blanc pouvaient être effacées.' },
            { title: 'Un second besoin : la mise en scène', text: 'Mon écran de maître du jeu intégrant un affichage destiné aux joueurs, je voulais projeter des images et des informations sans ouvrir, déplacer et repositionner manuellement des fenêtres sur le deuxième écran.' },
            { title: 'Une évolution portée par les joueurs', text: 'L’outil a commencé par suivre quelques ressources, puis progressivement toutes les ressources. Les retours et demandes des joueurs ont ensuite conduit à enrichir l’application jusqu’à la fiche de personnage numérique.' }
        ],
        technicalChoices: 'L’interface est développée avec Angular et TypeScript. Pour l’affichage MJ/joueurs sur deux fenêtres d’une même origine, BroadcastChannel transmet les changements, Angular Signals gère l’état réactif et localStorage conserve l’état de l’affichage après rechargement. Les données de personnages et certaines données de session passent également par une API Symfony.',
        challenges: 'Faire cohabiter une interface de contrôle destinée au MJ, un affichage immersif pour les joueurs et des fiches adaptées aux petits écrans, tout en accompagnant l’élargissement progressif des fonctionnalités. La synchronisation BroadcastChannel concerne des fenêtres du même navigateur et de la même origine : ce n’est pas une synchronisation réseau entre appareils indépendants.',
        results: 'L’application est utilisée lors de parties et a progressivement intégré le suivi des ressources, des fiches numériques et un écran de projection piloté par le MJ. Les joueurs ont contribué à son évolution en exprimant de nouveaux besoins. Le projet continue d’évoluer.',
        github: null,
        demo: null,
        featured: true
    },

    {
        id: 'campaign-planner',
        title: 'CampaignPlanner',
        subtitle: 'Planifier les sessions sans multiplier les sondages',
        category: 'Projet personnel',

        description: 'Né des limites des sondages Discord et WhatsApp pour organiser des parties sur le long terme, CampaignPlanner centralise les disponibilités des joueurs dans un calendrier partagé et facilite la planification des sessions de jeu de rôle.',

        technologies: [
            'Symfony',
            'PHP',
            'JavaScript',
            'PostgreSQL',
            'Docker'
        ],

        image: '/projects/campaign-planner.png',
        imageAlt: 'Calendrier partagé des disponibilités des joueurs',

        features: [
            'Calendrier partagé des disponibilités par créneau',
            'Synthèse des possibilités de réunion du groupe',
            'Création et gestion des campagnes',
            'Gestion des participants',
            'Validation des dates par le maître du jeu',
            'Création de sessions avec nom et horaires',
            'Notifications par e-mail à la création des sessions',
            'Rappels automatiques sept jours avant une session',
            'Tableaux de bord dédiés aux MJ et aux joueurs',
            'Historique des sessions et notes du MJ'
        ],

        gallery: [
            {
                src: '/projects/campaign-planner.png',
                alt: 'Calendrier des disponibilités',
                caption: 'Le calendrier partagé, au cœur de CampaignPlanner.',
                layout: 'wide'
            },
            {
                src: '/projects/tdb-mj.png',
                alt: 'Tableau de bord du maître du jeu',
                caption: 'Une vue globale des campagnes et des sessions à venir.',
                layout: 'wide'
            },
            {
                src: '/projects/tdb-campagne.png',
                alt: 'Gestion détaillée d’une campagne',
                caption: 'Participants, calendrier et suivi des sessions.',
                layout: 'wide'
            },
            {
                src: '/projects/tdb-joueur.png',
                alt: 'Espace personnel du joueur',
                caption: 'Chaque joueur retrouve ses campagnes et ses prochains rendez-vous.',
                layout: 'wide'
            }
        ],

        story: [
            {
                title: 'Des sondages peu adaptés au long terme',
                text: 'L’organisation des sessions reposait sur des sondages Discord ou WhatsApp. Pratiques ponctuellement, ils offraient une visibilité limitée sur les semaines suivantes.'
            },
            {
                title: 'Un calendrier commun',
                text: 'L’idée était de permettre aux joueurs de renseigner leurs disponibilités dans un calendrier partagé, consultable dans la durée, plutôt que de recréer un sondage pour chaque session.'
            },
            {
                title: 'Un outil de gestion de campagnes',
                text: 'Le projet s’est enrichi d’espaces dédiés aux campagnes, de tableaux de bord, du suivi des sessions et d’un accès adapté aux joueurs.'
            }
        ],

        technicalChoices: 'Développée avec Symfony, PHP, JavaScript et PostgreSQL, l’application centralise les disponibilités et synthétise les créneaux possibles. Le maître du jeu conserve la validation finale des sessions. Le système intègre des notifications par e-mail, des rappels programmés sept jours avant les sessions et utilise également Symfony Messenger.',
        challenges: 'Concevoir une planification collective lisible sur plusieurs semaines, avec des interfaces adaptées aux joueurs et aux maîtres du jeu. Assurer la cohérence entre les disponibilités, les sessions confirmées et les notifications, tout en évitant de multiplier les actions manuelles.',
        results: 'CampaignPlanner centralise la gestion des campagnes et des disponibilités, accompagne le choix des dates et automatise les communications liées aux sessions, depuis leur création jusqu’au rappel envoyé sept jours avant.',
        github: null,
        demo: 'https://campaign-planner.alwaysdata.net/',
        featured: true
    },
    {
        id: 'emissions',
        title: 'eMissions',
        subtitle: 'Simplifier les processus métier',
        category: 'Projet professionnel',
        description:
            'Une application métier développée pour Nîmes Université, ' +
            'destinée à la gestion des missions et des frais professionnels. ' +
            'Elle centralise les demandes, les circuits de validation ' +
            'et les interactions avec le système d’information.',
        technologies: [
            'React',
            'Symfony',
            'PHP',
            'Oracle',
            'MySQL'
        ],
        image: '/projects/emissions-concept.svg',
        imageAlt: 'Illustration conceptuelle de eMissions, sans données internes',
        gallery: [
            { src: '/projects/emissions-detail.svg', width: 1200, height: 600, alt: 'Composition abstraite autour des documents et des échanges', caption: 'Illustration conceptuelle — aucune capture de l’application ni donnée interne.' }
        ],
        features: [
            'Calendrier partagé des disponibilités par créneau',
            'Synthèse des possibilités de réunion du groupe',
            'Validation de la date par le maître du jeu',
            'Création de sessions avec nom et horaires',
            'Notifications par e-mail aux participants',
            'Gestion des campagnes et des participants',
            'Tableaux de bord MJ et joueur',
            'Historique des sessions et notes du MJ',
            'Notifications par e-mail à la création des sessions',
            'Rappels automatiques sept jours avant une session',
        ],
        technicalChoices: 'Développée avec Symfony, PHP, JavaScript et PostgreSQL, l’application centralise les disponibilités et synthétise les créneaux possibles. Le maître du jeu conserve la validation finale des sessions. Le système intègre des notifications par e-mail, des rappels programmés sept jours avant les sessions et utilise également Symfony Messenger.',
        challenges: 'Concevoir une planification collective lisible sur plusieurs semaines, avec des interfaces adaptées aux joueurs et aux maîtres du jeu. Assurer la cohérence entre les disponibilités, les sessions confirmées et les notifications, tout en évitant de multiplier les actions manuelles.',
        results: 'CampaignPlanner centralise la gestion des campagnes et des disponibilités, accompagne le choix des dates et automatise les communications liées aux sessions, depuis leur création jusqu’au rappel envoyé sept jours avant.',
        github: null,
        demo: null,
        featured: true
    }
];
