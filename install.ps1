# Script de instalação de dependências
Write-Host "Instalando dependências do projeto..." -ForegroundColor Green

# Navega para o diretório do frontend
Set-Location $PSScriptRoot

# Remove node_modules se existir
if (Test-Path "node_modules") {
    Write-Host "Removendo node_modules antigo..." -ForegroundColor Yellow
    Remove-Item -Recurse -Force node_modules -ErrorAction SilentlyContinue
}

# Instala as dependências
Write-Host "Executando pnpm install..." -ForegroundColor Green
pnpm install

if ($LASTEXITCODE -eq 0) {
    Write-Host "`n✅ Dependências instaladas com sucesso!" -ForegroundColor Green
    Write-Host "`nPróximos passos:" -ForegroundColor Cyan
    Write-Host "1. Reinicie o TypeScript Server no VS Code (Ctrl+Shift+P -> 'TypeScript: Restart TS Server')" -ForegroundColor White
    Write-Host "2. Execute 'pnpm dev' para iniciar o servidor" -ForegroundColor White
} else {
    Write-Host "`n❌ Erro ao instalar dependências. Verifique se o pnpm está instalado." -ForegroundColor Red
}


