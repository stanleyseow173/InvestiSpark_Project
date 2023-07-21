package nus.iss.tfip.miniProject.models;

import java.util.ArrayList;
import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection="watchlist")
public class Watchlist {
    
    @Id
    private String user;
    private List<WatchStock> stocks = new ArrayList<>();

    
    
    public Watchlist() {
    }


    public Watchlist(String user) {
        this.user = user;
    }


    public String getUser() {
        return user;
    }
    public void setUser(String user) {
        this.user = user;
    }
    public List<WatchStock> getStocks() {
        return stocks;
    }
    public void setStocks(List<WatchStock> stocks) {
        this.stocks = stocks;
    }

    
}
