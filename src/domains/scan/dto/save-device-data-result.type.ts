import { Field, Float, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class SaveDeviceDataResult {
    @Field(() => ID)
    serial: string;

    @Field(() => Float)
    value: number;

    @Field(() => Date)
    time: Date;
}
