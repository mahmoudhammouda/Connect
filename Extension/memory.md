# Mémoire des fonctionnalités de l'extension Connect

Ce fichier contient les informations importantes sur les fonctionnalités implémentées dans l'extension Connect, afin de ne pas les perdre lors des modifications futures.

## Fonctionnalités principales

### 1. Affichage des messages des consultants

Les messages des consultants sont automatiquement affichés sous leur carte, sans nécessiter de clic.

```
Nous avons restructuré l'interface pour afficher automatiquement les messages personnalisés des consultants sous leur carte, avec les améliorations suivantes :
1. Suppression de l'espace entre la carte du consultant et son message pour une présentation plus compacte
2. Restructuration du code HTML pour une meilleure cohérence visuelle
3. Réduction des ombres pour un style plus léger
4. Correction du menu déroulant en mode responsive pour s'assurer que toutes les actions (LinkedIn, téléphone, email) sont bien visibles
5. Amélioration de la visibilité du menu avec un z-index plus élevé et une largeur minimale garantie

Cette approche permet aux recruteurs de voir immédiatement les messages et compétences des consultants sans avoir à cliquer, tout en conservant un accès facile aux actions via le menu déroulant sur mobile.
```

### 2. Menu d'actions responsive

L'interface utilisateur de l'extension a été améliorée avec un menu d'actions responsive :

```
Nous avons amélioré l'interface utilisateur de l'extension en implémentant un menu d'actions responsive :
1. Sur les écrans larges (desktop), les boutons d'action (LinkedIn, téléphone, email) sont affichés directement
2. Sur les écrans étroits (mobile), ces boutons sont remplacés par un unique bouton à trois points qui ouvre un menu déroulant
3. Le menu déroulant contient les mêmes actions que les boutons, mais présentées de manière plus lisible avec des icônes et du texte
4. Nous avons ajouté une gestion des clics à l'extérieur du menu pour le fermer automatiquement

Cette approche permet d'optimiser l'espace sur les petits écrans tout en conservant toutes les fonctionnalités, particulièrement utile quand le rôle du consultant est long et prend beaucoup de place.
```

### 3. Formatage des éléments visuels

Points importants sur le formatage visuel :

- L'ID du consultant est affiché sous l'icône de cadenas avec un # devant (ex: #1000)
- Les icônes dans le menu déroulant sont dans des cercles colorés (bleu pour LinkedIn, vert pour téléphone, orange pour email)
- La séniorité est affichée avec un maximum de 3 barres
- Les messages des consultants incluent des hashtags extraits du texte, affichés en bleu

## Structure du code

### Interface Consultant

L'interface Consultant doit inclure un champ `message` pour les messages personnalisés :

```typescript
interface Consultant {
  id: string;
  role: string;
  linkedinUrl: string;
  phone: string | null;
  email: string | null;
  locked: boolean;
  type: string;
  skills: string[];
  experience: 'less_than_3' | 'between_3_and_10' | 'more_than_10';
  phoneValidated: boolean;
  emailValidated: boolean;
  linkedinValidated: boolean;
  availability: 'available' | 'soon' | 'unavailable';
  message: string; // Message personnalisé du consultant
}
```

### Fonction extractTags

La fonction extractTags permet d'extraire les hashtags des messages des consultants :

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

### Menu déroulant mobile

Le menu déroulant mobile nécessite ces fonctions :

```typescript
// État du menu déroulant
dropdownOpen: { [id: string]: boolean } = {};

// Affiche ou masque le menu déroulant
toggleDropdown(id: string, event: MouseEvent) {
  event.stopPropagation();
  this.dropdownOpen[id] = !this.dropdownOpen[id];
}

// Ferme le menu déroulant
closeDropdown() {
  Object.keys(this.dropdownOpen).forEach(id => {
    this.dropdownOpen[id] = false;
  });
}
```

## Remarques importantes

1. Le fichier `sidebar.html` est généré automatiquement par le script `build-extension.ps1`. Si vous souhaitez modifier ce fichier de manière permanente, modifiez plutôt la fonction `Create-SidebarHtml` dans le script.

2. Après toute modification du code Angular, exécutez toujours `.\build-extension.ps1` pour reconstruire l'extension.

3. Vérifiez toujours que les boutons d'action (LinkedIn, téléphone, email) fonctionnent correctement après les modifications.
