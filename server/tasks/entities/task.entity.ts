import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  AfterLoad,
} from 'typeorm';
import { Status } from '@server/statuses/entities/status.entity';
import { User } from '@server/users/entities/user.entity';
import { Label } from '@server/labels/entities/label.entity';
// eslint-disable-next-line import/no-cycle
import { TaskLabel } from './task-label.entity';

@Entity('tasks')
export class Task {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column({ type: 'text', nullable: true })
  description!: string | null;

  @Column()
  statusId!: number;

  @Column()
  creatorId!: number;

  @Column({ nullable: true })
  executorId!: number | null;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @ManyToOne(() => Status, (status) => status.tasks, {
    nullable: false,
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'status_id' })
  status?: Status;

  @ManyToOne(() => User, (user) => user.createdTasks, {
    nullable: false,
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'creator_id' })
  creator?: User;

  @ManyToOne(() => User, (user) => user.assignedTasks, {
    nullable: true,
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'executor_id' })
  executor?: User | null;

  @OneToMany(() => TaskLabel, (taskLabel) => taskLabel.task, {
    cascade: true,
  })
  taskLabels?: TaskLabel[];

  labels?: Label[] = [];

  @AfterLoad()
  transformLabels() {
    if (this.taskLabels) {
      this.labels = this.taskLabels
        .map(({ label }) => label)
        .filter((label) => !!label);
    }
  }
}
