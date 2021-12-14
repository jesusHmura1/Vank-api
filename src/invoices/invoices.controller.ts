import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { jwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { InvoicesI } from 'src/common/interface/invoices.interfaces';
import { RecordsI } from 'src/common/interface/records.interface';
import { InvoiceDTO } from './dto/invoces.dto';
import { InvoiceReportDTO } from './dto/invoice.report.dto';
import { InvoicesService } from './invoices.service';

@ApiTags('Invoices')
@Controller('api/v1/invoices')
@ApiBearerAuth()
@UseGuards(jwtAuthGuard)
export class InvoicesController {
  constructor(private readonly invoceService: InvoicesService) {}

  @Post()
  @ApiOperation({ summary: 'Created new Invoice' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'invoices generated',
    type: InvoiceDTO,
  })
  createdInvoices(@Body() invoicesDTO: InvoiceDTO) {
    const invoice = this.invoceService.created(invoicesDTO);
    return {
      statCode: HttpStatus.OK,
      message: 'generated',
      data: invoice,
    };
  }

  @Post('invoices/record')
  @ApiOperation({ summary: 'Created invoices by file' })
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

  @Get('/report')
  @ApiOperation({ summary: 'Get invoices by params' })
  async getReport(@Query() params: InvoiceReportDTO): Promise<RecordsI[]> {
    return this.invoceService.getRecord(params);
  }

  @Get()
  @ApiOperation({ summary: 'Get all invoices' })
  async FindAllInvoices(@Res() res): Promise<InvoicesI[]> {
    const data = await this.invoceService.findAll();
    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      message: 'OK',
      data: data,
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get invoice by id mongo' })
  FindByID(@Param('id', ParseIntPipe) id: number): Promise<InvoicesI> {
    return this.invoceService.findById(id);
  }

  @Get('invoice/:id')
  @ApiOperation({ summary: 'Get invoice by invoice id' })
  FindByIDInvoice(@Param('id', ParseIntPipe) id: number): Promise<InvoicesI> {
    return this.invoceService.findByInvoiceId(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update invoice' })
  updateInvoice(
    @Param('id', ParseIntPipe) id: number,
    @Body() invoicesDTO: InvoiceDTO,
  ): Promise<InvoicesI> {
    return this.invoceService.update(id, invoicesDTO);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Deleted invoice' })
  DeletedInvoice(@Param('id', ParseIntPipe) id: number) {
    return this.invoceService.deleted(id);
  }
}
