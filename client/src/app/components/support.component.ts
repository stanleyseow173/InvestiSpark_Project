import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ComponentscustomSnackbarComponent } from 'app/componentscustom-snackbar/componentscustom-snackbar.component';
import { render } from 'creditcardpayments/creditCardPayments';

@Component({
  selector: 'app-support',
  templateUrl: './support.component.html',
  styleUrls: ['./support.component.css']
})
export class SupportComponent implements OnInit{

  constructor(private readonly snackBar: MatSnackBar){

  }

  ngOnInit(){
    var body = document.getElementsByTagName('body')[0];
    body.classList.add('landing-page');
    var navbar = document.getElementsByTagName('nav')[0];
    navbar.classList.add('navbar-transparent');

    render(
      {
        id: "#myPaypalButtons",
        currency: "SGD",
        value: "10.00",
        onApprove: (details) => {
          this.loadGreenSnackBar('Thank you for your contribution!')
          //alert("Transaction Successful");
        }
      }
    )
  }

  loadGreenSnackBar(message){
    this.snackBar.openFromComponent(ComponentscustomSnackbarComponent,{
      duration: 3000,
      verticalPosition: 'bottom',
      panelClass: 'custom-snackbar',
      data: {
        title: 'Transaction Successful!',
        message: message
      }
    })
  }

  ngOnDestroy(){
    var body = document.getElementsByTagName('body')[0];
    body.classList.remove('login-page');

    var navbar = document.getElementsByTagName('nav')[0];
    navbar.classList.remove('navbar-transparent');
  }
}
