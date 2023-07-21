import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable()
export class RequestInterceptor implements HttpInterceptor {

  constructor() { }

  //to attach credentials when makin HTTP requests
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if(req.url.includes('https://www.alphavantage.co')){
      //do nothing
    } else if (req.url.includes('https://api.marketaux.com')){
      //do nothing
    } else{ //if not attach credentials 
      req = req.clone({
        withCredentials: true,
      });
    }

    return next.handle(req).pipe(
      catchError((error) => {
        return throwError(() => error);
      })
    );
  }
}
