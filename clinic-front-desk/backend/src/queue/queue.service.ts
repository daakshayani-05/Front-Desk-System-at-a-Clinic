// clinic-front-desk/backend/src/queue/queue.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Queue } from './entities/queue.entity';
import { PatientsService } from '../patients/patients.service';

@Injectable()
export class QueueService {
  constructor(
    @InjectRepository(Queue)
    private queueRepository: Repository<Queue>,
    private patientsService: PatientsService,
  ) {}

  async addToQueue(patientId: number) {
    const patient = await this.patientsService.findOne(patientId);
    if (!patient) throw new Error('Patient not found');
    const lastQueue = await this.queueRepository.findOne({ order: { queueNumber: 'DESC' } });
    const queueNumber = lastQueue ? lastQueue.queueNumber + 1 : 1;
    const queueEntry = this.queueRepository.create({
      patient,
      queueNumber,
      status: 'waiting',
    });
    return this.queueRepository.save(queueEntry);
  }

  findAll() {
    return this.queueRepository.find({ relations: ['patient'] });
  }

  async updateStatus(id: number, status: string) {
    const queueEntry = await this.queueRepository.findOne({ where: { id } });
    if (!queueEntry) throw new Error('Queue entry not found');
    queueEntry.status = status;
    return this.queueRepository.save(queueEntry);
  }

  async prioritize(id: number) {
    const queueEntry = await this.queueRepository.findOne({ where: { id } });
    if (!queueEntry) throw new Error('Queue entry not found');
    const minQueueNumber = await this.queueRepository
      .createQueryBuilder('queue')
      .select('MIN(queue.queueNumber)', 'minQueueNumber')
      .getRawOne();
    queueEntry.queueNumber = minQueueNumber.minQueueNumber - 1;
    return this.queueRepository.save(queueEntry);
  }
}