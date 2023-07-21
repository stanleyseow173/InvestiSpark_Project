package nus.iss.tfip.miniProject.models;

import java.time.LocalDateTime;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "notes")
public class Note {

    @Id
    private String nameSymbol;

    private String content;

    private LocalDateTime timestamp;

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

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }

    public Note() {
    }

    public Note(String nameSymbol) {
       this.nameSymbol = nameSymbol;
    }

    public Note(String nameSymbol, String content) {
        this.nameSymbol = nameSymbol;
        this.content = content;
        this.timestamp = LocalDateTime.now();
    }

    public Note(String nameSymbol, String content, LocalDateTime timestamp) {
        this.nameSymbol = nameSymbol;
        this.content = content;
        this.timestamp = timestamp;
    }

    

}
