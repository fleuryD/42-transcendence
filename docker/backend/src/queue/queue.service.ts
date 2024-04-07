// ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■

import { NotFoundException, Injectable } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { Repository } from "typeorm"
import { Queue } from "./queue.entity"
import { Partie } from "../partie/partie.entity"
import { QueueGateway } from "./queue.gateway"

import { UserService } from "../user/user.service"

// ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■

@Injectable()
export class QueueService {
	constructor(
		@InjectRepository(Queue)
		private queueRepository: Repository<Queue>,
		@InjectRepository(Partie)
		private partieRepository: Repository<Partie>,
		private userService: UserService
	) {}

	async getAllQueues() {
		console.log("queue.SERVICE ::::  getAllQueues ")
		const queues = this.queueRepository.find()
		return queues
	}

	async getQueueById(id: number) {
		const queue = await this.queueRepository.findOne({
			where: { id: id },
		})
		if (queue) {
			return queue
		}
		throw new NotFoundException("Could not find the queue")
	}

	// * Quand un user clique sur "JOIN"
	async createQueue(userId: number) {
		console.log("queue.SERVICE ::::  createQueue --> ", userId)

		// * Si il est déjà dans la queue
		const existingQueue = await this.queueRepository.findOne({
			where: { userId: userId },
		})
		if (existingQueue) {
			return { type: "ALREADY_IN_QUEUE", userId: userId }
		}

		const user = await this.userService.getUserById(userId)

		// * Si il y avait déjà 1 joueur dans la queue (on va créer une partie)
		const queuesOne = await this.queueRepository.find()
		if (queuesOne.length > 0) {
			const userId1 = queuesOne[0].userId
			const userName1 = queuesOne[0].userName

			// delete the 2 queues:
			await this.deleteQueueByUserId(queuesOne[0].userId)
			await this.deleteQueueByUserId(userId)

			// ! Je suis oblidgé de filtrer sinon, les removes ne sont pas pris en compte
			// ! WTF !!!!
			const newQueues = (await this.queueRepository.find()).filter(
				(queue) => queue.userId !== userId && queue.userId !== userId1
			)

			const newPartie = await this.partieRepository.create({
				user1Id: userId1,
				user2Id: userId,
				user1Name: userName1,
				user2Name: user.name,
			})
			await this.partieRepository.save(newPartie)

			return {
				type: "2_PLAYERS_IN_QUEUE",
				partie: newPartie,
				partieId: 666,
				user1: userId1,
				user2: userId,
				queues: newQueues,
			}
		}

		// * Si il n'y avait pas de joueur dans la queue, on l'ajoute
		const newQueue = await this.queueRepository.create({ userId, userName: user.name })
		await this.queueRepository.save(newQueue)

		// * On renvoit toutes les queues
		//return { type: "JOIN", queue: newQueue }
		const queues = await this.queueRepository.find()
		return { type: "JOIN", queues: queues }
	}

	async deleteQueueByUserId(userId: number) {
		console.log("queue.SERVICE ::::  deleteQueueByUserId --> ", userId)

		const queuesToDelete = await this.queueRepository.findBy({ userId: userId })
		//const queuesToDelete = await this.queueRepository.find()

		queuesToDelete.forEach(async (queue) => {
			await this.queueRepository.remove(queue)
		})

		//await this.queueRepository.remove(queuesToDelete)
		//const newQueue = await this.queueRepository.delete(({ userId:userId })
		//const newQueue = await this.queueRepository.create({ userId })

		// ! Je suis oblidgé de filtrer sinon, les removes ne sont pas pris en compte
		// ! WTF !!!!
		const queues = (await this.getAllQueues()).filter((queue) => queue.userId !== userId)
		return { type: "QUIT", queues: queues }
	}
}
