
import type { IArticle } from '@/shared/types/News'; // Certifique-se de criar este tipo!

// Variáveis de ambiente
const API_KEY = import.meta.env.VITE_NEWS_API_KEY;
const BASE_URL = 'https://newsapi.org/v2/everything';

// Configurações básicas da busca (Bitcoin, em Português)
const DEFAULT_PARAMS = {
    q: 'bitcoin OR criptomoeda', // Busca por Bitcoin ou criptomoeda
    language: 'pt',              // Idioma em português
    sortBy: 'publishedAt',       // Ordena pela data de publicação
    pageSize: 10,                // Limita a 10 notícias
};

export async function fetchBitcoinNews(): Promise<IArticle[]> {
    if (!API_KEY) {
        console.error("News API Key não configurada. Verifique VITE_NEWS_API_KEY.");
        return [];
    }
    
    // Constrói a URL com os parâmetros de busca e a chave de API
    const url = new URL(BASE_URL);
    Object.entries(DEFAULT_PARAMS).forEach(([key, value]) => {
        url.searchParams.append(key, String(value));
    });
    url.searchParams.append('apiKey', API_KEY);

    try {
        const response = await fetch(url.toString());
        
        if (!response.ok) {
            // Trata erros HTTP (ex: 429 Too Many Requests, 401 Unauthorized)
            const errorData = await response.json();
            throw new Error(`Erro ao buscar notícias: ${response.status} - ${errorData.message}`);
        }

        const data = await response.json();
        
        if (data.status !== 'ok') {
            throw new Error(`Erro na resposta da API: ${data.message}`);
        }

        // Mapeia e retorna apenas os campos necessários
        return data.articles.map((article: any) => ({
            title: article.title,
            description: article.description,
            url: article.url,
            publishedAt: article.publishedAt,
            source: article.source.name,
        }));

    } catch (error) {
        console.error('Falha na requisição de notícias:', error);
        // Retorna um array vazio em caso de falha
        return []; 
    }
}
