import { Entity, Column, PrimaryColumn, ManyToMany, JoinTable } from 'typeorm';
import Role from './role';

@Entity()
export default class Ship {
  @PrimaryColumn()
    id: string;

  @Column({ nullable: true })
    name: string;

  @Column({ nullable: true })
    type: string;

  @Column({ nullable: true })
    year_built: number;

  @Column({ default: false })
    active: boolean;

  @ManyToMany(
    () => Role,
    { onDelete: 'NO ACTION', onUpdate: 'NO ACTION' })
  @JoinTable({
    name: 'ship_role',
    joinColumn: {
      name: 'ship_id',
      referencedColumnName: 'id'
    },
    inverseJoinColumn: {
      name: 'role_id',
      referencedColumnName: 'id'
    }
  })
    roles?: Role[];
}
