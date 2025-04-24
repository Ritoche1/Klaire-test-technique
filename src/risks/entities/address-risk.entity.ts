import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn } from 'typeorm';
import { Address } from '../../addresses/entities/address.entity';

@Entity('address_risks')
export class AddressRisk {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Address, { eager: false })
  address: Address;

  @Column()
  addressId: number;

  @Column('text')
  riskData: string;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ nullable: true })
  expiresAt: Date;
}