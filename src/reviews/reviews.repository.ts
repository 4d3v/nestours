import { InternalServerErrorException, Logger } from '@nestjs/common';
import { UserEntity } from 'src/auth/user.entity';
import { EntityRepository, Repository } from 'typeorm';
import { CreateReviewDto } from './dto/create-review.dto';
import { ReviewsEntity } from './reviews.entity';

@EntityRepository(ReviewsEntity)
export default class ReviewsRepository extends Repository<ReviewsRepository> {
  private logger = new Logger('ReviewsRepository');

  async createReview(
    id: number,
    createReviewDto: CreateReviewDto,
    user: UserEntity,
  ) {
    const review = new ReviewsEntity();
    review.userId = user.id;
    review.tourId = id;
    review.review = createReviewDto.review;

    try {
      await review.save();
    } catch (err) {
      this.logger.error(
        `Failed to create a review: "${review.review}". Data: ${JSON.stringify(
          createReviewDto,
        )}`,
        err.stack,
      );
      throw new InternalServerErrorException();
    }

    delete review.user;
    return review;
  }
}
