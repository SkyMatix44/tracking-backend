import { User } from './../../node_modules/.prisma/client/index.d';
import { Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { CreateUniversityDto, UpdateUniversityDto } from './dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class UniversityService {
  constructor(private prisma: PrismaService) {}

  /**
   * Create a new University-Entry
   *
   * @param dto CreateUniversityDto
   * @returns university University
   */
  async create(dto: CreateUniversityDto) {
    try {
      const university = await this.prisma.university.create({
        data: {
          ...dto,
        },
      });
      return university;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException('University already exists');
        }
      }
    }
  }

  /**
   * Update a University by Id
   *
   * @param dto UpdateUniversityDto
   * @returns university University
   */
  async update(universityId: number, dto: UpdateUniversityDto) {
    const university = await this.prisma.university.update({
      where: {
        id: universityId,
      },
      data: {
        ...dto,
      },
    });
    return university;
  }
}
