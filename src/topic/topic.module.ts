import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CommentEntity } from './infrastructure/entities/comment.entity';
import { FeedbackEntity } from './infrastructure/entities/feedback.entity';
import { TopicEntity } from './infrastructure/entities/topic.entity';

import { UpdateTopicDto } from './presentation/update-topic.dto';

import { TopicController } from './presentation/topic.controller';

import { TopicRepository } from './infrastructure/repositories/topic.repository';
import { TopicTypeOrmRepository } from './infrastructure/repositories/typeorm/topic-typeorm.repository';
import { CreateCommentUsecase } from './usecases/create-comment.usecase';
import { CreateTopicUseCase } from './usecases/create-topic.usecase';
import { DeleteCommentUseCase } from './usecases/delete-comment.usecase';
import { DeleteTopicUseCase } from './usecases/delete-topic.usecase';
import { FindManyCommentsUseCase } from './usecases/find-many-comments.usecase';
import { FindManyTopicsUseCase } from './usecases/find-many-topics.usecase';
import { FindOneCommentUseCase } from './usecases/find-one-comment.usecase';
import { FindOneTopicUseCase } from './usecases/find-one-topic.usecase';

@Module({
  imports: [
    TypeOrmModule.forFeature([TopicEntity, FeedbackEntity, CommentEntity]),
  ],
  controllers: [TopicController],
  providers: [
    CreateTopicUseCase,
    FindOneTopicUseCase,
    FindManyTopicsUseCase,
    UpdateTopicDto,
    DeleteTopicUseCase,
    CreateCommentUsecase,
    FindOneCommentUseCase,
    FindManyCommentsUseCase,
    DeleteCommentUseCase,
    {
      provide: TopicRepository,
      useClass: TopicTypeOrmRepository,
    },
  ],
})
export class TopicModule {}
