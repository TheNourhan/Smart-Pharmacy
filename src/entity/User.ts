import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  Column,
  OneToOne,
  JoinColumn
} from 'typeorm';
import { Patient } from '@/entity/Patient';
import { Employee } from '@/entity/Employee';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  firstName!: string;

  @Column()
  lastName!: string;

  @Column({ unique: true })
  phone?: string;

  @Column({ unique: true })
  email!: string;

  @Column({ nullable: true })
  otpCode?: string;

  @Column({ type: 'datetime', nullable: true })
  otpActiveAt?: Date;

  @Column({ default: true })
  isActive!: boolean;

  @Column({ default: false })
  isEmailVerified!: boolean;

  @Column({ default: false })
  isPhoneVerified?: boolean;

  @Column()
  password!: string;

  @Column()
  status!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @DeleteDateColumn()
  deletedAt?: Date;

  @Column({ nullable: true })
  loginBy?: string;

  @Column({ nullable: true })
  googleId?: string;

  @OneToOne(() => Patient, patient => patient.user, { cascade: true })
  @JoinColumn({ name: "patientId" })
  patient?: Patient;

  @OneToOne(() => Employee, employee => employee.user, { cascade: true })
  @JoinColumn({ name: "employeeId" })
  employee?: Employee;
}
