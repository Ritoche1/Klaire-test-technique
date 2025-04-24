import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AddressesModule } from './addresses/addresses.module';
import { RisksModule } from './risks/risks.module';

@Module({
  imports: [
    // Configuration avec variables d'environnement
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    
    // Configuration de TypeORM avec SQLite
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'sqlite',
        database: configService.get<string>('TYPEORM_DATABASE'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: true, // À désactiver en production
      }),
    }),
    
    // Modules de l'application
    AddressesModule,
    RisksModule,
  ],
})
export class AppModule {}