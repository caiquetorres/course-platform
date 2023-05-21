import { Column, Entity, ManyToOne, Relation } from 'typeorm';

import { BaseEntity } from '../../common/entities/base.entity';
import { User } from '../../user/entities/user.entity';
import { Project } from './project.entity';

import { ApplicationStatus } from '../enums/application-status.enum';

import { IApplication } from '../interfaces/application.interface';

@Entity('applications')
export class Application extends BaseEntity implements IApplication {
  @Column({
    nullable: false,
    default: ApplicationStatus.waitListed,
    type: 'varchar',
  })
  status: ApplicationStatus;

  @ManyToOne(() => User, (user) => user.applications)
  user: Relation<User>;

  @ManyToOne(() => Project, (project) => project.applications)
  project: Relation<Project>;

  constructor(partial: Partial<IApplication>) {
    super();
    Object.assign(this, partial);
  }
}
