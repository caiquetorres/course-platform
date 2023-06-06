import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Role } from '../../domain/models/role.enum';

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @Column({ nullable: false, length: 64 })
  name: string;

  @Index('user_username')
  @Column({ nullable: false, length: 64, unique: true })
  username: string;

  @Index('user_email')
  @Column({ nullable: false, length: 128, unique: true })
  email: string;

  @Column({ nullable: false, type: 'text' })
  password: string;

  @Column({ nullable: false, type: 'simple-array' })
  roles: Role[];
}
