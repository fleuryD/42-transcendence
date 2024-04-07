/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */

// ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■

import {
	BadRequestException,
	Body,
	Controller,
	Get,
	Post,
	Req,
	Res,
	UnauthorizedException,
	Param,
} from "@nestjs/common"
import { UserService } from "./user.service"
import * as bcrypt from "bcrypt"
import { JwtService } from "@nestjs/jwt"
import { Response, Request } from "express"
import { Headers, Query, Redirect } from "@nestjs/common"
import { UserRelationService } from "src/userRelation/userRelation.service"
import fetch from "node-fetch"

import { UploadedFile, UseInterceptors } from "@nestjs/common"
import { FileInterceptor } from "@nestjs/platform-express"

// ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■

// TODO: ne pas envoyer "password" dans les réponses

// ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■

@Controller("api")
export class AppController {
	constructor(
		private readonly userService: UserService,
		private readonly userRelationService: UserRelationService,
		private jwtService: JwtService
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

	@Get("ping")
	async ping() {
		return {
			message: "pong",
		}
	}

	@Post("me")
	async me(@Body("jwt") jwt: string) {
		const user = await this.userService.findOne({ where: { jwt: jwt } })

		if (!user) throw new UnauthorizedException("Invalid user")

		return { user: user }
	}

	@Post('updateAvatar')
	updateAvatar(@Body("jwt") jwt: string, @Body("avatarLink") avatarLink: string) {
		return this.userService.updateAvatar(jwt, avatarLink)
	}

	@Post("setNickname")
	async setNickname(@Body("jwt") jwt: string, @Body("nickname") nickname: string) {
		const user = await this.userService.setNickname(jwt, nickname)
		return { user: user }
	}

	@Post("2faTurn-on")
	async turnOnTwoFactorAuthentication(@Body("jwt") jwt: any) {
		let user = await this.userService.findOne({ where: { jwt: jwt } })

		if (!user) throw new UnauthorizedException("Invalid user")

		return await this.userService.getTwoFactorAuthenticationSecret(user)
	}

	@Post("2faTurn-off")
	async turnOffTwoFactorAuthentication(@Body("jwt") jwt: any) {
		let user = await this.userService.findOne({ where: { jwt: jwt } })

		if (!user) throw new UnauthorizedException("Invalid user")

		let userDb = await this.userService.getUserById(user.id)

		if (!userDb || user.jwt != userDb.jwt) throw new UnauthorizedException("Invalid user")

		let doubleAuthActive = await this.userService.turnOffDoubleAuth(user.id)

		if (doubleAuthActive == -1) throw new UnauthorizedException("Invalid user")

		return {
			doubleAuthActive: false,
		}
	}

	@Post("register")
	async register(@Body("name") name: string, @Body("email") email: string, @Body("password") password: string) {
		if (!name || !email || !password) {
			throw new BadRequestException("missing fields")
		}
		const hashedPassword = await bcrypt.hash(password, 12)

		try {
			const user = await this.userService.create({
				name: name.toLowerCase(),
				email: email.toLowerCase(),
				doubleAuthActive: false,
				password: hashedPassword,
				status: "OFFLINE",
			})

			delete user.password
			return user
		} catch (e) {
			throw new BadRequestException("email already exists")
		}
	}

	@Post("setPongTheme")
	async setPongTheme(@Body("jwt") jwt: string, @Body("pongTheme") pongTheme: number) {
		return this.userService.setPongTheme(jwt, pongTheme)
	}

	@Post("setBallTheme")
	async setBallTheme(@Body("jwt") jwt: string, @Body("ballTheme") pongTheme: number) {
		return this.userService.setBallTheme(jwt, pongTheme)
	}

	@Post("2fa/authenticate")
	async authenticate(@Body("code") code: string, @Body("jwt") jwt: any) {
		let user = await this.userService.findOne({ where: { jwt: jwt } })

		if (!user) throw new UnauthorizedException("Invalid user")

		const isCodeValid = this.userService.isTwoFactorAuthenticationCodeValid(code, user)

		if (!isCodeValid) throw new UnauthorizedException("Wrong authentication code")

		return { success: true }
	}

	@Get("loginoauth")
	async loginoauth(@Query("code") code: string, @Res({ passthrough: true }) rep: Response) {
		const CLIENT_ID = process.env.REACT_APP_42API_CLIENTID
		const CLIENT_SECRET = process.env.REACT_APP_42API_CLIENTSECRET
		const REDIRECT_URI = process.env.REACT_APP_FRONTENDAPI + "/login"
		const AUTH_URL = process.env.REACT_APP_42API_AUTHURL
		const TOKEN_URL = process.env.REACT_APP_42API_TOKENURL

		console.log("code : " + code)
		console.log("CLIENT_ID : " + CLIENT_ID)
		console.log("CLIENT_SECRET : " + CLIENT_SECRET)
		console.log("REDIRECT_URI : " + REDIRECT_URI)
		console.log("AUTH_URL : " + AUTH_URL)
		console.log("TOKEN_URL : " + TOKEN_URL)

		const formData = new URLSearchParams()
		formData.append("client_id", CLIENT_ID)
		formData.append("client_secret", CLIENT_SECRET)
		formData.append("code", code)
		formData.append("redirect_uri", REDIRECT_URI)
		formData.append("grant_type", "authorization_code")

		const response = await fetch(TOKEN_URL, {
			method: "POST",
			headers: {
				"Content-Type": "application/x-www-form-urlencoded",
			},
			body: formData,
		})
		if (!response.ok) {
			return { message: "error token url api", error: response }
		}
		const tokenData = await response.json()

		const headers = { Authorization: `Bearer ${tokenData["access_token"]}` }
		const responseProfil = await fetch("https://api.intra.42.fr/v2/me", {
			method: "GET",
			headers: headers,
		})
		if (!responseProfil.ok) {
			return { message: "error profil url api", error: responseProfil }
		}

		const userdata = await responseProfil.json()

		const userLogin = userdata["login"]
		const userEmail = userdata["email"]
		const userAvatar = userdata["image"]["link"]

		let user = await this.userService.findOne({
			where: { name: userLogin },
		})

		if (!user) {
			try {
				const hashedPassword = await bcrypt.hash(tokenData["access_token"], 12)

				const user = await this.userService.create({
					name: userLogin.toLowerCase(),
					email: userEmail.toLowerCase(),
					password: hashedPassword,
					status: "OFFLINE",
					avatarLink: userAvatar,
					doubleAuthActive: false,
					pongTheme: 1,
				})
			} catch (e) {}
		}

		user = await this.userService.findOne({
			where: { name: userLogin },
		})

		if (!user) return { message: "error user not found" }

		if (user.doubleAuthActive == true) {
			return {
				message: "2FA",
				name: user.name,
				email: user.email,
				password: tokenData["access_token"],
			}
		}

		const jwt = await this.jwtService.signAsync({ id: user.id })

		rep.cookie("jwt", jwt, { httpOnly: true })

		await this.userService.setJwt(user, jwt)

		return {
			message: "success",
			user: { jwt, ...user },
		}
	}

	@Post("login")
	async login(
		@Body("email") email: string,
		@Body("password") password: string,
		@Body("code") code: string,
		@Res({ passthrough: true }) response: Response
	) {
		if (!email || !password) {
			throw new BadRequestException("missing fields")
		}

		const user = await this.userService.findOne({ where: { email: email } })

		if (!user) {
			throw new BadRequestException("invalid credentials")
		}

		if (!(await bcrypt.compare(password, user.password))) {
			throw new BadRequestException("invalid credentials")
		}

		if (user.doubleAuthActive == true) {
			if (!code) {
				return {
					message: "2FA",
					name: user.name,
					email: user.email,
					password: password,
				}
			}

			const isCodeValid = this.userService.isTwoFactorAuthenticationCodeValid(code, user)

			if (!isCodeValid) throw new BadRequestException("invalid 2af code")
		}

		const jwt = await this.jwtService.signAsync({ id: user.id })

		response.cookie("jwt", jwt, { httpOnly: true })

		//user.jwt = jwt

		// await this.partieRepository.save(newPartie);

		await this.userService.setJwt(user, jwt)

		return {
			message: "success",
			// jwt: jwt,
			user: { jwt, ...user },
		}
	}

	@Post("profil")
	async profil(@Body("jwt") jwt: string, @Req() request: Request) {
		//try {
		console.log("cookie : " + jwt)

		const data = await this.jwtService.verifyAsync(jwt)

		if (!data) {
			console.log("no data for")
			console.log(jwt)
			//throw new UnauthorizedException();
		}

		const user = await this.userService.findOne({ where: { id: data["id"] } })

		const { password, ...result } = user

		return result
		//} catch (e) {
		//    throw new UnauthorizedException();
		//}
	}

	@Post("logout")
	async logout(@Res({ passthrough: true }) response: Response) {
		response.clearCookie("jwt")

		return {
			message: "success",
		}
	}

	// ******************

	@Get("users")
	async users(@Headers() headers) {
		const connectedUser = await this.getUserFromHeaders(headers)
		if (!connectedUser) return { error: "ERROR_JWT_USER_NOT_FOUND" }

		const users = await this.userService.findAll()
		const allRelations = await this.userRelationService.getAllUserRelations()

		return { users: users, relations: connectedUser.userRelations, allRelations: allRelations }
	}

	@Get("user/:id")
	async userShow(@Param() params, @Headers() headers) {
		const connectedUser = await this.getUserFromHeaders(headers)
		if (!connectedUser) return { error: "ERROR_JWT_USER_NOT_FOUND" }

		const user = await this.userService.findOne({ where: { id: params.id } })

		const { password, ...result } = user

		return result
		//} catch (e) {
		//    throw new UnauthorizedException();
		//}
	}
}
