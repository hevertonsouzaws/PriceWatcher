<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import { useInvestmentCalculatorStore } from '@/shared/stores/InvestmentCalculatorStore';
import CurrencyInput from '@/shared/components/CurrencyInput.vue';
import { formatCurrency } from '../helpers/formatHelper';
import { useMarketStore } from '../stores/marketStore';

const calculatorStore = useInvestmentCalculatorStore();
const marketStore = useMarketStore();

onMounted(() => {
    marketStore.fetchAllMarketData();
});

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
    const results = calculatorStore.calculateBitcoin(btcPrice.value);

    return [
        { label: 'Pessimista', ...results.pessimist },
        { label: 'Neutro', ...results.neutral },
        { label: 'Otimista', ...results.optimist },
    ];
});

const neutralAnalysis = computed(() => {
    if (!cdbResults.value || btcPrice.value <= 0 || initialInvestment.value <= 0) {
        return null;
    }

    const periods = [1, 3, 5];
    const results: any = {};

    periods.forEach((years, index) => {
        const cdbResult = cdbResults.value[index];
        const targetYield = cdbResult ? cdbResult.yield : 0;

        const analysisResult = calculatorStore.calculateBreakEven(
            initialInvestment.value,
            btcPrice.value,
            targetYield,
            years
        );

        const key = years === 1 ? 'oneYear' : years === 3 ? 'threeYears' : 'fiveYears';

        results[key] = {
            requiredPrice: analysisResult.salePrice,
            requiredChange: analysisResult.salePrice - btcPrice.value,
            investmentRequiredYieldPercent: analysisResult.yieldPercentage * 100,
            projectedYield: targetYield,
        };
    });

    return results;
});

const resetInputs = () => {
    initialInvestment.value = 1000.00;
    cdiRateAnnual.value = 115;
    fiiSharePrice.value = 10.00;
    fiiMonthlyYield.value = 0.01;
    fiiTicker.value = 'MXRF11';
};
</script>

<template>
    <div class="min-h-screen bg-gray-900 text-gray-200 p-8 font-sans">
        <div class="w-[90%] mx-auto">

            <header class="mb-4">
                <h1 class="text-3xl font-semibold text-gray-100">Simulador de Cenários de Investimento</h1>
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
                                <label class="text-sm text-gray-400">Taxa Renda Fixa (% do CDI)</label>
                                <input type="number" v-model.number="cdiRateAnnual"
                                    class="w-full p-3 bg-gray-900 border border-gray-700 rounded-md text-gray-200 focus:ring-gray-500 focus:border-gray-500 text-lg text-right"
                                    step="0.1" />
                                <p class="text-xs text-gray-500">Ex: 115 para 115% do CDI.</p>
                            </div>

                            <div class="">
                                <label class="text-sm text-gray-400">Preço Cota FII (R$)</label>
                                <CurrencyInput v-model="fiiPriceModel" placeholder="Ex: 9,90" />
                                <p class="text-xs text-gray-500">Valor unitário da cota.</p>
                            </div>

                            <div class="w-[30%]">
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
                                    <td class="p-3 font-bold text-gray-300">Renda Fixa ({{ cdiRateAnnual }}% CDI)</td>
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

                <div v-if="!isCalculating && neutralAnalysis"
                    class="bg-gray-900 border border-gray-700 rounded-xl p-6 mt-8">
                    <h3 class="text-xl font-semibold text-gray-200 mb-6 border-b border-gray-800 pb-2">
                        Análise Reativa: Variação Necessária do Bitcoin (Igualar CDB)
                    </h3>

                    <p class="text-sm text-gray-400 mb-4">
                        Com base no preço atual de **{{ formatCurrency(btcPrice) }}** e no seu investimento de **{{
                            formatCurrency(initialInvestment) }}**,
                        veja a valorização anual composta (CAGR) e preço final do BTC para atingir os lucros projetados
                        da
                        **Renda Fixa** ({{ cdiRateAnnual }}% CDI).
                    </p>

                    <div class="overflow-x-auto">
                        <table v-if="neutralAnalysis" class="w-full text-left border-collapse">
                            <thead>
                                <tr class="bg-gray-800">
                                    <th class="p-3 font-medium text-gray-200">Período</th>
                                    <th class="p-3 font-medium text-gray-200 text-center">1 Ano</th>
                                    <th class="p-3 font-medium text-gray-200 text-center">3 Anos</th>
                                    <th class="p-3 font-medium text-gray-200 text-center">5 Anos</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr class="bg-gray-900 border-t border-gray-700">
                                    <td class="p-3 font-bold text-gray-300">Lucro Alvo (R$)</td>
                                    <td class="p-3 text-center text-green-400 font-semibold">{{
                                        formatCurrency(neutralAnalysis.oneYear.projectedYield) }}</td>
                                    <td class="p-3 text-center text-green-400 font-semibold">{{
                                        formatCurrency(neutralAnalysis.threeYears.projectedYield) }}</td>
                                    <td class="p-3 text-center text-green-400 font-semibold">{{
                                        formatCurrency(neutralAnalysis.fiveYears.projectedYield) }}</td>
                                </tr>

                                <tr class="bg-gray-800 border-t border-gray-700">
                                    <td class="p-3 font-bold text-gray-300">Taxa CAGR Necessária (% a.a.)</td>
                                    <td class="p-3 text-center text-green-400 font-bold">{{
                                        neutralAnalysis.oneYear.investmentRequiredYieldPercent.toFixed(2) }}%</td>
                                    <td class="p-3 text-center text-green-400 font-bold">{{
                                        neutralAnalysis.threeYears.investmentRequiredYieldPercent.toFixed(2) }}%</td>
                                    <td class="p-3 text-center text-green-400 font-bold">{{
                                        neutralAnalysis.fiveYears.investmentRequiredYieldPercent.toFixed(2) }}%</td>
                                </tr>

                                <tr class="bg-gray-900 border-t border-gray-700">
                                    <td class="p-3 font-bold text-gray-300">Preço Final do BTC (R$)</td>
                                    <td class="p-3 text-center font-semibold text-gray-200">{{
                                        formatCurrency(neutralAnalysis.oneYear.requiredPrice) }}</td>
                                    <td class="p-3 text-center font-semibold text-gray-200">{{
                                        formatCurrency(neutralAnalysis.threeYears.requiredPrice) }}</td>
                                    <td class="p-3 text-center font-semibold text-gray-200">{{
                                        formatCurrency(neutralAnalysis.fiveYears.requiredPrice) }}</td>
                                </tr>

                                <tr class="bg-gray-800 border-t border-gray-700">
                                    <td class="p-3 font-bold text-gray-300">Variação Absoluta Necessária (R$)</td>
                                    <td class="p-3 text-center font-semibold text-green-400">{{
                                        formatCurrency(neutralAnalysis.oneYear.requiredChange) }}</td>
                                    <td class="p-3 text-center font-semibold text-green-400">{{
                                        formatCurrency(neutralAnalysis.threeYears.requiredChange) }}</td>
                                    <td class="p-3 text-center font-semibold text-green-400">{{
                                        formatCurrency(neutralAnalysis.fiveYears.requiredChange) }}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                <p v-else-if="!isCalculating" class="text-center text-gray-500 p-4">Aguardando dados de preço do Bitcoin
                    ou valor de
                    investimento.</p>
            </main>
        </div>
    </div>
</template>