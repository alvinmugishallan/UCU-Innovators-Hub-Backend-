import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './User';

@Entity()
export class Project {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  title!: string;

  @Column('text')
  description!: string;

  @Column()
  category!: string;

  @Column('simple-array')
  technologies!: string[];

  @Column({ nullable: true })
  githubLink?: string;

  @Column({ nullable: true })
  documentUrl?: string;

  @Column({ default: 'pending' })
  status!: 'pending' | 'approved' | 'rejected';

  @Column({ nullable: true })
  rejectionReason?: string;

  @Column({ nullable: true })
  faculty?: string;

  @Column({ nullable: true })
  department?: string;

  @Column({ nullable: true })
  year?: number;

  @ManyToOne(() => User)
  @JoinColumn()
  author!: User;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn()
  supervisor?: User;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
