import { Controller, Delete, Get, Param, ParseIntPipe, Patch } from '@nestjs/common';
import { Body, Post } from '@nestjs/common';
import { CreateUniversityDto } from './dto/index';
import { UniversityService } from './university.service';

@Controller('university')
export class UniversityController {
  constructor(private universityService: UniversityService) {}

  @Post()
  createUniversity(@Body() dto: CreateUniversityDto) {
    return this.universityService.create(dto);
  }

  @Patch(':id')
  UpdateUniversity(@Param('id', ParseIntPipe) universityId: number, @Body() dto: CreateUniversityDto) {
    return this.universityService.update(universityId, dto);
  }

  @Delete(':id')
  DeleteUniversity(@Param('id', ParseIntPipe) universityId: number){
      return this.universityService.delete(universityId);
  }

  @Get(':id')
  GetUniversity(@Param('id', ParseIntPipe) universityId: number){
      return this.universityService.get(universityId);
  }

  @Get()
  GetAllUniversities(){
      return this.universityService.getAll();
  }
}
