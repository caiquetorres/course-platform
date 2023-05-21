import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, ManyToOne, OneToMany, Relation } from 'typeorm';

import { BaseEntity } from '../../common/entities/base.entity';
import { User } from '../../user/entities/user.entity';
import { Application } from './application.entity';

import { IProject } from '../interfaces/project.interface';
import { Exclude } from 'class-transformer';

@Entity('projects')
export class Project extends BaseEntity implements IProject {
  @ApiProperty({ example: 'My Project' })
  @Column({ nullable: false })
  name: string;

  @Exclude()
  @ManyToOne(() => User, (user) => user.projects)
  owner: Relation<User>;

  @Exclude()
  @OneToMany(() => Application, (application) => application.project)
  applications: Relation<Application>[];

  constructor(partial: Partial<IProject>) {
    super();
    Object.assign(this, partial);
  }
}
