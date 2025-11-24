import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const useInvestmentCalculatorStore = defineStore('investmentCalculator', () => {
    
    // --- Inputs do Usuário (em BRL) ---
    const initialInvestment = ref(10000.00); 

    // --- Inputs Renda Fixa (CDI) ---
    const cdiRateAnnual = ref(11.5); 

    // --- Inputs Fundo Imobiliário (FII) ---
    const fiiTicker = ref('MXRF11'); // Ticker para rastreio
    const fiiSharePrice = ref(9.90); 
    const fiiMonthlyYield = ref(0.10); 
    
    // --- Funções de Cálculo ---

    const calculateFii = (years: number) => {
        const months = years * 12;
        const shares = initialInvestment.value / fiiSharePrice.value;
        const totalYield = shares * fiiMonthlyYield.value * months;
        const totalValue = initialInvestment.value + totalYield;

        return {
            initial: initialInvestment.value,
            yield: totalYield,
            total: totalValue,
        };
    };

    const calculateCdb = (years: number) => {
        const rateDecimal = (cdiRateAnnual.value / 100);
        const totalValue = initialInvestment.value * Math.pow((1 + rateDecimal), years);
        const totalYield = totalValue - initialInvestment.value;

        return {
            initial: initialInvestment.value,
            yield: totalYield,
            total: totalValue,
        };
    };
    
    const bitcoinScenarios = [
        { label: 'Pessimista', y1: 0.15, y3: 0.50, y5: 1.50 }, // 15%, 50%, 150%
        { label: 'Neutro', y1: 0.30, y3: 1.00, y5: 3.00 },   // 30%, 100%, 300%
        { label: 'Otimista', y1: 0.75, y3: 2.00, y5: 5.00 }, // 75%, 200%, 500%
    ];

    const calculateBitcoin = (initialBtcPrice: number) => {
        
        return bitcoinScenarios.map(scenario => {
            
            const calculateScenario = (rate: number) => {
                const totalValue = initialInvestment.value * (1 + rate);
                return {
                    initial: initialInvestment.value,
                    yield: totalValue - initialInvestment.value,
                    total: totalValue,
                };
            };

            return {
                label: scenario.label,
                oneYear: calculateScenario(scenario.y1),
                threeYears: calculateScenario(scenario.y3),
                fiveYears: calculateScenario(scenario.y5),
            };
        });
    };

    return {
        initialInvestment,
        cdiRateAnnual,
        fiiTicker,
        fiiSharePrice,
        fiiMonthlyYield,
        calculateFii,
        calculateCdb,
        calculateBitcoin,
        bitcoinScenarios
    };
});