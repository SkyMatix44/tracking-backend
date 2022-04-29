import { PrismaService } from 'src/prisma/prisma.service';
import { CreateActivityTypeDto } from './dto';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ActivityTypeService {
  constructor(private prisma: PrismaService) {}

  /**
   * Create a new Activity-Type-Entry
   *
   * @param dto
   * @returns activityType ActivityType
   */
  async create(dto: CreateActivityTypeDto) {
    const activityType = await this.prisma.activityType.create({
      data: {
        ...dto,
      },
    });
    return activityType;
  }

  /**
   * Update a ActivityType by Id
   *
   * @param activityTypeId
   * @param dto
   * @returns acivityType ActivityType
   */
  async update(activityTypeId: number, dto: CreateActivityTypeDto) {
    const activityType = await this.prisma.activityType.update({
      where: {
        id: activityTypeId,
      },
      data: {
        ...dto,
      },
    });
    return activityType;
  }

  /**
   * Delete a ActivityType by Id
   *
   */
  async delete(activityTypeId: number) {
    await this.prisma.activityType.delete({
      where: {
        id: activityTypeId,
      },
    });
  }

  /**
   * Get University by Id
   *
   * @param activityTypeId
   * @returns Prisma.Prisma__ActivityTypeClient<ActivityType>
   */
  async get(activityTypeId: number) {
    return this.prisma.activityType.findFirst({
      where: {
        id: activityTypeId,
      },
    });
  }

  /**
   * Get All Universities
   *
   * @returns PrismaPromise<...>
   */
  async getAll() {
    return this.prisma.activityType.findMany();
  }
}
