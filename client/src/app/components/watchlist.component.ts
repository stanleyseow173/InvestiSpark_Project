import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { GetWatchlist, Watchlist } from 'app/models';
import { StockService } from 'app/_services/stock.service';
import { StorageService } from 'app/_services/storage.service';
import { WatchlistService } from 'app/_services/watchlist.service';
import { MatDialog } from '@angular/material/dialog';
import { AddToWatchlistDialogComponent } from './add-to-watchlist-dialog.component';
import { EmailService } from 'app/_services/email.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ComponentscustomSnackbarComponent } from 'app/componentscustom-snackbar/componentscustom-snackbar.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-watchlist',
  templateUrl: './watchlist.component.html',
  styleUrls: ['./watchlist.component.css']
})
export class WatchlistComponent implements OnInit, OnDestroy{

  isLoading: boolean = true;

  gWatchlist: GetWatchlist;
  hasWatchlist: boolean;

  private subscriptions: Subscription = new Subscription();

  constructor(
    private http: HttpClient, 
    private storageService: StorageService,
    private stockSvc: StockService,
    private watchlistService: WatchlistService,
    public dialog: MatDialog,
    private emailSvc: EmailService,
    private readonly snackBar: MatSnackBar,
    ) { }

  currentUser;

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

  ngOnInit(): void {
    var body = document.getElementsByTagName('body')[0];
    body.classList.add('landing-page');
    var navbar = document.getElementsByTagName('nav')[0];
    navbar.classList.add('navbar-transparent');
    
    this.currentUser = this.storageService.getUser()
    this.getWatchlist();
  }

  

  isPositiveChange(change: string): boolean {
    return parseFloat(change) > 0;
  }

  isPositiveFloat(change: number): boolean{
    return change>0;
  }

  addStocktoWatchlist(stock): void {
    this.dialog.open(AddToWatchlistDialogComponent, {
      width: '50%',
      data: { email: this.currentUser.email, stock: stock }
    });
  }

  deleteStock(stockSymbol):void{
    const sub3 = this.watchlistService.deleteStock(this.currentUser.email, stockSymbol).subscribe(()=>{
      this.getWatchlist()
      this.loadGreenSnackBar('Deleted from watchlist')
    })
    this.subscriptions.add(sub3)
  }

  getWatchlist():void{
    try{
      const sub2 = this.watchlistService.getWatchlist(this.currentUser.email).subscribe({
        next: watchlist=>{
        if(watchlist){
          this.gWatchlist = watchlist;
          this.hasWatchlist = true;
        } else{
          this.hasWatchlist = false;
        }
        this.isLoading = false;
      }, error: (err)=>{
        console.log(err)
        this.isLoading = false;
      }})
      this.subscriptions.add(sub2)
    } catch (e){
      this.isLoading = false;
    }
    
  }

  //calculations for target columns
  filterAndExtractStocks():string{
    let buyfilteredStocks = this.gWatchlist.stocks.filter(stock =>{
      let difference = ((+stock.buytarget - +stock.regularMarketPrice));
      return difference >0 ;
    })

    let sellfilteredStocks = this.gWatchlist.stocks.filter(stock =>{
      let selldifference = ((+stock.regularMarketPrice - +stock.selltarget));
      return selldifference >0 ;
    })

    let buyTableHTML = this.createHTMLTable(buyfilteredStocks, 'Buy Targets Alert');
    let sellTableHTML = this.createHTMLTable(sellfilteredStocks, 'Sell Targets Alert');

    return buyTableHTML + sellTableHTML
  }

  //create html table for stocks
  createHTMLTable(stocks, tableTitle): string {
    let html = `<h2>${tableTitle}</h2><table style="border-collapse: separate; border-spacing: 10px;"><thead><tr><th>Ticker</th><th>Name</th><th>Current Price</th><th>Target</th></tr></thead><tbody>`;
    
    stocks.forEach(stock => {
      html += `<tr><td>${stock.symbol}</td><td>${stock.name}</td><td style="text-align: right;">${stock.regularMarketPrice}</td><td style="text-align: right;">${tableTitle === 'Buy Targets Alert' ? stock.buytarget : stock.selltarget}</td></tr>`;
    });
  
    html += `</tbody></table>`;
    return html;
  }

  notEmpty(text:any):boolean{
    if (text === 0 || text === '' || text === null || text.length < 1){
      return false;
    }
    return true;
  }

  sendEmail(){
    const email={
      toEmail: this.currentUser.email,
      body: this.filterAndExtractStocks(),
      subject: 'Stock Alerts for: '+ this.currentUser.email
    };

    const sub = this.emailSvc.sendEmail(email).subscribe(res=>{
      this.loadGreenSnackBar('Email sent!')
    })
    this.subscriptions.add(sub)
  }

  ngOnDestroy(): void {
    const body = document.getElementsByTagName('body')[0];
    if(body){
      body.classList.remove('landing-page');
    }
    
    var navbar = document.getElementsByTagName('nav')[0];
    if(navbar){
      navbar.classList.remove('navbar-transparent');
    }
    this.subscriptions.unsubscribe()
  }
}
