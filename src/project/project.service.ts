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
    if (await this.canEditProject(req.userId, projectId)) {
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
    if (await this.canEditProject(req.userId, projectId)) {
      await this.prisma.project.delete({
        where: {
          id: projectId,
        },
      });

      return;
    }

    throw new UnauthorizedException();
  }

  /**
   * Returns a list of project witch the user can see
   * @param req Request Data
   * @returns list of projects
   */
  async getProjectsOfUser(req: any): Promise<Project[]> {
    const userOnProjects: UsersOnProjects[] = await this.prisma.usersOnProjects.findMany({
      where: { userId: req.userId },
    });
    const projectIds: number[] = userOnProjects.map((v) => v.projectId);
    const projectsOfUser: Project[] = await this.prisma.project.findMany({ where: { id: { in: projectIds } } });
    return projectsOfUser;
  }

  /**
   * Returns list of user witch are assigned to the project
   * @param req Request Data
   * @param projectId Project-ID
   * @param option Restricts users by role
   * @returns list of UsersOnProjects
   */
  async getProjectUsers(req: any, projectId: number, option: 'all' | 'participants' | 'scientists'): Promise<User[]> {
    if (await this.canEditProject(req.userId, projectId)) {
      const projectUser: UsersOnProjects[] = await this.prisma.usersOnProjects.findMany({
        where: { projectId: projectId },
      });
      const userIds: number[] = projectUser.map((pu) => pu.userId);
      let params: any = { where: { id: { in: userIds } } };

      if (option === 'participants' || option === 'scientists') {
        params.where = { ...params.where, role: option === 'participants' ? Role.USER : Role.SCIENTIST };
      }

      const users: User[] = await this.prisma.user.findMany(params);

      // TODO User aufbereiten
      return users;
    }

    throw new UnauthorizedException();
  }

  /**
   * Returns a list of user witch are not assigned to the project
   * @param req Request Data
   * @param projectId Project-ID
   * @returns list of users
   */
  async getUserNotInProject(req: any, projectId: number): Promise<User[]> {
    if (await this.canEditProject(req.userId, projectId)) {
      const projectUser: UsersOnProjects[] = await this.prisma.usersOnProjects.findMany({
        where: { projectId: projectId },
      });
      const userIds: number[] = projectUser.map((pu) => pu.userId);

      const usersNotInProject: User[] = await this.prisma.user.findMany({ where: { NOT: { id: { in: userIds } } } });

      // TODO User aufbereiten
      return usersNotInProject;
    }

    throw new UnauthorizedException();
  }

  /**
   * Add users to a Project
   * @param req Request Data
   * @param projectId Project-ID
   * @param userIds User-IDs witch are should add to the project
   * @returns new created UsersOnProjects
   */
  async addUserToProject(req: any, projectId: number, userIds: number[]): Promise<User[]> {
    if (await this.canEditProject(req.userId, projectId)) {
      const data: { userId: number; projectId: number }[] = [];
      for (const userId of userIds) {
        data.push({ userId, projectId });
      }

      await this.prisma.usersOnProjects.createMany({
        data,
        skipDuplicates: true,
      });

      return this.getProjectUsers(req, projectId, 'all');
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
        const projectUser = await this.prisma.usersOnProjects.findFirst({
          where: { AND: [{ userId }, { projectId }] },
        });

        if (projectUser) {
          return true;
        }
      }
    }

    return false;
  }
}
