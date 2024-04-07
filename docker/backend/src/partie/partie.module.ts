// ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■

import { Module } from "@nestjs/common"
import { PartieService } from "./partie.service"
import { PartiesController } from "./partie.controller"
// import { PartieService } from "../parties/parties.service"
import { Partie } from "./partie.entity"
import { TypeOrmModule } from "@nestjs/typeorm"
import { PartieGateway } from "./partie.gateway"
import { UserService } from "src/user/user.service"
import { User } from "src/user/user.entity"
import { MessageService } from "src/message/message.service"
import { Message } from "src/message/message.entity"

// ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■

@Module({
	imports: [
		TypeOrmModule.forFeature([Partie]),
		TypeOrmModule.forFeature([User]),
		TypeOrmModule.forFeature([Message]),
	],
	controllers: [PartiesController],
	providers: [PartieService, PartieGateway, UserService, MessageService],
})
export class PartieModule {}
