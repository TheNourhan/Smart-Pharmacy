import {
  Entity, PrimaryGeneratedColumn, Column,
  ManyToOne, CreateDateColumn, UpdateDateColumn,
  JoinColumn
} from 'typeorm';
import { Prescription } from './Prescription';
import { Product } from './Product';

@Entity('medication')
export class Medication {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  durationStart!: string;

  @Column({ nullable: true })
  durationEnd?: string;

  @Column({ nullable: true })
  reasonForUse?: string;

  @Column()
  frequency!: string;

  @Column({ nullable: true })
  description?: string;

  @ManyToOne(() => Prescription, (prescription) => prescription.medications, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'prescriptionId' })
  prescription!: Prescription;

  @ManyToOne(() => Product, (product) => product.medications, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  product?: Product;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
