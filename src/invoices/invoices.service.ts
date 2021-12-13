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
import { InvoiceReportDTO } from './dto/invoice.report.dto';
import axios from 'axios';

@Injectable()
export class InvoicesService {
  private logger = new Logger('invoices');
  constructor(
    @InjectModel(VANKINVOICES.name) private readonly model: Model<InvoicesI>,
  ) {}

  async convertCurrency(amount, fromCurrency, toCurrency): Promise<any> {
    const apiKey = process.env.API_KEY;

    fromCurrency = encodeURIComponent(fromCurrency);
    toCurrency = encodeURIComponent(toCurrency);
    const query = fromCurrency + '_' + toCurrency;

    const url = `https://api.currconv.com/api/v7/convert?q=${query}&compact=ultra&apiKey=${apiKey}`;
    console.log(url);

    const { data } = await axios.get(url);
    console.log(data);

    let body = '';
    data.on('data', function (chunk) {
      body += chunk;
    });

    data.on('end', function () {
      try {
        const jsonObj = JSON.parse(body);

        const val = jsonObj[query];
        if (val) {
          const total = val * amount;
          return Math.round(total * 100) / 100;
        } else {
          const err = new Error('Value not found for ' + query);
          console.log(err);
          this.logger.log(`parser error: ${err}`);
        }
      } catch (e) {
        console.log('Parse error: ', e);
        this.logger.log(`parser error: ${e}`);
      }
    });
  }

  async generateInvoicesFromCSV(): Promise<any> {
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
    return `${total} documento ingresados con exito`;
  }

  async createReadStreamAndUploadToMongoDB(filePath: string): Promise<number> {
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

  async getRecord(params: InvoiceReportDTO): Promise<RecordsI[]> {
    this.logger.log(
      `startDate: ${params.startDate}, endDate: ${params.endDate}, invoce: ${params.invoiceID}, currency: ${params.currency}`,
    );
    const records: RecordsI[] = [];
    let data: InvoicesI[];
    if (params.invoiceID && !params.endDate && !params.startDate) {
      const idInvoice = Number(params.invoiceID);
      data = await this.model.find({
        VENDOR_ID: idInvoice,
      });
    } else {
      const newStartDate = params.startDate
        ? params.startDate
        : new Date(new Date().setDate(1));
      const newEndDate = params.endDate ? params.endDate : new Date();
      if (params.invoiceID) {
        const idInvoice = Number(params.invoiceID);
        data = await this.model.find({
          INVOICE_DATE: {
            $gte: newStartDate,
            $lte: newEndDate,
          },
          VENDOR_ID: idInvoice,
        });
      } else {
        data = await this.model.find({
          INVOICE_DATE: {
            $gte: newStartDate,
            $lte: newEndDate,
          },
        });
      }
    }
    if (params.currency) {
      for (const invoice of data) {
        if (invoice.CURRENCY != params.currency) {
          this.convertCurrency(
            invoice.INVOICE_TOTAL,
            invoice.CURRENCY,
            params.currency,
          );
        }
      }

      //aplicamos el cambio en la moneda entregada en cada uno de los elementos los agregamos a records
    } else {
      for (const invoice of data) {
        const newRecord: RecordsI = {
          invoiceID: invoice.INVOICE_ID,
          vendorID: invoice.VENDOR_ID,
          invoiceNumber: invoice.INVOICE_NUMBER,
          invoiceTotal: invoice.INVOICE_TOTAL,
          paymentTotal: invoice.PAYMENT_TOTAL,
          creditTotal: invoice.CREDIT_TOTAL,
          bankID: invoice.BANK_ID,
        };
        records.push(newRecord);
      }
    }
    return records;
  }
}
