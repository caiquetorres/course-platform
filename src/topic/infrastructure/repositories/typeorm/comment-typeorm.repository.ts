import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CommentEntity } from '../../entities/comment.entity';

import { Comment } from '../../../domain/models/comment';

import { CommentRepository } from '../comment.repository';

@Injectable()
export class CommentTypeOrmRepository extends CommentRepository {
  constructor(
    @InjectRepository(CommentEntity)
    private readonly _repository: Repository<CommentEntity>,
  ) {
    super();
  }

  override async save(comment: Comment): Promise<Comment> {
    let entity = CommentEntity.fromModel(comment);
    entity = await this._repository.save(entity);
    return entity.toModel();
  }
}
