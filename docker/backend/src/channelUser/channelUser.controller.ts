/* eslint-disable prettier/prettier */
// ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
import { Body, Controller, Get, Param, Post } from "@nestjs/common"
import { ChannelUser } from "./channelUser.entity"
import { ChannelUserService } from "./channelUser.service"
import { MessageService } from "../message/message.service"
import { UserService } from "src/user/user.service"
// ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■

@Controller("chat/channelUsers")
export class ChannelUsersController {
	constructor(
		private readonly userService: UserService,
		private readonly channelUserService: ChannelUserService,
		private readonly messageService: MessageService
	) {}

	/*
	@Post("new")
	async createChannelUser(
		@Body("ownerIdTemp") ownerIdTemp: number,
		@Body("isPrivate") isPrivate: boolean,
		@Body("name") name: string
	) {
		const owner = await this.userService.getUserById(ownerIdTemp)
		const newChannelUser = await this.channelUserService.createChannelUser(isPrivate, name, owner) // ownerIdTemp,
		return newChannelUser
	}

	@Get()
	async getAllChannelUsers(): Promise<ChannelUser[]> {
		const channelUsers = await this.channelUserService.getAllChannelUsers()
		return channelUsers
	}

	@Get(":id")
	async getChannelUserById(@Param("id") id: string): Promise<any> {
		//const  channelUser = await this.channelUserService.getChannelUserById(Number(id))

		const channelUser = await this.channelUserService.getChannelUserById(Number(id))
		const messages = await this.messageService.getMessagesByChannelUserId(Number(id))

		//channelUser = { ...channelUser, {truc: "truc"} }
		return { channelUser: channelUser, messages: messages }
	}
	*/
}
