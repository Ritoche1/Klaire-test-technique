import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RisksService } from './risks.service';
import { AddressRisk } from './entities/address-risk.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([AddressRisk]),
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 5,
    })
  ],
  providers: [RisksService],
  exports: [RisksService],
})
export class RisksModule {}