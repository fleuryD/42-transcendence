// ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
import React, { useCallback, useEffect, useRef, useState } from "react"

// import styled from "styled-components"

import CanvasContext from "features/game/canvasContext"
import ZPage from "ui/ZPage"
import { FaGamepad } from "react-icons/fa"
import { useAppSelector } from "store/store"

import { subscribeToQueueInGame, sendMyInGameData } from "utils/socketio.service"
import { useParams } from "react-router-dom"
// ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■

// * https://levelup.gitconnected.com/rpg-game-with-react-redux-html5-part-1-build-a-tile-map-9144fd867830

export default function PageGamePlayV2() {
	const width = 600
	const height = 400

	const { socketIsConnected } = useAppSelector((state) => state.app)
	const auth = useAppSelector((state) => state.auth)
	const canvasRef = useRef<HTMLCanvasElement | null>(null)
	const [ctx, setCtx] = useState<CanvasRenderingContext2D | null | undefined>(null)

	const [p1y, setP1y] = useState(50)
	const [p2y, setP2y] = useState(50)

	const [p1Height, setP1Height] = useState(100)
	const [p2Height, setP2Height] = useState(80)

	const [bx, setBx] = useState(width / 2)
	const [by, setBy] = useState(height / 2)
	const [br, setBr] = useState(20)
	const [bSpeedX, setBSpeedX] = useState(2)
	const [bSpeedY, setBSpeedY] = useState(1)
	const [partie, setPartie] = useState<any>(null)

	const gameId = Number(useParams().id) || 0

	const [myPlyerNum, setMyPlyerNum] = useState<any>(0)

	// *■*■*■*■*■*■*■*■*■*■*■*■*■*■*■*■*■*■		INIT
	useEffect(() => {
		getInitialGameQueuess()
		function getInitialGameQueuess() {
			//// //console.log("getInitialQueues")
			fetch(process.env.REACT_APP_BACKENDAPI + "/game/parties/" + gameId)
				.then((res) => res.json())
				.then((data) => {
					// //console.log(data)
					setPartie(data)
					if (data.user1Id === auth.id) {
						setMyPlyerNum(1)
					} else if (data.user2Id === auth.id) {
						setMyPlyerNum(2)
					}
				})
		}
	}, [])

	// *■*■*■*■*■*■*■*■*■*■*■*■*■*■*■*■*■*■		ANIMATION
	const [frameTime, setFrameTime] = useState(performance.now())
	useEffect(() => {
		let frameId: number
		const frame = (time: number) => {
			setFrameTime(time)
			frameId = requestAnimationFrame(frame)

			let newBx = bx + bSpeedX
			let newBy = by + bSpeedY

			if (newBx - br <= 0) {
				newBx = 0 + Math.abs(bSpeedX) + br + 5
				newBy = by + bSpeedY
				let newBallSpeedX = -bSpeedX
				if (myPlyerNum === 1) {
					sendMyInGameData({
						userId: auth.id,
						py: p1y,
						ball: { x: newBx, y: newBy, speedX: newBallSpeedX, speedY: bSpeedY },
					})
				}
				setBSpeedX(newBallSpeedX)
			} else if (newBx + br >= width) {
				newBx = width - Math.abs(bSpeedX) - br - 5
				newBy = by + bSpeedY
				let newBallSpeedX = -bSpeedX
				if (myPlyerNum === 2) {
					sendMyInGameData({
						userId: auth.id,
						py: p2y,
						ball: { x: newBx, y: newBy, speedX: newBallSpeedX, speedY: bSpeedY },
					})
				}
				setBSpeedX(newBallSpeedX)
			}

			if (newBy - br <= 0) {
				newBy = 0 + br + 5
				setBSpeedY(-bSpeedY)
			} else if (newBy + br >= height) {
				newBy = height - br - 5
				setBSpeedY(-bSpeedY)
			}

			setBx(newBx)
			setBy(newBy)
		}
		requestAnimationFrame(frame)
		return () => cancelAnimationFrame(frameId)
	}, [bx, by])

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
				if (myPlyerNum === 1) {
					// //console.log("QueueSubscritpion - C - Move Raket 2", received.py)
					setP2y(received.py)
				} else if (myPlyerNum === 2) {
					// //console.log("QueueSubscritpion - C - Move Raket 1", received.py)
					setP1y(received.py)
				}
			}

			if (received?.ball) {
				setBx(received.ball.x)
				setBy(received.ball.y)
				setBSpeedX(received.ball.speedX)
				setBSpeedY(received.ball.speedY)
			}
		}
	}, [socketIsConnected, myPlyerNum]) // ! si je rajoutes [] aux dependances, ca fait des doubles dans les loos du serveurs

	// *■*■*■*■*■*■*■*■*■*■*■*■*■*■*■*■*■*■		SET CONTEXT

	useEffect(() => {
		const context = canvasRef.current?.getContext("2d")
		setCtx(context)
	}, [setCtx])

	// *■*■*■*■*■*■*■*■*■*■*■*■*■*■*■*■*■*■		DRAWING
	useEffect(() => {
		if (ctx) {
			// * Fond :
			ctx.fillStyle = "#555555"
			ctx.fillRect(0, 0, width, height)

			// * Raquette Player 1:
			ctx.fillStyle = "#CCCCCC"
			ctx.fillRect(10, p1y, 20, p1Height)

			// * Raquette Player 2:
			ctx.fillStyle = "#CCCCCC"
			ctx.fillRect(width - 30, p2y, 20, p2Height)

			ctx.beginPath()
			ctx.arc(bx, by, br, 0, 2 * Math.PI, false)
			ctx.fillStyle = "green"
			ctx.fill()
			ctx.lineWidth = 2
			ctx.strokeStyle = "#003300"
			ctx.stroke()
		}
	}, [ctx, height, width, p1y, p2y, bx])

	// *■*■*■*■*■*■*■*■*■*■*■*■*■*■*■*■*■*■		KEY HANDLER
	const keyHandler = useCallback(
		(e: any) => {
			const key = e.key
			const keycode = e.keyCode
			if (keycode === 122) {
				//Z
				if (myPlyerNum === 1) {
					let newY = p1y - 10
					if (newY < 0) newY = 0
					sendMyInGameData({ userId: auth.id, py: newY })
					setP1y(newY)
				} else if (myPlyerNum === 2) {
					let newY = p2y - 10
					if (newY < 0) newY = 0
					sendMyInGameData({ userId: auth.id, py: newY })
					setP2y(newY)
				}
			} else if (keycode === 115) {
				//Z

				if (myPlyerNum === 1) {
					let newY = p1y + 10
					if (newY + p1Height > height) newY = height - p1Height
					sendMyInGameData({ userId: auth.id, py: newY })
					setP1y(newY)
				} else if (myPlyerNum === 2) {
					let newY = p2y + 10
					if (newY + p2Height > height) newY = height - p2Height
					sendMyInGameData({ userId: auth.id, py: newY })
					setP2y(newY)
				}
			} else {
				//// //console.log("key", key)
				//// //console.log("keycode", keycode)
				setP1y(0)
			}
		},
		[p1y, myPlyerNum, p2y, p1Height, height, auth.id]
	)

	useEffect(() => {
		document.addEventListener("keypress", keyHandler)
		return () => {
			document.removeEventListener("keypress", keyHandler)
		}
	}, [keyHandler])

	// setBx(bx + 1)

	return (
		<ZPage documentTitle="Game/Play">
			<div className="zPageHeader">
				<h1>
					<FaGamepad /> Game/Play: Partie #{gameId}
				</h1>
				{/* <p>"frameTime": {frameTime}</p> */}
			</div>
			{partie && (
				<div className="bg-info row col-12">
					<div className="col-6">
						<b>Player 1:</b># {partie.user1Id}
						{myPlyerNum === 1 && " (moi)"}
					</div>
					<div className="col-6">
						<b>Player 2:</b># {partie.user2Id}
						{myPlyerNum === 2 && " (moi)"}
					</div>

					{/* <p>"frameTime": {frameTime}</p> */}
				</div>
			)}
			<CanvasContext.Provider value={ctx}>
				<canvas ref={canvasRef} width={width} height={height} />
				{/* {ctx && <Grid width={width} height={height} p1y={p1y} />} */}
			</CanvasContext.Provider>

			<p>z et s pour bouger raquette</p>
		</ZPage>
	)
}

// 〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓	STYLED_COMPONENTS
