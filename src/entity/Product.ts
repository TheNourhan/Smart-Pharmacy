import {
  Entity, PrimaryGeneratedColumn, Column,
  OneToMany, CreateDateColumn, UpdateDateColumn
} from 'typeorm';
import { Medication } from './Medication';

@Entity('product')
export class Product {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  brandName!: string;

  @Column()
  genericName!: string;

  @Column()
  price!: string;

  @Column({ nullable: true })
  strength?: string;

  @Column()
  dosageForm!: string;

  @Column()
  quantity!: string;

  @Column({ type: 'date' })
  expirationDate!: Date;

  @Column({ nullable: true })
  formula?: string;

  @Column({ nullable: true })
  description?: string;

  @Column()
  imageURL!: string;

  @OneToMany(() => Medication, (medication) => medication.product)
  medications!: Medication[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
