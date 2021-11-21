import { Body, Controller, Post } from '@nestjs/common';
import { ClientService } from './client.service';
import { ValidationClientDTO } from './dto/client.dto';

@Controller('client')
export class ClientController {
  constructor(private readonly clientService: ClientService) {}

  @Post()
  CreateClient(@Body() clientDTO: ValidationClientDTO) {
    return this.clientService.create(clientDTO);
  }
}
