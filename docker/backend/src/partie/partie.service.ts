// ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
import { NotFoundException } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { Repository } from "typeorm"
import { Partie } from "./partie.entity"
// import { PartieGateway } from "./partie.gateway"

// ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■

export class PartieService {
	constructor(
		@InjectRepository(Partie)
		private partieRepository: Repository<Partie>
	) {}

	async createPartie(user1Id: number, user2Id: number, user1Name: string, user2Name: string) {
		console.log("MESSAGE.SERVICE ::::  createPartie")

		const newPartie = await this.partieRepository.create({
			user1Id,
			user2Id,
			user1Name,
			user2Name,
			ended: false,
		})

		await this.partieRepository.save(newPartie)
		return newPartie
	}

	async getAllParties() {
		const parties = this.partieRepository.find()
		return parties
	}

	async getPartieById(id: number) {
		const partie = await this.partieRepository.findOne({
			where: {
				id: id,
			},
		})
		if (partie) {
			return partie
		}
		throw new NotFoundException("Could not find the game")
	}

	async endGame(gameId: number, score1: number, score2: number) {
		const partie = await this.getPartieById(gameId)

		if (partie) {
			partie.ended = true
			partie.score1 = score1
			partie.score2 = score2
			this.partieRepository.save(partie)
			return partie
		}
		throw new NotFoundException("Could not find the game")
	}

	async getMatchHistory(userId: number) {
		const parties = await this.partieRepository.find({
			where: [{ user1Id: userId }, { user2Id: userId }],
		})
		return parties
	}
}
