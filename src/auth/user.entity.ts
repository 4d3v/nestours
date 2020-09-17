import {
  BaseEntity,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { UserRole } from './user-role.enum';

@Entity()
@Unique(['email'])
export class UserEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column({ default: 'default.jpg' })
  photo: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.USER })
  role: UserRole;

  @Column()
  password: string;

  @Column()
  passwordConfirm: string;

  // passwordChangedAt: Date;
  // passwordResetToken: string;
  // passwordResetExpires: Date;
  // active: boolean;
}
