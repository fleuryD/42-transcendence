/* eslint-disable prettier/prettier */
// ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■

//import { Message } from "src/message/message.entity"
import { Channel } from "src/channel/channel.entity"
import { User } from "src/user/user.entity"
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, ManyToOne } from "typeorm"

// ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■

@Entity("channelUsers")
export class ChannelUser {
	@PrimaryGeneratedColumn()
	public id: number

	@CreateDateColumn()
	createdAt: Date

	/*
	 *
	 *	Un channelUser a un seul user. un user peut avoir plusieurs channelUsers
	 *  // TODO : toutes les infos de user (pass, token, etc.) sontr envoyees !!!!
	 *
	 */
	@ManyToOne(() => User, (user: User) => user.channelUsers, { eager: true })
	public user: User

	/*
	 *
	 *	Un channelUser a un seul user. un user peut avoir plusieurs channelUsers
	 *  // TODO : toutes les infos de user (pass, token, etc.) sontr envoyees !!!!
	 *
	 */
	@ManyToOne(() => Channel, (channel: Channel) => channel.channelUsers, { onDelete: "CASCADE" })
	public channel: Channel

	@Column()
	isOwner: boolean

	@Column()
	isAdmin: boolean

	@Column()
	isBanned: boolean

	@Column({ nullable: true })
	endMutedAt: Date | null

	@Column() // pour les salon privés
	accepted: boolean
}
