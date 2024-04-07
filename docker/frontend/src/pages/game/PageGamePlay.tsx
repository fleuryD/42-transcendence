// ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
import React, { useCallback, useEffect, useRef, useState } from "react"

// import styled from "styled-components"

import CanvasContext from "features/game/canvasContext"
import ZPage from "ui/ZPage"
import { FaGamepad } from "react-icons/fa"
import { useAppSelector } from "store/store"

import micro from "microseconds"
import styled from "styled-components"

import {
	subscribeToQueueInGame,
	subscribeToPingInGame,
	sendMyInGameData,
	pingUser,
	sendNavigate,
} from "utils/socketio.service"
import { useParams } from "react-router-dom"

import "./PageGamePlay.scss"
import GamePlayCanvas from "./GamePlayCanvas"

import SvgTheme from "features/game/svgTheme"
import SvgTheme_shadow from "features/game/svgTheme_shadow"

// ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■

// * https://levelup.gitconnected.com/rpg-game-with-react-redux-html5-part-1-build-a-tile-map-9144fd867830

export default function PageGamePlay() {
	const width = 1000
	const height = 600

	const padOffset = 20
	const padWidth = 15

	const [deltaAutoUpdate, setDeltaAutoUpdate] = useState(0)

	const [scale, setScale] = useState(1)
	const [pingTime, setPingTime] = useState(micro.now())
	const [waitingUser, setWaitingUser] = useState(false)

	const { socketIsConnected } = useAppSelector((state) => state.app)
	const auth = useAppSelector((state) => state.auth)
	let theme = 0

	const [themeBall, setThemeBall] = useState(1)
	const [themePad1, setThemePad1] = useState(1)
	const [themePad2, setThemePad2] = useState(1)

	const canvasRef = useRef<HTMLCanvasElement | null>(null)
	const [ctx, setCtx] = useState<CanvasRenderingContext2D | null | undefined>(null)

	const [lastTick, setLastTick] = useState(micro.now())

	const [padHeight, setpadHeight] = useState(100)

	const [positionPad1, setpositionPad1] = useState(height / 2 - padHeight)
	const [positionPad2, setpositionPad2] = useState(height / 2 - padHeight)
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
				if (response.ok) {
					return response.json()
				}
				setError("Le serveur est indisponible.")
				throw new Error("Something went wrong")
			})
			.catch((error) => {
				setError("Le serveur est indisponible.")
			})
	}

	let firstLoading = true

	useEffect(() => {
		sendNavigate("PageGamePlay", gameId)
	}, [])

	// *■*■*■*■*■*■*■*■*■*■*■*■*■*■*■*■*■*■		INIT
	useEffect(() => {
		resizeSvg()
		getInitialGameQueuess()
		errorTesting()

		function getInitialGameQueuess() {
			//// //console.log("getInitialQueues")
			fetch(process.env.REACT_APP_BACKENDAPI + "/game/parties/" + gameId)
				.then((res) => res.json())
				.then((data) => {
					setPartie(data)
					if (data.score1) setScore1(data.score1)
					if (data.score2) setScore2(data.score2)
					if (data.user1Id === auth.id) {
						setmyPlayerId(1)
					} else if (data.user2Id === auth.id) {
						setmyPlayerId(2)
					}

					fetch(process.env.REACT_APP_BACKENDAPI + "/api/me", {
						method: "POST",
						headers: {
							"Content-Type": "application/json",
							Accept: "application/json",
						},
						body: JSON.stringify({ jwt: localStorage.getItem("jwt") }),
					})
						.then((res) => res.json())
						.then((data) => {
							//console.log("base data", data)
							if (data.user1Id === auth.id) setThemePad1(data.user.pongTheme ? data.user.pongTheme : 1)
							else if (data.user2Id === auth.id)
								setThemePad2(data.user.pongTheme ? data.user.pongTheme : 1)
							if (data.user1Id === auth.id) setThemeBall(data.user.ballTheme ? data.user.ballTheme : 1)
							else setThemeBall(1)
						})
				})
		}
	}, [socketIsConnected, setThemePad1, setThemePad2, setThemeBall])

	const setEndGame = async (newScore1: number, newScore2: number) => {
		const response = await fetch(process.env.REACT_APP_BACKENDAPI + "/game/parties/endGame", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Accept: "application/json",
			},
			body: JSON.stringify({ gameId: partie.id, score1: newScore1, score2: newScore2 }),
		})

		if (response.status == 200 || response.status == 201) {
			const data = await response.json()
		}
	}

	// *■*■*■*■*■*■*■*■*■*■*■*■*■*■*■*■*■*■		ANIMATION

	const autoControl = (deltaTime: number) => {
		if (myPlayerId == 1) {
			if (ballPosX < width / 2 && ballSpeedX < 0) {
				if (ballPosY - positionPad1 < 20) {
					let newY = positionPad1 - 4 * deltaTime / 2
					if (newY < 0) newY = 0
					sendMyInGameData({ partieId: partie.id, userId: auth.id, py1: newY })
					setpositionPad1(newY)
				} else if (ballPosY - (positionPad1 + padHeight) > -20) {
					let newY = positionPad1 + 4 * deltaTime / 2
					if (newY < 0) newY = 0
					sendMyInGameData({ partieId: partie.id, userId: auth.id, py1: newY })
					setpositionPad1(newY)
				}
			}
		} else if (myPlayerId == 2) {
			if (ballPosX > width / 2 && ballSpeedX > 0) {
				if (ballPosY - positionPad2 < 20) {
					let newY = positionPad2 - 4 * deltaTime / 2
					if (newY < 0) newY = 0
					sendMyInGameData({ partieId: partie.id, userId: auth.id, py2: newY })
					setpositionPad2(newY)
				} else if (ballPosY - (positionPad2 + padHeight) > -20) {
					let newY = positionPad2 + 4 * deltaTime / 2
					if (newY < 0) newY = 0
					sendMyInGameData({ partieId: partie.id, userId: auth.id, py2: newY })
					setpositionPad2(newY)
				}
			}
		}
	}

	const frame = () => {
		if (!partie || partie.ended || error) return

		let timeNow = micro.now()
		let deltaTime = (timeNow - lastTick) / 4000
		let newDeltaAutoUpdate = deltaAutoUpdate + timeNow - lastTick
		setDeltaAutoUpdate(newDeltaAutoUpdate)
		setLastTick(timeNow)

		let updateRequired = false

		if (deltaAutoUpdate > 1000000 / 2) {
			if (myPlayerId != 0) {
				updateRequired = true
				pingUser({ userId: auth.id == partie.user1Id ? partie.user2Id : partie.user1Id, partieId: gameId })

				if (myPlayerId == 1)
					sendMyInGameData({
						partieId: partie.id,
						userId: auth.id,
						themePad1: themePad1,
						themeBall: themeBall,
					})
				else sendMyInGameData({ partieId: partie.id, userId: auth.id, themePad2: themePad2 })

				if (timeNow - pingTime > 1000000 * 2) setWaitingUser(true)
				else setWaitingUser(false)
			}
			setDeltaAutoUpdate(0)
			errorTesting()
		}

		if (waitingUser) return

		if (deltaTime > 100 || deltaTime <= 0) return

		let deltaBallSpeedX = ballSpeedX * deltaTime
		let deltaBallSpeedY = ballSpeedY * deltaTime

		let newBallPosX = ballPosX + deltaBallSpeedX
		let newBallPosY = ballPosY + deltaBallSpeedY

		let newBallSpeedX = ballSpeedX
		let newBallSpeedY = ballSpeedY

		let newScore1 = score1
		let newScore2 = score2

		if (
			newBallPosX < ballRayon + padOffset - 10 + padWidth &&
			newBallPosY > positionPad1 - ballRayon &&
			newBallPosY < positionPad1 + ballRayon + padHeight
		) {
			newBallPosX = padOffset - 10 + padWidth + ballRayon + 1
			newBallSpeedX *= -1

			let newDir = (newBallPosY - (positionPad1 + padHeight / 2)) / (padHeight / 2)
			newBallSpeedY = newDir * 1
			newBallSpeedX = (newBallSpeedX / Math.abs(newBallSpeedX)) * Math.sqrt(3 - newBallSpeedY * newBallSpeedY)

			updateRequired = true
		}

		if (
			newBallPosX > width - (ballRayon + padOffset - 10 + padWidth) &&
			newBallPosY > positionPad2 - ballRayon &&
			newBallPosY < positionPad2 + ballRayon + padHeight
		) {
			newBallPosX = width - (ballRayon + padOffset - 10 + padWidth) + 1
			newBallSpeedX *= -1

			let newDir = (newBallPosY - (positionPad2 + padHeight / 2)) / (padHeight / 2)
			newBallSpeedY = newDir * 1
			newBallSpeedX = (newBallSpeedX / Math.abs(newBallSpeedX)) * Math.sqrt(3 - newBallSpeedY * newBallSpeedY)

			updateRequired = true
		}

		if (newBallPosX < ballRayon) {
			newBallPosX = width / 2
			newBallPosY = height / 2
			if (ballSpeedX < 0) newBallSpeedX = -ballSpeedX
			updateRequired = true

			newBallSpeedY = Math.sin(43 * (score1 + score2)) * 1
			newBallSpeedX = (newBallSpeedX / Math.abs(newBallSpeedX)) * Math.sqrt(3 - newBallSpeedY * newBallSpeedY)

			if (myPlayerId == 1) newScore2++
		} else if (newBallPosX > width - ballRayon) {
			newBallPosX = width / 2
			newBallPosY = height / 2
			if (ballSpeedX > 0) newBallSpeedX = -ballSpeedX
			updateRequired = true

			newBallSpeedY = Math.sin(43 * (score1 + score2)) * 1
			newBallSpeedX = (newBallSpeedX / Math.abs(newBallSpeedX)) * Math.sqrt(3 - newBallSpeedY * newBallSpeedY)

			if (myPlayerId == 1) newScore1++
		}

		if (newBallPosY < ballRayon) {
			newBallPosY = ballRayon + 5
			if (ballSpeedY < 0) newBallSpeedY = -ballSpeedY

			updateRequired = true
		} else if (newBallPosY > height - ballRayon) {
			newBallPosY = height - ballRayon - 5
			if (ballSpeedY > 0) newBallSpeedY = -ballSpeedY

			updateRequired = true
		}

		if (updateRequired == true && myPlayerId == 1) {
			sendMyInGameData({
				partieId: partie.id,
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

		if (autoControlPad == 1 && myPlayerId != 0) autoControl(deltaTime)

		if ((newScore1 > 9 || newScore2 > 9) && myPlayerId != 0) {
			let data = partie

			data.ended = true
			data.score1 = newScore1
			data.score2 = newScore2
			setPartie(data)
			if (myPlayerId == 1) setEndGame(newScore1, newScore2)
		}
	}

	useEffect(() => {
		//	const canvas = canvasRef.current
		//	if (!canvas) return
		//	const context = canvas.getContext("2d")
		let frameCount = 0
		let animationFrameId = 0

		const render = () => {
			frameCount++
			frame()
			//draw()
			animationFrameId = window.requestAnimationFrame(render)
		}
		animationFrameId = window.requestAnimationFrame(render)

		return () => {
			window.cancelAnimationFrame(animationFrameId)
		}
	}, [frame])

	// *■*■*■*■*■*■*■*■*■*■*■*■*■*■*■*■*■*■		SOCKET

	useEffect(() => {
		if (!socketIsConnected) return

		subscribeToQueueInGame((err: any, received: any) => {
			QueueSubscritpion(received)
		}, gameId)

		subscribeToPingInGame((err: any, received: any) => {
			PingSubscription(received)
		})

		return () => {
			// //console.log("PageChatV2 - useEffect return - disconnectSocket")
			///disconnectSocket()
		}

		function PingSubscription(received: any) {
			if (!received) return
			if (received?.userId != auth.id) return
			if (received?.partieId != gameId) return
			setPingTime(micro.now())
		}

		function QueueSubscritpion(received: any) {
			// //console.log("QueueSubscritpion - A", received)
			if (received?.userId === auth.id) return
			// //console.log("QueueSubscritpion - B")

			if (received?.py1) setpositionPad1(received.py1)
			if (received?.py2) setpositionPad2(received.py2)

			if (received?.score1) {
				if (received.score1 < score1 && myPlayerId == 2) {
					sendMyInGameData({ partieId: partie.id, userId: auth.id, score1: score1 + 1, score2: score2 })
					setScore1(score1 + 1)
				} else setScore1(received.score1)
			}
			if (received?.score2) {
				if (received.score2 < score2 && myPlayerId == 2) {
					sendMyInGameData({ partieId: partie.id, userId: auth.id, score1: score1, score2: score2 + 1 })
					setScore2(score2 + 1)
				} else setScore2(received.score2)
			}

			if (received?.ball && myPlayerId != 1) {
				setballPosX(received.ball.x)
				setballPosY(received.ball.y)
				setballSpeedX(received.ball.speedX)
				setballSpeedY(received.ball.speedY)
			}

			if (received?.themePad1 && myPlayerId != 1) {
				setThemePad1(received.themePad1)
			}

			if (received?.themePad2 && myPlayerId != 2) {
				setThemePad2(received.themePad2)
			}

			if (received?.themeBall && myPlayerId != 1) {
				setThemeBall(received.themeBall)
			}
		}
	}, [socketIsConnected, myPlayerId]) // ! si je rajoutes [] aux dependances, ca fait des doubles dans les loos du serveurs

	// *■*■*■*■*■*■*■*■*■*■*■*■*■*■*■*■*■*■		SET CONTEXT

	useEffect(() => {
		const context = canvasRef.current?.getContext("2d")
		setCtx(context)
	}, [setCtx])

	// *■*■*■*■*■*■*■*■*■*■*■*■*■*■*■*■*■*■		DRAWING

	/*
	function draw() {
		if (ctx && !error) {
			if (!partie) {
				ctx.fillStyle = "#111111"
				ctx.fillRect(0, 0, width, height)

				ctx.fillStyle = "white"
				ctx.font = "50px customFont1"

				ctx.textAlign = "center"
				ctx.fillText("Loading...", width / 2, height / 2 + 20)

				ctx.fillRect(0, 0, 5, height)
				ctx.fillRect(width - 5, 0, 5, height)
			} else if (partie.ended == true) {
				/*if (endDraw == false)
					setEndDraw(true)
				else
					return ;* /
				ctx.fillStyle = "#111111"
				ctx.fillRect(0, 0, width, height)

				ctx.fillStyle = "white"
				ctx.font = "40px customFont1"

				ctx.textAlign = "center"
				ctx.fillText("Game ended", width / 2, height / 2 - 20)
				ctx.font = "60px PongScore"
				ctx.fillText(partie.score1.toString() + "   " + partie.score2.toString(), width / 2, height / 2 + 80)

				ctx.fillRect(0, 0, 5, height)
				ctx.fillRect(width - 5, 0, 5, height)
			} else {
				// * Fond :
				ctx.fillStyle = "#111111"
				ctx.fillRect(0, 0, width, height)

				ctx.fillStyle = "white"
				ctx.font = "60px PongScore"

				ctx.textAlign = "right"
				ctx.fillText(score1.toString(), width / 2 - 20, 100)

				ctx.textAlign = "left"
				ctx.fillText(score2.toString(), width / 2 + 20, 100)

				// * Raquette Player 1:
				ctx.fillStyle = "#EEEEEE"
				ctx.fillRect(padOffset, positionPad1, padWidth, padHeight)
				// * Raquette Player 2:
				ctx.fillRect(width - padOffset - padWidth, positionPad2, padWidth, padHeight)

				ctx.fillStyle = "#666666"
				ctx.fillRect(
					ballPosX - ballRayon / 2 - ballSpeedX * 6,
					ballPosY - ballRayon / 2 - ballSpeedY * 6,
					ballRayon,
					ballRayon
				)

				ctx.fillStyle = "#999999"
				ctx.fillRect(
					ballPosX - ballRayon * 0.75 - ballSpeedX * 3,
					ballPosY - ballRayon * 0.75 - ballSpeedY * 3,
					ballRayon * 1.5,
					ballRayon * 1.5
				)

				ctx.fillStyle = "#EEEEEE"
				ctx.fillRect(ballPosX - ballRayon, ballPosY - ballRayon, ballRayon * 2, ballRayon * 2)

				ctx.fillRect(0, 0, 5, height)
				ctx.fillRect(width - 5, 0, 5, height)

				for (let i = 0; i <= 30; i++) {
					ctx.fillRect(width / 2, ((height - 40) / 30) * i + 17, 5, 5)
				}
			}
		}
	}
	*/

	// *■*■*■*■*■*■*■*■*■*■*■*■*■*■*■*■*■*■		KEY HANDLER
	const keyHandler = useCallback(
		(e: any) => {
			const key = e.key
			const keycode = e.keyCode

			if (partie?.ended || waitingUser == true) return

			if (keycode === 122) {
				//Z
				if (myPlayerId === 1) {
					let newY = positionPad1 - 10
					if (newY < 0) newY = 0
					sendMyInGameData({ partieId: partie.id, userId: auth.id, py1: newY })
					setpositionPad1(newY)
				} else if (myPlayerId === 2) {
					let newY = positionPad2 - 10
					if (newY < 0) newY = 0
					sendMyInGameData({ partieId: partie.id, userId: auth.id, py2: newY })
					setpositionPad2(newY)
				}
			} else if (keycode === 115) {
				//Z

				if (myPlayerId === 1) {
					let newY = positionPad1 + 10
					if (newY + padHeight > height) newY = height - padHeight
					sendMyInGameData({ partieId: partie.id, userId: auth.id, py1: newY })
					setpositionPad1(newY)
				} else if (myPlayerId === 2) {
					let newY = positionPad2 + 10
					if (newY + padHeight > height) newY = height - padHeight
					sendMyInGameData({ partieId: partie.id, userId: auth.id, py2: newY })
					setpositionPad2(newY)
				}
			} else if (keycode == 111) {
				setAutoControlPad(autoControlPad == 1 ? 0 : 1)
			} else if (keycode == 112 && myPlayerId != 0) {
				//console.log("change theme pad")

				let newTheme = myPlayerId == 1 ? themePad1 + 1 : themePad2 + 1
				if (newTheme > 7)
					newTheme = 1

				if (myPlayerId == 1) setThemePad1(Number(newTheme))
				else setThemePad2(Number(newTheme))

				if (myPlayerId == 1) sendMyInGameData({ partieId: partie.id, userId: auth.id, themePad1: newTheme })
				else sendMyInGameData({ partieId: partie.id, userId: auth.id, themePad2: newTheme })

				fetch(process.env.REACT_APP_BACKENDAPI + "/api/setPongTheme", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						Accept: "application/json",
					},
					body: JSON.stringify({ jwt: localStorage.getItem("jwt"), pongTheme: newTheme }),
				})
					.then((response) => {
						if (response.ok) {
							return response.json()
						}
						setError("Le serveur est indisponible.")
						throw new Error("Something went wrong")
					})
					.catch((error) => {
						setError("Le serveur est indisponible.")
					})
			} else {
				//console.log("keycode", keycode)
			}
		},
		[
			positionPad1,
			myPlayerId,
			positionPad2,
			padHeight,
			height,
			auth.id,
			autoControlPad,
			setThemePad1,
			setThemePad2,
			themePad1,
			themePad2,
		]
	)

	useEffect(() => {
		document.addEventListener("keypress", keyHandler)
		return () => {
			document.removeEventListener("keypress", keyHandler)
		}
	}, [keyHandler])

	// setballPosX(ballPosX + 1)

	async function resizeSvg() {
		//console.log("resizeSvg")

		const canvasWidth = window.innerWidth - 50
		const canvasHeight = window.innerHeight - 120

		const scaleX = canvasWidth / width
		const scaleY = canvasHeight / height

		const scale = Math.min(scaleX, scaleY)

		setScale(scale)

		document.getElementById("aliens-go-home-canvas")?.setAttribute("width", `${width * scale}px`)
		document.getElementById("aliens-go-home-canvas")?.setAttribute("height", `${height * scale}px`)

		//canvasRef.current.style.marginLeft = `${(canvasWidth - canvasRef.current.width) / 2}px`;
	}

	useEffect(() => {
		window.addEventListener("resize", resizeSvg)
	}, [])

	return (
		<StyledZPage documentTitle="Game/Play">
			{error && (
				<div className="text-danger errorText">
					<h5>Error:</h5>
					{error}
				</div>
			)}
			{!error && (
				<>
					<div className="separateurGame"></div>
					<SvgTheme
						themePad1={themePad1}
						themePad2={themePad2}
						themeBall={themeBall}
						ballPosX={ballPosX}
						ballPosY={ballPosY}
						ballRayon={ballRayon}
						padOffset={padOffset}
						padWidth={padWidth}
						padHeight={padHeight}
						positionPad1={positionPad1}
						positionPad2={positionPad2}
						width={width}
						height={height}
						scale={scale}
						score1={score1}
						score2={score2}
						partie={partie}
						waitingUser={waitingUser}
					/>

					{/*
					<GamePlayCanvas ctx={ctx} canvasRef={canvasRef} width={1} height={1} />
					*/}
					{/*
					<CanvasContext.Provider value={ctx}>
						<canvas ref={canvasRef} width={width} height={height} />
						{ / * {ctx && <Grid width={width} height={height} positionPad1={positionPad1} />} * /}
					</CanvasContext.Provider>
					*/}
					<div className="separateurGame"></div>
					<div className="gameNumber">Partie #{gameId} {myPlayerId == 0 && <>Spectator Mode</>}</div>

					{partie && (
						<div className="gameHeader">
							<span className="col-6">
								<b>
									{myPlayerId === 1 ? "(moi)" : partie.user1Name} vs{" "}
									{myPlayerId === 2 ? " (moi)" : partie.user2Name}
								</b>
							</span>

							{/* <p>"frameTime": {frameTime}</p> */}
						</div>
					)}
					<div className="gameInfo">
						<p>
							Z: Up, S: Down, O: mouvement auto, {" "}
							{myPlayerId != 0 ? "P: changer de theme de pad" : ""}
						</p>
					</div>
				</>
			)}
		</StyledZPage>
	)
}

// 〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓	STYLED_COMPONENTS

const StyledZPage = styled(ZPage)`
	background-color: #111111 !important;
	text-align: center;
	min-height: calc(100vh - 80px);
`
