import { Injectable } from '@nestjs/common';
import { News } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateNewsDto, UpdateNewsDto } from './dto';

@Injectable()
export class NewsService {
  constructor(private prisma: PrismaService) {}

  /**
   * Create a new news-Entry
   *
   * @param dto
   * @returns news News
   */
  async create(dto: CreateNewsDto): Promise<News> {
    const news = await this.prisma.news.create({
      data: {
        ...dto,
      },
    });
    return news;
  }

  /**
   * Update a News-Entry
   *
   * @param newsId
   * @param dto
   * @returns news News
   */
  async update(newsId: number, dto: UpdateNewsDto): Promise<News> {
    const news = await this.prisma.news.update({
      where: {
        id: newsId,
      },
      data: {
        ...dto,
      },
    });
    return news;
  }

  /**
   * Delets a news-Entry
   *
   * @param newsId
   */
  async delete(newsId: number): Promise<void> {
    await this.prisma.news.delete({
      where: {
        id: newsId,
      },
    });
  }

  /**
   * Get news by Id
   *
   * @param newsId
   */
  async get(newsId: number): Promise<News> {
    return this.prisma.news.findFirst({
      where: {
        id: newsId,
      },
    });
  }

  /**
   * Get All News of a project
   */
  async getProjectNews(projectId: number): Promise<News[]> {
    return this.prisma.news.findMany({
      where: {
        projectId,
      },
    });
  }
}
