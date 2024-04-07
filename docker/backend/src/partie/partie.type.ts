type TPartie = {
	id: number
	createdAt: string
	user1Id: number
	user2Id?: number
	user1Name?: string
	user2Name?: string
	ended?: boolean
	score1?: number
	score2?: number
}

export default TPartie
