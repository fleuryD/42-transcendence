// ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
import React, { useEffect } from "react"
import ZPage from "ui/ZPage"
import { FaBan } from "react-icons/fa"
import { sendNavigate } from "utils/socketio.service"

// ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■

export default function PageDevSubject() {
	useEffect(() => {
		sendNavigate("PageDevSubject", null)
	}, [])
	return (
		<ZPage documentTitle="Subject">
			<div className="zPageHeader">
				<h1>
					<FaBan /> Dev: Subject
				</h1>
			</div>

			<div className="todo">
				<h2>Todo</h2>

				<h2>II.1 Vue d’ensemble</h2>
				<ul>
					<li className="text-xxx">
						Grâce à votre site web, les utilisateurs pourront jouer à Pong entre eux. Vous fournirez une
						interface utilisateur, un chat et des parties en ligne multijoueurs en temps réel !
					</li>
					<li className="text-success">Le backend de votre site doit être écrit en NestJS.</li>
					<li className="text-success">
						Quant au frontend, il sera réalisé avec le framework TypeScript de votre choix.
					</li>
					<li className="text-xxx">
						Vous êtes libre d’utiliser les bibliothèques que vous souhaitez dans ce contexte.
					</li>
					<li className="text-danger">
						Toutefois, vous avez pour obligation de choisir la dernière version stable de chaque
						bibliothèque ou framework utilisé.
					</li>
					<li className="text-success">
						Vous devez utiliser une base de données PostgreSQL. Aucune autre base de données n’est
						autorisée.
					</li>
					<li className="text-success">
						Votre site web doit être une application web monopage. L’utilisateur doit pouvoir utiliser les
						boutons Précédent et Suivant du navigateur.
					</li>
					<li className="text-primary">
						Votre site web doit être compatible avec la dernière version stable à jour de Google Chrome, et
						un autre navigateur de votre choix.
					</li>
					<li className="text-danger">
						L’utilisateur ne doit pas rencontrer d’erreurs non gérées ou d’avertissement sur votre site.
					</li>
					<li className="text-danger">
						Vous devez lancer le tout par un simple appel à : docker-compose up --build
					</li>
				</ul>

				<h2>II.2 Questions de sécurité</h2>
				<ul>
					<li className="text-xxx">
						Afin de créer un site web pleinement fonctionnel, voici quelques questions de sécurité que vous
						devez gérer :
					</li>
					<li className="text-success">
						Tout mot de passe stocké dans votre base de données doit être chiffré.
					</li>
					<li className="text-danger">Votre site web doit être protégé contre les injections SQL.</li>
					<li className="text-danger">
						Vous devez implémenter un système de validation côté serveur pour les formulaires et toute
						requête utilisateur.
					</li>
					<li className="text-success">
						Assurez-vous d’utiliser un algorithme de hachage de mot de passe fort
					</li>
					<li className="text-danger">
						Toutes les informations d’identification, clés API, variables env,etc. doivent être enregistrées
						dans un fichier .env et ignoré par git.
					</li>
				</ul>

				<h2>II.3 Compte utilisateur</h2>
				<ul>
					<li className="text-danger">
						L’utilisateur doit pouvoir se loguer avec le système OAuth de l’intranet 42.
					</li>
					<li className="text-danger">
						L’utilisateur doit pouvoir choisir un nom d’utilisateur unique qui sera affiché sur le site web.
					</li>
					<li className="text-danger">
						L’utilisateur doit pouvoir télécharger un avatar. S’il n’en met pas, un avatar par défaut doit
						être affiché.
					</li>
					<li className="text-danger">
						L’utilisateur doit pouvoir activer l’authentification à deux facteurs, ou 2FA, comme Google
						Authenticator ou l’envoi d’un SMS sur son téléphone portable.
					</li>
					<li className="text-danger">
						L’utilisateur doit pouvoir ajouter d’autres utilisateurs comme ami(e)s et voir leur statut en
						temps réel (en ligne, hors-ligne, en pleine partie, etc.).
					</li>
					<li className="text-danger">
						Des stats (telles que : victoires et défaites, rang et niveaux, hauts faits, etc.) doivent être
						affichées sur le profil de l’utilisateur.
					</li>
					<li className="text-danger">
						Chaque utilisateur doit avoir un Match History (historique comportant les parties 1 contre 1,
						les niveaux et ainsi de suite). Toute personne loguée doit pouvoir le consulter.
					</li>
				</ul>

				<h2>II.4 Chat</h2>
				<ul>
					<li className="text-primary">Vous devez également créer un chat pour vos utilisateurs :</li>
					<li className="text-danger">
						L’utilisateur doit pouvoir créer des channels (salons de discussion) pouvant être soit publics,
						privés, ou protégés par mot de passe.
					</li>
					<li className="text-danger">
						L’utilisateur doit pouvoir envoyer des direct messages à d’autres utilisateurs.
					</li>
					<li className="text-danger">
						L’utilisateur doit pouvoir en bloquer d’autres. Ainsi, il ne verra plus les messages envoyés par
						les comptes qu’il aura bloqués.
					</li>
					<li className="text-danger">
						L’utilisateur qui crée un nouveau channel devient automatiquement son owner (propriétaire).
						Ceci, jusqu’à ce qu’il le quitte.
					</li>
					<li className="text-danger">
						--◦ Le propriétaire du channel peut définir un mot de passe requis pour accéder au channel, le
						modifier, et le retirer.
					</li>
					<li className="text-danger">
						--◦ Le propriétaire du channel en est aussi un administrateur. Il peut donner le rôle
						d’administrateur à d’autres utilisateurs.
					</li>
					<li className="text-danger">
						--◦ Un utilisateur qui est administrateur d’un channel peut expulser, bannir ou mettre en
						sourdine (pour un temps limité) d’autres utilisateurs, mais pas les propriétaires du channel.
					</li>
					<li className="text-danger">
						Grâce à l’interface de chat, l’utilisateur doit pouvoir en inviter d’autres à faire une partie
						de Pong.
					</li>
					<li className="text-danger">
						Grâce à l’interface de chat, l’utilisateur doit pouvoir accéder aux profils d’autres joueurs.
					</li>
				</ul>

				<h2>II.5 Le jeu</h2>
				<ul>
					<li className="text-primary">
						Le principal objectif de ce site web est de jouer à Pong avec d’autres joueurs !
					</li>
					<li className="text-primary">
						Par conséquent, l’utilisateur doit pouvoir lancer une partie de Pong en live contre un autre
						joueur, directement sur votre site web.
					</li>
					<li className="text-primary">
						Il doit y avoir un système de matching : l’utilisateur rejoint une file d’attente jusqu’à être
						matché automatiquement avec quelqu’un d’autre.
					</li>
					<li className="text-primary">
						Votre jeu peut être un jeu canvas, être rendu en 3D, ou même n’être pas très beau à voir, etc.
						..., mais dans tous les cas, il doit être fidèle au Pong original de 1972.
					</li>
					<li className="text-danger">
						Vous devez offrir quelques options de customisation (par exemple, des power-ups ou des maps
						différentes) mais l’utilisateur doit pouvoir jouer à la version par défaut sans options s’il le
						souhaite.
					</li>
					<li className="text-danger">Le jeu doit être responsive !</li>
					<li className="text-danger">
						Ayez en tête les soucis de réseau comme les déconnexions inattendues ou des latences. Vous devez
						vous efforcer d’offrir la meilleure expérience utilisateur possible.
					</li>
				</ul>
			</div>
		</ZPage>
	)
}

// 〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓	STYLED_COMPONENTS
