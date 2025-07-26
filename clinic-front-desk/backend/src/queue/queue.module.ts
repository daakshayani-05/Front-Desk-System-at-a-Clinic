// clinic-front-desk/backend/src/queue/queue.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Queue } from './entities/queue.entity';
import { QueueService } from './queue.service';
import { QueueController } from './queue.controller';
import { PatientsModule } from '../patients/patients.module';

@Module({
  imports: [TypeOrmModule.forFeature([Queue]), PatientsModule],
  controllers: [QueueController],
  providers: [QueueService],
})
export class QueueModule {}