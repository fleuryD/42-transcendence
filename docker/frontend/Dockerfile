FROM	node:16 AS build

WORKDIR	/app

COPY	package*.json ./

RUN		npm install


### pour l'erreur "EACCES: permission denied, mkdir 'app/node_modules/.cache"  sur mon portqble
RUN mkdir -p node_modules/.cache && chmod -R 777 node_modules/.cache

COPY	. .

EXPOSE	3001

CMD		["npm", "start"]
