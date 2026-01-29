import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { TaskLabel } from '@server/tasks/entities/task-label.entity';

@Entity('labels')
export class Label {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  name!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @OneToMany(() => TaskLabel, (taskLabel) => taskLabel.label)
  taskLabels?: TaskLabel[];
}
