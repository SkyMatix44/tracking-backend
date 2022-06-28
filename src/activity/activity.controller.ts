import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Request, UseGuards } from '@nestjs/common';
import { Activity, Role } from '@prisma/client';
import { Roles } from '../auth/decorator';
import { RolesGuard } from '../auth/guard/roles.guard';
import { TrackingRequest } from '../auth/middleware/auth.middleware';
import { ActivityService } from './activity.service';
import { CreateActivityDto, UpdateActivityDto } from './dto/index';

@Controller('activity')
export class ActivityController {
  constructor(private activityService: ActivityService) {}

  @Roles(Role.USER)
  @UseGuards(RolesGuard)
  @Post()
  createActivity(@Request() req: TrackingRequest, @Body() dto: CreateActivityDto): Promise<Activity> {
    return this.activityService.create(req, dto);
  }

  @Patch(':id')
  updateActivity(
    @Request() req: TrackingRequest,
    @Param('id', ParseIntPipe) activityId: number,
    @Body() dto: UpdateActivityDto,
  ): Promise<Activity> {
    return this.activityService.update(req, activityId, dto);
  }

  @Delete(':id')
  deleteActivity(@Request() req: TrackingRequest, @Param('id', ParseIntPipe) activityId: number): Promise<void> {
    return this.activityService.delete(req, activityId);
  }

  @Get(':id')
  getActivity(@Request() req: TrackingRequest, @Param('id', ParseIntPipe) activityId: number): Promise<Activity> {
    return this.activityService.get(req, activityId);
  }

  @Get('project/:id')
  getProjectActivities(
    @Request() req: TrackingRequest,
    @Param('id', ParseIntPipe) projectId: number,
  ): Promise<Activity[]> {
    return this.activityService.getProjectActivities(req, projectId);
  }

  @Get('project/:projectid/user/:userid')
  getProjectUserActivities(
    @Request() req: TrackingRequest,
    @Param('projectid', ParseIntPipe) projectId: number,
    @Param('userid', ParseIntPipe) userId: number,
  ): Promise<Activity[]> {
    return this.activityService.getProjectUserActivities(req, projectId, userId);
  }
}
