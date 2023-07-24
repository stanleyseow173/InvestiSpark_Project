package nus.iss.tfip.miniProject.services;

import java.io.StringReader;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.opencsv.CSVReader;
import com.opencsv.bean.CsvToBean;
import com.opencsv.bean.CsvToBeanBuilder;
import com.opencsv.bean.HeaderColumnNameMappingStrategy;

import nus.iss.tfip.miniProject.dto.StockOverviewDto;
import nus.iss.tfip.miniProject.models.NewsStructure;
import nus.iss.tfip.miniProject.models.NewsTitle;
import nus.iss.tfip.miniProject.models.Stock;
import nus.iss.tfip.miniProject.models.StockOverview;
import nus.iss.tfip.miniProject.repositories.jpa.StockSymbolRepository;
import nus.iss.tfip.miniProject.repositories.mongo.StockOverviewRepository;

@Service
public class StockService {

    @Autowired
    private StockSymbolRepository stockSymbolRepository;

    @Autowired
    private StockOverviewRepository stockOverviewRepository;

    @Value("${ALPHAAPIKEY}")
    private String apiKey;

    @Value("${MARKETNEWSKEY}")
    private String marketNewsKey;

    public String QUERY_SYMBOLS_URL = "https://www.alphavantage.co/query?function=LISTING_STATUS&apikey=" + apiKey;

    public void loadStockCSVintoMySQL() {

        RestTemplate restTemplate = new RestTemplate();
        String csvData = restTemplate.getForObject(QUERY_SYMBOLS_URL, String.class);

        if (csvData != null && !csvData.isEmpty()) {
            CSVReader csvReader = new CSVReader(new StringReader(csvData));
            HeaderColumnNameMappingStrategy<Stock> strategy = new HeaderColumnNameMappingStrategy<>();
            strategy.setType(Stock.class);

            CsvToBean<Stock> csvToBean = new CsvToBeanBuilder<Stock>(csvReader)
                    .withMappingStrategy(strategy)
                    .withIgnoreLeadingWhiteSpace(true)
                    .build();

            List<Stock> stocks = csvToBean.parse();

            saveAll(stocks);
        }
    }

    public List<Stock> getStocks(String filter) {
        Pageable pageable = PageRequest.of(0, 8);
        return stockSymbolRepository.getStocks(filter, pageable);
    }

    public List<Stock> getSymbols(String filter) {
        Pageable pageable = PageRequest.of(0, 8);
        return stockSymbolRepository.getSymbols(filter, pageable);
    }

    @Transactional
    public void saveAll(List<Stock> stocks) {
        stockSymbolRepository.deleteAllInBatch(); // delete all existing stocks
        stockSymbolRepository.saveAll(stocks); // save new stocks
    }

    public ResponseEntity<String> getNews(String ticker) throws JsonMappingException, JsonProcessingException {
        String url = "https://api.marketaux.com/v1/news/all?symbols=" + ticker
                + "&language=en&filter_entities=true&api_token=" + marketNewsKey;
        //System.out.println("URL is = " + url);
        RestTemplate restTemplate = new RestTemplate();
        ResponseEntity<String> response = restTemplate.getForEntity(url, String.class);
            // System.out.println("Getting watchlist quotes from mboum:");
            // System.out.println(response);
        ObjectMapper objectMapper = new ObjectMapper();
        objectMapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
        NewsStructure data = objectMapper.readValue(response.getBody(), NewsStructure.class);
        NewsTitle[] news = data.getData();
        String newsJson = objectMapper.writeValueAsString(news);
            // System.out.println("After consolidating, response is :" + statsJson);
        return new ResponseEntity<>(newsJson, HttpStatus.OK);
    }

    public ResponseEntity<String> getLatestQuote(String ticker) {
        String url = "https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=" + ticker + "&apikey=" + apiKey;
        RestTemplate restTemplate = new RestTemplate();
        return restTemplate.getForEntity(url, String.class);
    }

    public ResponseEntity<String> getFullDailyPrices(String ticker) {
        String url = "https://www.alphavantage.co/query?function=TIME_SERIES_DAILY_ADJUSTED&symbol=" + ticker
                + "&outputsize=full&apikey=" + apiKey;
        RestTemplate restTemplate = new RestTemplate();
        return restTemplate.getForEntity(url, String.class);
    }

