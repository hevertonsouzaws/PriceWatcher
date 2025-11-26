<script setup lang="ts">
import { ref, watch } from 'vue';
import {
    // formatNumberAsCurrency removida
    formatNumberToBRL, // Importação correta
    processCurrencyInput
} from '@/shared/helpers/formatHelper';

const model = defineModel<number>({ required: true });

// CORREÇÃO: Usando formatNumberToBRL, que formata o número com 2 casas decimais (10000.50 -> 10.000,50)
const formattedInput = ref(formatNumberToBRL(model.value)); 

watch(model, (newValue) => {
    // CORREÇÃO: A comparação de valores deve ser feita de forma mais robusta,
    // ou simplesmente formatamos o novo valor do model para atualizar o input.
    // Usando toFixed para garantir a precisão de 2 casas na comparação:
    if (newValue.toFixed(2) !== (processCurrencyInput(formattedInput.value).numericValue / 100).toFixed(2)) {
         formattedInput.value = formatNumberToBRL(newValue);
    }
});

const handleInput = (event: Event) => {
    const target = event.target as HTMLInputElement;

    const { numericValue, formattedValue } = processCurrencyInput(target.value);

    model.value = numericValue; 

    formattedInput.value = formattedValue;

    const valueLength = target.value.replace(/\D/g, '').length;
    const diff = formattedValue.length - valueLength;
    const newCursorPos = (target.selectionStart || 0) + diff;

    requestAnimationFrame(() => {
        target.setSelectionRange(newCursorPos, newCursorPos);
    });
};

const formatOnBlur = () => {
    formattedInput.value = formatNumberToBRL(model.value);
};
</script>

<template>
    <input type="text" :value="formattedInput" @input="handleInput" @blur="formatOnBlur"
        @focus="($event.target as HTMLInputElement)?.select()" inputmode="decimal"
        class="w-full p-1.5 bg-gray-900 border border-gray-700 text-gray-200 text-lg text-right rounded-md"/>
</template>