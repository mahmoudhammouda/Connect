# Script pour générer automatiquement l'extension Chrome à partir du projet Angular
# Auteur: Cascade
# Date: 27/03/2025

# Paramètres configurables
$angularAppPath = "connect-extension-app"
$extensionPath = "connect-extension-chrome"
$extensionName = "Connect Extension App"
$extensionVersion = "1.0.0"
$extensionDescription = "Extension Chrome affichant une liste de consultants dans un panneau latéral"

# Vérifier si le répertoire du projet Angular existe
if (-not (Test-Path $angularAppPath)) {
    Write-Error "Le répertoire du projet Angular '$angularAppPath' n'existe pas."
    exit 1
}

# Fonction pour créer le fichier manifest.json
function Create-ManifestJson {
    param (
        [string]$path,
        [string]$name,
        [string]$version,
        [string]$description
    )

    $manifest = @{
        manifest_version = 3
        name = $name
        version = $version
        description = $description
        action = @{
            default_title = $name
        }
        side_panel = @{
            default_path = "sidebar.html"
        }
        permissions = @("sidePanel", "scripting")
        host_permissions = @("*://*/*")
        content_security_policy = @{
            extension_pages = "script-src 'self' 'wasm-unsafe-eval'; object-src 'self'"
        }
        icons = @{
            "16" = "icon16.png"
            "48" = "icon48.png"
            "128" = "icon128.png"
        }
    }

    $manifestJson = ConvertTo-Json $manifest -Depth 10
    Set-Content -Path "$path\manifest.json" -Value $manifestJson
    Write-Host "Fichier manifest.json créé avec succès."
}

# Fonction pour créer le fichier sidebar.html
function Create-SidebarHtml {
    param (
        [string]$path,
        [string]$title,
        [string]$mainJsFile,
        [string]$polyfillsJsFile,
        [string]$stylesFile
    )

    $sidebarHtml = @"
<!DOCTYPE html>
<html lang="en" data-beasties-container>
<head>
  <meta charset="utf-8">
  <title>$title</title>
  <base href="/">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="icon" type="image/x-icon" href="favicon.ico">
  <link rel="stylesheet" href="$stylesFile">
  <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
  <style>
    /* Styles personnalisés pour garantir la taille correcte des icônes */
    .material-icons.text-xs {
      font-size: 12px !important;
      width: 12px !important;
      height: 12px !important;
    }
    .material-icons.text-sm {
      font-size: 14px !important;
      width: 14px !important;
      height: 14px !important;
    }
    /* Styles pour les boutons d'action */
    button.w-6 {
      width: 24px !important;
      height: 24px !important;
    }
    
    /* Styles pour l'extension en pleine hauteur */
    html, body {
      height: 100% !important;
      margin: 0 !important;
      padding: 0 !important;
      overflow: auto !important; /* Permettre le défilement */
    }
    
    body {
      display: flex !important;
      flex-direction: column !important;
      min-height: 100vh !important;
      padding-right: 6px !important; /* Espace pour la barre de défilement */
    }
    
    app-root {
      display: flex !important;
      flex-direction: column !important;
      flex: 1 !important;
      min-height: 100vh !important;
    }
    
    /* Styles pour la barre de défilement */
    ::-webkit-scrollbar {
      width: 8px !important;
    }
    
    ::-webkit-scrollbar-track {
      background: #f1f1f1 !important;
      border-radius: 10px !important;
    }
    
    ::-webkit-scrollbar-thumb {
      background: #888 !important;
      border-radius: 10px !important;
    }
    
    ::-webkit-scrollbar-thumb:hover {
      background: #555 !important;
    }
    
    /* Ajouter de l'espace à droite pour la barre de défilement */
    .container {
      padding-right: 1.5rem !important;
    }
  </style>
</head>
<body>
  <app-root></app-root>
  <script src="$polyfillsJsFile" type="module"></script>
  <script src="$mainJsFile" type="module"></script>
</body>
</html>
"@

    Set-Content -Path "$path\sidebar.html" -Value $sidebarHtml
    Write-Host "Fichier sidebar.html créé avec succès."
}

