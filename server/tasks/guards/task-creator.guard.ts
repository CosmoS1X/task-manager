import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { TasksService } from '@server/tasks/tasks.service';

@Injectable()
export class TaskCreatorGuard implements CanActivate {
  constructor(private readonly tasksService: TasksService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const userIdFromSession = request.session.userId;
    const taskIdFromParams = Number(request.params.id);
    const task = await this.tasksService.findById(taskIdFromParams);

    if (task.creatorId !== userIdFromSession) {
      throw new ForbiddenException('Only a creator of the task can perform this action');
    }

    return true;
  }
}
