import { Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { CreateUniversityDto } from './dto';

@Injectable()
export class UniversityService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateUniversityDto) {
    try {
      const university = await this.prisma.university.create({
        data: {
          name: dto.name,
          address: dto.address,
        },
      });
      return university;
    } catch (error) {
        if (error instanceof PrismaClientKnownRequestError){
            if (error.code  === 'P2002'){
                throw new ForbiddenException('University already exists');
            }
        }
    }
  }
}
