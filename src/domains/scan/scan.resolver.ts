import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql';
import { DeviceData, SaveDeviceDataInput, SaveDeviceDataResult } from './dto';
import { DeviceDataStats } from './dto/device-data-stats.type';
import { ScanService } from './scan.service';

@Resolver()
export class ScanResolver {
    constructor(private readonly scanService: ScanService) {}

    @Query(() => DeviceData)
    async deviceData(@Args('serial', { type: () => ID }) serial: string): Promise<DeviceData> {
        return await this.scanService.queryBySerial(serial);
    }

    @Query(() => DeviceDataStats)
    async deviceDataStats(
        @Args('serial', { type: () => ID }) serial: string,
    ): Promise<DeviceDataStats> {
        return await this.scanService.statsBySerial(serial);
    }

    @Mutation(() => SaveDeviceDataResult)
    async saveDeviceData(@Args('data') input: SaveDeviceDataInput): Promise<SaveDeviceDataResult> {
        return await this.scanService.save(input);
    }
}
