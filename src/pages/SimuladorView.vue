<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import { useInvestmentCalculatorStore } from '@/shared/stores/InvestmentCalculatorStore';
import { useMarketStore } from '../shared/stores/marketStore';
import type { IInvestmentResult, IBitcoinAnalysisResult, IBitcoinScenarioResult } from '@/shared/types/Investiment';

import InvestmentSettings from '@/shared/components/InvestmentSettings.vue';
import BitcoinProjection from '@/shared/components/BitcoinProjection.vue';
import InvestmentResultsTable from '@/shared/components/InvestmentResultsTable.vue';
import BitcoinBreakEvenAnalysis from '@/shared/components/BitcoinBreakEvenAnalysis.vue';
import NewsFeed from '@/shared/components/NewsFeed.vue';

const calculatorStore = useInvestmentCalculatorStore();
const marketStore = useMarketStore();
const { fetchAllMarketData } = marketStore;

const { initialInvestment, cdiRateAnnual, fiiTicker } = storeToRefs(calculatorStore);
const { bitcoinQuote, isLoading } = storeToRefs(marketStore);

marketStore.fetchAllMarketData();

onMounted(() => {
    if (!bitcoinQuote.value) {
        marketStore.fetchAllMarketData();
    }
});

const isCalculating = computed<boolean>(() => isLoading.value);
const btcPrice = computed<number>(() => bitcoinQuote.value?.price || 0);
const SIMULATION_YEARS = 5;

// --- Resultados de Investimento ---

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

// --- NOVO CÁLCULO PARA O PONTO DE EQUILÍBRIO (BREAK-EVEN) ---

// Função que calcula a taxa e o preço necessário para atingir o lucro do CENÁRIO NEUTRO do BTC.
const calculateNeutralBreakEven = (years: 1 | 3 | 5): IBitcoinAnalysisResult => {
    if (!neutralBitcoinResults.value || btcPrice.value === 0) {
        return { yield: 0, yieldPercentage: 0, salePrice: 0 } as IBitcoinAnalysisResult;
    }
    
    // Define o lucro alvo como o lucro já projetado no cenário neutro para o período 'years'.
    const targetYield = years === 1
        ? neutralBitcoinResults.value.oneYear.yield
        : years === 3
        ? neutralBitcoinResults.value.threeYears.yield
        : neutralBitcoinResults.value.fiveYears.yield;

    // Se o lucro alvo for zero (ex: investimento inicial=0), retorna zero.
    if (targetYield === 0) {
        return { yield: 0, yieldPercentage: 0, salePrice: 0 } as IBitcoinAnalysisResult;
    }
    
    // Chama a função calculateBreakEven do store (que calcula a taxa e o preço necessário)
    // O targetYield já está no formato correto.
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

// --- Funções Auxiliares ---

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
</script>

<template>
    <div class="min-h-screen bg-slate-900 text-gray-200 sm:p-8 font-sans flex gap-8">
        <div class="w-full rounded-lg p-4 max-h-fit">
            <header
                class="mb-8 flex justify-between items-center p-2 border-b rounded-lg border-orange-500">
                <div>
                    <h1 class="text-2xl font-medium text-white flex items-center">
                        <span class="text-orange-400 mr-3 text-2xl">₿</span> Calculo de possível lucro
                    </h1>
                    <p class="text-base text-gray-400 mt-1">
                        Comparação entre FII, Renda Fixa e a projeção de Bitcoin em diferentes cenários.
                    </p>
                </div>
                <button @click="fetchAllMarketData" :disabled="isCalculating"
                    class="flex items-center space-x-2 px-4 py-2 text-sm font-medium border border-orange-800 rounded-lg bg-gray-900 hover:bg-gray-950 transition duration-150 disabled:opacity-50 disabled:cursor-not-allowed">
                    <i class="fi fi-rr-refresh text-orange-500"></i><span>Atualizar Cotação BTC</span>
                </button>
            </header>

            <div class="flex gap-10">
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

        <div class="border border-gray-500 w-[35%] rounded-lg">
            <NewsFeed />
        </div>
    </div>
</template>