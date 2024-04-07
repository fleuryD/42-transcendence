/* eslint-disable prettier/prettier */
// ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■

import { Module } from "@nestjs/common"
import { ChannelService } from "./channel.service"
import { ChannelsController } from "./channel.controller"
// import { ChannelService } from "../channels/channels.service"
import { Channel } from "./channel.entity"
import { TypeOrmModule } from "@nestjs/typeorm"
import { ChannelGateway } from "./channel.gateway"
import { MessageService } from "src/message/message.service"
import { Message } from "src/message/message.entity"
import { UserService } from "src/user/user.service"
import { User } from "src/user/user.entity"
import { ChannelUserService } from "src/channelUser/channelUser.service"
import { ChannelUser } from "src/channelUser/channelUser.entity"
import { UserRelationService } from "src/userRelation/userRelation.service"
import { UserRelation } from "src/userRelation/userRelation.entity"

// ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■

@Module({
	imports: [
		TypeOrmModule.forFeature([ChannelUser]),
		TypeOrmModule.forFeature([Channel]),
		TypeOrmModule.forFeature([Message]),
		TypeOrmModule.forFeature([User]),
		TypeOrmModule.forFeature([UserRelation]),
	],
	controllers: [ChannelsController],
	providers: [ChannelService, ChannelGateway, MessageService, UserService, ChannelUserService, UserRelationService],
})
export class ChannelModule {}
