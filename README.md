# 42TranscendentaL

## IMPORTANT: A verifier quand vous faites un git pull !

Je fais 2 modifs pour travailler sous windows :

```
	/docker/backend/app.module.ts	:
		host: "postgres", 		// docker
		host: "localhost", 		// pour mon windows


	/docker/frontend/package.json	:
		"scripts": {
			"start": "PORT=80 && react-scripts start",			// pour docker
			"start": "set PORT=80 &&  react-scripts start",	// pour windows

```

## Run (avec docker)

`make`

## Run (sans docker)

- Mettre à jour node et npm, puis installer les dépendances dans les 2 dossier end et front : `npm install`
- Installer PostgreSQL et creer un serveur et une bdd qui correspondent aux infos de `backend/app.module.ts`
- Lancer dabord le backend: `npm run start:dev` (":dev" sert a avoir un serveur qui se relance a chaque changement de fichier)
- Lancer ensuite le front: `npm start`

&nbsp;

&nbsp;

## Change Log

- 2023-08-23 :

     - Debut Pong (affichage canvas OK + move raquette avec clavier)
     - user en liste d'attente et rejoint la partie quand il y a 2 joueurs
     - Chat v2

- 2023-08-22 :

     - Debut Queue (file d'atttente pour la partie)

- 2023-08-21 :

     - Chat +ou- fonctionnel

- 2023-08-20 :
     - front : infos de connexion dans redux (authSlice)
     - front/back : routes ok : user/id, users

&nbsp;

&nbsp;

&nbsp;

&nbsp;

### Back

```
npm install socket.io @nestjs/websockets @nestjs/platform-socket.io

```
