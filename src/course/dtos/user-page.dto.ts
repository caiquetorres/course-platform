import { Course } from '../entities/course.entity';

import { PageDto } from '../../common/models/page.dto';

export class CoursePageDto extends PageDto(Course) {}
