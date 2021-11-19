import { Injectable } from '@nestjs/common';
import { ClientI, ClientIStatus } from 'src/common/interface/client';
import { ClientDTO } from './dto/client.dto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class ClientService {
  clients: ClientI[] = [];
  create(ClientDTO: ClientDTO): ClientIStatus {
    const client = {
      id: uuidv4(),
      ...ClientDTO,
    };
    this.clients.push(client);
    const status: ClientIStatus = { message: 'finalizado' };
    return status;
  }
}
