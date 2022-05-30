import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Project, Role, User } from '@prisma/client';
import { TrackingRequest } from '../auth/middleware/auth.middleware';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

@Injectable()
export class ProjectService {
  constructor(private readonly prisma: PrismaService) {}
  // private readonly classTransfromerService: ClassTrans

  /**
   * Create a new project
   * @param req Request Data
   * @param dto CreateProjectDto
   * @returns project
   */
  async create(req: TrackingRequest, dto: CreateProjectDto): Promise<Project> {
    // Create project
    const project = await this.prisma.project.create({
      data: {
        ...dto,
      },
    });

    // Add user as creator
    if (req.userRole === Role.SCIENTIST) {
      const projectUser = await this.prisma.usersOnProjects.create({
        data: {
          userId: req.userId,
          projectId: project.id,
        },
      });
    }

    return project;
  }

  /**
   * Update a project
   * @param req Request Data
   * @param projectId Project-ID
   * @param dto UpdateProjectDto
   * @returns project
   */
  async update(req: TrackingRequest, projectId: number, dto: UpdateProjectDto): Promise<Project> {
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
  async delete(req: TrackingRequest, projectId: number): Promise<void> {
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
   * Returns a list of all project
   * @param req Request Data
   * @returns list of projects
   */
  async getAllProjects(req: TrackingRequest): Promise<Project[]> {
    return this.prisma.project.findMany();
  }

  /**
   * Returns a list of project where the user is assigned
   * @param req Request Data
   * @returns list of projects
   */
  async getProjectsOfUser(req: TrackingRequest): Promise<Project[]> {
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
   * TODO ReturnUserDto
   * Returns list of user witch are assigned to the project
   * @param req Request Data
   * @param projectId Project-ID
   * @param option Restricts users by role
   * @returns list of UsersOnProjects
   */
  async getProjectUsers(
    req: TrackingRequest,
    projectId: number,
    option: 'all' | 'participants' | 'scientists',
  ): Promise<User[]> {
    let params;

    switch (option) {
      case 'all':
        params = {
          where: {
            projects: {
              every: {
                projectId: projectId,
              },
            },
          },
        };
        break;
      case 'participants':
        params = {
          where: {
            role: Role.USER,
            projects: {
              every: {
                projectId: projectId,
              },
            },
          },
        };
        break;
      case 'scientists':
        params = {
          where: {
            role: Role.SCIENTIST,
            projects: {
              every: {
                projectId: projectId,
              },
            },
          },
        };
        break;
      default:
        throw new Error('Invalid parameter');
    }

    return this.prisma.user.findMany(params);
  }

  /**
   * TODO
   * Returns a list of user witch are not assigned to the project
   * @param req Request Data
   * @param projectId Project-ID
   * @returns list of users
   */
  async getUserNotInProject(req: TrackingRequest, projectId: number): Promise<User[]> {
    return [];
  }

  /**
   * Add users to a Project
   * @param req Request Data
   * @param projectId Project-ID
   * @param userIds User-IDs witch are should add to the project
   * @returns new created UsersOnProjects
   */
  async addUserToProject(req: TrackingRequest, projectId: number, userIds: number[]): Promise<User[]> {
    if (this.canEditProject(req.userId, projectId)) {
      const data: { projectId: number; userId: number }[] = userIds.map((userId) => {
        return { userId, projectId };
      });
      const projectUser = await this.prisma.usersOnProjects.createMany({
        data: data,
        skipDuplicates: true,
      });

      return this.prisma.user.findMany({ where: { id: { in: userIds } } });
    }

    throw new UnauthorizedException();
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
