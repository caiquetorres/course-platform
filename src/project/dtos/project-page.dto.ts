import { Project } from '../entities/project.entity';

import { PageDto } from '../../common/models/page.dto';

export class ProjectPageDto extends PageDto(Project) {}
