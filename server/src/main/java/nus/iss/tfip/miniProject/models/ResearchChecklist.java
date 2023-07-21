package nus.iss.tfip.miniProject.models;

import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

import org.springframework.data.annotation.Id;

@Document(collection="research_checklist")
public class ResearchChecklist {
    @Id
    private String nameSymbol;

    private List<ResearchChecklistItem> items;

    public String getNameSymbol() {
        return nameSymbol;
    }

    public void setNameSymbol(String nameSymbol) {
        this.nameSymbol = nameSymbol;
    }

    public List<ResearchChecklistItem> getItems() {
        return items;
    }

    public void setItems(List<ResearchChecklistItem> items) {
        this.items = items;
    }
}



