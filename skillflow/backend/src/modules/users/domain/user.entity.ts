import { Entity, PrimaryColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryColumn()
  id!: string;

  @Column({ unique: true })
  email!: string;

  @Column({ name: 'username', length: 100 })
  username!: string;

  @Column({ name: 'display_name', length: 200, nullable: true })
  displayName!: string;

  @Column({ type: 'simple-array', default: '' })
  roles!: string[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;
}
