import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class TourEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  difficulty: string;

  @Column()
  price: number;

  @Column()
  duration: number;

  @Column()
  maxGroupSize: number;

  @Column()
  summary: string;

  // @Column()
  // imageCover: string;
  // @Column()
  // images: string[];
  // @Column()
  // startDates: Date[];
}
