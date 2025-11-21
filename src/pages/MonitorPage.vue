<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useMarketStore } from '../shared/stores/marketStore';

import AppHeader from '../shared/components/AppHeader.vue';
import QuoteCard from '../shared/components/QuoteCard.vue';
import TraderDashboard from '../shared/components/TraderDashboard.vue';
import ProfitCalculator from '../shared/components/ProfitCalculator.vue'; 

const marketStore = useMarketStore(); 

const { 
  bitcoinQuote, 
  dollarQuote,
  isLoading, 
  error, 
} = storeToRefs(marketStore);

if (!bitcoinQuote.value && !dollarQuote.value) {
    marketStore.fetchAllMarketData();
}

</script>

<template>
  <div class="min-h-screen bg-gray-900 text-gray-200 p-8 font-mono">
    <div class="max-w-6xl mx-auto flex flex-col space-y-8">
      
      <div v-if="error" class="bg-red-900/40 border border-red-700/60 p-4 rounded-lg shadow-xl">
        <p class="font-semibold text-red-300">ERRO DE CONEXÃO:</p>
        <p class="text-base text-red-100">{{ error }}</p>
      </div>

      <section class="flex gap-6 justify-start">
        
        <div v-if="bitcoinQuote" class="w-full">
            <QuoteCard
                asset-id="BITCOIN"
                :price="bitcoinQuote.price"
                :change-24h="bitcoinQuote.change24h"
                :last-updated="bitcoinQuote.lastUpdated"
            />
        </div>

        <div v-if="dollarQuote" class="w-full">
            <QuoteCard
                asset-id="USD/BRL"
                :price="dollarQuote.price"
                :change-24h="dollarQuote.change24h"
                :last-updated="dollarQuote.lastUpdated"
            />
        </div>

      </section>

      <section>
        <ProfitCalculator />
      </section>

      <section>
        <TraderDashboard />
      </section>
      
      <div v-if="!bitcoinQuote && !dollarQuote && !isLoading && !error" class="text-gray-400 text-center mt-20">
        <p>Nenhum dado de mercado carregado. Clique em "REFRESH" para iniciar.</p>
      </div>
      
    </div>
  </div>
</template>