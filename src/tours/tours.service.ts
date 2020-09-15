import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateTourDto } from './dto/create-tour.dto';
import { GetToursFilterDto } from './dto/get-tours.filter.dto';
import { TourEntity } from './tour.entity';
import TourRepository from './tour.repository';

@Injectable()
export class ToursService {
  constructor(
    @InjectRepository(TourRepository)
    private tourRepository: TourRepository,
  ) {}

  async getTours(filterDto: GetToursFilterDto): Promise<TourEntity[]> {
    // return await this.tourRepository.find({
    //   select: ['id', 'name', 'description', 'difficulty', 'price'],
    // });
    return await this.tourRepository.getTours(filterDto);
  }

  async getTourById(id: number): Promise<TourEntity> {
    const tour = await this.tourRepository.findOne(id);
    if (!tour) throw new NotFoundException(`Tour with id: ${id} not found!`);
    return tour;
  }

  async createTour(createTourDto: CreateTourDto): Promise<TourEntity> {
    return await this.tourRepository.createTour(createTourDto);
  }

  async deleteTour(id: number): Promise<void> {
    this.tourRepository.delete(id);
  }
}
