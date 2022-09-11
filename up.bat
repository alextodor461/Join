git pull
git add .
git commit -m "%*"
git push
ng build
git ftp init --syncroot ./dist/join/
git ftp push --syncroot ./dist/join/
