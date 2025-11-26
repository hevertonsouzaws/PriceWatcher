import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { IInvestmentResult, IBitcoinScenarioResult, ICdbScenarioResult } from '@/shared/types/Investiment';

export const useInvestmentCalculatorStore = defineStore('investmentCalculator', () => {
    const initialInvestment = ref(1000.00);
    const fiiTicker = ref('MXRF11');
    const fiiSharePrice = ref(10.00);
    const fiiMonthlyYield = ref(0.01);

    const btcAnnualRatePessimist = ref(0.01);
    const btcAnnualRateNeutral = ref(0.05);
    const btcAnnualRateOptimist = ref(0.10);
    const cdiBaseRate = ref(0.1075);
    const cdiRateAnnual = ref(115);

    const calculateFutureBtcPrice = (
        initialPrice: number,
        annualRateDecimal: number,
        years: number,
    ): number => {
        if (initialPrice <= 0 || annualRateDecimal <= -1) return 0;
        return initialPrice * Math.pow(1 + annualRateDecimal, years);
    };

    const calculateBreakEven = (
        initialInvestment: number,
        currentBtcPrice: number,
        targetYield: number,
        years: number,
    ) => {
        if (initialInvestment <= 0 || targetYield <= 0) {
            return { yield: targetYield, yieldPercentage: 0, salePrice: currentBtcPrice };
        }
        const totalGrowthFactor = (initialInvestment + targetYield) / initialInvestment;
        const requiredAnnualGrowth = Math.pow(totalGrowthFactor, 1 / years) - 1;
        const salePrice = currentBtcPrice * Math.pow(totalGrowthFactor, 1); // Basta aplicar o fator de crescimento total no preço da cota.

        return {
            yield: targetYield,
            yieldPercentage: requiredAnnualGrowth,
            salePrice: salePrice,
        };
    };

    const calculateFii = (years: number): IInvestmentResult => {
        const totalMonths = years * 12;
        const monthlyYieldRate = fiiMonthlyYield.value / fiiSharePrice.value; // Rendimento mensal em % (DY Mensal)

        // Usa a fórmula de juros compostos para simular o reinvestimento de cotas
        const totalFactor = Math.pow(1 + monthlyYieldRate, totalMonths);
        const total = initialInvestment.value * totalFactor;

        const totalYield = total - initialInvestment.value;

        return {
            rate: totalYield / initialInvestment.value / years,
            price: initialInvestment.value,
            yield: totalYield,
            total: total,
        };
    };

    const calculateBitcoin = (currentPrice: number): { [key: string]: IBitcoinScenarioResult } => {
        const calculateScenario = (annualRateDecimal: number): IBitcoinScenarioResult => ({
            oneYear: {
                rate: annualRateDecimal,
                price: currentPrice,
                yield: calculateFutureBtcPrice(initialInvestment.value, annualRateDecimal, 1) - initialInvestment.value,
                total: calculateFutureBtcPrice(initialInvestment.value, annualRateDecimal, 1),
            },
            threeYears: {
                rate: annualRateDecimal,
                price: currentPrice,
                yield: calculateFutureBtcPrice(initialInvestment.value, annualRateDecimal, 3) - initialInvestment.value,
                total: calculateFutureBtcPrice(initialInvestment.value, annualRateDecimal, 3),
            },
            fiveYears: {
                rate: annualRateDecimal,
                price: currentPrice,
                yield: calculateFutureBtcPrice(initialInvestment.value, annualRateDecimal, 5) - initialInvestment.value,
                total: calculateFutureBtcPrice(initialInvestment.value, annualRateDecimal, 5),
            },
        });

        return {
            pessimist: calculateScenario(btcAnnualRatePessimist.value),
            neutral: calculateScenario(btcAnnualRateNeutral.value),
            optimist: calculateScenario(btcAnnualRateOptimist.value),
        };
    };

    const calculateCdb = (years: number): IInvestmentResult => {
        const cdbAnnualRateDecimal = (cdiRateAnnual.value / 100) * cdiBaseRate.value;
        const futureValueGross = initialInvestment.value * Math.pow(1 + cdbAnnualRateDecimal, years);
        const totalYieldGross = futureValueGross - initialInvestment.value;

        let irRate: number;
        if (years <= 0.5) { 
            irRate = 0.225;
        } else if (years <= 1) { 
            irRate = 0.20; 
        } else if (years <= 2) { 
            irRate = 0.175; 
        } else { 
            irRate = 0.15; 
        }

        const irValue = totalYieldGross * irRate;
        const totalYield = totalYieldGross - irValue;
        const futureValue = initialInvestment.value + totalYield;

        return {
            rate: cdbAnnualRateDecimal,
            price: initialInvestment.value,
            yield: totalYield,
            total: futureValue
        };
    };

    return {
        initialInvestment,
        fiiTicker,
        fiiSharePrice,
        fiiMonthlyYield,

        btcAnnualRatePessimist,
        btcAnnualRateNeutral,
        btcAnnualRateOptimist,
        cdiRateAnnual,

        calculateFutureBtcPrice,
        calculateBreakEven,
        calculateCdb,
        calculateFii,
        calculateBitcoin,
    };
});