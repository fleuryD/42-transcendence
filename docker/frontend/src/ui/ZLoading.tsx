/* eslint-disable react/prop-types */
/* eslint-disable react/self-closing-comp */
// ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
import React from "react"
import styled from "styled-components"
// ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■

/*
 *	props:
 *		-	showMessage	:	boulean		- defaut: true
 *		-	message	:		String		- defaut: "Chargement..."
 *
 */
export default function ZLoading({ message = "Chargement", showMessage = true, color = "#0b4d94", style = {} }) {
	return (
		<StyledLoading className="loader" color={color} style={style}>
			{showMessage && <div className="message">{message}</div>}
			<div className="Knight-Rider-loader animate">
				<span className="Knight-Rider-bar"></span>
				<span className="Knight-Rider-bar"></span>
				<span className="Knight-Rider-bar"></span>
			</div>
		</StyledLoading>
	)
}

const StyledLoading = styled.div`
	// background-color: cyan;
	text-align: center;
	.message {
		//	color:$C1d3;
		color: ${(props) => props.color};
		padding-bottom: 5px;
	}

	padding: 20px;

	@-webkit-keyframes Knight-Rider-oscillate {
		0% {
			opacity: 0.5;
			-webkit-transform: scaleY(1);
		}
		100% {
			opacity: 1;
			-webkit-transform: scaleY(1.4);
		}
	}
	@keyframes Knight-Rider-oscillate {
		0% {
			opacity: 0.5;
			transform: scaleY(1);
		}
		100% {
			opacity: 1;
			transform: scaleY(1.4);
		}
	}

	.Knight-Rider-loader {
		line-height: 0;
	}
	.Knight-Rider-loader .centered {
		position: absolute;
		top: 50%;
		left: 50%;
		-webkit-transform: translate(-50%, -50%);
		-ms-transform: translate(-50%, -50%);
		transform: translate(-50%, -50%);
	}
	.Knight-Rider-loader .Knight-Rider-bar {
		display: none;
		height: 20px;
		width: 20px;
		margin: 0 3px;
		opacity: 0.5;
		border-radius: 5px;
		// background-color: $C1d3;
		background-color: ${(props) => props.color};
	}
	.Knight-Rider-loader.animate > .Knight-Rider-bar {
		display: inline-block;
		-webkit-animation-name: Knight-Rider-oscillate;
		-webkit-animation-duration: 300ms;
		-webkit-animation-timing-function: ease-in-out;
		-webkit-animation-iteration-count: infinite;
		-webkit-animation-direction: alternate;
		animation-name: Knight-Rider-oscillate;
		animation-duration: 300ms;
		animation-timing-function: ease-in-out;
		animation-iteration-count: infinite;
		animation-direction: alternate;
		-webkit-animation-delay: 0ms;
		animation-delay: 0ms;
	}
	.Knight-Rider-loader.animate > .Knight-Rider-bar:nth-child(1) {
		-webkit-animation-delay: -200ms;
		animation-delay: -200ms;
	}
	.Knight-Rider-loader.animate > .Knight-Rider-bar:nth-child(2) {
		-webkit-animation-delay: -100ms;
		animation-delay: -100ms;
	}
`
