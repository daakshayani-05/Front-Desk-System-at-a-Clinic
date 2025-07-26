// clinic-front-desk/backend/src/doctors/doctors.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Doctor } from './entities/doctor.entity';

@Injectable()
export class DoctorsService {
  constructor(
    @InjectRepository(Doctor)
    private doctorsRepository: Repository<Doctor>,
  ) {}

  create(doctorData: Partial<Doctor>) {
    const doctor = this.doctorsRepository.create(doctorData);
    return this.doctorsRepository.save(doctor);
  }

  findAll() {
    return this.doctorsRepository.find();
  }

  findOne(id: number) {
    return this.doctorsRepository.findOne({ where: { id } });
  }

  update(id: number, updateData: Partial<Doctor>) {
    return this.doctorsRepository.update(id, updateData);
  }

  remove(id: number) {
    return this.doctorsRepository.delete(id);
  }
}