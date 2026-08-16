@echo off
echo ==========================================
echo Pushing Ramdev Biocoal Industries to GitHub
echo ==========================================

:: Check if git is initialized
if not exist .git (
    echo Initializing git...
    git init
)

:: Set local repository git identity
echo Configuring git identity...
git config user.name "vijayghodadra"
git config user.email "vijayghodadra@users.noreply.github.com"

:: Add remote if not already added
git remote | findstr /R "^origin$" >nul
if errorlevel 1 (
    echo Adding remote origin...
    git remote add origin https://github.com/vijayghodadra/SOMNATH-INDUSTRIES.git
) else (
    echo Remote origin already exists. Updating URL...
    git remote set-url origin https://github.com/vijayghodadra/SOMNATH-INDUSTRIES.git
)

:: Stage all files
echo Staging files...
git add .

:: Commit
echo Committing files...
git commit -m "Initial commit of Ramdev Biocoal Industries website"

:: Rename branch to main
echo Setting branch to main...
git branch -M main

:: Push
echo Pushing to GitHub...
git push -u origin main

echo ==========================================
echo Done! Please check your GitHub repository.
echo ==========================================
pause
