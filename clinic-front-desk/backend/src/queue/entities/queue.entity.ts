// clinic-front-desk/backend/src/queue/entities/queue.entity.ts
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Patient } from '../../patients/entities/patient.entity';

@Entity()
export class Queue {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Patient, { eager: true })
  patient: Patient;

  @Column()
  queueNumber: number;

  @Column({ default: 'waiting' })
  status: string; // waiting, with_doctor, completed
}