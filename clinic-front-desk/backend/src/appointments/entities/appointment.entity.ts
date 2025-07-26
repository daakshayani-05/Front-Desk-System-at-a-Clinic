// clinic-front-desk/backend/src/appointments/entities/appointment.entity.ts
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Doctor } from '../../doctors/entities/doctor.entity';
import { Patient } from '../../patients/entities/patient.entity';

@Entity()
export class Appointment {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Doctor, { eager: true })
  doctor: Doctor;

  @ManyToOne(() => Patient, { eager: true })
  patient: Patient;

  @Column()
  doctorId: number;

  @Column()
  patientId: number;

  @Column()
  dateTime: Date;

  @Column({ default: 'booked' })
  status: string; // booked, completed, canceled
}