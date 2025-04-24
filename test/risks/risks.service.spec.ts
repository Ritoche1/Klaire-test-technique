import { Test, TestingModule } from '@nestjs/testing';
import { HttpModule } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { getRepositoryToken } from '@nestjs/typeorm';
import { RisksService } from '../../src/risks/risks.service';
import { AddressRisk } from '../../src/risks/entities/address-risk.entity';

describe('RisksService', () => {
  let service: RisksService;

  const mockAddressRiskRepository = {
    findOne: jest.fn(),
    delete: jest.fn(),
    save: jest.fn(),
  };

  const mockConfigService = {
    get: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      providers: [
        RisksService,
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
        {
          provide: getRepositoryToken(AddressRisk),
          useValue: mockAddressRiskRepository,
        },
      ],
    }).compile();

    service = module.get<RisksService>(RisksService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
