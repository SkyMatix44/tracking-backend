import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { Role } from '@prisma/client';
import { Roles } from '../auth/decorator/roles.decorator';
import { CreateActivityTypeDto } from './dto/index';
import { ActivityTypeService } from './activityType.service';
import { Controller, Delete, Get, Param, ParseIntPipe, Patch, UseGuards } from '@nestjs/common';
import { Body, Post } from '@nestjs/common';
import { RolesGuard } from 'src/auth/guard/roles.guard';

@Controller('activity-type')
export class ActivityTypeController {
  constructor(private activityTypeService: ActivityTypeService) {}

  @Roles(Role.SCIENTIST, Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post()
  createActivityType(@Body() dto: CreateActivityTypeDto) {
    return this.activityTypeService.create(dto);
  }

  @Roles(Role.SCIENTIST, Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Patch()
  updateActivityType(@Param('id', ParseIntPipe) activityTypeId: number, @Body() dto: CreateActivityTypeDto) {
    return this.activityTypeService.update(activityTypeId, dto);
  }

  @Roles(Role.SCIENTIST, Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete(':id')
  deleteActivityType(@Param('id', ParseIntPipe) activityTypeId: number) {
    return this.activityTypeService.delete(activityTypeId);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  getAcitivityType(@Param('id', ParseIntPipe) activityTypeId: number) {
    return this.activityTypeService.get(activityTypeId);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  getAllActivityType() {
    return this.activityTypeService.getAll();
  }
}
