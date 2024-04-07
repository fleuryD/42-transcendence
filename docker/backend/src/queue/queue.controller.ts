// ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■

import { Body, Controller, Get, Param, Post } from "@nestjs/common"
import { Queue } from "./queue.entity"
import { QueueService } from "./queue.service"

// ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■

@Controller("queues")
export class QueuesController {
	constructor(private readonly queueService: QueueService) {}

	@Post("join")
	async createQueue(@Body("userId") userId: number) {
		const newQueue = await this.queueService.createQueue(userId)
		return newQueue
	}
	@Get()
	async getAllQueues(): Promise<Queue[]> {
		const queues = await this.queueService.getAllQueues()
		return queues
	}

	@Get(":id")
	async getQueueById(@Param("id") id: string): Promise<Queue> {
		const queue = await this.queueService.getQueueById(Number(id))
		return queue
	}
}
