// ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■

import React, { useEffect } from "react"
import ZPage from "ui/ZPage"

import ChannelsList from "features/chat/ChannelsList/ChannelsList"
import ChannelContainer from "features/chat/selectedChannel/ChannelContainer"
import { Channel } from "types"
import styled from "styled-components"
import { sendNavigate } from "utils/socketio.service"
import "./PageChatRender.scss"

// ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■

type Props = {
	selectedChanId: number
	channels: Channel[] | null
	isLoadingChannels: boolean
	errorStrChannels: string | null
	setShowChannelForm: (v: boolean) => any
	allRelations: any[] | null
	allUsers: any[] | null
}

export default function PageChatRender({
	selectedChanId,
	channels,
	isLoadingChannels,
	errorStrChannels,
	setShowChannelForm,
	allRelations,
	allUsers,
}: Props) {
	return (
		<StyledChatZPage documentTitle="Chat">
			<div className="channel">
				{allRelations && channels && allUsers && (
					<ChannelContainer
						className=""
						selectedChanId={selectedChanId}
						allRelations={allRelations}
						allUsers={allUsers}
						channels={channels}
					/>
				)}
			</div>
			<div className="channels">
				<div className="">
					<ChannelsList
						className=""
						selectedChanId={selectedChanId}
						channels={channels}
						isLoadingChannels={isLoadingChannels}
						errorStrChannels={errorStrChannels}
						setShowChannelForm={setShowChannelForm}
					/>
				</div>
			</div>
		</StyledChatZPage>
	)
}

const StyledChatZPage = styled(ZPage)`
	background-color: transparent !important;
	color: white;
	text-align: center;
	font-family: "customFont1", sans-serif;
	border: none !important;
`
