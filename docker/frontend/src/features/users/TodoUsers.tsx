// ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
import React from "react"

// ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■

export default function TodoUsers() {
	return (
		<div className="row col-12 todo">
			<h2>Notes</h2>

			<div>
				<h3 className="d-inline-block">API endpoint:</h3>
				<p className="d-inline-block">(POST) "/users"</p>
			</div>

			<h3>Sujet</h3>
			<ul>
				<li>Tout mot de passe stocké dans votre base de données doit être chiffré.</li>
				<li>Assurez-vous d’utiliser un algorithme de hachage de mot de passe fort</li>
				<li>L’utilisateur doit pouvoir se loguer avec le système OAuth de l’intranet 42.</li>
				<li>
					L’utilisateur doit pouvoir choisir un nom d’utilisateur unique qui sera affiché sur le site web.
				</li>
				<li>
					L’utilisateur doit pouvoir télécharger un avatar. S’il n’en met pas, un avatar par défaut doit être
					affiché.
				</li>
				<li>
					L’utilisateur doit pouvoir activer l’authentification à deux facteurs, ou 2FA, comme Google
					Authenticator ou l’envoi d’un SMS sur son téléphone portable.
				</li>
				<li>
					L’utilisateur doit pouvoir ajouter d’autres utilisateurs comme ami(e)s et voir leur statut en temps
					réel (en ligne, hors-ligne, en pleine partie, etc.).
				</li>
				<li>
					Des stats (telles que : victoires et défaites, rang et niveaux, hauts faits, etc.) doivent être
					affichées sur le profil de l’utilisateur.
				</li>
				<li>
					Chaque utilisateur doit avoir un Match History (historique comportant les parties 1 contre 1, les
					niveaux et ainsi de suite). Toute personne loguée doit pouvoir le consulter.
				</li>
			</ul>
		</div>
	)
}

// 〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓	STYLED_COMPONENTS
