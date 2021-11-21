import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { VANKCLIENT } from 'src/common/models/models';
import { ClientController } from './client.controller';
import { ClientService } from './client.service';
import { ClientSchema } from './schema/client.schema';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: VANKCLIENT.name,
        useFactory: () => {
          return ClientSchema;
        },
      },
    ]),
  ],
  controllers: [ClientController],
  providers: [ClientService],
})
export class ClientModule {}
