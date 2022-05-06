import { User } from '@prisma/client';
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
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
  async create(dto: CreateActivityDto) {
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

  /**
   * Update a Acitivity-Entry
   *
   * @param activityId
   * @param dto
   * @returns activity Activity
   */
  async update(activityId: number, dto: UpdateActivityDto) {
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

  /**
   * Delets a Activity-Entry
   *
   * @param acitivityId
   */
  async delete(acitivityId: number) {
    await this.prisma.activity.delete({
      where: {
        id: acitivityId,
      },
    });
  }

  /**
   * Get Activity by Id
   *
   * @param activityId
   */
  async get(activityId: number) {
    return this.prisma.activity.findFirst({
      where: {
        id: activityId,
      },
    });
  }

  /**
   * Get All Activities
   *
   * @returns PrismaPromise<...>
   */
  async getAll() {
    return this.prisma.activity.findMany();
  }
}
