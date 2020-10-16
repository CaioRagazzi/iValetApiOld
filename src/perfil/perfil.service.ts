import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Perfil } from './perfil.entity';

@Injectable()
export class PerfilService {
  constructor(
    @InjectRepository(Perfil)
    private perfilRepository: Repository<Perfil>,
  ) {}

  async get(perfilId: number): Promise<Perfil> {
    const perfil = await this.perfilRepository.findOne(perfilId);

    return perfil;
  }
}
