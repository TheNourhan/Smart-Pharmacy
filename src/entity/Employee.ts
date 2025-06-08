import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from "typeorm"
import { User } from "./User"

@Entity()
export class Employee {
  @PrimaryGeneratedColumn()
  id!: number

  @Column()
  role!: string

  @OneToOne(() => User, (user) => user.employee)
  @JoinColumn({ name: "userId" })
  user!: User

  @Column()
  hourlySalary!: number
}
