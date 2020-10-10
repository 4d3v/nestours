import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { ReviewsModule } from 'src/reviews/reviews.module';
import TourRepository from './tour.repository';
import { ToursController } from './tours.controller';
import { ToursService } from './tours.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([TourRepository]),
    AuthModule,
    ReviewsModule,
  ],
  controllers: [ToursController],
  providers: [ToursService],
})
export class ToursModule {}
