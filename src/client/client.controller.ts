import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ClientService } from './client.service';
import { ValidationClientDTO } from './dto/client.dto';
import { editClientSimpleDto } from './dto/update.client.dto';

@ApiTags('Client')
@Controller('client')
export class ClientController {
  constructor(private readonly clientService: ClientService) {}

  @Post()
  @ApiOperation({ summary: 'created new client for vank' })
  CreateClient(@Body() clientDTO: ValidationClientDTO) {
    return this.clientService.create(clientDTO);
  }

  @Put(':id')
  @ApiOperation({ summary: 'update client information' })
  updateClient(
    @Param('id') id: string,
    @Body() clientUpdate: editClientSimpleDto,
  ) {
    return clientUpdate;
  }

  @Get()
  findAll() {
    return this.clientService.findAll();
  }
}
