import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ScanModule } from './domains/scan/scan.module';
import { GraphQLModule } from '@nestjs/graphql';
import { join } from 'path';
import { ApolloDriver } from '@nestjs/apollo';

@Module({
    imports: [
        GraphQLModule.forRoot({
            driver: ApolloDriver,
            autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
            context: ({ req, res, connection }) =>
                req
                    ? {
                          req,
                          res,
                      }
                    : {
                          req: {
                              headers: connection.context,
                          },
                      },
            cors: {
                credentials: true,
                origin: true,
            },
            playground: process.env.NODE_ENV !== 'production',
            introspection: process.env.NODE_ENV !== 'production',
        }),
        ScanModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
