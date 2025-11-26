<script setup lang="ts">
import { computed } from 'vue';
import { storeToRefs } from 'pinia';
import { useInvestmentCalculatorStore } from '@/shared/stores/InvestmentCalculatorStore';
import CurrencyInput from '@/shared/components/CurrencyInput.vue';

defineProps<{
    resetInputs: () => void;
}>();

const calculatorStore = useInvestmentCalculatorStore();

const {
    initialInvestment,
    cdiRateAnnual,
    fiiSharePrice,
    fiiMonthlyYield
} = storeToRefs(calculatorStore);

const fiiPriceModel = computed({
    get: (): number => fiiSharePrice.value,
    set: (val: number) => {
        fiiSharePrice.value = val;
    },
});

const fiiYieldModel = computed({
    get: (): number => fiiMonthlyYield.value,
    set: (val: number) => {
        fiiMonthlyYield.value = val;
    },
});
</script>

<template>
    <div class="border rounded-lg border-gray-700 p-6">
        <div class="flex justify-between items-center gap-8">
            <div class="w-full flex">
                <h2 class="text-lg font-medium text-white">Configurações Base</h2>

                <button @click="resetInputs"
                    class="py-0.5 ml-5 p-2 text-xs border border-orange-600 bg-orange-900/20 hover:bg-orange-500/50 rounded-xl text-orange-300 transition">
                    Resetar Padrão
                </button>
            </div>

            <div class="w-[40%]">
                <label class="text-sm text-gray-200">Valor investido (R$)</label>
                <CurrencyInput v-model="initialInvestment" placeholder="Ex: 10.000,00"
                    class="text-lg font-medium bg-gray-900 border border-gray-500 w-full text-white" />
            </div>
        </div>

        <div class="flex mt-8 gap-5">

            <div class="w-full ">
                <label class="text-sm font-medium text-gray-200 ">Taxa Renda Fixa (% CDI a.a.)</label>
                <CurrencyInput v-model="cdiRateAnnual" placeholder="Ex: 115,0"
                    class="w-full mt-1 bg-gray-900 border border-gray-500 text-white text-lg text-right appearance-none"
                    :decimal-places="1" />
            </div>


            <div class="w-full">
                <label class="text-sm font-medium text-gray-200">Cota FII (R$)</label>
                <CurrencyInput v-model="fiiPriceModel" placeholder="Ex: 9,90"
                    class="mt-1 text-lg bg-gray-900 border border-gray-500 w-full text-white" />
            </div>

            <div class="w-full">
                <label class="text-sm  text-gray-200">Dividendo (R$)</label>
                <CurrencyInput v-model="fiiYieldModel" placeholder="Ex: 0,10"
                    class="mt-1 text-lg bg-gray-900 border border-gray-500 w-full text-white" />
            </div>
        </div>
    </div>
</template>