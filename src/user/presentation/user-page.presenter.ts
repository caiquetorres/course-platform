import { PagePresenter } from '../../common/presentation/page.presenter';
import { UserPresenter } from './user.presenter';

export class UserPagePresenter extends PagePresenter(UserPresenter) {}
