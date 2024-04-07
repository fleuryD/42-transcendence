/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */

// ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■

import { ConfigModule } from '@nestjs/config';
import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { AppController } from "./user/user.controller"
import { UserService } from "./user/user.service"
import { User } from "./user/user.entity"
import { Message } from "./message/message.entity"
import { Partie } from "./partie/partie.entity"
import { Queue } from "./queue/queue.entity"
import { Channel } from "./channel/channel.entity"
import { JwtModule } from "@nestjs/jwt"

import { PartieModule } from "./partie/partie.module"
import { MessageModule } from "./message/message.module"
import { QueueModule } from "./queue/queue.module"
import { ChannelModule } from "./channel/channel.module"
import { ChannelUserModule } from "./channelUser/channelUser.module"
import { ChannelUser } from "./channelUser/channelUser.entity"
import { UserRelation } from "./userRelation/userRelation.entity"
import { UserRelationModule } from "./userRelation/userRelation.module"
import { UserRelationService } from "./userRelation/userRelation.service"
import { PartieService } from "./partie/partie.service"

// ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■

@Module({
	imports: [
		ConfigModule.forRoot(),
		TypeOrmModule.forRoot({
			type: "postgres",
			host: "postgres", // "postgres" pour docker | "localhost" pour mon windows
			port: 5432,
			username: "postgres",
			password: "root",
			database: "db",
			entities: [User, Message, Queue, Partie, Channel, ChannelUser, UserRelation],
			synchronize: true,
		}),
		TypeOrmModule.forFeature([User]),
		TypeOrmModule.forFeature([UserRelation]),
		JwtModule.register({
			secret: "secret",
			signOptions: { expiresIn: "1d" },
		}),
		PartieModule,
		MessageModule,
		QueueModule,
		ChannelModule,
		ChannelUserModule,
		UserRelationModule,
	],
	controllers: [AppController],
	providers: [UserService, UserRelationService],
})
export class AppModule {}
