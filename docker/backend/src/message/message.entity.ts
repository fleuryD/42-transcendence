/* eslint-disable prettier/prettier */
// ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■

import { Channel } from "src/channel/channel.entity"
import { User } from "src/user/user.entity"
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, ManyToOne } from "typeorm"

// ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■

@Entity("messages")
export class Message {
	@PrimaryGeneratedColumn()
	public id: number

	@Column()
	public content: string

	@CreateDateColumn()
	createdAt: Date // ?? ou DateTime

	/*
	 *
	 *	Un message a un seul channel. un channel peut avoir plusieurs message
	 *
	 */
	@ManyToOne(() => Channel, (channel: Channel) => channel.messages, { onDelete: "CASCADE" })
	public channel: Channel

	/*
	 *
	 *	Un message a un seul user. un user peut avoir plusieurs message
	 *
	 */
	@ManyToOne(() => User, (user: User) => user.messages, { eager: true })
	public user: User

	@Column({ nullable: true })
	public muted: boolean
}
