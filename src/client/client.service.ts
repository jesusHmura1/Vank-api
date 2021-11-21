import { Injectable } from '@nestjs/common';
import { ClientI, ClientIStatus } from 'src/common/interface/client';
import { ValidationClientDTO } from './dto/client.dto';
import { v4 as uuidv4 } from 'uuid';
import { Model } from 'mongoose';
import { VANKCLIENT } from 'src/common/models/models';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class ClientService {
  constructor(
    @InjectModel(VANKCLIENT.name) private readonly model: Model<ClientI>,
  ) {}

  async create(
    validationClientDTO: ValidationClientDTO,
  ): Promise<ClientIStatus> {
    const currencyCase: string[] = ['CLP', 'USD', 'EUR'];
    if (currencyCase.includes(validationClientDTO.client.currency)) {
      if (validationClientDTO.token !== '1') {
        const status: ClientIStatus = { message: 'no tiene permisos' };
        return status;
      }
      const client = {
        id: uuidv4(),
        ...validationClientDTO.client,
      };
      const newClient = new this.model({ ...client });
      const newClientCreate = await newClient.save();
      const status: ClientIStatus = {
        message: 'nuevo cliente creado con exito',
        client: newClientCreate,
      };
      return status;
    } else {
      const status: ClientIStatus = { message: 'currency not valid' };
      return status;
    }
  }
}
