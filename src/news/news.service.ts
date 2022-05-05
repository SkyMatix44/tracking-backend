import { Injectable } from '@nestjs/common';
import { CreateNewsDto, UpdateNewsDto } from './dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class NewsService {
  constructor(private prisma: PrismaService) {}

  /**
   * Create a new news-Entry
   *
   * @param dto
   * @returns news News
   */
  async create(dto: CreateNewsDto) {
    const news = await this.prisma.news.create({
      data: {
        ...dto,
      },
    });
    return news;
  }

  /**
   * Update a Acitivity-Entry
   *
   * @param newsId
   * @param dto
   * @returns news News
   */
  async update(newsId: number, dto: UpdateNewsDto) {
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
   * @param acitivityId
   */
  async delete(acitivityId: number) {
    await this.prisma.news.delete({
      where: {
        id: acitivityId,
      },
    });
  }

  /**
   * Get news by Id
   *
   * @param newsId
   */
  async get(newsId: number) {
    return this.prisma.news.findFirst({
      where: {
        id: newsId,
      },
    });
  }

  /**
   * Get All News
   *
   * @returns PrismaPromise<...>
   */
  async getAll() {
    return this.prisma.news.findMany();
  }
}
