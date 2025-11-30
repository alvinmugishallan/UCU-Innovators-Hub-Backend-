import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  email!: string;

  @Column()
  password!: string;

  @Column({ nullable: true })
  name?: string;

  @Column({ nullable: true })
  role?: 'student' | 'supervisor' | 'faculty_admin';

  @Column({ nullable: true })
  faculty?: string;

  @Column({ nullable: true })
  department?: string;

  @CreateDateColumn()
  createdAt!: Date;
}
