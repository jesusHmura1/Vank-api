import { OmitType, PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsEnum,
  IsNumber,
  IsArray,
} from 'class-validator';
import { enumToString } from 'src/helpers/enumToString';
import { CurrencyType } from '../enums';
import { ClientDTO } from './client.dto';

export class editClientDto extends PartialType(
  OmitType(ClientDTO, ['name'] as const),
) {}

export class editClientSimpleDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  readonly tributeID: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsEnum(CurrencyType, {
    message: `Categoria no valida, las categorias validas son: ${enumToString(
      CurrencyType,
    )}`,
  })
  @IsString()
  readonly currency: string;
}
