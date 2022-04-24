import { RolesGuard } from './../auth/guard/roles.guard';
import { JwtAuthGuard } from './../auth/guard/jwt-auth.guard';
import { Role } from '@prisma/client';
import { Controller, Delete, Get, Param, ParseIntPipe, Patch, UseGuards } from '@nestjs/common';
import { Body, Post } from '@nestjs/common';
import { Roles } from 'src/auth/decorator/roles.decorator';
import { CreateUniversityDto } from './dto/index';
import { UniversityService } from './university.service';

@Controller('university')
export class UniversityController {
  constructor(private universityService: UniversityService) {}

  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post()
  createUniversity(@Body() dto: CreateUniversityDto) {
    return this.universityService.create(dto);
  }

  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Patch(':id')
  UpdateUniversity(@Param('id', ParseIntPipe) universityId: number, @Body() dto: CreateUniversityDto) {
    return this.universityService.update(universityId, dto);
  }

  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete(':id')
  DeleteUniversity(@Param('id', ParseIntPipe) universityId: number){
      return this.universityService.delete(universityId);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  GetUniversity(@Param('id', ParseIntPipe) universityId: number){
      return this.universityService.get(universityId);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  GetAllUniversities(){
      return this.universityService.getAll();
  }
}
