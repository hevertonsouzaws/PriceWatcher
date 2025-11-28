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

    return currentPrice / (1 + change);
});

const absoluteChange = computed(() => {
    if (!bitcoinQuote.value) return 0;

    return bitcoinQuote.value.price - openPrice.value;
});

const changeClass = computed(() => {
    if (bitcoinQuote.value && bitcoinQuote.value.change24h > 0) return ['text-green-500', 'border-green-600'];
    if (bitcoinQuote.value && bitcoinQuote.value.change24h < 0) return ['text-red-500', 'border-red-700'];
    return 'text-gray-200';
});
</script>

<template>
    <div class="w-full bg-slate-900 rounded-xl">
        <div v-if="bitcoinQuote" class="flex justify-between gap-6">

            <div class="p-4 w-full border border-gray-600 rounded-lg">
                <p class="text-sm text-orange-400">Preço Atual</p>
                <p class="text-xl font-bold text-white mt-1">
                    {{ formatCurrency(bitcoinQuote.price) }}
                </p>
            </div>

            <div class="p-4 border rounded-lg w-full" :class="changeClass">
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