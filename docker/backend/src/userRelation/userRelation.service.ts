/* eslint-disable prettier/prettier */
// ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
import { NotFoundException } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { Repository } from "typeorm"
import { UserRelation } from "./userRelation.entity"
import { User } from "src/user/user.entity"

// ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■

export class UserRelationService {
	constructor(
		@InjectRepository(UserRelation)
		private userRelationRepository: Repository<UserRelation>
	) {}

	async createUserRelation(userId: number, otherUserId: number, type: "FRIEND" | "BLOCKED", accepted: boolean) {
		// ownerIdTemp: number,
		console.log("MESSAGE.SERVICE ::::  createUserRelation")

		const newUserRelation = await this.userRelationRepository.create({
			userId,
			otherUserId,
			type,
			accepted,
		})

		await this.userRelationRepository.save(newUserRelation)
		return newUserRelation
	}

	async getAllUserRelations() {
		const userRelations = this.userRelationRepository.find()
		return userRelations
	}

	async getUserRelationById(id: number) {
		const userRelation = await this.userRelationRepository.findOne({
			where: {
				id: id,
			},
		})
		if (userRelation) {
			return userRelation
		}
		throw new NotFoundException("Could not find the userRelation")
	}

	async save(ur: UserRelation) {
		await this.userRelationRepository.save(ur)
		return ur
	}

	async delete(ur: UserRelation) {
		await this.userRelationRepository.remove(ur)
	}
}
