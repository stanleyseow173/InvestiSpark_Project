package nus.iss.tfip.miniProject.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonMappingException;

import nus.iss.tfip.miniProject.models.Watchlist;
import nus.iss.tfip.miniProject.payload.request.DeleteStockRequest;
import nus.iss.tfip.miniProject.payload.request.WatchlistRequest;
import nus.iss.tfip.miniProject.services.WatchlistService;

@RestController
@RequestMapping("/api")
public class WatchlistController {

    @Autowired
    private WatchlistService watchlistService;

    @PostMapping("/addToStockWatchlist")
    public ResponseEntity<Watchlist> addStockToWatchlist(@RequestBody WatchlistRequest request) {
        Watchlist updatedWatchlist = watchlistService.addToWatchlist(request.getUser(), request.getStocks());
        return new ResponseEntity<>(updatedWatchlist, HttpStatus.OK);
    }

    @GetMapping("/watchlist/symbols/{email}")
    public List<String> getWatchlistSymbols(@PathVariable String email) {
        return watchlistService.getWatchlistSymbolsByEmail(email);
    }

    @GetMapping("/watchlist/{email}")
    public ResponseEntity<Watchlist> getWatchlist(@PathVariable String email) {
        Watchlist watchlist = watchlistService.getWatchlistByEmail(email);
        if (watchlist == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(watchlist, HttpStatus.OK);
    }

    @GetMapping("/getWatchlistQuotes/{symbolString}")
    public ResponseEntity<?> getWatchlistQuotes(@PathVariable String symbolString)
            throws JsonMappingException, JsonProcessingException {
        return this.watchlistService.getWatchlistQuotes(symbolString);
    }

    @PostMapping("/deleteStock")
    public ResponseEntity<Void> deleteStock(@RequestBody DeleteStockRequest request) {
        Watchlist updatedWatchlist = watchlistService.deleteStock(request.getEmail(), request.getStockSymbol());
        if (updatedWatchlist != null) {
            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }

}
