import { UserEntity } from 'src/auth/user.entity';
import { TourEntity } from 'src/tours/tour.entity';
import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class ReviewsEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  review: string;

  @Column('timestamp', {
    default: () => 'CURRENT_TIMESTAMP',
    select: false,
    nullable: false,
  })
  createdAt: Date;

  @ManyToOne(
    () => UserEntity,
    user => user.reviews,
  )
  user: UserEntity;

  @Column()
  userId: number;

  @ManyToOne(
    () => TourEntity,
    tour => tour.reviews,
  )
  tour: TourEntity;

  @Column()
  tourId: number;
}
