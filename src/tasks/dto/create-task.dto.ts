import { ApiProperty } from '@nestjs/swagger'; // Import Swagger decorator
import { IsIn, IsInt, IsNotEmpty, IsOptional } from 'class-validator';
import { TaskStatus } from '../entities/task.entity';

export class CreateTaskDto {
  @ApiProperty({ description: 'The title of the task' })
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description: 'The status of the task',
    enum: [TaskStatus.PENDING, TaskStatus.COMPLETED],
    required: false,
  })
  @IsOptional()
  @IsIn([TaskStatus.PENDING, TaskStatus.COMPLETED])
  status: TaskStatus;

  @ApiProperty({ description: 'The ID of the user who owns the task' })
  @IsInt()
  @IsNotEmpty()
  userId: number;
}
