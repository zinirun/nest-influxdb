import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql';
import { DeviceData, SaveDeviceDataInput, SaveDeviceDataResult } from './dto';
import { ScanService } from './scan.service';

@Resolver()
export class ScanResolver {
    constructor(private readonly scanService: ScanService) {}

    @Query(() => DeviceData)
    async findBySerial(@Args('serial', { type: () => ID }) serial: string): Promise<DeviceData> {
        return await this.scanService.findBySerial(serial);
    }

    @Mutation(() => SaveDeviceDataResult)
    async saveDeviceData(@Args('data') input: SaveDeviceDataInput): Promise<SaveDeviceDataResult> {
        return await this.scanService.save(input);
    }
}
