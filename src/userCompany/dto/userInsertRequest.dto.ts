import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsString,
  MinLength,
  IsOptional,
} from 'class-validator';
import { Perfil } from 'src/perfil/perfil.entity';

export class UserCompanyInsertRequestDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNumber()
  @IsNotEmpty()
  perfil: Perfil;

  @IsString()
  @IsOptional()
  companyName: string;
}
