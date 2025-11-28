<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import { useInvestmentCalculatorStore } from '@/shared/stores/InvestmentCalculatorStore';
import { useMarketStore } from '../shared/stores/marketStore';
import { formatCurrency } from '@/shared/helpers/formatHelper';
import type { IInvestmentResult, IBitcoinAnalysisResult, IBitcoinScenarioResult } from '@/shared/types/Investiment';

import InvestmentSettings from '@/shared/components/InvestmentSettings.vue';
import BitcoinProjection from '@/shared/components/BitcoinProjection.vue';
import InvestmentResultsTable from '@/shared/components/InvestmentResultsTable.vue';
import BitcoinBreakEvenAnalysis from '@/shared/components/BitcoinBreakEvenAnalysis.vue';
import NewsFeed from '@/shared/components/NewsFeed.vue';
import QuoteCard from '@/shared/components/QuoteCard.vue';

const calculatorStore = useInvestmentCalculatorStore();
const marketStore = useMarketStore();
const { fetchAllMarketData } = marketStore;

const { initialInvestment } = storeToRefs(calculatorStore);
const { bitcoinQuote, isLoading, error, dollarQuote } = storeToRefs(marketStore);

marketStore.fetchAllMarketData();

onMounted(() => {
    if (!bitcoinQuote.value) {
        marketStore.fetchAllMarketData();
    }
});

const isCalculating = computed<boolean>(() => isLoading.value);
const btcPrice = computed<number>(() => bitcoinQuote.value?.price || 0);
const SIMULATION_YEARS = 5;

const fiiResults = computed<IInvestmentResult[]>(() => [
    calculatorStore.calculateFii(1),
    calculatorStore.calculateFii(3),
    calculatorStore.calculateFii(5),
]);

const cdbResults = computed<IInvestmentResult[]>(() => [
    calculatorStore.calculateCdb(1),
    calculatorStore.calculateCdb(3),
    calculatorStore.calculateCdb(5),
]);

const bitcoinScenarios = computed(() => {
    if (btcPrice.value === 0) return null;
    return calculatorStore.calculateBitcoin(btcPrice.value);
});


const bitcoinResults = computed(() => {
    if (!bitcoinScenarios.value) return null;

    return Object.entries(bitcoinScenarios.value).map(([key, scenario]) => ({
        label: key.charAt(0).toUpperCase() + key.slice(1),
        ...scenario,
    }));
});

const neutralBitcoinResults = computed<IBitcoinScenarioResult | null>(() => {
    if (!bitcoinScenarios.value) return null;
    return bitcoinScenarios.value.neutral;
});

const calculateNeutralBreakEven = (years: 1 | 3 | 5): IBitcoinAnalysisResult => {
    if (!neutralBitcoinResults.value || btcPrice.value === 0) {
        return { yield: 0, yieldPercentage: 0, salePrice: 0 } as IBitcoinAnalysisResult;
    }

    const targetYield = years === 1
        ? neutralBitcoinResults.value.oneYear.yield
        : years === 3
            ? neutralBitcoinResults.value.threeYears.yield
            : neutralBitcoinResults.value.fiveYears.yield;

    if (targetYield === 0) {
        return { yield: 0, yieldPercentage: 0, salePrice: 0 } as IBitcoinAnalysisResult;
    }

    return calculatorStore.calculateBreakEven(
        initialInvestment.value,
        btcPrice.value,
        targetYield,
        years
    ) as IBitcoinAnalysisResult;
};

const analysisOneYear = computed(() => calculateNeutralBreakEven(1));
const analysisThreeYears = computed(() => calculateNeutralBreakEven(3));
const analysisFiveYears = computed(() => calculateNeutralBreakEven(5));

const resetInputs = () => {
    calculatorStore.initialInvestment = 10000.0;
    calculatorStore.cdiRateAnnual = 11.5;
    calculatorStore.fiiSharePrice = 9.9;
    calculatorStore.fiiMonthlyYield = 0.1;
    calculatorStore.fiiTicker = 'MXRF11';
    calculatorStore.btcAnnualRatePessimist = 0.15;
    calculatorStore.btcAnnualRateNeutral = 0.25;
    calculatorStore.btcAnnualRateOptimist = 0.40;
};

const labelMap: Record<string, string> = {
    pessimist: 'Pessimista',
    neutral: 'Neutro',
    optimist: 'Otimista',
};

if (!bitcoinQuote.value && !dollarQuote.value) {
    marketStore.fetchAllMarketData();
}

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
</script>

<template>
    <div class="min-h-screen bg-slate-900 text-gray-200 sm:p-8 font-sans flex gap-8 flex-wrap xl:flex-nowrap">
        <div class="w-full rounded-lg p-4 max-h-fit">
            <header class="mb-8 flex justify-between items-center p-2 border-b rounded-lg border-orange-500">
                <div>
                    <h1 class="text-2xl font-medium text-white flex items-center">
                        <span class="text-orange-400 mr-3 text-2xl">₿</span> Calculo de possível lucro
                    </h1>
                    <p class="text-base text-gray-400 mt-1">
                        Comparação entre FII, Renda Fixa e a projeção de Bitcoin em diferentes cenários.
                    </p>
                </div>
                <button @click="fetchAllMarketData" :disabled="isCalculating"
                    class="flex items-center space-x-2 px-4 py-2 text-sm font-medium border border-orange-500 rounded-lg bg-gray-900 hover:bg-gray-950 transition duration-150 disabled:opacity-50 disabled:cursor-not-allowed">
                    <i class="fi fi-rr-refresh text-orange-500"></i><span>Atualizar Cotação BTC</span>
                </button>
            </header>

            <div class="">
                <section class="flex gap-6 justify-between">
                    <div v-if="bitcoinQuote" class="w-full">
                        <QuoteCard asset-id="BitCoin" :price="bitcoinQuote.price" :change-24h="bitcoinQuote.change24h"
                            :last-updated="bitcoinQuote.lastUpdated" />
                    </div>

                    <div v-if="dollarQuote" class="w-full">
                        <QuoteCard asset-id="Dólar" :price="dollarQuote.price" :change-24h="dollarQuote.change24h"
                            :last-updated="dollarQuote.lastUpdated" />
                    </div>


                </section>

            </div>

            <div class="flex flex-wrap xl:flex-nowrap gap-4 mt-4">
                <InvestmentSettings :reset-inputs="resetInputs" class="w-full" />

                <BitcoinProjection :btc-price="btcPrice" :simulation-years="SIMULATION_YEARS"
                    :is-loading="isCalculating" class="w-full" />
            </div>

            <BitcoinBreakEvenAnalysis v-if="neutralBitcoinResults && btcPrice > 0" :analysis-one-year="analysisOneYear"
                :analysis-three-years="analysisThreeYears" :analysis-five-years="analysisFiveYears"
                :neutral-bitcoin-results="neutralBitcoinResults" class="mt-4" />

            <InvestmentResultsTable :is-calculating="isCalculating" :cdb-results="cdbResults" :fii-results="fiiResults"
                :bitcoin-results="bitcoinResults" :cdi-rate-annual="calculatorStore.cdiRateAnnual"
                :fii-ticker="calculatorStore.fiiTicker" :btc-price="btcPrice" :label-map="labelMap" class="mt-10" />
        </div>

        <div class="border border-gray-600 w-[98%%] xl:w-[30%] rounded-lg m-auto">
            <NewsFeed />
        </div>
    </div>
</template>