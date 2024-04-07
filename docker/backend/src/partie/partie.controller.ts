// ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■

import { Body, Controller, Get, Param, Post } from "@nestjs/common"
import { Partie } from "./partie.entity"
import { PartieService } from "./partie.service"

// ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■

@Controller("game/parties")
export class PartiesController {
	constructor(private readonly partieService: PartieService) {}

	@Post("matchHistory")
	async getMatchHistory(@Body("id") id: number) {

		let matchHistorySort = { history: [], win: 0, lose: 0, draw: 0 }

		let matchHistory = await this.partieService.getMatchHistory(id)

		for (let i = 0; i < matchHistory.length; i++) {
			if (matchHistory[i].user1Id != id && matchHistory[i].user2Id != id)
				continue
			if (matchHistory[i].score1 > matchHistory[i].score2 && matchHistory[i].user1Id == id) {
				matchHistorySort.win++
				matchHistorySort.history.push({me: matchHistory[i].user1Name, vs: matchHistory[i].user2Name, scoreMe: matchHistory[i].score1, scoreHim: matchHistory[i].score2})
			}
			if (matchHistory[i].score1 < matchHistory[i].score2 && matchHistory[i].user2Id == id) {
				matchHistorySort.win++
				matchHistorySort.history.push({me: matchHistory[i].user2Name, vs: matchHistory[i].user1Name, scoreMe: matchHistory[i].score2, scoreHim: matchHistory[i].score1})
			}
			if (matchHistory[i].score1 < matchHistory[i].score2 && matchHistory[i].user1Id == id) {
				matchHistorySort.lose++
				matchHistorySort.history.push({me: matchHistory[i].user1Name, vs: matchHistory[i].user2Name, scoreMe: matchHistory[i].score1, scoreHim: matchHistory[i].score2})
			}
			if (matchHistory[i].score1 > matchHistory[i].score2 && matchHistory[i].user2Id == id) {
				matchHistorySort.lose++
				matchHistorySort.history.push({me: matchHistory[i].user2Name, vs: matchHistory[i].user1Name, scoreMe: matchHistory[i].score2, scoreHim: matchHistory[i].score1})
			}
			if (matchHistory[i].score1 == matchHistory[i].score2 && matchHistory[i].user1Id == id) {
				matchHistorySort.draw++
				matchHistorySort.history.push({me: matchHistory[i].user1Name, vs: matchHistory[i].user2Name, scoreMe: matchHistory[i].score2, scoreHim: matchHistory[i].score1})
			}
			if (matchHistory[i].score1 == matchHistory[i].score2 && matchHistory[i].user2Id == id) {
				matchHistorySort.draw++
				matchHistorySort.history.push({me: matchHistory[i].user2Name, vs: matchHistory[i].user1Name, scoreMe: matchHistory[i].score2, scoreHim: matchHistory[i].score1})
			}
		}
		return matchHistorySort
	}

	@Post("endGame")
	async endGame(
		@Body("gameId") gameId: number,
		@Body("score1") score1: number,
		@Body("score2") score2: number,
	) {
		const game = await this.partieService.endGame(Number(gameId), Number(score1), Number(score2))
		return game
	}

	@Post()
	async createPartie(
		@Body("user1Id") user1Id: number,
		@Body("user2Id") user2Id: number,
		@Body("user1Name") user1Name: string,
		@Body("user2Name") user2Name: string
	) {
		const newPartie = await this.partieService.createPartie(user1Id, user2Id, user1Name, user2Name)
		return newPartie
	}

	@Get()
	async getAllParties(): Promise<Partie[]> {
		const parties = await this.partieService.getAllParties()
		return parties
	}

	@Get(":id")
	async getPartieById(@Param("id") id: string): Promise<Partie> {
		const partie = await this.partieService.getPartieById(Number(id))
		return partie
	}
}
