import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
  Relation,
  UpdateDateColumn,
} from 'typeorm';

import { CourseEntity } from '../../../course/infrastructure/entities/course.entity';

import { Role } from '../../domain/models/role.enum';
import { User } from '../../domain/models/user';

import { Email } from '../../domain/value-objects/email';
import { Password } from '../../domain/value-objects/password';
import { Username } from '../../domain/value-objects/username';

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

  /**
   * The courses that belongs to the user.
   */
  // REVIEW: Is that property necessary?
  @OneToMany(() => CourseEntity, (course) => course.owner)
  courses: Relation<CourseEntity>[];

  toModel() {
    return new User({
      id: this.id,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      deletedAt: this.deletedAt,
      name: this.name,
      username: new Username(this.username),
      email: new Email(this.email),
      password: new Password(this.password),
      roles: new Set(this.roles),
    });
  }

  static fromModel(user: User) {
    const entity = new UserEntity();

    entity.id = user.id;
    entity.createdAt = user.createdAt;
    entity.updatedAt = user.updatedAt;
    entity.deletedAt = user.deletedAt;

    entity.name = user.name;
    entity.username = user.username.value;
    entity.email = user.email.value;
    entity.password = user.password.value;
    entity.roles = [...user.roles];

    return entity;
  }
}
