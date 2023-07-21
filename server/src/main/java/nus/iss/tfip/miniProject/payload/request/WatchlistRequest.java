package nus.iss.tfip.miniProject.payload.request;

import nus.iss.tfip.miniProject.models.WatchStock;

public class WatchlistRequest {
    private String user;
    private WatchStock stocks;

    public String getUser() {
        return user;
    }

    public void setUser(String user) {
        this.user = user;
    }

    public WatchStock getStocks() {
        return stocks;
    }

    public void setStocks(WatchStock stocks) {
        this.stocks = stocks;
    }

}
