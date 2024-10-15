set -e

if [ -d "build" ]
then
    cd build
    git pull
    cd ../
else
    git clone https://github.com/Jothin-kumar/build.git
fi
printf "git (build) ✅\n\n"

python3 build/build.py
printf "build.py ✅\n\n"

cp root/robots.txt build-output/robots.txt
printf "robots.txt ✅\n\n"
cp root/sitemap.txt build-output/sitemap.txt
printf "sitemap.txt ✅\n\n"
cp -r root/assets build-output/assets
printf "assets ✅\n\n"