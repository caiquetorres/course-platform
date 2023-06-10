import {
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  Column,
  ManyToOne,
  Relation,
  Entity,
  OneToMany,
} from 'typeorm';

import { UserEntity } from '../../../user/infrastructure/entities/user.entity';
import { CommentEntity } from './comment.entity';

import { Topic } from '../../domain/models/topic';

@Entity('topics')
export class TopicEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @Column({ nullable: false })
  title: string;

  @ManyToOne(() => UserEntity, (user) => user.topics, {
    nullable: false,
    eager: true,
  })
  owner: Relation<UserEntity>;

  @OneToMany(() => CommentEntity, (comment) => comment.topic)
  comments: Relation<CommentEntity>[];

  toModel() {
    return new Topic({
      id: this.id,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      deletedAt: this.deletedAt,
      title: this.title,
      owner: this.owner.toModel(),
    });
  }

  static fromModel(topic: Topic) {
    const entity = new TopicEntity();

    entity.id = topic.id;
    entity.createdAt = topic.createdAt;
    entity.updatedAt = topic.updatedAt;
    entity.deletedAt = topic.deletedAt;

    entity.title = topic.title;
    entity.owner = UserEntity.fromModel(topic.owner);

    return entity;
  }
}
