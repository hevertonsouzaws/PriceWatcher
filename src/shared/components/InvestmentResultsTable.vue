<script setup lang="ts">
import { formatCurrency } from '@/shared/helpers/formatHelper';
import type { IInvestmentResult } from '@/shared/types/Investiment';


defineProps<{
    isCalculating: boolean;
    cdbResults: IInvestmentResult[];
    fiiResults: IInvestmentResult[];

    bitcoinResults: {
        label: string;
        oneYear: IInvestmentResult;
        threeYears: IInvestmentResult;
        fiveYears: IInvestmentResult;
    }[] | null;

    cdiRateAnnual: number;
    fiiTicker: string;
    btcPrice: number;
    labelMap: Record<string, string>;
}>();
</script>

<template>
    <div class="">

        <div v-if="isCalculating" class="text-center p-12 text-gray-600">
            Calculando cenários e projeções...
        </div>

        <div v-else class="overflow-x-auto">
            <table class="w-full text-left text-sm ">
                <thead>
                    <tr class="bg-gray-900">
                        <th class="p-3 font-medium border-b border-r border-orange-400">
                            Ativo / Cenário
                        </th>
                        <th class="p-3 font-medium text-center w-1/4 border-b border-r border-gray-400">
                            1 Ano
                        </th>
                        <th class="p-3 font-medium text-center w-1/4 border-b border-r border-gray-400">
                            3 Anos
                        </th>
                        <th class="p-3 font-medium text-center w-1/4 border-b border-r border-gray-400">
                            5 Anos
                        </th>
                    </tr>
                </thead>

                <tbody>
                    <tr class="bg-gray-900 border-b border-gray-600 hover:bg-gray-800 transition">
                        <td class="p-3 font-medium text-gray-200 border border-gray-600">
                            Renda Fixa ({{ cdiRateAnnual }}% CDI)
                        </td>
                        <td v-for="(result, index) in cdbResults" :key="'cdb-' + index"
                            class="py-2 p-3 text-center border border-gray-600">
                            <span class="font-medium block text-sm text-white">{{
                                formatCurrency(result.total)
                                }}</span>
                            <span class="text-xs text-orange-400 font-medium">
                                +{{ formatCurrency(result.yield) }}
                            </span>
                        </td>
                    </tr>

                    <tr class="bg-gray-900 border-b border-gray-600 hover:bg-gray-800 transition">
                        <td class="p-3 font-medium text-gray-200 border border-gray-600">
                            FII
                        </td>
                        <td v-for="(result, index) in fiiResults" :key="'fii-' + index"
                            class="p-2 text-center border border-gray-600">
                            <span class="font-medium block text-sm text-white">{{
                                formatCurrency(result.total)
                                }}</span>
                            <span class="text-xs text-orange-400 font-medium">
                                +{{ formatCurrency(result.yield) }}
                            </span>
                        </td>
                    </tr>

                    <template v-if="bitcoinResults">
                        <tr v-for="(scenario, index) in bitcoinResults" :key="scenario.label"
                            class="bg-gray-900 border-b border-gray-600/50 hover:bg-gray-800 transition">
                            <td class="py-1 p-3 text-sm font-medium text-white border border-gray-600">
                                BTC Cenário {{
                                    labelMap[scenario.label.toLowerCase()] || scenario.label
                                }}
                                <span v-if="scenario.label.toLowerCase() === 'neutral'"
                                    class="text-xs block text-orange-200">atual: {{ formatCurrency(btcPrice) }}</span>
                            </td>

                            <td v-for="(yearResult, year) in [
                                scenario.oneYear,
                                scenario.threeYears,
                                scenario.fiveYears,
                            ]" :key="year" class="py-2 p-3 text-center border border-gray-600">
                                <span class="font-medium block text-sm text-white">{{
                                    formatCurrency(yearResult.total)
                                    }}</span>

                                <span class="text-xs block font-medium" :class="{
                                    'text-orange-400': yearResult.yield >= 0,
                                    'text-red-400': yearResult.yield < 0,
                                }">
                                    {{ yearResult.yield >= 0 ? '+' : '' }}{{ formatCurrency(yearResult.yield) }}
                                </span>
                            </td>
                        </tr>
                    </template>
                </tbody>
            </table>
        </div>
    </div>
</template>