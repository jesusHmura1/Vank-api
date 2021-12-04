import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { InvoiceDTO } from './dto/invoces.dto';
import { InvoicesService } from './invoices.service';

@ApiTags('Invoices')
@Controller('api/v1/invoices')
export class InvoicesController {
  constructor(private readonly invoceService: InvoicesService) {}

  @Post()
  createdInvoices(@Body() invoicesDTO: InvoiceDTO) {
    return this.invoceService.created(invoicesDTO);
  }

  @Post('invoices/record')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'file',
          format: 'file.csv',
        },
      },
    },
    description: 'CSV file',
    required: true,
  })
  @UseInterceptors(FileInterceptor('file'))
  async saveRecord(@UploadedFile() file: Express.Multer.File) {
    return this.invoceService.saveRecord(file);
  }

  @Get('invoirce/report')
  async getReport(
    @Query('vendor') vendor?: number,
    @Query('startDate') startDate?: Date,
    @Query('endDate') endDate?: Date,
    @Query('currency') currency?: string,
  ) {
    return this.invoceService.getRecord(vendor, startDate, endDate, currency);
  }

  @Get()
  FindAllInvoices() {
    return this.invoceService.findAll();
  }

  @Get(':id')
  FindByID(@Param('id') id: number) {
    return this.invoceService.findById(id);
  }

  @Get('invoice/:id')
  FindByIDInvoice(@Param('id') id: number) {
    return this.invoceService.findByInvoiceId(id);
  }

  @Put(':id')
  updateInvoice(@Param('id') id: number, @Body() invoicesDTO: InvoiceDTO) {
    return this.invoceService.update(id, invoicesDTO);
  }

  @Delete(':id')
  DeletedInvoice(@Param('id') id: number) {
    return this.invoceService.deleted(id);
  }
}
