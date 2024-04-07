/* eslint-disable no-nested-ternary */
// ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
import { AnyARecord } from "dns"
import React from "react"
import styled from "styled-components"
import ZTableRowCell from "./ZTableRowCell"

// ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
ZTableRow.defaultProps = {
	funcRowClassName: () => "",
}
interface Props {
	item: any
	columns: {
		name: string
		text: string
		cellHtml?: any
		itemFunc?: AnyARecord
		cellClassName?: any
	}[]
	funcRowClassName?: any
}

export default function ZTableRow({ item, columns, funcRowClassName }: Props) {
	const className = funcRowClassName ? funcRowClassName(item) : ""
	return (
		<StyledTr className={className}>
			{columns.map((col) => (
				<ZTableRowCell key={"td-" + col.name + "-" + item.id} item={item} col={col} />
			))}
		</StyledTr>
	)
}

// █████████████████████████████████████████████████████████████	StyledComponents

const StyledTr = styled.tr`
	// color: green;
	// cursor: pointer;
`
