import { Component, Inject, OnDestroy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { WatchlistService } from 'app/_services/watchlist.service';
import { MatSnackBar} from '@angular/material/snack-bar';
import { ComponentscustomSnackbarComponent } from 'app/componentscustom-snackbar/componentscustom-snackbar.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-add-to-watchlist-dialog',
  templateUrl: './add-to-watchlist-dialog.component.html',
  styleUrls: ['./add-to-watchlist-dialog.component.css']
})
export class AddToWatchlistDialogComponent implements OnDestroy{

  private subscriptions: Subscription = new Subscription();

  constructor(
    private watchlistService: WatchlistService,
    private readonly snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<AddToWatchlistDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { email: string, stock: { symbol: string, name: string, buytarget: number, selltarget: number } }) {}
  

  //Load success notification
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

  //add to watchlist function
  addToWatchlist(): void {
   const sub = this.watchlistService.addToWatchlist(this.data.email, this.data.stock)
      .subscribe(response => {
        this.dialogRef.close();
        this.loadGreenSnackBar('Added to watchlist!')
      });
    this.subscriptions.add(sub);
  }
  

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
