<script setup lang="ts">
import { ref, computed } from 'vue';
import { storeToRefs } from 'pinia';
import { useInvestmentCalculatorStore } from '@/shared/stores/InvestmentCalculatorStore';
import { useMarketStore } from '../shared/stores/marketStore';
import CurrencyInput from '@/shared/components/CurrencyInput.vue';
import { formatCurrency, formatNumberAsCurrency } from '../shared/helpers/formatHelper';
import BitcoinAnalysis from '@/shared/components/BitcoinAnalysis.vue';


const calculatorStore = useInvestmentCalculatorStore();
const marketStore = useMarketStore();
marketStore.fetchAllMarketData();

const { initialInvestment, cdiRateAnnual, fiiSharePrice, fiiMonthlyYield, fiiTicker } = storeToRefs(calculatorStore);
const { bitcoinQuote } = storeToRefs(marketStore);

const isCalculating = computed(() => marketStore.isLoading);


const fiiPriceModel = computed({
    get: () => fiiSharePrice.value,
    set: (val: number) => { fiiSharePrice.value = val; }
});

const fiiYieldModel = computed({
    get: () => fiiMonthlyYield.value,
    set: (val: number) => { fiiMonthlyYield.value = val; }
});


const btcPrice = computed(() => bitcoinQuote.value?.price || 0);

const fiiResults = computed(() => [
    calculatorStore.calculateFii(1),
    calculatorStore.calculateFii(3),
    calculatorStore.calculateFii(5),
]);

const cdbResults = computed(() => [
    calculatorStore.calculateCdb(1),
    calculatorStore.calculateCdb(3),
    calculatorStore.calculateCdb(5),
]);

const bitcoinResults = computed(() => {
    if (btcPrice.value === 0) return null;
    return calculatorStore.calculateBitcoin(btcPrice.value);
});

const resetInputs = () => {
    initialInvestment.value = 1000.00;
    cdiRateAnnual.value = 11.5;
    fiiSharePrice.value = 9.90;
    fiiMonthlyYield.value = 0.10;
    fiiTicker.value = '';
};
</script>

