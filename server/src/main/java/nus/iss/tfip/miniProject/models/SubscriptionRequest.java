package nus.iss.tfip.miniProject.models;

public class SubscriptionRequest {
    private String subscriber;
    private String topic;
    public String getSubscriber() {
        return subscriber;
    }
    public void setSubscriber(String subscriber) {
        this.subscriber = subscriber;
    }
    public String getTopic() {
        return topic;
    }
    public void setTopic(String topic) {
        this.topic = topic;
    }

    
}
