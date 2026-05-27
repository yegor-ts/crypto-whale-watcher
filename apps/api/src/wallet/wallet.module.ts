import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WalletController } from './wallet.controller';
import { WalletService } from './wallet.service';
import { SearchHistory } from '../search-history/search-history.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SearchHistory])],
  controllers: [WalletController],
  providers: [WalletService],
})
export class WalletModule {}
