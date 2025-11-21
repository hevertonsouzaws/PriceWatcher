import axios from 'axios';
import type { IAssetQuote } from '@/shared/types/Investiment'; 

const CMC_API_KEY = import.meta.env.VITE_CMC_API_KEY; 
const CMC_PROXY_PATH = '/api/cmc/v1/cryptocurrency/quotes/latest'; 
const AWESOMEAPI_URL = 'https://economia.awesomeapi.com.br/json/last/USD-BRL';

export interface IDollarQuote {
  price: number;
  change24h: number;
  lastUpdated: string;
}

export const marketDataService = {
    async getDollarQuote(): Promise<IDollarQuote> {
        try {
            // AwesomeAPI: busca a cotação do dólar USD/BRL
            const response = await axios.get(AWESOMEAPI_URL);
            const data = response.data.USDBRL;

            if (!data || !data.bid) {
                throw new Error('Cotação USD/BRL indisponível.');
            }
            
            return {
                price: parseFloat(data.bid),
                change24h: parseFloat(data.pctChange),
                lastUpdated: new Date().toISOString(),
            };
        } catch (error) {
            throw new Error('Falha na busca de cotação do Dólar.');
        }
    },

    async getBitcoinQuote(): Promise<IAssetQuote> {
        if (!CMC_API_KEY) {
            throw new Error('CMC API Key não está configurada.');
        }

        try {
            const response = await axios.get(CMC_PROXY_PATH, {
                params: {
                    symbol: 'BTC',
                    convert: 'BRL',
                },
                headers: {
                    'X-CMC_PRO_API_KEY': CMC_API_KEY,
                },
            });

            const btcData = response.data.data.BTC.quote.BRL;
            
            const quote: IAssetQuote = {
                assetId: 'BTC',
                price: btcData.price, 
                change24h: btcData.percent_change_24h,
                lastUpdated: new Date().toISOString(),
            };

            return quote;
        } catch (error) {
            throw new Error('Falha na busca CMC. Verifique a chave, o Proxy e os limites de uso.');
        }
    },
};