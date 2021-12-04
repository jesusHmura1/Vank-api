import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';
import { enumToString } from 'src/helpers/enumToString';
import { CurrencyType } from '../enums';
import { ApiProperty } from '@nestjs/swagger';

export class ClientDTO {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  readonly name: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  readonly codeID: string;

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
  readonly currency: CurrencyType;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  readonly monthlyCall: number;
  @ApiProperty()
  @IsNotEmpty()
  @IsArray()
  readonly bank: number[];
}

export class ValidationClientDTO {
  @ApiProperty()
  @IsNotEmpty()
  readonly client: ClientDTO;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  readonly token: string;
}
