import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserEntity } from '@app/user/user.entity';
import { CreateArticleDto } from '@app/article/dto/article.dto';
import { ArticleEntity } from '@app/article/article.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, DeleteResult, Repository } from 'typeorm';
import {
  ArticleResponseInterface,
  ArticlesResponseInterface,
} from '@app/article/types/articleResponseInterface';
import slugify from 'slugify';

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(ArticleEntity)
    private readonly articleRepository: Repository<ArticleEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly dataSource: DataSource,
  ) {}

  async findAllArticles(
    currentUserId: number,
    query: any,
  ): Promise<ArticlesResponseInterface> {
    const queryBuilder = this.dataSource
      .getRepository(ArticleEntity)
      .createQueryBuilder('articles')
      .leftJoinAndSelect('articles.author', 'author');

    queryBuilder.orderBy('articles.createdAt', 'DESC');

    const articlesCount = await queryBuilder.getCount();

    if (query.limit) {
      queryBuilder.limit(parseInt(query.limit));
    }

    if (query.offset) {
      queryBuilder.offset(parseInt(query.offset));
    }

    if (query.author) {
      const author = await this.userRepository.findOne({
        where: {
          username: query.author,
        },
      });
      queryBuilder.andWhere('articles.author.id = :authorId', {
        authorId: author.id,
      });
    }

    if (query.tag) {
      queryBuilder.andWhere('articles.tagList LIKE :tag', {
        tag: `%${query.tag}%`,
      });
    }

    const articles = await queryBuilder.getMany();

    return { articles, articlesCount };
  }

  async createArticle(
    currentUser: UserEntity,
    createArticleDto: CreateArticleDto,
  ): Promise<ArticleEntity> {
    const article = new ArticleEntity();

    Object.assign(article, createArticleDto);

    if (!article.tagList) {
      article.tagList = [];
    }

    article.slug = this.getSlug(createArticleDto.title);

    article.author = currentUser;

    return await this.articleRepository.save(article);
  }

  async updateArticle(
    currentUserId: number,
    slug: string,
    updateArticleDto: CreateArticleDto,
  ): Promise<ArticleEntity> {
    const article = await this.findBySlug(slug);
    if (!article) {
      throw new HttpException('Article does not exist', HttpStatus.NOT_FOUND);
    }

    if (article.author.id !== currentUserId) {
      throw new HttpException('You are not an author', HttpStatus.FORBIDDEN);
    }

    Object.assign(article, updateArticleDto);

    return await this.articleRepository.save(article);
  }

  async findBySlug(slug: string): Promise<ArticleEntity> {
    return await this.articleRepository.findOne({
      where: {
        slug,
      },
    });
  }

  async deleteArticle(
    currentUserId: number,
    slug: string,
  ): Promise<DeleteResult> {
    const article = await this.findBySlug(slug);

    if (!article) {
      throw new HttpException('Article does not exist', HttpStatus.NOT_FOUND);
    }

    if (article.author.id !== currentUserId) {
      throw new HttpException('You are not an author', HttpStatus.FORBIDDEN);
    }

    return await this.articleRepository.delete({ slug });
  }

  async addArticleToFavorites(
    slug: string,
    currentUserId: number,
  ): Promise<ArticleEntity> {
    const article = await this.findBySlug(slug);
    const user = await this.userRepository.findOne({
      where: { id: currentUserId },
      relations: ['favorites'],
    });

    const isFavorite = user.favorites.some(
      (articleInFavorites) => articleInFavorites.id === article.id,
    );

    console.log(article);

    if (!isFavorite) {
      user.favorites.push(article);
      article.favoritesCount++;

      await this.userRepository.save(user);
      await this.articleRepository.save(article);
    }

    return article;
  }

  buildArticleResponse(article: ArticleEntity): ArticleResponseInterface {
    return {
      article,
    };
  }

  private getSlug(title: string): string {
    return `${slugify(title, {
      lower: true,
    })}-${((Math.random() * Math.pow(36, 6)) | 0).toString(36)}`;
  }
}
