import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import TourRepository from './tour.repository';
import { ToursController } from './tours.controller';
import { ToursService } from './tours.service';

@Module({
  imports: [TypeOrmModule.forFeature([TourRepository])],
  controllers: [ToursController],
  providers: [ToursService],
})
export class ToursModule {}