import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { TourDifficulty } from './tour-difficulty.enum';
import { UserEntity } from 'src/auth/user.entity';

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

  // @Column({ type: "enum", enum: UserRole, default: UserRole.GHOST }) //   role: UserRole
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

  @ManyToOne(
    () => UserEntity,
    user => user.tours,
    { eager: false },
  )
  user: UserEntity;

  @Column()
  userId: number;

  // @Column()
  // imageCover: string;
  // @Column()
  // images: string[];
  // @Column()
  // startDates: Date[];
}
