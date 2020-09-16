import { InternalServerErrorException, Logger } from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import { CreateTourDto } from './dto/create-tour.dto';
import { GetToursFilterDto } from './dto/get-tours.filter.dto';
import { UpdateTourDto } from './dto/update-tour.dto';
import { TourEntity } from './tour.entity';

@EntityRepository(TourEntity)
export default class TourRepository extends Repository<TourEntity> {
  private logger = new Logger('TourRepository');

  async getTours(filterDto: GetToursFilterDto) {
    try {
      const { search, difficulty } = filterDto;
      const query = await this.createQueryBuilder('tour');

      if (search)
        query.where(
          '(LOWER(tour.name) LIKE LOWER(:search) OR LOWER(tour.description) LIKE LOWER(:search) OR LOWER(tour.summary) LIKE LOWER(:search))',
          { search: `%${search}%` },
        );

      if (difficulty)
        query.andWhere('tour.difficulty = :difficulty', { difficulty });

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

  async updateTour(
    tour: TourEntity,
    updateTourDto: UpdateTourDto,
  ): Promise<TourEntity> {
    for (const x in updateTourDto) {
      if (updateTourDto[x]) {
        tour[x] = updateTourDto[x];

        // TODO Do a sanity check in case user enters a non number for fields
        // ** That requires it. Eg price: ???d91dias
        // ** In case that occurs do not enter this if statement
        // console.log(x, ' ', typeof (updateTourDto[x] * 1));
        // console.log(x, ' ', typeof Number(updateTourDto[x]));
        // console.log(tour[x]);
        // console.log(updateTourDto[x]);
        // console.log(+tour[x]);
      }
    }

    try {
      await tour.save();
    } catch (err) {
      this.logger.error(
        `Failed to update a tour: "${tour.name}". Data: ${JSON.stringify(
          updateTourDto,
        )}`,
        err.stack,
      );
    }

    return tour;
  }
}
