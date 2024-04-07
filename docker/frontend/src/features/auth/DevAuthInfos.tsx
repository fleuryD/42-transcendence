// ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■

import React from "react"
import { styled } from "styled-components"
import { useAppSelector } from "store/store"

// ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■

export default function DevAuthInfos() {
	const auth = useAppSelector((state) => state.auth)
	return (
		<StyledDevAuthInfos className=" col-12">
			<div className="">
				<b>Auth:</b>
			</div>
			<div className="keyVal">
				<b>.isConnected:</b> {auth.isConnected ? "oui" : "non"}
			</div>
			<div className="keyVal">
				<b>.id:</b> {auth.id}
			</div>
			<div className="keyVal">
				<b>.name:</b> {auth.name}
			</div>
			<div className="keyVal">
				<b>.email:</b> {auth.email}
			</div>
			<div className="keyVal">
				<b>.jwt:</b> <small>{auth.jwt}</small>
			</div>
		</StyledDevAuthInfos>
	)
}

// 〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓	STYLED_COMPONENTS

const StyledDevAuthInfos = styled.div`
	border: 1px solid red;
	background-color: #ffcccc;
	padding: 5px;
	div {
		display: inline-block;
		margin-bottom: 2px;
		margin-right: 15px;
		background-color: #ffeeee;
		padding: 2px;

		small {
			font-size: 0.7em;
		}
	}
`
