// ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■

import { User } from "."

// ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■

export type ChannelUser = {
	id: number
	channel: Channel
	user: User
	accepted: boolean
	isBanned: boolean
	isOwner: boolean
	endMutedAt: any | null
	isAdmin: any | null
}
export type Channel = {
	id: number
	owner: User
	admins: User[]
	name: string
	password?: string // + isProtected ?
	isPrivate: boolean
	isPrivateDiscussion: boolean
	isPasswordProtected: boolean
	messages?: Message[] | null
	channelUsers: ChannelUser[]
}

export type Message = {
	id: number
	content: string
	createdAt: string
	creatorId: number // depreciated
	user: User
	// creatorName?: string
	channelId?: number | null // depreciated ???????????/
	channelIdTemp?: number | null
	channel?: Channel | null
	muted?: boolean
}
