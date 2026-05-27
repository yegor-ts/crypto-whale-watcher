import { Controller, Get, Param } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { WalletBalanceResponse } from '@crypto-whale-watcher/types';

@Controller('api/wallet')
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @Get(':address')
  async getWalletBalance(@Param('address') address: string): Promise<WalletBalanceResponse> {
    return this.walletService.getWalletBalance(address);
  }
}
