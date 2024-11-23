# Installation Guide

## Data Collection

Indicate how to collect the data necessary for this project :
- Where and how to get the data ?
    We already have some data that our IA is using but you can go to useful links like:
    [Fiche action 1.2.5 Kap Numérik](https://nextcloud.datactivist.coop/s/y88QozEaqmGr5Wo)
    [Liste des professions libérales réglementées](https://bpifrance-creation.fr/encyclopedie/trouver-proteger-tester-son-idee/verifiertester-son-idee/liste-professions-liberales)
    [Code APE des secteurs inéligibles](https://nextcloud.datactivist.coop/s/JSEaP2TRf7cx2tC)

- Where and how to integrate the data in the repository ? (example : in the direcctory data/raw)
    you can put them in the `./rag/dataset`

## Dependencies

List the dependencies necessary to the project so that it can run locally :
- language: Python3, JavaScript
- libraries: React, TailWindCSS
- packages: flask, flask_cors, haystack-ai, datasets, requests, tf-keras, sentence-transformers, faiss-cpu, glob, os, re, mistralai
- framework: NextJS
- how to install them:
    You can use our scripts in`./Scripts` directory and install npm on your computer
- recommended : use an environment file such as requirements.txt (py) or DESCRIPTION (R)

## Development

Indicate how to run the solution in development mode locally.

To launch the project you have to launch:

    - the neural network: Go to `./rag` directory and launch `python3 main.py`

    - the little web application: Go to `frontend\easy-chatbot-main`, type 'npm install` and then `npm run dev`

## Production

Indicate, if it exist, a documentation to run the solution in production mode.