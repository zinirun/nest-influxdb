import { Module } from '@nestjs/common';
import { InfluxModule } from 'src/providers/influx/influx.module';
import { ScanResolver } from './scan.resolver';
import { ScanService } from './scan.service';

@Module({
    imports: [InfluxModule],
    providers: [ScanResolver, ScanService],
})
export class ScanModule {}
