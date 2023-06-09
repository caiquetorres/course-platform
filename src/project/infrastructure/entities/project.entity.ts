import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Relation,
  UpdateDateColumn,
} from 'typeorm';

import { UserEntity } from '../../../user/infrastructure/entities/user.entity';

import { Project } from '../../domain/models/project';

@Entity('projects')
export class ProjectEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @Column({ nullable: false, length: 128 })
  name: string;

  @Column({ nullable: false, type: 'text' })
  description: string;

  @ManyToOne(() => UserEntity, (user) => user.projects, {
    nullable: false,
    eager: true,
  })
  owner: Relation<UserEntity>;

  toModel() {
    return new Project({
      id: this.id,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      deletedAt: this.deletedAt,
      name: this.name,
      description: this.description,
      owner: this.owner.toModel(),
    });
  }

  static fromModel(project: Project) {
    const entity = new ProjectEntity();

    entity.id = project.id;
    entity.createdAt = project.createdAt;
    entity.updatedAt = project.updatedAt;
    entity.deletedAt = project.deletedAt;

    entity.name = project.name;
    entity.description = project.description;
    entity.owner = UserEntity.fromModel(project.owner);

    return entity;
  }
}
