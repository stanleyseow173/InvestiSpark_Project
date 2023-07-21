import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

const EMAIL_URL = "/api/email"

@Injectable()
export class EmailService{

    constructor(private http:HttpClient){}

    sendEmail(email: any): Observable<any>{
        return this.http.post(EMAIL_URL, email)
    }

}