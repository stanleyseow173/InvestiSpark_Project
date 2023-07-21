package nus.iss.tfip.miniProject.models;

//Class created to handle date to string before sending back to angular frontend
public class ReturnNote {
    private String nameSymbol;
    private String content;
    private String date;
    
    public String getNameSymbol() {
        return nameSymbol;
    }
    public void setNameSymbol(String nameSymbol) {
        this.nameSymbol = nameSymbol;
    }
    public String getContent() {
        return content;
    }
    public void setContent(String content) {
        this.content = content;
    }
    public String getDate() {
        return date;
    }
    public void setDate(String date) {
        this.date = date;
    }

    
}
