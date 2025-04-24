import { Test, TestingModule } from '@nestjs/testing';
import { HttpService } from '@nestjs/axios';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { Repository } from 'typeorm';
import { AddressesService } from '../../src/addresses/addresses.service';
import { Address } from '../../src/addresses/entities/address.entity';
import { AddressSearchDto } from '../../src/addresses/dto/address-search.dto';
import { of } from 'rxjs';
import { NotFoundException } from '@nestjs/common';

describe('AddressesService', () => {
  let addressesService: AddressesService;
  let addressRepository: Repository<Address>;
  let httpService: HttpService;

  const mockAddressRepository = {
    findOne: jest.fn(),
    save: jest.fn(),
  };

  const mockHttpService = {
    get: jest.fn(),
  };

  const mockConfigService = {
    get: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AddressesService,
        {
          provide: getRepositoryToken(Address),
          useValue: mockAddressRepository,
        },
        {
          provide: HttpService,
          useValue: mockHttpService,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    addressesService = module.get<AddressesService>(AddressesService);
    addressRepository = module.get<Repository<Address>>(getRepositoryToken(Address));
    httpService = module.get<HttpService>(HttpService);
  });

  it('should be defined', () => {
    expect(addressesService).toBeDefined();
  });

  describe('findById', () => {
    it('should return an address if found', async () => {
      const expectedAddress = new Address();
      expectedAddress.id = 1;
      expectedAddress.label = '8 bd du Port, 56170 Sarzeau';
      
      mockAddressRepository.findOne.mockResolvedValue(expectedAddress);

      const result = await addressesService.findById(1);
      expect(result).toBe(expectedAddress);
    });

    it('should throw NotFoundException if address not found', async () => {
      mockAddressRepository.findOne.mockResolvedValue(null);

      await expect(addressesService.findById(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('searchAndSaveAddress', () => {
    it('should throw NotFoundException if no address found', async () => {
      const dto: AddressSearchDto = { q: 'adresse inexistante' };
      
      // Mock de la réponse de l'API BAN sans résultats
      mockHttpService.get.mockReturnValue(
        of({
          data: {
            features: [],
          },
        }),
      );

      await expect(addressesService.searchAndSaveAddress(dto)).rejects.toThrow(NotFoundException);
    });
  });
});