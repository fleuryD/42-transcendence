/* eslint-disable prettier/prettier */
// ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
import { Body, Controller, Get, Param, Post } from "@nestjs/common"
import { Message } from "./message.entity"
import { MessageService } from "./message.service"

// ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■

@Controller("messages")
export class MessagesController {
	constructor(private readonly messageService: MessageService) {}

	@Get()
	async getAllMessages(): Promise<Message[]> {
		const messages = await this.messageService.getAllMessages()
		return messages
	}

	@Get(":id")
	async getMessageById(@Param("id") id: string): Promise<Message> {
		const message = await this.messageService.getMessageById(Number(id))
		return message
	}
}
