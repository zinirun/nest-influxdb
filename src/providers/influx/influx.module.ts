import { Module } from '@nestjs/common';
import { InfluxRepository } from './influx.repository';

@Module({
    providers: [InfluxRepository],
    exports: [InfluxRepository],
})
export class InfluxModule {}
