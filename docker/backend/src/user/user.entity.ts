/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */

// ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■

import { Column, Entity, PrimaryGeneratedColumn, OneToMany, ManyToMany, JoinTable, ManyToOne } from "typeorm"
import { Channel } from "../channel/channel.entity"
import { ChannelUser } from "../channelUser/channelUser.entity"
import { Message } from "../message/message.entity"
import { UserRelation } from "src/userRelation/userRelation.entity"

// ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■

@Entity("users")
export class User {
	@PrimaryGeneratedColumn()
	id: number

	@Column({ unique: true })
	name: string

	@Column({ unique: true, nullable: true })
	nickname: string

	@Column({ unique: true })
	email: string

	@Column()
	// !!!  @Exclude()
	password: string

	@Column({ nullable: true })
	public jwt: string

	@Column() //{ nullable: true }
	public status: string // ONLINE | OFFLINE | PLAYING | AFK

	@Column({ nullable: true }) //
	public clientId: string // socket client id

	@Column({ nullable: true }) //
	public avatarLink: string // socket client id

	@Column({ nullable: true }) //
	public doubleAuthSecret: string // socket client id

	@Column() //
	public doubleAuthActive: boolean // socket client id

	@Column({ nullable: true })
	public pongTheme: number

	@Column({ nullable: true })
	public ballTheme: number

	/*
	 *
	 *	Un user peut avoir plusieurs channelUsers. Un channelUser a un seul user.
	 *
	 */
	@OneToMany(() => ChannelUser, (channelUser: ChannelUser) => channelUser.user)
	public channelUsers: ChannelUser[]

	/*
	 *
	 *	Un user peut avoir plusieurs messages. Un message a un seul user.
	 *
	 */
	@OneToMany(() => Message, (message: Message) => message.user)
	public messages: Message[]
}
