import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { IAssetQuote } from '../types/Investiment';
import { marketDataService, type IDollarQuote } from '../services/marketDataService';

export const useMarketStore = defineStore('market', () => {
  const bitcoinQuote = ref<IAssetQuote | null>(null);
  const dollarQuote = ref<IDollarQuote | null>(null); // Novo estado
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  async function fetchAllMarketData(): Promise<boolean> {
    isLoading.value = true;
    error.value = null;
    try {
      // Executa as duas buscas em paralelo para eficiência
      const [btcData, usdData] = await Promise.all([
        marketDataService.getBitcoinQuote(),
        marketDataService.getDollarQuote(),
      ]);
      
      bitcoinQuote.value = btcData;
      dollarQuote.value = usdData; // Atualiza o Dólar
      return true;

    } catch (e) {
      error.value = (e instanceof Error) ? e.message : 'Erro desconhecido ao buscar dados.';
      return false;
    } finally {
      isLoading.value = false;
    }
  }

  return {
    bitcoinQuote,
    dollarQuote, // Retorna o Dólar
    isLoading,
    error,
    fetchAllMarketData,
  };
});