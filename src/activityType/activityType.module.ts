import { Module } from '@nestjs/common';
import { ActivityTypeController } from './activityType.controller';
import { ActivityTypeService } from './activityType.service';

@Module({
  providers: [ActivityTypeService],
  controllers: [ActivityTypeController],
})
export class ActivityTypeModule {}
