<script setup lang="ts">
import { ref, watch } from 'vue';
import {
    formatNumberAsCurrency,
    processCurrencyInput
} from '@/shared/helpers/formatHelper';

const model = defineModel<number>({ required: true });

const formattedInput = ref(formatNumberAsCurrency(model.value * 100));

watch(model, (newValue) => {
    if (newValue * 100 !== processCurrencyInput(formattedInput.value).numericValue * 100) {
        formattedInput.value = formatNumberAsCurrency(newValue * 100);
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
    formattedInput.value = formatNumberAsCurrency(model.value * 100);
};
</script>

<template>
    <input type="text" :value="formattedInput" @input="handleInput" @blur="formatOnBlur"
        @focus="($event.target as HTMLInputElement)?.select()" inputmode="decimal"
        class="w-full p-2 bg-gray-900 border border-gray-700 rounded-md text-gray-200 text-lg text-right" />
</template>