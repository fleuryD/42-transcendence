/* eslint-disable prettier/prettier */
// ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
import { Body, Controller, Get, Param, Post } from "@nestjs/common"
import { Channel } from "./channel.entity"
import { ChannelService } from "./channel.service"
import { MessageService } from "../message/message.service"
import { UserService } from "src/user/user.service"
import { ChannelUserService } from "src/channelUser/channelUser.service"
import { Headers } from "@nestjs/common"
import { UserRelationService } from "src/userRelation/userRelation.service"
// ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■

@Controller("chat")
export class ChannelsController {
	constructor(
		private readonly userService: UserService,
		private readonly channelService: ChannelService,
		private readonly channelUserService: ChannelUserService,
		private readonly messageService: MessageService,
		private readonly userRelationService: UserRelationService
	) {}

	/*
	 *
	 * La methode qui permet de trouver un user à partir du Bearer token dans les headers
	 * // TODO : A mettre ailleurs pour l'utiliser partout
	 *
	 */
	private async getUserFromHeaders(headers: any): Promise<any | null> {
		const [type, jwtToken] = headers.authorization?.split(" ") ?? []
		if (type !== "Bearer") return null
		const user = await this.userService.findOne({ where: { jwt: jwtToken } })
		return user
	}

	@Get()
	async chatIndex(@Headers() headers): Promise<any> {
		const connectedUser = await this.getUserFromHeaders(headers)
		if (!connectedUser) return { error: "ERROR_JWT_USER_NOT_FOUND" }

		const channels = await this.channelService.getAllChannels()

		//const users = await this.userService.findAll()
		const allRelations = await this.userRelationService.getAllUserRelations()
		const allUsers = await this.userService.findAll()

		return {
			channels: channels,
			allRelations: allRelations,
			allUsers: allUsers,
		}
	}

	@Get("/channels/:id")
	async getChannelById(@Param("id") id: string, @Headers() headers): Promise<any> {
		const connectedUser = await this.getUserFromHeaders(headers)
		if (!connectedUser) return { error: "ERROR_JWT_USER_NOT_FOUND" }

		console.log("🟨 connectedUser.name : ", connectedUser.name)

		const channel = await this.channelService.getChannelById(Number(id))

		const channelUser = channel.channelUsers.find((channelUser) => channelUser.user.id === connectedUser.id)
		if (channel.isPasswordProtected && (!channelUser || !channelUser.accepted))
			return { warning: "WARNING_CHANNEL_IS_PASSWORD_PROTECTED" }

		if (!channelUser) return { warning: "WARNING_USER_NOT_A_MEMBER_OF_THIS_CHANNEL" }
		if (channelUser.isBanned) return { warning: "WARNING_USER_BANNED_OF_THIS_CHANNEL" }

		return { channel: channel }
	}
}
