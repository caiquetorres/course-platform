import {
  Entity,
  Column,
  ManyToOne,
  Relation,
  CreateDateColumn,
  DeleteDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { UserEntity } from '../../../user/infrastructure/entities/user.entity';
import { CommentEntity } from './comment.entity';

import { Feedback } from '../../domain/models/feedback';

@Entity('feedbacks')
export class FeedbackEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @Column({ nullable: false })
  status: boolean;

  @ManyToOne(() => UserEntity, (user) => user.feedbacks, {
    nullable: false,
    eager: true,
  })
  owner: Relation<UserEntity>;

  @ManyToOne(() => CommentEntity, (comment) => comment.feedbacks, {
    nullable: false,
    eager: true,
  })
  comment: Relation<CommentEntity>;

  toModel() {
    return new Feedback({
      id: this.id,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      deletedAt: this.deletedAt,
      status: this.status,
      owner: this.owner.toModel(),
      comment: this.comment.toModel(),
    });
  }

  static fromModel(feedback: Feedback) {
    const entity = new FeedbackEntity();

    entity.id = feedback.id;
    entity.createdAt = feedback.createdAt;
    entity.updatedAt = feedback.updatedAt;
    entity.deletedAt = feedback.deletedAt;

    entity.status = feedback.status;
    entity.owner = UserEntity.fromModel(feedback.owner);
    entity.comment = CommentEntity.fromModel(feedback.comment);

    return entity;
  }
}
