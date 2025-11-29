@echo off
echo ==========================================
echo  Publicando projeto automaticamente no GitHub
echo ==========================================

REM ===== CONFIGURAR =====
SET REPO_URL=https://github.com/SEU_USUARIO/SEU_REPOSITORIO.git

echo.
echo Usando repositório: %REPO_URL%
echo.

git init
git add .
git commit -m "Primeiro commit automatico"
git branch -M main
git remote add origin %REPO_URL%
git push -u origin main

echo.
echo ==========================================
echo  Processo concluído!
echo ==========================================
pause
