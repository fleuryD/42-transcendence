/* eslint-disable prettier/prettier */
// ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■

import { Logger } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { Repository } from "typeorm"
import {
	OnGatewayConnection,
	OnGatewayDisconnect,
	OnGatewayInit,
	SubscribeMessage,
	WebSocketGateway,
	WebSocketServer,
} from "@nestjs/websockets"
import TChannel from "./channel.type"
import { Server, Socket } from "socket.io"
import { ChannelService } from "./channel.service"
import { MessageService } from "src/message/message.service"

import { UserService } from "src/user/user.service"
import { ChannelUserService } from "src/channelUser/channelUser.service"
import { User } from "src/user/user.entity"
import { UserRelationService } from "src/userRelation/userRelation.service"

// ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■

// 😺 🏓🕧😀

@WebSocketGateway({ cors: true })
export class ChannelGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
	constructor(
		@InjectRepository(User) private readonly userRepository: Repository<User>,
		private readonly channelService: ChannelService,
		private readonly channelUserService: ChannelUserService,
		//private readonly channelUserRepository: ChannelUserRepository,
		private readonly userService: UserService,
		private readonly messageService: MessageService,
		private readonly userRelationService: UserRelationService
	) {}

	private logger: Logger = new Logger("ChannelGateway")

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

	//*■■■■■■■■■■■■■■■■■■■■■■■ XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

	afterInit(server: Server) {
		this.logger.log("😺 Initialized")
	}

	async handleConnection(client: Socket, ...args: any[]) {
		const userToken = client?.handshake?.headers?.authorization || null
		if (!userToken) {
			this.logger.log(`😺 handleConnection : Client ${client.id} ❌ No authorization in header !!!!!`)
			return
		}
		const user = await this.userService.findOne({ where: { jwt: userToken } })
		if (!user) {
			this.logger.log(`😺 handleConnection : Client ${client.id} ❌ user not found with this token !!!!!`)
			return
		}
		this.logger.log(`😺 Client Connected 🟢 ${client.id} >> user:{ #${user.id}, "${user.name}"}`)
		user.status = "ONLINE"
		user.clientId = client.id
		await this.userRepository.save(user)
		this.wss.emit("USERS_STATUS", { user: user })
		//this.logger.log(`😺 Client Connected: ${userToken}`)
	}

	async handleDisconnect(client: Socket) {
		const user = await this.userService.findOne({ where: { clientId: client.id } })
		if (!user) {
			this.logger.log(`😺 handleConnection : Client ${client.id} ❌ user not found with this clientId !!!!!`)
			return
		}
		this.logger.log(`😺 Client Disconnected 🔴 ${client.id} >> user:{ #${user.id}, "${user.name}"}`)
		user.status = "OFFLINE"
		user.clientId = null
		await this.userRepository.save(user)
		this.wss.emit("USERS_STATUS", { user: user })
	}

	/*
	 *
	 * Quand un user veut rejoindre un channel
	 *
	 */
	@SubscribeMessage("joinChannel")
	async joinChannel(client: Socket, payload: { channelId: number; password: string | null }): Promise<void> {
		const { user, error } = await this.getUserAndErrorFromSocketClient(client)
		if (error) return //{ error } // TODO : pas de valeur de retour, c'est un socket !!!
		console.log("🟨 ", user.name, "tries to join channel", payload.channelId)
		const channel = await this.channelService.getChannelById(payload.channelId)
		if (!channel) return //{ error: "ERROR_CHANNEL_NOT_FOUND" } // TODO : pas de valeur de retour, c'est un socket !!!

		if (channel.isPrivateDiscussion) {
			this.logger.log(`😺 createPrivateDiscussion : ❌ CAN'T JOIN PRIVATE DISCUSSION - SHOULDNT HAPPEN`)
			return
		}

		const channelUser = channel.channelUsers.find((channelUser) => channelUser.user.id === user.id)
		if (channelUser) {
			this.logger.log(`😺 joinChannel : ❌ ERROR_USER_IS_ALREADY_MEMBRE_OF_THIS_CHANNEL`)
			return
		}

		let accepted = false
		if (channel.isPasswordProtected) {
			console.log("🟨🟨🟨🟨 channel.isPasswordProtected")

			if (payload.password != channel.password) {
				this.logger.log(`😺 joinChannel : ❌ ERROR_WRONG PASSWORD - TODO envoyer une reponse`)
				return
			}
			accepted = true
		}

		const newChannelUser = await this.channelUserService.createChannelUser(channel, user, false, false, accepted)
		this.wss.emit("joinChannel" + newChannelUser)

		// * EMETTRE LA REPONSE
		const returnChannel = await this.channelService.getChannelById(payload.channelId)
		this.wss.emit("infoChannel_" + payload.channelId, {
			type: "CHANNEL_UPDATED",
			channel: returnChannel,
		})
	}

	/*
	 *
	 *
	 *
	 */
	@SubscribeMessage("quitChannel")
	async quitChannel(client: Socket, payload: { channelId: number }): Promise<void> {
		const { user, error } = await this.getUserAndErrorFromSocketClient(client)
		if (error) return //{ error } // TODO : pas de valeur de retour, c'est un socket !!!
		console.log("quitChannel ", user.name, "tries to quit channel", payload.channelId)

		const channel = await this.channelService.getChannelById(payload.channelId)
		if (!channel) return //{ error: "ERROR_CHANNEL_NOT_FOUND" } // TODO : pas de valeur de retour, c'est un socket !!!

		if (channel.isPrivateDiscussion) {
			this.logger.log(`createPrivateDiscussion : ❌ CAN'T QUIT PRIVATE DISCUSSION - SHOULDNT HAPPEN`)
			return
		}

		const channelUser = channel.channelUsers.find((channelUser) => channelUser.user.id === user.id)
		if (!channelUser) {
			this.logger.log(`quitChannel : ❌ ERROR_USER_WAS_NOT_MEMBRE_OF_THIS_CHANNEL`)
			return
		}

		await this.channelUserService.delete(channelUser)

		// * EMETTRE LA REPONSE
		// * C'est la meme que pour adminEditChannelUser
		const returnChannel = await this.channelService.getChannelById(payload.channelId)
		this.wss.emit("infoChannel_" + payload.channelId, {
			type: "CHANNEL_UPDATED",
			channel: returnChannel,
		})
	}

	// ###                             NEW - OK                                #

	/*
	 *	CHAT::	Envoyer un message sur un channel
	 *
	 */
	@SubscribeMessage("sendMessageToChannel")
	async handleSendMessageToChannel(client: Socket, payload: any): Promise<void> {
		const userToken = client?.handshake?.headers?.authorization || null
		if (!userToken) {
			this.logger.log(`😺 handleConnection : Client ${client.id} ❌ No authorization in header !!!`)
			return
		}
		const user = await this.userService.findOne({ where: { jwt: userToken } })
		if (!user) {
			this.logger.log(
				`😺 handleSendMessageToChannel : Client ${client.id} ❌ user not found with this token !!!!!`
			)
			return
		}
		const channel = await this.channelService.getChannelById(payload.channelId)
		if (!channel) {
			this.logger.log(`❌ ERROR_CHANNEL_NOT_FOUND`)
			return
		}

		const channelUser = channel.channelUsers.find((channelUser) => channelUser.user.id === user.id)

		if (!channelUser) {
			this.logger.log(`❌handleSendMessageToChannel ERROR_USER_IS_NOT_MEMBER_OF_THIS_CHANNEL`)
			return
		}

		// * verifier que le user nest pas mute
		let messageIsMuted = false
		const now = new Date()
		if (channelUser.endMutedAt) {
			if (new Date(channelUser.endMutedAt) >= now) {
				this.logger.log(`❌handleSendMessageToChannel WARNING_USER_IS_MUTED`)
				payload.content = "🔇 " + user.name + ", you are muted until " + channelUser.endMutedAt.toISOString()
				messageIsMuted = true
			} else {
				this.logger.log(`handleSendMessageToChannel 🕛TODO : unmute`)
				channelUser.endMutedAt = null
				await this.channelUserService.save(channelUser)
				const returnChannel = await this.channelService.getChannelById(payload.channelId)
				this.wss.emit("infoChannel_" + payload.channelId, {
					type: "CHANNEL_UPDATED",
					channel: returnChannel,
				})
			}
		}

		// * Si c'est un invtation a jouer supprimer tous les messages d'invitation a jouer du 2 user sur tous les channels
		if (payload.content === "INVITATION_TO_PLAY") {
			this.logger.log(`- INVIT TO PLLLLLUYYYYYYYYYYY-`)
			await this.messageService.deleteAllMessagesInvitationsFromUser(user)
		}
		// TODO : Supprimer aussi les queues

		const newMessage = await this.messageService.createMessage(user, channel, payload.content, messageIsMuted)

		console.log("🌼 sendMessageToChannel", newMessage.content)
		this.wss.emit("infoChannel_" + payload.channelId, {
			type: "MESSAGE",
			message: newMessage,
		})
	}

	/*
	 *	CHAT::	un user se fait editer par un admin
	 *
	 *
	 	payload{
			channelId, 		 // je le rajoute car je n'arrive pas a faire  channelUser.channel.channelUsers
			channelUserId,
			type:"BAN"|"KICK"|"MUTE"|"ADMIN,
			value: bolean,
			duration[nullable])
		}
	 *
	 *
	 *
	 */
	@SubscribeMessage("adminEditChannelUser")
	async handleadminEditChannelUser(
		client: Socket,
		payload: { channelId; channelUserId; type; value; duration }
	): Promise<void> {
		// * RECUPERER LE USER QUI FAIT LA DEMANDE (grace au token dans le header)
		const userToken = client?.handshake?.headers?.authorization || null
		if (!userToken) {
			this.logger.log(`😺 createChannel : Client ${client.id} ❌ No authorization in header !!!`)
			return
		}
		const connectedUser = await this.userService.findOne({ where: { jwt: userToken } })
		if (!connectedUser) {
			this.logger.log(`😺 createChannel : Client ${client.id} ❌ user not found with this token !!!!!`)
			return
		}

		// * RECUPERER LE CHANNEL_USER
		const channelUser = await this.channelUserService.getChannelUserById(payload.channelUserId)
		if (!channelUser) {
			this.logger.log(`❌ ERROR_channelUser_NOT_FOUND`)
			return
		}

		// * RECUPERER LE CHANNEL
		const channel = await this.channelService.getChannelById(payload.channelId)
		if (!channel) {
			this.logger.log(`❌ ERROR_CHANNEL_NOT_FOUND`)
			return
		}

		// * VERIFIER QUE LE CONNECTED USER EST BIEN ADMIN DU CHANNEL
		const connectedChannelUser = channel.channelUsers.find(
			(channelUser) => channelUser.user.id === connectedUser.id
		)
		if (!connectedChannelUser) {
			this.logger.log(`❌ ERROR_YOU_ARE_NOT_ADMIN_OF_THIS_CHANNEL`)
			return
		}
		if (!connectedChannelUser.isAdmin) {
			this.logger.log(`❌ ERROR_YOU_ARE_NOT_ADMIN_OF_THIS_CHANNEL`)
			return
		}

		let returnMessageStr = "⛔ " + "TodO returnMessageStr"

		// * EXECUTER
		if (payload.type === "BAN") {
			channelUser.isBanned = payload.value
			returnMessageStr =
				"⛔ " +
				channelUser.user.name +
				" was " +
				(payload.value ? "banned" : "unbanned") +
				" by " +
				connectedUser.name
		} else if (payload.type === "KICK") {
			await this.channelUserService.delete(channelUser)
			returnMessageStr = "⛔ " + channelUser.user.name + " was kicked by " + connectedUser.name
		} else if (payload.type === "ADMIN") {
			channelUser.isAdmin = payload.value
			returnMessageStr =
				(payload.value ? "🟦 " : "🟧 ") +
				channelUser.user.name +
				" was " +
				(payload.value ? "set admin" : "unset admin") +
				" by " +
				connectedUser.name
		} else if (payload.type === "MUTE") {
			if (payload.value) {
				returnMessageStr =
					"🔈 " +
					channelUser.user.name +
					" was muted by " +
					connectedUser.name +
					" for " +
					payload.duration +
					" minutes"
				channelUser.endMutedAt = new Date(Date.now() + payload.duration * 60000)
			} else {
				returnMessageStr = "🔊 " + channelUser.user.name + " was unmuted by " + connectedUser.name
				channelUser.endMutedAt = null
			}
		} else if (payload.type === "ACCEPT_IN_PRIVATE_CHAN") {
			channelUser.accepted = true
			returnMessageStr = "🟦 " + channelUser.user.name + " was accepted  by " + connectedUser.name
		} else if (payload.type === "REFUSED_IN_PRIVATE_CHAN") {
			await this.channelUserService.delete(channelUser)
			returnMessageStr = "🟦 " + channelUser.user.name + " was refused  by " + connectedUser.name
		}

		this.logger.log(
			"🌈 adminEditChannelUser :" + channelUser.user.name + " : " + payload.type + " : " + payload.value
		)

		await this.channelUserService.save(channelUser)

		await this.messageService.createMessage(connectedUser, channel, returnMessageStr, false)

		// * EMETTRE LA REPONSE
		const returnChannel = await this.channelService.getChannelById(payload.channelId)
		this.wss.emit("infoChannel_" + payload.channelId, {
			type: "CHANNEL_UPDATED",
			channel: returnChannel,
		})
	}

	/*
	 *	CHAT::	creer un channel
	 *
	 *
	 *
	 */
	// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! TODO ENCRYPT password
	@SubscribeMessage("createChannel")
	async handleCreateChannel(client: Socket, payload: TChannel): Promise<void> {
		this.logger.log(`😺 createChannel: ${client.id} --> ${payload}`)

		// * RECUPERER LE USER QUI FAIT LA DEMANDE (grace au token dans le header)
		const userToken = client?.handshake?.headers?.authorization || null
		if (!userToken) {
			this.logger.log(`😺 handleConnection : Client ${client.id} ❌ No authorization in header !!!`)
			return
		}
		const connectedUser = await this.userService.findOne({ where: { jwt: userToken } })
		if (!connectedUser) {
			this.logger.log(`😺 handleConnection : Client ${client.id} ❌ user not found with this token !!!!!`)
			return
		}

		console.log("createChannel ; payload.password", payload.password)

		const newChannel = await this.channelService.createChannel(
			payload.isPrivate,
			payload.name,
			false,
			payload.password
		)

		await this.channelUserService.createChannelUser(newChannel, connectedUser, true, true, true)

		const channels = await this.channelService.getAllChannels()

		this.wss.emit("infoChat", { type: "CHANNEL_CREATED", channel: newChannel, channels: channels })
	}

	/*
	 *	CHAT::	xxxxxxxxxxxxx
	 *
	 *
	 *
	 */
	// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! TODO ENCRYPT password
	@SubscribeMessage("editChannel")
	async handleEditChannel(client: Socket, payload: any): Promise<void> {
		this.logger.log(`🤍 handleEditChannel: ${client.id} --> ${payload}`)

		// * RECUPERER LE USER QUI FAIT LA DEMANDE (grace au token dans le header)
		const userToken = client?.handshake?.headers?.authorization || null
		if (!userToken) {
			this.logger.log(`🤍 handleEditChannel : Client ${client.id} ❌ No authorization in header !!!`)
			return
		}
		const connectedUser = await this.userService.findOne({ where: { jwt: userToken } })
		if (!connectedUser) {
			this.logger.log(`🤍 handleEditChannel : Client ${client.id} ❌ user not found with this token !!!!!`)
			return
		}

		const channel = await this.channelService.getChannelById(payload.channelId)
		if (!channel) {
			this.logger.log(`🤍 handleEditChannel : Client ${client.id} ❌ channel not found with this id !!!!!`)
			return
		}
		channel.name = payload.name
		channel.isPrivate = payload.isPrivate

		if (payload.password) {
			channel.password = payload.password
			channel.isPasswordProtected = true
		} else {
			channel.password = null
			channel.isPasswordProtected = false
		}

		await this.channelService.save(channel)

		const channels = await this.channelService.getAllChannels()

		this.wss.emit("infoChat", { type: "CHANNEL_UPDATED", channel: channel, channels: channels })
	}

	/*
	 *	CHAT::	creer une discussion privee entre 2 users
	 *	on cree un channel prive
	 *	on cree 2 channelUsers (accepted)
	 *
	 */
	@SubscribeMessage("createPrivateDiscussion")
	async handleCreatePrivateDiscussion(client: Socket, payload: { otherUserId: number }): Promise<void> {
		this.logger.log(`😺 createPrivateDiscussion: ${client.id} --> ${payload}`)

		// * RECUPERER LE USER QUI FAIT LA DEMANDE (grace au token dans le header)
		const userToken = client?.handshake?.headers?.authorization || null
		if (!userToken) {
			this.logger.log(`😺 createPrivateDiscussion : Client ${client.id} ❌ No authorization in header !!!`)
			return
		}
		const connectedUser = await this.userService.findOne({ where: { jwt: userToken } })
		if (!connectedUser) {
			this.logger.log(`😺 createPrivateDiscussion : Client ${client.id} ❌ user not found with this token !!!!!`)
			return
		}
		// * RECUPERER l'AUTRE USER
		const otherUser = await this.userService.findOne({ where: { id: payload.otherUserId } })
		if (!otherUser) {
			this.logger.log(
				`😺 createPrivateDiscussion : Client ${client.id} ❌ otherUser not found with this token !!!!!`
			)
			return
		}

		// * VERRIFIER QU'IL N'Y A PAS DEJA UN CHANNEL PRIVE ENTRE CES 2 USERS
		// == verifier quil nexiste pqs de channel.discussion avec ces 2 users
		// const existingChannelUser = await this.channelUserService.getChannelUserByUsers(
		// if (existingChannelUser) return //{ error: "ERROR_USER_IS_ALREADY_MEMBRE_OF_THIS_CHANNEL" }

		// * CREER LE CHANNEL ET LES 2 CHANNEL_USERS
		const newChannel = await this.channelService.createChannel(false, "PRIVATE_DISCUSSION", true, null) // ! name should be unique
		await this.channelUserService.createChannelUser(newChannel, connectedUser, true, true, true)
		await this.channelUserService.createChannelUser(newChannel, otherUser, true, true, true)

		const channels = await this.channelService.getAllChannels()

		this.wss.emit("infoChat", { type: "CHANNEL_CREATED", channel: newChannel, channels: channels })
	}

	/*
	 *	CHAT::	delete un channel
	 *
	 *
	 *
	 */
	@SubscribeMessage("deleteChannel")
	async handleDeleteChannel(client: Socket, payload: { channelId }): Promise<void> {
		this.logger.log(`😺 deleteChannel: ${client.id} --> chan #${payload.channelId}`)

		// * RECUPERER LE USER QUI FAIT LA DEMANDE (grace au token dans le header)
		const userToken = client?.handshake?.headers?.authorization || null
		if (!userToken) {
			this.logger.log(`😺 handleDeleteChannel : Client ${client.id} ❌ No authorization in header !!!`)
			return
		}
		const connectedUser = await this.userService.findOne({ where: { jwt: userToken } })
		if (!connectedUser) {
			this.logger.log(`😺 handleDeleteChannel : Client ${client.id} ❌ user not found with this token !!!!!`)
			return
		}

		// * RECUPERER LE CHANNEL
		const channel = await this.channelService.getChannelById(payload.channelId)
		if (!channel) {
			this.logger.log(`❌ ERROR_CHANNEL_NOT_FOUND`)
			return
		}

		await this.channelService.delete(channel)

		const channels = await this.channelService.getAllChannels()

		this.wss.emit("infoChat", { type: "CHANNEL_DELETED", channels: channels })
	}

	/*
	 *	CHAT::
	 *
	 *
	 *
	 */
	// depreciated
	@SubscribeMessage("blockUser")
	async handleBlockUser(client: Socket, payload: { blockedUserId; value }): Promise<void> {
		this.logger.log(`😺 handleBlockUser: ${client.id} --> blockUser #${payload.blockedUserId} : ${payload.value}`)

		// * RECUPERER LE USER QUI FAIT LA DEMANDE (grace au token dans le header)
		const userToken = client?.handshake?.headers?.authorization || null
		if (!userToken) {
			this.logger.log(`😺 handleBlockUser : Client ${client.id} ❌ No authorization in header !!!`)
			return
		}
		const connectedUser = await this.userService.findOne({ where: { jwt: userToken } })
		if (!connectedUser) {
			this.logger.log(`😺 handleBlockUser : Client ${client.id} ❌ user not found with this token !!!!!`)
			return
		}
		const blockedUser = await this.userService.findOne({ where: { id: payload.blockedUserId } })
		if (!connectedUser) {
			this.logger.log(`😺 handleBlockUser : Client ${client.id} ❌ blockedUserId not found with this token !!!!!`)
			return
		}

		this.logger.log(`handleBlockUser : ${connectedUser.name} block ${blockedUser.name} = ${payload.value}`)

		//await this.userService.blockUser(connectedUser, blockedUser)

		/*
		// * RECUPERER LE CHANNEL
		const channel = await this.channelService.getChannelById(payload.channelId)
		if (!channel)  {
			this.logger.log(`❌ ERROR_CHANNEL_NOT_FOUND`)
			return
		}


		await this.channelService.delete(channel)

		const channels = await this.channelService.getAllChannels();

		this.wss.emit("infoChat", { type: "CHANNEL_DELETED", channels: channels })

		this.wss.emit("infoChat", { type: "blockUser", channels: null })

		}
		*/
	}

	/*
	 *	Quand un user bloque un autre user ou le demande en ami
	 *
	 *
	 *
	 */
	@SubscribeMessage("setRelation")
	async handleSetRelation(client: Socket, payload: { userId; type }): Promise<void> {
		this.logger.log(`😺 handleSetRelation: ${client.id} --> user #${payload.userId}`)

		// * RECUPERER LE USER QUI FAIT LA DEMANDE (grace au token dans le header)
		const userToken = client?.handshake?.headers?.authorization || null
		if (!userToken) {
			this.logger.log(`😺 handleSetRelation : Client ${client.id} ❌ No authorization in header !!!`)
			return
		}
		const connectedUser = await this.userService.findOne({ where: { jwt: userToken } })
		if (!connectedUser) {
			this.logger.log(`😺 handleSetRelation : Client ${client.id} ❌ user not found with this token !!!!!`)
			return
		}
		const otherUser = await this.userService.findOne({ where: { id: payload.userId } })
		if (!otherUser) {
			this.logger.log(`😺 handleSetRelation : Client ${client.id} ❌ userId not found with this token !!!!!`)
			return
		}

		const allRelations = await this.userRelationService.getAllUserRelations()
		const oldFriendRelation = allRelations.find(
			(rel) => rel.type === "FRIEND" && rel.userId === connectedUser.id && rel.otherUserId === otherUser.id
		)
		const oldFriendReverseRelation = allRelations.find(
			(rel) => rel.type === "FRIEND" && rel.otherUserId === connectedUser.id && rel.userId === otherUser.id
		)
		const oldBlockRelation = allRelations.find(
			(rel) => rel.type === "BLOCKED" && rel.userId === connectedUser.id && rel.otherUserId === otherUser.id
		)

		if (payload.type === "UNBLOCK") {
			if (!oldBlockRelation) {
				console.log("not blocked")
			} else {
				await this.userRelationService.delete(oldBlockRelation)
			}
		} else if (payload.type === "BLOCK") {
			if (oldBlockRelation) {
				console.log("already blocked")
			} else {
				console.log("TODO add block")
				await this.userRelationService.createUserRelation(connectedUser.id, otherUser.id, "BLOCKED", true)
			}
		} else if (payload.type === "FRIEND") {
			if (oldFriendRelation) {
				console.log("already friend")
			} else {
				await this.userRelationService.createUserRelation(connectedUser.id, otherUser.id, "FRIEND", false)
			}
		} else if (payload.type === "UNFRIEND") {
			if (oldFriendRelation) {
				await this.userRelationService.delete(oldFriendRelation)
			}

			if (oldFriendReverseRelation) {
				await this.userRelationService.delete(oldFriendReverseRelation)
			}
		} else if (payload.type === "ACCEPT_FRIEND") {
			if (oldFriendReverseRelation) {
				oldFriendReverseRelation.accepted = true
				await this.userRelationService.save(oldFriendReverseRelation)
				await this.userRelationService.createUserRelation(connectedUser.id, otherUser.id, "FRIEND", true)
			}
		} else if (payload.type === "DECLINE_FRIEND") {
			if (oldFriendReverseRelation) {
				await this.userRelationService.delete(oldFriendReverseRelation)
			}
			if (oldFriendRelation) {
				await this.userRelationService.delete(oldFriendRelation)
			}
		}
		const updatedAllRelations = await this.userRelationService.getAllUserRelations()
		this.wss.emit("USERS_STATUS", { allRelations: updatedAllRelations })
	}

	/*
	 *	Quand un user arrive sur une nouvelle page
	 *	payload.name = "home" | "user" (+ id) |                 "chat" | "game" | "profile" | "settings"
	 *	payload.id = number | null
	 *
	 */
	@SubscribeMessage("naviguate")
	async handleNavigate(client: Socket, payload: { name: string; id: number | null }): Promise<void> {
		// * RECUPERER LE USER QUI FAIT LA DEMANDE (grace au token dans le header)
		const userToken = client?.handshake?.headers?.authorization || null
		if (!userToken) {
			this.logger.log(`🚘 handleNavigate : Client ${client.id} ❌ No authorization in header !!!`)
			return
		}
		const connectedUser = await this.userService.findOne({ where: { jwt: userToken } })
		if (!connectedUser) {
			this.logger.log(`🚘 handleNavigate : Client ${client.id} ❌ user not found with this token !!!!!`)
			return
		}

		this.logger.log(
			`🚘 handleNavigate: ${connectedUser.name} navigate to {name:"${payload.name}" id:${payload.id}}`
		)

		if (payload.name == "PageGamePlay") {
			connectedUser.status = "PLAYING"
			await this.userRepository.save(connectedUser)
		} else {
			connectedUser.status = "ONLINE"
			await this.userRepository.save(connectedUser)
		}

		this.wss.emit("USERS_STATUS", { user: connectedUser })
	}
}
