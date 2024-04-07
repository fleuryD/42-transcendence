// ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■

import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm"

// ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■

@Entity("parties")
export class Partie {
	@PrimaryGeneratedColumn()
	public id: number

	@CreateDateColumn()
	createdAt: Date

	// TODO ! ForeignKey
	@Column()
	public user1Id: number

	@Column()
	public user2Id: number

	// TODO ! Temporaire (remplacer par relation)
	@Column()
	public user1Name: string

	@Column()
	public user2Name: string

	@Column({ nullable: true })
	public ended: boolean

	@Column({ nullable: true })
	public score1: number

	@Column({ nullable: true })
	public score2: number
}
