import { IsEmail, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Perfil } from 'src/perfil/perfil.entity';

export class UserCompanyInsertResponseDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNumber()
  @IsNotEmpty()
  perfil: Perfil;
}
