import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CommentEntity } from './infrastructure/entities/comment.entity';
import { FeedbackEntity } from './infrastructure/entities/feedback.entity';
import { TopicEntity } from './infrastructure/entities/topic.entity';

import { UpdateTopicDto } from './presentation/update-topic.dto';

import { TopicController } from './presentation/topic.controller';

import { TopicRepository } from './infrastructure/repositories/topic.repository';
import { TopicTypeOrmRepository } from './infrastructure/repositories/typeorm/topic-typeorm.repository';
import { CreateTopicUseCase } from './usecases/create-topic.usecase';
import { DeleteTopicUseCase } from './usecases/delete-topic.usecase';
import { FindManyTopicsUseCase } from './usecases/find-many-topics.usecase';
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
    {
      provide: TopicRepository,
      useClass: TopicTypeOrmRepository,
    },
  ],
})
export class TopicModule {}
