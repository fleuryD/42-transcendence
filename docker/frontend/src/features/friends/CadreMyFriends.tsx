// ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
import React from "react"
import ZCadre from "ui/ZCadre"

// ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■

type Props = {
	className: string
}

export default function CadreMyFriends({ className }: Props) {
	return (
		<ZCadre className={className}>
			<div className="cadreTitle">Friends</div>
			<div className="cadreContent">
				<p>Todo</p>
				<q>
					L’utilisateur doit pouvoir ajouter d’autres utilisateurs comme ami(e)s et voir leur statut en temps
					réel (en ligne, hors-ligne, en pleine partie, etc.).
				</q>
			</div>
		</ZCadre>
	)
}

// 〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓	STYLED_COMPONENTS
