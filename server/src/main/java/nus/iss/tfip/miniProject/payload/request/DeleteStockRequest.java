package nus.iss.tfip.miniProject.payload.request;

public class DeleteStockRequest {
    private String email;
    private String stockSymbol;
    
    public String getEmail() {
        return email;
    }
    public void setEmail(String email) {
        this.email = email;
    }
    public String getStockSymbol() {
        return stockSymbol;
    }
    public void setStockSymbol(String stockSymbol) {
        this.stockSymbol = stockSymbol;
    }

    
}
