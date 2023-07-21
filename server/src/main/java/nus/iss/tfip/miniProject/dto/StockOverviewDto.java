package nus.iss.tfip.miniProject.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

//Stock overview DTO to match alphavantage
public class StockOverviewDto {

    @JsonProperty("Name")
    private String Name;

    @JsonProperty("Description")
    private String Description;

    @JsonProperty("Symbol")
    private String Symbol;

    @JsonProperty("Exchange")
    private String Exchange;

    @JsonProperty("Currency")
    private String Currency;

    @JsonProperty("Country")
    private String Country;

    @JsonProperty("Sector")
    private String Sector;

    @JsonProperty("Industry")
    private String Industry;

    @JsonProperty("ProfitMargin")
    private String ProfitMargin;

    @JsonProperty("OperatingMarginTTM")
    private String OperatingMarginTTM;

    @JsonProperty("ReturnOnAssetsTTM")
    private String ReturnOnAssetsTTM;

    @JsonProperty("ReturnOnEquityTTM")
    private String ReturnOnEquityTTM;

    @JsonProperty("QuarterlyEarningsGrowthYOY")
    private String QuarterlyEarningsGrowthYOY;

    @JsonProperty("QuarterlyRevenueGrowthYOY")
    private String QuarterlyRevenueGrowthYOY;

    @JsonProperty("TrailingPE")
    private String TrailingPE;

    @JsonProperty("ForwardPE")
    private String ForwardPE;

    @JsonProperty("PEGRatio")
    private String PEGRatio;

    @JsonProperty("DividendYield")
    private String DividendYield;

    @JsonProperty("ExDividendDate")
    private String ExDividendDate;

    @JsonProperty("PriceToBookRatio")
    private String PriceToBookRatio;

    @JsonProperty("PriceToSalesRatioTTM")
    private String PriceToSalesRatioTTM;

    @JsonProperty("AnalystTargetPrice")
    private String AnalystTargetPrice;

    @JsonProperty("52WeekHigh")
    private String fiftyTwoWeekHigh;

    @JsonProperty("52WeekLow")
    private String fiftyTwoWeekLow;

    @JsonProperty("50DayMovingAverage")
    private String fiftyDayMovingAverage;

    @JsonProperty("200DayMovingAverage")
    private String twoHundredDayMovingAverage;

    @JsonProperty("Beta")
    private String Beta;

    public String getName() {
        return Name;
    }

    public void setName(String name) {
        Name = name;
    }

    public String getDescription() {
        return Description;
    }

    public void setDescription(String description) {
        Description = description;
    }

    public String getSymbol() {
        return Symbol;
    }

    public void setSymbol(String symbol) {
        Symbol = symbol;
    }

    public String getExchange() {
        return Exchange;
    }

    public void setExchange(String exchange) {
        Exchange = exchange;
    }

    public String getCurrency() {
        return Currency;
    }

    public void setCurrency(String currency) {
        Currency = currency;
    }

    public String getCountry() {
        return Country;
    }

    public void setCountry(String country) {
        Country = country;
    }

    public String getSector() {
        return Sector;
    }

    public void setSector(String sector) {
        Sector = sector;
    }

    public String getIndustry() {
        return Industry;
    }

    public void setIndustry(String industry) {
        Industry = industry;
    }

    public String getProfitMargin() {
        return ProfitMargin;
    }

    public void setProfitMargin(String profitMargin) {
        ProfitMargin = profitMargin;
    }

    public String getOperatingMarginTTM() {
        return OperatingMarginTTM;
    }

    public void setOperatingMarginTTM(String operatingMarginTTM) {
        OperatingMarginTTM = operatingMarginTTM;
    }

    public String getReturnOnAssetsTTM() {
        return ReturnOnAssetsTTM;
    }

    public void setReturnOnAssetsTTM(String returnOnAssetsTTM) {
        ReturnOnAssetsTTM = returnOnAssetsTTM;
    }

    public String getReturnOnEquityTTM() {
        return ReturnOnEquityTTM;
    }

    public void setReturnOnEquityTTM(String returnOnEquityTTM) {
        ReturnOnEquityTTM = returnOnEquityTTM;
    }

    public String getQuarterlyEarningsGrowthYOY() {
        return QuarterlyEarningsGrowthYOY;
    }

    public void setQuarterlyEarningsGrowthYOY(String quarterlyEarningsGrowthYOY) {
        QuarterlyEarningsGrowthYOY = quarterlyEarningsGrowthYOY;
    }

    public String getQuarterlyRevenueGrowthYOY() {
        return QuarterlyRevenueGrowthYOY;
    }

    public void setQuarterlyRevenueGrowthYOY(String quarterlyRevenueGrowthYOY) {
        QuarterlyRevenueGrowthYOY = quarterlyRevenueGrowthYOY;
    }

    public String getTrailingPE() {
        return TrailingPE;
    }

    public void setTrailingPE(String trailingPE) {
        TrailingPE = trailingPE;
    }

    public String getForwardPE() {
        return ForwardPE;
    }

    public void setForwardPE(String forwardPE) {
        ForwardPE = forwardPE;
    }

    public String getPEGRatio() {
        return PEGRatio;
    }

    public void setPEGRatio(String pEGRatio) {
        PEGRatio = pEGRatio;
    }

    public String getDividendYield() {
        return DividendYield;
    }

    public void setDividendYield(String dividendYield) {
        DividendYield = dividendYield;
    }

    public String getExDividendDate() {
        return ExDividendDate;
    }

    public void setExDividendDate(String exDividendDate) {
        ExDividendDate = exDividendDate;
    }

    public String getPriceToBookRatio() {
        return PriceToBookRatio;
    }

    public void setPriceToBookRatio(String priceToBookRatio) {
        PriceToBookRatio = priceToBookRatio;
    }

    public String getPriceToSalesRatioTTM() {
        return PriceToSalesRatioTTM;
    }

    public void setPriceToSalesRatioTTM(String priceToSalesRatioTTM) {
        PriceToSalesRatioTTM = priceToSalesRatioTTM;
    }

    public String getAnalystTargetPrice() {
        return AnalystTargetPrice;
    }

    public void setAnalystTargetPrice(String analystTargetPrice) {
        AnalystTargetPrice = analystTargetPrice;
    }

    public String getFiftyTwoWeekHigh() {
        return fiftyTwoWeekHigh;
    }

    public void setFiftyTwoWeekHigh(String fiftyTwoWeekHigh) {
        this.fiftyTwoWeekHigh = fiftyTwoWeekHigh;
    }

    public String getFiftyTwoWeekLow() {
        return fiftyTwoWeekLow;
    }

    public void setFiftyTwoWeekLow(String fiftyTwoWeekLow) {
        this.fiftyTwoWeekLow = fiftyTwoWeekLow;
    }

    public String getFiftyDayMovingAverage() {
        return fiftyDayMovingAverage;
    }

    public void setFiftyDayMovingAverage(String fiftyDayMovingAverage) {
        this.fiftyDayMovingAverage = fiftyDayMovingAverage;
    }

    public String getTwoHundredDayMovingAverage() {
        return twoHundredDayMovingAverage;
    }

    public void setTwoHundredDayMovingAverage(String twoHundredDayMovingAverage) {
        this.twoHundredDayMovingAverage = twoHundredDayMovingAverage;
    }

    public String getBeta() {
        return Beta;
    }

    public void setBeta(String beta) {
        Beta = beta;
    }

}
