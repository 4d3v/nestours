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
  Res,
  UnauthorizedException,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CreateTourDto } from './dto/create-tour.dto';
import { UpdateTourDto } from './dto/update-tour.dto';
import { GetToursFilterDto } from './dto/get-tours.filter.dto';
import { TourEntity } from './tour.entity';
import { ToursService } from './tours.service';
import { TourDifficulty } from './tour-difficulty.enum';
import { GetUser } from 'src/auth/get-user.decorator';
import { UserEntity } from 'src/auth/user.entity';
import { AuthGuard } from '@nestjs/passport';
import { UserRole } from 'src/auth/user-role.enum';
import { CreateReviewDto } from 'src/reviews/dto/create-review.dto';
import { ReviewsService } from 'src/reviews/reviews.service';

@Controller('tours')
export class ToursController {
  private logger = new Logger('ToursController');

  constructor(
    private toursService: ToursService,
    private reviewsService: ReviewsService,
  ) {}

  @Get()
  getTours(
    @Query(new ValidationPipe()) filterDto: GetToursFilterDto,
  ): Promise<TourEntity[]> {
    if (filterDto.difficulty)
      filterDto.difficulty = TourDifficulty[filterDto.difficulty.toUpperCase()];

    this.logger.verbose(
      `Retrieving all tasks. $Filters: ${JSON.stringify(filterDto)}`,
    );

    return this.toursService.getTours(filterDto);
  }

  @Get('/:id')
  getTourById(@Param('id', ParseIntPipe) id: number): Promise<TourEntity> {
    return this.toursService.getTourById(id);
  }

  @Post()
  @UsePipes(ValidationPipe)
  @UseGuards(AuthGuard())
  createTour(
    @Body() createTaskDto: CreateTourDto,
    @GetUser() user: UserEntity,
  ): Promise<TourEntity> {
    if (user.role === UserRole.USER || user.role === UserRole.GUIDE)
      throw new UnauthorizedException(
        'You do not have permission to perform this action',
      );
    console.log(typeof createTaskDto.startDates[0]);

    return this.toursService.createTour(createTaskDto, user);
  }

  @Patch('/:id')
  @UsePipes(ValidationPipe)
  @UseGuards(AuthGuard())
  updateTour(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTourDto: UpdateTourDto,
    @GetUser() user: UserEntity,
  ): Promise<TourEntity> {
    if (user.role === UserRole.USER || user.role === UserRole.GUIDE)
      throw new UnauthorizedException(
        'You do not have permission to perform this action',
      );
    return this.toursService.updateTour(id, updateTourDto, user);
  }

  @Delete('/:id')
  deleteTour(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.toursService.deleteTour(id);
  }

  @Post('/test')
  @UseGuards(AuthGuard())
  test(@GetUser() user: UserEntity) {
    console.log(user);
    return user;
  }

  @Post('/:id/reviews')
  @UseGuards(AuthGuard())
  async createReview(
    @Param('id', ParseIntPipe) id: number,
    @Body() createReviewDto: CreateReviewDto,
    @GetUser()
    user: UserEntity,
  ) {
    const tour = await this.getTourById(id);
    return this.reviewsService.createReview(tour.id, createReviewDto, user);
  }
}