<template>
    <div class="min-h-screen bg-gray-900 text-gray-200 p-8 font-sans">
        <div class="w-[90%] mx-auto">

            <header class="mb-4">
                <h1 class="text-3xl font-semibold text-gray-100">Simulador de Cenários de Investimento
                </h1>
                <p class="text-gray-400 mt-1">Comparação: lucro potencial entre FII, Renda Fixa (CDI) e Bitcoin.</p>
            </header>

            <main class="border border-gray-600 rounded-xl p-6 shadow-xl">
                <section>
                    <h2 class="text-xl font-semibold text-gray-300 mb-4 border-b border-gray-700 pb-2">Valores</h2>

                    <div class="gap-6 justify-between">

                        <div class="w-full flex justify-between gap-10">
                            <div class="w-full">
                                <label class="text-sm text-gray-400">Valor Inicial (R$)</label>
                                <CurrencyInput v-model="initialInvestment" placeholder="Ex: 10.000,00" />
                            </div>

                            <button @click="resetInputs"
                                class="w-[40%] mt-6 h-13 border border-gray-700 hover:bg-gray-600 rounded-md text-gray-200 transition">
                                Resetar valores
                            </button>
                        </div>

                        <div class="flex justify-between mt-5 gap-5">
                            <div class="">
                                <label class="text-sm text-gray-400">Taxa Renda Fixa (% a.a.)</label>
                                <input type="number" v-model.number="cdiRateAnnual"
                                    class="w-full p-3 bg-gray-900 border border-gray-700 rounded-md text-gray-200 focus:ring-gray-500 focus:border-gray-500 text-lg text-right"
                                    step="0.1" />
                                <p class="text-xs text-gray-500">Ex: 11.5 para 115% do CDI.</p>
                            </div>

                            <div class="">
                                <label class="text-sm text-gray-400">Preço Cota FII (R$)</label>
                                <CurrencyInput v-model="fiiPriceModel" placeholder="Ex: 9,90" />
                                <p class="text-xs text-gray-500">Valor unitário da cota.</p>
                            </div>

                            <div class="">
                                <label class="text-sm text-gray-400">Rendimento Mensal FII (R$)</label>
                                <CurrencyInput v-model="fiiYieldModel" placeholder="Ex: 0,10" />
                                <p class="text-xs text-gray-500">Rendimento por cota.</p>
                            </div>
                        </div>

                    </div>
                </section>

                <section class="mt-10">
                    <h2 class="text-xl font-semibold text-gray-300 mb-4 border-b border-gray-700 pb-2">Comparativo de
                        Cenários</h2>

                    <div v-if="isCalculating" class="text-center p-8 text-gray-500">
                        Buscando preço do Bitcoin...
                    </div>

                    <div v-else class="overflow-x-auto">
                        <table class="w-full text-left border-collapse">
                            <thead>
                                <tr class="bg-gray-800">
                                    <th class="p-3 font-medium text-gray-200">Ativo / Cenário</th>
                                    <th class="p-3 font-medium text-gray-200 text-center">Valor Após 1 Ano</th>
                                    <th class="p-3 font-medium text-gray-200 text-center">Valor Após 3 Anos</th>
                                    <th class="p-3 font-medium text-gray-200 text-center">Valor Após 5 Anos</th>
                                </tr>
                            </thead>
                            <tbody>

                                <tr class="bg-gray-900">
                                    <td class="p-3 font-bold text-gray-300">Renda Fixa ({{ cdiRateAnnual }}% a.a.)</td>
                                    <td v-for="(result, index) in cdbResults" :key="'cdb-' + index"
                                        class="p-3 text-center">
                                        <span class="font-semibold">{{ formatCurrency(result.total) }}</span>
                                        <span class="text-xs block text-green-400">
                                            +{{ formatCurrency(result.yield) }}
                                        </span>
                                    </td>
                                </tr>

                                <tr class="bg-gray-900 border-t border-gray-700">
                                    <td class="p-3 font-bold text-gray-300">FII ({{ fiiTicker }})</td>
                                    <td v-for="(result, index) in fiiResults" :key="'fii-' + index"
                                        class="p-3 text-center">
                                        <span class="font-semibold">{{ formatCurrency(result.total) }}</span>
                                        <span class="text-xs block text-green-400">
                                            +{{ formatCurrency(result.yield) }}
                                        </span>
                                    </td>
                                </tr>

                                <template v-if="bitcoinResults">
                                    <tr v-for="scenario in bitcoinResults" :key="scenario.label"
                                        class="border-t border-gray-700">
                                        <td class="p-3 text-sm font-medium">
                                            BTC (Cenário {{ scenario.label }})
                                            <span v-if="scenario.label === 'Neutro'"
                                                class="text-xs block text-gray-500">Preço Atual: {{
                                                    formatCurrency(btcPrice) }}</span>
                                        </td>

                                        <td class="p-3 text-center">
                                            <span class="font-semibold">{{ formatCurrency(scenario.oneYear.total)
                                                }}</span>
                                            <span class="text-xs block"
                                                :class="{ 'text-green-400': scenario.oneYear.yield > 0, 'text-red-400': scenario.oneYear.yield < 0 }">
                                                {{ scenario.oneYear.yield > 0 ? '+' : '' }}{{
                                                    formatCurrency(scenario.oneYear.yield) }}
                                            </span>
                                        </td>

                                        <td class="p-3 text-center">
                                            <span class="font-semibold">{{ formatCurrency(scenario.threeYears.total)
                                                }}</span>
                                            <span class="text-xs block"
                                                :class="{ 'text-green-400': scenario.threeYears.yield > 0, 'text-red-400': scenario.threeYears.yield < 0 }">
                                                {{ scenario.threeYears.yield > 0 ? '+' : '' }}{{
                                                    formatCurrency(scenario.threeYears.yield) }}
                                            </span>
                                        </td>

                                        <td class="p-3 text-center">
                                            <span class="font-semibold">{{ formatCurrency(scenario.fiveYears.total)
                                                }}</span>
                                            <span class="text-xs block"
                                                :class="{ 'text-green-400': scenario.fiveYears.yield > 0, 'text-red-400': scenario.fiveYears.yield < 0 }">
                                                {{ scenario.fiveYears.yield > 0 ? '+' : '' }}{{
                                                    formatCurrency(scenario.fiveYears.yield) }}
                                            </span>
                                        </td>
                                    </tr>
                                </template>
                            </tbody>
                        </table>
                    </div>
                </section>
                
                <BitcoinAnalysis 
                    v-if="!isCalculating && bitcoinResults"
                    :initial-investment="initialInvestment"
                    :bitcoin-results="bitcoinResults"
                    :btc-price="btcPrice"
                />

            </main>

        </div>


    </div>
</template>