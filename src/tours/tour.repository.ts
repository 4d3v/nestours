import { InternalServerErrorException, Logger } from '@nestjs/common';
import { UserEntity } from 'src/auth/user.entity';
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

  async createTour(createTourDto: CreateTourDto, user: UserEntity) {
    const tour = new TourEntity();
    tour.user = user;

    for (const x in createTourDto)
      if (createTourDto[x]) tour[x] = createTourDto[x];

    try {
      await tour.save();
    } catch (err) {
      this.logger.error(
        `Failed to create a tour: "${tour.name}". Data: ${JSON.stringify(
          createTourDto,
        )}`,
        err.stack,
      );
      throw new InternalServerErrorException();
    }

    delete tour.user;
    return tour;
  }

  async updateTour(
    tour: TourEntity,
    updateTourDto: UpdateTourDto,
  ): Promise<TourEntity> {
    for (const x in updateTourDto) {
      if (updateTourDto[x]) {
        if (
          (x === 'price' || x === 'duration' || x === 'maxGroupSize') &&
          isNaN(+updateTourDto[x])
        ) {
          continue;
        }

        tour[x] = updateTourDto[x];
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
      throw new InternalServerErrorException();
    }

    return tour;
  }
}
