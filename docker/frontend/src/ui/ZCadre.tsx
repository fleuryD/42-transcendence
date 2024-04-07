// ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
import React from "react"
import styled from "styled-components"
// ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■

type Props = {
	children: React.ReactNode
	className?: String | null
}

ZCadre.defaultProps = {
	className: "",
}

export default function ZCadre({ children, className }: Props) {
	return (
		<StyledZCadre className={className + " "}>
			<StyledContainer>{children}</StyledContainer>
		</StyledZCadre>
	)
}

// 〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓	STYLED_COMPONENTS

const StyledZCadre = styled.div`
	border: none !important;
`

const StyledContainer = styled.div`
	border: none !important;

	.cadreTitle {
		font-size: 1.2em;
		color: green;
		font-weight: bold;
	}
`
