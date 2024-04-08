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

cp robots.txt build-output/robots.txt
printf "robots.txt ✅\n\n"