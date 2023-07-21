package nus.iss.tfip.miniProject.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import jakarta.json.Json;
import jakarta.json.JsonArrayBuilder;
import nus.iss.tfip.miniProject.models.Stock;
import nus.iss.tfip.miniProject.models.StockOverview;
import nus.iss.tfip.miniProject.services.StockService;

@RestController
@RequestMapping("/api")
public class StockController {

    @Autowired
    private StockService stockSvc;

    @Autowired
    private ObjectMapper objectMapper;

    @GetMapping(path = "/stockQuerySymbols")
    public ResponseEntity<String> loadStockSymbols() {

        this.stockSvc.loadStockCSVintoMySQL();

        ;
        return ResponseEntity
                .ok(Json.createObjectBuilder().add("CSVloaded", true).build().toString());
    }

    @GetMapping(path = "/getStocks")
    public ResponseEntity<String> getStocks(@RequestParam(defaultValue = "") String filter) {
        JsonArrayBuilder arrBuilder = Json.createArrayBuilder();

        // System.out.println("getting stocks with filter: "+ filter);
        List<Stock> stocks = stockSvc.getStocks(filter);
        stocks.stream()
                .map(stock -> Json.createObjectBuilder()
                        .add("symbol", stock.getSymbol())
                        .add("name", stock.getName())
                        .build())
                .forEach(json -> arrBuilder.add(json));

        return ResponseEntity.ok(arrBuilder.build().toString());
    }

    @GetMapping(path = "/getSymbols")
    public ResponseEntity<String> getSymbols(@RequestParam(defaultValue = "") String filter) {
        JsonArrayBuilder arrBuilder = Json.createArrayBuilder();

        //System.out.println("getting stocks with filter: " + filter);
        List<Stock> stocks = stockSvc.getSymbols(filter);
        stocks.stream()
                .map(stock -> Json.createObjectBuilder()
                        .add("symbol", stock.getSymbol())
                        .add("name", stock.getName())
                        .build())
                .forEach(json -> arrBuilder.add(json));

        return ResponseEntity.ok(arrBuilder.build().toString());
    }

    

    @GetMapping(path = "/getNews/{ticker}")
    public ResponseEntity<String> getNews(@PathVariable String ticker) {
        return stockSvc.getNews(ticker);
    }

    @GetMapping(path = "/stockOverview/{ticker}")
    public ResponseEntity<String> getStockOverview(@PathVariable String ticker) {

        StockOverview stockOverview = stockSvc.getStockOverview(ticker);

        try {
            String json = objectMapper.writeValueAsString(stockOverview);
            return ResponseEntity.ok(json);
        } catch (JsonProcessingException e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Cannot write value as json");
        }

    }

    @GetMapping(path = "/updateStockOverview/{ticker}")
    public ResponseEntity<String> getStockOverviewFromVantage(@PathVariable String ticker) {

        StockOverview stockOverview = stockSvc.getStockOverviewFromVantage(ticker);

        try {
            String json = objectMapper.writeValueAsString(stockOverview);
            return ResponseEntity.ok(json);
        } catch (JsonProcessingException e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Cannot write value as json");
        }
    }

    @GetMapping(path = "getLatestQuote/{ticker}")
    public ResponseEntity<String> getLatestQuote(@PathVariable String ticker) {
        return stockSvc.getLatestQuote(ticker);
    }

    @GetMapping(path = "getFullDailyPrices/{ticker}")
    public ResponseEntity<String> getFullDailyPrices(@PathVariable String ticker) {
        return stockSvc.getFullDailyPrices(ticker);
    }

    @PostMapping(path = "/analyzeSentiment")
    public ResponseEntity<String> analyzeSentiment(@RequestBody String text) {
        RestTemplate restTemplate = new RestTemplate();

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

        MultiValueMap<String, String> map = new LinkedMultiValueMap<>();
        map.add("text", text);

        HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(map, headers);
        return restTemplate.postForEntity("http://text-processing.com/api/sentiment/", request, String.class);
    }
}
