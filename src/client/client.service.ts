import { Injectable } from '@nestjs/common';
import { ClientI, ClientIStatus } from 'src/common/interface/client';
import { ValidationClientDTO } from './dto/client.dto';
import { v4 as uuidv4 } from 'uuid';
import { Model } from 'mongoose';
import { VANKCLIENT } from 'src/common/models/models';
import { InjectModel } from '@nestjs/mongoose';
import { editClientSimpleDto } from './dto/update.client.dto';

@Injectable()
export class ClientService {
  constructor(
    @InjectModel(VANKCLIENT.name) private readonly model: Model<ClientI>,
  ) {}

  async create(
    validationClientDTO: ValidationClientDTO,
  ): Promise<ClientIStatus> {
    let status: ClientIStatus;
    if (validationClientDTO.token !== '1') {
      const status = { message: 'no tiene permisos' };
      return status;
    }
    const client = {
      id: uuidv4(),
      ...validationClientDTO.client,
    };
    const newClient = new this.model({ ...client });
    try {
      await newClient.save();
      status = {
        message: 'nuevo cliente creado con exito',
      };
    } catch {
      status = {
        message: 'No se pudo crear a el nuevo cliente',
      };
    }
    return status;
  }

  async update(
    id: string,
    clientUpdate: editClientSimpleDto,
  ): Promise<ClientI> {
    return await this.model.findByIdAndUpdate(id, clientUpdate, { new: true });
  }

  async findAll(): Promise<ClientI[]> {
    return await this.model.find();
  }
}
