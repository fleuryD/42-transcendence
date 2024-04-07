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
import { PartieService } from "./partie.service"
import TPartie from "./partie.type"
import { UserService } from "src/user/user.service"
import { User } from "src/user/user.entity"
import { MessageService } from "src/message/message.service"

// ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■

@WebSocketGateway({ cors: true })
export class PartieGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
	constructor(
		private readonly partieService: PartieService,
		private readonly userService: UserService,
		private readonly messageService: MessageService
	) {}

	private logger: Logger = new Logger("PartieGateway")

	@WebSocketServer() wss: Server

	/*
	 *
	 * La methode qui permet de trouver un user à partir du Bearer token dans les headers
	 * // TODO : A mettre ailleurs pour l'utiliser partout
	 *
	 */
	private async getUserAndErrorFromSocketClient(
		client: Socket
	): Promise<{ user: User | null; error: string | null }> {
		const userToken = client?.handshake?.headers?.authorization || null
		if (!userToken) return { user: null, error: "ERROR_NO_JWT" }

		const user = await this.userService.findOne({ where: { jwt: userToken } })
		if (!user) return { user: null, error: "ERROR_JWT_USER_NOT_FOUND" }
		return { user, error: null }
	}

	afterInit(server: Server) {
		this.logger.log("🏓 Initialized")
	}

	handleDisconnect(client: Socket) {
		////this.logger.log(`🏓 Client Disconnected: ${client.id}`)
	}

	handleConnection(client: Socket, ...args: any[]) {
		////this.logger.log(`🏓 Client Connected: ${client.id}`)
	}

	//*■■■■■■■■■■■■■■■■■■■■■■■ XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

	@SubscribeMessage("sendPartie")
	async handleSendPartie(client: Socket, payload: TPartie): Promise<void> {
		this.logger.log(`🏓 SubscribePartie: ${client.id} --> ${payload}`)

		const newPartie = await this.partieService.createPartie(
			payload.user1Id,
			payload.user2Id,
			payload.user1Name,
			payload.user2Name
		)
		this.wss.emit("receivePartie", newPartie)
	}

	@SubscribeMessage("acceptInvitationToPlay")
	async acceptInvitationToPlay(client: Socket, payload: { otherUserId: number; channelId: number }): Promise<void> {
		this.logger.log(` acceptInvitationToPlay : with  #${payload.otherUserId} -  TODO   -`)

		const { user, error } = await this.getUserAndErrorFromSocketClient(client)
		if (error) {
			this.logger.log(`😺 acceptInvitationToPlay ❌ user not found with this clientId !!!!!`)
			return
		}
		const otherUser = await this.userService.findOne({ where: { id: payload.otherUserId } })
		if (!otherUser) {
			this.logger.log(`😺 acceptInvitationToPlay : ❌ otherUser not found with this token !!!!!`)
			return
		}
		// TODO : supprimer les queues de ces 2 users ( sil y en a)

		// * supprimer tous les messages d'invitation a jouer des 2 users sur tous les channels
		await this.messageService.deleteAllMessagesInvitationsFromUser(user)
		await this.messageService.deleteAllMessagesInvitationsFromUser(otherUser)

		const newPartie = await this.partieService.createPartie(user.id, otherUser.id, user.name, otherUser.name)

		//const newQueue = await this.queueService.createQueue(payload.userId)
		this.wss.emit("InvitationToPlay", newPartie)
		this.wss.emit("infoChat", {
			type: "INVITATION_TO_PLAY_ACCEPTED",
			partie: newPartie,
		})
	}
}
