// ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
import React, { useEffect } from "react"
import ZPage from "ui/ZPage"
import { FaHome } from "react-icons/fa"
// import DevNotesRoutes from "features/dev/DevNotesRoutes"
import DevChangeLog from "features/dev/DevChangeLog"
import ZCadre from "ui/ZCadre"
import CadreGameLastParties from "features/game/CadreGameLastParties"
import CadreMyFriends from "features/friends/CadreMyFriends"
import { useAppSelector } from "store/store"

import "./PageHome.scss"
import styled from "styled-components"
import { sendNavigate } from "utils/socketio.service"

// ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■

export default function PageHome() {
	/*useEffect(() => {
		sendNavigate("PageHome", null)
	}, [sockerIsConnected])*/

	const [animStarted, setAnimStarted] = React.useState(false)

	function randomIntFromInterval(min: number, max: number) {
		return Math.floor(Math.random() * (max - min + 1) + min)
	}

	async function anim() {
		let elem = document.getElementById("typeText")

		if (!elem || animStarted == true) return

		setAnimStarted(true)

		let text = elem ? elem.innerHTML : ""

		let text2 = "Break the codes."
		let text1 = "Code, Compile, Conquer."

		let texts = ["Break the codes.", "Code, Compile, Conquer.", "Tech for All.", "Learn, Innovate, Succeed."]

		let numText = 0

		while (true) {
			elem.innerHTML = ""

			let i = 0
			let speed = 100

			for (let i = 0; i < texts[numText].length; i++) {
				elem.innerHTML += texts[numText].charAt(i)
				await new Promise((r) => setTimeout(r, speed))
			}

			await new Promise((r) => setTimeout(r, 1000))

			for (let i = 0; i < texts[numText].length; i++) {
				elem.innerHTML = elem.innerHTML.slice(0, -1)
				await new Promise((r) => setTimeout(r, speed / 4))
			}

			await new Promise((r) => setTimeout(r, 200))

			numText = randomIntFromInterval(0, texts.length - 1)
		}
	}

	useEffect(() => {
		//anim();
	}, [])

	return (
		<StyledHomeZPage documentTitle="Home">
			<div>
				<section className="slicedWarper">
					<div className="slicedTop">TranscendentaL</div>
					<div className="slicedBottom" aria-hidden="true">
						TranscendentaL
					</div>
				</section>
				<div className="blinkContainer">
					<span className="subTitleHome" id="typeText">
						Break the codes.
					</span>
					<span className="blinkLine">|</span>
				</div>
			</div>
			<div className="homeText">
				<div className="homeTitle">Game</div>
				<div className="homePara">
					Au coeur de l'ere electronique naissante, Nolan Bushnell crea Atari, donnant vie a Pong. Un jeu qui
					revolutionna le divertissement electronique. Pong, une symphonie de raquettes virtuelles et d'une
					balle, fascina les joueurs dans les annees 70. Ce jeu devint un succes commercial mondial, marquant
					le debut d'une revolution du jeu video. L'histoire de Pong est celle d'une etoile filante, une
					etincelle creative qui a ouvert la voie a l'industrie du jeu video. Elle symbolise l'union de la
					technologie et de l'art. Ainsi, Pong est et restera une epopee lumineuse dans l'histoire des jeux
					video.
				</div>
				<div className="homeTitle">Chat</div>
				<div className="homePara">
					Plongez dans un monde en ligne ou vous avez le pouvoir absolu de sculpter chaque aspect de vos
					interactions. Vous etes le maitre de votre cercle social, pouvant ajouter des amis et bloquer des
					utilisateurs indesirables a votre guise. De plus, vous avez la possibilite de creer des salons de
					discussion, des espaces virtuels ou vos passions et interets se deploient dans des discussions
					enrichissantes. Rejoignez-nous pour decouvrir une nouvelle ere de communication numerique, ou chaque
					lien se tisse selon vos preferences, et ou la securite est une priorite indefectible.
				</div>
			</div>
		</StyledHomeZPage>
	)
}

// 〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓	STYLED_COMPONENTS

const StyledHomeZPage = styled(ZPage)`
	background-color: transparent !important;
	color: white;
	text-align: center;
	font-family: "customFont1", sans-serif;
	border: none !important;
`
const StyledHomeZCadre = styled(ZCadre)`
	padding: 0 0;
	border: none !important;

	width: calc(100% - 20px);
	max-width: 1000px;
	margin: 0 auto;
	margin-top: 15px;

	p {
		font-size: 1em;
		margin-top: 10px;
	}
`
