/* eslint-disable prettier/prettier */
// ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
import { Module } from "@nestjs/common"
import { MessagesController } from "./message.controller"
import { MessageService } from "./message.service"
import { Message } from "./message.entity"
import { TypeOrmModule } from "@nestjs/typeorm"
import { User } from "src/user/user.entity"
import { UserService } from "src/user/user.service"

// ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■

@Module({
	imports: [TypeOrmModule.forFeature([Message]), TypeOrmModule.forFeature([User])],
	controllers: [MessagesController],
	providers: [MessageService, UserService],
})
export class MessageModule {}
