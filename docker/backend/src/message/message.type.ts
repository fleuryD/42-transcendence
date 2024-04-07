import { Channel } from "src/channel/channel.entity"

type TMessage = {
	id: number
	content: string
	createdAt: string
	creatorName?: string
	channelId?: number | null // todo: relation Channel
	channel: Channel | null // todo: relation Channel
	// channel: Channel
}

export default TMessage
