import {
  IsArray,
  IsCurrency,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';
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
  @IsCurrency()
  readonly currency: string;

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
