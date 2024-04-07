/* eslint-disable prettier/prettier */
// ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
import { NotFoundException } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { Repository } from "typeorm"
import { Channel } from "./channel.entity"

// ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■

export class ChannelService {
	constructor(
		@InjectRepository(Channel)
		private channelRepository: Repository<Channel>
	) {}

	async createChannel(isPrivate: boolean, name: string, isPrivateDiscussion: boolean, password: string) {
		// ownerIdTemp: number,
		console.log("MESSAGE.SERVICE ::::  createChannel")

		const isPasswordProtected = password ? true : false
		const newChannel = await this.channelRepository.create({
			isPrivate,
			name,
			isPrivateDiscussion,
			password,
			isPasswordProtected,
		})

		await this.channelRepository.save(newChannel)
		return newChannel
	}

	async getAllChannels() {
		const channels = this.channelRepository.find()
		return channels
	}

	async getChannelById(id: number) {
		const channel = await this.channelRepository.findOne({
			where: {
				id: id,
			},
		})
		if (channel) {
			return channel
		}
		throw new NotFoundException("Could not find the channel")
	}

	async save(channel: Channel) {
		await this.channelRepository.save(channel)
		return channel
	}

	async delete(channel: Channel) {
		console.log("delete.channel", channel.name)
		await this.channelRepository.remove(channel)
	}
}
