// ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
import React, { useCallback, useEffect, useRef, useState } from "react"

// import styled from "styled-components"

import CanvasContext from "features/game/canvasContext"
import ZPage from "ui/ZPage"
import { FaGamepad } from "react-icons/fa"
import { useAppSelector } from "store/store"

import micro from "microseconds"
import styled from "styled-components"

import { subscribeToQueueInGame, sendMyInGameData } from "utils/socketio.service"
import { useParams } from "react-router-dom"

import "./PageGamePlay.scss"

// ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■

// * https://levelup.gitconnected.com/rpg-game-with-react-redux-html5-part-1-build-a-tile-map-9144fd867830

export default function PageGamePlay() {
	const width = 1000
	const height = 600

	const padOffset = 20
	const padWidth = 15

	const [deltaAutoUpdate, setDeltaAutoUpdate] = useState(0)

	const { socketIsConnected } = useAppSelector((state) => state.app)
	const auth = useAppSelector((state) => state.auth)
	const canvasRef = useRef<HTMLCanvasElement | null>(null)
	const [ctx, setCtx] = useState<CanvasRenderingContext2D | null | undefined>(null)

	const [lastTick, setLastTick] = useState(micro.now())

	const [Pad1Height, setPad1Height] = useState(100)
	const [Pad2Height, setPad2Height] = useState(100)
	const [positionPad1, setpositionPad1] = useState(height / 2 - Pad1Height)
	const [positionPad2, setpositionPad2] = useState(height / 2 - Pad2Height)
	const [autoControlPad, setAutoControlPad] = useState(0)

	const [score1, setScore1] = useState(0)
	const [score2, setScore2] = useState(0)

	const [ballPosX, setballPosX] = useState(width / 2)
	const [ballPosY, setballPosY] = useState(height / 2)
	const [ballRayon, setballRayon] = useState(5)
	const [ballSpeedX, setballSpeedX] = useState(2)
	const [ballSpeedY, setballSpeedY] = useState(1)

	const [error, setError] = useState<string | null>(null)

	const [partie, setPartie] = useState<any>(null)
	const [endDraw, setEndDraw] = useState(false)

	const gameId = Number(useParams().id) || 0

	const [myPlayerId, setmyPlayerId] = useState<any>(0)

	async function errorTesting() {
	fetch(process.env.REACT_APP_BACKENDAPI + "/api/ping")
		.then((response) => {
			//console.log("response", response)
			if (response.ok) {
				return response.json();
			}
			setError("Le serveur est indisponible.");
			throw new Error('Something went wrong');
		})
		.catch((error) => {
			setError("Le serveur est indisponible.");
		});
	}

	useEffect(() => {
		errorTesting()
	}, []);

	// *■*■*■*■*■*■*■*■*■*■*■*■*■*■*■*■*■*■		INIT
	useEffect(() => {
		window.addEventListener('load', () => {
			resizeCanvas();
		});
		window.addEventListener('resize', resizeCanvas);

		resizeCanvas();

		getInitialGameQueuess()
		function getInitialGameQueuess() {
			//// //console.log("getInitialQueues")
			fetch(process.env.REACT_APP_BACKENDAPI + "/game/parties/" + gameId)
				.then((res) => res.json())
				.then((data) => {
					//console.log(data)
					setPartie(data)
					if (data.score1)
						setScore1(data.score1)
					if (data.score2)
						setScore2(data.score2)
					//console.log(data.score1, data.score2)
					if (data.user1Id === auth.id) {
						setmyPlayerId(1)
					} else if (data.user2Id === auth.id) {
						setmyPlayerId(2)
					}
				})
		}
	}, [socketIsConnected])

	const setEndGame = async (newScore1: number, newScore2: number) => {
		const response = await fetch(process.env.REACT_APP_BACKENDAPI + "/game/parties/endGame", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Accept: "application/json",
			},
			body: JSON.stringify({ gameId: partie.id, score1: newScore1, score2: newScore2 }),
		})

		if (response.status == 200 || response.status == 201)
		{
			const data = await response.json()
		}
	}

	// *■*■*■*■*■*■*■*■*■*■*■*■*■*■*■*■*■*■		ANIMATION

	const autoControl = (deltaTime: number) => {
		if (myPlayerId == 1)
		{
			if (ballPosX < width / 2  && ballSpeedX < 0)
			{
				if (ballPosY - positionPad1 < 0)
				{
					let newY = positionPad1 - 4 * deltaTime
					if (newY < 0) newY = 0
					sendMyInGameData({ userId: auth.id, py: newY })
					setpositionPad1(newY)
				} else if (ballPosY - (positionPad1 + Pad1Height) > 0)
				{
					let newY = positionPad1 + 4 * deltaTime
					if (newY < 0) newY = 0
					sendMyInGameData({ userId: auth.id, py: newY })
					setpositionPad1(newY)
				}
			}
		} else {
			if (ballPosX > width / 2  && ballSpeedX > 0)
			{
				if (ballPosY - positionPad2 < 0)
				{
					let newY = positionPad2 - 4 * deltaTime
					if (newY < 0) newY = 0
					sendMyInGameData({ userId: auth.id, py: newY })
					setpositionPad2(newY)
				} else if (ballPosY - (positionPad2 + Pad2Height) > 0)
				{
					let newY = positionPad2 + 4 * deltaTime
					if (newY < 0) newY = 0
					sendMyInGameData({ userId: auth.id, py: newY })
					setpositionPad2(newY)
				}
			}
		}
	}

	const frame = () => {

		if (!partie || partie.ended || error)
			return

		let timeNow = micro.now()
		let deltaTime = (timeNow - lastTick) / 4000
		let newDeltaAutoUpdate = deltaAutoUpdate + timeNow - lastTick
		setDeltaAutoUpdate(newDeltaAutoUpdate)
		setLastTick(timeNow)

		let updateRequired = false

		if (deltaAutoUpdate > (1000000 / 4))
		{
			updateRequired = true
			setDeltaAutoUpdate(0)
			errorTesting()
		}

		if (deltaTime > 100 || deltaTime <= 0)
			return ;

		let deltaBallSpeedX = ballSpeedX * deltaTime
		let deltaBallSpeedY = ballSpeedY * deltaTime

		let newBallPosX = ballPosX + deltaBallSpeedX
		let newBallPosY = ballPosY + deltaBallSpeedY

		let newBallSpeedX = ballSpeedX
		let newBallSpeedY = ballSpeedY


		let newScore1 = score1
		let newScore2 = score2

		if (newBallPosX < ballRayon + padOffset - 10 + padWidth && (newBallPosY > positionPad1 - ballRayon && newBallPosY < positionPad1 + ballRayon + Pad1Height))
		{
			newBallPosX = padOffset - 10 + padWidth + ballRayon + 1
			newBallSpeedX *= -1

			let newDir = (newBallPosY - (positionPad1 + Pad1Height / 2)) / (Pad1Height / 2)
			newBallSpeedY = newDir * 1
			newBallSpeedX = (newBallSpeedX / Math.abs(newBallSpeedX)) * Math.sqrt(3 - newBallSpeedY * newBallSpeedY)

			updateRequired = true
		}

		if (newBallPosX > width - (ballRayon + padOffset - 10 + padWidth) && (newBallPosY > positionPad2 - ballRayon && newBallPosY < positionPad2 + ballRayon + Pad1Height))
		{
			newBallPosX = width - (ballRayon + padOffset - 10 + padWidth) + 1
			newBallSpeedX *= -1

			let newDir = (newBallPosY - (positionPad2 + Pad2Height / 2)) / (Pad2Height / 2)
			newBallSpeedY = newDir * 1
			newBallSpeedX = (newBallSpeedX / Math.abs(newBallSpeedX)) * Math.sqrt(3 - newBallSpeedY * newBallSpeedY)

			updateRequired = true
		}

		if (newBallPosX < ballRayon) {
			newBallPosX = width / 2
			newBallPosY = height / 2
			if (ballSpeedX < 0)
				newBallSpeedX = -ballSpeedX
			updateRequired = true

			newBallSpeedY = Math.sin(43 * (score1 + score2)) * 1
			newBallSpeedX = (newBallSpeedX / Math.abs(newBallSpeedX)) * Math.sqrt(3 - newBallSpeedY * newBallSpeedY)

			if (myPlayerId == 1)
				newScore2 ++

		} else if (newBallPosX > width - ballRayon) {
			newBallPosX = width / 2
			newBallPosY = height / 2
			if (ballSpeedX > 0)
				newBallSpeedX = -ballSpeedX
			updateRequired = true

			newBallSpeedY = Math.sin(43 * (score1 + score2)) * 1
			newBallSpeedX = (newBallSpeedX / Math.abs(newBallSpeedX)) * Math.sqrt(3 - newBallSpeedY * newBallSpeedY)

			if (myPlayerId == 1)
				newScore1 ++
		}

		if (newBallPosY < ballRayon) {
			newBallPosY = ballRayon + 5
			if (ballSpeedY < 0)
				newBallSpeedY = -ballSpeedY

			updateRequired = true
		} else if (newBallPosY > height - ballRayon) {
			newBallPosY = height - ballRayon - 5
			if (ballSpeedY > 0)
				newBallSpeedY = -ballSpeedY

			updateRequired = true
		}

		if (updateRequired == true && myPlayerId == 1)
		{
			sendMyInGameData({
				userId: auth.id,
				score1: newScore1,
				score2: newScore2,
				ball: { x: newBallPosX, y: newBallPosY, speedX: newBallSpeedX, speedY: newBallSpeedY },
			})
		}

		setballPosX(newBallPosX)
		setballPosY(newBallPosY)
		setballSpeedX(newBallSpeedX)
		setballSpeedY(newBallSpeedY)
		setScore1(newScore1)
		setScore2(newScore2)

		if (autoControlPad == 1)
			autoControl(deltaTime)

		if (newScore1 > 9 || newScore2 > 9)
		{
			//console.log(newScore1, newScore2);
			let data = partie;

			data.ended = true;
			data.score1 = newScore1
			data.score2 = newScore2
			setPartie(data)
			if (myPlayerId == 1)
				setEndGame(newScore1, newScore2)
		}
	}

	useEffect(() => {

		const canvas = canvasRef.current
		if (!canvas)
			return ;
		const context = canvas.getContext('2d')
		let frameCount = 0
		let animationFrameId = 0

		const render = () => {
			frameCount++
			frame()
			draw()
			animationFrameId = window.requestAnimationFrame(render)
		}
		render()

		return () => {
			window.cancelAnimationFrame(animationFrameId)
		}
	}, [draw, ballPosX, ballPosY, score1, score2])

	// *■*■*■*■*■*■*■*■*■*■*■*■*■*■*■*■*■*■		SOCKET

	useEffect(() => {
		if (!socketIsConnected) return

		subscribeToQueueInGame((err: any, received: any) => {
			QueueSubscritpion(received)
		})
		return () => {
			// //console.log("PageChatV2 - useEffect return - disconnectSocket")
			///disconnectSocket()
		}

		function QueueSubscritpion(received: any) {
			// //console.log("QueueSubscritpion - A", received)
			if (received?.userId === auth.id) return
			// //console.log("QueueSubscritpion - B")

			if (received?.py) {
				if (myPlayerId === 1) {
					// //console.log("QueueSubscritpion - C - Move Raket 2", received.py)
					setpositionPad2(received.py)
				} else if (myPlayerId === 2) {
					// //console.log("QueueSubscritpion - C - Move Raket 1", received.py)
					setpositionPad1(received.py)
				}
			}

			if (received?.score1)
			{
				/*if (received.score1 < score1)
				{
					sendMyInGameData({ userId: auth.id, score1: score1 + 1, score2: score2 })
					setScore1(score1 + 1)
				}
				else*/
					setScore1(received.score1)
			}
			if (received?.score2)
			{
				/*if (received.score2 < score2)
				{
					sendMyInGameData({ userId: auth.id, score1: score1, score2: score2 + 1 })
					setScore2(score2 + 1)
				}
				else*/
					setScore2(received.score2)
			}

			if (received?.ball && myPlayerId == 2) {
				setballPosX(received.ball.x)
				setballPosY(received.ball.y)
				setballSpeedX(received.ball.speedX)
				setballSpeedY(received.ball.speedY)
			}
		}
	}, [socketIsConnected, myPlayerId]) // ! si je rajoutes [] aux dependances, ca fait des doubles dans les loos du serveurs

	// *■*■*■*■*■*■*■*■*■*■*■*■*■*■*■*■*■*■		SET CONTEXT

	useEffect(() => {
		const context = canvasRef.current?.getContext("2d")
		setCtx(context)
	}, [setCtx])

	// *■*■*■*■*■*■*■*■*■*■*■*■*■*■*■*■*■*■		DRAWING

	function draw() {
		if (ctx && !error) {
			if (!partie) {
				ctx.fillStyle = "#111111"
				ctx.fillRect(0, 0, width, height)

				ctx.fillStyle = "white";
				ctx.font = "50px customFont1";

				ctx.textAlign = "center";
				ctx.fillText("Loading...", width / 2, height / 2 + 20);

				ctx.fillRect(0, 0, 5, height)
				ctx.fillRect(width - 5, 0, 5, height)

			} else if (partie.ended == true)
			{
				/*if (endDraw == false)
					setEndDraw(true)
				else
					return ;*/
				ctx.fillStyle = "#111111"
				ctx.fillRect(0, 0, width, height)

				ctx.fillStyle = "white";
				ctx.font = "40px customFont1";

				ctx.textAlign = "center";
				ctx.fillText("Game ended", width / 2, height / 2 - 20);
				ctx.font = "60px PongScore";
				ctx.fillText(partie.score1.toString() + "   " + partie.score2.toString(), width / 2, height / 2 + 80);

				ctx.fillRect(0, 0, 5, height)
				ctx.fillRect(width - 5, 0, 5, height)
			}
			else {
				// * Fond :
				ctx.fillStyle = "#111111"
				ctx.fillRect(0, 0, width, height)

				ctx.fillStyle = "white";
				ctx.font = "60px PongScore";

				ctx.textAlign = "right";
				ctx.fillText(score1.toString(), width / 2 - 20, 100);

				ctx.textAlign = "left";
				ctx.fillText(score2.toString(), width / 2 + 20, 100);

				// * Raquette Player 1:
				ctx.fillStyle = "#EEEEEE"
				ctx.fillRect(padOffset, positionPad1, padWidth, Pad1Height)
				// * Raquette Player 2:
				ctx.fillRect(width - padOffset - padWidth, positionPad2, padWidth, Pad2Height)

				ctx.fillStyle = "#666666"
				ctx.fillRect(ballPosX - ballRayon / 2 - ballSpeedX * 6, ballPosY - ballRayon / 2 - ballSpeedY * 6, ballRayon, ballRayon)

				ctx.fillStyle = "#999999"
				ctx.fillRect(ballPosX - ballRayon * 0.75 - ballSpeedX * 3, ballPosY - ballRayon * 0.75 - ballSpeedY * 3, ballRayon * 1.5, ballRayon * 1.5)

				ctx.fillStyle = "#EEEEEE"
				ctx.fillRect(ballPosX - ballRayon, ballPosY - ballRayon, ballRayon * 2, ballRayon * 2)

				ctx.fillRect(0, 0, 5, height)
				ctx.fillRect(width - 5, 0, 5, height)

				for (let i = 0; i <= 30; i ++)
				{
					ctx.fillRect(width / 2, ((height - 40) / 30) * i + 17, 5, 5)
				}
			}
		}
	}

	// *■*■*■*■*■*■*■*■*■*■*■*■*■*■*■*■*■*■		KEY HANDLER
	const keyHandler = useCallback(
		(e: any) => {
			const key = e.key
			const keycode = e.keyCode
			if (keycode === 122) {
				//Z
				if (myPlayerId === 1) {
					let newY = positionPad1 - 10
					if (newY < 0) newY = 0
					sendMyInGameData({ userId: auth.id, py: newY })
					setpositionPad1(newY)
				} else if (myPlayerId === 2) {
					let newY = positionPad2 - 10
					if (newY < 0) newY = 0
					sendMyInGameData({ userId: auth.id, py: newY })
					setpositionPad2(newY)
				}
			} else if (keycode === 115) {
				//Z

				if (myPlayerId === 1) {
					let newY = positionPad1 + 10
					if (newY + Pad1Height > height) newY = height - Pad1Height
					sendMyInGameData({ userId: auth.id, py: newY })
					setpositionPad1(newY)
				} else if (myPlayerId === 2) {
					let newY = positionPad2 + 10
					if (newY + Pad2Height > height) newY = height - Pad2Height
					sendMyInGameData({ userId: auth.id, py: newY })
					setpositionPad2(newY)
				}
			} else if (keycode == 111) {
				setAutoControlPad(autoControlPad == 1 ? 0 : 1)
			} else {
				//console.log(keycode)
			}
		},
		[positionPad1, myPlayerId, positionPad2, Pad1Height, height, auth.id, autoControlPad]
	)

	useEffect(() => {
		document.addEventListener("keypress", keyHandler)
		return () => {
			document.removeEventListener("keypress", keyHandler)
		}
	}, [keyHandler])

	// setballPosX(ballPosX + 1)

	function resizeCanvas() {
		//console.log("resizeCanvas")
		if (!canvasRef.current) return

		const canvasWidth = window.innerWidth;
		const canvasHeight = window.innerHeight - 120;

		const scaleX = canvasWidth / width;
		const scaleY = canvasHeight / height;

		const scale = Math.min(scaleX, scaleY);

		canvasRef.current.style.width = `${width * scale}px`;
		canvasRef.current.style.height = `${height * scale}px`;

		//console.log(canvasWidth, canvasHeight, scale)

		//canvasRef.current.style.marginLeft = `${(canvasWidth - canvasRef.current.width) / 2}px`;
	}

	return (
		<StyledZPage documentTitle="Game/Play">
			{error && (
				<div className="text-danger errorText">
					<h5>Error:</h5>
					{error}
				</div>
			)}
			{!error && <>
			<div className="separateurGame"></div>
			<CanvasContext.Provider value={ctx}>
				<canvas ref={canvasRef} width={width} height={height} />
				{/* {ctx && <Grid width={width} height={height} positionPad1={positionPad1} />} */}
			</CanvasContext.Provider>
			<div className="separateurGame" ></div>
			<div className="gameNumber">
				Partie n°{gameId}
			</div>
			{partie && (
				<div className="gameHeader">
					<span className="col-6">
						<b>{partie.user1Name}{myPlayerId === 1 && " (moi)"}  vs  {partie.user2Name}{myPlayerId === 2 && " (moi)"}</b>
					</span>

					{/* <p>"frameTime": {frameTime}</p> */}
				</div>
			)}
			<div className="gameInfo">
				<p>Utilisez Z et S pour bouger votre raquette.<br/>Appuyez sur O pour activer le mouvement automatique.</p>
			</div></>}
		</StyledZPage>
	)
}

// 〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓	STYLED_COMPONENTS

const StyledZPage = styled(ZPage)`
	background-color: #111111 !important;
	text-align: center;
	min-height: calc(100vh - 80px);
`
