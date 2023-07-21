import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'app/_services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ComponentscustomSnackbarComponent } from 'app/componentscustom-snackbar/componentscustom-snackbar.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit{

  model: any = {};

  data : Date = new Date();
  focus: any;
  focus1: any;
  focus2: any;
  focus3: any;
  focus4: any;

  isSuccessful = false;
  isSignUpFailed = false;
  errorMessage = '';

  private subscriptions: Subscription = new Subscription()

  constructor(
    private router: Router,
    private authService: AuthService,
    private readonly snackBar: MatSnackBar,
  ) { }

  ngOnInit(): void {
    var body = document.getElementsByTagName('body')[0];
    body.classList.add('login-page');

    var navbar = document.getElementsByTagName('nav')[0];
    navbar.classList.add('navbar-transparent');
  }

  

  navigateToLogin():void{
    this.router.navigate(['/login']).then(()=>{
      window.location.reload();
    })
  }

  loadGreenSnackBar(message){
    this.snackBar.openFromComponent(ComponentscustomSnackbarComponent,{
      duration: 3000,
      verticalPosition: 'bottom',
      panelClass: 'custom-snackbar',
      data: {
        title: 'Success',
        message: message
      }
    })
  }

  register() {
    const sub = this.authService.register(this.model.username, this.model.email, this.model.password, this.model.firstname, this.model.lastname).subscribe({
      next: data =>{
        console.log(data);
        this.isSuccessful = true;
        this.isSignUpFailed = false;
        this.loadGreenSnackBar('User registered successfully!')
        this.router.navigate(['/login']).then(()=>{window.location.reload()});
      },
      error:err =>{
        this.errorMessage = err.error.message;
        this.isSignUpFailed = true; 
        alert("Registration failed. Username / Email already exists.")
      }
    })
    this.subscriptions.add(sub)
  }

  ngOnDestroy(){
    var body = document.getElementsByTagName('body')[0];
    body.classList.remove('login-page');

    var navbar = document.getElementsByTagName('nav')[0];
    navbar.classList.remove('navbar-transparent');

    this.subscriptions.unsubscribe()
}
}
