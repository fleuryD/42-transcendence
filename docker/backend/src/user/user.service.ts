/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */

// ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■

import { Injectable, NotFoundException } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { User } from "./user.entity"
import { Message } from "../message/message.entity"
import { Repository } from "typeorm"
import { authenticator } from 'otplib';
import { toDataURL } from 'qrcode';

// ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■

@Injectable()
export class UserService {
	constructor(
		@InjectRepository(User) private readonly userRepository: Repository<User>) {}

	async create(data: any): Promise<User> {
		return this.userRepository.save(data)
	}

	async updateAvatar(jwt: string, avatarLink: string): Promise<User> {
		const user = await this.userRepository.findOne({ where: { jwt: jwt } })

		if (!user)
			throw new NotFoundException("Could not find the user")

		user.avatarLink = avatarLink

		await this.userRepository.save(user)

		user.password = undefined
		return user
	}

	async getUserById(id: number) {
		const message = await this.userRepository.findOne({
			where: {
				id: id,
			},
		})
		if (message) {
			return message
		}
		throw new NotFoundException("Could not find the message")
	}

	async findOne(condition: any): Promise<User> {
		return this.userRepository.findOne(condition)
	}

	async findAll(): Promise<User[]> {
		return this.userRepository.find()
	}

	// ■■■■■■■■■■■■■■■■■■■■■■■■■■■ Double auth ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■


	async setTwoFactorAuthenticationSecret(secret: string, userId: number) {
		let user = await this.getUserById(userId);
		user.doubleAuthSecret = secret;
		await this.userRepository.save(user)
	}

	async turnOnDoubleAuth(userId: number) {
		let user = await this.getUserById(userId);
		if (!user)
			return -1

		user.doubleAuthActive = true;
		await this.userRepository.save(user)

		return (1)
	}

	async turnOffDoubleAuth(userId: number) {
		let user = await this.getUserById(userId);
		if (!user)
			return -1

		user.doubleAuthActive = false;
		await this.userRepository.save(user)

		return (0)
	}

	isTwoFactorAuthenticationCodeValid(twoFactorAuthenticationCode: string, user: User) {
		return authenticator.verify({
		  token: twoFactorAuthenticationCode,
		  secret: user.doubleAuthSecret,
		});
	}

	async generateQrCodeDataURL(otpAuthUrl: string) {
		return toDataURL(otpAuthUrl);
	}

	async getTwoFactorAuthenticationSecret(user: User) {
		let secret = null

		let isCodeValid = null;

		if (user.doubleAuthSecret)
		{
			isCodeValid = await this.isTwoFactorAuthenticationCodeValid(
				user.doubleAuthSecret,
				user,
			);
		}

		if (user.doubleAuthSecret && isCodeValid)
			secret = user.doubleAuthSecret
		else
		{
			secret = authenticator.generateSecret();
			await this.setTwoFactorAuthenticationSecret(secret, user.id);
		}

		const otpauthUrl = authenticator.keyuri(user.email, 'ft_transcendence v1', secret);

		const data = {
			secret,
			qrcode: await this.generateQrCodeDataURL(otpauthUrl),
			doubleAuthActive: false
		}

		if (data.secret && data.qrcode)
		{
			this.turnOnDoubleAuth(user.id)
			data.doubleAuthActive = true
		}
		return data
	}

	// ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■

	async setJwt(user, jwt): Promise<User> {
		//const user = await this.userRepository.findOne(userId)
		user.jwt = jwt
		user.status = "ONLINE"
		await this.userRepository.save(user)

		return user
	}

	async setNickname(jwt: string, nickname: string): Promise<User> {
		const user = await this.userRepository.findOne({ where: { jwt: jwt } })

		if (!user)
			throw new NotFoundException("Could not find the user")

		if (nickname.length > 20)
			throw new NotFoundException("Nickname too long")

		if (nickname.length < 3)
			throw new NotFoundException("Nickname too short")

		if (nickname.includes(" "))
			throw new NotFoundException("Nickname can't contain spaces")

		nickname = nickname.replace(/[^a-zA-Z0-9]/g, "")
		nickname = nickname.toLowerCase()

		const userWithSameNickname = await this.userRepository.findOne({ where: { nickname: nickname } })

		if (userWithSameNickname)
			throw new NotFoundException("Nickname already taken")

		user.nickname = nickname

		await this.userRepository.save(user)

		user.password = undefined
		return user
	}

	async setPongTheme(jwt: string, pongTheme: number): Promise<User> {
		const user = await this.userRepository.findOne({ where: { jwt: jwt } })

		if (!user)
			throw new NotFoundException("Could not find the user")

		user.pongTheme = pongTheme

		await this.userRepository.save(user)

		user.password = undefined
		return user
	}

	async setBallTheme(jwt: string, ballTheme: number): Promise<User> {
		const user = await this.userRepository.findOne({ where: { jwt: jwt } })

		if (!user)
			throw new NotFoundException("Could not find the user")

		user.ballTheme = ballTheme

		await this.userRepository.save(user)

		user.password = undefined
		return user
	}
}
