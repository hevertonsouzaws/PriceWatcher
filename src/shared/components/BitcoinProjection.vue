<script setup lang="ts">
import { computed } from 'vue';
import { storeToRefs } from 'pinia';
import { useInvestmentCalculatorStore } from '@/shared/stores/InvestmentCalculatorStore';
import { formatCurrency } from '@/shared/helpers/formatHelper';

const props = defineProps<{
    btcPrice: number;
    simulationYears: number;
    isLoading: boolean;
}>();

const calculatorStore = useInvestmentCalculatorStore();
const { btcAnnualRatePessimist, btcAnnualRateNeutral, btcAnnualRateOptimist } = storeToRefs(calculatorStore);

const labelMap: Record<string, string> = {
    pessimist: 'Pessimista',
    neutral: 'Neutro',
    optimist: 'Otimista',
};

const optimistRateInput = computed({
    get: (): number => btcAnnualRateOptimist.value * 100,
    set: (val: number) => {
        btcAnnualRateOptimist.value = val / 100;
    },
});
const neutralRateInput = computed({
    get: (): number => btcAnnualRateNeutral.value * 100,
    set: (val: number) => {
        btcAnnualRateNeutral.value = val / 100;
    },
});
const pessimistRateInput = computed({
    get: (): number => btcAnnualRatePessimist.value * 100,
    set: (val: number) => {
        btcAnnualRatePessimist.value = val / 100;
    },
});

const futurePricePessimist = computed(() =>
    calculatorStore.calculateFutureBtcPrice(
        props.btcPrice,
        btcAnnualRatePessimist.value,
        props.simulationYears,
    ),
);
const futurePriceNeutral = computed(() =>
    calculatorStore.calculateFutureBtcPrice(
        props.btcPrice,
        btcAnnualRateNeutral.value,
        props.simulationYears,
    ),
);
const futurePriceOptimist = computed(() =>
    calculatorStore.calculateFutureBtcPrice(
        props.btcPrice,
        btcAnnualRateOptimist.value,
        props.simulationYears,
    ),
);

const projectionMap = computed(() => ({
    pessimist: {
        model: pessimistRateInput,
        price: futurePricePessimist,
    },
    neutral: {
        model: neutralRateInput,
        price: futurePriceNeutral,
    },
    optimist: {
        model: optimistRateInput,
        price: futurePriceOptimist,
    },
}));

const projectionKeys = ['pessimist', 'neutral', 'optimist'] as const;
</script>

<template>
    <div class="border rounded-lg border-gray-700 p-6">
        <h2 class="text-lg font-medium text-white mb-1">Projeção Bitcoin (CAGR % a.a.)</h2>

        <p class="text-sm text-gray-400 mb-5">
            Defina o crescimento anual esperado. BTC atual:
            <span class="text-orange-400">{{ formatCurrency(btcPrice) }}</span>
        </p>

        <div v-if="btcPrice > 0" class="grid grid-cols-3 gap-4">
            <div v-for="label in projectionKeys" :key="label" class="p-3 border rounded-md bg-gray-900 border-gray-500">
                <label class="text-xs font-medium text-gray-300 block mb-1">
                    {{ labelMap[label] }} (% a.a.)
                </label>

                <input type="text" v-model.number="projectionMap[label].model.value"
                    class="w-full p-1.5 bg-gray-900 border rounded-md border-gray-500 text-white text-base font-medium text-right appearance-none"
                    step="1" />

                <p class="text-[10px] text-gray-400 mt-2">Preço em {{ simulationYears }} anos:</p>

                <p class="text-lg font-medium mt-0" :class="{
                    'text-white': label === 'pessimist',
                    'text-gray-200': label === 'neutral',
                    'text-gray-100': label === 'optimist',
                }">
                    {{ formatCurrency(projectionMap[label].price.value) }}
                </p>
            </div>
        </div>

        <div v-else class="text-center p-8 text-gray-500 text-sm">
            Carregando cotação de Bitcoin...
        </div>
    </div>
</template>