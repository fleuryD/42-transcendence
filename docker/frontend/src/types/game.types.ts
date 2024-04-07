// ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■

import { User } from "."

// ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■

export type Tournament = {
	id: number
}

export type Partie = {
	id: number
}

export type GameQueue = {
	id: number
	createdAt: string
	userId: number
	user: User
}

export type Queue = {
	id: number
	//content: string
	createdAt: string
	userId: number
	userName: string | null
	//creatorId: number
	//creatorName?: string
}