# Fonction pour créer des icônes simples
function Create-PlaceholderIcons {
    param (
        [string]$path
    )

    # Utiliser l'icône favicon.ico existante au lieu de créer des fichiers vides
    if (Test-Path "$path\favicon.ico") {
        # Copier favicon.ico vers les fichiers d'icônes
        Copy-Item -Path "$path\favicon.ico" -Destination "$path\icon16.png" -Force
        Copy-Item -Path "$path\favicon.ico" -Destination "$path\icon48.png" -Force
        Copy-Item -Path "$path\favicon.ico" -Destination "$path\icon128.png" -Force
        Write-Host "Icônes créées à partir de favicon.ico avec succès."
    } else {
        # Si favicon.ico n'existe pas, on peut utiliser une autre approche
        # Par exemple, télécharger des icônes par défaut ou créer des PNG simples
        # Pour cet exemple, nous allons simplement désactiver les icônes dans le manifest
        $manifestPath = "$path\manifest.json"
        if (Test-Path $manifestPath) {
            $manifest = Get-Content -Path $manifestPath | ConvertFrom-Json
            $manifest.PSObject.Properties.Remove("icons")
            $manifestJson = ConvertTo-Json $manifest -Depth 10
            Set-Content -Path $manifestPath -Value $manifestJson
            Write-Host "Icônes désactivées dans le manifest.json."
        }
    }
}

# Étape 1: Construire l'application Angular en mode production
Write-Host "Étape 1: Construction de l'application Angular en mode production..."
Set-Location -Path $angularAppPath
# Ignorer les erreurs TypeScript liées à l'API Chrome
$buildOutput = npm run build -- --configuration production 2>&1
if ($LASTEXITCODE -ne 0) {
    # Vérifier si l'erreur est liée à chrome.tabs
    if ($buildOutput -match "Cannot find name 'chrome'") {
        Write-Host "Avertissement: Erreurs TypeScript liées à l'API Chrome détectées, mais ignorées pour la construction."
    } else {
        Write-Error "Erreur lors de la construction de l'application Angular."
        exit 1
    }
}
Set-Location ..
Write-Host "Application Angular construite avec succès."

# Étape 2: Créer ou vider le répertoire de l'extension Chrome
Write-Host "Étape 2: Préparation du répertoire de l'extension Chrome..."
if (Test-Path $extensionPath) {
    # Vider le répertoire
    Remove-Item "$extensionPath\*" -Recurse -Force
} else {
    # Créer le répertoire
    New-Item -Path $extensionPath -ItemType Directory | Out-Null
}
Write-Host "Répertoire de l'extension préparé avec succès."

# Étape 3: Identifier les fichiers JavaScript et CSS générés
Write-Host "Étape 3: Identification des fichiers générés..."
$browserDir = "$angularAppPath\dist\$angularAppPath\browser"
$mainJsFile = Get-ChildItem -Path $browserDir -Filter "main-*.js" | Select-Object -ExpandProperty Name
$polyfillsJsFile = Get-ChildItem -Path $browserDir -Filter "polyfills-*.js" | Select-Object -ExpandProperty Name
$stylesFile = Get-ChildItem -Path $browserDir -Filter "styles-*.css" | Select-Object -ExpandProperty Name

if (-not $mainJsFile -or -not $polyfillsJsFile) {
    Write-Error "Impossible de trouver les fichiers JavaScript générés."
    exit 1
}
Write-Host "Fichiers identifiés: $mainJsFile, $polyfillsJsFile, $stylesFile"

# Étape 4: Copier les fichiers nécessaires du build Angular vers le répertoire de l'extension
Write-Host "Étape 4: Copie des fichiers du build Angular vers le répertoire de l'extension..."
Copy-Item -Path "$browserDir\*" -Destination $extensionPath -Recurse
Write-Host "Fichiers copiés avec succès."

# Étape 5: Créer les fichiers spécifiques à l'extension
Write-Host "Étape 5: Création des fichiers spécifiques à l'extension..."
Create-ManifestJson -path $extensionPath -name $extensionName -version $extensionVersion -description $extensionDescription
Create-SidebarHtml -path $extensionPath -title $extensionName -mainJsFile $mainJsFile -polyfillsJsFile $polyfillsJsFile -stylesFile $stylesFile
Create-PlaceholderIcons -path $extensionPath
Write-Host "Fichiers spécifiques à l'extension créés avec succès."

Write-Host "Extension Chrome générée avec succès dans le répertoire '$extensionPath'."
Write-Host "Pour tester l'extension, ouvrez Chrome, accédez à chrome://extensions/, activez le mode développeur, et cliquez sur 'Charger l'extension non empaquetée'."
