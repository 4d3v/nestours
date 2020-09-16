import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CreateTourDto } from './dto/create-tour.dto';
import { UpdateTourDto } from './dto/update-tour.dto';
import { GetToursFilterDto } from './dto/get-tours.filter.dto';
import { TourEntity } from './tour.entity';
import { ToursService } from './tours.service';
import { TourDifficulty } from './tour-difficulty.enum';

@Controller('tours')
export class ToursController {
  private logger = new Logger('ToursController');

  constructor(private toursService: ToursService) {}

  @Get()
  getTours(
    @Query(new ValidationPipe()) filterDto: GetToursFilterDto,
  ): Promise<TourEntity[]> {
    filterDto.difficulty =
      TourDifficulty[filterDto.difficulty.toLocaleUpperCase()];

    this.logger.verbose(
      `Retrieving all tasks. $Filters: ${JSON.stringify(filterDto)}`,
    );

    return this.toursService.getTours(filterDto);
  }

  // @Get()
  // getTours(
  //   @Query('difficulty', TourDifficultyValidationPipe)
  //   tourDifficulty: TourDifficulty,
  //   @Query('search') search: string, // : Promise<TourEntity[]> {
  // ): Promise<TourEntity[]> {
  //   const filterDto = new GetToursFilterDto();
  //   if (search) filterDto.search = search;
  //   if (tourDifficulty) filterDto.difficulty = tourDifficulty;
  //   this.logger.verbose(
  //     `Retrieving all tasks. $Filters: ${JSON.stringify(filterDto)}`,
  //   );
  //   return this.toursService.getTours(filterDto);
  // }

  @Get('/:id')
  getTourById(@Param('id', ParseIntPipe) id: number): Promise<TourEntity> {
    return this.toursService.getTourById(id);
  }

  @Post()
  @UsePipes(ValidationPipe)
  createTour(@Body() createTaskDto: CreateTourDto): Promise<TourEntity> {
    return this.toursService.createTour(createTaskDto);
  }

  @Patch('/:id')
  @UsePipes(ValidationPipe)
  updateTour(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTourDto: UpdateTourDto,
  ): Promise<TourEntity> {
    return this.toursService.updateTour(id, updateTourDto);
  }

  @Delete('/:id')
  deleteTour(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.toursService.deleteTour(id);
  }
}
