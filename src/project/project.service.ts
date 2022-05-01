import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Project, Role, User, UsersOnProjects } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

@Injectable()
export class ProjectService {
  constructor(private prisma: PrismaService) {}

  /**
   * Create a new project
   * @param req Request Data
   * @param dto CreateProjectDto
   * @returns project
   */
  async create(req: any, dto: CreateProjectDto): Promise<Project> {
    // Create project
    const project = await this.prisma.project.create({
      data: {
        ...dto,
      },
    });

    // Add user as creator
    const projectUser = await this.prisma.usersOnProjects.create({
      data: {
        userId: req.userId,
        projectId: project.id,
      },
    });

    return project;
  }

  /**
   * Update a project
   * @param req Request Data
   * @param projectId Project-ID
   * @param dto UpdateProjectDto
   * @returns project
   */
  async update(req: any, projectId: number, dto: UpdateProjectDto): Promise<Project> {
    if (this.canEditProject(req.userId, projectId)) {
      const project = await this.prisma.project.update({
        data: {
          ...dto,
        },
        where: {
          id: projectId,
        },
      });

      return project;
    }

    throw new UnauthorizedException();
  }

  /**
   * Delete a prpject
   * @param req Request Data
   * @param projectId Project-ID
   */
  async delete(req: any, projectId: number): Promise<void> {
    if (this.canEditProject(req.userId, projectId)) {
      await this.prisma.project.delete({
        where: {
          id: projectId,
        },
      });
    }

    throw new UnauthorizedException();
  }

  /**
   * TODO
   * Returns a list of project witch the user can see
   * @param req Request Data
   * @returns list of projects
   */
  async getProjectsOfUser(req: any): Promise<Project[]> {
    const projects = await this.prisma.project.findMany({
      where: {
        users: {
          every: {
            userId: req.userId,
          },
        },
      },
    });

    return projects;
  }

  /**
   * TODO
   * Returns list of user witch are assigned to the project
   * @param req Request Data
   * @param projectId Project-ID
   * @param option Restricts users by role
   * @returns list of UsersOnProjects
   */
  async getProjectUsers(
    req: any,
    projectId: number,
    option: 'all' | 'participants' | 'scientists',
  ): Promise<UsersOnProjects[]> {
    return [];
  }

  /**
   * TODO
   * Returns a list of user witch are not assigned to the project
   * @param req Request Data
   * @param projectId Project-ID
   * @returns list of users
   */
  async getUserNotInProject(req: any, projectId: number): Promise<User[]> {
    return [];
  }

  /**
   * TODO
   * Add users to a Project
   * @param req Request Data
   * @param projectId Project-ID
   * @param userIds User-IDs witch are should add to the project
   * @returns new created UsersOnProjects
   */
  async addUserToProject(req: any, projectId: number, userIds: number[]): Promise<UsersOnProjects[]> {
    return [];
  }

  /**
   * Checks whether a user can edit a project
   * @param userId User-ID
   * @param projectId Project-ID
   * @returns return `true` if user can edit the project
   */
  private async canEditProject(userId: number, projectId: number): Promise<boolean> {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (user) {
      if (user.role === Role.ADMIN) {
        // Admin can alwaly edit a project
        return true;
      } else if (user.role === Role.SCIENTIST) {
        // Scientist must be part of the project
        const projectUser = await this.prisma.usersOnProjects.findUnique({
          where: {
            userId,
            projectId,
          },
        });

        if (projectUser) {
          return true;
        }
      }
    }

    return false;
  }
}
