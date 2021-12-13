import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { UserDTO } from './dto/user.dto';
import { UserService } from './user.service';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { jwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@ApiTags('Users')
@Controller('api/v1/user')
@ApiBearerAuth()
@UseGuards(jwtAuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiOperation({ summary: 'Created new User' })
  create(@Body() userDTO: UserDTO) {
    return this.userService.created(userDTO);
  }

  @Get()
  @ApiOperation({ summary: 'Get all Users' })
  findeAll() {
    return this.userService.findeAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get one User' })
  findeOne(@Param('id') id: string) {
    return this.userService.findeOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update User' })
  update(@Param('id') id: string, @Body() userDTO: UserDTO) {
    return this.userService.update(id, userDTO);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Deleted User' })
  delete(@Param('id') id: string) {
    return this.userService.delete(id);
  }
}
