import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { GetWatchlist, GetWatchlistStock, WatchlistStock } from "app/models";
import { map, mergeMap, Observable, of } from "rxjs";


const ADDWATCHLIST_URL = "/api/addToStockWatchlist"
const GETWATCHLIST_URL = "/api/watchlist"
const DELETESTOCK_URL = "/api/deleteStock"
const GETWATCHLISTQUOTES_URL = "/api/getWatchlistQuotes"

@Injectable()
export class WatchlistService{

    constructor(private http: HttpClient){}

    //add stock to watchlist for user (email as identifier)
    addToWatchlist(email: string, stock: WatchlistStock):Observable<any>{
        const payload = {
            user: email,
            stocks: stock
        }
        return this.http.post<any>(ADDWATCHLIST_URL, payload);
    }

    //get all the symbols in a user's watchlist
    getWatchlistSymbols(email: string): Observable<string[]> {
        return this.http.get<string[]>(`${GETWATCHLIST_URL}/symbols/${email}`);
      }

    //get the watchlist of a user
    getWatchlist(email: string): Observable<GetWatchlist>{
        return this.http.get<GetWatchlist>(`${GETWATCHLIST_URL}/${email}`).pipe(
            mergeMap(watchlist => {
                if(watchlist){
                    //map the list of stocks into a string separated by %2c
                    const symbols = watchlist.stocks.map(stock => stock.symbol).join('%2C');
                    //callbackend with string
                    return this.http.get<any[]>(`${GETWATCHLISTQUOTES_URL}/${symbols}`).pipe(
                        map(quotes =>{
                            watchlist.stocks.forEach(stock => {
                                const quote = quotes.find(q => q.symbol === stock.symbol);
                                if(quote){
                                    stock.fiftyTwoWeekHigh = quote.fiftyTwoWeekHigh;
                                    stock.fiftyTwoWeekLow = quote.fiftyTwoWeekLow
                                    stock.regularMarketPrice = quote.regularMarketPrice;
                                    stock.regularMarketChangePercent = (quote.regularMarketChangePercent * 100).toFixed(2) + '%';
                                    stock.regularMarketChangePercent = quote.regularMarketChangePercent
                                }
                            });
                            return watchlist;
                        })
                    );
                }else{
                    return of(null);
                }
            })
        );
    }

    deleteStock(email: string, stock:GetWatchlistStock): Observable<any>{
        const payload ={
            email: email,
            stockSymbol: stock
        }
        return this.http.post<any>(DELETESTOCK_URL, payload)
    }

}