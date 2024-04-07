// ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■

import React, { useEffect, useState } from "react"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"

import { useAppSelector } from "store/store"

import PageLogin from "pages/auth/PageLogin"
import PageChat from "pages/chat/PageChat"
import PageDevSubject from "pages/dev/PageDevSubject"
import PageDevNotes from "pages/dev/PageDevNotes"
import PageGameJoin from "pages/game/PageGameJoin"
import PageGamePlay from "pages/game/PageGamePlay"
import PageUsers from "pages/user/PageUsers"
import PageUser from "pages/user/PageUser"
import PageHome from "pages/PageHome"
import PageWIP from "pages/PageWIP"

import NavBar from "ui/NavBar"
import DevAuthInfos from "features/auth/DevAuthInfos"

import "bootstrap/dist/css/bootstrap.min.css"
import "styles/global.scss"
import { initiateSocketConnection, disconnectSocket } from "utils/socketio.service"
import { useAppDispatch } from "store/store"
import { setAppSocketConnectionSuccess } from "store/appSlice"
import { authLogoutSuccess } from "store/authSlice"
import { useNavigate } from "react-router-dom"
import { Button } from "react-bootstrap"

// ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■

function App() {
	const dispatch = useAppDispatch()
	const auth = useAppSelector((state) => state.auth)
	const [isLoading, setIsLoading] = React.useState(true)
	const [withAnim, setWithAnim] = useState(false)

	//console.log = function () {}
	console.group = function () {}

	//console.log("■■■■■ RENDER ■ App")

	//console.log(process.env.REACT_APP_BACKENDAPI)
	//console.log(process.env.REACT_APP_FRONTENDAPI)

	useEffect(() => {
		async function fetchUser() {
			const user = await fetch(process.env.REACT_APP_BACKENDAPI + "/api/me", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ jwt: auth.jwt }),
			})
				.then((res) => res.json())
				.then((data) => {
					if (data && data.user) {
						setIsLoading(false)
						//console.log(" fetch success and data")
						return data.user
					}
					setIsLoading(false)
					dispatch(authLogoutSuccess())
					localStorage.removeItem("jwt")
					//console.log(" fetch success and no data")
					return data
				})
				.catch((err) => {
					setIsLoading(false)
					dispatch(authLogoutSuccess())
					localStorage.removeItem("jwt")
					//console.log("fetch error")
					return null
				})
		}

		if (auth.jwt) {
			//console.log("fetch user")
			fetchUser()
		} else {
			setIsLoading(false)
			//console.log("not fetch")
		}
	}, [])

	useEffect(() => {
		if (!auth.isConnected) return
		//console.log("🟢APP>useEffect>initiateSocketConnection")

		try {
			if (initiateSocketConnection(auth.jwt)) dispatch(setAppSocketConnectionSuccess())

			return () => {
				//console.log("🟠APP>useEffect>disconnectSocket")
				disconnectSocket()
			}
		} catch (error) {
			//console.log(error)
		}
	}, [auth.isConnected])

	const shootingStars = []
	for (let i = 0; i < 20; i++) {
		shootingStars.push(<div className="shooting_star" key={i}></div>)
	}

	return (
		<>
			<div className={withAnim ? "divStars" : "divStars-no-anim"}></div>
			{isLoading === false && (
				<div
					className={"App container-xl appStyled " + (withAnim ? "" : " container-no-anim ")}
					id="container-global"
				>
					<Router>
						<NavBar />
						<>
							{auth.isConnected ? (
								<Routes>
									<Route path="/chat" element={<PageChat />} />
									<Route path="/chat/channel/:id" element={<PageChat />} />
									<Route path="/users" element={<PageUsers />} />
									<Route path="/user/:id" element={<PageUser />} />
									<Route path="/wip" element={<PageWIP />} />
									<Route path="/dev/subject" element={<PageDevSubject />} />
									<Route path="/dev/notes" element={<PageDevNotes />} />
									<Route path="/game/join" element={<PageGameJoin />} />
									<Route path="/game/play/:id" element={<PageGamePlay />} />
									<Route path="*" element={<PageHome />} />
								</Routes>
							) : (
								<Routes>
									<Route path="*" element={<PageLogin />} />
								</Routes>
							)}
						</>
					</Router>
				</div>
			)}
		</>
	)
}

// 〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓	STYLED_COMPONENTS

export default App
