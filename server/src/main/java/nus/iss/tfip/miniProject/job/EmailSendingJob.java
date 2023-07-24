package nus.iss.tfip.miniProject.job;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import nus.iss.tfip.miniProject.models.RapidApiQuote;
import nus.iss.tfip.miniProject.models.WatchStock;
import nus.iss.tfip.miniProject.models.Watchlist;
import nus.iss.tfip.miniProject.services.EmailService;
import nus.iss.tfip.miniProject.services.WatchlistService;
import reactor.core.publisher.Mono;

//@Component
@Service
public class EmailSendingJob {

    @Autowired
    private EmailService emailservice;

    @Autowired
    private WatchlistService watchlistService;

    @Value("${RAPIDAPIKEY}")
    private String mBoumKey;

    @Scheduled(cron = "0 20 16 * * ?")
    public void sendEmailNotifications() {

        String externalApiUrl = "https://mboum-finance.p.rapidapi.com/qu/quote?symbol=";

        // get all emails
        List<String> emails = emailservice.getAllEmails();

        WebClient webClient = WebClient.builder()
                .defaultHeader(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE).build();

        // for each email
        for (String email : emails) {
            System.out.println("Email is: " + email);
            // get watchlist by emails
            Watchlist watchlist = watchlistService.getWatchlistByEmail(email);

            if (watchlist != null) {
                // iterate through watchlists and get current price for items in watchlist
                // symbols
                String symbols = watchlist.getStocks().stream().map(WatchStock::getSymbol)
                        .collect(Collectors.joining("%2C"));

                // set up request to external api
                HttpHeaders headers = new HttpHeaders();
                headers.set("x-rapidapi-host", "mboum-finance.p.rapidapi.com");
                headers.set("x-rapidapi-key", mBoumKey);

                Mono<RapidApiQuote[]> quoteResponse = webClient.get()
                        .uri(externalApiUrl + symbols)
                        .headers(httpHeaders -> httpHeaders.addAll(headers))
                        .retrieve()
                        .bodyToMono(RapidApiQuote[].class);

                RapidApiQuote[] quotes = quoteResponse.block();

                StringBuilder buyTable = new StringBuilder();
                buyTable.append(
                        "<table style='border-collapse: separate; border-spacing: 10px;'><tr><th>Ticker</th><th>Name</th><th>Current Price</th><th>Buy Target</th></tr>");

                StringBuilder sellTable = new StringBuilder();
                sellTable.append(
                        "<table style='border-collapse: separate; border-spacing: 10px;'><tr><th>Ticker</th><th>Name</th><th>Current Price</th><th>Sell Target</th></tr>");

                // calculate difference between target buy, target sell and current price
                // create buy and sell tables

                watchlist.getStocks().forEach(stock -> {
                    for (RapidApiQuote quote : quotes) {
                        if (quote.getSymbol().equals(stock.getSymbol())) {
                            double buyDiff = stock.getBuytarget() - Double.parseDouble(quote.getRegularMarketPrice());
                            double sellDiff = Double.parseDouble(quote.getRegularMarketPrice()) - stock.getSelltarget();
                            if (buyDiff > 0) {
                                buyTable.append(String.format(
                                        "<tr><td>%s</td><td>%s</td><td style='text-align: right;'>%s</td><td style='text-align: right;'>%s</td></tr>",
                                        stock.getSymbol(), stock.getName(), quote.getRegularMarketPrice(),
                                        stock.getBuytarget()));
                            }
                            if (sellDiff > 0) {
                                sellTable.append(String.format(
                                        "<tr><td>%s</td><td>%s</td><td style='text-align: right;'>%s</td><td style='text-align: right;'>%s</td></tr>",
                                        stock.getSymbol(), stock.getName(), quote.getRegularMarketPrice(),
                                        stock.getSelltarget()));
                            }
                        }
                    }
                });

                // create html tables
                buyTable.append("</table>");
                sellTable.append("</table>");

                String emailBody = "<h2>Buy Targets</h2>" + buyTable.toString() + "<h2>Sell Targets</h2>"
                        + sellTable.toString();
                // call service to send
                try {
                    emailservice.sendEmail(email, emailBody, "Stock Alert for: " + email);
                } catch (Exception e) {
                    e.printStackTrace();
                    continue;
                }

                // System.out.println("Email sent");
            }

        }

    }

}
