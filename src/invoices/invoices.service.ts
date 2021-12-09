import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { InvoicesI } from 'src/common/interface/invoices.interfaces';
import { VANKINVOICES } from 'src/common/models/models';
import { InvoiceDTO } from './dto/invoces.dto';
import * as fs from 'fs';
import * as csv from 'csv-parser';
import { InvoiceReport } from './entity/invoice.entity';
import { RecordsI } from 'src/common/interface/records.interface';

@Injectable()
export class InvoicesService {
  private logger = new Logger('invoices');
  constructor(
    @InjectModel(VANKINVOICES.name) private readonly model: Model<InvoicesI>,
  ) {}

  async generateInvoicesFromCSV() {
    const file = 'invoice.csv';
    const filePath = __dirname + '/document/' + file;
    const total: number = await this.createReadStreamAndUploadToMongoDB(
      filePath,
    );
    this.logger.log(`${total} documento ingresados con exito`);
  }

  async created(invoceDTO: InvoiceDTO): Promise<InvoicesI> {
    const newInvoice = new this.model(invoceDTO);
    return await newInvoice.save();
  }
  async findAll(): Promise<InvoicesI[]> {
    return await this.model.find();
  }
  async findById(id: number): Promise<InvoicesI> {
    return await this.model.findById(id);
  }
  async update(id: number, invoiceDTO: InvoiceDTO): Promise<InvoicesI> {
    return await this.model.findByIdAndUpdate(id, invoiceDTO, { new: true });
  }
  async deleted(id: number): Promise<any> {
    await this.model.findByIdAndDelete(id);
    return { msg: 'invoice eliminado' };
  }

  async findByInvoiceId(id: number): Promise<InvoicesI> {
    const invoices = await this.model.find({ invoiceID: id });
    return invoices[0];
  }

  async saveRecord(file: Express.Multer.File): Promise<any> {
    const filePath = __dirname + '/document/' + file.originalname;
    if (!file.originalname.endsWith('.csv')) {
      throw new BadRequestException('File must be csv');
    }
    const total: number = await this.createReadStreamAndUploadToMongoDB(
      filePath,
    );
    return `documento ingresados ${total} con exito`;
  }

  async createReadStreamAndUploadToMongoDB(filePath: string) {
    const dataList: InvoiceReport[] = [];
    let total = 0;

    const stream = fs
      .createReadStream(filePath)
      .pipe(csv())
      .on('data', async (row: InvoiceReport) => {
        if (dataList.length < 100) {
          dataList.push(row);
        } else {
          stream.pause();
          const result = await this.model
            .insertMany(dataList, { ordered: false })
            .catch(async (e) => {
              if (e.code === 11000) {
                // 1- getting duplicates
                const InvoicesIDs = e.result.result.writeErrors.map((error) => {
                  const parsedError = JSON.stringify(error);
                  const invoice = JSON.parse(parsedError).op;

                  return invoice.INVOICE_ID;
                });
                // 2- removing old duplicates.
                await this.model.deleteMany({
                  orderID: { $in: InvoicesIDs },
                });
                // 3- adding the orders
                try {
                  await this.model.insertMany(dataList, {
                    ordered: false,
                  });
                  return Promise.resolve('Data Inserted');
                } catch (e) {
                  return Promise.reject(e);
                }
              } else return Promise.reject(e);
            });
          total += result.length;
          dataList.length = 0;
          stream.resume();
        }
      });

    const end = new Promise(function (resolve, reject) {
      stream.on('end', async () => {
        resolve(true);
      });
      stream.on('error', reject);
    });

    await end;
    await this.model
      .insertMany(dataList, { ordered: false })
      .catch(async (e) => {
        if (e.code === 11000) {
          // 1- getting duplicates
          const InvoicesIDs = e.result.result.writeErrors.map((error) => {
            const parsedError = JSON.stringify(error);
            const invoice = JSON.parse(parsedError).op;
            return invoice.INVOICE_ID;
          });
          // 2- removing old duplicates.
          await this.model.deleteMany({
            orderID: { $in: InvoicesIDs },
          });

          // 3- adding the orders
          try {
            await this.model.insertMany(dataList, {
              ordered: false,
            });
            return Promise.resolve('Data Inserted');
          } catch (e) {
            return Promise.reject(e);
          }
        } else return Promise.reject(e);
      });
    total += dataList.length;
    return total;
  }

  async getRecord(
    invoce?: number,
    startDate?: Date,
    endDate?: Date,
    currency?: string,
  ): Promise<RecordsI[]> {
    this.logger.log(`startDate: ${startDate}, endDate: ${endDate}`);
    const record: RecordsI[] = [];
    let data;
    if (invoce) {
      data = this.model.find({
        INVOICE_ID: invoce ? invoce : null,
      });
    } else {
      data = this.model.find({
        INVOICE_DATE: {
          $gte: startDate ? startDate : new Date(0),
          $lte: endDate ? endDate : new Date(),
        },
        INVOICE_ID: invoce ? invoce : null,
      });
    }
    if (currency) {
      //aplicamos el cambio en la moneda entregada en cada uno de los elementos los agregamos a records
    } else {
      //creamos los recordsI los agregamos y los enviamos
    }
    return record;
  }

  private removeFile(path: string) {
    fs.unlink(path, (err) => {
      if (err) {
        this.logger.error(err.message);
      }
    });
  }
}
