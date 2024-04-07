// ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■

import React from "react"
import styled from "styled-components"
import { Message } from "types"
import UserLink from "features/users/UserLink"
import { useAppSelector } from "store/store"
import { FaGamepad } from "react-icons/fa"
import { Button } from "react-bootstrap"
import { acceptInvitationToPlay } from "utils/socketio.service"

// ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■

type Props = {
	messages: Message[] | null
	messagesContainerRef: any
}

export default function MessagesContainer({ messages, messagesContainerRef }: Props) {
	const auth = useAppSelector((state) => state.auth)
	const sortedMessages = messages?.sort((p1, p2) => (p1.id > p2.id ? 1 : p1.id < p2.id ? -1 : 0))
	return (
		<StyledChatContainer ref={messagesContainerRef} className="col-12">
			{sortedMessages &&
				sortedMessages.map((msg) => {
					if (msg.muted && msg.user.id !== auth.id) return null

					return (
						<StyledMessage key={msg.id}>
							<div className="msg-creatorId">{msg.user && <UserLink user={msg.user} />}</div>
							<div className="msg-createdAt">{msg.createdAt.slice(11, 19)}</div> &nbsp;
							{msg.content === "INVITATION_TO_PLAY" ? (
								<InvitationToPlayContent msg={msg} />
							) : (
								<div className="msg-content">{msg.content}</div>
							)}
						</StyledMessage>
					)
				})}
		</StyledChatContainer>
	)

	function InvitationToPlayContent({ msg }: { msg: Message }) {
		if (msg.user.id === auth.id)
			return (
				<>
					<FaGamepad /> You sent an invitation to play
				</>
			)
		return (
			<>
				<FaGamepad />
				<StyledAcceptButton onClick={() => acceptInvitationToPlay(msg.user.id, msg.channel?.id)}>Play with {msg.user.name}</StyledAcceptButton>
			</>
		)
	}
}

// 〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓〓	STYLED_COMPONENTS

const StyledAcceptButton = styled(Button)`
	background-color: #00000000 !important;
	box-shadow: none !important;
	margin-left: 20px !important;
	backdrop-filter: none;

	&:hover {
		transform: scale(1.02) !important;
	}
`

const StyledMessage = styled.div`
	border-bottom: 2px solid black;
	background-color: #ffffff07;
	padding: 5px;
	margin: 2px;
	height: auto !important;
	border-radius: 10px;
	margin-bottom: 5px;

	text-align: left;

	* {
		color: #ffffffdd !important;
		font-size: 15px;
	}

	div {
		display: inline-block;
		margin-right: 5px;
	}

	.msg-id {
	}

	.msg-createdAt {
		width: 75px;
		text-align: center;
		float: right;
		margin-top: 5px;
	}

	a {
	}

	.msg-content {
		width: 100%;
		margin-top: 5px;
		padding: 0px 5px;
		word-wrap: break-word;
		white-space: pre-wrap;
	}
`

const StyledChatContainer = styled.div`
	border: 3px double #DDDDDD;
	height: 40vh !important;
	background-color: #FF000008;
	border-radius: 15px;
	padding: 10px;
	margin: 20px;
	overflow: scroll;
	width: calc(100% - 40px);

`
