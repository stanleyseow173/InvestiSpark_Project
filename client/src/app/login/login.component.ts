import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AppService } from 'app/app.service';

import { LoginDetails } from 'app/models';
import { AuthService } from 'app/_services/auth.service';
import { StorageService } from 'app/_services/storage.service';
import { CredentialResponse, PromptMomentNotification } from 'google-one-tap';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit{
  model: any = {};
  sessionId: any = "";

  data : Date = new Date();
  focus: any;
  focus1: any;

  userRegistered: any;
  invalidDetails: any;

  fb = inject(FormBuilder)
  appSvc = inject(AppService)
  form!:FormGroup

  credentials = {username: '', password: ''};

  isLoggedIn = false;
  isLoginFailed = false;
  errorMessage = '';
  roles: string[] = [];


  private subscriptions: Subscription = new Subscription();
  
  constructor(
      private router: Router,
      private authService: AuthService,
      private storageService: StorageService,
  ) { }

  ngOnInit(): void {
    var body = document.getElementsByTagName('body')[0];
    body.classList.add('login-page');

    var navbar = document.getElementsByTagName('nav')[0];
    navbar.classList.add('navbar-transparent');

    this.form = this.fb.group(
      {
        username: this.fb.control<string>('',[Validators.required]),
        password: this.fb.control<string>('',[Validators.required])
      }
    )
    
    if (this.storageService.isLoggedIn()) {
      this.isLoggedIn = true;
      this.roles = this.storageService.getUser().roles;
    }

    //Google Login

    // @ts-ignore
    window.onGoogleLibraryLoad = () => {
      // @ts-ignore
      google.accounts.id.initialize({
        client_id: "894216379970-nk5v4a2cgej6his2u5n2mlc92pf8o2if.apps.googleusercontent.com",
        callback: this.handleCredentialResponse.bind(this),
        auto_select: false,
        cancel_on_tap_outside: true
      });
      // @ts-ignore
      google.accounts.id.renderButton(
      // @ts-ignore
      document.getElementById("buttonDiv"),
        { theme: "outline", size: "large", width: 320 } 
      );
      // @ts-ignore
      google.accounts.id.prompt((notification: PromptMomentNotification) => {});
    };


    this.invalidDetails = sessionStorage.getItem("invalid")
    this.appSvc.setLoginBtn(true);
    this.appSvc.setUser("");

  }


  async handleCredentialResponse(response: CredentialResponse) {
    await this.authService.LoginWithGoogle(response.credential).subscribe(
      (x:any) => {
          this.storageService.saveUser(x);
          this.isLoginFailed = false;
          this.isLoggedIn = true;
          this.roles = this.storageService.getUser().roles;
          sessionStorage.removeItem("invalid");
          this.appSvc.setLoginBtn(false);
          this.appSvc.setUser(x.username)
          this.router.navigate(['/checklist']).then(()=>{
            this.authService.userLoggedIn.emit(x); //emit to navbar after navigating
          });
        },
      (error:any) => {
          console.log(error);
        }
      );  
  }

  get username() {return this.form.get('username')}
  get password() {return this.form.get('password')}

  ngOnDestroy(){
    var body = document.getElementsByTagName('body')[0];
    body.classList.remove('login-page');

    var navbar = document.getElementsByTagName('nav')[0];
    navbar.classList.remove('navbar-transparent');

    this.subscriptions.unsubscribe()
  }

  login() {
    const loginDetails = this.form.value as LoginDetails
    sessionStorage.setItem(
      'invalid', 'true'
    );

    const sub = this.authService.login(loginDetails.username, loginDetails.password).subscribe({
      next: data =>{
        this.storageService.saveUser(data);
        this.isLoginFailed = false;
        this.isLoggedIn = true;
        this.roles = this.storageService.getUser().roles;
        sessionStorage.removeItem("invalid");
        this.appSvc.setLoginBtn(false);
        this.appSvc.setUser(loginDetails.username)
        this.router.navigate(['/checklist']).then(()=>{
          this.authService.userLoggedIn.emit(data);
        });
      },
      error: err => {
        this.errorMessage = err.error.message;
        this.isLoginFailed = true;
        if (err instanceof HttpErrorResponse){
                if (err.status == 401){
                  console.info("logged a 401 error response")
                  sessionStorage.setItem(
                    'invalid', 'true'
                  );
                  this.router.navigate(['/login']).then(()=>{window.location.reload()})
                }
      
              }
      }
    })
    this.subscriptions.add(sub)
  }
}
