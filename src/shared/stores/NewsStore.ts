import { defineStore } from 'pinia';
import { ref } from 'vue';
import { fetchBitcoinNews } from '../services/newsService';
import type { IArticle } from '@/shared/types/News';

export const useNewsStore = defineStore('news', () => {
    const articles = ref<IArticle[]>([]);
    const isLoadingNews = ref(false);
    const lastFetch = ref<Date | null>(null);

    async function loadBitcoinNews() {
        if (isLoadingNews.value) return;

        isLoadingNews.value = true;
        try {
            const fetchedArticles = await fetchBitcoinNews();
            articles.value = fetchedArticles;
            lastFetch.value = new Date();
        } catch (error) {
            console.error('Erro ao carregar notícias na Store:', error);
            articles.value = [];
        } finally {
            isLoadingNews.value = false;
        }
    }

    return {
        articles,
        isLoadingNews,
        loadBitcoinNews,
    };
});