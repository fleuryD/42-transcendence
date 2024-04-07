// ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■

import React, { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import ZPage from "ui/ZPage"
import TodoUser from "features/users/TodoUser"
import { FaUser } from "react-icons/fa"
import { User } from "types"
import { apiFetchUser } from "utils/api"
import ZCadre from "ui/ZCadre"
import CadreMyFriends from "features/friends/CadreMyFriends"
import "./PageUser.scss"
import MatchHistory from "features/users/MatchHistory"
import styled from "styled-components"
import { sendNavigate } from "utils/socketio.service"

// ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■

/*
function sleep(time: number)
	return new Promise((resolve) => setTimeout(resolve, time))
}
*/

export default function PageUser() {
	const userId = Number(useParams().id) || 0
	const [isLoading, setIsLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)
	const [user, setUser] = useState<User | null>(null)
	const [qrcode, setQrcode] = useState<string | null>(null)
	const [DAA, setDAA] = useState<boolean>(false)
	const [preview, setPreview] = useState(null)
	const [nick, setNick] = useState<string | null>(null)

	let me = localStorage.getItem("userName")

	useEffect(() => {
		sendNavigate("PageUser", userId)
	}, [userId])

	useEffect(() => {
		if (userId <= 0) {
			setError("Invalid user id")
			setIsLoading(false)
			return
		}
		apiFetchUser(userId).then((response: any) => {
			if (response.error) {
				setError("Le serveur est indisponible.")
			} else {
				setUser(response)
				setNick(response.nickname)
				setDAA(response.doubleAuthActive)
			}
			setIsLoading(false)
		})
	}, [userId])

	const handleUpload = async () => {
		let newAvatar = prompt("Entrez l'url de votre avatar")

		//console.log(newAvatar)

		if (newAvatar == null) return

		const response = await fetch(process.env.REACT_APP_BACKENDAPI + "/api/updateAvatar", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Accept: "application/json",
			},
			body: JSON.stringify({ jwt: localStorage.getItem("jwt"), avatarLink: newAvatar }),
		})
		const data = await response.json()

		if (data.error) return

		let newUser = user
		if (!newUser) return

		let avatar = document.getElementById("avatar") as HTMLImageElement
		if (avatar) avatar.src = newAvatar
		newUser.avatarLink = newAvatar
		setUser(newUser)
	}

	const setDoubleAuth = async () => {
		const response = await fetch(process.env.REACT_APP_BACKENDAPI + "/api/2faTurn-on", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Accept: "application/json",
			},
			body: JSON.stringify({ jwt: localStorage.getItem("jwt") }),
		})
		const data = await response.json()

		if (data.error) return

		let newUser = user
		if (newUser) {
			newUser.doubleAuthActive = data.doubleAuthActive
			setDAA(data.doubleAuthActive)
			setUser(newUser)
		}

		setQrcode(data.qrcode)
	}

	const removeDoubleAuth = async () => {
		//console.log("remove")
		const response = await fetch(process.env.REACT_APP_BACKENDAPI + "/api/2faTurn-off", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Accept: "application/json",
			},
			body: JSON.stringify({ jwt: localStorage.getItem("jwt") }),
		})
		const data = await response.json()

		if (data.error) return

		let newUser = user
		if (newUser) {
			newUser.doubleAuthActive = data.doubleAuthActive
			setUser(newUser)
			setDAA(data.doubleAuthActive)
			setQrcode(null)
		}
	}

	const setNickname = async () => {
		let nickname = prompt("Entrez votre nickname")?.toLowerCase()

		if (nickname == null) return

		const response = await fetch(process.env.REACT_APP_BACKENDAPI + "/api/setNickname", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Accept: "application/json",
			},
			body: JSON.stringify({ jwt: localStorage.getItem("jwt"), nickname: nickname }),
		})
		const data = await response.json()

		if (data.error) return

		let newUser = user
		if (!newUser) return

		//console.log("ocucouuuu", nickname)

		newUser.nickname = nickname
		setUser(newUser)
		setNick(nickname)
		//console.log(user)
	}

	// * Doit etre mis apres useEffect

	return (
		<StyledUserZPage documentTitle="user">
			{isLoading && <h5>Fetching users...</h5>}

			{error && (
				<div className="text-danger">
					<h5>Error:</h5>
					{error}
				</div>
			)}
			{user && (
				<div className="row">
					<StyledUserZCadre>
						<div className="cadreContent profilContent">
							{!qrcode && (
								<img
									id="avatar"
									className="profilAvatar"
									src={
										user.avatarLink
											? user.avatarLink
											: process.env.REACT_APP_FRONTENDAPI + "/default-avatar.jpg"
									}
								/>
							)}

							{qrcode && <img id="avatar" className="profilAvatar" src={qrcode} />}

							<div className="profilDemi">
								<span className="profilText">Username: {user.name}</span>
								<br />
								{(!nick && user.name == me) && <>Nickname: <button className="setNick" onClick={setNickname}>Set Nickname</button></>}
								{(nick || user.name != me) && <>Nickname: {nick ? nick : "no nickname"}</>}
								<br />
								<span className="profilText">Email: {user.email}</span>
								<br />
								{user.status == "ONLINE" && <span className="profilText">Status: 🟢 Online</span>}
								{user.status == "OFFLINE" && <span className="profilText">Status: ⚫ Offline</span>}
								{user.status == "PLAYING" && <span className="profilText">Status: 🔴 Playing</span>}
								{user.status == "AFK" && <span className="profilText">Status: 🟠 AFK</span>}
								<br />

								{user.name == me && (
									<>
										<span className="profilText">
											Double Auth: {DAA ? "🟢 Active" : "🔴 Inactive"}
										</span>
										<br />
										{DAA ? (
											<button className="profilText" onClick={removeDoubleAuth}>
												Remove Double Auth
											</button>
										) : (
											<button className="profilText" onClick={setDoubleAuth}>
												Set Double Auth
											</button>
										)}
										<br />
										<button className="profilText" onClick={handleUpload}>
											Change Avatar
										</button>
									</>
								)}
							</div>
						</div>
					</StyledUserZCadre>
					<StyledUserZCadre>
						<div className="cadreTitle">Match History</div>
						<div className="cadreContent">
							<MatchHistory userId={userId} />
						</div>
					</StyledUserZCadre>
				</div>
			)}
		</StyledUserZPage>
	)
}

// 〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓	STYLED_COMPONENTS

const StyledUserZCadre = styled(ZCadre)`
	width: 100%;
	max-width: 1000px;
	margin: 0 auto;

	padding: 0 0;
	border: none !important;

	background-color: #ffffff07 !important;

	margin-bottom: 20px;
	border-radius: 10px;
`

const StyledUserZPage = styled(ZPage)`
	background-color: transparent !important;
	color: white;
	text-align: center;
	font-family: "customFont1", sans-serif;
	border: none !important;
`
