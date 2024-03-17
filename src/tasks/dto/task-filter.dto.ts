import { ApiProperty } from '@nestjs/swagger'; // Import Swagger decorator
import { IsIn, IsInt, IsOptional, Min } from 'class-validator';
import { TaskStatus } from '../entities/task.entity';

export class TaskFilterDto {
  @ApiProperty({
    description: 'Cursor for pagination',
    required: false,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  cursor?: number;

  @ApiProperty({
    description: 'Maximum number of items to return per page',
    required: false,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  limit?: number;

  @ApiProperty({
    description: 'Filter by task status',
    enum: [TaskStatus.PENDING, TaskStatus.COMPLETED],
    required: false,
  })
  @IsOptional()
  @IsIn([TaskStatus.PENDING, TaskStatus.COMPLETED])
  status?: TaskStatus;

  @ApiProperty({
    description: 'Filter by user ID',
    required: false,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  userId?: number;
}
