import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from '../entities/user.entity';

import { CreateUserDto } from '../dtos/create-user.dto';
import { Role } from '../enums/role.enum';

import bcryptjs from 'bcryptjs';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly _userRepository: Repository<User>,
  ) {}

  async createOne(_requestUser: User, dto: CreateUserDto) {
    const hasWithEmail = await this._hasWithEmail(dto.email);
    if (hasWithEmail) {
      throw new ConflictException(
        `The user with the email '${dto.email}' already exists`,
      );
    }

    const hasWithUsername = await this._hasWithUsername(dto.username);
    if (hasWithUsername) {
      throw new ConflictException(
        `The user with the username '${dto.email}' already exists`,
      );
    }

    const user = new User({
      ...dto,
      roles: [Role.user],
      password: await this._encryptPassword(dto.password),
    });

    return this._userRepository.save(user);
  }

  private async _hasWithEmail(email: string) {
    return this._userRepository
      .findOne({ where: { email } })
      .then((user) => !!user);
  }

  private async _hasWithUsername(username: string) {
    return this._userRepository
      .findOne({ where: { username } })
      .then((user) => !!user);
  }

  /**
   * Method that encrypts the password.
   *
   * @param password defines the password that will be encrypted.
   * @returns the encrypted password.
   */
  private async _encryptPassword(password: string): Promise<string> {
    const salt = await bcryptjs.genSalt();
    return bcryptjs.hash(password, salt);
  }
}
