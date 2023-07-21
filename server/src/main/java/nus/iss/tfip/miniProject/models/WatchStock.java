package nus.iss.tfip.miniProject.models;

public class WatchStock {
    private String symbol;
    private String name;
    private double buytarget;
    private double selltarget;
    
    public String getSymbol() {
        return symbol;
    }
    public void setSymbol(String symbol) {
        this.symbol = symbol;
    }
    public String getName() {
        return name;
    }
    public void setName(String name) {
        this.name = name;
    }
    public double getBuytarget() {
        return buytarget;
    }
    public void setBuytarget(double buytarget) {
        this.buytarget = buytarget;
    }
    public double getSelltarget() {
        return selltarget;
    }
    public void setSelltarget(double selltarget) {
        this.selltarget = selltarget;
    }

    
}
