import { CreateActivityDto, UpdateActivityDto } from './dto/index';
import { ActivityService } from './activity.service';
import { Body, Controller, Param, Patch, Post, ParseIntPipe, Delete, Get } from '@nestjs/common';

@Controller('activity')
export class ActivityController {
  constructor(private activityService: ActivityService) {}

  @Post()
  createActivity(@Body() dto: CreateActivityDto) {
    return this.activityService.create(dto);
  }

  @Patch(':id')
  updateActivity(@Param('id', ParseIntPipe) activityId: number, @Body() dto: UpdateActivityDto) {
    return this.activityService.update(activityId, dto);
  }

  @Delete(':id')
  deleteActivity(@Param('id', ParseIntPipe) activityId: number) {
    return this.activityService.delete(activityId);
  }

  @Get(':id')
  getActivity(@Param('id', ParseIntPipe) activityId: number) {
    return this.activityService.get(activityId);
  }

  @Get()
  getAllActivity() {
    return this.activityService.getAll();
  }
}
