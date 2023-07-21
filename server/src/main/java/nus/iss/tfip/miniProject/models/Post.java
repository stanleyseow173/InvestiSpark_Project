package nus.iss.tfip.miniProject.models;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;

@Entity
@Table(name = "posts")
public class Post {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;

    private String authorEmail;

    private String content;

    private String tag;

    private String timestamp;

    private String category;

    private String symbol;

    private String target;

    private String targetDate;

    public String getSymbol() {
        return symbol;
    }

    public void setSymbol(String symbol) {
        this.symbol = symbol;
    }

    public String getTarget() {
        return target;
    }

    public void setTarget(String target) {
        this.target = target;
    }

    public String getTargetDate() {
        return targetDate;
    }

    public void setTargetDate(String targetDate) {
        this.targetDate = targetDate;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getAuthorEmail() {
        return authorEmail;
    }

    public void setAuthorEmail(String authorEmail) {
        this.authorEmail = authorEmail;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public String getTag() {
        return tag;
    }

    public void setTag(String tag) {
        this.tag = tag;
    }

    public String getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(String timestamp) {
        this.timestamp = timestamp;
    }

    

    public Post() {
    }

    public Post(Integer id, String authorEmail, String content, String tag, String timestamp) {
        this.id = id;
        this.authorEmail = authorEmail;
        this.content = content;
        this.tag = tag;
        this.timestamp = timestamp;
    }

    //takes a string with tags (i.e. $MSFT,$GOOGL,$AMZN and convert it into a list of the symbols)
    public List<String> convertTags(){
        return Arrays.stream(this.tag.split(","))
                .map(tag -> tag.startsWith("$") ? tag.substring(1): tag)
                .collect(Collectors.toList());
    }
    
    
}
