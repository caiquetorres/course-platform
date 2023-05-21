import { User } from '../../user/entities/user.entity';

export interface IApplicationService {
  apply(requestUser: User, projectId: string): Promise<void>;

  withdraw(requestUser: User, projectId: string): Promise<void>;
}
