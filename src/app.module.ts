import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './config/typeorm.config';
import { ToursModule } from './tours/tours.module';

@Module({
  imports: [TypeOrmModule.forRoot(typeOrmConfig), ToursModule],
})
export class AppModule {}
