import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Address } from '../addresses/entities/address.entity';
import { GeorisquesResponse } from '../addresses/interfaces/address.interface';
import { AddressRisk } from './entities/address-risk.entity';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class RisksService {
  constructor(
    private httpService: HttpService,
    private configService: ConfigService,
    @InjectRepository(AddressRisk)
    private addressRiskRepository: Repository<AddressRisk>,
  ) {}

  /**
   * Récupère les risques associés à une adresse via l'API Géorisques ou depuis le cache
   */
  async getRisksForAddress(address: Address): Promise<GeorisquesResponse> {
    try {
      const cachedRisk = await this.addressRiskRepository.findOne({
        where: { addressId: address.id },
      });

      if (cachedRisk && (!cachedRisk.expiresAt || cachedRisk.expiresAt > new Date())) {
        return JSON.parse(cachedRisk.riskData);
      }

      // Appel à l'API Géorisques
      const apiUrl = `https://www.georisques.gouv.fr/api/v1/resultats_rapport_risque?latlon=${address.longitude},${address.latitude}`;
      const timeout = this.configService.get<number>('API_TIMEOUT') || 15000;
      
      const response = await firstValueFrom(
        this.httpService.get<GeorisquesResponse>(apiUrl, { timeout })
      );

      await this.saveRiskToCache(address.id, response.data);

      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des risques:', error);
      
      throw new InternalServerErrorException("Erreur serveur : échec de la récupération des données de Géorisques.");
    }
  }

  /**
   * Sauvegarde les données de risques en cache
   */
  private async saveRiskToCache(addressId: number, riskData: GeorisquesResponse): Promise<void> {

    await this.addressRiskRepository.delete({ addressId });

    const cacheDurationDays = this.configService.get<number>('RISK_CACHE_DURATION_DAYS') || 30;
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + cacheDurationDays);

    const addressRisk = new AddressRisk();
    addressRisk.addressId = addressId;
    addressRisk.riskData = JSON.stringify(riskData);
    addressRisk.expiresAt = expiresAt;

    await this.addressRiskRepository.save(addressRisk);
  }
}