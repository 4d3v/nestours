import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/auth/user.entity';
import { CreateReviewDto } from './dto/create-review.dto';
import ReviewsRepository from './reviews.repository';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(ReviewsRepository)
    private reviewsRepository: ReviewsRepository,
  ) {}

  async createReview(
    id: number,
    createReviewDto: CreateReviewDto,
    user: UserEntity,
  ) {
    return await this.reviewsRepository.createReview(id, createReviewDto, user);
  }
}
