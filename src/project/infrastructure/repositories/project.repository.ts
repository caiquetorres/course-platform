import { Project } from '../../domain/models/project';

export abstract class ProjectRepository {
  abstract save(project: Project): Promise<Project>;

  abstract findOneById(id: string): Promise<Project | null>;
}
