import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { Task } from './entities/task.entity';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TaskFilterDto } from './dto/task-filter.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { User } from '../common/decorators/user.decorator';
import { UserEntity } from '../users/entities/user.entity';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

@Controller('tasks')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth() // Add this decorator to indicate that authentication is required
@ApiTags('tasks') // Add a tag for your controller
export class TasksController {
  constructor(private readonly taskService: TasksService) {}

  @ApiOperation({ summary: 'Create a task' })
  @Post()
  create(@Body() createTaskDto: CreateTaskDto): Promise<Task> {
    return this.taskService.create(createTaskDto);
  }

  @ApiOperation({ summary: 'Get all tasks' })
  @Get()
  findAll(
    @User() user: UserEntity,
    @Query() filterDto?: TaskFilterDto,
  ): Promise<Task[]> {
    return this.taskService.findAll(user, filterDto);
  }

  @ApiOperation({ summary: 'Get a task by ID' })
  @Get(':id')
  findOne(
    @Param('id', ParseIntPipe) id: number,
    @User() user: UserEntity,
  ): Promise<Task> {
    return this.taskService.findOne(id, user);
  }

  @ApiOperation({ summary: 'Update a task' })
  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTaskDto: UpdateTaskDto,
    @User() user: UserEntity,
  ): Promise<Task> {
    return this.taskService.update(id, updateTaskDto, user);
  }

  @ApiOperation({ summary: 'Delete a task' })
  @Delete(':id')
  remove(
    @Param('id', ParseIntPipe) id: number,
    @User() user: UserEntity,
  ): Promise<void> {
    return this.taskService.remove(id, user);
  }
}
