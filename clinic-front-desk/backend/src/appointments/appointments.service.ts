// clinic-front-desk/backend/src/appointments/appointments.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Appointment } from './entities/appointment.entity';
import { DoctorsService } from '../doctors/doctors.service';
import { PatientsService } from '../patients/patients.service';

@Injectable()
export class AppointmentsService {
  constructor(
    @InjectRepository(Appointment)
    private appointmentsRepository: Repository<Appointment>,
    private doctorsService: DoctorsService,
    private patientsService: PatientsService,
  ) {}

  async create(appointmentData: Partial<Appointment>) {
    const doctor = await this.doctorsService.findOne(appointmentData.doctorId);
    const patient = await this.patientsService.findOne(appointmentData.patientId);
    if (!doctor || !patient) throw new Error('Doctor or Patient not found');
    const appointment = this.appointmentsRepository.create({
      ...appointmentData,
      doctor,
      patient,
    });
    return this.appointmentsRepository.save(appointment);
  }

  findAll() {
    return this.appointmentsRepository.find({ relations: ['doctor', 'patient'] });
  }

  findOne(id: number) {
    return this.appointmentsRepository.findOne({ where: { id }, relations: ['doctor', 'patient'] });
  }

  async update(id: number, updateData: Partial<Appointment>) {
    const appointment = await this.findOne(id);
    if (updateData.doctorId) {
      const doctor = await this.doctorsService.findOne(updateData.doctorId);
      if (!doctor) throw new Error('Doctor not found');
      appointment.doctor = doctor;
    }
    if (updateData.patientId) {
      const patient = await this.patientsService.findOne(updateData.patientId);
      if (!patient) throw new Error('Patient not found');
      appointment.patient = patient;
    }
    Object.assign(appointment, updateData);
    return this.appointmentsRepository.save(appointment);
  }

  remove(id: number) {
    return this.appointmentsRepository.delete(id);
  }
}