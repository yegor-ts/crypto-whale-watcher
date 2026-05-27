'use client';

import { useState } from 'react';
import { WalletBalanceResponse } from '@crypto-whale-watcher/types';

export default function Home() {
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<WalletBalanceResponse | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setResult(null);

    if (!address.trim()) {
      setError('Please enter a wallet address');
      return;
    }

    setLoading(true);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
      const response = await fetch(`${apiUrl}/api/wallet/${address}`);

      if (!response.ok) {
        throw new Error('Failed to fetch wallet data');
      }

      const data: WalletBalanceResponse = await response.json();
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-gradient-to-br from-zinc-50 to-zinc-100 dark:from-zinc-900 dark:to-black font-sans px-4">
      <main className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-zinc-900 dark:text-zinc-50 mb-2">Crypto Whale Watcher</h1>
          <p className="text-zinc-600 dark:text-zinc-400">Track Ethereum wallet balances in real-time</p>
        </div>

        <form onSubmit={handleSearch} className="mb-8">
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Enter Ethereum address (0x...)"
              className="flex-1 px-4 py-3 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium rounded-lg transition-colors"
            >
              {loading ? 'Searching...' : 'Search'}
            </button>
          </div>
        </form>

        {error && (
          <div className="p-4 mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-red-800 dark:text-red-200">{error}</p>
          </div>
        )}

        {result && (
          <div className="bg-white dark:bg-zinc-800 rounded-lg shadow-lg p-6 border border-zinc-200 dark:border-zinc-700">
            <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50 mb-4">Wallet Balance</h2>

            <div className="space-y-4">
              <div>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-1">Address</p>
                <p className="font-mono text-sm text-zinc-900 dark:text-zinc-100 break-all">{result.address}</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-1">ETH Balance</p>
                  <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">{result.ethBalance} ETH</p>
                </div>

                <div>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-1">USD Value</p>
                  <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                    ${result.usdBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-1">ETH Price</p>
                <p className="text-lg text-zinc-900 dark:text-zinc-100">
                  ${result.ethPriceUsd.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
              </div>

              <div>
                <p className="text-xs text-zinc-500 dark:text-zinc-500" suppressHydrationWarning>
                  Last updated: {new Date(result.updatedAt).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
