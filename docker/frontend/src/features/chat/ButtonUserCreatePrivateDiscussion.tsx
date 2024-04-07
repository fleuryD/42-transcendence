// ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
import React from "react"
import { useAppSelector } from "store/store"
import { Channel, User, ChannelUser } from "types"
import { Button } from "react-bootstrap"
import { createPrivateDiscussion } from "utils/socketio.service"

// ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■

export default function ButtonUserCreatePrivateDiscussion({ user, channels }: { user: User; channels: Channel[] }) {
	const auth = useAppSelector((state) => state.auth)

	if (auth.id === user.id) return null

	const exisingPirvateDiscussion = channels.find((chan) => {
		return (
			chan.isPrivateDiscussion &&
			chan.channelUsers.filter((cu: ChannelUser) => cu.user.id === auth.id).length > 0 &&
			chan.channelUsers.filter((cu: ChannelUser) => cu.user.id === user.id).length > 0
		)
	})

	if (exisingPirvateDiscussion) return null

	return (
		<Button className="btn-info btn-xs" onClick={() => createPrivateDiscussion(user.id)}>
			private messages
		</Button>
	)
}
