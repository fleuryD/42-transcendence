/* eslint-disable prettier/prettier */
// ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
import { Body, Controller, Get, Param, Post } from "@nestjs/common"
import { UserRelation } from "./userRelation.entity"
import { UserRelationService } from "./userRelation.service"
import { MessageService } from "../message/message.service"
import { UserService } from "src/user/user.service"
// ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■

@Controller("chat/userRelations")
export class UserRelationsController {
	constructor(
		private readonly userService: UserService,
		private readonly userRelationService: UserRelationService,
		private readonly messageService: MessageService
	) {}
}
