import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

const SENTIMENT_URL = "/api/analyzeSentiment" //send to StockController

@Injectable()
export class SentimentService{

    constructor(private http: HttpClient){}

    analyzeSentiment(text: string): Observable<any>{
        return this.http.post<any>(SENTIMENT_URL, text);
    }
}