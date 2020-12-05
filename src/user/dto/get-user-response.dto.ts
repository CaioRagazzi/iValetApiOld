import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { Company } from 'src/company/company.entity';
import { Perfil } from 'src/perfil/perfil.entity';

export class UserGetResponsetDto {
  @ApiProperty()
  @IsNotEmpty()
  id: number;

  @ApiProperty()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  email: string;

  @ApiProperty()
  @IsString()
  createdAt: Date;

  @ApiProperty()
  @IsString()
  updatedAt: Date;

  @ApiProperty()
  company: Company[];

  @ApiProperty()
  perfil: Perfil;
}
