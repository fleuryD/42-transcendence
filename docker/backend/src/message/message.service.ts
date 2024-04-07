/* eslint-disable prettier/prettier */
// ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
import { NotFoundException } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { Repository } from "typeorm"
import { Message } from "./message.entity"
import { Channel } from "src/channel/channel.entity"
import { User } from "src/user/user.entity"

// ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■

export class MessageService {
	constructor(
		@InjectRepository(Message)
		private messageRepository: Repository<Message>
	) {}

	async getAllMessages() {
		const messages = this.messageRepository.find()
		return messages
	}

	async getMessageById(id: number) {
		const message = await this.messageRepository.findOne({
			where: {
				id: id,
			},
		})
		if (message) {
			return message
		}
		throw new NotFoundException("Could not find the message")
	}

	async createMessage(user: User, channel: Channel, content: string, muted: boolean) {
		console.log("MESSAGE.SERVICE ::::  createMessage --> ", content)

		const newMessage = await this.messageRepository.create({
			user,
			channel,
			content,
			muted,
		})

		await this.messageRepository.save(newMessage)
		return newMessage
	}

	// * supprimer tous les messages d'invitation a jouer d'un user sur tous les channels
	async deleteAllMessagesInvitationsFromUser(user: User) {
		console.log("MESSAGE.SERVICE ::::  deleteAllMessagesInvitationsFromUser --> ", user.name)

		const allMessagesInvit = await this.messageRepository.find({
			where: {
				content: "INVITATION_TO_PLAY",
				user: user,
			},
		})

		console.log(allMessagesInvit.length + " messages d'invitation a jouer de " + user.name + " a supprimer")
		await this.messageRepository.remove(allMessagesInvit)

		return null
	}

	/*
	async getMessagesByChannelId(id: number) {
		const messages = await this.messageRepository.find({
			where: {
				channelIdTemp: id,
			},
		})
		return messages
	}
	*/
}
