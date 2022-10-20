import { Point } from '@influxdata/influxdb-client';
import { ConflictException, Injectable } from '@nestjs/common';
import { InfluxRepository } from 'src/providers/influx/influx.repository';
import { DeviceData, SaveDeviceDataInput, SaveDeviceDataResult } from './dto';
import { DeviceDataStats } from './dto/device-data-stats.type';
import { RawResult } from './interfaces';
import { ROWS_BY_SERIAL, STATS_BY_SERIAL } from './queries';
import { toDeviceData } from './utils/mapper.util';

@Injectable()
export class ScanService {
    constructor(private readonly influx: InfluxRepository) {}

    async save(input: SaveDeviceDataInput): Promise<SaveDeviceDataResult> {
        const { serial, value, timestamp, measurement } = input;

        const point = new Point(measurement).tag('serial', serial).floatField('value', value);
        if (timestamp) {
            point.timestamp(timestamp);
        }

        try {
            await this.influx.writePoint(point);
            return {
                serial,
                value,
                time: timestamp || new Date(),
            };
        } catch (err) {
            throw new ConflictException(err);
        }
    }

    async saveMany(inputs: SaveDeviceDataInput[]): Promise<SaveDeviceDataResult[]> {
        const points = inputs.map(({ serial, value, timestamp, measurement }) => {
            const point = new Point(measurement).tag('serial', serial).floatField('value', value);
            if (timestamp) {
                point.timestamp(timestamp);
            }
            return point;
        });

        try {
            await this.influx.writePoints(points);
            return inputs.map(({ serial, value, timestamp }) => ({
                serial,
                value,
                time: timestamp || new Date(),
            }));
        } catch (err) {
            throw new ConflictException(err);
        }
    }

    async queryBySerial(serial: string): Promise<DeviceData> {
        try {
            const rows = await this.influx.rows<RawResult>(ROWS_BY_SERIAL(serial));
            return toDeviceData(serial, rows);
        } catch (err) {
            throw new ConflictException(err);
        }
    }

    async statsBySerial(serial: string): Promise<DeviceDataStats> {
        try {
            const [row] = await this.influx.rows<DeviceDataStats>(STATS_BY_SERIAL(serial));
            return row;
        } catch (err) {
            throw new ConflictException(err);
        }
    }
}
