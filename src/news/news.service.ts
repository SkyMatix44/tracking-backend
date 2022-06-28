import { Injectable, UnauthorizedException } from '@nestjs/common';
import { News, Role, UsersOnProjects } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { TrackingRequest } from '../auth/middleware/auth.middleware';
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
  async create(req: TrackingRequest, dto: CreateNewsDto): Promise<News> {
    if (await this.canEditNews(req.userId, dto.projectId, req.userRole)) {
      const news: News = await this.prisma.news.create({
        data: {
          ...dto,
          userId: req.userId,
        },
      });
      return news;
    }

    throw new UnauthorizedException();
  }

  /**
   * Update a News-Entry
   *
   * @param newsId
   * @param dto
   * @returns news News
   */
  async update(req: TrackingRequest, newsId: number, dto: UpdateNewsDto): Promise<News> {
    const news: News = await this.prisma.news.findUnique({ where: { id: newsId }, rejectOnNotFound: true });

    if (await this.canEditNews(req.userId, news.projectId, req.userRole)) {
      return this.prisma.news.update({
        where: {
          id: newsId,
        },
        data: {
          ...dto,
        },
      });
    }

    throw new UnauthorizedException();
  }

  /**
   * Delets a news-Entry
   *
   * @param newsId
   */
  async delete(req: TrackingRequest, newsId: number): Promise<void> {
    const news: News = await this.prisma.news.findUnique({ where: { id: newsId }, rejectOnNotFound: true });

    if (await this.canEditNews(req.userId, news.projectId, req.userRole)) {
      await this.prisma.news.delete({
        where: {
          id: newsId,
        },
      });
    }

    throw new UnauthorizedException();
  }

  /**
   * Get news by Id
   *
   * @param newsId
   */
  async get(req: TrackingRequest, newsId: number): Promise<News> {
    const news: News = await this.prisma.news.findUnique({
      where: {
        id: newsId,
      },
    });

    if (await this.canSeeNews(req.userId, news.projectId, req.userRole)) {
      return news;
    }

    throw new UnauthorizedException();
  }

  /**
   * Get All News of a project
   */
  async getProjectNews(req: TrackingRequest, projectId: number): Promise<News[]> {
    if (await this.canSeeNews(req.userId, projectId, req.userRole)) {
      return this.prisma.news.findMany({
        where: {
          projectId,
        },
      });
    }

    throw new UnauthorizedException();
  }

  private async canEditNews(userId: number, projectId: number, role: Role): Promise<boolean> {
    if (role === Role.ADMIN) {
      return true;
    }

    const projectUser: UsersOnProjects = await this.prisma.usersOnProjects.findFirst({
      where: { AND: [{ userId: userId }, { projectId: projectId }] },
      rejectOnNotFound: false,
    });

    if (role === Role.SCIENTIST && projectUser != null) {
      return true;
    }

    return false;
  }

  private async canSeeNews(userId: number, projectId: number, role: Role): Promise<boolean> {
    if (role === Role.ADMIN) {
      return true;
    }

    const projectUser: UsersOnProjects = await this.prisma.usersOnProjects.findFirst({
      where: { AND: [{ userId: userId }, { projectId: projectId }] },
      rejectOnNotFound: false,
    });

    if (projectUser != null) {
      return true;
    }

    return false;
  }
}
