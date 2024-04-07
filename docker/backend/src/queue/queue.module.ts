// ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■

import { Module } from "@nestjs/common"
import { QueuesController } from "./queue.controller"
import { QueueService } from "./queue.service"
import { PartieService } from "../partie/partie.service"
import { Queue } from "./queue.entity"
import { Partie } from "../partie/partie.entity"
import { TypeOrmModule } from "@nestjs/typeorm"
import { QueueGateway } from "./queue.gateway"
import { UserService } from "../user/user.service"
import { User } from "../user/user.entity"

// ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■

@Module({
	imports: [TypeOrmModule.forFeature([Queue]), TypeOrmModule.forFeature([Partie]), TypeOrmModule.forFeature([User])],
	controllers: [QueuesController],
	providers: [UserService, QueueService, QueueGateway],
})
export class QueueModule {}
