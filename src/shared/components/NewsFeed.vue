<script setup lang="ts">
import { onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import { useNewsStore } from '@/shared/stores/NewsStore';

const newsStore = useNewsStore();
const { articles, isLoadingNews } = storeToRefs(newsStore);
const { loadBitcoinNews } = newsStore;

const formatTime = (dateString: string) => {
    const published = new Date(dateString);
    const diffInSeconds = Math.round((new Date().getTime() - published.getTime()) / 1000);

    if (diffInSeconds < 60) return `${diffInSeconds}s atrás`;
    const diffInMinutes = Math.round(diffInSeconds / 60);
    if (diffInMinutes < 60) return `${diffInMinutes}m atrás`;
    const diffInHours = Math.round(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h atrás`;
    
    return published.toLocaleDateString();
};

onMounted(() => {
    loadBitcoinNews();
});
</script>

<template>
    <div class="w-full h-full rounded-lg p-4 flex flex-col shadow-lg">
        <h2 class="text-xl font-semibold text-white mb-4 border-b border-gray-700 pb-2 flex items-center">
            <span class="text-orange-400 mr-2"><i class="fi fi-rr-search"></i></span> Notícias
        </h2>

        <div v-if="isLoadingNews" class="flex items-center justify-center h-full text-gray-400 p-8">
            Carregando notícias de mercado...
        </div>

        <div v-else-if="articles.length === 0" class="text-gray-500 p-4 text-center">
            Nenhuma notícia recente encontrada ou ocorreu um erro de conexão.
        </div>

        <div v-else class="space-y-4 overflow-y-auto custom-scrollbar flex-grow">
            <a v-for="item in articles" :key="item.url" :href="item.url" target="_blank"
                class="block py-5 p-4 bg-gray-900 hover:bg-gray-900/70 rounded-lg transition duration-150 group border border-gray-500">
                <p class="text-sm font-medium text-orange-400 group-hover:text-orange-500">
                    {{ item.title }}
                </p>
                <p v-if="item.description" class="text-xs text-gray-200 mt-1 line-clamp-2">
                    {{ item.description }}
                </p>
                <div class="flex justify-between items-center mt-2">
                    <span class="text-[10px] text-gray-300 font-mono">{{ item.source }}</span>
                    <span class="text-[10px] text-gray-200">{{ formatTime(item.publishedAt) }}</span>
                </div>
            </a>
        </div>
    </div>
</template>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
    width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
    background-color: #4b5563; 
    border-radius: 3px;
}
</style>