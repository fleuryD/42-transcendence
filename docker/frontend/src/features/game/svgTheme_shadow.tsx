// ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
import React from "react"
import { Link } from "react-router-dom"
import { FaUser } from "react-icons/fa"
import { User } from "types"

// ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■

/*
 *	ChannelsList
 *
 *	(menu des Channels)
 *
 *	FETCH et AFFICHE la liste des channels
 *
 */

// ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■

type Props = {
	ballPosX: number,
	ballPosY: number,
	ballRayon: number,
	padOffset: number,
	padWidth: number,
	padHeight: number,
	positionPad1: number,
	positionPad2: number,
	width: number,
	height: number,
	scale: number,
	score1: number,
	score2: number,
	partie: any,
	waitingUser: boolean,

}

export default function SvgTheme_shadow({ ballPosX, ballPosY, ballRayon, padOffset, padWidth, padHeight, positionPad1, positionPad2, width, height, scale, score1, score2, partie, waitingUser }: Props) {

	const points:any = []
	for (let i = 1; i < 20; i++) {
		points.push(<rect x={width / 2 * scale - 2.5 * scale} y={height * scale / 20 * i} width={5 * scale} height={5 * scale} />)
	}


	return (
		<svg
		id="aliens-go-home-canvas"
		preserveAspectRatio="xMaxYMax none" className="svg_shadow">

		<circle className="circle_shadow" cx={ballPosX * scale} cy={ballPosY * scale} r={ballRayon * scale} />

		<rect x={0} y={0} width={5 * scale} height={height * scale} />
		<rect x={(width - 5) * scale} y={0} width={5 * scale} height={height * scale} />

		<rect className="rect_shadow rect_blue" ry={5 * scale} rx={5 * scale} x={padOffset * scale} y={positionPad1 * scale} width={padWidth * scale} height={padHeight * scale} />
		<rect className="rect_shadow rect_red" ry={5 * scale} rx={5 * scale} x={(width * scale - padOffset * scale - padWidth * scale)} y={positionPad2 * scale} width={padWidth * scale} height={padHeight * scale} />

		<rect className="rect_shadow"  ry={3 * scale} rx={3 * scale} x={width / 2 * scale - 2.5 * scale} y={10 * scale} width={5 * scale} height={height * scale - 20 * scale} />

		<text x={width * scale / 2 - 40 * scale} y={100 * scale} textAnchor="end" style={{ fontSize: 60 * scale, fontFamily: "customFont1" }}>
			{score1}
		</text>
		<text x={width * scale / 2 + 40 * scale} y={100 * scale} textAnchor="start" style={{ fontSize: 60 * scale, fontFamily: "customFont1" }}>
			{score2}
		</text>

		<text x={width * scale / 2} y={height * scale / 2 + 20 * scale} textAnchor="middle" style={{ fontSize: 60 * scale, fontFamily: "customFont1" }}>
			{partie?.ended && "Game ended"}
		</text>

		<text x={width * scale / 2} y={height * scale / 2 + 20 * scale} textAnchor="middle" style={{ fontSize: 60 * scale, fontFamily: "customFont1" }}>
			{!partie?.ended && waitingUser && "Waiting User..."}
		</text>
		{ points }
		</svg>
		)
}

// 〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓	STYLED_COMPONENTS
