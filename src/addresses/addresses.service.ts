import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { Address } from './entities/address.entity';
import { AddressSearchDto } from './dto/address-search.dto';
import { BanResponse, BanFeature } from './interfaces/address.interface';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AddressesService {
  constructor(
    @InjectRepository(Address)
    private addressRepository: Repository<Address>,
    private httpService: HttpService,
    private configService: ConfigService,
  ) {}

  /**
   * Recherche une adresse via l'API BAN et la persiste en base
   */
  async searchAndSaveAddress(addressSearchDto: AddressSearchDto): Promise<Address> {
    try {
      // Appel à l'API BAN
      const apiUrl = `https://api-adresse.data.gouv.fr/search/?q=${encodeURIComponent(addressSearchDto.q)}&limit=1`;
      const timeout = this.configService.get<number>('API_TIMEOUT') || 5000;
      
      const response = await firstValueFrom(
        this.httpService.get<BanResponse>(apiUrl, { timeout })
      );

      if (!response.data.features || response.data.features.length === 0) {
        throw new NotFoundException("Adresse non trouvée. Aucun résultat ne correspond à votre recherche.");
      }

      const feature = response.data.features[0];
      const address = this.mapFeatureToAddress(feature);

      return this.addressRepository.save(address);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      console.error('Erreur lors de la recherche d\'adresse:', error);
      
      throw new InternalServerErrorException("Erreur serveur : impossible de contacter l'API externe.");
    }
  }

  /**
   * Récupère une adresse par son ID
   */
  async findById(id: number): Promise<Address> {
    const address = await this.addressRepository.findOne({ where: { id } });
    
    if (!address) {
      throw new NotFoundException("Adresse non trouvée.");
    }
    
    return address;
  }

  /**
   * Convertit une feature de l'API BAN en entité Address
   */
  private mapFeatureToAddress(feature: BanFeature): Address {
    const { coordinates } = feature.geometry;
    const properties = feature.properties;

    const address = new Address();
    address.label = properties.label;
    address.housenumber = properties.housenumber;
    address.street = properties.street;
    address.postcode = properties.postcode;
    address.citycode = properties.citycode;
    address.longitude = coordinates[0];
    address.latitude = coordinates[1];

    return address;
  }
}