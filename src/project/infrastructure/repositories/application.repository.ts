import { User } from '../../../user/domain/models/user';
import { Application } from '../../domain/models/application';
import { Project } from '../../domain/models/project';

export abstract class ApplicationRepository {
  abstract save(application: Application): Promise<Application>;

  abstract findByOwnerAndProject(
    owner: User,
    project: Project,
  ): Promise<Application | null>;

  abstract remove(application: Application): Promise<void>;
}
