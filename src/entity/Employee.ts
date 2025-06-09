import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, ManyToOne, OneToMany } from "typeorm"
import { User } from "./User"
// import { Appointment } from "./Patient"

@Entity()
export class Employee {
  @PrimaryGeneratedColumn()
  id!: number

  @Column()
  role!: string

  @OneToOne(() => User, (user) => user.employee)
  @JoinColumn({ name: "userId" })
  user!: User

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  hourlySalary!: number;

   @OneToMany(() => Availability, (availability) => availability.employee)
  availabilities!: Availability[];
}

@Entity('empAvailability')
export class Availability {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Employee, (employee) => employee.availabilities)
  @JoinColumn({ name: 'empId' })
  employee!: Employee;

  @Column({ type: 'datetime' })
  date!: Date;

  @Column({ type: 'time' })
  startTime!: string;

  @Column({ type: 'time' })
  endTime!: string;

  @Column({
    type: 'varchar',
    length: 20,
    default: 'av'
  })
  status!: 'av' | 'scheduled' | 'completed' | 'cancelled' | 'no-show';

  // (Optional) If you want to be able to navigate from an availability to its appointment:
  // @OneToOne(() => Appointment, (appointment) => appointment.availability)
  // appointment?: Appointment;
}
