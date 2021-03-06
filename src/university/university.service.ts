import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUniversityDto, UpdateUniversityDto } from './dto';
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
    const university = await this.prisma.university.create({
      data: {
        ...dto,
      },
    });
    return university;
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

  /**
   * Delete a University by Id
   *
   */
  async delete(universityId: number) {
    await this.prisma.university.delete({
      where: {
        id: universityId,
      },
    });
  }

  /**
   * Get University by Id
   *
   * @param universityId
   * @returns Prisma.Prisma__UniversityClient<University>
   */
  async get(universityId: number) {
    return this.prisma.university.findFirst({
      where: {
        id: universityId,
      },
    });
  }

  /**
   * Get All Universities
   *
   * @returns PrismaPromise<...>
   */
  async getAll() {
    return this.prisma.university.findMany();
  }
}
