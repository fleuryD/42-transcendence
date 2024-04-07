// ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■

import React from "react"
// import { useState } from 'react';
//import { FaSignInAlt } from "react-icons/fa"
//import ZPage from "ui/ZPage"
import LoginForm from "features/auth/LoginForm"
import "./login.scss"

// ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■

export default function PageLogin() {
	/*
	return (
		<ZPage documentTitle="WIP">
			<div className="zPageHeader">
				<h1><FaSignInAlt /> Login</h1>
			</div>
			<LoginForm setIsLogged={setIsLogged}/>
		</ZPage>
	)
	*/

	return <LoginForm />
}

// 〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓	STYLED_COMPONENTS
