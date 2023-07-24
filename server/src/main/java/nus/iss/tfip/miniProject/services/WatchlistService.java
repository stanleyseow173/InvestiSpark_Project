package nus.iss.tfip.miniProject.services;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import nus.iss.tfip.miniProject.models.StockStats;
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

    public ResponseEntity<String> getWatchlistQuotes(String symbolString)
            throws JsonMappingException, JsonProcessingException {
        // System.out.println("The symbol String is:");
        // System.out.println(symbolString);
        String url = externalApiUrl + symbolString;
        // System.out.println("The url is: " + url);
        HttpHeaders headers = new HttpHeaders();
        headers.set("x-rapidapi-host", "mboum-finance.p.rapidapi.com");
        headers.set("x-rapidapi-key", mboumApiKey);
        HttpEntity<String> entity = new HttpEntity<>(headers);
        RestTemplate restTemplate = new RestTemplate();
        ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.GET, entity, String.class);
        // System.out.println("Getting watchlist quotes from mboum:");
        // System.out.println(response);
        ObjectMapper objectMapper = new ObjectMapper();
        objectMapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
        StockStats[] stats = objectMapper.readValue(response.getBody(), StockStats[].class);
        String statsJson = objectMapper.writeValueAsString(stats);
        // System.out.println("After consolidating, response is :" + statsJson);
        return new ResponseEntity<>(statsJson, HttpStatus.OK);
    }

    public List<String> getWatchlistSymbolsByEmail(String email) {
        Watchlist watchlist = watchlistRepository.getWatchlistByEmail(email);
        if (watchlist == null) {
            return null;
        }
        return watchlist.getStocks().stream().map(WatchStock::getSymbol).collect(Collectors.toList());
    }

}
