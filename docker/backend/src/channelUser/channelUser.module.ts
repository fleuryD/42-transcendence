/* eslint-disable prettier/prettier */
// ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■

import { Module } from "@nestjs/common"
import { ChannelUserService } from "./channelUser.service"
import { ChannelUsersController } from "./channelUser.controller"
// import { ChannelUserService } from "../channelUsers/channelUsers.service"
import { ChannelUser } from "./channelUser.entity"
import { TypeOrmModule } from "@nestjs/typeorm"
import { MessageService } from "src/message/message.service"
import { Message } from "src/message/message.entity"
import { UserService } from "src/user/user.service"
import { User } from "src/user/user.entity"

// ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■

@Module({
	imports: [
		TypeOrmModule.forFeature([ChannelUser]),
		TypeOrmModule.forFeature([Message]),
		TypeOrmModule.forFeature([User]),
	],
	controllers: [ChannelUsersController],
	providers: [ChannelUserService, MessageService, UserService],
})
export class ChannelUserModule {}
