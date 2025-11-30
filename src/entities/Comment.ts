import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './User';
import { Project } from './Project';

@Entity()
export class Comment {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column('text')
  content!: string;

  @ManyToOne(() => User)
  @JoinColumn()
  author!: User;

  @ManyToOne(() => Project)
  @JoinColumn()
  project!: Project;

  @CreateDateColumn()
  createdAt!: Date;
}
