<script setup lang="ts">
import { ref } from 'vue';
import { formatCurrency } from '../helpers/formatHelper';

const dominance = ref({
    btc: 53.4,
    eth: 17.8,
    others: 28.8,
});

const marketVolume = ref({
    volume24hBRL: 87.5 * 10**9,
    high24h: 461000,
    low24h: 435000,
});

const activeAlerts = ref(3);

function formatLargeCurrency(value: number): string {
    const units = [' mil', ' mi', ' bi', ' tri'];
    let unitIndex = 0;
    let formattedValue = value;

    while (formattedValue >= 1000 && unitIndex < units.length - 1) {
        formattedValue /= 1000;
        unitIndex++;
    }

    return `R$ ${formattedValue.toFixed(1)}${units[unitIndex]}`;
}
</script>

<template>
  <div class="w-full bg-gray-800/50 border border-gray-700 rounded-xl p-6 shadow-lg">
    <h2 class="text-medium font-semibold text-gray-300 mb-4 border-b border-gray-700 pb-2">Métricas de Trader & Liquidez</h2>

    <div class="flex flex-wrap gap-6 justify-start">
        
        <div class="w-full md:w-1/3 min-w-[200px] p-3 border border-gray-700 rounded-lg bg-gray-900/40">
            <p class="text-sm text-gray-400 mb-1">Dominância BTC</p>
            <p class="text-xl font-bold text-gray-200">{{ dominance.btc.toFixed(2) }}%</p>
            <div class="h-1 bg-gray-700 mt-2 rounded-full">
                <div 
                    :style="{ width: dominance.btc + '%' }" 
                    class="h-1 rounded-full bg-gray-500 transition-all duration-500"
                ></div>
            </div>
            <p class="text-xs text-gray-500 mt-1">ETH: {{ dominance.eth.toFixed(1) }}%</p>
        </div>

        <div class="w-full md:w-1/3 min-w-[200px] p-3 border border-gray-700 rounded-lg bg-gray-900/40">
            <p class="text-sm text-gray-400 mb-1">Volume 24h (Mercado)</p>
            <p class="text-xl font-bold text-gray-200">{{ formatLargeCurrency(marketVolume.volume24hBRL) }}</p>
            <p class="text-xs text-gray-500 mt-2">Liquidez.</p>
        </div>
        
        <div class="w-full md:w-1/3 min-w-[200px] p-3 border border-gray-700 rounded-lg bg-gray-900/40">
            <p class="text-sm text-gray-400 mb-1">Faixa de Preço 24h</p>
            <p class="text-base text-gray-200">Máxima: {{ formatCurrency(marketVolume.high24h) }}</p>
            <p class="text-base text-gray-200">Mínima: {{ formatCurrency(marketVolume.low24h) }}</p>
        </div>

        <div class="w-full md:w-1/3 min-w-[200px] p-3 border border-gray-700 rounded-lg bg-gray-900/40">
            <p class="text-sm text-gray-400 mb-1">Metas de Preço Ativas</p>
            <p class="text-xl font-bold text-gray-200">{{ activeAlerts }} Alertas</p>
            <p class="text-xs text-gray-500 mt-2 cursor-pointer hover:underline">
                <i class="fi fi-rr-bell"></i> Gerenciar Metas
            </p>
        </div>

    </div>
  </div>
</template>