// ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■

import React, { useEffect, useState } from "react"
//import styled from "styled-components"
import { useParams } from "react-router-dom"
import { apiFetchChatIndex } from "utils/api"
import { useAppSelector } from "store/store"
import { sendNavigate, subscribeToChat, subscribeToUsersStatus } from "utils/socketio.service"
import ChannelForm from "features/chat/ChannelFormCreate"
import { useNavigate } from "react-router-dom"
import { User } from "types"
import PageChatRender from "./PageChatRender"
// import { Channel } from "types"

// ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■

export default function PageChat() {
	const auth = useAppSelector((state) => state.auth)
	const selectedChanId = Number(useParams().id) || 0

	const { socketIsConnected } = useAppSelector((state) => state.app)

	const [channels, setChannels] = useState<any[] | null>(null)
	const [allRelations, setAllRelations] = useState<any[] | null>(null)
	const [allUsers, setAllUsers] = useState<any[] | null>(null)
	const [blockedUsers, setBlockedUsers] = useState<User[] | null>(null) // depreciated
	const [isLoadingChannels, setIsLoadingChannels] = useState(true)
	const [errorStrChannels, setErrorStrChannels] = useState<string | null>(null)

	const [showChannelForm, setShowChannelForm] = useState(false)
	const navigate = useNavigate()

	const [error, setError] = useState<string | null>(null)
	useEffect(() => {
		sendNavigate("PageChat", selectedChanId)
	}, [selectedChanId])
	// # Initial Fetch : channels

	useEffect(() => {
		fetch(process.env.REACT_APP_BACKENDAPI + "/api/ping")
			.then((response) => {
				//console.log("response", response)
				if (response.ok) {
					return response.json()
				}
				setError("Le serveur est indisponible.")
				throw new Error("Something went wrong")
			})
			.catch((error) => {
				setError("Le serveur est indisponible.")
			})

		apiFetchChatIndex().then((response: any) => {
			if (response.error) {
				setErrorStrChannels("Le serveur est indisponible.")
			} else {
				setChannels(response.channels)
				setBlockedUsers(response.blockedUsers) // depreciated
				setAllRelations(response.allRelations)
				setAllUsers(response.allUsers)

				//console.log("apiFetchChatIndex - response:", response)
			}
			setIsLoadingChannels(false)
		})
	}, [])

	// # subscribeToChat : Listen to "infoChat"

	useEffect(() => {
		if (!socketIsConnected) return

		subscribeToChat((err: any, data: any) => {
			if (data && data.type) {
				if (data.type === "CHANNEL_CREATED" || data.type === "CHANNEL_DELETED") {
					setChannels(data.channels)

					if (data.type === "CHANNEL_CREATED") {
						setShowChannelForm(false)
					} else if (data.type === "CHANNEL_DELETED") {
						if (selectedChanId > 0 && !data.channels.find((chan: any) => chan.id === selectedChanId))
							navigate("/chat")
					}
				} else if (data.type === "INVITATION_TO_PLAY_ACCEPTED") {
					if (data.partie.user1Id === auth.id || data.partie.user2Id === auth.id) {
						//alert("play")
						navigate("/game/play/" + data.partie.id)
					} else {
						// * supprimer les message d'invitations de ces 2 users
						// * ou re-fetch list message
					}
				} else if (data.type === "CHANNEL_UPDATED_XXXXXXXXXXXXXXXXX") {
					//console.log(" subscribeToChat - UNKNOWN ERROR 687456", data)
				}
			} else {
				//console.log(" subscribeToChat - UNKNOWN ERROR 6546 ", data)
			}
		})
		return () => {
			// todo
		}
	}, [socketIsConnected, isLoadingChannels])

	useEffect(() => {
		if (!socketIsConnected) return

		subscribeToUsersStatus((err: any, data: any) => {
			xXxxx(data)
		})
		return () => {
			///	//console.log("PageChatV2 - useEffect return - !!!!!!!!!!disconnectSocket")
			////	disconnectSocket()
		}

		function xXxxx(receivedData: any) {
			//console.log("subscribeToUsersStatus", receivedData)
			// if (receivedData.allRelations) setAllRelations(receivedData.allRelations)
			/*
			if (users && receivedData.user) {
				let newUsers = users?.map((user) => {
					if (user.id === receivedData.user.id) {
						return { ...user, status: receivedData.user.status }
					} else {
						return user
					}
				})
				setUsers(newUsers)
			}
			*/
		}
	}, [socketIsConnected]) // ! si je rajoutes [messages] aux dependances, ca fait des doubles dans les loos du serveurs

	useEffect(() => {
		if (!socketIsConnected) return

		subscribeToUsersStatus((err: any, data: any) => {
			xXxxx(data)
		})
		return () => {
			///	//console.log("PageChatV2 - useEffect return - !!!!!!!!!!disconnectSocket")
			////	disconnectSocket()
		}

		function xXxxx(receivedData: any) {
			//console.log("subscribeToUsersStatus", receivedData)
			//if (receivedData.allRelations) setAllRelations(receivedData.allRelations)

			if (allUsers && receivedData.user) {
				let newUsers = allUsers?.map((user) => {
					if (user.id === receivedData.user.id) {
						return { ...user, status: receivedData.user.status }
					} else {
						return user
					}
				})
				setAllUsers(newUsers)
			}
		}
	}, [socketIsConnected, allUsers]) // ! si je rajoutes [messages] aux dependances, ca fait des doubles dans les loos du serveurs

	// ■ ■ ■ ■ ■ ■ ■ ■ ■ ■ ■ ■ ■ ■ ■ ■ ■ ■ ■ ■ ■ ■ ■ ■ ■ ■ ■ ■ ■ ■ ■ ■ ■ ■ ■ ■ ■

	return (
		<>
			{error && (
				<div className="text-danger errorText">
					<h5>Error:</h5>
					{error}
				</div>
			)}

			{showChannelForm && !error && <ChannelForm setShowForm={setShowChannelForm} />}
			{!error && (
				<PageChatRender
					selectedChanId={selectedChanId}
					channels={channels}
					isLoadingChannels={isLoadingChannels}
					errorStrChannels={errorStrChannels}
					setShowChannelForm={setShowChannelForm}
					allRelations={allRelations}
					allUsers={allUsers}
				/>
			)}
		</>
	)
}

// 〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓	STYLED_COMPONENTS
