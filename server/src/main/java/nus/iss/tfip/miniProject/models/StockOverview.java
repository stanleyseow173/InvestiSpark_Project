package nus.iss.tfip.miniProject.models;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "stock_overview")
public class StockOverview {
    @Id
    private String symbol;
    private String name;
    private String description;
    private String exchange;
    private String currency;
    private String country;
    private String sector;
    private String industry;
    private String profitmargin;
    private String operatingmargin;
    private String roa;
    private String roe;
    private String qtrearningsgrowth;
    private String qtrrevenuegrowth;
    private String peratio;
    private String forwardpe;
    private String pegratio;
    private String divyield;
    private String exdivdate;
    private String pbratio;
    private String psratio;
    private String analysttarget;
    private String fiftytwohigh;
    private String fiftytwolow;
    private String fiftydayma;
    private String twohundreddayma;
    private String beta;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getSymbol() {
        return symbol;
    }

    public void setSymbol(String symbol) {
        this.symbol = symbol;
    }

    public String getExchange() {
        return exchange;
    }

    public void setExchange(String exchange) {
        this.exchange = exchange;
    }

    public String getCurrency() {
        return currency;
    }

    public void setCurrency(String currency) {
        this.currency = currency;
    }

    public String getCountry() {
        return country;
    }

    public void setCountry(String country) {
        this.country = country;
    }

    public String getSector() {
        return sector;
    }

    public void setSector(String sector) {
        this.sector = sector;
    }

    public String getIndustry() {
        return industry;
    }

    public void setIndustry(String industry) {
        this.industry = industry;
    }

    public String getProfitmargin() {
        return profitmargin;
    }

    public void setProfitmargin(String profitmargin) {
        this.profitmargin = profitmargin;
    }

    public String getOperatingmargin() {
        return operatingmargin;
    }

    public void setOperatingmargin(String operatingmargin) {
        this.operatingmargin = operatingmargin;
    }

    public String getRoa() {
        return roa;
    }

    public void setRoa(String roa) {
        this.roa = roa;
    }

    public String getRoe() {
        return roe;
    }

    public void setRoe(String roe) {
        this.roe = roe;
    }

    public String getQtrearningsgrowth() {
        return qtrearningsgrowth;
    }

    public void setQtrearningsgrowth(String qtrearningsgrowth) {
        this.qtrearningsgrowth = qtrearningsgrowth;
    }

    public String getQtrrevenuegrowth() {
        return qtrrevenuegrowth;
    }

    public void setQtrrevenuegrowth(String qtrrevenuegrowth) {
        this.qtrrevenuegrowth = qtrrevenuegrowth;
    }

    public String getPeratio() {
        return peratio;
    }

    public void setPeratio(String peratio) {
        this.peratio = peratio;
    }

    public String getForwardpe() {
        return forwardpe;
    }

    public void setForwardpe(String forwardpe) {
        this.forwardpe = forwardpe;
    }

    public String getPegratio() {
        return pegratio;
    }

    public void setPegratio(String pegratio) {
        this.pegratio = pegratio;
    }

    public String getDivyield() {
        return divyield;
    }

    public void setDivyield(String divyield) {
        this.divyield = divyield;
    }

    public String getExdivdate() {
        return exdivdate;
    }

    public void setExdivdate(String exdivdate) {
        this.exdivdate = exdivdate;
    }

    public String getPbratio() {
        return pbratio;
    }

    public void setPbratio(String pbratio) {
        this.pbratio = pbratio;
    }

    public String getPsratio() {
        return psratio;
    }

    public void setPsratio(String psratio) {
        this.psratio = psratio;
    }

    public String getAnalysttarget() {
        return analysttarget;
    }

    public void setAnalysttarget(String analysttarget) {
        this.analysttarget = analysttarget;
    }

    public String getFiftytwohigh() {
        return fiftytwohigh;
    }

    public void setFiftytwohigh(String fiftytwohigh) {
        this.fiftytwohigh = fiftytwohigh;
    }

    public String getFiftytwolow() {
        return fiftytwolow;
    }

    public void setFiftytwolow(String fiftytwolow) {
        this.fiftytwolow = fiftytwolow;
    }

    public String getFiftydayma() {
        return fiftydayma;
    }

    public void setFiftydayma(String fiftydayma) {
        this.fiftydayma = fiftydayma;
    }

    public String getTwohundreddayma() {
        return twohundreddayma;
    }

    public void setTwohundreddayma(String twohundreddayma) {
        this.twohundreddayma = twohundreddayma;
    }

    public String getBeta() {
        return beta;
    }

    public void setBeta(String beta) {
        this.beta = beta;
    }

}
