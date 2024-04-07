// ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
import React from "react"

// import styled from "styled-components"

import CanvasContext from "features/game/canvasContext"

import "./PageGamePlay.scss"

// ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■

type Props = {
	ctx: CanvasRenderingContext2D | null | undefined
	canvasRef: React.RefObject<HTMLCanvasElement>
	width: number
	height: number
}

export default function GamePlayCanvas({ ctx, canvasRef, width, height }: Props) {
	return (
		<CanvasContext.Provider value={ctx}>
			<canvas ref={canvasRef} width={width} height={height} />
		</CanvasContext.Provider>
	)
}
