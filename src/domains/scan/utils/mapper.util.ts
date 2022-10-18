import { DeviceData } from '../dto/device-data.type';
import { RawResult } from '../interfaces/raw-result.interface';

export const toDeviceData = (serial: string, rows: RawResult[]): DeviceData => {
    return {
        serial,
        measurements: rows.map((row) => ({
            time: new Date(row._time),
            value: row._value,
        })),
    };
};
