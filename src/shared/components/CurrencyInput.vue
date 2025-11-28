<script setup lang="ts">
import { ref, watch } from 'vue';
import { formatNumberToBRL, processCurrencyInput } from '@/shared/helpers/formatHelper';

const model = defineModel<number>({ required: true });
const formattedInput = ref(formatNumberToBRL(model.value));

watch(model, (newValue) => {
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
        class="w-full p-1.5 bg-gray-900 border border-gray-700 text-gray-200 text-lg text-right rounded-md" />
</template>