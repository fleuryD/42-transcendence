// ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■

import React, { useState } from "react"

import { Channel, ChannelUser, Message } from "types"
import ZCadre from "ui/ZCadre"
import MessagesContainer from "./MessagesContainer"

import ChannelUsers from "../channelUsers/ChannelUsers"

import {
	ButtonChannelDelete,
	ButtonChannelEdit,
	ButtonChannelJoin,
	ButtonChannelQuit,
} from "features/chat/ButtonsChannel"
import ZLoading from "ui/ZLoading"
import MessageForm from "./MessageForm"

// ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■

type Props = {
	className: string
	channel: Channel
	selectedChanId: number
	allRelations: any[]
	allUsers: any[]
	channels: any[]
	isLoading: boolean
	error: string | null
	warning: string | null
	myChannelUser: ChannelUser | null
	messages: Message[] | null
	messagesContainerRef: any
	newMessage: string
	setNewMessage: (v: string) => any
	sendNewMessage: () => any
	setShowChannelEditForm: (v: boolean) => any
}
export default function ChannelContainerRender({
	className,
	channel,
	selectedChanId,
	allRelations,
	allUsers,
	channels,
	isLoading,
	error,
	warning,
	myChannelUser,
	messages,
	messagesContainerRef,
	newMessage,
	setNewMessage,
	sendNewMessage,
	setShowChannelEditForm,
}: Props) {
	const [inputPassword, setInputPassword] = useState("")

	if (selectedChanId === 0) {
		return <ZCadre className={className}>Selectionnez un channel !</ZCadre>
	}

	if (isLoading) {
		return (
			<ZCadre className={className}>
				<ZLoading message="Loading channel" />
			</ZCadre>
		)
	}

	if (
		(warning && warning === "WARNING_CHANNEL_IS_PASSWORD_PROTECTED") ||
		(!myChannelUser?.accepted && channel?.password)
	) {
		return (
			<ZCadre className={className}>
				<p className="text-danger">This chan is protected by a password.</p>
				<input value={inputPassword} onChange={(e) => setInputPassword(e.target.value)} />
				<ButtonChannelJoin channelId={selectedChanId} password={inputPassword} />
			</ZCadre>
		)
	}

	if ((warning && warning === "WARNING_USER_NOT_A_MEMBER_OF_THIS_CHANNEL") || !myChannelUser) {
		return (
			<ZCadre className={className}>
				<p className="text-danger">You're not a member of this Channel !</p>
				<ButtonChannelJoin channelId={selectedChanId} password={null} />
			</ZCadre>
		)
	}
	if ((warning && warning === "WARNING_USER_BANNED_OF_THIS_CHANNEL") || myChannelUser.isBanned) {
		return (
			<ZCadre className={className}>
				<p className="text-danger">You're BANNED of this Channel !</p>
			</ZCadre>
		)
	}
	if (error) {
		return <ZCadre className={className}>ERROR : {error}</ZCadre>
	}
	if (warning) {
		return <ZCadre className={className}>WARNING : {warning}</ZCadre>
	}
	if (channel.isPrivate && !myChannelUser.accepted) {
		return (
			<ZCadre className={className}>
				<p className="text-danger">This chan is private. An admin needs to accept you.</p>
			</ZCadre>
		)
	}

	return (
		<ZCadre className={className}>
			<div className="cadreTitle">
				Channel #{selectedChanId}: {channel?.name}
			</div>
			<div>
				Access: {channel?.isPrivate ? "Private" : "Public"}
				&nbsp;&nbsp;&nbsp;&nbsp; Password : {channel?.password ? "YES" : "NO"}
				&nbsp;&nbsp;&nbsp;&nbsp; Admin : {myChannelUser.isOwner ? "YES" : "NO"}
			</div>
			<div className="buttonList">
				{myChannelUser.isOwner && (
					<>
						<ButtonChannelDelete channelId={channel.id} />
						<ButtonChannelEdit channelId={channel.id} setShowChannelEditForm={setShowChannelEditForm} />
					</>
				)}
				<ButtonChannelQuit channelId={channel.id} />
			</div>
			<div className="p-2">
				{messages && <MessagesContainer messages={messages} messagesContainerRef={messagesContainerRef} />}
				<MessageForm channelId={channel.id} />
			</div>

			<ChannelUsers channel={channel} allRelations={allRelations} allUsers={allUsers} channels={channels} />
		</ZCadre>
	)
}
