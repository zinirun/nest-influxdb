import { Field, Float, ID, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class DeviceDataStats {
    @Field(() => ID)
    serial: string;

    @Field(() => Float)
    mkt: number;

    @Field(() => Float)
    avg: number;

    @Field(() => Int)
    count: number;
}
