import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from "typeorm"
import { User } from "./User"

@Entity()
export class Patient {
  @PrimaryGeneratedColumn()
  id!: number

  @Column()
  dateOfBirth?: Date

  @OneToOne(() => User, user => user.patient)
  @JoinColumn({ name: "userId" })
  user!: User;
}
