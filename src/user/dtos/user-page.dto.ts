import { User } from '../entities/user.entity';

import { PageDto } from '../../common/models/page.dto';

export class UserPageDto extends PageDto(User) {}
