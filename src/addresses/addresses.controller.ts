import { Controller, Post, Get, Body, Param, ParseIntPipe, HttpStatus } from '@nestjs/common';
import { AddressesService } from './addresses.service';
import { RisksService } from '../risks/risks.service';
import { AddressSearchDto } from './dto/address-search.dto';

@Controller('addresses')
export class AddressesController {
  constructor(
    private readonly addressesService: AddressesService,
    private readonly risksService: RisksService,
  ) {}

  /**
   * Endpoint POST /api/addresses/ pour rechercher et enregistrer une adresse
   */
  @Post()
  async createAddress(@Body() addressSearchDto: AddressSearchDto) {
    return await this.addressesService.searchAndSaveAddress(addressSearchDto);
  }

  /**
   * Endpoint GET /api/addresses/:id/risks/ pour consulter les risques associés à une adresse
   */
  @Get(':id/risks')
  async getAddressRisks(@Param('id', new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_FOUND })) id: number) {
    const address = await this.addressesService.findById(id);
    
    return await this.risksService.getRisksForAddress(address);
  }
}