// ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■

import React from "react"
//import styled from "styled-components"
import UserLink from "features/users/UserLink"
import ZCadre from "ui/ZCadre"
import { useAppSelector } from "store/store"
import ButtonUserFriend from "features/users/ButtonUserFriend"
import ButtonUserBlock from "features/users/ButtonUserBlock"
import ButtonUserCreatePrivateDiscussion from "features/chat/ButtonUserCreatePrivateDiscussion"
import ChannelUserAdminContextMenu from "./ChannelUserAdminContextMenu"
import styled from "styled-components"

// ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■

type Props = {
	channel: any
	allRelations: any[]
	allUsers: any[]
	channels: any[]
}

export default function ChannelUsers({ channel, allRelations, allUsers, channels }: Props) {
	const auth = useAppSelector((state) => state.auth)

	const isAdmin = channel?.channelUsers.find((chanUser: any) => chanUser.user.id === auth.id)?.isAdmin

	//console.log("**********ALL USERS, ", allUsers)

	return (
		<StyledChannelUsersZCadre className="">
			<h5>Channel Users</h5>
			{channel?.channelUsers.map((chanUser: any) => {
				const userStatus = allUsers.find((u) => u.id === chanUser.user.id)?.status || null
				//console.log("**********chanUser.user.id, ", chanUser.user.id)
				//console.log("**********userStatus,<" + userStatus + ">")

				return (
					<div key={"ex" + chanUser.id}>
						<UserLink user={chanUser.user} />
						{chanUser.user.id === auth.id && " (ME)"}
						<ChannelUserAdminContextMenu channelUser={chanUser} channel={channel} isAdmin={isAdmin} />

						{chanUser.user.id != auth.id &&<ButtonUserFriend user={chanUser.user} allRelations={allRelations} /> }
						{chanUser.user.id != auth.id &&<ButtonUserBlock user={chanUser.user} allRelations={allRelations} /> }
						{chanUser.user.id != auth.id &&<ButtonUserCreatePrivateDiscussion user={chanUser.user} channels={channels} /> }
						{chanUser.isOwner && " (owner)"}
						{chanUser.isAdmin && " (admin)"}
						{chanUser.isBanned && " (banned)"}
						{chanUser.isKicked && " (kicked)"}
						{chanUser.endMutedAt && " (Muted until " + chanUser.endMutedAt + ")"}
						{(userStatus === "ONLINE" || chanUser.user.id === auth.id) && (
							<span className="text-success"> 🟢 Online</span>
						)}
						{userStatus === "OFFLINE" && <span className="text-secondary"> ⚫ Offline</span>}
						{userStatus === "PLAYING" && <span className="text-danger"> 🔴 Playing</span>}
						{userStatus === "AFK" && <span className="text-warning"> 🟠 AFK</span>}
					</div>
				)
			})}
		</StyledChannelUsersZCadre>
	)
}

const StyledChannelUsersZCadre = styled(ZCadre)`
width: calc(100% - 40px);
	max-width: 1000px;
	margin: 0 auto;
	padding: 20px;

	border-radius: 10px;

	background-color: #00000018;
	backdrop-filter: blur(3px);
	border: solid 1px #ffffff44;

	margin-top: 20px;
	margin-bottom: 20px;
`
