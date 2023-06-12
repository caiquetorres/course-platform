import { Test } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Role } from '../../../src/user/domain/models/role.enum';
import { User } from '../../../src/user/domain/models/user';
import { CreateUserDto } from '../../../src/user/presentation/create-user.dto';
import { UpdateUserDto } from '../../../src/user/presentation/update-user.dto';

import { UserController } from '../../../src/user/presentation/user.controller';

import { LogRepository } from '../../../src/log/infrastructure/repositories/log.repository';
import { Email } from '../../../src/user/domain/value-objects/email';
import { Password } from '../../../src/user/domain/value-objects/password';
import { Username } from '../../../src/user/domain/value-objects/username';
import { UserRepository } from '../../../src/user/infrastructure/repositories/user.repository';
import { UserModule } from '../../../src/user/user.module';
import { UserBuilder } from '../../builders/user/user.builder';
import path from 'path';

describe('UserController (int)', () => {
  let controller: UserController;
  let repository: UserRepository;

  beforeEach(async () => {
    const entitiesPath = path.resolve(__dirname, '../../../src/**/*.entity.ts');

    const moduleRef = await Test.createTestingModule({
      imports: [
        UserModule,
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          dropSchema: true,
          synchronize: true,
          entities: [entitiesPath],
        }),
      ],
    })
      .overrideProvider(LogRepository)
      .useValue(null)
      .compile();

    controller = moduleRef.get(UserController);
    repository = moduleRef.get(UserRepository);
  });

  it('should create a new user', async () => {
    const requestUser = new UserBuilder().asGuest().build();

    const dto = new CreateUserDto();
    dto.name = 'Jane Doe';
    dto.email = 'janedoe@email.com';
    dto.username = 'janedoe';
    dto.password = 'JaneDoe123*';

    const user = await controller.createOne(requestUser, dto);

    expect(user).toBeDefined();
    expect(user).toHaveProperty('name', 'Jane Doe');
    expect(user).not.toHaveProperty('password');
    expect(user).toHaveProperty('permissions');
  });

  it('should get the logger user', async () => {
    const requestUser = await repository.save(
      new User({
        name: 'Jane Doe',
        password: Password.from('JaneDoe123*'),
        username: new Username('janedoe'),
        email: new Email('janedoe@email.com'),
        roles: new Set<Role>([Role.user]),
      }),
    );

    const result = await controller.findMe(requestUser);
    expect(result).toHaveProperty('name', requestUser.name);
    expect(result).not.toHaveProperty('password');
  });

  it('should get the user by id', async () => {
    const requestUser = await repository.save(
      new User({
        name: 'Jane Doe',
        password: Password.from('JaneDoe123*'),
        username: new Username('janedoe'),
        email: new Email('janedoe@email.com'),
        roles: new Set<Role>([Role.user]),
      }),
    );

    const result = await controller.findOne(requestUser, requestUser.id);
    expect(result).toHaveProperty('name', requestUser.name);
    expect(result).not.toHaveProperty('password');
  });

  it('should update the user', async () => {
    const requestUser = await repository.save(
      new User({
        name: 'Jane Doe',
        password: Password.from('JaneDoe123*'),
        username: new Username('janedoe'),
        email: new Email('janedoe@email.com'),
        roles: new Set<Role>([Role.user]),
      }),
    );

    const dto = new UpdateUserDto();
    dto.name = 'Mary Doe';

    const result = await controller.updateOne(requestUser, requestUser.id, dto);
    expect(result).toHaveProperty('name', dto.name);
    expect(result).not.toHaveProperty('password');
  });

  it('should delete the user', async () => {
    const requestUser = await repository.save(
      new User({
        name: 'Jane Doe',
        password: Password.from('JaneDoe123*'),
        username: new Username('janedoe'),
        email: new Email('janedoe@email.com'),
        roles: new Set<Role>([Role.user]),
      }),
    );

    const result = await controller.deleteOne(requestUser, requestUser.id);
    expect(result).toBeUndefined();
  });
});
