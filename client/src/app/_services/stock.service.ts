import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { StockCurrent, StockOverview, StocksSearchSnippet } from "app/models";
import { map, Observable } from "rxjs";

const QUERY_SYMBOL_URL = "/api/stockQuerySymbols"
const STOCK_OVERVIEW_URL = "/api/stockOverview" 
const UPDATE_STOCK_OVERVIEW_URL = "/api/updateStockOverview"
const GET_LATEST_QUOTE_URL = "/api/getLatestQuote" 
const GET_FULL_DAILY_PRICES_URL = "/api/getFullDailyPrices"  
const GET_NEWS_URL = "/api/getNews"

@Injectable()
export class StockService{

    constructor(private http:HttpClient){}

    //latest trading day quote
    getLatestQuote(ticker):Observable<StockCurrent>{
        return this.http.get<any[]>(`${GET_LATEST_QUOTE_URL}/${ticker}`).pipe(map(response => {
                let item= response['Global Quote'];
                return{
                    price: item['05. price'],
                    day: item['07. latest trading day'],
                    change: item['09. change'],
                    changePercent: item['10. change percent'],
                }
        }));
    }


    //Calls backend to call external api to update overview in database
    updateOverview(ticker):Observable<StockOverview>{
        return this.http.get<StockOverview>(`${UPDATE_STOCK_OVERVIEW_URL}/${ticker}`);
    }

    //Calls backend to provide overview 
    //--> overview is stored in database on first retrieval and subsequently retrieved from database instead of external api
    getOverview(ticker):Observable<StockOverview>{
        return this.http.get<StockOverview>(`${STOCK_OVERVIEW_URL}/${ticker}`);
    }

    //Historical prices over a period of time
    getFullDailyPrices(ticker){
        return this.http.get<any[]>(`${GET_FULL_DAILY_PRICES_URL}/${ticker}`)
    }

    //matching only stock symbols
    getSymbolMatches(searchString){
        const params = new HttpParams().set("filter", searchString)
        return this.http.get<StocksSearchSnippet[]>(`/api/getSymbols`,{params})
    }

    //matching stock symbols and names
    getBestMatches(searchString){
        const params = new HttpParams().set("filter", searchString)
        return this.http.get<StocksSearchSnippet[]>(`/api/getStocks`,{params})
    }

    getNews(ticker){
        return this.http.get<any>(`${GET_NEWS_URL}/${ticker}`)
    }

    

    //Make a call to spring boot backend to query Alpha Vantage for list of stocks and store in Redis
    loadAllSymbols(){
        return this.http.get<any>(QUERY_SYMBOL_URL);
}
}