import {
  CreateDateColumn,
  DeleteDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

/**
 * Class handles some properties and behaviors, common to almost all the
 * project entities.
 */
export abstract class BaseEntity {
  /**
   * @inheritDoc
   */
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /**
   * @inheritDoc
   */
  @CreateDateColumn()
  createdAt: Date;

  /**
   * @inheritDoc
   */
  @UpdateDateColumn()
  updatedAt: Date;

  /**
   * @inheritDoc
   */
  @DeleteDateColumn()
  deletedAt: Date;
}
