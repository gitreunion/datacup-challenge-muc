@echo off

:: Vérification de Python et pip
echo Vérification de Python et pip...
python --version >nul 2>&1 || (
    echo Python n'est pas installé. Veuillez l'installer avant de continuer.
    pause
    exit /b
)

:: Création de l'environnement virtuel
set ENV_DIR=venv_haystack
echo Création de l'environnement virtuel : %ENV_DIR%
python -m venv %ENV_DIR%

:: Activation de l'environnement virtuel
echo Activation de l'environnement virtuel...
call %ENV_DIR%\Scripts\activate

:: Installation des bibliothèques
echo Installation des bibliothèques Python dans l'environnement virtuel...
pip install --upgrade pip
pip install haystack-ai datasets sentence-transformers faiss-cpu flask flask_cors requests

:: Message de fin
echo Installation terminée. Pour activer l'environnement virtuel à nouveau, utilisez :
echo call %ENV_DIR%\Scripts\activate
pause
