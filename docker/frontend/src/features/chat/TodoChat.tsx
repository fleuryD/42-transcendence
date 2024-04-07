// ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
import React, { useState } from "react"
import { Button } from "react-bootstrap"

// ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■

export default function TodoChat() {
	const [show, setShow] = useState(false)

	return (
		<div className="row col-12 todo">
			<h2>
				Todo
				<Button className="btn-secondary btn-sm float-end" onClick={() => setShow(!show)}>
					Afficher / masquer
				</Button>
			</h2>

			{show && (
				<ul>
					<li>Channel protege par pass</li>
					<li>update channel (seulement par owner)</li>
					<li>Quitter Channel</li>
					<li>
						"L’utilisateur qui crée un channel devient son owner. Ceci, jusqu’à ce qu’il le quitte."
						<span className="text-primary"> C'est qui le owner apres ?</span>
					</li>
					<li>
						mettre en sourdine pour un temps limité : pour l'instantm l'user doit envoyer un message au bout
						d'une minute pour etre unmute
					</li>
					<li>
						"Grâce à l’interface de chat, l’utilisateur doit pouvoir en inviter d’autres à faire une partie
						de Pong."
					</li>
					<li>Gerer focus input/bouton + valider avec 'Enter'</li>
					<li>Online Users</li>
					<li>Bloquer des Users</li>
				</ul>
			)}
		</div>
	)
}

// 〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓	STYLED_COMPONENTS
