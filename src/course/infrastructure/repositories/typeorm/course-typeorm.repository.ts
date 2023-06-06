import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CourseEntity } from '../../entities/course.entity';

import { Course } from '../../../domain/models/course';

import { Price } from '../../../domain/value-objects/price';
import { CourseRepository } from '../course.repository';

@Injectable()
export class CourseTypeOrmRepository extends CourseRepository {
  constructor(
    @InjectRepository(CourseEntity)
    private readonly _repository: Repository<CourseEntity>,
  ) {
    super();
  }

  override async save(course: Course): Promise<Course> {
    let entity = this._toEntity(course);
    entity = await this._repository.save(entity);
    return this._toModel(entity);
  }

  private _toEntity(course: Course): CourseEntity {
    const entity = new CourseEntity();

    entity.id = course.id;
    entity.createdAt = course.createdAt;
    entity.updatedAt = course.updatedAt;
    entity.deletedAt = course.deletedAt;

    entity.name = course.name;
    entity.price = +course.price;

    return entity;
  }

  private _toModel(entity: CourseEntity): Course {
    return new Course({
      id: entity.id,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      deletedAt: entity.deletedAt,
      name: entity.name,
      price: new Price(entity.price),
    });
  }
}
