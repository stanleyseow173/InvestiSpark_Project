package nus.iss.tfip.miniProject.models;

public class ResearchChecklistItem {

    private Boolean checked;
    private String item;
    private String remarks;
    public Boolean getChecked() {
        return checked;
    }
    public void setChecked(Boolean checked) {
        this.checked = checked;
    }
    public String getItem() {
        return item;
    }
    public void setItem(String item) {
        this.item = item;
    }
    public String getRemarks() {
        return remarks;
    }
    public void setRemarks(String remarks) {
        this.remarks = remarks;
    }
    public ResearchChecklistItem() {
    }
    public ResearchChecklistItem(Boolean checked, String item, String remarks) {
        this.checked = checked;
        this.item = item;
        this.remarks = remarks;
    }
    
    
}
