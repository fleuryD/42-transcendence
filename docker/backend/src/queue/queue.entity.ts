// ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■

import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm"

// ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■

@Entity("queues")
export class Queue {
	@PrimaryGeneratedColumn()
	public id: number

	@CreateDateColumn()
	createdAt: Date

	// TODO ! ForeignKey
	@Column()
	public userId: number

	@Column({ nullable: true })
	public userName: string | null
}
