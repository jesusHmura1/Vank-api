import { Controller, Post } from '@nestjs/common';
import { ClientService } from './client.service';
import { ClientDTO } from './dto/client.dto';

@Controller('client')
export class ClientController {
  constructor(private readonly ClientService: ClientService) {}

  @Post()
  CreateClient(ClientDTO: ClientDTO) {
    return this.ClientService.create(ClientDTO);
  }
}
