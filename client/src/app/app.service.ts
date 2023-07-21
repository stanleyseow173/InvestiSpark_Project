import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { User } from './models';


const GETUSER_URL='/api/user'

@Injectable()
export class AppService {

  loginBtn = new Subject<boolean>()
  currUser = new Subject<User>()

  constructor(private http: HttpClient) { 
    this.setLoginBtn(true)
    
  }

  setLoginBtn(param: any){
    this.loginBtn.next(param)
  }

  setUser(param: any){
    this.currUser.next(param)
  }

  getDetailsByUsername(username: string): Observable<User>{
    const newURL = GETUSER_URL +"/" + username
    return this.http.get<User>(`${newURL}`)
  }
}