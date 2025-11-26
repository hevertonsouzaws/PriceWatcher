import type { IBitcoinAnalysisResult } from '@/shared/types/Investiment';

export function calculateTargetPriceFromBtcScenario(
    initialInvestment: number,
    currentBtcPrice: number,
    targetYield: number,
    years: number,
): IBitcoinAnalysisResult {
    
    if (initialInvestment <= 0 || currentBtcPrice <= 0 || years <= 0) {
        return { yield: targetYield, yieldPercentage: 0, salePrice: currentBtcPrice };
    }

    const targetTotalValue = initialInvestment + targetYield;
    const totalGrowthFactor = targetTotalValue / initialInvestment;
    const requiredAnnualGrowth = Math.pow(totalGrowthFactor, 1 / years) - 1;
    const salePrice = currentBtcPrice * Math.pow(1 + requiredAnnualGrowth, years);

    return {
        yield: targetYield,
        yieldPercentage: requiredAnnualGrowth, 
        salePrice: salePrice,
    };
}