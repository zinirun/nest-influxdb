import { Field, Float, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Measurement {
    @Field(() => Date)
    time: Date;

    @Field(() => Float)
    value: number;
}

@ObjectType()
export class DeviceData {
    @Field(() => ID)
    serial: string;

    @Field(() => [Measurement])
    measurements: Measurement[];
}
