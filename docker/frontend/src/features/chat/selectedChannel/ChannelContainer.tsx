// ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■

import React, { useEffect, useState, useRef } from "react"
import { Message } from "types"
import { useAppSelector } from "store/store"
import { sendMessageToChannel, subscribeToChannel } from "utils/socketio.service"
import { apiFetchChannel } from "utils/api"
import ChannelContainerRender from "./ChannelContainerRender"
import ChannelFormEdit from "../ChannelFormEdit"

// ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■

type Props = {
	className: string
	selectedChanId: number
	allRelations: any[]
	allUsers: any[]
	channels: any[]
}

export default function ChannelContainer({ className, selectedChanId, allRelations, allUsers, channels }: Props) {
	const auth = useAppSelector((state) => state.auth)
	const { socketIsConnected } = useAppSelector((state) => state.app)
	const messagesContainerRef = useRef<null | HTMLDivElement>(null)
	const [channel, setChannel] = useState<any | null>(null)
	const [myChannelUser, setMyChannelUser] = useState<any | null>(null)
	const [newMessage, setNewMessage] = useState("") // deprecated
	const [messages, setMessages] = useState<Message[] | null>(null)
	const [isLoading, setIsLoading] = useState(false)
	const [error, setError] = useState<string | null>(null)
	const [warning, setWarning] = useState<string | null>(null)

	const [showChannelEditForm, setShowChannelEditForm] = useState(false)

	// # Initial Fetch channel and messages
	useEffect(() => {
		if (selectedChanId > 0) {
			setIsLoading(true)
			setError(null)
			setWarning(null)
			apiFetchChannel(selectedChanId).then((response: any) => {
				//console.log("response", response)
				if (response.error) {
					setError(response.error)
				} else if (response.warning) {
					setWarning(response.warning)
				} else {
					setChannel(response.channel)
					setMessages(response.channel.messages)
					setMyChannelUser(
						response.channel?.channelUsers.find((chanUser: any) => chanUser.user.id === auth.id) || null
					)
				}
				setIsLoading(false)
			})
		}
	}, [selectedChanId])

	// # subscribeToChannel : Listen to "infoChannel_<selectedChanId>"
	useEffect(() => {
		if (!socketIsConnected) return

		subscribeToChannel(selectedChanId, (err: any, data: any) => {
			handleReceivedInfo(data)
			//handleReceivedMessage(data)
		})
		return () => {
			// todo
		}
		function handleReceivedInfo(data: any) {
			if (data && data.type) {
				if (data.type === "MESSAGE") handleReceivedMessage(data.message)
				else if (data.type === "CHANNEL_UPDATED") {
					setChannel(data.channel)
					setMessages(data.channel.messages)
					setMyChannelUser(
						data.channel?.channelUsers.find((chanUser: any) => chanUser.user.id === auth.id) || null
					)
					setError(null)
					setWarning(null)
					//console.log("🍄 newChannel : ", channel)
				}
			} else {
				//console.log(" handleReceivedInfo - ERROR TYPE ", data)
			}
		}
		function handleReceivedMessage(receivedMessage: Message) {
			//console.log("🌶 handleReceivedMessage", receivedMessage)
			if (receivedMessage) {
				if (messages) {
					//console.log("🌶🌶🌶 handleReceivedMessage", receivedMessage)
					const newMessages2 = [...messages, receivedMessage]
					//console.log("newMessages2;", newMessages2)
					setMessages(newMessages2)
					//console.log("messages;", messages)
				}
			}
		}
	}, [socketIsConnected, selectedChanId, channel, messages, isLoading]) // !! 		+ messages reload pusieurs fois

	useEffect(() => {
		scrollToBottom()
	}, [messages])

	const scrollToBottom = () => {
		messagesContainerRef.current?.scrollTo({
			top: messagesContainerRef.current.scrollHeight,
			behavior: "smooth", // Utilisez "auto" si vous ne voulez pas d'animation de défilement
		})
	}
	// depreciated
	function sendNewMessage() {
		sendMessageToChannel({ creatorId: auth.id, channelId: selectedChanId, content: newMessage })
		setNewMessage("")
	}

	return (
		<>
			{showChannelEditForm && !error && (
				<ChannelFormEdit setShowChannelEditForm={setShowChannelEditForm } channel={channel} />
			)}
			<ChannelContainerRender
				className={className}
				channel={channel}
				selectedChanId={selectedChanId}
				allRelations={allRelations}
				allUsers={allUsers}
				channels={channels}
				isLoading={isLoading}
				error={error}
				warning={warning}
				myChannelUser={myChannelUser}
				messages={messages}
				messagesContainerRef={messagesContainerRef}
				newMessage={newMessage} // depreciated
				setNewMessage={setNewMessage} // depreciated
				sendNewMessage={sendNewMessage}
				setShowChannelEditForm={setShowChannelEditForm}
			/>
		</>
	)
}
