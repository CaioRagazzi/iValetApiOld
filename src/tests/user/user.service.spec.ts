import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '../../user/user.service';
import { getRepositoryToken } from '@nestjs/typeorm/dist/common/typeorm.utils';
import { User } from '../../user/user.entity';
import { SendEmailService } from '../../sendEmail/sendEmail.service';
import { PerfilService } from '../../perfil/perfil.service';
import { Perfil } from '../../perfil/perfil.entity';

describe('UserService', () => {
  let service: UserService;

  const mockRepository = {
    findOne: jest.fn(),
    find: jest.fn(),
    insert: jest.fn(),
    update: jest.fn(),
  }

  const perfilRepository = {

  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserService, {
        provide: getRepositoryToken(User),
        useValue: mockRepository
      }, SendEmailService, PerfilService, {
        provide: getRepositoryToken(Perfil),
        useValue: perfilRepository
      }],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
