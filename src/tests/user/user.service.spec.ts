import { Test, TestingModule } from '@nestjs/testing';
import { UserModule } from '../../user/user.module';
import { CompanyModule } from '../../company/company.module';
import { UserService } from '../../user/user.service';
import { PerfilModule } from '../../perfil/perfil.module';
import { getRepositoryToken } from '@nestjs/typeorm/dist/common/typeorm.utils';
import { User } from '../../user/user.entity';

describe('UserService', () => {
  let service: UserService;

  const mockRepository = {
    findOne: jest.fn(),
    find: jest.fn(),
    insert: jest.fn(),
    update: jest.fn(),
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [CompanyModule, UserModule, PerfilModule],
      providers: [UserService, {
        provide: getRepositoryToken(User),
        useValue: mockRepository
      }],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
