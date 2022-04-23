import { Controller } from '@nestjs/common';
import { Body, Post } from '@nestjs/common';
import { CreateUniversityDto } from './dto/index';
import { UniversityService } from './university.service';

@Controller('university')
export class UniversityController {
  constructor(private universityService: UniversityService) {}

  @Post()
  create(@Body() dto: CreateUniversityDto) {
    return this.universityService.create(dto);
  }
}
