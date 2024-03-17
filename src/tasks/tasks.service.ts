import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, MoreThan, Repository } from 'typeorm';
import { Task } from './entities/task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TaskFilterDto } from './dto/task-filter.dto';
import { UserEntity } from '../users/entities/user.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
  ) {}

  async create(createTaskDto: CreateTaskDto): Promise<Task> {
    const task = this.taskRepository.create(createTaskDto);
    return this.taskRepository.save(task);
  }

  async findAll(user: UserEntity, filterDto?: TaskFilterDto): Promise<Task[]> {
    const { cursor, limit = 10, status, userId } = filterDto;

    const query: any = {};

    if (status) {
      query.status = status;
    }

    if (user.isAdmin === true) {
      if (userId) {
        query.userId = userId;
      }
    } else {
      query.userId = user.id;
    }

    // Construct the find options
    const findOptions: FindManyOptions<Task> = {
      where: {
        ...query,
        id: cursor ? MoreThan(cursor) : undefined, // Use MoreThan for cursor-based pagination
      },
      take: limit,
      relations: ['user'],
    };

    // Fetch tasks based on the find options
    return this.taskRepository.find(findOptions);
  }

  async findOne(id: number, user: UserEntity): Promise<Task> {
    const task = await this.taskRepository.findOneBy({ id });
    if (!user.isAdmin) {
      if (task && task.userId !== user.id) {
        throw new UnauthorizedException(
          'You are not authorized to view tasks of other users',
        );
      }
    }

    return task;
  }

  async update(
    id: number,
    updateTaskDto: UpdateTaskDto,
    user: UserEntity,
  ): Promise<Task> {
    const task = await this.taskRepository.findOneBy({ id });
    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
    if (!user.isAdmin) {
      if (task.userId !== user.id) {
        throw new UnauthorizedException(
          'You are not authorized to update tasks of other users',
        );
      }
    }
    task.title = updateTaskDto.title;
    task.status = updateTaskDto.status;
    return this.taskRepository.save(task);
  }

  async remove(id: number, user: UserEntity): Promise<void> {
    const task = await this.taskRepository.findOneBy({ id });
    if (!user.isAdmin) {
      if (task && task.userId !== user.id) {
        throw new UnauthorizedException(
          'You are not authorized to delete tasks of other users',
        );
      }
    }
    await this.taskRepository.delete(id);
  }
}
