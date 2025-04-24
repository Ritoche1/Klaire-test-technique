import { Test, TestingModule } from '@nestjs/testing';
import { AddressesController } from '../../src/addresses/addresses.controller';
import { AddressesService } from '../../src/addresses/addresses.service';
import { RisksService } from '../../src/risks/risks.service';

describe('AddressesController', () => {
  let controller: AddressesController;

  // Mock des services
  const mockAddressesService = {
    findById: jest.fn(),
    searchAndSaveAddress: jest.fn(),
  };

  const mockRisksService = {
    getRisksForAddress: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AddressesController],
      providers: [
        {
          provide: AddressesService,
          useValue: mockAddressesService,
        },
        {
          provide: RisksService,
          useValue: mockRisksService,
        },
      ],
    }).compile();

    controller = module.get<AddressesController>(AddressesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
