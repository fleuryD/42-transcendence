// ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■

import React from "react"
import { useState } from "react"
// import './login.css';
import FormAutoFill from "./FormAutoFill"
import { useNavigate } from "react-router-dom"

import { authLoginSuccess } from "../../store/authSlice"
import { useAppDispatch } from "../../store/store"

// ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■

export default function LoginForm() {
	const dispatch = useAppDispatch()
	const [name, setName] = useState("")
	const [email, setEmail] = useState("")
	const [password, setPassword] = useState("")
	const navigate = useNavigate()

	// ■■■■■■■■■■■■■■■■■■■■■■■■■■■■ Login avec 42 ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■

	const searchParams = new URLSearchParams(window.location.search);

	const code = searchParams.get('code');

	const doubleAuthLogin = async (recvemail: string, recvpassword: string) => {
		const code = prompt("Enter your 2FA code")

		if (!code)
			return ;

		try {
			const response = await fetch(process.env.REACT_APP_BACKENDAPI + "/api/login", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Accept: "application/json",
				},
				body: JSON.stringify({ email: recvemail, password: recvpassword, code: code }),
			})
			if (response.status === 200 || response.status === 201) {
				const data = await response.json()

				localStorage.setItem("jwt", data.jwt)
				localStorage.setItem("userName", data.user.name)

				dispatch(authLoginSuccess(data.user))
				navigate("/")
			} else alert("Login failed")
		} catch (error) {
		}
	}

	const try42Login = async (code: string) => {
		try {
			const response = await fetch(process.env.REACT_APP_BACKENDAPI + `/api/loginoauth?code=${code}`, {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					Accept: "application/json",
				}
			})
			if (response.status === 200 || response.status === 201) {
				//console.log(response)
				const data = await response.json()
				//console.log(data)

				if (data.message === "2FA")
					return doubleAuthLogin(data.email, data.password)

				localStorage.setItem("jwt", data.jwt)
				localStorage.setItem("userName", data.user.name)
				dispatch(authLoginSuccess(data.user))

				navigate("/")
			} else alert("Login failed")
		} catch (error) {
		}
	}

	const try42Register = async () => {
		const scope = 'public';
		const authUrl = process.env.REACT_APP_42API_LOGINURL ? process.env.REACT_APP_42API_LOGINURL : "";
		window.location.href = authUrl
		return ;
	}

	if (code)
		try42Login(code)

	// ■■■■■■■■■■■■■■■■■■■■■■■■ Login sans 42 ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■

	const handleRegister = async () => {
		if (!name || !email || !password) return

		try {
			const response = await fetch(process.env.REACT_APP_BACKENDAPI + "/api/register", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ name: name, email: email, password: password }),
			})
		} catch (error) {}

		handleLogin()
	}

	const handleLogin = async () => {
		try {
			const response = await fetch(process.env.REACT_APP_BACKENDAPI + "/api/login", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Accept: "application/json",
				},
				body: JSON.stringify({ email: email, password: password }),
			})
			if (response.status === 200 || response.status === 201) {
				const data = await response.json()

				//console.log(data)

				if (data.message === "2FA")
					return doubleAuthLogin(data.email, data.password)

				localStorage.setItem("jwt", data.jwt)
				localStorage.setItem("userName", data.user.name)

				dispatch(authLoginSuccess(data.user))
				navigate("/")
			} else alert("Login failed")
		} catch (error) {}
	}

	return (
		<div>
			<div className="Login">
				<div>
					<h1>Login/Register</h1>
					<input type="name" placeholder="Name" value={name} onChange={(e) => setName(e.target.value.toLowerCase())} />
					<br />
					<input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value.toLowerCase())} />
					<br />
					<input
						type="password"
						placeholder="Password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
					/>
					<br />
					<button disabled={!email || !password || email.length < 3 || password.length < 3 || email.length > 64 || password.length > 128} onClick={handleLogin}>
						Login
					</button>
					<button disabled={!name || !email || !password || email.length < 3 || password.length < 3 || name.length < 3 || email.length > 64 || password.length > 128 || name.length > 64} onClick={handleRegister}>
						Register
					</button>
					<button onClick={try42Register}>
						42Login
					</button>
				</div>
			</div>
		</div>
	)
}

// 〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓	STYLED_COMPONENTS
