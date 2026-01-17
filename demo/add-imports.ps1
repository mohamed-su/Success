$files = @(
    "c:\Users\HP\Downloads\dev1\dev\front\src\pages\admin\UserManagement.tsx",
    "c:\Users\HP\Downloads\dev1\dev\front\src\pages\member\ProtocolEvaluation.tsx",
    "c:\Users\HP\Downloads\dev1\dev\front\src\pages\secretary\ValidateProtocols.tsx",
    "c:\Users\HP\Downloads\dev1\dev\front\src\pages\auth\Register.tsx",
    "c:\Users\HP\Downloads\dev1\dev\front\src\pages\auth\ModernRegister.tsx"
)

foreach ($file in $files) {
    if (Test-Path $file) {
        $content = Get-Content $file -Raw
        if ($content -match '\$\{BASE_URL\}' -and $content -notmatch 'API_CONFIG.*from.*config/api') {
            $lines = Get-Content $file
            $importIndex = -1
            
            for ($i = 0; $i -lt $lines.Count; $i++) {
                if ($lines[$i] -match "^import.*React") {
                    $importIndex = $i
                    break
                }
            }
            
            if ($importIndex -ge 0) {
                $newLines = @()
                $newLines += $lines[0..$importIndex]
                $newLines += "import { API_CONFIG } from '../../config/api';"
                $newLines += ""
                $newLines += "const BASE_URL = API_CONFIG.BASE_URL;"
                $newLines += $lines[($importIndex + 1)..($lines.Count - 1)]
                
                $newLines | Set-Content $file
                Write-Host "✅ Import ajouté dans $(Split-Path $file -Leaf)"
            }
        }
    }
}

Write-Host "✅ Imports BASE_URL ajoutés dans les fichiers principaux"