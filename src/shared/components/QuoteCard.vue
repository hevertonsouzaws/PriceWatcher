<script setup lang="ts">
import { formatCurrency } from '../helpers/formatHelper';

interface QuoteProps {
  assetId: string;
  price: number;
  change24h: number;
  lastUpdated: string;
}

const props = defineProps<QuoteProps>();

function getChangeClass(change: number) {
  if (change > 0) return ['text-green-400', 'border-t-green-800', 'fi-rr-arrow-trend-up'];
  if (change < 0) return ['text-red-400', 'border-b-red-600', 'fi-rr-arrow-trend-down'];
  return ['text-gray-400', '', 'fi-rr-minus'];
}

function getChangeIcon(change: number) {
  const classes = getChangeClass(change);
  return classes[2];
}

function getChangeColorAndBorder(change: number) {
  const classes = getChangeClass(change);
  return `${classes[0]} ${classes[1]}`;
}

</script>

<template>
  <div class="flex-1 w-full bg-slate-900 border border-gray-700 rounded-xl p-4 shadow-lg"
    :class="getChangeColorAndBorder(props.change24h)">

    <div class="flex justify-between items-center mb-4 border-b border-gray-700 pb-2 rounded"
      :class="getChangeColorAndBorder(props.change24h)">
      <h2 class="text-sm font-medium text-gray-200">{{ assetId }}</h2>
      <span class="text-sm text-gray-200">Última leitura: {{ new Date(props.lastUpdated).toLocaleTimeString('pt-BR')
      }}</span>
    </div>

    <div class="flex justify-between items-center">
      <div class="">
        <p class="text-xs text-gray-200 pb-2">
          Variação 24h:
        </p>

        <i :class="[getChangeIcon(props.change24h), getChangeColorAndBorder(props.change24h)]"
          class="py-1 p-2 rounded-full bg-black"></i>

        <span :class="getChangeColorAndBorder(props.change24h)" class="font-medium ml-2">
          {{ props.change24h.toFixed(2) }}%
        </span>

      </div>
      <p class="text-2xl font-semibold text-gray-200">
        {{ formatCurrency(props.price) }}
      </p>
    </div>
  </div>
</template>