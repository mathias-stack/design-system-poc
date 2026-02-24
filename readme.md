# readme design tokens import


# order :
# push from figma to github

# pull from github
git stash // Tes fichiers modifiés vont "disparaître" visuellement, c'est normal, ils sont sauvegardés dans la mémoire de Git
git pull origin main // tétcharge les fichers de github
git stash pop // reintègre les fichiers local

# action styleDictionary with config.mjs
node config.mjs

# push to github
git add .
git commit -m "mon travail local est prêt"


git pull origin main --rebase
git push origin main