// ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■

import { Logger } from "@nestjs/common"
import {
	OnGatewayConnection,
	OnGatewayDisconnect,
	OnGatewayInit,
	SubscribeMessage,
	WebSocketGateway,
	WebSocketServer,
} from "@nestjs/websockets"
import { Server, Socket } from "socket.io"
import { QueueService } from "./queue.service"
import TQueue from "./queue.type"
// ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■

@WebSocketGateway({ cors: true })
export class QueueGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
	constructor(private readonly queueService: QueueService) {}

	private logger: Logger = new Logger("QueueGateway")

	@WebSocketServer() wss: Server

	afterInit(server: Server) {
		this.logger.log("🕧 Initialized")
	}

	handleDisconnect(client: Socket) {
		this.logger.log(`🕧 queue.gateway   Client Disconnected: ${client.id}`)
	}

	handleConnection(client: Socket, ...args: any[]) {
		this.logger.log(`🕧 queue.gateway   Client Connected: ${client.id}`)
	}

	/*
	@SubscribeMessage("sendQueue")
	async handleSendQueue(client: Socket, payload: TQueue): Promise<void> {
		this.logger.log(`---SubscribeQueue ''sendQueue'': ${client.id} --> ${payload}`)

		const newQueue = await this.queueService.createQueue(payload.userId)
		this.wss.emit("receiveQueue", newQueue)
	}
	*/

	@SubscribeMessage("joinQueue")
	async handleJoinQueue(client: Socket, payload: TQueue): Promise<void> {
		this.logger.log(`🕧 SubscribeQueue ''joinQueue'': ${client.id} --> ${payload}`)

		const newQueue = await this.queueService.createQueue(payload.userId)
		this.wss.emit("receiveQueue", newQueue)
	}

	@SubscribeMessage("quitQueue")
	async handleQuitQueue(client: Socket, payload: TQueue): Promise<void> {
		this.logger.log(`🕧 SubscribeQueue ''quitQueue'': ${client.id} --> ${payload}`)

		//const newQueue = await this.queueService..findAll({ userId: payload.userId }

		const newQueue = await this.queueService.deleteQueueByUserId(payload.userId)

		//await myDataSource.createQueryBuilder("users").delete().from(User).where("id = :id", { id: 1 }).execute()
		//this.wss.emit("receiveQueue", newQueue)
		//return res.status(HttpStatus.OK).json(newQueue)

		//const newQueue = await this.queueService.createQueue(payload.userId)
		this.wss.emit("receiveQueue", newQueue)
	}

	@SubscribeMessage("sendMyInGameData")
	async sendMyInGameData(client: Socket, payload: any): Promise<void> {
		this.logger.log(`🕧 sendMyInGameData : ${client.id} --> ${payload}`)

		//const newQueue = await this.queueService.createQueue(payload.userId)
		this.wss.emit(`receivesInGameData_${payload.partieId}`, payload)
	}

	@SubscribeMessage("pingUser")
	async pingUser(client: Socket, payload: any): Promise<void> {
		//const newQueue = await this.queueService.createQueue(payload.userId)
		this.wss.emit("recvPong", payload)
	}
}
