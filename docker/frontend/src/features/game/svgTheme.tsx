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
	themePad1: number,
	themePad2: number,
	themeBall: number,
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

export default function SvgTheme({ themePad1, themePad2, themeBall, ballPosX, ballPosY, ballRayon, padOffset, padWidth, padHeight, positionPad1, positionPad2, width, height, scale, score1, score2, partie, waitingUser }: Props) {

	const points:any = []
	for (let i = 1; i < 20; i++) {
		points.push(<rect x={width / 2 * scale - 2.5 * scale} y={height * scale / 20 * i} width={5 * scale} height={5 * scale} />)
	}


	return (
		<svg
		id="aliens-go-home-canvas"
		preserveAspectRatio="xMaxYMax none"

		style={{ width: "auto", height: "auto", maxWidth: 'calc(100% - 40px)' }}
	>
		<rect x={ballPosX * scale - ballRayon / 2 * scale} y={ballPosY * scale - ballRayon / 2 * scale} width={ballRayon * 2 * scale} height={ballRayon * 2 * scale} />

		<rect x={0} y={0} width={5 * scale} height={height * scale} />
		<rect x={(width - 5) * scale} y={0} width={5 * scale} height={height * scale} />

		{(themePad1 == 1) && <rect style={{fill: "white !important"}} x={padOffset * scale} y={positionPad1 * scale} width={padWidth * scale} height={padHeight * scale} />}
		{(themePad1 == 2) && <image href={process.env.REACT_APP_FRONTENDAPI + "/pad_theme_2.png"} style={{ width: (padWidth + 4) * scale, height: (padHeight + 12) * scale }} x={padOffset * scale} y={(positionPad1 - 4) * scale} />}
		{(themePad1 == 3) && <image href={process.env.REACT_APP_FRONTENDAPI + "/pad_theme_3.png"} style={{ width: (padWidth + 17) * scale, height: (padHeight + 16) * scale }} x={(padOffset - 8) * scale} y={(positionPad1 - 4) * scale} />}
		{(themePad1 == 4) && <image href={process.env.REACT_APP_FRONTENDAPI + "/pad_theme_4.png"} style={{ width: (padWidth + 4) * scale, height: (padHeight + 12) * scale }} x={padOffset * scale} y={(positionPad1 - 4) * scale} />}
		{(themePad1 == 5) && <image href={process.env.REACT_APP_FRONTENDAPI + "/pad_theme_5.png"} style={{ width: (padWidth + 4) * scale, height: (padHeight) * scale }} x={(padOffset - 3) * scale} y={(positionPad1) * scale} />}
		{(themePad1 == 6) && <image href={process.env.REACT_APP_FRONTENDAPI + "/pad_theme_6.png"} style={{ width: (padWidth + 18) * scale, height: (padHeight + 2) * scale }} x={(padOffset - 9) * scale} y={(positionPad1 - 1) * scale} />}
		{(themePad1 == 7) && <image href={process.env.REACT_APP_FRONTENDAPI + "/pad_theme_7.png"} style={{ width: (padWidth) * scale, height: (padHeight) * scale }} x={(padOffset) * scale} y={(positionPad1) * scale} />}


		{(themePad2 == 1) && <rect style={{fill: "white !important"}} x={(width * scale - padOffset * scale - padWidth * scale)} y={positionPad2 * scale} width={padWidth * scale} height={padHeight * scale} />}
		{(themePad2 == 2) && <image href={process.env.REACT_APP_FRONTENDAPI + "/pad_theme_2_2.png"} style={{ width: (padWidth + 4) * scale, height: (padHeight + 12) * scale }} x={(width * scale - padOffset * scale - padWidth * scale)} y={(positionPad2 - 4) * scale} />}
		{(themePad2 == 3) && <image href={process.env.REACT_APP_FRONTENDAPI + "/pad_theme_3_2.png"} style={{ width: (padWidth + 17) * scale, height: (padHeight + 16) * scale }} x={(width * scale - (padOffset + 8) * scale - padWidth * scale)} y={(positionPad2 - 4) * scale} />}
		{(themePad2 == 4) && <image href={process.env.REACT_APP_FRONTENDAPI + "/pad_theme_4_2.png"} style={{ width: (padWidth + 4) * scale, height: (padHeight + 12) * scale }} x={(width * scale - padOffset * scale - padWidth * scale)} y={(positionPad2 - 4) * scale} />}
		{(themePad2 == 5) && <image href={process.env.REACT_APP_FRONTENDAPI + "/pad_theme_5_2.png"} style={{ width: (padWidth + 4) * scale, height: (padHeight) * scale }} x={(width * scale - (padOffset + 3) * scale - padWidth * scale)} y={(positionPad2) * scale} />}
		{(themePad2 == 6) && <image href={process.env.REACT_APP_FRONTENDAPI + "/pad_theme_6_2.png"} style={{ width: (padWidth + 18) * scale, height: (padHeight + 2) * scale }} x={(width * scale - (padOffset + 9) * scale - padWidth * scale)} y={(positionPad2 - 1) * scale} />}
		{(themePad2 == 7) && <image href={process.env.REACT_APP_FRONTENDAPI + "/pad_theme_7_2.png"} style={{ width: (padWidth) * scale, height: (padHeight) * scale }} x={(width * scale - (padOffset) * scale - padWidth * scale)} y={(positionPad2) * scale} />}


		<text x={width * scale / 2 - 40 * scale} y={100 * scale} textAnchor="end" style={{ fontSize: 60 * scale, fontFamily: "PongScore" }}>
			{score1}
		</text>
		<text x={width * scale / 2 + 40 * scale} y={100 * scale} textAnchor="start" style={{ fontSize: 60 * scale, fontFamily: "PongScore" }}>
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
