import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { Role } from '@prisma/client';
import { Roles } from 'src/auth/decorator/roles.decorator';
import { RolesGuard } from './../auth/guard/roles.guard';
import { CreateUniversityDto } from './dto/index';
import { UniversityService } from './university.service';

@Controller('university')
export class UniversityController {
  constructor(private universityService: UniversityService) {}

  @Roles(Role.ADMIN)
  @UseGuards(RolesGuard)
  @Post()
  createUniversity(@Body() dto: CreateUniversityDto) {
    return this.universityService.create(dto);
  }

  @Roles(Role.ADMIN)
  @UseGuards(RolesGuard)
  @Patch(':id')
  UpdateUniversity(@Param('id', ParseIntPipe) universityId: number, @Body() dto: CreateUniversityDto) {
    return this.universityService.update(universityId, dto);
  }

  @Roles(Role.ADMIN)
  @UseGuards(RolesGuard)
  @Delete(':id')
  DeleteUniversity(@Param('id', ParseIntPipe) universityId: number) {
    return this.universityService.delete(universityId);
  }

  @Get(':id')
  GetUniversity(@Param('id', ParseIntPipe) universityId: number) {
    return this.universityService.get(universityId);
  }

  @Get()
  GetAllUniversities() {
    return this.universityService.getAll();
  }
}
