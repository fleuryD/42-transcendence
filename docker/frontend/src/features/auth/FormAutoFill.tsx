// ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■

import React from "react"
// import { useState } from 'react';
// import './login.css';

// ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■

type Props = {
	setName?: any
	setEmail: any
	setPassword: any
}

export default function FormAutoFill({ setName, setEmail, setPassword }: Props) {
	return (
		<div className="mt-5 debug">
			<h5>Debug: Auto-fill form:</h5>

			<button
				onClick={() => {
					LoginAutoFill("", "", "")
				}}
			>
				Clear
			</button>

			<button
				onClick={() => {
					LoginAutoFill("dawid", "dawid@42.fr", "passD")
				}}
			>
				Dawid
			</button>

			<button
				onClick={() => {
					LoginAutoFill("adrien", "adrien@42.fr", "passA")
				}}
			>
				Adrien
			</button>

			<button
				onClick={() => {
					LoginAutoFill("val", "val@42.fr", "passV")
				}}
			>
				Val
			</button>
		</div>
	)

	function LoginAutoFill(name: string, email: string, password: string) {
		if (setName) {
			setName(name)
		}
		setEmail(email)
		setPassword(password)
	}
}

// 〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓	STYLED_COMPONENTS
