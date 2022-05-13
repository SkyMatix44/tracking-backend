import { Body, Controller, Delete, Param, ParseIntPipe, Post, Put, Request, UseGuards } from '@nestjs/common';
import { Project, Role } from '@prisma/client';
import { Roles } from '../auth/decorator';
import { RolesGuard } from '../auth/guard/roles.guard';
import { TrackingRequest } from '../auth/middleware/auth.middleware';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { ProjectService } from './project.service';

@Controller('project')
export class ProjectController {
  constructor(private projectService: ProjectService) {}

  @Roles(Role.ADMIN, Role.SCIENTIST)
  @UseGuards(RolesGuard)
  @Post()
  createProject(@Request() req: TrackingRequest, @Body() dto: CreateProjectDto): Promise<Project> {
    return this.projectService.create(req, dto);
  }

  @UseGuards(RolesGuard)
  @Put(':id')
  updateProject(
    @Request() req: TrackingRequest,
    @Param('id', ParseIntPipe) projectId: number,
    @Body() dto: UpdateProjectDto,
  ): Promise<Project> {
    return this.projectService.update(req, projectId, dto);
  }

  @UseGuards(RolesGuard)
  @Delete(':id')
  deleteProject(@Request() req: TrackingRequest, @Param('id', ParseIntPipe) projectId: number): Promise<void> {
    return this.projectService.delete(req, projectId);
  }
}
