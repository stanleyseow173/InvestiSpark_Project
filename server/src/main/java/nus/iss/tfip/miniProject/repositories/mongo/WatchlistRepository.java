package nus.iss.tfip.miniProject.repositories.mongo;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Repository;

import nus.iss.tfip.miniProject.models.WatchStock;
import nus.iss.tfip.miniProject.models.Watchlist;

@Repository
public class WatchlistRepository {

    @Autowired
    private MongoTemplate mongoTemplate;

    public Watchlist addToWatchlist(String email, WatchStock stock) {
        // Check if watchlist exists
        Query query = new Query();
        query.addCriteria(Criteria.where("_id").is(email));
        Watchlist watchlist = mongoTemplate.findOne(query, Watchlist.class);

        if (watchlist == null) {
            // No existing watchlist found, create a new one
            watchlist = new Watchlist();
            watchlist.setUser(email);
            watchlist.getStocks().add(stock);
            mongoTemplate.save(watchlist);
        } else {
            // Existing watchlist found
            // Check if the stock symbol exists in the watchlist
            Optional<WatchStock> optionalStock = watchlist.getStocks().stream()
                    .filter(s -> s.getSymbol().equals(stock.getSymbol()))
                    .findFirst();

            if (optionalStock.isPresent()) {
                // Stock exists, update the buy target and sell target
                WatchStock existingStock = optionalStock.get();
                existingStock.setBuytarget(stock.getBuytarget());
                existingStock.setSelltarget(stock.getSelltarget());
            } else {
                // Stock doesn't exist, add new stock to the watchlist
                watchlist.getStocks().add(stock);
            }

            mongoTemplate.save(watchlist);
        }

        return watchlist;
    }

    public Watchlist getWatchlistByEmail(String email) {
        Query query = new Query();
        query.addCriteria(Criteria.where("_id").is(email));
        return mongoTemplate.findOne(query, Watchlist.class);
    }

    public Watchlist deleteStock(String email, String stockSymbol){
        Watchlist watchlist = getWatchlistByEmail(email);
        if(watchlist != null){
            watchlist.getStocks().removeIf(stock -> stock.getSymbol().equals(stockSymbol));
            mongoTemplate.save(watchlist);
        }
        return watchlist;
    }

    public List<String> getAllEmails(){
        Query query = new Query();
        query.fields().include("_id");
        List<String> emails = mongoTemplate.findDistinct(query, "_id", "watchlist", String.class);
        return emails;
    }
}
