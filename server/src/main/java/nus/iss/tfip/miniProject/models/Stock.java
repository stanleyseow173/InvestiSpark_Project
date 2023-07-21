package nus.iss.tfip.miniProject.models;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "stocks")
public class Stock {
    @Id
    private String symbol;
    private String name;

    

    public Stock() {
    }

    
    public Stock(String symbol, String name) {
        this.symbol = symbol;
        this.name = name;
    }


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


    @Override
    public String toString() {
        return "Stock [symbol=" + symbol + ", name=" + name + "]";
    }

    

    
}
