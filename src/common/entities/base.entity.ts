import { ApiProperty } from '@nestjs/swagger';
import {
  CreateDateColumn,
  DeleteDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { IBaseEntity } from '../interfaces/base-entity.interface';

/**
 * Class handles some properties and behaviors, common to almost all the
 * project entities.
 */
export abstract class BaseEntity implements IBaseEntity {
  /**
   * @inheritDoc
   */
  @ApiProperty({ example: 'f93d6ff1-36fb-494f-b57c-26eefae0414c' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /**
   * @inheritDoc
   */
  @ApiProperty({ example: new Date() })
  @CreateDateColumn()
  createdAt: Date;

  /**
   * @inheritDoc
   */
  @ApiProperty({ example: new Date() })
  @UpdateDateColumn()
  updatedAt: Date;

  /**
   * @inheritDoc
   */
  @ApiProperty({ example: null })
  @DeleteDateColumn()
  deletedAt: Date;

  constructor(partial: Partial<IBaseEntity>) {
    Object.assign(this, partial);
  }

  /**
   * Method that validates if the given id parameter is equal to the
   * entity `id` property.
   *
   * @param id defines the value that will be compared.
   * @returns true if the ids are equal, otherwise false.
   */
  equals(id: string): boolean;

  /**
   * Method that, given an entity, compares their ids.
   *
   * @param entity defines the entity that will be compared.
   * @returns true if the ids are equal, otherwise false.
   */
  equals<T extends IBaseEntity>(entity: T): boolean;

  /**
   * @ignore
   */
  equals(value: string | IBaseEntity) {
    if (!value) {
      return false;
    }

    if (typeof value === 'string') {
      return this.id === value;
    }

    return this.id === value.id;
  }
}
