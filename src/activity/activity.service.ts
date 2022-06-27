import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Activity, Role, UsersOnProjects } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { TrackingRequest } from '../auth/middleware/auth.middleware';
import { CreateActivityDto, UpdateActivityDto } from './dto';

@Injectable()
export class ActivityService {
  constructor(private prisma: PrismaService) {}

  /**
   * Create a new Activity-Entry
   *
   * @param dto
   * @returns activity Activity
   */
  async create(req: TrackingRequest, dto: CreateActivityDto): Promise<Activity> {
    const projectUser: UsersOnProjects = await this.prisma.usersOnProjects.findUnique({
      where: { userId: req.userId, projectId: dto.projectId },
      rejectOnNotFound: true,
    });

    if (projectUser != null) {
      const activity = await this.prisma.activity.create({
        data: {
          ...dto,
        },
        include: {
          user: true,
          activityType: true,
          project: true,
        },
      });
      return activity;
    }

    throw new UnauthorizedException();
  }

  /**
   * Update a Acitivity-Entry
   *
   * @param activityId
   * @param dto
   * @returns activity Activity
   */
  async update(req: TrackingRequest, activityId: number, dto: UpdateActivityDto): Promise<Activity> {
    if (this.canEditActivity(activityId, req.userId, req.userRole)) {
      const activity = await this.prisma.activity.update({
        where: {
          id: activityId,
        },
        data: {
          ...dto,
        },
        include: {
          user: true,
          activityType: true,
          project: true,
        },
      });
      return activity;
    }

    throw new UnauthorizedException();
  }

  /**
   * Delets a Activity-Entry
   *
   * @param acitivityId
   */
  async delete(req: TrackingRequest, activityId: number): Promise<void> {
    if (this.canEditActivity(activityId, req.userId, req.userRole)) {
      await this.prisma.activity.delete({
        where: {
          id: activityId,
        },
      });
    }

    throw new UnauthorizedException();
  }

  /**
   * Get Activity by Id
   *
   * @param activityId
   */
  async get(req: TrackingRequest, activityId: number) {
    const activity: Activity = await this.prisma.activity.findFirst({
      where: {
        id: activityId,
      },
    });

    if (req.userRole === Role.ADMIN || activity.userId === req.userId) {
      return activity;
    }

    const projectUser: UsersOnProjects = await this.prisma.usersOnProjects.findUnique({
      where: { userId: req.userId, projectId: activity.projectId },
      rejectOnNotFound: true,
    });
    if (req.userRole === Role.SCIENTIST && projectUser != null) {
      return activity;
    }

    throw new UnauthorizedException();
  }

  /**
   * Get All Activities of a project
   */
  async getProjectActivities(req: TrackingRequest, projectId: number): Promise<Activity[]> {
    const projectUser: UsersOnProjects = await this.prisma.usersOnProjects.findUnique({
      where: { userId: req.userId, projectId },
      rejectOnNotFound: false,
    });

    if (req.userRole === Role.ADMIN || (req.userRole === Role.SCIENTIST && projectUser != null)) {
      return this.prisma.activity.findMany({ where: { projectId } });
    }

    throw new UnauthorizedException();
  }

  /**
   * Returns if a user can edit an acitivity
   */
  private async canEditActivity(acitivityId: number, userId: number, userRole: Role): Promise<boolean> {
    if (userRole === Role.ADMIN) {
      return true;
    }

    const activity: Activity = await this.prisma.activity.findFirst({ where: { id: acitivityId } });
    if (activity.userId === userId) {
      return true;
    }

    return false;
  }
}
