# Script PowerShell pour remplacer toutes les URLs hardcodées
$sourceDir = "c:\Users\HP\Downloads\dev1\dev\front\src"

# Fonction pour ajouter l'import BASE_URL si nécessaire
function Add-BaseUrlImport {
    param($filePath)
    
    $content = Get-Content $filePath -Raw
    
    # Vérifier si l'import existe déjà
    if ($content -notmatch "import.*API_CONFIG.*from.*config/api") {
        # Trouver la ligne d'import React
        $lines = Get-Content $filePath
        $importIndex = -1
        
        for ($i = 0; $i -lt $lines.Count; $i++) {
            if ($lines[$i] -match "^import React") {
                $importIndex = $i
                break
            }
        }
        
        if ($importIndex -ge 0) {
            # Ajouter l'import après React
            $newLines = @()
            $newLines += $lines[0..$importIndex]
            $newLines += "import { API_CONFIG } from '../config/api';"
            $newLines += ""
            $newLines += "const BASE_URL = API_CONFIG.BASE_URL;"
            $newLines += $lines[($importIndex + 1)..($lines.Count - 1)]
            
            $newLines | Set-Content $filePath
            Write-Host "✅ Import ajouté dans $filePath"
        }
    }
}

# Remplacer les URLs dans tous les fichiers
Get-ChildItem -Path $sourceDir -Recurse -Include "*.tsx", "*.ts", "*.jsx", "*.js" | ForEach-Object {
    $filePath = $_.FullName
    $content = Get-Content $filePath -Raw
    
    if ($content -match "http://localhost:8081/api" -or $content -match "http://localhost:9999/api") {
        Write-Host "🔧 Correction de $($_.Name)..."
        
        # Ajouter l'import si nécessaire
        Add-BaseUrlImport $filePath
        
        # Remplacer les URLs
        $content = $content -replace "http://localhost:8081/api", "`${BASE_URL}"
        $content = $content -replace "http://localhost:9999/api", "`${BASE_URL}"
        
        # Sauvegarder
        $content | Set-Content $filePath
        Write-Host "✅ $($_.Name) corrigé"
    }
}

Write-Host ""
Write-Host "========================================="
Write-Host "CORRECTION AUTOMATIQUE TERMINÉE"
Write-Host "========================================="