<script setup lang="ts">
import { ref, computed } from 'vue';
import { storeToRefs } from 'pinia';
import { useMarketStore } from '../shared/stores/marketStore';
import {
    formatCurrency,
} from '../shared/helpers/formatHelper';
import CurrencyInput from '@/shared/components/CurrencyInput.vue';

const marketStore = useMarketStore();
const { bitcoinQuote } = storeToRefs(marketStore);

marketStore.fetchAllMarketData();

const entryPriceNum = ref(0);
const exitPriceNum = ref(0);
const investedAmountNum = ref(0);

const fillCurrentPrice = () => {
    if (bitcoinQuote.value && bitcoinQuote.value.price > 0) {
        entryPriceNum.value = bitcoinQuote.value.price;
        marketStore.fetchAllMarketData();
    }
};

const assetAmount = computed(() => {
    if (entryPriceNum.value <= 0 || investedAmountNum.value <= 0) return 0;
    return investedAmountNum.value / entryPriceNum.value;
});

const totalExitValue = computed(() => {
    if (exitPriceNum.value <= 0) return 0;
    return assetAmount.value * exitPriceNum.value;
});

const profitLoss = computed(() => {
    return totalExitValue.value - investedAmountNum.value;
});

const profitLossPercent = computed(() => {
    if (investedAmountNum.value <= 0) return 0;
    return (profitLoss.value / investedAmountNum.value) * 100;
});

const resultClass = computed(() => {
    if (profitLoss.value > 0) return 'text-green-500';
    if (profitLoss.value < 0) return 'text-red-500';
    return 'text-gray-400';
});
</script> 

<template>
    <div class="min-h-screen bg-gray-900 text-gray-200 p-8 font-sans">

        <div class="max-w-7xl mx-auto">

            <div class="mb-8 border-b border-gray-500 pb-4">
                <h1 class="text-3xl font-bold text-gray-100">Cálculo de Lucro (P&L) Universal</h1>
                <p class="text-gray-400 mt-1">Insira os preços de entrada e saída para calcular o lucro potencial em
                    qualquer ativo.</p>
            </div>

        </div>

        <div class="flex max-w-7xl border justify-between gap-10 p-2 border-gray-500 m-auto rounded-xl">

            <section class="gap-5 w-full">

                <div class="space-y-1">
                    <label for="invested" class="text-sm text-gray-400">Valor Investido (R$)</label>
                    <CurrencyInput v-model="investedAmountNum" placeholder="Ex: 50,00" id="invested" />
                </div>

                <div class="space-y-1 relative">
                    <label for="entryPrice" class="text-sm text-gray-400">Preço de Entrada do Ativo (R$)</label>
                    <CurrencyInput v-model="entryPriceNum" placeholder="Ex: 460.000,00" id="entryPrice" />

                    <div class="flex justify-between items-center bg-gray-900 p-1 py-2">
                        <p v-if="bitcoinQuote && bitcoinQuote.price > 0" class="text-sm text-gray-100 pt-1">
                            BTC Atual: {{ formatCurrency(bitcoinQuote.price) }}
                        </p>
                        <button @click="fillCurrentPrice" :disabled="!bitcoinQuote || bitcoinQuote.price === 0"
                            class="text-xs text-gray-100 px-2 py-1 rounded-md disabled:opacity-50 transition border border-yellow-500 hover:bg-gray-800"
                            title="Usar o preço atual de BTC/BRL">
                            Usar valor atual
                        </button>
                    </div>
                </div>

                <div class="space-y-1">
                    <label for="exitPrice" class="text-sm text-gray-400">Preço de Saída/Venda do Ativo (R$)</label>
                    <CurrencyInput v-model="exitPriceNum" placeholder="Ex: 620.000,00" id="exitPrice" />
                </div>

            </section>

            <main class="rounded-xl shadow-xl space-y-8 mt-5 w-full">

                <section class="space-y-4">
                    <h3 class="text-xl font-semibold text-gray-300">Resumo da Transação</h3>

                    <div class="flex justify-between items-center p-3 rounded-md border border-gray-700">
                        <span class="text-base text-gray-400">Quantidade Adquirida:</span>
                        <span class="text-lg font-medium">{{ assetAmount.toFixed(8) }} Unidades</span>
                    </div>

                    <div class="flex justify-between items-center p-3 rounded-md border border-gray-700">
                        <span class="text-base text-gray-400">Valor Total da Venda:</span>
                        <span class="text-lg font-medium">{{ formatCurrency(totalExitValue) }}</span>
                    </div>

                    <div class="flex justify-between items-center p-3 rounded-lg border border-gray-600 shadow-lg"
                        :class="resultClass">
                        <span class="text-base font-medium">Lucro / Perda:</span>
                        <span class="text-xl font-medium">
                            {{ formatCurrency(profitLoss) }}
                        </span>
                    </div>

                    <div class="flex justify-end pt-2">
                        <span class="text-base text-gray-400">Rendimento Percentual: </span>
                        <span :class="resultClass" class="text-base font-medium ml-2">
                            {{ profitLossPercent.toFixed(2) }}%
                        </span>
                    </div>
                </section>
            </main>
        </div>
    </div>
</template>