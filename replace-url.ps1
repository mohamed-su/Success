$filePath = "C:\Users\HP\Downloads\DEV6\Finalisation-main\dist\frontend\assets\index-DR4JEVIA.js"
$oldUrl = "https://e-agrement.minsante.bf/api"
$newUrl = "http://localhost:8081/api"

Write-Host "Remplacement de l'URL dans le fichier JS..."
Write-Host "Ancien: $oldUrl"
Write-Host "Nouveau: $newUrl"

$content = Get-Content $filePath -Raw
$newContent = $content -replace [regex]::Escape($oldUrl), $newUrl

Set-Content $filePath $newContent

Write-Host "URL remplacee avec succes!"
Write-Host "Rechargez votre page web maintenant."