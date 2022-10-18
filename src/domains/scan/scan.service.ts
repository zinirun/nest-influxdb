import { Point } from '@influxdata/influxdb-client';
import { ConflictException, Injectable } from '@nestjs/common';
import { InfluxRepository } from 'src/providers/influx/influx.repository';
import { DeviceData, SaveDeviceDataInput, SaveDeviceDataResult } from './dto';
import { RawResult } from './interfaces';
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

    async findBySerial(serial: string): Promise<DeviceData> {
        const query = `from(bucket: "test")
        |> range(start: 0)
        |> filter(fn: (r) => r["_measurement"] == "measurement1")
        |> filter(fn: (r) => r["_field"] == "value")
        |> filter(fn: (r) => r["serial"] == "${serial}")
        `;

        try {
            const rows = await this.influx.rows<RawResult>(query);
            return toDeviceData(serial, rows);
        } catch (err) {
            throw new ConflictException(err);
        }
    }
}
