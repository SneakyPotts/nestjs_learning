import { Module } from '@nestjs/common';
import { ArticleController } from '@app/article/article.controller';
import { ArticleService } from '@app/article/article.service';
import { ArticleEntity } from '@app/article/article.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  controllers: [ArticleController],
  providers: [ArticleService],
  imports: [TypeOrmModule.forFeature([ArticleEntity])],
})
export class ArticleModule {}
