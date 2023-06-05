import { Column, Entity, Index } from 'typeorm';

import { BaseEntity } from '../../../common/infrastructure/entities/base.entity';

import { Role } from '../../domain/models/role.enum';

import { Expose } from 'class-transformer';

@Entity('users')
export class UserEntity extends BaseEntity {
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

  @Expose({ name: 'permissions' })
  @Column({ nullable: false, type: 'simple-array' })
  roles: Role[];
}
