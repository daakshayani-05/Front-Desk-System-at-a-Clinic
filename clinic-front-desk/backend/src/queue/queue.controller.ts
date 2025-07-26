// clinic-front-desk/backend/src/queue/queue.controller.ts
import { Controller, Get, Post, Body, Patch, Param, UseGuards } from '@nestjs/common';
import { QueueService } from './queue.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('queue')
@UseGuards(JwtAuthGuard)
export class QueueController {
  constructor(private readonly queueService: QueueService) {}

  @Post()
  addToQueue(@Body() body: { patientId: number }) {
    return this.queueService.addToQueue(body.patientId);
  }

  @Get()
  findAll() {
    return this.queueService.findAll();
  }

  @Patch(':id/status')
  updateStatus(@Param('id') id: string, @Body() body: { status: string }) {
    return this.queueService.updateStatus(+id, body.status);
  }

  @Patch(':id/prioritize')
  prioritize(@Param('id') id: string) {
    return this.queueService.prioritize(+id);
  }
}