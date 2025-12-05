# Script PowerShell pour créer un raccourci sur le bureau

$ProjectPath = $PSScriptRoot
$BatchFile = Join-Path $ProjectPath "Lancer_Tervene.bat"
$DesktopPath = [System.Environment]::GetFolderPath('Desktop')
$ShortcutPath = Join-Path $DesktopPath "Tervene License Manager.lnk"

# Créer l'objet WScript Shell
$WScriptShell = New-Object -ComObject WScript.Shell

# Créer le raccourci
$Shortcut = $WScriptShell.CreateShortcut($ShortcutPath)
$Shortcut.TargetPath = $BatchFile
$Shortcut.WorkingDirectory = $ProjectPath
$Shortcut.Description = "Lancer Tervene License Manager"
$Shortcut.IconLocation = "shell32.dll,137"  # Icône application
$Shortcut.Save()

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "  RACCOURCI CREE AVEC SUCCES !" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Emplacement: $ShortcutPath" -ForegroundColor Cyan
Write-Host ""
Write-Host "Double-cliquez sur le raccourci pour lancer l'application." -ForegroundColor Yellow
Write-Host ""

Read-Host "Appuyez sur Entree pour fermer"






