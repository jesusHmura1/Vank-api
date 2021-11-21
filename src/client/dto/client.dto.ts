import { IsArray, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class ClientDTO {
  @IsNotEmpty()
  @IsString()
  readonly name: string;

  @IsNotEmpty()
  @IsString()
  readonly codeID: string;

  @IsNotEmpty()
  @IsString()
  readonly tributeID: string;

  @IsNotEmpty()
  @IsString()
  readonly currency: string;

  @IsNotEmpty()
  @IsNumber()
  readonly monthlyCall: number;

  @IsNotEmpty()
  @IsArray()
  readonly bank: number[];
}

export class ValidationClientDTO {
  @IsNotEmpty()
  readonly client: ClientDTO;
  @IsNotEmpty()
  @IsString()
  readonly token: string;
}
