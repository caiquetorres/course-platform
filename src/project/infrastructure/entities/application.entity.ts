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
import { ProjectEntity } from './project.entity';

import { Application } from '../../domain/models/application';

import {
  ApplicationStatus,
  ApplicationStatuses,
} from '../../domain/value-objects/application-status';

@Entity('applications')
export class ApplicationEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @Column({
    nullable: false,
    default: ApplicationStatus.default.value,
    enum: ApplicationStatus.statuses,
    type: 'varchar',
  })
  status: ApplicationStatuses;

  @ManyToOne(() => UserEntity, (user) => user.applications, {
    eager: true,
    nullable: false,
  })
  owner: Relation<UserEntity>;

  @ManyToOne(() => ProjectEntity, (project) => project.applications, {
    eager: true,
    nullable: false,
  })
  project: Relation<ProjectEntity>;

  toModel() {
    return new Application({
      id: this.id,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      deletedAt: this.deletedAt,
      status: new ApplicationStatus(this.status),
      owner: this.owner.toModel(),
      project: this.project.toModel(),
    });
  }

  static fromModel(application: Application) {
    const entity = new ApplicationEntity();

    entity.id = application.id;
    entity.createdAt = application.createdAt;
    entity.updatedAt = application.updatedAt;
    entity.deletedAt = application.deletedAt;

    entity.status = application.status.value;
    entity.owner = UserEntity.fromModel(application.owner);
    entity.project = ProjectEntity.fromModel(application.project);

    return entity;
  }
}
