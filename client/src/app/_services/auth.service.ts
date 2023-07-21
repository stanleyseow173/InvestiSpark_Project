import { EventEmitter, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, map, Observable, tap } from 'rxjs';
import { UserNavBar } from 'app/models';
import { AppService } from 'app/app.service';

const AUTH_API = '/api/auth/';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  isAuthenticated: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  
  public userLoggedIn: EventEmitter<UserNavBar> = new EventEmitter();

  constructor(private http: HttpClient,
    private appSvc: AppService) {
    this.checkAuthenticationStatus();
  }

  //function to check authentication before allowing users to access data
  checkAuthenticationStatus():Observable<boolean>{
    return this.http.get<{isAuthenticated: boolean}>(AUTH_API + 'checkAuthentication')
      .pipe(
        tap(res=> {
          this.isAuthenticated.next(res.isAuthenticated)
        }),
        map(res => res.isAuthenticated)
      )  
  }

  //normal login
  login(username: string, password: string): Observable<any> {
    return this.http.post(
      AUTH_API + 'signin',
      {
        username,
        password,
      },
      httpOptions
    ).pipe(
      tap(response =>{
        this.appSvc.setLoginBtn(false);
        this.userLoggedIn.emit(response); //emit response for navbar to detect changes
      })
    );
  }

  //Register with backend
  register(username: string, email: string, password: string, firstname: string, lastname: string): Observable<any> {
    return this.http.post(
      AUTH_API + 'signup',
      {
        username,
        email,
        password,
        firstname,
        lastname
      },
      httpOptions
    );
  }

  //log in with google function
  LoginWithGoogle(credentials: string): Observable<any> {
    const header = new HttpHeaders().set('Content-type', 'application/json');
    return this.http.post(AUTH_API + "loginwithgoogle", JSON.stringify(credentials), { headers: header, withCredentials: true }).pipe(
      tap(response => {
        this.appSvc.setLoginBtn(false);
        this.userLoggedIn.emit(response);
      })
    );
  }

  //logout function - to logout from backend
  logout(): Observable<any> {
    return this.http.post(AUTH_API + 'signout', { }, httpOptions).pipe(
      tap(response => {
        this.userLoggedIn.emit(response)
      })
    );
  }
}