    public StockOverview getStockOverviewFromVantage(String ticker) {
        String url = "https://www.alphavantage.co/query?function=OVERVIEW&symbol=" + ticker + "&apikey=" + apiKey;
        RestTemplate restTemplate = new RestTemplate();
        StockOverviewDto stockOverviewDto = restTemplate.getForObject(url, StockOverviewDto.class);
        //System.out.println("Retrieved from Alpha Vantage");
        Optional<StockOverview> existingStockOverview = stockOverviewRepository.findById(ticker);

        if (existingStockOverview.isPresent()) {
            StockOverview stockOverviewToUpdate = existingStockOverview.get();
            stockOverviewToUpdate.setAnalysttarget(stockOverviewDto.getAnalystTargetPrice());
            stockOverviewToUpdate.setBeta(stockOverviewDto.getBeta());
            stockOverviewToUpdate.setCountry(stockOverviewDto.getCountry());
            stockOverviewToUpdate.setCurrency(stockOverviewDto.getCurrency());
            stockOverviewToUpdate.setDescription(stockOverviewDto.getDescription());
            stockOverviewToUpdate.setDivyield(stockOverviewDto.getDividendYield());
            stockOverviewToUpdate.setExchange(stockOverviewDto.getExchange());
            stockOverviewToUpdate.setExdivdate(stockOverviewDto.getExDividendDate());
            stockOverviewToUpdate.setFiftydayma(stockOverviewDto.getFiftyDayMovingAverage());
            stockOverviewToUpdate.setFiftytwohigh(stockOverviewDto.getFiftyTwoWeekHigh());
            stockOverviewToUpdate.setFiftytwolow(stockOverviewDto.getFiftyTwoWeekLow());
            stockOverviewToUpdate.setForwardpe(stockOverviewDto.getFiftyTwoWeekLow());
            stockOverviewToUpdate.setIndustry(stockOverviewDto.getIndustry());
            stockOverviewToUpdate.setName(stockOverviewDto.getName());
            stockOverviewToUpdate.setOperatingmargin(stockOverviewDto.getOperatingMarginTTM());
            stockOverviewToUpdate.setPbratio(stockOverviewDto.getPriceToBookRatio());
            stockOverviewToUpdate.setPegratio(stockOverviewDto.getPEGRatio());
            stockOverviewToUpdate.setPeratio(stockOverviewDto.getTrailingPE());
            stockOverviewToUpdate.setProfitmargin(stockOverviewDto.getProfitMargin());
            stockOverviewToUpdate.setPsratio(stockOverviewDto.getPriceToSalesRatioTTM());
            stockOverviewToUpdate.setQtrearningsgrowth(stockOverviewDto.getQuarterlyEarningsGrowthYOY());
            stockOverviewToUpdate.setQtrrevenuegrowth(stockOverviewDto.getQuarterlyRevenueGrowthYOY());
            stockOverviewToUpdate.setRoa(stockOverviewDto.getReturnOnAssetsTTM());
            stockOverviewToUpdate.setRoe(stockOverviewDto.getReturnOnEquityTTM());
            stockOverviewToUpdate.setSector(stockOverviewDto.getSector());
            stockOverviewToUpdate.setSymbol(stockOverviewDto.getSymbol());
            stockOverviewToUpdate.setTwohundreddayma(stockOverviewDto.getTwoHundredDayMovingAverage());
            stockOverviewRepository.save(stockOverviewToUpdate);
            //System.out.println("Existing Stock Overview Updated");
            return stockOverviewToUpdate;
        } else {
            StockOverview newStockOverview = new StockOverview();

            // mapping dto to stock object to be sent
            newStockOverview.setAnalysttarget(stockOverviewDto.getAnalystTargetPrice());
            newStockOverview.setBeta(stockOverviewDto.getBeta());
            newStockOverview.setCountry(stockOverviewDto.getCountry());
            newStockOverview.setCurrency(stockOverviewDto.getCurrency());
            newStockOverview.setDescription(stockOverviewDto.getDescription());
            newStockOverview.setDivyield(stockOverviewDto.getDividendYield());
            newStockOverview.setExchange(stockOverviewDto.getExchange());
            newStockOverview.setExdivdate(stockOverviewDto.getExDividendDate());
            newStockOverview.setFiftydayma(stockOverviewDto.getFiftyDayMovingAverage());
            newStockOverview.setFiftytwohigh(stockOverviewDto.getFiftyTwoWeekHigh());
            newStockOverview.setFiftytwolow(stockOverviewDto.getFiftyTwoWeekLow());
            newStockOverview.setForwardpe(stockOverviewDto.getFiftyTwoWeekLow());
            newStockOverview.setIndustry(stockOverviewDto.getIndustry());
            newStockOverview.setName(stockOverviewDto.getName());
            newStockOverview.setOperatingmargin(stockOverviewDto.getOperatingMarginTTM());
            newStockOverview.setPbratio(stockOverviewDto.getPriceToBookRatio());
            newStockOverview.setPegratio(stockOverviewDto.getPEGRatio());
            newStockOverview.setPeratio(stockOverviewDto.getTrailingPE());
            newStockOverview.setProfitmargin(stockOverviewDto.getProfitMargin());
            newStockOverview.setPsratio(stockOverviewDto.getPriceToSalesRatioTTM());
            newStockOverview.setQtrearningsgrowth(stockOverviewDto.getQuarterlyEarningsGrowthYOY());
            newStockOverview.setQtrrevenuegrowth(stockOverviewDto.getQuarterlyRevenueGrowthYOY());
            newStockOverview.setRoa(stockOverviewDto.getReturnOnAssetsTTM());
            newStockOverview.setRoe(stockOverviewDto.getReturnOnEquityTTM());
            newStockOverview.setSector(stockOverviewDto.getSector());
            newStockOverview.setSymbol(stockOverviewDto.getSymbol());
            newStockOverview.setTwohundreddayma(stockOverviewDto.getTwoHundredDayMovingAverage());

            stockOverviewRepository.save(newStockOverview);
            //System.out.println("New Stock Overview Created");
            return newStockOverview;
        }
    }

    public StockOverview getStockOverview(String ticker) {

        // check if it is in Mongo, if not query from alphavantage and save it in mongo
        StockOverview stockOverview = stockOverviewRepository.findBySymbol(ticker);

        if (stockOverview == null) {
            return getStockOverviewFromVantage(ticker);
        }
        //System.out.println("Retrieved from MongoDB");
        return stockOverview;
    }

}
