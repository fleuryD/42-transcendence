/* eslint-disable no-nested-ternary */
// ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
import React from "react"
import styled from "styled-components"

// ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■

interface Props {
	col: {
		name: string
		text: string
		cellHtml?: any
		cellClassName?: any
	}
	handleSortByClick: any
	sortBy: string
	sortOrderAsc: boolean
}

export default function ZTableHeadItem({ col, handleSortByClick, sortBy, sortOrderAsc }: Props) {
	return (
		<StyledTh onClick={() => handleSortByClick(col.name)} title={"Trier par " + col.text}>
			{sortBy === col.name && (sortOrderAsc ? "▲ " : "▼ ")}
			{col.text}
		</StyledTh>
	)
}

// █████████████████████████████████████████████████████████████	StyledComponents

const StyledTh = styled.th`
	// color: blue;
	cursor: pointer;
`
