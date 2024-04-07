// ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
import React, { useCallback, useEffect, useRef, useState } from "react"

// import styled from "styled-components"

import CanvasContext from "features/game/canvasContext"
//import { useAppSelector } from "store/store"

// ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■

// * https://levelup.gitconnected.com/rpg-game-with-react-redux-html5-part-1-build-a-tile-map-9144fd867830

export default function GameTesty() {
	const width = 600
	const height = 300

	//const auth = useAppSelector((state) => state.auth)
	const canvasRef = useRef<HTMLCanvasElement | null>(null)
	//const canvasRef = useRef(null)
	const [ctx, setCtx] = useState<CanvasRenderingContext2D | null | undefined>(null)
	//const [ctx, setCtx] = useState(null)
	const [p1y, setP1y] = useState(50)
	const [p2y, setP2y] = useState(50)
	const [bx, setBx] = useState(width / 2)
	const [by, setBy] = useState(height / 2)
	const [br, setBr] = useState(20)

	useEffect(() => {
		const context = canvasRef.current?.getContext("2d")
		setCtx(context)
	}, [setCtx])

	useEffect(() => {
		if (ctx) {
			/*
			for (let i = 0; i < height; i++) {
				const y = i * TILE_SIZE
				ctx.beginPath()
				ctx.moveTo(0, y)
				ctx.lineTo(width, y)
				ctx.stroke()
			}
			for (let j = 0; j < width; j++) {
				const x = j * TILE_SIZE
				ctx.beginPath()
				ctx.moveTo(x, 0)
				ctx.lineTo(x, height)
				ctx.stroke()
			}
			*/
			// * Fond :
			ctx.fillStyle = "#555555"
			ctx.fillRect(0, 0, width, height)

			// * Raquette Player 1:
			ctx.fillStyle = "#CCCCCC"
			ctx.fillRect(10, p1y, 20, 100)

			// * Raquette Player 2:
			ctx.fillStyle = "#CCCCCC"
			ctx.fillRect(width - 30, p2y, 20, 100)

			ctx.beginPath()
			ctx.arc(bx, by, br, 0, 2 * Math.PI, false)
			ctx.fillStyle = "green"
			ctx.fill()
			ctx.lineWidth = 2
			ctx.strokeStyle = "#003300"
			ctx.stroke()
		}
	}, [ctx, height, width, p1y, p2y, bx])

	const keyHandler = useCallback(
		(e: any) => {
			const key = e.key
			const keycode = e.keyCode
			if (keycode === 122) {
				//Z
				//console.log("-  UP -", key)
				const newY = p1y - 10
				setP1y(newY)
			} else if (keycode === 115) {
				//Z
				//console.log("-  DOWN -", key)
				const newY = p1y + 10
				setP1y(newY)
			} else {
				//console.log("key", key)
				//console.log("keycode", keycode)
				setP1y(0)
			}
		},
		[p1y]
	)

	useEffect(() => {
		document.addEventListener("keypress", keyHandler)
		return () => {
			document.removeEventListener("keypress", keyHandler)
		}
	}, [keyHandler])

	// setBx(bx + 1)

	return (
		<div className="bg-info">
			<h2>GameTest1</h2>
			<CanvasContext.Provider value={ctx}>
				<canvas ref={canvasRef} width={width} height={height} />
				{/* {ctx && <Grid width={width} height={height} p1y={p1y} />} */}
			</CanvasContext.Provider>

			<p>z et s pour bouger raquette</p>
		</div>
	)
}

// 〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓	STYLED_COMPONENTS
