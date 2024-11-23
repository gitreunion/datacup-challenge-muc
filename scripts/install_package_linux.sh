#!/bin/bash

# Vérification des prérequis (Python, pip, et venv)
echo "Mise à jour des paquets et installation des prérequis..."
sudo apt update && sudo apt upgrade -y
sudo apt install -y python3 python3-pip python3-venv

# Création de l'environnement virtuel
ENV_DIR="venv_haystack"
echo "Création de l'environnement virtuel : $ENV_DIR"

#si l'environnement virtuel existe déjà, on y rentre et vérifie si les bibliothèques sont installées correctements
if [ -d "$ENV_DIR" ]; then
    echo "L'environnement virtuel existe déjà."
    source $ENV_DIR/bin/activate
    if [ -d "$ENV_DIR/lib/python3.8/site-packages/haystack" ]; then
        echo "Les bibliothèques Haystack sont déjà installées."
        echo "Suppression des bibliothèques Haystack..."
        pip uninstall -y farm-haystack haystack haystack-ai
        echo "Purge du cache de pip..."
        pip cache purge
        echo "Installation de la bibliothèque Haystack..."
        pip install haystack-ai
    else
        echo "Les bibliothèques Haystack ne sont pas installées."
    fi
    deactivate
    exit 0
fi

python3 -m venv $ENV_DIR

# Activation de l'environnement virtuel
echo "Activation de l'environnement virtuel..."
source $ENV_DIR/bin/activate

# Installation des bibliothèques
echo "Installation des bibliothèques Python dans l'environnement virtuel..."
pip install --upgrade pip
pip install haystack-ai datasets sentence-transformers faiss-cpu flask flask_cors requests

# Message de fin
echo "Installation terminée. Pour activer l'environnement virtuel à nouveau, utilisez :"
echo "source $ENV_DIR/bin/activate"
