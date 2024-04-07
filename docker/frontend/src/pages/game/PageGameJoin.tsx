// ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■

import React, { useEffect, useState, useRef } from "react"
// import styled from "styled-components"

import ZPage from "ui/ZPage"
import QueuesContainer from "features/game/QueuesContainer"
// import GameTodo from "features/game/GameTodo"
import { FaGamepad } from "react-icons/fa"
import { Queue } from "types"
import { useAppSelector } from "store/store"

import { subscribeToQueue, joinQueue, quitQueue, sendNavigate } from "utils/socketio.service"
import { useNavigate } from "react-router-dom"
import ZCadre from "ui/ZCadre"

import "./PageGameJoin.scss"

import styled from "styled-components"

// ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■

export default function PageGameJoin() {
	useEffect(() => {
		sendNavigate("PageGaneJoin", null)
	}, [])
	const auth = useAppSelector((state) => state.auth)
	const { socketIsConnected } = useAppSelector((state) => state.app)
	const [queues, setQueues] = useState<Queue[] | null>(null)
	const [toastMessage, setToastMessage] = useState("")
	const [toastMessageShow, setToastMessageShow] = useState(false)
	const queuesEndRef = useRef<null | HTMLDivElement>(null)
	const [error, setError] = useState<string | null>(null)
	const navigate = useNavigate()

	useEffect(() => {
		getInitialGameQueuess()
		function getInitialGameQueuess() {
			fetch(process.env.REACT_APP_BACKENDAPI + "/queues")
				.then((response) => {
					if (response.ok) {
						return response.json()
					}
					setError("Le serveur est indisponible.")
					throw new Error("Something went wrong")
				})
				.then((responseJson) => {
					//console.log(responseJson)
					setQueues(responseJson)
				})
				.catch((error) => {
					setError("Le serveur est indisponible.")
				})
		}
	}, [socketIsConnected])

	useEffect(() => {
		if (!socketIsConnected) return

		try {
			subscribeToQueue((err: any, received: any) => {
				QueueSubscritpion(received)
			})
			return () => {
				//// //console.log("PageChatV2 - useEffect return - disconnectSocket")
				//// disconnectSocket()
			}
		} catch (error) {
			setError("Error Inconnue: Voir la console")
			//console.log(error)
		}

		function QueueSubscritpion(received: any) {
			if (received?.queues) setQueues(received.queues)

			if (received?.type === "JOIN") {
				//console.log("someone joined", received)
			} else if (received?.type === "QUIT") {
				//console.log("someone quit", received)
			} else if (received?.type === "ALREADY_IN_QUEUE") {
				if (received?.userId === auth.id) {
					//console.log("ALREADY_IN_QUEUE;", received)
					newToastMessage("Your already are in the queue !")
				}
				//console.log("ALREADY_IN_QUEUE; some retry to join: ", received)
			} else if (received?.type === "2_PLAYERS_IN_QUEUE") {
				if (received?.user1 === auth.id || received?.user2 === auth.id) {
					//console.log("2_PLAYERS_IN_QUEUE - me;", received)
					newToastMessage("Redirection en cours vers la partie...")

					setTimeout(() => {
						navigate("/game/play/" + received.partie.id)
					}, 2000)
				}
			} else {
				newToastMessage(received.type)
				//console.log("received;", received)
			}
		}
	}, [socketIsConnected]) // ! si je rajoutes [queues] aux dependances, ca fait des doubles dans les loos du serveurs

	useEffect(() => {
		scrollToBottom()
	}, [queues])

	const scrollToBottom = () => {
		queuesEndRef.current?.scrollIntoView({ behavior: "smooth" })
	}

	function joinQueueClick() {
		try {
			if (!auth.id) {
				newToastMessage("You must be logged in to join the queue !")
				return
			}
			joinQueue(auth.id)
		} catch (error) {
			setError("Error Inconnue: Voir la console")
			//console.log(error)
		}
	}

	function quitQueueClick() {
		try {
			if (!auth.id) {
				newToastMessage("You must be logged in to quit the queue !")
				return
			}
			quitQueue(auth.id)
		} catch (error) {
			setError("Error Inconnue: Voir la console")
			//console.log(error)
		}
	}

	function newToastMessage(message: string) {
		setToastMessage(message)
		setToastMessageShow(true)
		setTimeout(() => {
			setToastMessageShow(false)
		}, 1500)
	}

	return (
		<StyledJoinZPage documentTitle="Game/Join">
			{!error && (
				<div className="zPageHeader joinHeader">
					<h1>
						<FaGamepad /> Game/Join
					</h1>
				</div>
			)}

			{error && (
				<div className="text-danger errorText">
					<h5>Error:</h5>
					{error}
				</div>
			)}

			{!error && (
				<>
					<div className="cadreJoinTitle">Queue (file d'attente pour jouer)</div>
					<div className="cadreContent cadreJoin">
						{queues && (
							<QueuesContainer
								myid={auth.id ? auth.id : -1}
								queues={queues}
								queuesEndRef={queuesEndRef}
							/>
						)}
						<button onClick={() => joinQueueClick()}>Join</button>
						<button onClick={() => quitQueueClick()}>Quit</button>
						{toastMessageShow && <div>toastMessage: {toastMessage}</div>}
					</div>
				</>
			)}

			{/*
			<GameTodo />
			*/}
		</StyledJoinZPage>
	)
}

// 〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓	STYLED_COMPONENTS

const StyledJoinZPage = styled(ZPage)`
	background-color: transparent !important;
	color: white;
	text-align: center;
	font-family: "customFont1", sans-serif;
	border: none !important;
`

/*
const StyledChatContainer = styled.div`
	border: 1px solid blue;
	height: 25vh !important;
	background-color: lime;
	padding: 2px;

	overflow: scroll;
`
*/
