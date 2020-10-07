import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { TourDifficulty } from './tour-difficulty.enum';
import { UserEntity } from 'src/auth/user.entity';
import { ILocations } from './locations.interface';

@Entity()
export class TourEntity extends BaseEntity {
  // ?? Maybe generate using uuid, eg @PrimaryGeneratedColumn("uuid") OR
  // ?? @Column()
  // ?? @Generated("uuid")
  // ?? uuid: string;
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column('timestamp', {
    default: () => 'CURRENT_TIMESTAMP',
    select: false,
    nullable: false,
  })
  createdAt: Date;

  @Column('date', { array: true })
  startDates: Array<Date>;

  // TODO: Implement geojson for start location

  @Column({ default: 'default-img-cover.jpg' })
  imageCover: string;

  @Column('text', { nullable: true, array: true })
  images: Array<string>;

  @Column()
  difficulty: TourDifficulty;

  @Column()
  price: number;

  @Column({ nullable: true })
  duration: number;

  @Column({ nullable: true })
  maxGroupSize: number;

  @Column({ nullable: true })
  summary: string;

  @Column('simple-json', { nullable: true })
  locations: Array<ILocations>;

  @ManyToOne(
    () => UserEntity,
    user => user.tours,
    { eager: false },
  )
  user: UserEntity;

  @Column()
  userId: number;
}
