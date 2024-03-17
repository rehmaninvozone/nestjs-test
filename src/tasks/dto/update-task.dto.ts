import { ApiProperty } from '@nestjs/swagger';
import { TaskStatus } from '../entities/task.entity';
import { IsIn, IsInt, IsNotEmpty, IsOptional } from 'class-validator';

export class UpdateTaskDto {
  @ApiProperty({
    description: 'The title of the task',
    required: false,
  })
  @IsOptional()
  @IsNotEmpty()
  title?: string;

  @ApiProperty({
    description: 'The status of the task',
    enum: ['Pending', 'Completed'],
    required: false,
  })
  @IsOptional()
  @IsIn([TaskStatus.PENDING, TaskStatus.COMPLETED])
  status?: TaskStatus;

  @ApiProperty({
    description: 'The ID of the user who owns the task',
    required: false,
  })
  @IsOptional()
  @IsInt()
  @IsNotEmpty()
  userId?: number;
}
