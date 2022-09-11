git pull
git add .
git commit -m "%*"
git push
ng build
git ftp init
git ftp push --syncroot ./dist/join/
