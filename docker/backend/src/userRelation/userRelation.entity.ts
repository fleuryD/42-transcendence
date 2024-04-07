/* eslint-disable prettier/prettier */
// ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■

//import { Message } from "src/message/message.entity"

import { Column, Entity, PrimaryGeneratedColumn } from "typeorm"

// ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■

@Entity("userRelations")
export class UserRelation {
	@PrimaryGeneratedColumn()
	public id: number

	@Column()
	userId: number

	@Column()
	otherUserId: number

	@Column()
	type: "FRIEND" | "BLOCKED"

	@Column()
	accepted: boolean
}
