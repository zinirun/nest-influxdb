import { Field, Float, ID, InputType } from '@nestjs/graphql';

@InputType()
export class SaveDeviceDataInput {
    @Field()
    readonly measurement: string;

    @Field(() => ID)
    readonly serial: string;

    @Field(() => Float)
    readonly value: number;

    @Field(() => Date, {
        nullable: true,
    })
    readonly timestamp?: Date;
}
