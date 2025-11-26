export interface IBitcoinAnalysisResult {
    yield: number;
    yieldPercentage: number;
    salePrice: number;
}

export interface IInvestmentResult {
    rate: number;
    price: number; 
    yield: number; 
    total: number; 
}

export interface IBitcoinScenarioResult {
    oneYear: IInvestmentResult;
    threeYears: IInvestmentResult;
    fiveYears: IInvestmentResult;
}

export interface ICdbScenarioResult {
    oneYear: IInvestmentResult;
    threeYears: IInvestmentResult;
    fiveYears: IInvestmentResult;
}