import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  Unique,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Label } from '@server/labels/entities/label.entity';
// eslint-disable-next-line import/no-cycle
import { Task } from './task.entity';

@Entity('tasks_labels')
@Unique(['taskId', 'labelId'])
export class TaskLabel {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  taskId!: number;

  @Column()
  labelId!: number;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @ManyToOne(() => Task, (task) => task.taskLabels, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'task_id' })
  task?: Task;

  @ManyToOne(() => Label, (label) => label.taskLabels, {
    nullable: false,
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'label_id' })
  label?: Label;
}
