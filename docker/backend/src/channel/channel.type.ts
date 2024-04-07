/* eslint-disable prettier/prettier */
// ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
// import { Message } from "src/message/message.entity"
import { User } from "src/user/user.entity"
// ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■

type TChannel = {
	id: number
	createdAt: string
	ownerId: number // on le garde  pour la creation du channel
	owner: User
	isPrivate?: boolean
	name: string
	password?: string | null
	// messages: Message[]

	// TODO : password (nullable, encrypted)
	// TODO : admins
	// TODO : expulsed, banned, muted
}

export default TChannel
