import { Test, TestingModule } from '@nestjs/testing';
import { config } from 'dotenv';
import { InfluxModule } from 'src/providers/influx/influx.module';
import { ScanService } from './scan.service';

describe('ScanService', () => {
    let service: ScanService;

    beforeEach(async () => {
        config();
        const module: TestingModule = await Test.createTestingModule({
            imports: [InfluxModule],
            providers: [ScanService],
        }).compile();

        service = module.get<ScanService>(ScanService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('write', () => {
        it('device data', async () => {
            await service.save({
                measurement: 'measurement1',
                serial: '00000001',
                value: +(Math.random() * 10).toFixed(2),
            });
        });
    });

    describe('query', () => {
        it('find by serial', async () => {
            const _serial = '00000001';
            const result = await service.queryBySerial(_serial);

            expect(result.serial).toEqual(_serial);
            expect(result.measurements).toBeDefined();
        });

        it('stats by serial', async () => {
            const _serial = '00000001';
            const result = await service.statsBySerial(_serial);

            expect(result.serial).toEqual(_serial);
            expect(result.count).toBeGreaterThan(0);
            expect(result.mkt).toBeDefined();
            expect(result.avg).toBeDefined();
        });
    });
});
