import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export default class Role {
  @PrimaryGeneratedColumn()
    id: number

  @Column({ unique: true })
    name: string;
}
