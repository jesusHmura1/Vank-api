import { IsArray, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class ClientDTO {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  codeId: string;

  @IsNotEmpty()
  @IsNumber()
  tributeID: number;

  @IsNotEmpty()
  @IsString()
  currency: string;

  @IsNotEmpty()
  @IsNumber()
  monthlyCall: number;

  @IsNotEmpty()
  @IsArray()
  bank: number[];
}
