<script setup lang="ts">
import { computed } from 'vue';
import { storeToRefs } from 'pinia';
import { useMarketStore } from '../stores/marketStore';
import { formatCurrency } from '../helpers/formatHelper';

const marketStore = useMarketStore();
const { bitcoinQuote } = storeToRefs(marketStore);

const openPrice = computed(() => {
    if (!bitcoinQuote.value) {
        return 0;
    }
    const currentPrice = bitcoinQuote.value.price;
    const change = bitcoinQuote.value.change24h / 100;
    
    // Calcula o preço de abertura baseado no preço atual e na variação percentual
    // Fórmula: Preço_Abertura = Preço_Atual / (1 + Variação_Percentual)
    return currentPrice / (1 + change);
});

const absoluteChange = computed(() => {
    if (!bitcoinQuote.value) return 0;
    
    // Variação em Reais (Preço Atual - Preço de Abertura)
    return bitcoinQuote.value.price - openPrice.value;
});

const changeClass = computed(() => {
    if (bitcoinQuote.value && bitcoinQuote.value.change24h > 0) return 'text-green-500';
    if (bitcoinQuote.value && bitcoinQuote.value.change24h < 0) return 'text-red-500';
    return 'text-gray-400';
});
</script>

<template>
  <div class="w-full bg-gray-900 border border-gray-500 rounded-xl p-6 shadow-xl">
    <h2 class="text-xl font-semibold text-gray-200 mb-4 border-b border-gray-700 pb-2">₿ Bitcoin (BTC/BRL)</h2>

    <div v-if="bitcoinQuote" class="grid grid-cols-2 gap-6">
        
        <div class="p-3 border border-gray-700 rounded-lg bg-gray-800/40">
            <p class="text-sm text-gray-400">Preço Atual</p>
            <p class="text-xl font-bold text-gray-200 mt-1">
                {{ formatCurrency(bitcoinQuote.price) }}
            </p>
        </div>

        <div class="p-3 border border-gray-700 rounded-lg bg-gray-800/40">
            <p class="text-sm text-gray-400">Variação 24h (R$)</p>
            <p :class="changeClass" class="text-xl font-bold mt-1">
                {{ absoluteChange > 0 ? '+' : '' }}{{ formatCurrency(absoluteChange) }}
            </p>
        </div>
        
    </div>
    
    <div v-else class="text-center p-4 text-gray-500">
        Aguardando dados de Bitcoin...
    </div>
  </div>
</template>