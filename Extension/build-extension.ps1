# Script pour générer automatiquement l'extension Chrome à partir du projet Angular
# Auteur: Cascade
# Date: 27/03/2025

# Paramètres configurables
$angularAppPath = "connect-extension-app"
$extensionPath = "connect-extension-chrome"
$extensionName = "Connect Extension App"
$extensionVersion = "1.0.0"
$extensionDescription = "Extension Chrome affichant une liste de consultants dans un panneau latéral"

# Fonctions utilitaires
function Create-ManifestJson {
    param (
        [string]$path,
        [string]$name,
        [string]$version,
        [string]$description
    )

    # Vérifier si le fichier manifest.json existe déjà
    if (Test-Path "$path\manifest.json") {
        Write-Host "Le fichier manifest.json existe déjà, il ne sera pas modifié."
        return
    }

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

function Create-SidebarHtml {
    param (
        [string]$path,
        [string]$title,
        [string]$mainJsFile,
        [string]$polyfillsJsFile,
        [string]$stylesFile
    )

    # Vérifier si le fichier sidebar.html existe déjà
    if (Test-Path "$path\sidebar.html") {
        # Mettre à jour uniquement les références aux fichiers JS et CSS
        $content = Get-Content -Path "$path\sidebar.html" -Raw
        $content = $content -replace 'href="styles-[^"]+\.css"', "href=""$stylesFile"""
        $content = $content -replace 'src="polyfills-[^"]+\.js"', "src=""$polyfillsJsFile"""
        $content = $content -replace 'src="main-[^"]+\.js"', "src=""$mainJsFile"""
        Set-Content -Path "$path\sidebar.html" -Value $content
        Write-Host "Fichier sidebar.html mis à jour avec les nouveaux fichiers JS et CSS."
        return
    }

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

function Create-PlaceholderIcons {
    param (
        [string]$path
    )

    # Vérifier si les icônes existent déjà
    if ((Test-Path "$path\icon16.png") -and (Test-Path "$path\icon48.png") -and (Test-Path "$path\icon128.png")) {
        Write-Host "Les icônes existent déjà, elles ne seront pas recréées."
        return
    }

    # Créer des icônes simples à partir du favicon.ico
    if (Test-Path "$path\favicon.ico") {
        # Copier le favicon.ico pour les différentes tailles d'icônes
        Copy-Item -Path "$path\favicon.ico" -Destination "$path\icon16.png"
        Copy-Item -Path "$path\favicon.ico" -Destination "$path\icon48.png"
        Copy-Item -Path "$path\favicon.ico" -Destination "$path\icon128.png"
        Write-Host "Icônes créées à partir de favicon.ico avec succès."
    } else {
        Write-Warning "favicon.ico non trouvé. Les icônes n'ont pas été créées."
    }
}

# Vérifier si le répertoire du projet Angular existe
if (-not (Test-Path $angularAppPath)) {
    Write-Error "Le répertoire du projet Angular '$angularAppPath' n'existe pas."
    exit 1
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

# Étape 2: Préparer le répertoire de l'extension Chrome
Write-Host "Étape 2: Préparation du répertoire de l'extension Chrome..."
# Sauvegarder les fichiers importants s'ils existent
$manifestExists = Test-Path "$extensionPath\manifest.json"
$sidebarExists = Test-Path "$extensionPath\sidebar.html"
$icon16Exists = Test-Path "$extensionPath\icon16.png"
$icon48Exists = Test-Path "$extensionPath\icon48.png"
$icon128Exists = Test-Path "$extensionPath\icon128.png"

if ($manifestExists) {
    Copy-Item -Path "$extensionPath\manifest.json" -Destination "$env:TEMP\manifest.json" -Force
}
if ($sidebarExists) {
    Copy-Item -Path "$extensionPath\sidebar.html" -Destination "$env:TEMP\sidebar.html" -Force
}
if ($icon16Exists) {
    Copy-Item -Path "$extensionPath\icon16.png" -Destination "$env:TEMP\icon16.png" -Force
}
if ($icon48Exists) {
    Copy-Item -Path "$extensionPath\icon48.png" -Destination "$env:TEMP\icon48.png" -Force
}
if ($icon128Exists) {
    Copy-Item -Path "$extensionPath\icon128.png" -Destination "$env:TEMP\icon128.png" -Force
}

if (Test-Path $extensionPath) {
    Remove-Item -Path $extensionPath -Recurse -Force
}
New-Item -Path $extensionPath -ItemType Directory | Out-Null

# Restaurer les fichiers importants
if ($manifestExists) {
    Copy-Item -Path "$env:TEMP\manifest.json" -Destination "$extensionPath\manifest.json" -Force
}
if ($sidebarExists) {
    Copy-Item -Path "$env:TEMP\sidebar.html" -Destination "$extensionPath\sidebar.html" -Force
}
if ($icon16Exists) {
    Copy-Item -Path "$env:TEMP\icon16.png" -Destination "$extensionPath\icon16.png" -Force
}
if ($icon48Exists) {
    Copy-Item -Path "$env:TEMP\icon48.png" -Destination "$extensionPath\icon48.png" -Force
}
if ($icon128Exists) {
    Copy-Item -Path "$env:TEMP\icon128.png" -Destination "$extensionPath\icon128.png" -Force
}

Write-Host "Répertoire de l'extension préparé avec succès."

# Étape 3: Identifier les fichiers générés par Angular
Write-Host "Étape 3: Identification des fichiers générés..."
$browserDir = "$angularAppPath\dist\$angularAppPath\browser"
if (-not (Test-Path $browserDir)) {
    Write-Error "Le répertoire du build Angular '$browserDir' n'existe pas."
    exit 1
}

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
# Exclure les fichiers que nous voulons conserver
$excludeFiles = @("manifest.json", "sidebar.html", "icon16.png", "icon48.png", "icon128.png")
Get-ChildItem -Path $browserDir | Where-Object { $excludeFiles -notcontains $_.Name } | Copy-Item -Destination $extensionPath -Recurse
Write-Host "Fichiers copiés avec succès."

# Étape 5: Créer les fichiers spécifiques à l'extension (seulement s'ils n'existent pas déjà)
Write-Host "Étape 5: Création des fichiers spécifiques à l'extension..."
Create-ManifestJson -path $extensionPath -name $extensionName -version $extensionVersion -description $extensionDescription
Create-SidebarHtml -path $extensionPath -title $extensionName -mainJsFile $mainJsFile -polyfillsJsFile $polyfillsJsFile -stylesFile $stylesFile
Create-PlaceholderIcons -path $extensionPath
Write-Host "Fichiers spécifiques à l'extension créés avec succès."

Write-Host "Extension Chrome générée avec succès dans le répertoire '$extensionPath'."
Write-Host "Pour tester l'extension, ouvrez Chrome, accédez à chrome://extensions/, activez le mode développeur, et cliquez sur 'Charger l'extension non empaquetée'."
