import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Index,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Task } from '@server/tasks/entities/task.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  firstName!: string;

  @Column()
  lastName!: string;

  @Column()
  @Index('IDX_USER_EMAIL', { unique: true })
  email!: string;

  @Column()
  passwordDigest!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @OneToMany(() => Task, (task) => task.creator)
  createdTasks?: Task[];

  @OneToMany(() => Task, (task) => task.executor)
  assignedTasks?: Task[];

  get fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }
}
