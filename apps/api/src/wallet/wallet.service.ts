import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { SearchHistory } from '../search-history/search-history.entity';
import { WalletBalanceResponse, EtherscanBalanceResponse, CoinGeckoEthPriceResponse } from '@crypto-whale-watcher/types';

@Injectable()
export class WalletService {
  constructor(
    @InjectRepository(SearchHistory)
    private searchHistoryRepository: Repository<SearchHistory>,
    private configService: ConfigService,
  ) {}

  async getWalletBalance(address: string): Promise<WalletBalanceResponse> {
    if (!this.isValidEthereumAddress(address)) {
      throw new HttpException('Invalid Ethereum address', HttpStatus.BAD_REQUEST);
    }

    try {
      const [ethBalance, ethPriceUsd] = await Promise.all([this.getEthBalance(address), this.getEthPrice()]);

      const ethBalanceNumber = parseFloat(ethBalance);
      const usdBalance = ethBalanceNumber * ethPriceUsd;

      await this.logSearch(address);

      return {
        address,
        ethBalance,
        usdBalance,
        ethPriceUsd,
        updatedAt: new Date().toISOString(),
      };
    } catch (error) {
      throw new HttpException('Failed to fetch wallet data', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  private async getEthBalance(address: string): Promise<string> {
    const apiKey = this.configService.get<string>('ETHERSCAN_API_KEY');
    const url = `https://api.etherscan.io/v2/api?chainid=1&module=account&action=balance&address=${address}&tag=latest&apikey=${apiKey}`;

    const response = await axios.get<EtherscanBalanceResponse>(url);

    if (response.data.status !== '1') {
      throw new Error('Etherscan API error');
    }

    const weiBalance = response.data.result;
    const ethBalance = (BigInt(weiBalance) / BigInt(10 ** 18)).toString();
    const remainder = (BigInt(weiBalance) % BigInt(10 ** 18)).toString().padStart(18, '0');

    return `${ethBalance}.${remainder.slice(0, 4)}`;
  }

  private async getEthPrice(): Promise<number> {
    const url = this.configService.get<string>('COINGECKO_API_URL') + '/simple/price?ids=ethereum&vs_currencies=usd';

    const response = await axios.get<CoinGeckoEthPriceResponse>(url);
    return response.data.ethereum.usd;
  }

  private async logSearch(address: string): Promise<void> {
    const searchEntry = this.searchHistoryRepository.create({ address });
    await this.searchHistoryRepository.save(searchEntry);
  }

  private isValidEthereumAddress(address: string): boolean {
    return /^0x[a-fA-F0-9]{40}$/.test(address);
  }
}
