import { Project } from '../../domain/models/project';

import { IPage } from '../../../common/domain/interfaces/page.interface';
import { PageQuery } from '../../../common/presentation/page.query';

export abstract class ProjectRepository {
  abstract save(project: Project): Promise<Project>;

  abstract findOneById(id: string): Promise<Project | null>;

  abstract findMany(query: PageQuery): Promise<IPage<Project>>;

  abstract remove(project: Project): Promise<void>;
}
