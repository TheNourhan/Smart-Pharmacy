import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, ManyToOne } from "typeorm"
import { User } from "./User"
import { Availability, Employee } from "./Employee";

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

@Entity('appointment')
export class Appointment {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Employee, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'empId' })
  employee!: Employee;

  @ManyToOne(() => Patient, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'patientId' })
  patient!: Patient;

  @OneToOne(() => Availability, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'availabilityId' })
  availability!: Availability;
  
  @Column({
    type: 'varchar',
    length: 20,
    default: 'av',
  })
  status!: 'av' | 'scheduled' | 'completed' | 'cancelled' | 'no-show';
}
