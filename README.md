Steps to run locally and on docker

Local :
------
git clone https://github.com/brajeshk14jul/my-nodejs-app-repo.git
npm install
npm start

Build the docker image
-----------------------
docker build -t my-nodejs-app-repo:1.0 .

RUN the application as container
---------------------------------
docker run -p 3000:3000 my-nodejs-app-repo:1.0
