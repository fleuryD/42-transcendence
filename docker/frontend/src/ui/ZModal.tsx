// ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
import React from "react"
import styled from "styled-components"
import { createPortal } from "react-dom"
import { Button } from "react-bootstrap"

// ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■

type Props = {
	styles: any
	children: React.ReactNode
	closeForm: () => any
}

export default function ZxModal({ children, styles, closeForm }: Props) {
	const rootElement = document.getElementById("root")

	if (!rootElement) return <></>

	return createPortal(
		<div className="zxModalContainer">
			<StyledOpaqueBackground />
			<StyledModal>
				{children}
				<Button variant="danger" className="formChannelApply" onClick={() => closeForm()}>
					Annuler
				</Button>
			</StyledModal>
		</div>,
		rootElement
	)
}

const StyledOpaqueBackground = styled.div`
	background: radial-gradient(ellipse at bottom, #1b2735 0%, #090a0f 100%);
	opacity: 0.9;
	position: fixed;
	top: 0;
	left: 0;
	height: 100vh;
	width: 100%;
	z-index: 1000;
	backdrop-filter: blur(20px);
`

const StyledModal = styled.div`
	position: fixed;
	color: white !important;

	font-family: "customFont1", sans-serif;

	border: solid 1px #ffffff44;
	z-index: 1000;
	border-radius: 10px;
	background-color: #22222944;
	backdrop-filter: blur(3px);

	margin-top: 20px;
	margin-bottom: 20px;

	z-index: 2000;
	max-height: 90%;
	max-width: 100%;

	overflow-y: auto;
	padding: 10px;

	/*top: 0;* /
	/*bottom:0;* /
	// inset: 0; /* inset sets all 4 values (top right bottom left) much like how we set padding, margin etc., */
	margin: 0 auto; /* Will not center vertically and won't work in IE6/7. */
	transition: all 0.1s ease-in-out;

	left: 50%;
	top: 50%;
	transform: translate(-50%, -50%);

`
