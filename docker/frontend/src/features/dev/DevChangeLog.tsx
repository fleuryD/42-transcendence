// ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■

import React from "react"
import { styled } from "styled-components"
import ZTable from "ui/zTable/ZTable"

// ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■

export default function DevChangeLog() {
	const arr = [
		{
			id: 10,
			date: "2023-09-11",
			content: (
			<>
				Prototype MatchHistory sur le profile
				Style de la page Users, Home, GameJoin + Ajout divers fonctions
			</>),
		},
		{
			id: 9,
			date: "2023-09-10",
			content: (
			<>
				Style + effet game + direction rebond ball sur pad en fonction de la position de la balle sur le pad
				Setup doubleAuth depuis le profil + setup de l'api pour le login avec doubleauth (Utilisation de google authenticator)
				Creation de la redirection vers Oauth pour se connecter avec 42, detection auto de login, email, avatarLink et password(le token du compte 42)
				Ajout user.avatarLink + avatar par default dans public/
			</>),
		},
		{
			id: 8,
			date: "2023-09-09",
			content: (
			<>
				Amelioration synchronisation + interface du jeu + ajout du score
				Fusion pages login et register + changement du style
			</>),
		},
		{
			id: 7,
			date: "2023-09-01",
			content: <>Ca marche sur les pc 42 avec docker</>,
		},
		{
			id: 6,
			date: "2023-08-26",
			content: <>Chat :: Channels</>,
		},
		{
			id: 5,
			date: "2023-08-25",
			content: (
				<>
					Nouvel structure de fichier pour fetch
					<br />
					Pong: Synchro Ball et Raquettes
				</>
			),
		},
		{
			id: 4,
			date: "2023-08-23",
			content: (
				<>
					Debut Pong (affichage canvas OK + move raquette avec clavier)
					<br />
					user en liste d'attente et rejoint la partie quand il y a 2 joueurs
					<br />
					Chat v2 (plus de bug de synchro)
				</>
			),
		},
		{
			id: 3,
			date: "2023-08-22",
			content: <>Debut Queue (file d'atttente pour la partie)</>,
		},
		{
			id: 2,
			date: "2023-08-21",
			content: <>Chat +ou- fonctionnel (un seul salon, pas d'admin ni de MP...)</>,
		},
		{
			id: 1,
			date: "2023-08-20",
			content: (
				<>
					front : infos de connexion dans redux (authSlice)
					<br />
					front/back : routes ok : user/id, users
				</>
			),
		},
	]

	const tableColumns = [
		{
			name: "date",
			text: "date",
		},
		{
			name: "content",
			text: "Dev Logs",
		},
	]

	return (
		<StyledDevChangeLog>
			<StyledDevTable
				columns={tableColumns}
				data={arr}
				className="table table-bordered table-sm table-striped table-hover"
			/>
		</StyledDevChangeLog>
	)
}

// 〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓	STYLED_COMPONENTS

const StyledDevChangeLog = styled.div`
	* {
		background: none !important;
		color: white !important;
		border-width: 0.5px 0 0.5px 0 !important;
	}

	background: #ffffff11 !important;
	backdrop-filter: blur(3px);
	color: white;
	border-radius: 5px;
	padding: 10px;

`

const StyledDevTable = styled(ZTable)`
	border: none !important;
	padding: 0 0;
	width: 100%;
`
