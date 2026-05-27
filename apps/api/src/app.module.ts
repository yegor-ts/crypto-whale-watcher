import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WalletModule } from './wallet/wallet.module';
import { SearchHistory } from './search-history/search-history.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        url: configService.get<string>('DATABASE_URL') || process.env.DATABASE_URL,
        entities: [SearchHistory],
        synchronize: true,
        ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : false,
      }),
      inject: [ConfigService],
    }),
    WalletModule,
  ],
})
export class AppModule {}
