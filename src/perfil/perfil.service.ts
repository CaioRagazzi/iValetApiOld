import { Injectable, Inject } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Perfil } from './perfil.entity';

@Injectable()
export class PerfilService {
  constructor(
    @Inject('PERFIL_REPOSITORY')
    private perfilRepository: Repository<Perfil>,
  ) {}

  async get(perfilId: number): Promise<Perfil> {
    const perfil = await this.perfilRepository.findOne(perfilId);

    return perfil;
  }
}
