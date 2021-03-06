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
import { ReviewsEntity } from 'src/reviews/reviews.entity';

@Entity()
@Unique(['name', 'email'])
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

  // @Column({ select: false })
  @Column()
  password: string;

  // @Column({ nullable: true })
  // @Column({ select: false })
  @Column()
  passwordConfirm: string | null;

  @OneToMany(
    () => TourEntity,
    tour => tour.user,
    { eager: true },
  )
  tours: TourEntity[];

  @OneToMany(
    () => ReviewsEntity,
    reviews => reviews.user,
  )
  reviews: ReviewsEntity[];

  // !! Those commented fields will be implemented later
  // passwordChangedAt: Date;
  // passwordResetToken: string;
  // passwordResetExpires: Date;

  @Column({ default: true })
  active: boolean;

  async validatePassword(password: string): Promise<boolean> {
    return await bcrypt.compare(password, this.password);
  }
}
