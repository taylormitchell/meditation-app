set -e # Exit immediately if a command exits with a non-zero status (failure)

# assert git status is clean
if [[ $(git status -s) ]]; then
    echo "The working directory is dirty. Please commit any pending changes."
    exit 1;
fi 

# build
tsc && BASE_URL=/meditation-app/ vite build 

# commit
git add dist 
git commit -m "Update dist"
git push origin main

# deploy
git subtree push --prefix dist origin gh-pages

echo "Deployed successfully."
echo "Go to https://github.com/taylormitchell/meditation-app/actions to see the status."

