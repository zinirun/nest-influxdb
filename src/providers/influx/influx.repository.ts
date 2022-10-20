import {
    FluxResultObserver,
    InfluxDB,
    ParameterizedQuery,
    Point,
} from '@influxdata/influxdb-client';
import { Injectable } from '@nestjs/common';
import { from, map } from 'rxjs';
import { ApiConfig } from './interfaces';

@Injectable()
export class InfluxRepository {
    private readonly client: InfluxDB;
    private readonly bucket: string;
    private readonly org: string;

    constructor() {
        const token = process.env.INFLUXDB_TOKEN;
        const url = process.env.INFLUXDB_URL;

        this.bucket = process.env.INFLUXDB_BUCKET;
        this.org = process.env.INFLUXDB_ORG;
        this.client = new InfluxDB({ url, token });
    }

    getClient(): InfluxDB {
        return this.client;
    }

    getWriteApi(org: string, bucket: string) {
        const api = this.client.getWriteApi(org, bucket);
        api.useDefaultTags({ region: 'west' });
        return api;
    }

    getQueryApi(org: string) {
        const api = this.client.getQueryApi(org);
        return api;
    }

    async writePoints(
        points: ArrayLike<Point>,
        customApiConfig?: ApiConfig,
    ): Promise<ArrayLike<Point>> {
        const { bucket, org } = this.getApiConfig(customApiConfig);
        const api = this.getWriteApi(bucket, org);
        api.writePoints(points);
        await api.close();
        return points;
    }

    async writePoint(point: Point, customApiConfig?: ApiConfig): Promise<Point> {
        const { bucket, org } = this.getApiConfig(customApiConfig);
        const api = this.getWriteApi(org, bucket);
        api.writePoint(point);
        await api.close();
        return point;
    }

    queryRows(
        query: string | ParameterizedQuery,
        consumer: FluxResultObserver<string[]>,
        customApiConfig?: ApiConfig,
    ): void {
        const { org } = this.getApiConfig(customApiConfig);
        const api = this.getQueryApi(org);
        api.queryRows(query, consumer);
    }

    async rows<RowType>(
        query: string | ParameterizedQuery,
        customApiConfig?: ApiConfig,
    ): Promise<RowType[]> {
        const { org } = this.getApiConfig(customApiConfig);
        const api = this.getQueryApi(org);

        const rows = [];
        await new Promise((resolve, reject) => {
            from(api.rows(query))
                .pipe(map(({ values, tableMeta }) => tableMeta.toObject(values)))
                .subscribe({
                    next(object) {
                        rows.push(object);
                    },
                    complete() {
                        resolve(rows);
                    },
                    error(err) {
                        reject(err);
                    },
                });
        });
        return rows as RowType[];
    }

    private getApiConfig(customApiConfig?: ApiConfig): ApiConfig {
        if (customApiConfig) {
            return customApiConfig;
        }
        if (this.bucket && this.org) {
            return {
                bucket: this.bucket,
                org: this.org,
            };
        }
        throw new Error('bucket or org is not specified');
    }
}
