<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useMarketStore } from '@/shared/stores/marketStore';

const marketStore = useMarketStore();
const { isLoading } = storeToRefs(marketStore);

const { fetchAllMarketData } = marketStore;
</script>

<template>
  <header class="flex justify-center gap-10 items-center w-full mx-auto border-b border-gray-700 p-8 bg-gray-900">
    <div class="flex items-center space-x-3">
      <i class="fi fi-rr-dollar text-xl text-green-400"></i>
      <h1 class="text-xl text-gray-100">Monitor de valores</h1>
    </div>

    <button @click="fetchAllMarketData" :disabled="isLoading"
      class="flex items-center space-x-2 px-4 py-2 text-sm font-medium border border-gray-600 text-gray-300 rounded-lg bg-gray-800 hover:bg-gray-700 transition duration-150 disabled:opacity-50 disabled:cursor-not-allowed">

      <i class="fi fi-rr-refresh"><span class="ml-2">Atualizar</span></i>

    </button>
  </header>
</template>