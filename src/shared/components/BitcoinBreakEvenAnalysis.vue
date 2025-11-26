<script setup lang="ts">
import { computed } from 'vue';
import { formatCurrency, formatNumberAsCurrency } from '@/shared/helpers/formatHelper';
import type { IBitcoinAnalysisResult, IBitcoinScenarioResult } from '@/shared/types/Investiment';


const props = defineProps<{
    analysisOneYear: IBitcoinAnalysisResult;
    analysisThreeYears: IBitcoinAnalysisResult;
    analysisFiveYears: IBitcoinAnalysisResult;
    neutralBitcoinResults: IBitcoinScenarioResult;
}>();

const mappedAnalysis = computed(() => {
    return [
        {
            years: 1,
            data: props.analysisOneYear,
            neutralYield: props.neutralBitcoinResults.oneYear.yield,
        },
        {
            years: 3,
            data: props.analysisThreeYears,
            neutralYield: props.neutralBitcoinResults.threeYears.yield,
        },
        {
            years: 5,
            data: props.analysisFiveYears,
            neutralYield: props.neutralBitcoinResults.fiveYears.yield,
        },
    ];
});
</script>

<template>
    <div class="border rounded-lg border-gray-700 p-6">
        <h2 class="text-xl font-medium text-white mb-2">
            Ponto de Equilíbrio do Bitcoin: Cenário Neutro
        </h2>

        <p class="text-sm text-gray-400 mb-6">
            Valorização e preço que o BTC precisa atingir para igualar o lucro no Cenário Neutro
            definido.
        </p>

        <div class="grid grid-cols-1 sm:grid-cols-3 gap-12">
            <div v-for="analysis in mappedAnalysis" :key="analysis.years"
                class="bg-gray-900 py-3 p-4 border border-gray-500 shadow-inner rounded-lg">

                <div class="mb-3 border-b border-gray-500 pb-2 flex justify-between items-center">
                    <h3 class="text-xl font-medium text-white">
                        {{ analysis.years }} Ano{{ analysis.years > 1 ? 's' : '' }}
                    </h3>

                    <span class="font-medium text-base text-orange-500">
                        <p class="text-xs text-gray-400">Lucro Alvo (R$):</p>
                        {{ formatCurrency(analysis.neutralYield) }}
                    </span>
                </div>

                <div class="mb-3">
                    <p class="text-xs text-gray-200">Valorização Mínima Necessária:</p>
                    <span class="font-medium text-xl text-gray-200 block">
                        {{
                            formatNumberAsCurrency(analysis.data.yieldPercentage, {
                                style: 'percent',
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                            })
                        }}
                    </span>
                </div>

                <div>
                    <p class="text-xs text-gray-400">Preço Mínimo de Venda do BTC:</p>
                    <span class="font-medium text-xl block text-white">
                        {{ formatCurrency(analysis.data.salePrice) }}
                    </span>
                </div>
            </div>
        </div>
    </div>
</template>