/* eslint-disable prettier/prettier */
// ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■

//import { Message } from "src/message/message.entity"
import { ChannelUser } from "src/channelUser/channelUser.entity"
import { Message } from "src/message/message.entity"
//import { User } from "src/user/user.entity"
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, OneToMany } from "typeorm"

// ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■

@Entity("channels")
export class Channel {
	@PrimaryGeneratedColumn()
	public id: number

	@CreateDateColumn()
	createdAt: Date

	@Column()
	public name: string

	@Column()
	public isPrivate: boolean

	@Column({ nullable: true })
	public password: string // TODO : encrypted

	@Column({ nullable: true }) // !! enlever NULLABLE quand bdd OK
	public isPasswordProtected: boolean

	/*
	 *
	 *	Un channel peut avoir plusieurs channelUsers. Un channelUser a un seul channel.
	 *
	 */
	@OneToMany(() => ChannelUser, (channelUser: ChannelUser) => channelUser.channel, { eager: true, cascade: true })
	public channelUsers: ChannelUser[]

	/*
	 *
	 *	Un channel peut avoir plusieurs messages. Un channelUser a un seul message.
	 *
	 */
	@OneToMany(() => Message, (message: Message) => message.channel, { eager: true, cascade: true })
	public messages: Message[]

	/*
	 *
	 *	On cree une nouvelle discussion privee comme on cree un channnel
	 *	2 chanUsers sont automatiquement crees
	 *
	 */
	@Column({ nullable: true }) // !! enlever NULLABLE quand bdd OK
	public isPrivateDiscussion: boolean
}
