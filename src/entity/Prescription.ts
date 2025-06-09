import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Patient } from './Patient';

@Entity('doctor')
export class Doctor {
  @PrimaryGeneratedColumn()
  doctorID!: number;

  @Column()
  firstName!: string;

  @Column()
  lastName!: string;

  @Column()
  email?: string;

  @Column()
  phone?: string;

  @OneToMany(() => Prescription, (prescription) => prescription.doctor)
  prescriptions?: Prescription[];
}

@Entity('hospital')
export class Hospital {
  @PrimaryGeneratedColumn()
  hospitalID!: number;

  @Column()
  hospitalName!: string;

  @OneToMany(() => Prescription, (prescription) => prescription.doctor)
  prescriptions?: Prescription[];
}

@Entity('prescription')
export class Prescription {
  @PrimaryGeneratedColumn()
  prescriptionID!: number;

  @Column('text', { nullable: true })
  description?: string;

  @Column({ nullable: false })
  imageURL!: string;

  @ManyToOne(() => Patient, (patient) => patient.prescriptions, { onDelete: 'CASCADE' })
  patient!: Patient;

  @ManyToOne(() => Doctor, (doctor) => doctor.prescriptions, { onDelete: 'SET NULL' })
  doctor?: Doctor;

  @ManyToOne(() => Hospital, (medication) => medication.prescriptions, { onDelete: 'SET NULL' })
  hospital?: Hospital;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}