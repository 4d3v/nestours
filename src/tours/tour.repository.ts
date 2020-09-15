import { InternalServerErrorException, Logger } from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import { CreateTourDto } from './dto/create-tour.dto';
import { GetToursFilterDto } from './dto/get-tours.filter.dto';
import { TourEntity } from './tour.entity';

@EntityRepository(TourEntity)
export default class TourRepository extends Repository<TourEntity> {
  private logger = new Logger('TourRepository');

  async getTours(filterDto: GetToursFilterDto) {
    const { search, difficulty } = filterDto;
    const query = await this.createQueryBuilder('tour');

    if (search)
      query.where(
        '(LOWER(tour.name) LIKE LOWER(:search) OR LOWER(tour.description) LIKE LOWER(:search) OR LOWER(tour.summary) LIKE LOWER(:search))',
        { search: `%${search}%` },
      );

    if (difficulty)
      query.andWhere('tour.difficulty = :difficulty', { difficulty });

    try {
      const tours = await query.getMany();
      return tours;
    } catch (err) {
      this.logger.error(
        `Failed to get tasks. Filters: ${JSON.stringify(filterDto)}`,
        err.stack,
      );
      throw new InternalServerErrorException();
    }
  }

  async createTour(createTourDto: CreateTourDto) {
    const {
      name,
      description,
      difficulty,
      price,
      duration,
      maxGroupSize,
      summary,
    } = createTourDto;

    const tour = new TourEntity();
    tour.name = name;
    tour.description = description;
    tour.difficulty = difficulty;
    tour.price = price;
    tour.duration = duration;
    tour.maxGroupSize = maxGroupSize;
    tour.summary = summary;

    try {
      await tour.save();
    } catch (err) {
      this.logger.error(
        `Failed to create a tour: "${tour.name}". Data: ${JSON.stringify(
          createTourDto,
        )}`,
        err.stack,
      );
    }

    return tour;
  }
}