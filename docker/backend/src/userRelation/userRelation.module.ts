/* eslint-disable prettier/prettier */
// ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■

import { Module } from "@nestjs/common"
import { UserRelationService } from "./userRelation.service"
import { UserRelationsController } from "./userRelation.controller"
// import { UserRelationService } from "../userRelations/userRelations.service"
import { UserRelation } from "./userRelation.entity"
import { TypeOrmModule } from "@nestjs/typeorm"
import { MessageService } from "src/message/message.service"
import { Message } from "src/message/message.entity"
import { UserService } from "src/user/user.service"
import { User } from "src/user/user.entity"

// ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■

@Module({
	imports: [
		TypeOrmModule.forFeature([UserRelation]),
		TypeOrmModule.forFeature([Message]),
		TypeOrmModule.forFeature([User]),
	],
	controllers: [UserRelationsController],
	providers: [UserRelationService, MessageService, UserService],
})
export class UserRelationModule {}
