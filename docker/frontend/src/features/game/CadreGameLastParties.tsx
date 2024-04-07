// ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
import React from "react"
import ZCadre from "ui/ZCadre"

// ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■

type Props = {
	className: string
}

export default function CadreGameLastParties({ className }: Props) {
	return (
		<ZCadre className={className}>
			<div className="cadreTitle">Dernieres parties</div>
			<div className="cadreContent">
				<p>
					Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam tempor fringilla odio, tempor
					hendrerit ex scelerisque non. Cras pharetra commodo malesuada. Integer fringilla tortor quis dapibus
					lacinia. Nullam ac interdum lacus, volutpat sagittis sem. Curabitur magna lectus, porttitor ut
					semper id, pulvinar sit amet lectus. Vestibulum viverra id sem suscipit ultrices. Cras eget libero
					at leo malesuada euismod. Duis in metus eu mi pellentesque consequat quis nec ex. Nulla sed ex a
					magna accumsan eleifend.
				</p>
			</div>
		</ZCadre>
	)
}

// 〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓	STYLED_COMPONENTS
