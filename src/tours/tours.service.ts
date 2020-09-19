import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/auth/user.entity';
import { CreateTourDto } from './dto/create-tour.dto';
import { GetToursFilterDto } from './dto/get-tours.filter.dto';
import { UpdateTourDto } from './dto/update-tour.dto';
import { TourEntity } from './tour.entity';
import TourRepository from './tour.repository';

@Injectable()
export class ToursService {
  constructor(
    @InjectRepository(TourRepository)
    private tourRepository: TourRepository,
  ) {}

  async getTours(filterDto: GetToursFilterDto): Promise<TourEntity[]> {
    return await this.tourRepository.getTours(filterDto);
  }

  async getTourById(id: number): Promise<TourEntity> {
    const tour = await this.tourRepository.findOne(id);
    if (!tour) throw new NotFoundException(`Tour with id: ${id} not found!`);
    return tour;
  }

  async createTour(
    createTourDto: CreateTourDto,
    user: UserEntity,
  ): Promise<TourEntity> {
    return await this.tourRepository.createTour(createTourDto, user);
  }

  async updateTour(
    id: number,
    updateTourDto: UpdateTourDto,
    user: UserEntity,
  ): Promise<TourEntity> {
    const tour = await this.getTourById(id);
    if (tour.userId !== user.id)
      throw new UnauthorizedException(
        'You do not have permission to perform this action',
      );
    return this.tourRepository.updateTour(tour, updateTourDto);
  }

  async deleteTour(id: number): Promise<void> {
    const tour = await this.getTourById(id);
    this.tourRepository.delete(tour.id);
  }
}
