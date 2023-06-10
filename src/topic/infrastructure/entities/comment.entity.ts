import {
  Entity,
  Column,
  ManyToOne,
  Relation,
  OneToMany,
  CreateDateColumn,
  DeleteDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { UserEntity } from '../../../user/infrastructure/entities/user.entity';
import { FeedbackEntity } from './feedback.entity';
import { TopicEntity } from './topic.entity';

import { Comment } from '../../domain/models/comment';

@Entity('comments')
export class CommentEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @Column({ nullable: false })
  text: string;

  @ManyToOne(() => UserEntity, (user) => user.comments, {
    nullable: false,
    eager: true,
  })
  owner: Relation<UserEntity>;

  @ManyToOne(() => TopicEntity, (topic) => topic.comments, {
    nullable: false,
    eager: true,
  })
  topic: Relation<TopicEntity>;

  @OneToMany(() => FeedbackEntity, (feedback) => feedback.comment)
  feedbacks: Relation<FeedbackEntity>[];

  toModel() {
    return new Comment({
      id: this.id,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      deletedAt: this.deletedAt,
      text: this.text,
      owner: this.owner.toModel(),
      topic: this.topic.toModel(),
    });
  }

  static fromModel(comment: Comment) {
    const entity = new CommentEntity();

    entity.id = comment.id;
    entity.createdAt = comment.createdAt;
    entity.updatedAt = comment.updatedAt;
    entity.deletedAt = comment.deletedAt;

    entity.text = comment.text;
    entity.owner = UserEntity.fromModel(comment.owner);
    entity.topic = TopicEntity.fromModel(comment.topic);

    return entity;
  }
}
