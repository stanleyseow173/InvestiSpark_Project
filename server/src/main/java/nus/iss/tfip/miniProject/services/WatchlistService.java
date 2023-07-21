package nus.iss.tfip.miniProject.services;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import nus.iss.tfip.miniProject.models.WatchStock;
import nus.iss.tfip.miniProject.models.Watchlist;
import nus.iss.tfip.miniProject.repositories.mongo.WatchlistRepository;

@Service
public class WatchlistService {

    @Value("${RAPIDAPIKEY}")
    private String mboumApiKey;

    private static final String externalApiUrl = "https://mboum-finance.p.rapidapi.com/qu/quote?symbol=";

    @Autowired
    private WatchlistRepository watchlistRepository;

    public WatchlistService(WatchlistRepository watchlistRepository) {
        this.watchlistRepository = watchlistRepository;
    }

    public Watchlist addToWatchlist(String email, WatchStock stock) {
        return watchlistRepository.addToWatchlist(email, stock);
    }

    public Watchlist getWatchlistByEmail(String email) {
        return watchlistRepository.getWatchlistByEmail(email);
    }

    public Watchlist deleteStock(String email, String stockSymbol) {
        return watchlistRepository.deleteStock(email, stockSymbol);
    }

    public ResponseEntity<String> getWatchlistQuotes(String symbolString) {
        String url = externalApiUrl + symbolString;
        HttpHeaders headers = new HttpHeaders();
        headers.set("x-rapidapi-host", "mboum-finance.p.rapidapi.com");
        headers.set("x-rapidapi-key", mboumApiKey);
        HttpEntity<String> entity = new HttpEntity<>(headers);
        RestTemplate restTemplate = new RestTemplate();
        ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.GET, entity, String.class);
        return response;
    }

    public List<String> getWatchlistSymbolsByEmail(String email) {
        Watchlist watchlist = watchlistRepository.getWatchlistByEmail(email);
        if (watchlist == null) {
            return null;
        }
        return watchlist.getStocks().stream().map(WatchStock::getSymbol).collect(Collectors.toList());
    }

}
