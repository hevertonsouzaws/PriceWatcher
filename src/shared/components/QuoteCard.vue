<script setup lang="ts">
import { formatCurrency } from '../helpers/formatHelper';

interface QuoteProps {
    assetId: string;
    price: number;
    change24h: number;
    lastUpdated: string;
    colorClass: string;
}

const props = defineProps<QuoteProps>();

function getChangeClass(change: number) {
    if (change > 0) return 'text-green-500';
    if (change < 0) return 'text-red-500';
    return 'text-gray-400';
}
</script>

<template>
  <div class="flex-1 w-full bg-gray-900 border border-gray-700 rounded-xl p-6 shadow-lg">
    <div class="flex justify-between items-center mb-4 border-b border-gray-700 pb-2">
      <h2 class="text-medium font-semibold" :class="colorClass">{{ assetId }}</h2>
      <span class="text-sm text-gray-500">Última leitura: {{ new Date(props.lastUpdated).toLocaleTimeString('pt-BR') }}</span>
    </div>

    <div class="mb-4">
      <p class="text-3xl font-extrabold text-gray-100">
        {{ formatCurrency(props.price) }}
      </p>
    </div>
    
    <p class="text-sm border-t border-gray-700 pt-3">
      Variação 24h: 
      <span :class="getChangeClass(props.change24h)" class="font-bold ml-1">
        {{ props.change24h.toFixed(2) }}%
      </span>
    </p>
  </div>
</template>