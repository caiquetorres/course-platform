import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { EnrollmentEntity } from '../../entities/enrollment.entity';

import { User } from '../../../../user/domain/models/user';
import { Course } from '../../../domain/models/course';
import { Enrollment } from '../../../domain/models/enrollment';

import { EnrollmentRepository } from '../enrollment.repository';

@Injectable()
export class EnrollmentTypeOrmRepository extends EnrollmentRepository {
  constructor(
    @InjectRepository(EnrollmentEntity)
    private readonly _repository: Repository<EnrollmentEntity>,
  ) {
    super();
  }

  override async save(enrollment: Enrollment): Promise<Enrollment> {
    let entity = EnrollmentEntity.fromModel(enrollment);
    entity = await this._repository.save(entity);
    return entity.toModel();
  }

  override async findByOwnerAndCourse(
    owner: User,
    course: Course,
  ): Promise<Enrollment | null> {
    const entity = await this._repository.findOneBy({
      course: { id: course.id },
      owner: { id: owner.id },
    });
    return entity ? entity.toModel() : null;
  }

  override async remove(enrollment: Enrollment): Promise<void> {
    const entity = EnrollmentEntity.fromModel(enrollment);
    await this._repository.remove(entity);
  }
}
