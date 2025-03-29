# Extension Connect - Documentation technique et fonctionnelle

## Description générale

L'extension Connect est une extension Chrome qui permet aux recruteurs de consulter une liste de consultants disponibles directement dans un panneau latéral du navigateur. Elle facilite la mise en relation entre recruteurs et consultants en affichant des informations détaillées sur chaque consultant, leurs compétences, leur disponibilité et leurs coordonnées.

## Fonctionnalités principales

### 1. Panneau latéral Chrome

L'extension s'affiche dans un panneau latéral de Chrome, accessible via un bouton dans la barre d'outils. Ce panneau contient la liste complète des consultants avec leurs informations.

### 2. Liste des consultants

Chaque consultant est représenté par une carte contenant :
- Un identifiant unique (ex: #1000) affiché sous l'icône de cadenas
- Un indicateur de disponibilité (cadenas vert pour disponible, rouge pour indisponible)
- Le rôle/poste du consultant (ex: Chef de Projet IT)
- Les compétences principales sous forme de badges colorés (ex: TDD, .NET, Docker)
- La localisation géographique (ex: Lille, Paris)
- Un indicateur de séniorité (1 à 3 barres maximum)
- Un message personnalisé du consultant décrivant son profil et ses disponibilités
- Des hashtags extraits automatiquement du message (ex: #aws, #cloud, #devops)

### 3. Affichage des messages

Les messages des consultants sont automatiquement affichés sous leur carte, sans nécessiter de clic. Cette fonctionnalité permet aux recruteurs de voir immédiatement les informations importantes sur chaque consultant.

Caractéristiques de l'affichage des messages :
- Présentation compacte (pas d'espace entre la carte et le message)
- Cohérence visuelle avec la carte du consultant
- Extraction et mise en évidence des hashtags en bleu
- Style léger avec ombres réduites

### 4. Menu d'actions responsive

L'interface s'adapte à différentes tailles d'écran :

**Sur écrans larges (desktop)** :
- Boutons d'action affichés directement à droite de la carte
- Trois actions disponibles : "Voir le profil LinkedIn", "Appeler", "Envoyer un email"

**Sur écrans étroits (mobile)** :
- Un unique bouton à trois points (⋮) remplace les boutons d'action
- Cliquer sur ce bouton ouvre un menu déroulant avec les mêmes actions
- Les actions dans le menu déroulant sont présentées avec des icônes dans des cercles colorés :
  * LinkedIn : cercle bleu avec icône LinkedIn
  * Téléphone : cercle vert avec icône téléphone
  * Email : cercle orange avec icône email
- Le menu se ferme automatiquement en cliquant à l'extérieur

### 5. Filtrage et recherche

L'extension permet de filtrer les consultants selon différents critères :
- Par compétences
- Par disponibilité
- Par niveau d'expérience
- Par mots-clés dans le message ou le rôle

## Structure technique

### Interface Consultant

L'interface Consultant définit la structure des données pour chaque consultant :

```typescript
interface Consultant {
  id: string;                   // Identifiant unique du consultant
  role: string;                 // Poste/rôle du consultant
  linkedinUrl: string;          // URL du profil LinkedIn
  phone: string | null;         // Numéro de téléphone (null si non disponible)
  email: string | null;         // Adresse email (null si non disponible)
  locked: boolean;              // État de verrouillage (disponible ou non)
  type: string;                 // Type de consultant
  skills: string[];             // Liste des compétences
  experience: 'less_than_3' | 'between_3_and_10' | 'more_than_10';  // Niveau d'expérience
  phoneValidated: boolean;      // Validation du téléphone
  emailValidated: boolean;      // Validation de l'email
  linkedinValidated: boolean;   // Validation du profil LinkedIn
  availability: 'available' | 'soon' | 'unavailable';  // Disponibilité
  message: string;              // Message personnalisé du consultant
}
```

### Fonctions clés

#### Extraction des hashtags

La fonction extractTags permet d'extraire les hashtags des messages des consultants pour les mettre en évidence :

```typescript
// Extrait les hashtags d'un message
extractTags(message: string): string[] {
  const tags: string[] = [];
  const regex = /#(\w+)/g;
  let match;
  
  while ((match = regex.exec(message)) !== null) {
    tags.push(match[1]);
  }
  
  return tags;
}
```

#### Gestion du menu déroulant

Le menu déroulant mobile est géré par ces fonctions :

```typescript
// État du menu déroulant (stocke l'état ouvert/fermé pour chaque consultant)
dropdownOpen: { [id: string]: boolean } = {};

// Affiche ou masque le menu déroulant pour un consultant spécifique
toggleDropdown(id: string, event: MouseEvent) {
  event.stopPropagation();  // Empêche la propagation du clic
  this.dropdownOpen[id] = !this.dropdownOpen[id];  // Inverse l'état actuel
}

// Ferme tous les menus déroulants ouverts
closeDropdown() {
  Object.keys(this.dropdownOpen).forEach(id => {
    this.dropdownOpen[id] = false;
  });
}
```

#### Actions sur les contacts

L'extension permet trois actions principales sur les contacts des consultants :

```typescript
// Ouvre le profil LinkedIn du consultant
openLinkedIn(url: string) {
  if (url) {
    chrome.tabs.create({ url: url });
  }
}

// Affiche le numéro de téléphone du consultant
showPhone(phone: string | null) {
  if (phone) {
    // Logique pour afficher ou composer le numéro
  }
}

// Envoie un email au consultant
sendEmail(email: string | null) {
  if (email) {
    window.open(`mailto:${email}`);
  }
}
```

## Architecture de l'extension

L'extension est construite avec :
- Angular pour l'application frontend
- Chrome Extension API pour l'intégration avec le navigateur
- TypeScript pour la logique métier
- Tailwind CSS pour les styles

### Fichiers clés

- `app.component.ts` : Composant principal contenant la logique de l'application
- `sidebar.html` : Page HTML du panneau latéral (générée par build-extension.ps1)
- `manifest.json` : Fichier de configuration de l'extension Chrome

## Processus de build

L'extension est construite à l'aide du script PowerShell `build-extension.ps1` qui :
1. Compile l'application Angular en mode production
2. Copie les fichiers nécessaires dans le répertoire de l'extension Chrome
3. Génère ou met à jour le fichier `sidebar.html`
4. Crée le fichier `manifest.json` s'il n'existe pas

## Remarques importantes

1. Le fichier `sidebar.html` est généré automatiquement par le script `build-extension.ps1`. Si vous souhaitez modifier ce fichier de manière permanente, modifiez plutôt la fonction `Create-SidebarHtml` dans le script.

2. Après toute modification du code Angular, exécutez toujours `.\build-extension.ps1` pour reconstruire l'extension.

3. Vérifiez toujours que les boutons d'action (LinkedIn, téléphone, email) fonctionnent correctement après les modifications.

4. Les styles CSS importants sont définis dans le fichier `sidebar.html` pour garantir que l'interface s'affiche correctement dans le panneau latéral de Chrome.
