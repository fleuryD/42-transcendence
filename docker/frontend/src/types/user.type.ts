// ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■

// import { Message, Partie, User } from "."
// USE:     	import { User } from "types"

// ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■

type User = {
	id: number
	email: string
	name: string // username
	nickname: string
	status: "ONLINE" | "OFFLINE" | "PLAYING" | "AFK"
	avatarLink: string
	doubleAuthSecret: string
	doubleAuthActive: boolean
}

export default User
