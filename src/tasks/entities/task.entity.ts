import { ApiProperty } from '@nestjs/swagger'; // Import Swagger decorator
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UserEntity } from '../../users/entities/user.entity';

export enum TaskStatus {
  PENDING = 'Pending',
  COMPLETED = 'Completed',
}

@Entity('tasks')
export class Task {
  @ApiProperty({ description: 'The ID of the task' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'The title of the task' })
  @Column()
  title: string;

  @ApiProperty({
    description: 'The status of the task',
    enum: ['Pending', 'Completed'],
  })
  @Column({ type: 'enum', enum: TaskStatus, default: TaskStatus.PENDING })
  status: TaskStatus;

  @ApiProperty({ description: 'The user who owns the task' })
  @ManyToOne(() => UserEntity, (user) => user.tasks)
  user: UserEntity;

  @ApiProperty({ description: 'The userId who owns the task' })
  @Column()
  userId: number;
}
