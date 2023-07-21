package nus.iss.tfip.miniProject.user;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "user_stats")
public class UserStats {
    @Id
    private String email;

    private Integer reputation;
    private Integer posts;
    private Integer followers;
    private Integer following;
    private Integer estimates;
    private Integer likes;
    
    public String getEmail() {
        return email;
    }
    public void setEmail(String email) {
        this.email = email;
    }
    public Integer getReputation() {
        return reputation;
    }
    public void setReputation(Integer reputation) {
        this.reputation = reputation;
    }
    public Integer getPosts() {
        return posts;
    }
    public void setPosts(Integer posts) {
        this.posts = posts;
    }
    public Integer getFollowers() {
        return followers;
    }
    public void setFollowers(Integer followers) {
        this.followers = followers;
    }
    public Integer getFollowing() {
        return following;
    }
    public void setFollowing(Integer following) {
        this.following = following;
    }
    public Integer getEstimates() {
        return estimates;
    }
    public void setEstimates(Integer estimates) {
        this.estimates = estimates;
    }
    public Integer getLikes() {
        return likes;
    }
    public void setLikes(Integer likes) {
        this.likes = likes;
    }

    
}
