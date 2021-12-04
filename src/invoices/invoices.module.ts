import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { VANKINVOICES } from 'src/common/models/models';
import { InvoicesController } from './invoices.controller';
import { InvoicesService } from './invoices.service';
import { InvoicesSchema } from './schema/invoces.schema';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: VANKINVOICES.name,
        useFactory: () => {
          return InvoicesSchema;
        },
      },
    ]),
  ],
  controllers: [InvoicesController],
  providers: [InvoicesService],
  exports: [InvoicesService],
})
export class InvoicesModule {}
