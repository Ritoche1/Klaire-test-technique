import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';
import { AddressesController } from './addresses.controller';
import { AddressesService } from './addresses.service';
import { Address } from './entities/address.entity';
import { RisksService } from '../risks/risks.service';
import { RisksModule } from 'src/risks/risks.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Address]),
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 5,
    }),
    RisksModule,
  ],
  controllers: [AddressesController],
  providers: [AddressesService],
  exports: [AddressesService],
})
export class AddressesModule {}