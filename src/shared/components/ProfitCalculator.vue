<script setup lang="ts">
import { ref, computed } from 'vue';
import { formatCurrency } from '../helpers/formatHelper';

const buyPriceNum = ref(0);
const sellPriceNum = ref(0);
const amountBRLNum = ref(1000);

function formatToBRL(value: number): string {
    if (value === 0 || isNaN(value)) return '';

    const options = { minimumFractionDigits: 2, maximumFractionDigits: 2 };
    return value.toLocaleString('pt-BR', options);
}

function parseFromBRL(formattedString: string): number {
    if (!formattedString) return 0;

    let cleanedString = formattedString.replace(/\./g, '');
    cleanedString = cleanedString.replace(/,/g, '.');

    const parsedNumber = parseFloat(cleanedString);
    return isNaN(parsedNumber) ? 0 : parsedNumber;
}

const amountBRLModel = computed({
    get: () => formatToBRL(amountBRLNum.value),
    set: (val) => {
        amountBRLNum.value = parseFromBRL(val);
    }
});

const buyPriceModel = computed({
    get: () => formatToBRL(buyPriceNum.value),
    set: (val) => {
        buyPriceNum.value = parseFromBRL(val);
    }
});

const sellPriceModel = computed({
    get: () => formatToBRL(sellPriceNum.value),
    set: (val) => {
        sellPriceNum.value = parseFromBRL(val);
    }
});

const btcAmount = computed(() => {
    if (buyPriceNum.value <= 0) return 0;
    return amountBRLNum.value / buyPriceNum.value;
});

const totalSellValue = computed(() => {
    if (sellPriceNum.value <= 0) return 0;
    return btcAmount.value * sellPriceNum.value;
});

const profitLoss = computed(() => {
    return totalSellValue.value - amountBRLNum.value;
});

const resultClass = computed(() => {
    if (profitLoss.value > 0) return 'text-green-500';
    if (profitLoss.value < 0) return 'text-red-500';
    return 'text-gray-200';
});
</script>

<template>
    <div class="w-full bg-gray-800/50 border border-gray-700 rounded-xl p-6 shadow-lg">
        <h2 class="text-medium font-semibold text-gray-300 mb-4 border-b border-gray-700 pb-2">Calculadora de Lucro
            (P&L)</h2>

        <div class="flex flex-wrap gap-6 mb-6">

            <div class="flex-1 min-w-[200px] space-y-1">
                <label for="amount" class="text-sm text-gray-400">Valor Investido (R$)</label>
                <input id="amount" type="text" v-model="amountBRLModel" placeholder="Ex: 1.000,00"
                    class="w-full p-2 bg-gray-900 border border-gray-700 rounded-md text-gray-200 focus:ring-gray-500 focus:border-gray-500 text-base" />
            </div>

            <div class="flex-1 min-w-[200px] space-y-1">
                <label for="buyPrice" class="text-sm text-gray-400">Preço de Compra (BTC/BRL)</label>
                <input id="buyPrice" type="text" v-model="buyPriceModel" placeholder="Ex: 450.000,00"
                    class="w-full p-2 bg-gray-900 border border-gray-700 rounded-md text-gray-200 focus:ring-gray-500 focus:border-gray-500 text-base" />
            </div>

            <div class="flex-1 min-w-[200px] space-y-1">
                <label for="sellPrice" class="text-sm text-gray-400">Preço de Venda (BTC/BRL)</label>
                <input id="sellPrice" type="text" v-model="sellPriceModel" placeholder="Ex: 470.000,00"
                    class="w-full p-2 bg-gray-900 border border-gray-700 rounded-md text-gray-200 focus:ring-gray-500 focus:border-gray-500 text-base" />
            </div>
        </div>

        <div class="pt-4 border-t border-gray-700">
            <div class="flex justify-between items-center mb-1">
                <span class="text-sm text-gray-400">BTC Adquirido:</span>
                <span class="text-base text-gray-200 font-medium">{{ btcAmount.toFixed(8) }} BTC</span>
            </div>
            <div class="flex justify-between items-center mb-1">
                <span class="text-sm text-gray-400">Valor de Venda Total:</span>
                <span class="text-base text-gray-200 font-medium">{{ formatCurrency(totalSellValue) }}</span>
            </div>
            <div class="flex justify-between items-center mt-3 p-2 border border-gray-600 rounded-md"
                :class="resultClass">
                <span class="text-base font-bold">LUCRO / PREJUÍZO (Rendimento):</span>
                <span class="text-base font-extrabold">{{ formatCurrency(profitLoss) }}</span>
            </div>
        </div>
    </div>
</template>