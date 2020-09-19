import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { UserRole } from './user-role.enum';
import { TourEntity } from 'src/tours/tour.entity';

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

  // TODO: Make so that the user cannot specify role on creation
  @Column({ type: 'enum', enum: UserRole, default: UserRole.USER })
  role: UserRole;

  @Column()
  password: string;

  @Column({ nullable: true })
  passwordConfirm: string | null;

  @OneToMany(
    () => TourEntity,
    tour => tour.user,
    { eager: true },
  )
  tours: TourEntity[];

  // !! Those commented fields will be implemented later
  // passwordChangedAt: Date;
  // passwordResetToken: string;
  // passwordResetExpires: Date;
  // active: boolean;

  async validatePassword(password: string): Promise<boolean> {
    return await bcrypt.compare(password, this.password);
  }
}
