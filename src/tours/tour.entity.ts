import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { TourDifficulty } from './tour-difficulty.enum';

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

  // @Column()
  // imageCover: string;
  // @Column()
  // images: string[];
  // @Column()
  // startDates: Date[];
}
