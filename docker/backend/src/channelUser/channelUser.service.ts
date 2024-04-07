/* eslint-disable prettier/prettier */
// ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
import { NotFoundException } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { Repository } from "typeorm"
import { ChannelUser } from "./channelUser.entity"
import { User } from "src/user/user.entity"
import { Channel } from "src/channel/channel.entity"

// ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■

export class ChannelUserService {
	constructor(
		@InjectRepository(ChannelUser)
		private channelUserRepository: Repository<ChannelUser>
	) {}

	async createChannelUser(channel: Channel, user: User, isOwner: boolean, isAdmin: boolean, accepted: boolean) {
		// ownerIdTemp: number,
		console.log("MESSAGE.SERVICE ::::  createChannelUser")

		const newChannelUser = await this.channelUserRepository.create({
			channel,
			user,
			isOwner,
			isAdmin,
			isBanned: false,
			endMutedAt: null,
			accepted,
		})

		await this.channelUserRepository.save(newChannelUser)
		return newChannelUser
	}

	async getAllChannelUsers() {
		const channelUsers = this.channelUserRepository.find()
		return channelUsers
	}

	async getChannelUserById(id: number) {
		const channelUser = await this.channelUserRepository.findOne({
			where: {
				id: id,
			},
		})
		if (channelUser) {
			return channelUser
		}
		throw new NotFoundException("Could not find the channelUser")
	}

	/*
	async getChannelUserByChannelIdAndUserId(channelId: number, userId:number) {
		const channelUser = await this.channelUserRepository.findOne({
			where: {
				channelId: channelId,
				userId: userId,
			},
		})
		if (channelUser) {
			return channelUser
		}
		throw new NotFoundException("Could not find the channelUser")
	}
	*/

	async save(channelUser: ChannelUser) {
		await this.channelUserRepository.save(channelUser)
		return channelUser
	}

	async delete(channelUser: ChannelUser) {
		console.log("delete.channelUser", channelUser)
		await this.channelUserRepository.remove(channelUser)
	}
}
