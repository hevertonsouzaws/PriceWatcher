const CURRENCY_SCALE = 100;

function cleanInput(value: string): number {
    return parseInt(value.replace(/\D/g, '')) || 0;
}

export function formatCurrency(value: number, locale: string = 'pt-BR', currency: string = 'BRL'): string {
    return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: currency,
    }).format(value);
}

// Corrigido para ser mais genérico, mas mantendo a necessidade de 'options'
// Esta função NÃO será usada no componente, vamos usar formatCurrency ou formatNumberToBRL.
export function formatNumberAsCurrency(value: number, options: Intl.NumberFormatOptions, locale: string = 'pt-BR'): string {
    return new Intl.NumberFormat(locale, options).format(value);
}

export function processCurrencyInput(inputValue: string): { numericValue: number; formattedValue: string } {
    let rawValue = cleanInput(inputValue);

    let text = rawValue.toString().padStart(3, '0');

    let formattedValue = text.slice(0, text.length - 2) + ',' + text.slice(text.length - 2);

    formattedValue = formattedValue.replace(/\B(?=(\d{3})+(?!\d))/g, ".");

    const numericValue = rawValue / CURRENCY_SCALE;

    return { numericValue, formattedValue };
}

export function formatNumberToBRL(value: number, decimalPlaces: number = 2): string {
    if (value === 0 || isNaN(value)) return '';

    const options = {
        minimumFractionDigits: decimalPlaces,
        maximumFractionDigits: decimalPlaces
    };

    return value.toLocaleString('pt-BR', options);
}

export function parseBRLToNumber(formattedString: string): number {
    if (!formattedString) return 0;

    let cleanedString = formattedString.replace(/\./g, '');

    cleanedString = cleanedString.replace(/,/g, '.');

    const parsedNumber = parseFloat(cleanedString);
    return isNaN(parsedNumber) ? 0 : parsedNumber;
}